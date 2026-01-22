import React, { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createSubscription,
	deleteSubscription,
	duplicateSubscription,
	listSubscriptions,
	CreateSubscriptionPayload,
	type ListSubscriptionsParams,
	Subscription,
	UpdateSubscriptionPayload,
	updateSubscription,
} from "@/services/subscriptionAPI";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Edit3, Search, Ban, Check, Plus, Trash2, Copy } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
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
		action: "toggleStatus" | "delete";
		subscription: Subscription;
		targetIsActive?: boolean;
		title: string;
		description: string;
		confirmText: string;
		confirmVariant: ConfirmModalVariant;
	}>(null);

	const [searchTerm, setSearchTerm] = useState("");

	const [statusFilter, setStatusFilter] = useState<
		"all" | "active" | "inactive"
	>("all");
	const [aiFilter, setAiFilter] = useState<"all" | "on" | "off">("all");
	const [sortBy, setSortBy] = useState<
		"none" | NonNullable<ListSubscriptionsParams["sortBy"]>
	>("none");
	const [sortOrder, setSortOrder] =
		useState<NonNullable<ListSubscriptionsParams["sortOrder"]>>("ASC");

	const { data, isLoading, isError } = useQuery({
		queryKey: ["subscriptions", statusFilter, aiFilter, sortBy, sortOrder],
		queryFn: async () => {
			const params: ListSubscriptionsParams = {};
			if (statusFilter !== "all") params.isActive = statusFilter === "active";
			if (aiFilter !== "all") params.isAIActive = aiFilter === "on";
			if (sortBy !== "none") params.sortBy = sortBy;
			if (sortBy !== "none") params.sortOrder = sortOrder;

			const res = await listSubscriptions(params);
			return res.data ?? [];
		},
	});

	const list = useMemo(() => {
		const base = data ?? [];
		const term = searchTerm.trim().toLowerCase();
		if (!term) return base;
		return base.filter((item) =>
			[item.subscriptionCode, item.subscriptionName]
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

	const statusMut = useMutation({
		mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) =>
			updateSubscription(id, { isActive }),
		onSuccess: (res) => {
			toast.success(res?.message ?? "Updated status");
			queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
			setConfirmState(null);
		},
		onError: (err) =>
			toast.error(getErrorMessage(err, "Failed to update status")),
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

	const duplicateMut = useMutation({
		mutationFn: async (id: string) => duplicateSubscription(id),
		onSuccess: (res) => {
			toast.success(res?.message ?? "Duplicated");
			queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
		},
		onError: (err) =>
			toast.error(getErrorMessage(err, "Failed to duplicate subscription")),
	});

	const openToggleStatusConfirm = (item: Subscription) => {
		const raw = (item as any).isActive;
		const isActive =
			raw === null || typeof raw === "undefined" ? true : Boolean(raw);
		const nextIsActive = !isActive;
		const actionVerb = nextIsActive ? "Enable" : "Disable";
		setConfirmState({
			action: "toggleStatus",
			subscription: item,
			targetIsActive: nextIsActive,
			title: `${actionVerb} subscription`,
			description: nextIsActive
				? `Enable ${item.subscriptionCode}? This allows new purchases again.`
				: `Disable ${item.subscriptionCode}? This keeps the plan in history but prevents new purchases.`,
			confirmText: actionVerb,
			confirmVariant: nextIsActive ? "default" : "danger",
		});
	};

	const openDeleteConfirm = (item: Subscription) => {
		if (item.isAllowDelete === false) return;
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
	const isConfirming = statusMut.isPending || deleteMut.isPending;

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
			min: -1,
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

					<div className="flex flex-wrap items-center gap-2">
						<Select
							value={statusFilter}
							onValueChange={(v) => setStatusFilter(v as any)}
						>
							<SelectTrigger className="h-10 w-[150px]">
								<SelectValue placeholder="Status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All status</SelectItem>
								<SelectItem value="active">Active</SelectItem>
								<SelectItem value="inactive">Disabled</SelectItem>
							</SelectContent>
						</Select>

						<Select
							value={aiFilter}
							onValueChange={(v) => setAiFilter(v as any)}
						>
							<SelectTrigger className="h-10 w-[150px]">
								<SelectValue placeholder="AI" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All AI</SelectItem>
								<SelectItem value="on">AI Active</SelectItem>
								<SelectItem value="off">AI Off</SelectItem>
							</SelectContent>
						</Select>

						<Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
							<SelectTrigger className="h-10 w-[220px]">
								<SelectValue placeholder="Sort by" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="none">No sorting</SelectItem>
								<SelectItem value="limitMembers">Limit users</SelectItem>
								<SelectItem value="runCodePerDay">Run code per day</SelectItem>
								<SelectItem value="programmingLanguageInGroups">
									Programming languages
								</SelectItem>
							</SelectContent>
						</Select>

						<Select
							value={sortOrder}
							onValueChange={(v) => setSortOrder(v as any)}
							disabled={sortBy === "none"}
						>
							<SelectTrigger className="h-10 w-[120px]">
								<SelectValue placeholder="Order" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="ASC">ASC</SelectItem>
								<SelectItem value="DESC">DESC</SelectItem>
							</SelectContent>
						</Select>
					</div>

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
											<S.Td>
												{item.programmingLanguageInGroups < 0
													? "All supported languages in system"
													: item.programmingLanguageInGroups}
											</S.Td>
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
														disabled={duplicateMut.isPending}
														onClick={() => duplicateMut.mutate(item.id)}
														aria-label="Duplicate"
														title="Duplicate"
													>
														<Copy size={16} />
													</S.IconButton>
													<S.IconButton
														$variant={
															(
																(item as any).isActive === null ||
																typeof (item as any).isActive === "undefined"
																	? true
																	: Boolean((item as any).isActive)
															)
																? "danger"
																: "success"
														}
														disabled={statusMut.isPending}
														onClick={() => {
															openToggleStatusConfirm(item);
														}}
														aria-label="Toggle status"
														title={
															(
																(item as any).isActive === null ||
																typeof (item as any).isActive === "undefined"
																	? true
																	: Boolean((item as any).isActive)
															)
																? "Disable"
																: "Enable"
														}
													>
														{(
															(item as any).isActive === null ||
															typeof (item as any).isActive === "undefined"
																? true
																: Boolean((item as any).isActive)
														) ? (
															<Ban size={16} />
														) : (
															<Check size={16} />
														)}
													</S.IconButton>
													<S.IconButton
														$variant="danger"
														disabled={
															deleteMut.isPending ||
															item.isAllowDelete === false
														}
														onClick={() => {
															openDeleteConfirm(item);
														}}
														aria-label="Delete"
														title={
															item.isAllowDelete === false
																? "Cannot delete"
																: "Delete"
														}
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
					if (confirmState.action === "toggleStatus") {
						statusMut.mutate({
							id: confirmState.subscription.id,
							isActive: Boolean(confirmState.targetIsActive),
						});
						return;
					}
					deleteMut.mutate(confirmState.subscription.id);
				}}
			/>
		</S.PageContainer>
	);
};

export default SubscriptionManagement;
