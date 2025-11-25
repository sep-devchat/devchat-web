import { useEffect, useMemo, useState } from "react";
import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
	Plus,
	RefreshCcw,
	Search as SearchIcon,
	Edit3,
	Trash2,
	RotateCcw,
} from "lucide-react";
import ConfirmModal from "@/components/custom/ConfirmModal/ConfirmModal";
import { InfoButton } from "@/components/custom/ActionButton/InfoButton";
import { SaveButton } from "@/components/custom/ActionButton/SaveButton";
import { CancelButton } from "@/components/custom/ActionButton/CancelButton";
import {
	listReportCategoriesAdmin,
	createReportCategory,
	updateReportCategory,
	deleteReportCategory,
	type ReportCategory,
	type ReportCategoryPayload,
	type ReportCategoryListResponse,
} from "@/services/reportCategoryAPI";
import * as S from "./ReportCategory.styled";

const PAGE_SIZE_OPTIONS = [10, 20, 50];

interface CategoryModalProps {
	isOpen: boolean;
	mode: "create" | "edit";
	initialValues?: ReportCategory | null;
	onClose: () => void;
	onSubmit: (payload: ReportCategoryPayload) => void;
	loading: boolean;
}

const CategoryModal = ({
	isOpen,
	mode,
	initialValues,
	onClose,
	onSubmit,
	loading,
}: CategoryModalProps) => {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [touched, setTouched] = useState(false);

	useEffect(() => {
		if (isOpen) {
			setName(initialValues?.name ?? "");
			setDescription(initialValues?.description ?? "");
			setTouched(false);
		}
	}, [isOpen, initialValues]);

	if (!isOpen) {
		return null;
	}

	const nameError = touched && !name.trim() ? "Name is required" : "";
	const descriptionError =
		touched && !description.trim() ? "Description is required" : "";

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		setTouched(true);
		if (!name.trim() || !description.trim()) {
			return;
		}
		onSubmit({
			name: name.trim(),
			description: description.trim(),
		});
	};

	return (
		<S.ModalOverlay onClick={onClose}>
			<S.ModalCard
				as="form"
				onSubmit={handleSubmit}
				onClick={(event) => event.stopPropagation()}
			>
				<div>
					<S.ModalTitle>
						{mode === "create"
							? "Create report category"
							: "Edit report category"}
					</S.ModalTitle>
					<p style={{ margin: 0, color: "#64748b" }}>
						Provide a clear name and description so reviewers can classify
						reports efficiently.
					</p>
				</div>
				<S.Field>
					<S.Label htmlFor="category-name">Name</S.Label>
					<S.Input
						id="category-name"
						value={name}
						onChange={(event) => setName(event.target.value)}
						placeholder="e.g. Spam / Scam"
						required
					/>
					{nameError && <S.ErrorText>{nameError}</S.ErrorText>}
				</S.Field>
				<S.Field>
					<S.Label htmlFor="category-description">Description</S.Label>
					<S.TextArea
						id="category-description"
						value={description}
						onChange={(event) => setDescription(event.target.value)}
						placeholder="Explain when this category should be used"
						required
					/>
					{descriptionError && <S.ErrorText>{descriptionError}</S.ErrorText>}
				</S.Field>
				<S.ModalActions>
					<CancelButton type="button" onClick={onClose} disabled={loading}>
						Cancel
					</CancelButton>
					<SaveButton type="submit" disabled={loading}>
						{loading
							? "Saving..."
							: mode === "create"
								? "Create"
								: "Save Changes"}
					</SaveButton>
				</S.ModalActions>
			</S.ModalCard>
		</S.ModalOverlay>
	);
};

const getErrorMessage = (error: unknown) => {
	if (!error) return "Something went wrong";
	if (typeof error === "string") return error;
	if (error instanceof Error) return error.message;
	const maybeResponse = error as { response?: { data?: { message?: string } } };
	return maybeResponse?.response?.data?.message ?? "Something went wrong";
};

