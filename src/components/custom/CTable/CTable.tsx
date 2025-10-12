/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHeader,
	TableRow,
	TableHead as TH,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { PageButton } from "./CTable.styled";

export type Align = "left" | "center" | "right";

export interface ColDef {
	field: string; // key in the row data
	headerName: string;
	editable?: boolean;
	align?: Align;
	// optional formatter: receives raw value and full row
	valueFormatter?: (value: any, row?: any) => React.ReactNode | string;
}

export interface DataTableProps {
	columns: ColDef[];
	data: any[];
	// called when user finishes editing a cell
	// IMPORTANT: rowIndex is index in the original `data` array
	onEdit?: (rowIndex: number, field: string, newValue: any) => void;
	// key field used for React keys (optional)
	rowKey?: string; // default: 'id' if available, otherwise index
	caption?: string;

	// Pagination options (optional)
	pagination?: boolean; // default true
	pageSizeOptions?: number[]; // default [5,10,20,50]
	initialPageSize?: number; // default first of pageSizeOptions
	// optional: hide page size selector
	showPageSizeSelector?: boolean;

	// NEW: loading state
	loading?: boolean;

	// Server-side / parent-controlled pagination
	// `page` is 1-based page number. Default = 1
	page?: number; // 1-based page from parent
	onPageChange?: (page: number) => void; // called with 1-based page when user navigates
	totalRows?: number; // total rows on server (required for server-side pagination)
	serverSide?: boolean; // if true, `data` is expected to be the current page's rows
	onPageSizeChange?: (size: number) => void; // notify parent when page size changes
}

