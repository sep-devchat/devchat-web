import React, { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	listSubscriptions,
	Subscription,
	updateSubscription,
} from "@/services/subscriptionAPI";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Edit3, Search } from "lucide-react";
import * as S from "./SubscriptionManagement.styled";

type FormState = {
	price: number;
};

const emptyForm: FormState = {
	price: 0,
};

interface SubscriptionModalProps {
	isOpen: boolean;
	title: string;
	description: string;
	fields: Array<{
		key: keyof FormState;
		label: string;
		placeholder?: string;
		type?: string;
		min?: number;
		required?: boolean;
	}>;
	form: FormState;
	onChange: (key: keyof FormState, value: number) => void;
	onSubmit: (event: React.FormEvent) => void;
	onClose: () => void;
	isSubmitting: boolean;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
	isOpen,
	title,
	description,
	fields,
	form,
	onChange,
	onSubmit,
	onClose,
	isSubmitting,
}) => {
	if (!isOpen) return null;

	return (
		<S.ModalOverlay>
			<S.ModalCard as="form" onSubmit={onSubmit}>
				<div>
					<S.ModalTitle>{title}</S.ModalTitle>
					<p style={{ margin: 0, color: "#64748b" }}>{description}</p>
				</div>
				{fields.map(({ key, label, placeholder, type, min, required }) => (
					<S.Field key={key}>
						<S.Label htmlFor={key}>{label}</S.Label>
						<S.Input
							id={key}
							type={type || "text"}
							value={form[key] as string | number}
							onChange={(e) => onChange(key, Number(e.target.value))}
							placeholder={placeholder}
							min={min ?? undefined}
							required={required}
						/>
					</S.Field>
				))}
				<S.ModalActions>
					<Button variant="outline" type="button" onClick={onClose}>
						Cancel
					</Button>
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting && <Spinner className="mr-2" />}Save
					</Button>
				</S.ModalActions>
			</S.ModalCard>
		</S.ModalOverlay>
	);
};