const ReportCategory = () => {
	const queryClient = useQueryClient();
	const [page, setPage] = useState(1);
	const [take, setTake] = useState(PAGE_SIZE_OPTIONS[0]);
	const [searchTerm, setSearchTerm] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingCategory, setEditingCategory] = useState<ReportCategory | null>(
		null,
	);
	const [deleteTarget, setDeleteTarget] = useState<ReportCategory | null>(null);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(searchTerm.trim());
		}, 350);
		return () => clearTimeout(timer);
	}, [searchTerm]);

	useEffect(() => {
		setPage(1);
	}, [debouncedSearch, take]);

	const categoriesQuery = useQuery<ReportCategoryListResponse>({
		queryKey: ["report-categories", { page, take, search: debouncedSearch }],
		queryFn: async () =>
			await listReportCategoriesAdmin({
				page,
				take,
				search: debouncedSearch || undefined,
			}),
		placeholderData: keepPreviousData,
	});

	const createMutation = useMutation({
		mutationFn: createReportCategory,
		onError: (error) => toast.error(getErrorMessage(error)),
	});

	const updateMutation = useMutation({
		mutationFn: ({
			id,
			payload,
		}: {
			id: string;
			payload: ReportCategoryPayload;
		}) => updateReportCategory(id, payload),
		onError: (error) => toast.error(getErrorMessage(error)),
	});

	const deleteMutation = useMutation({
		mutationFn: (id: string) => deleteReportCategory(id),
		onError: (error) => toast.error(getErrorMessage(error)),
	});

	const categories: ReportCategory[] = categoriesQuery.data?.data ?? [];
	const pagination = categoriesQuery.data?.pagination;
	const totalRecords = pagination?.totalRecord ?? categories.length;
	const totalPages = Math.max(1, pagination?.totalPage ?? 1);
	const pageStart = totalRecords === 0 ? 0 : (page - 1) * take + 1;
	const pageEnd = totalRecords === 0 ? 0 : Math.min(page * take, totalRecords);

	const isInitialLoading = categoriesQuery.isLoading;
	const isRefetching = categoriesQuery.isFetching && !categoriesQuery.isLoading;
	const hasError = categoriesQuery.isError;
	const queryErrorMessage = hasError
		? getErrorMessage(categoriesQuery.error)
		: null;

	const refreshList = () => {
		queryClient.invalidateQueries({ queryKey: ["report-categories"] });
	};

	const handleOpenCreate = () => {
		setEditingCategory(null);
		setIsModalOpen(true);
	};

	const handleOpenEdit = (category: ReportCategory) => {
		setEditingCategory(category);
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setEditingCategory(null);
	};

	const handleSubmitCategory = (payload: ReportCategoryPayload) => {
		if (editingCategory) {
			updateMutation.mutate(
				{ id: editingCategory.id, payload },
				{
					onSuccess: () => {
						toast.success("Report category updated");
						closeModal();
						refreshList();
					},
				},
			);
			return;
		}

		createMutation.mutate(payload, {
			onSuccess: () => {
				toast.success("Report category created");
				closeModal();
				refreshList();
			},
		});
	};

	const handleToggleRemove = (category: ReportCategory) => {
		setDeleteTarget(category);
	};

	const confirmDelete = () => {
		if (!deleteTarget) return;
		const target = deleteTarget;
		const actionVerb = target.isRemoved ? "restored" : "archived";
		deleteMutation.mutate(target.id, {
			onSuccess: (response) => {
				const message =
					response?.message ?? `Category "${target.name}" ${actionVerb}`;
				toast.success(message);
				setDeleteTarget(null);
				refreshList();
			},
		});
	};

	const rows = useMemo<ReportCategory[]>(() => categories, [categories]);
	const isRestoreAction = deleteTarget?.isRemoved ?? false;
	const confirmTitle = isRestoreAction
		? "Restore category"
		: "Archive category";
	const confirmMessage = deleteTarget
		? `Are you sure you want to ${isRestoreAction ? "restore" : "archive"} "${deleteTarget.name}"? Existing reports retain their classification.`
		: "";
	const confirmButtonLabel = deleteMutation.isPending
		? isRestoreAction
			? "Restoring..."
			: "Archiving..."
		: isRestoreAction
			? "Restore"
			: "Archive";

	return (
		<S.PageContainer>
			<S.Panel>
				<S.HeaderRow>
					<S.TitleBlock>
						<S.Title>Report categories</S.Title>
						<S.Subtitle>
							Curate the categories reviewers use to triage abuse and policy
							violations.
						</S.Subtitle>
					</S.TitleBlock>
					<InfoButton type="button" onClick={handleOpenCreate}>
						<Plus size={16} />
						New category
					</InfoButton>
				</S.HeaderRow>
				<S.Toolbar>
					<S.SearchGroup>
						<S.SearchIcon>
							<SearchIcon size={16} />
						</S.SearchIcon>
						<S.SearchInput
							type="search"
							value={searchTerm}
							onChange={(event) => setSearchTerm(event.target.value)}
							placeholder="Search by name or description"
						/>
					</S.SearchGroup>
					<S.Select
						value={take}
						onChange={(event) => setTake(Number(event.target.value))}
					>
						{PAGE_SIZE_OPTIONS.map((option) => (
							<option key={option} value={option}>
								{option} / page
							</option>
						))}
					</S.Select>
					<S.RefreshButton
						type="button"
						onClick={refreshList}
						aria-label="Refresh"
					>
						<RefreshCcw size={16} />
					</S.RefreshButton>
				</S.Toolbar>
			</S.Panel>

			<S.TableCard>
				<S.TableHeader>
					<S.TableTitle>Category list</S.TableTitle>
					<S.TableSubtitle>
						{isRefetching
							? "Refreshing data..."
							: "Review, edit or archive report categories."}
					</S.TableSubtitle>
				</S.TableHeader>
				{isInitialLoading ? (
					<S.LoadingState>Loading categories...</S.LoadingState>
				) : hasError ? (
					<S.ErrorState>
						{queryErrorMessage}
						<br />
						<button
							onClick={refreshList}
							style={{
								marginTop: 12,
								border: "none",
								background: "none",
								color: "#1d4ed8",
								cursor: "pointer",
							}}
						>
							Try again
						</button>
					</S.ErrorState>
				) : rows.length === 0 ? (
					<S.EmptyState>
						No categories found. Try adjusting filters or create a new one.
					</S.EmptyState>
				) : (
					<>
						<S.TableWrapper>
							<S.Table>
								<S.TableHead>
									<tr>
										<S.Th>Name & description</S.Th>
										<S.Th>Status</S.Th>
										<S.Th $align="right">Actions</S.Th>
									</tr>
								</S.TableHead>
								<tbody>
									{rows.map((category) => (
										<S.Tr key={category.id}>
											<S.Td>
												<S.NameCell>{category.name}</S.NameCell>
												<S.DescriptionText>
													{category.description}
												</S.DescriptionText>
											</S.Td>
											<S.Td>
												<S.StatusBadge
													$variant={category.isRemoved ? "removed" : "active"}
												>
													{category.isRemoved ? "Archived" : "Active"}
												</S.StatusBadge>
											</S.Td>
											<S.Td $align="right">
												<S.Actions>
													<S.IconButton
														onClick={() => handleOpenEdit(category)}
														disabled={category.isRemoved}
														aria-label={`Edit ${category.name}`}
													>
														<Edit3 size={16} />
													</S.IconButton>
													<S.IconButton
														$variant={category.isRemoved ? undefined : "danger"}
														onClick={() => handleToggleRemove(category)}
														aria-label={`${category.isRemoved ? "Restore" : "Archive"} ${category.name}`}
													>
														{category.isRemoved ? (
															<RotateCcw size={16} />
														) : (
															<Trash2 size={16} />
														)}
													</S.IconButton>
												</S.Actions>
											</S.Td>
										</S.Tr>
									))}
								</tbody>
							</S.Table>
						</S.TableWrapper>
						<S.PaginationBar>
							<S.PaginationInfo>
								{totalRecords === 0
									? "No records"
									: `Showing ${pageStart}-${pageEnd} of ${totalRecords} categories`}
							</S.PaginationInfo>
							<S.PaginationControls>
								<S.PaginationButton
									onClick={() => setPage((prev) => Math.max(1, prev - 1))}
									disabled={page <= 1}
								>
									Previous
								</S.PaginationButton>
								<S.PaginationButton
									onClick={() =>
										setPage((prev) => Math.min(totalPages, prev + 1))
									}
									disabled={page >= totalPages || totalRecords === 0}
								>
									Next
								</S.PaginationButton>
							</S.PaginationControls>
						</S.PaginationBar>
					</>
				)}
			</S.TableCard>

			<CategoryModal
				isOpen={isModalOpen}
				mode={editingCategory ? "edit" : "create"}
				initialValues={editingCategory}
				onClose={closeModal}
				onSubmit={handleSubmitCategory}
				loading={createMutation.isPending || updateMutation.isPending}
			/>

			<ConfirmModal
				isOpen={Boolean(deleteTarget)}
				title={confirmTitle}
				message={confirmMessage}
				onCancel={() => setDeleteTarget(null)}
				onConfirm={confirmDelete}
				confirmText={confirmButtonLabel}
				isLoading={deleteMutation.isPending}
			/>
		</S.PageContainer>
	);
};

export default ReportCategory;
