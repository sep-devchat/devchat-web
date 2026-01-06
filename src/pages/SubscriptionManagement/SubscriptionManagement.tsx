import React, { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createSubscription,
	deleteSubscription,
	listSubscriptions,
	CreateSubscriptionPayload,
	Subscription,
	UpdateSubscriptionPayload,
	updateSubscription,
} from "@/services/subscriptionAPI";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Edit3, Search, Ban, Plus, Trash2 } from "lucide-react";
import * as S from "./SubscriptionManagement.styled";
import { formatVnd } from "@/utils/format-currency";
import {
	ConfirmModal,
	SubscriptionModal,
	type SubscriptionFormState as FormState,
	type ConfirmModalVariant,
	type SubscriptionModalProps,
} from "./components";

const emptyForm: FormState = {
	subscriptionCode: "",
	subscriptionName: "",
	price: 0,
	limitMembers: 0,
	isAIActive: false,
	runCodePerDay: 0,
	programmingLanguageInGroups: 0,
	levelSubscription: 1,
	isActive: true,
};
const SubscriptionManagement: React.FC = () => {
	const queryClient = useQueryClient();
	const [form, setForm] = useState<FormState>(emptyForm);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [mode, setMode] = useState<"create" | "edit">("create");
	const [confirmState, setConfirmState] = useState<null | {
		action: "disable" | "delete";
		subscription: Subscription;
		title: string;
		description: string;
		confirmText: string;
		confirmVariant: ConfirmModalVariant;
	}>(null);

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
		mutationFn: async ({
			id,
			payload,
		}: {
			id: string;
			payload: UpdateSubscriptionPayload;
		}) => updateSubscription(id, payload),
		onSuccess: (res) => {
			toast.success(res?.message ?? "Subscription updated");
			queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
			setEditingId(null);
			setForm(emptyForm);
			setDialogOpen(false);
		},
		onError: (err) =>
			toast.error(getErrorMessage(err, "Failed to update subscription")),
	});

	const createMut = useMutation({
		mutationFn: async (payload: CreateSubscriptionPayload) =>
			createSubscription(payload),
		onSuccess: (res) => {
			toast.success(res?.message ?? "Created successfully");
			queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
			setDialogOpen(false);
			setEditingId(null);
			setForm(emptyForm);
		},
		onError: (err) =>
			toast.error(getErrorMessage(err, "Failed to create subscription")),
	});

	const disableMut = useMutation({
		mutationFn: async (id: string) =>
			updateSubscription(id, { isActive: false }),
		onSuccess: (res) => {
			toast.success(res?.message ?? "Disabled");
			queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
			setConfirmState(null);
		},
		onError: (err) => toast.error(getErrorMessage(err, "Failed to disable")),
	});

	const deleteMut = useMutation({
		mutationFn: async (id: string) => deleteSubscription(id),
		onSuccess: (res) => {
			toast.success(res?.message ?? "Deleted");
			queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
			setConfirmState(null);
		},
		onError: (err) => toast.error(getErrorMessage(err, "Failed to delete")),
	});

	const openDisableConfirm = (item: Subscription) => {
		setConfirmState({
			action: "disable",
			subscription: item,
			title: "Disable subscription",
			description: `Disable ${item.subscriptionCode}? This keeps the plan in history but prevents new purchases.`,
			confirmText: "Disable",
			confirmVariant: "danger",
		});
	};

	const openDeleteConfirm = (item: Subscription) => {
		setConfirmState({
			action: "delete",
			subscription: item,
			title: "Delete subscription",
			description: `Delete ${item.subscriptionCode}? This may affect existing group subscriptions.`,
			confirmText: "Delete",
			confirmVariant: "danger",
		});
	};

	const handleChange = (
		field: keyof FormState,
		value: string | number | boolean,
	) => {
		setForm((prev) => ({ ...prev, [field]: value as any }));
	};

	const handleEdit = (item: Subscription) => {
		setEditingId(item.id);
		setForm({
			subscriptionCode: item.subscriptionCode ?? "",
			subscriptionName: item.subscriptionName ?? "",
			price: item.price ?? 0,
			limitMembers: item.limitMembers ?? 0,
			isAIActive: Boolean(item.isAIActive),
			runCodePerDay: item.runCodePerDay ?? 0,
			programmingLanguageInGroups: item.programmingLanguageInGroups ?? 0,
			levelSubscription: item.levelSubscription ?? 1,
			isActive: Boolean((item as any).isActive ?? true),
		});
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const payload: CreateSubscriptionPayload = {
			subscriptionCode: String(form.subscriptionCode || "").trim(),
			subscriptionName: String(form.subscriptionName || "").trim(),
			price: Number(form.price),
			limitMembers: Number(form.limitMembers),
			isAIActive: Boolean(form.isAIActive),
			runCodePerDay: Number(form.runCodePerDay),
			programmingLanguageInGroups: Number(form.programmingLanguageInGroups),
			levelSubscription: Number(form.levelSubscription),
			isActive: Boolean(form.isActive),
		};

		if (!payload.subscriptionCode) {
			toast.error("Subscription code is required.");
			return;
		}
		if (!payload.subscriptionName) {
			toast.error("Subscription name is required.");
			return;
		}
		if (!Number.isFinite(payload.price) || payload.price < 0) {
			toast.error("Invalid price.");
			return;
		}
		if (
			!Number.isFinite(payload.levelSubscription) ||
			payload.levelSubscription < 0
		) {
			toast.error("Invalid level.");
			return;
		}

		if (mode === "create") {
			createMut.mutate(payload);
			return;
		}

		if (!editingId) return;
		updateMut.mutate({ id: editingId, payload });
	};

	useEffect(() => {
		if (!editingId) {
			setForm(emptyForm);
		}
	}, [editingId]);

	const isSubmitting = updateMut.isPending || createMut.isPending;
	const isConfirming = disableMut.isPending || deleteMut.isPending;

	const [dialogOpen, setDialogOpen] = useState(false);

	const openEdit = (item: Subscription) => {
		setMode("edit");
		handleEdit(item);
		setDialogOpen(true);
	};

	const openCreate = () => {
		setMode("create");
		setEditingId(null);
		setForm(emptyForm);
		setDialogOpen(true);
	};

	const fieldConfigs: SubscriptionModalProps["fields"] = [
		{
			key: "subscriptionCode",
			label: "Code",
			placeholder: "SUB_BASIC",
			type: "text",
			required: true,
		},
		{
			key: "subscriptionName",
			label: "Name",
			placeholder: "Basic Plan",
			type: "text",
			required: true,
		},
		{
			key: "price",
			label: "Price (VND)",
			type: "number",
			min: 0,
			required: true,
		},
		{
			key: "limitMembers",
			label: "Limit members",
			type: "number",
			min: 0,
			required: true,
			row: 1,
		},
		{
			key: "runCodePerDay",
			label: "Run code per day",
			type: "number",
			min: 0,
			required: true,
			row: 1,
		},
		{
			key: "programmingLanguageInGroups",
			label: "Programming languages",
			type: "number",
			min: 0,
			required: true,
			row: 1,
		},
		{
			key: "levelSubscription",
			label: "Level",
			type: "number",
			min: 0,
			required: true,
			row: 1,
		},
		{
			key: "isAIActive",
			label: "AI active",
			type: "checkbox",
		},
		{
			key: "isActive",
			label: "Active",
			type: "checkbox",
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

					<Button onClick={openCreate}>
						<Plus size={16} className="mr-2" />
						New subscription
					</Button>
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
										<S.Th>Version</S.Th>
										<S.Th>Price (VND)</S.Th>
										<S.Th>Limit Users</S.Th>
										<S.Th>AI</S.Th>
										<S.Th>Run code per day</S.Th>
										<S.Th>Langs</S.Th>
										<S.Th>Level</S.Th>
										<S.Th>Status</S.Th>
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
											<S.Td>{item.version ?? 1}</S.Td>
											<S.Td>{formatVnd(item.price)}</S.Td>
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
												<S.StatusBadge
													$variant={
														(item as any).isActive === 0 ? "inactive" : "active"
													}
												>
													{(item as any).isActive === 0 ? "Disabled" : "Active"}
												</S.StatusBadge>
											</S.Td>
											<S.Td>
												<S.Actions>
													<S.IconButton
														onClick={() => openEdit(item)}
														aria-label="Edit"
													>
														<Edit3 size={16} />
													</S.IconButton>
													<S.IconButton
														$variant="danger"
														disabled={
															(item as any).isActive === false ||
															disableMut.isPending
														}
														onClick={() => {
															if ((item as any).isActive === false) return;
															openDisableConfirm(item);
														}}
														aria-label="Disable"
														title="Disable"
													>
														<Ban size={16} />
													</S.IconButton>
													<S.IconButton
														$variant="danger"
														disabled={deleteMut.isPending}
														onClick={() => {
															openDeleteConfirm(item);
														}}
														aria-label="Delete"
														title="Delete"
													>
														<Trash2 size={16} />
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
				title={mode === "create" ? "Create subscription" : "Edit subscription"}
				description={
					mode === "create"
						? "Create a new subscription plan and its limits."
						: "Update subscription fields or disable it."
				}
				fields={fieldConfigs}
				form={form}
				onChange={handleChange}
				onSubmit={handleSubmit}
				onClose={() => {
					setDialogOpen(false);
					setEditingId(null);
					setForm(emptyForm);
				}}
				isSubmitting={isSubmitting}
			/>

			<ConfirmModal
				isOpen={confirmState != null}
				title={confirmState?.title ?? ""}
				description={confirmState?.description ?? ""}
				confirmText={confirmState?.confirmText ?? "Confirm"}
				confirmVariant={confirmState?.confirmVariant ?? "default"}
				isConfirming={isConfirming}
				onClose={() => setConfirmState(null)}
				onConfirm={() => {
					if (!confirmState) return;
					if (confirmState.action === "disable") {
						disableMut.mutate(confirmState.subscription.id);
						return;
					}
					deleteMut.mutate(confirmState.subscription.id);
				}}
			/>
		</S.PageContainer>
	);
};

export default SubscriptionManagement;