const SubscriptionManagement: React.FC = () => {
	const queryClient = useQueryClient();
	const [form, setForm] = useState<FormState>(emptyForm);
	const [editingId, setEditingId] = useState<string | null>(null);

	const [searchTerm, setSearchTerm] = useState("");

	const { data, isLoading, isError } = useQuery({
		queryKey: ["subscriptions"],
		queryFn: async () => {
			const res = await listSubscriptions();
			return res.data ?? [];
		},
	});

	const list = useMemo(() => {
		const base = data ?? [];
		const term = searchTerm.trim().toLowerCase();
		if (!term) return base;
		return base.filter((item) =>
			[item.subscriptionCode, item.subscriptionName, item.levelSubscription]
				.filter(Boolean)
				.some((value) => value?.toString().toLowerCase().includes(term)),
		);
	}, [data, searchTerm]);

	const getErrorMessage = (error: unknown, fallback: string) => {
		const resMsg = (error as any)?.response?.data?.message;
		const errMsg = (error as Error)?.message;
		return resMsg || errMsg || fallback;
	};

	const updateMut = useMutation({
		mutationFn: async ({ id, price }: { id: string; price: number }) => {
			return updateSubscription(id, { price });
		},
		onSuccess: (res) => {
			toast.success(res?.message ?? "Price updated");
			queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
			setEditingId(null);
			setForm(emptyForm);
			setDialogOpen(false);
		},
		onError: (err) =>
			toast.error(getErrorMessage(err, "Failed to update price")),
	});

	const handleChange = (field: keyof FormState, value: number) => {
		setForm((prev) => ({ ...prev, [field]: value }));
	};

	const handleEdit = (item: Subscription) => {
		setEditingId(item.id);
		setForm({
			price: item.price,
		});
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!editingId) return;
		const nextPrice = Number(form.price);
		if (!Number.isFinite(nextPrice) || nextPrice < 0) {
			toast.error("Invalid price.");
			return;
		}
		updateMut.mutate({ id: editingId, price: nextPrice });
	};

	useEffect(() => {
		if (!editingId) {
			setForm(emptyForm);
		}
	}, [editingId]);

	const isSubmitting = updateMut.isPending;

	const [dialogOpen, setDialogOpen] = useState(false);

	const openEdit = (item: Subscription) => {
		handleEdit(item);
		setDialogOpen(true);
	};

	const fieldConfigs: Array<{
		key: keyof FormState;
		label: string;
		placeholder?: string;
		type?: string;
		min?: number;
		required?: boolean;
	}> = [
		{
			key: "price",
			label: "Price (VND)",
			type: "number",
			min: 0,
			required: true,
		},
	];

	return (
		<S.PageContainer>
			<S.Panel>
				<S.HeaderRow>
					<S.SearchGroup style={{ flex: 1 }}>
						<S.SearchIcon>
							<Search size={16} />
						</S.SearchIcon>
						<S.SearchInput
							type="search"
							placeholder="Search subscriptions"
							value={searchTerm}
							onChange={(event) => setSearchTerm(event.target.value)}
						/>
					</S.SearchGroup>
				</S.HeaderRow>
			</S.Panel>

			<S.TableCard>
				<S.TableHeader>
					<S.TableTitle>Subscriptions</S.TableTitle>
					<S.TableSubtitle>
						{isLoading
							? "Loading subscriptions..."
							: "Review and manage subscription offerings."}
					</S.TableSubtitle>
				</S.TableHeader>

				{isError ? (
					<S.ErrorState>Failed to load subscriptions.</S.ErrorState>
				) : isLoading ? (
					<S.LoadingState>Loading...</S.LoadingState>
				) : list.length === 0 ? (
					<S.EmptyState>No subscriptions found.</S.EmptyState>
				) : (
					<>
						<S.TableWrapper>
							<S.Table>
								<S.TableHead>
									<tr>
										<S.Th>Code</S.Th>
										<S.Th>Name</S.Th>
										<S.Th>Price (VND)</S.Th>
										<S.Th>Limit Users</S.Th>
										<S.Th>AI</S.Th>
										<S.Th>Run code per day</S.Th>
										<S.Th>Langs</S.Th>
										<S.Th>Level</S.Th>
										<S.Th>Actions</S.Th>
									</tr>
								</S.TableHead>
								<tbody>
									{list.map((item) => (
										<S.Tr key={item.id}>
											<S.Td>
												<S.NameCell>{item.subscriptionCode}</S.NameCell>
											</S.Td>
											<S.Td>{item.subscriptionName}</S.Td>
											<S.Td>{item.price}</S.Td>
											<S.Td>{item.limitMembers}</S.Td>
											<S.Td>
												<S.StatusBadge
													$variant={item.isAIActive ? "active" : "inactive"}
												>
													{item.isAIActive ? "Active" : "Off"}
												</S.StatusBadge>
											</S.Td>
											<S.Td>{item.runCodePerDay}</S.Td>
											<S.Td>{item.programmingLanguageInGroups}</S.Td>
											<S.Td>{item.levelSubscription}</S.Td>
											<S.Td>
												<S.Actions>
													<S.IconButton
														onClick={() => openEdit(item)}
														aria-label="Edit"
													>
														<Edit3 size={16} />
													</S.IconButton>
												</S.Actions>
											</S.Td>
										</S.Tr>
									))}
								</tbody>
							</S.Table>
						</S.TableWrapper>
					</>
				)}
			</S.TableCard>

			<SubscriptionModal
				isOpen={dialogOpen}
				title="Update subscription price"
				description="Only price can be updated. Other fields are fixed."
				fields={fieldConfigs}
				form={form}
				onChange={handleChange}
				onSubmit={(event) => {
					handleSubmit(event);
					if (!isSubmitting) {
						setDialogOpen(false);
					}
				}}
				onClose={() => {
					setDialogOpen(false);
					setEditingId(null);
					setForm(emptyForm);
				}}
				isSubmitting={isSubmitting}
			/>
		</S.PageContainer>
	);
};

export default SubscriptionManagement;
