import React, { useMemo, useState } from "react";
import { Edit3, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import ConfirmModal from "@/components/custom/ConfirmModal/ConfirmModal";

import {
	TableContainer,
	TableHeader,
	TableTitle,
	TableSubtitle,
	ActionButton,
	SearchWrapper,
	SearchInput,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Badge,
	CellBackgroundSpan,
	CheckIconWrapper,
	CloseIconWrapper,
	ActionGroup,
	IconButton,
	PaginationWrapper,
	PaginationButton,
} from "./TablePermission.styled";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

export interface Column {
	key: string;
	label: string;
	width?: string;
	align?: "left" | "center" | "right";
}

export interface RolePermission {
	[key: string]:
		| boolean
		| string
		| number
		| React.ReactNode
		| File
		| null
		| undefined;
}

export interface TablePermissionProps {
	title: string;
	subtitle?: string;
	columns: Column[];
	data: RolePermission[];
	actionButtonText?: string;
	onActionButtonClick?: () => void;
	onEdit?: (index: number) => void;
	onDelete?: (index: number) => void;
	renderCell?: (
		value: any,
		column: Column,
		rowData: RolePermission,
		rowIndex: number,
	) => React.ReactNode;
	pageSize?: number;
	showSearch?: boolean;
	showPagination?: boolean;
	showCellBackground?: boolean;
	deleteConfirmTitle?: string;
	deleteConfirmMessage?: string | ((rowData: RolePermission) => string);
	deleteConfirmText?: string;
	deleteCancelText?: string;
	isLoading?: boolean;
	deleteActionConfig?: (
		rowData: RolePermission,
		rowIndex: number,
	) => {
		icon?: React.ReactNode;
		variant?: "danger" | "default";
		title?: string;
	};
}

export const TablePermission: React.FC<TablePermissionProps> = ({
	title,
	subtitle,
	columns,
	data,
	actionButtonText,
	onActionButtonClick,
	onEdit,
	onDelete,
	renderCell,
	pageSize = 10,
	showSearch = true,
	showPagination = true,
	showCellBackground = true,
	deleteConfirmTitle = "Confirm Deletion",
	deleteConfirmMessage = "Are you sure you want to delete this item?",
	deleteConfirmText = "Delete",
	deleteCancelText = "Cancel",
	isLoading: isTableLoading = false,
	deleteActionConfig,
}) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
	const [deleteTargetIndex, setDeleteTargetIndex] = useState<number | null>(
		null,
	);
	const [isDeleting, setIsDeleting] = useState(false);

	const filteredData = useMemo(() => {
		if (!searchTerm.trim()) return data;

		const term = searchTerm.toLowerCase();
		return data.filter((row) =>
			Object.values(row).some((value) =>
				String(value).toLowerCase().includes(term),
			),
		);
	}, [data, searchTerm]);

	const totalPages = Math.ceil(filteredData.length / pageSize);
	const paginatedData = useMemo(() => {
		const startIdx = (currentPage - 1) * pageSize;
		return filteredData.slice(startIdx, startIdx + pageSize);
	}, [filteredData, currentPage, pageSize]);

	React.useEffect(() => {
		setCurrentPage(1);
	}, [searchTerm]);

	const totalColumns = columns.length + (onEdit || onDelete ? 1 : 0);

	const getValueVariant = (value: string): string => {
		const lowerValue = value.toLowerCase();

		if (
			lowerValue === "unlimited" ||
			lowerValue.includes("100mb") ||
			parseInt(lowerValue) >= 1000
		)
			return "purple";
		if (
			lowerValue.includes("50mb") ||
			lowerValue.includes("10mb") ||
			parseInt(lowerValue) >= 500
		)
			return "blue";
		if (
			lowerValue.includes("25mb") ||
			lowerValue.includes("5mb") ||
			parseInt(lowerValue) >= 100
		)
			return "green";
		const numValue = parseInt(lowerValue);
		if (
			lowerValue.includes("1mb") ||
			(!isNaN(numValue) && numValue < 100 && numValue > 0)
		)
			return "yellow";

		return "default";
	};

	const getBadgeVariant = (value: string): string => {
		const lowerValue = value.toLowerCase();
		if (lowerValue.includes("admin") || lowerValue.includes("unlimited"))
			return "purple";
		if (lowerValue.includes("moderator")) return "blue";
		if (lowerValue.includes("support") || lowerValue.includes("enabled"))
			return "green";
		if (lowerValue.includes("member")) return "yellow";
		if (lowerValue.includes("disabled")) return "red";

		return "default";
	};

	const defaultRenderCell = (
		value: any,
		column: Column,
		rowData: RolePermission,
		rowIndex: number,
	): React.ReactNode => {
		if (renderCell) {
			const customRender = renderCell(value, column, rowData, rowIndex);
			if (customRender !== undefined) return customRender;
		}

		if (typeof value === "boolean") {
			return value ? (
				<CheckIconWrapper>✓</CheckIconWrapper>
			) : (
				<CloseIconWrapper>✕</CloseIconWrapper>
			);
		}

		if (typeof value === "string") {
			if (
				column.key.includes("role") ||
				column.key.includes("status") ||
				column.key.includes("action")
			) {
				return <Badge variant={getBadgeVariant(value)}>{value}</Badge>;
			}

			if (showCellBackground) {
				return (
					<CellBackgroundSpan variant={getValueVariant(value)}>
						{value}
					</CellBackgroundSpan>
				);
			}

			return value;
		}

		if (value instanceof File) {
			return value.name;
		}

		return value;
	};

	const handleDeleteClick = (rowIndex: number) => {
		const startIdx = (currentPage - 1) * pageSize;
		const actualIndex = startIdx + rowIndex;
		setDeleteTargetIndex(actualIndex);
		setIsConfirmModalOpen(true);
	};

	const handleConfirmDelete = async () => {
		if (deleteTargetIndex === null || !onDelete) return;

		setIsDeleting(true);
		try {
			await onDelete(deleteTargetIndex);

			setIsConfirmModalOpen(false);
			setDeleteTargetIndex(null);
		} catch (error) {
			console.error("Error deleting item:", error);
		} finally {
			setIsDeleting(false);
		}
	};

	const handleCancelDelete = () => {
		setIsConfirmModalOpen(false);
		setDeleteTargetIndex(null);
	};

	const getConfirmMessage = (): string => {
		if (deleteTargetIndex === null) return String(deleteConfirmMessage);

		if (typeof deleteConfirmMessage === "function") {
			const rowData = filteredData[deleteTargetIndex];
			return deleteConfirmMessage(rowData);
		}

		return String(deleteConfirmMessage);
	};

	return (
		<>
			<TableContainer>
				<TableHeader>
					<div>
						<TableTitle>{title}</TableTitle>
						{subtitle && <TableSubtitle>{subtitle}</TableSubtitle>}
					</div>
					{actionButtonText && onActionButtonClick && (
						<ActionButton onClick={onActionButtonClick}>
							+ {actionButtonText}
						</ActionButton>
					)}
				</TableHeader>

				{showSearch && (
					<SearchWrapper>
						<Search size={18} />
						<SearchInput
							type="text"
							placeholder="Search..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</SearchWrapper>
				)}

				<Table>
					<Thead>
						<Tr>
							{columns.map((column) => (
								<Th key={column.key} width={column.width} align={column.align}>
									{column.label}
								</Th>
							))}
							{(onEdit || onDelete) && <Th align="center">Actions</Th>}
						</Tr>
					</Thead>
					<Tbody>
						{isTableLoading || isDeleting ? (
							<Tr>
								<Td
									colSpan={totalColumns}
									align="center"
									style={{ height: "150px" }}
								>
									<LoadingSpinner />
								</Td>
							</Tr>
						) : (
							paginatedData.map((row, rowIndex) => (
								<Tr key={rowIndex}>
									{columns.map((column) => (
										<Td key={`${rowIndex}-${column.key}`} align={column.align}>
											{defaultRenderCell(
												row[column.key],
												column,
												row,
												rowIndex,
											)}
										</Td>
									))}
									{(onEdit || onDelete) && (
										<Td align="center">
											<ActionGroup>
												{onEdit && (
													<IconButton
														onClick={() =>
															onEdit((currentPage - 1) * pageSize + rowIndex)
														}
														title="Edit"
														variant="default"
													>
														<Edit3 size={16} />
													</IconButton>
												)}
												{onDelete &&
													(() => {
														const absoluteIndex =
															(currentPage - 1) * pageSize + rowIndex;
														const deleteConfig = deleteActionConfig
															? deleteActionConfig(row, absoluteIndex)
															: undefined;
														return (
															<IconButton
																onClick={() => handleDeleteClick(rowIndex)}
																title={deleteConfig?.title ?? "Delete"}
																variant={deleteConfig?.variant ?? "danger"}
															>
																{deleteConfig?.icon ?? <Trash2 size={16} />}
															</IconButton>
														);
													})()}
											</ActionGroup>
										</Td>
									)}
								</Tr>
							))
						)}
					</Tbody>
				</Table>

				{showPagination && totalPages > 1 && (
					<PaginationWrapper>
						<p>
							Showing{" "}
							{Math.min((currentPage - 1) * pageSize + 1, filteredData.length)}-
							{Math.min(pageSize * currentPage, filteredData.length)} out of{" "}
							{filteredData.length} records
						</p>
						<div>
							<PaginationButton
								onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
								disabled={currentPage === 1}
								title="Previous Page"
							>
								<ChevronLeft size={18} />
							</PaginationButton>

							{Array.from({ length: totalPages }, (_, i) => i + 1)
								.slice(
									Math.max(0, currentPage - 2),
									Math.min(totalPages, currentPage + 2),
								)
								.map((page) => (
									<PaginationButton
										key={page}
										onClick={() => setCurrentPage(page)}
										$isActive={currentPage === page}
									>
										{page}
									</PaginationButton>
								))}

							<PaginationButton
								onClick={() =>
									setCurrentPage((p) => Math.min(totalPages, p + 1))
								}
								disabled={currentPage === totalPages}
								title="Next Page"
							>
								<ChevronRight size={18} />
							</PaginationButton>
						</div>
					</PaginationWrapper>
				)}
			</TableContainer>

			<ConfirmModal
				isOpen={isConfirmModalOpen}
				title={deleteConfirmTitle}
				message={getConfirmMessage()}
				confirmText={deleteConfirmText}
				cancelText={deleteCancelText}
				onConfirm={handleConfirmDelete}
				onCancel={handleCancelDelete}
				isLoading={isDeleting}
			/>
		</>
	);
};
