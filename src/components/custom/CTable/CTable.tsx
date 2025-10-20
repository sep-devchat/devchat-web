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
import { PageButton, TableArea, TableWrapper } from "./CTable.styled";

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
	onEdit?: (rowIndex: number, field: string, newValue: any) => void;
	rowKey?: string; // default: 'id' if available, otherwise index
	caption?: string;
	pagination?: boolean; // default true
	pageSizeOptions?: number[]; // default [5,10,20,50]
	initialPageSize?: number; // default first of pageSizeOptions
	showPageSizeSelector?: boolean;

	loading?: boolean;

	showPaginationControls?: boolean; // default true

	// server-side control
	page?: number; // 1-based page from parent
	onPageChange?: (page: number) => void; // called with 1-based page when user navigates

	// Prefer these if parent has them:
	totalRows?: number; // totalRecord from API (optional)
	totalPages?: number; // totalPage from API (optional)

	// NEW: pass full API response (optional). If provided we'll try to read pagination.totalPage
	serverResponse?: any;

	serverSide?: boolean; // if true, `data` is expected to be the current page's rows
	onPageSizeChange?: (size: number) => void; // notify parent when page size changes

	// NEW selection props
	rowSelection?: "single" | "multiple"; // if provided, render selection controls
	onSelectionChange?: (rows: any[] | any | null) => void;

	// legacy
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
	totalPages: propTotalPages,
	serverResponse,
	serverSide = false,
	onPageSizeChange,
	showPaginationControls = true,
	// new selection
	rowSelection,
	onSelectionChange,
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

	// Helper: try to read totalPage from serverResponse safely
	const readTotalPageFromResponse = (resp: any): number | undefined => {
		if (!resp) return undefined;
		const p = resp.pagination ?? resp.meta ?? resp.paging ?? resp; // try a few shapes
		if (!p) return undefined;
		const candidates = [
			p.totalPage,
			p.totalPages,
			p.total_page,
			p.total_pages,
			resp.pagination?.totalPage,
			resp.pagination?.totalPages,
		];
		for (const c of candidates) {
			if (typeof c === "number" && !Number.isNaN(c)) return Number(c);
			if (typeof c === "string" && c.trim() !== "" && !Number.isNaN(Number(c)))
				return Number(c);
		}
		return undefined;
	};

	// Determine total pages to render with precedence:
	const totalPagesFromResp = readTotalPageFromResponse(serverResponse);
	const totalPagesCount =
		typeof totalPagesFromResp === "number"
			? Math.max(1, Math.floor(totalPagesFromResp))
			: typeof propTotalPages === "number"
				? Math.max(1, Math.floor(propTotalPages))
				: typeof totalRows === "number"
					? Math.max(1, Math.ceil(totalRows / pageSize))
					: Math.max(
							1,
							Math.ceil(
								(serverSide
									? (serverResponse?.data?.length ?? data.length)
									: data.length) / pageSize,
							),
						);

	// Ensure currentPage valid when totalPagesCount changes
	useEffect(() => {
		if (!pagination) return;
		if (currentPage >= totalPagesCount) {
			const newIdx = Math.max(0, totalPagesCount - 1);
			if (onPageChange) {
				onPageChange(newIdx + 1); // notify parent
			} else {
				setCurrentPage(newIdx);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [totalPagesCount]);

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

	// pagedData: if serverSide, assume `data` is already the page content; otherwise slice locally
	const pagedData =
		serverSide || !pagination
			? data
			: data.slice(currentPage * pageSize, currentPage * pageSize + pageSize);

	const clampPage = (p: number) =>
		Math.max(0, Math.min(p, totalPagesCount - 1));

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
	const goLast = () => notifyPageChange(clampPage(totalPagesCount - 1));
	const gotoPage = (p: number) => notifyPageChange(clampPage(p));

	// Render page numbers with ellipsis similar to screenshot
	const renderPageNumbers = () => {
		if (totalPagesCount <= 7) {
			return (
				<div className="inline-flex items-center gap-1">
					{Array.from({ length: totalPagesCount }).map((_, i) => (
						<PageButton
							key={i}
							onClick={() => gotoPage(i)}
							className={`${i === currentPage ? "focusing" : "non-focus"}`}
							aria-current={i === currentPage ? "page" : undefined}
							title={`Go to page ${i + 1}`}
						>
							{i + 1}
						</PageButton>
					))}
				</div>
			);
		}

		const buttons: React.ReactNode[] = [];

		const pushPage = (i: number) =>
			buttons.push(
				<PageButton
					key={i}
					onClick={() => gotoPage(i)}
					className={`${i === currentPage ? "focusing" : "non-focus"}`}
					aria-current={i === currentPage ? "page" : undefined}
					title={`Go to page ${i + 1}`}
				>
					{i + 1}
				</PageButton>,
			);

		// Always show first
		pushPage(0);

		const leftBound = Math.max(1, currentPage - 1);
		const rightBound = Math.min(totalPagesCount - 2, currentPage + 1);

		if (leftBound > 1) {
			buttons.push(
				<span key="e-left" className="px-2 select-none">
					...
				</span>,
			);
		}

		for (let i = leftBound; i <= rightBound; i++) {
			pushPage(i);
		}

		if (rightBound < totalPagesCount - 2) {
			buttons.push(
				<span key="e-right" className="px-2 select-none">
					...
				</span>,
			);
		}

		// Always show last
		pushPage(totalPagesCount - 1);

		return <div className="inline-flex items-center gap-1">{buttons}</div>;
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

	/* ------------------ Selection logic ------------------ */
	// selectedMap keeps selected rows keyed by keyStr (string of rowKey or index)
	const [selectedMap, setSelectedMap] = useState<Record<string, any>>({});
	const [selectedIdSingle, setSelectedIdSingle] = useState<string | null>(null);

	const getRowKeyString = (r: any, dataIndex: number) => {
		const raw = rowKey ? (r?.[rowKey] ?? dataIndex) : dataIndex;
		return String(raw);
	};

	// toggle single selection
	const selectSingle = (r: any, dataIndex: number) => {
		const k = getRowKeyString(r, dataIndex);
		if (selectedIdSingle === k) {
			setSelectedIdSingle(null);
			if (onSelectionChange) onSelectionChange(null);
		} else {
			setSelectedIdSingle(k);
			setSelectedMap({ [k]: r });
			if (onSelectionChange) onSelectionChange(r);
		}
	};

	// toggle multiple selection for one row
	const toggleMultiple = (r: any, dataIndex: number) => {
		const k = getRowKeyString(r, dataIndex);
		setSelectedMap((prev) => {
			const next = { ...prev };
			if (next[k]) {
				delete next[k];
			} else {
				next[k] = r;
			}
			if (onSelectionChange) onSelectionChange(Object.values(next));
			return next;
		});
	};

	// select/deselect all visible rows
	const toggleSelectAllVisible = (select: boolean) => {
		if (!rowSelection || rowSelection !== "multiple") return;
		if (select) {
			const add: Record<string, any> = { ...selectedMap };
			pagedData.forEach((r, idx) => {
				const k = getRowKeyString(r, currentPage * pageSize + idx);
				add[k] = r;
			});
			setSelectedMap(add);
			if (onSelectionChange) onSelectionChange(Object.values(add));
		} else {
			// remove visible keys from map
			setSelectedMap((prev) => {
				const next = { ...prev };
				pagedData.forEach((r, idx) => {
					const k = getRowKeyString(r, currentPage * pageSize + idx);
					delete next[k];
				});
				if (onSelectionChange) onSelectionChange(Object.values(next));
				return next;
			});
		}
	};

	const allVisibleSelected = (() => {
		if (rowSelection !== "multiple") return false;
		if (pagedData.length === 0) return false;
		return pagedData.every((r, idx) => {
			const k = getRowKeyString(r, currentPage * pageSize + idx);
			return !!selectedMap[k];
		});
	})();

	/* ----------------------------------------------------- */

	return (
		<TableArea>
			<TableWrapper>
				<Table className="w-full h-full border-collapse overflow-y-auto">
					{caption ? <TableCaption>{caption}</TableCaption> : null}
					<TableHeader className="sticky top-0 z-10 bg-[#f1f4f9]">
						<TableRow className="border-none">
							{/* selection header if enabled */}
							{rowSelection === "multiple" ? (
								<TH className="text-center">
									<input
										type="checkbox"
										aria-label="select-all-visible"
										checked={allVisibleSelected}
										onChange={(e) => toggleSelectAllVisible(e.target.checked)}
									/>
								</TH>
							) : rowSelection === "single" ? (
								<TH className="text-center"> </TH>
							) : null}

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
								<TableRow className="border-none">
									<TableCell
										colSpan={columns.length + (rowSelection ? 1 : 0)}
										className="py-6"
									>
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
									<TableRow
										key={`skeleton-${i}`}
										className="bg-white border-none"
									>
										{rowSelection ? (
											<TableCell className="align-baseline">
												<div className="h-4 w-4 rounded bg-gray-200 animate-pulse" />
											</TableCell>
										) : null}
										{columns.map((col) => (
											<TableCell
												key={`s-${i}-${col.field}`}
												className={`${getAlignClass(col.align)} align-baseline`}
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
									<TableRow className="border-none">
										<TableCell
											colSpan={columns.length + (rowSelection ? 1 : 0)}
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
										const rowKeyStr = getRowKeyString(row, dataIndex);

										return (
											<TableRow
												key={rowKey ? (row[rowKey] ?? dataIndex) : dataIndex}
												className={`${isEven ? "bg-[#F1F4F9]" : "bg-white"} hover:bg-[#e5e7eb] border-none`}
											>
												{/* selection cell */}
												{rowSelection === "multiple" ? (
													<TableCell className="text-center align-baseline">
														<input
															type="checkbox"
															checked={!!selectedMap[rowKeyStr]}
															onChange={() => toggleMultiple(row, dataIndex)}
															aria-label={`select-${rowKeyStr}`}
														/>
													</TableCell>
												) : rowSelection === "single" ? (
													<TableCell className="text-center align-baseline">
														<input
															type="radio"
															name="ctable-single-select"
															checked={selectedIdSingle === rowKeyStr}
															onChange={() => selectSingle(row, dataIndex)}
															aria-label={`select-${rowKeyStr}`}
														/>
													</TableCell>
												) : null}

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
															className={`${getAlignClass(col.align)} align-baseline whitespace-nowrap max-w-[240px] overflow-hidden text-ellipsis`}
															onDoubleClick={() => {
																if (col.editable)
																	startEdit(dataIndex, col.field, rawValue);
															}}
														>
															{isEditing ? (
																<Input
																	ref={inputRef}
																	value={draftValue ?? ""}
																	onChange={(e) =>
																		setDraftValue(e.target.value)
																	}
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
			</TableWrapper>
			{/* Pagination controls (same as before) */}
			{showPaginationControls &&
				pagination &&
				!loading &&
				totalPagesCount > 0 && (
					<div className="mt-3 flex items-center justify-between gap-4  shrink-0">
						<div className="flex items-center gap-3 text-sm">
							<div>
								Showing{" "}
								<span className="font-medium">
									{totalRows === 0 ? 0 : currentPage * pageSize + 1}
								</span>
								{" - "}
								<span className="font-medium">
									{Math.min(
										totalRows ?? 0,
										currentPage * pageSize + pagedData.length,
									)}
								</span>
								{" of "}
								<span className="font-medium">{totalRows}</span>
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
									disabled={currentPage >= totalPagesCount - 1}
									className="px-2 py-1 rounded border text-sm disabled:opacity-50"
									title="Next page"
								>
									›
								</button>
								<button
									onClick={goLast}
									disabled={currentPage >= totalPagesCount - 1}
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
		</TableArea>
	);
}