export default function CTable({
	columns,
	data,
	onEdit,
	rowKey,
	caption,
	pagination = true,
	pageSizeOptions = [5, 10, 20, 50],
	initialPageSize,
	showPageSizeSelector = true,
	loading = false,
	// server-side props
	page = 1,
	onPageChange,
	totalRows,
	serverSide = false,
	onPageSizeChange,
}: DataTableProps) {
	const [editing, setEditing] = useState<{
		rowIndex: number;
		field: string;
	} | null>(null);
	const [draftValue, setDraftValue] = useState<any>(null);
	const inputRef = useRef<HTMLInputElement | null>(null);

	// Pagination state
	const defaultPageSize = initialPageSize ?? pageSizeOptions[0] ?? 10;
	const [pageSize, setPageSize] = useState<number>(defaultPageSize);
	// internal currentPage is zero-based. Default focused page = 1 (=> index 0)
	const [currentPage, setCurrentPage] = useState<number>(() =>
		Math.max(0, (page ?? 1) - 1),
	);

	useEffect(() => {
		if (editing && inputRef.current) {
			inputRef.current.focus();
			inputRef.current.select();
		}
	}, [editing]);

	// If parent controls `page` (1-based), sync it to internal currentPage
	useEffect(() => {
		if (typeof page === "number") {
			const idx = Math.max(0, page - 1);
			setCurrentPage(idx);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page]);

	// if data length changes and we are client-side, ensure currentPage still valid
	useEffect(() => {
		if (!pagination || serverSide) return;
		const total = data.length;
		// const totalPages = Math.max(1, Math.ceil(total / pageSize));
		const totalPages = total;

		if (currentPage >= totalPages) {
			setCurrentPage(totalPages - 1);
		}
	}, [data.length, pageSize, pagination, currentPage, serverSide]);

	const startEdit = (rowIndex: number, field: string, initialValue: any) => {
		if (loading) return; // disable editing while loading
		setEditing({ rowIndex, field });
		setDraftValue(initialValue ?? "");
	};

	const cancelEdit = () => {
		setEditing(null);
		setDraftValue(null);
	};

	const saveEdit = (rowIndex: number, field: string) => {
		if (onEdit) onEdit(rowIndex, field, draftValue);
		cancelEdit();
	};

	const getAlignClass = (align?: Align) => {
		switch (align) {
			case "center":
				return "text-center";
			case "right":
				return "text-right";
			default:
				return "text-left";
		}
	};

	// totalRowsLocal: use parent-provided totalRows when available (server-side), otherwise derive from data
	const totalRowsLocal =
		typeof totalRows === "number" ? totalRows : data.length;
	const totalPages = totalRowsLocal;
	const clampPage = (p: number) => Math.max(0, Math.min(p, totalPages - 1));

	// pagedData: if serverSide, assume `data` is already the page content; otherwise slice locally
	const pagedData =
		serverSide || !pagination
			? data
			: data.slice(currentPage * pageSize, currentPage * pageSize + pageSize);

	const notifyPageChange = (newIdxZeroBased: number) => {
		const newPage = newIdxZeroBased + 1; // convert to 1-based for parent
		if (onPageChange) {
			onPageChange(newPage);
		} else {
			setCurrentPage(newIdxZeroBased);
		}
	};

	const goFirst = () => notifyPageChange(0);
	const goPrev = () => notifyPageChange(clampPage(currentPage - 1));
	const goNext = () => notifyPageChange(clampPage(currentPage + 1));
	const goLast = () => notifyPageChange(clampPage(totalPages - 1));
	const gotoPage = (p: number) => notifyPageChange(clampPage(p));

	// Render page numbers (simple strategy: show up to 7 page buttons centered)
	const renderPageNumbers = () => {
		const pages: number[] = [];
		const maxButtons = 7;
		const center = currentPage;
		if (totalPages <= maxButtons) {
			for (let i = 0; i < totalPages; i++) pages.push(i);
		} else {
			let start = Math.max(0, center - Math.floor(maxButtons / 2));
			let end = start + maxButtons - 1;
			if (end > totalPages - 1) {
				end = totalPages - 1;
				start = end - (maxButtons - 1);
			}
			for (let i = start; i <= end; i++) pages.push(i);
		}

		return (
			<div className="inline-flex items-center gap-1">
				{pages.map((p) => (
					<PageButton
						key={p}
						onClick={() => gotoPage(p)}
						className={`${p === currentPage ? "focusing" : "non-focus"}`}
						aria-current={p === currentPage ? "page" : undefined}
						title={`Go to page ${p + 1}`}
					>
						{p + 1}
					</PageButton>
				))}
			</div>
		);
	};

	// Skeleton rows count during loading
	const skeletonCount = Math.min(5, pageSize);

	// change page size (notify parent if provided)
	const handlePageSizeChange = (newSize: number) => {
		const firstRowIndex = (currentPage ?? 0) * pageSize;
		const newPage = Math.floor(firstRowIndex / newSize);
		setPageSize(newSize);
		// if parent cares, notify
		if (onPageSizeChange) onPageSizeChange(newSize);
		// navigate to newPage (respecting parent-controlled page if onPageChange exists)
		notifyPageChange(clampPage(newPage));
	};

	return (
		<div className="w-full h-full">
			<Table className="w-full border-collapse overflow-y-auto">
				{caption ? <TableCaption>{caption}</TableCaption> : null}
				<TableHeader>
					<TableRow className="bg-[#f1f4f9]">
						{columns.map((col) => (
							<TH
								key={col.field}
								className={`${getAlignClass(col.align)} font-medium text-sm`}
							>
								{col.headerName}
							</TH>
						))}
					</TableRow>
				</TableHeader>

				<TableBody>
					{/* Loading skeleton */}
					{loading ? (
						<>
							<TableRow>
								<TableCell colSpan={columns.length} className="py-6">
									<div className="flex items-center justify-center gap-4">
										<div
											className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
											aria-hidden
										/>
										<span className="text-sm text-gray-600">Loading...</span>
									</div>
								</TableCell>
							</TableRow>

							{/* skeleton rows */}
							{Array.from({ length: skeletonCount }).map((_, i) => (
								<TableRow key={`skeleton-${i}`} className="bg-white">
									{columns.map((col) => (
										<TableCell
											key={`s-${i}-${col.field}`}
											className={`${getAlignClass(col.align)} align-top`}
										>
											<div className="h-4 rounded bg-gray-200 animate-pulse max-w-[120px]" />
										</TableCell>
									))}
								</TableRow>
							))}
						</>
					) : (
						// Normal rows (not loading)
						<>
							{pagedData.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="py-6 text-center text-sm text-gray-500"
									>
										Không có dữ liệu.
									</TableCell>
								</TableRow>
							) : (
								pagedData.map((row, localIndex) => {
									// dataIndex: index in the full dataset when client-side; otherwise compute approx for keys
									const dataIndex = serverSide
										? currentPage * pageSize + localIndex
										: pagination
											? currentPage * pageSize + localIndex
											: localIndex;
									const isEven = (dataIndex + 1) % 2 === 0; // human-even rows => background #F1F4F9
									return (
										<TableRow
											key={rowKey ? (row[rowKey] ?? dataIndex) : dataIndex}
											className={`${isEven ? "bg-[#F1F4F9]" : "bg-white"} hover:bg-[#e5e7eb]`}
										>
											{columns.map((col) => {
												const cellKey = `${dataIndex}_${col.field}`;
												const rawValue = row?.[col.field];
												const displayValue = col.valueFormatter
													? col.valueFormatter(rawValue, row)
													: (rawValue ?? "");

												const isEditing =
													editing?.rowIndex === dataIndex &&
													editing?.field === col.field;

												return (
													<TableCell
														key={cellKey}
														className={`${getAlignClass(col.align)} align-top whitespace-nowrap max-w-[240px] overflow-hidden text-ellipsis`}
														onDoubleClick={() => {
															if (col.editable)
																startEdit(dataIndex, col.field, rawValue);
														}}
													>
														{isEditing ? (
															<Input
																ref={inputRef}
																value={draftValue ?? ""}
																onChange={(e) => setDraftValue(e.target.value)}
																onBlur={() => saveEdit(dataIndex, col.field)}
																onKeyDown={(e) => {
																	if (e.key === "Enter")
																		saveEdit(dataIndex, col.field);
																	if (e.key === "Escape") cancelEdit();
																}}
																className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
															/>
														) : (
															<div
																className={`py-2 ${col.editable ? "cursor-pointer" : ""}`}
															>
																{displayValue}
															</div>
														)}
													</TableCell>
												);
											})}
										</TableRow>
									);
								})
							)}
						</>
					)}
				</TableBody>
			</Table>

			{/* Pagination controls */}
			{pagination && !loading && totalRowsLocal > 0 && (
				<div className="mt-3 flex items-center justify-between gap-4">
					<div className="flex items-center gap-3 text-sm">
						<div>
							Showing{" "}
							<span className="font-medium">
								{totalRowsLocal === 0 ? 0 : currentPage * pageSize + 1}
							</span>
							{" - "}
							<span className="font-medium">
								{Math.min(
									totalRowsLocal,
									currentPage * pageSize + pagedData.length,
								)}
							</span>
							{" of "}
							<span className="font-medium">{totalRowsLocal}</span>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<div className="inline-flex items-center gap-1">
							<button
								onClick={goFirst}
								disabled={currentPage === 0}
								className="px-2 py-1 rounded border text-sm disabled:opacity-50"
								title="First page"
							>
								«
							</button>
							<button
								onClick={goPrev}
								disabled={currentPage === 0}
								className="px-2 py-1 rounded border text-sm disabled:opacity-50"
								title="Previous page"
							>
								‹
							</button>
						</div>

						{renderPageNumbers()}

						<div className="inline-flex items-center gap-1">
							<button
								onClick={goNext}
								disabled={currentPage >= totalPages - 1}
								className="px-2 py-1 rounded border text-sm disabled:opacity-50"
								title="Next page"
							>
								›
							</button>
							<button
								onClick={goLast}
								disabled={currentPage >= totalPages - 1}
								className="px-2 py-1 rounded border text-sm disabled:opacity-50"
								title="Last page"
							>
								»
							</button>
						</div>

						{showPageSizeSelector && (
							<div className="ml-3">
								<select
									value={pageSize}
									onChange={(e) =>
										handlePageSizeChange(
											Number(e.target.value) || defaultPageSize,
										)
									}
									className="border rounded px-2 py-1 text-sm"
									aria-label="Rows per page"
								>
									{pageSizeOptions.map((opt) => (
										<option key={opt} value={opt}>
											{opt} / page
										</option>
									))}
								</select>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
