import React, { useMemo, useState } from "react";
import { Edit3, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";

const Badge: React.FC<{ variant?: string; children: React.ReactNode }> = ({
	variant,
	children,
}) => {
	let bgColor = "#f3f4f6";
	let textColor = "#6b7280";

	switch (variant) {
		case "purple":
			bgColor = "#B54BB333";
			textColor = "#B54BB3";
			break;
		case "blue":
			bgColor = "#608BC133";
			textColor = "#608BC1";
			break;
		case "green":
			bgColor = "#1CCA9333";
			textColor = "#1CCA93";
			break;
		case "yellow":
			bgColor = "#EFB00833";
			textColor = "#EFB008";
			break;
		case "red":
			bgColor = "#D8323233";
			textColor = "#D83232";
			break;
	}

	return (
		<span
			style={{
				display: "inline-block",
				padding: "4px 12px",
				borderRadius: "12px",
				fontSize: "13px",
				fontWeight: "500",
				whiteSpace: "nowrap",
				background: bgColor,
				color: textColor,
			}}
		>
			{children}
		</span>
	);
};

export interface Column {
	key: string;
	label: string;
	width?: string;
	align?: "left" | "center" | "right";
}

export interface RolePermission {
	[key: string]: boolean | string | number | React.ReactNode;
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
}) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);

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

	const getValueColor = (value: string): { bg: string; text: string } => {
		const lowerValue = value.toLowerCase();

		if (lowerValue === "unlimited") return { bg: "#ede9fe", text: "#7c3aed" };
		if (lowerValue.includes("mb") || lowerValue.includes("gb")) {
			if (lowerValue.includes("100")) return { bg: "#ede9fe", text: "#7c3aed" };
			if (lowerValue.includes("50") || lowerValue.includes("10"))
				return { bg: "#dbeafe", text: "#133e87" };
			if (lowerValue.includes("25") || lowerValue.includes("5"))
				return { bg: "#1CCA9333", text: "#1CCA93" };
			if (lowerValue.includes("1")) return { bg: "#fef3c7", text: "#d97706" };
		}

		const numValue = parseInt(lowerValue);
		if (!isNaN(numValue)) {
			if (numValue >= 1000) return { bg: "#ede9fe", text: "#7c3aed" };
			if (numValue >= 500) return { bg: "#dbeafe", text: "#133e87" };
			if (numValue >= 100) return { bg: "#1CCA9333", text: "#1CCA93" };
			return { bg: "#fef3c7", text: "#d97706" };
		}

		return { bg: "#f3f4f6", text: "#6b7280" };
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
			return (
				<span
					style={{
						display: "inline-flex",
						alignItems: "center",
						justifyContent: "center",
						width: "20px",
						height: "20px",
						borderRadius: "50%",
						background: value ? "#1CCA9333" : "#fee2e2",
						color: value ? "#1CCA93" : "#D83232",
						fontSize: "14px",
						fontWeight: "bold",
					}}
				>
					{value ? "✓" : "✕"}
				</span>
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

			const colors = getValueColor(value);
			return (
				<span
					style={{
						display: "inline-block",
						padding: "4px 12px",
						borderRadius: "12px",
						fontSize: "13px",
						fontWeight: "500",
						whiteSpace: "nowrap",
						background: colors.bg,
						color: colors.text,
					}}
				>
					{value}
				</span>
			);
		}

		return value;
	};

	const getBadgeVariant = (value: string): string => {
		const lowerValue = value.toLowerCase();
		if (lowerValue.includes("admin")) return "purple";
		if (lowerValue.includes("moderator")) return "blue";
		if (lowerValue.includes("support")) return "green";
		if (lowerValue.includes("member")) return "yellow";
		if (lowerValue.includes("unlimited")) return "purple";
		if (lowerValue.includes("enabled")) return "green";
		if (lowerValue.includes("disabled")) return "red";
		return "default";
	};

	return (
		<div
			style={{
				background: "white",
				borderRadius: "8px",
				padding: "24px",
				boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
			}}
		>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: "24px",
				}}
			>
				<div>
					<h2
						style={{
							fontSize: "20px",
							fontWeight: "600",
							color: "#1a1a1a",
							margin: "0 0 4px 0",
						}}
					>
						{title}
					</h2>
					{subtitle && (
						<p style={{ fontSize: "14px", color: "#666", margin: "0" }}>
							{subtitle}
						</p>
					)}
				</div>
				{actionButtonText && onActionButtonClick && (
					<button
						onClick={onActionButtonClick}
						style={{
							background: "#133e87",
							color: "white",
							border: "none",
							borderRadius: "6px",
							padding: "10px 16px",
							fontSize: "14px",
							fontWeight: "500",
							cursor: "pointer",
							display: "flex",
							alignItems: "center",
							gap: "6px",
							transition: "background 0.2s",
						}}
						onMouseEnter={(e) => (e.currentTarget.style.background = "#1952b3")}
						onMouseLeave={(e) => (e.currentTarget.style.background = "#133e87")}
					>
						+ {actionButtonText}
					</button>
				)}
			</div>

			{showSearch && (
				<div style={{ marginBottom: "24px", position: "relative" }}>
					<div
						style={{
							position: "relative",
							display: "flex",
							alignItems: "center",
						}}
					>
						<Search
							size={18}
							style={{ position: "absolute", left: "12px", color: "#9ca3af" }}
						/>
						<input
							type="text"
							placeholder="Tìm kiếm theo người dùng, hành động..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							style={{
								width: "100%",
								padding: "10px 12px 10px 38px",
								border: "1px solid #e5e7eb",
								borderRadius: "6px",
								fontSize: "14px",
								outline: "none",
								transition: "border-color 0.2s",
							}}
							onFocus={(e) => (e.target.style.borderColor = "#133e87")}
							onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
						/>
					</div>
				</div>
			)}

			<table
				style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}
			>
				<thead
					style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}
				>
					<tr>
						{columns.map((column) => (
							<th
								key={column.key}
								style={{
									padding: "12px 16px",
									textAlign: column.align || "left",
									fontWeight: "600",
									color: "#6b7280",
									fontSize: "12px",
									textTransform: "uppercase",
									letterSpacing: "0.5px",
									width: column.width || "auto",
								}}
							>
								{column.label}
							</th>
						))}
						{(onEdit || onDelete) && (
							<th
								style={{
									padding: "12px 16px",
									textAlign: "center",
									fontWeight: "600",
									color: "#6b7280",
									fontSize: "12px",
									textTransform: "uppercase",
									letterSpacing: "0.5px",
								}}
							>
								Actions
							</th>
						)}
					</tr>
				</thead>
				<tbody>
					{paginatedData.map((row, rowIndex) => (
						<tr
							key={rowIndex}
							style={{
								borderBottom: "1px solid #f3f4f6",
								transition: "background 0.2s",
							}}
							onMouseEnter={(e) =>
								(e.currentTarget.style.background = "#f9fafb")
							}
							onMouseLeave={(e) =>
								(e.currentTarget.style.background = "transparent")
							}
						>
							{columns.map((column) => (
								<td
									key={`${rowIndex}-${column.key}`}
									style={{
										padding: "16px",
										textAlign: column.align || "left",
										color: "#374151",
										verticalAlign: "middle",
									}}
								>
									{defaultRenderCell(row[column.key], column, row, rowIndex)}
								</td>
							))}
							{(onEdit || onDelete) && (
								<td
									style={{
										padding: "16px",
										textAlign: "center",
										color: "#374151",
										verticalAlign: "middle",
									}}
								>
									<div
										style={{
											display: "flex",
											gap: "8px",
											justifyContent: "center",
										}}
									>
										{onEdit && (
											<button
												onClick={() => onEdit(rowIndex)}
												title="Chỉnh sửa"
												style={{
													background: "transparent",
													border: "none",
													cursor: "pointer",
													padding: "6px",
													borderRadius: "4px",
													display: "inline-flex",
													alignItems: "center",
													justifyContent: "center",
													transition: "background 0.2s",
													color: "#3B82F6",
												}}
												onMouseEnter={(e) =>
													(e.currentTarget.style.background = "#f3f4f6")
												}
												onMouseLeave={(e) =>
													(e.currentTarget.style.background = "transparent")
												}
											>
												<Edit3 size={16} />
											</button>
										)}
										{onDelete && (
											<button
												onClick={() => onDelete(rowIndex)}
												title="Xóa"
												style={{
													background: "transparent",
													border: "none",
													cursor: "pointer",
													padding: "6px",
													borderRadius: "4px",
													display: "inline-flex",
													alignItems: "center",
													justifyContent: "center",
													transition: "background 0.2s",
													color: "#D83232",
												}}
												onMouseEnter={(e) =>
													(e.currentTarget.style.background = "#fee2e2")
												}
												onMouseLeave={(e) =>
													(e.currentTarget.style.background = "transparent")
												}
											>
												<Trash2 size={16} />
											</button>
										)}
									</div>
								</td>
							)}
						</tr>
					))}
				</tbody>
			</table>

			{showPagination && totalPages > 1 && (
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						marginTop: "24px",
					}}
				>
					<p style={{ fontSize: "14px", color: "#666", margin: "0" }}>
						Hiển thị 1-{Math.min(pageSize, filteredData.length)} trong tổng số{" "}
						{filteredData.length} bản ghi
					</p>
					<div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
						<button
							onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
							disabled={currentPage === 1}
							style={{
								padding: "8px 10px",
								border: "1px solid #e5e7eb",
								borderRadius: "6px",
								background: "white",
								cursor: currentPage === 1 ? "not-allowed" : "pointer",
								opacity: currentPage === 1 ? 0.4 : 1,
								transition: "all 0.2s",
								color: "#6b7280",
							}}
							onMouseEnter={(e) => {
								if (currentPage !== 1) {
									e.currentTarget.style.background = "#f3f4f6";
									e.currentTarget.style.borderColor = "#d1d5db";
								}
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.background = "white";
								e.currentTarget.style.borderColor = "#e5e7eb";
							}}
						>
							<ChevronLeft size={18} />
						</button>

						{Array.from({ length: totalPages }, (_, i) => i + 1)
							.slice(
								Math.max(0, currentPage - 2),
								Math.min(totalPages, currentPage + 2),
							)
							.map((page) => (
								<button
									key={page}
									onClick={() => setCurrentPage(page)}
									style={{
										padding: "8px 12px",
										border:
											currentPage === page
												? "1px solid #133e87"
												: "1px solid #e5e7eb",
										borderRadius: "6px",
										background: currentPage === page ? "#133e87" : "white",
										color: currentPage === page ? "white" : "#6b7280",
										cursor: "pointer",
										fontSize: "14px",
										fontWeight: currentPage === page ? "600" : "500",
										minWidth: "36px",
										transition: "all 0.2s",
									}}
									onMouseEnter={(e) => {
										if (currentPage !== page) {
											e.currentTarget.style.background = "#f9fafb";
											e.currentTarget.style.borderColor = "#d1d5db";
										}
									}}
									onMouseLeave={(e) => {
										if (currentPage !== page) {
											e.currentTarget.style.background = "white";
											e.currentTarget.style.borderColor = "#e5e7eb";
										}
									}}
								>
									{page}
								</button>
							))}

						<button
							onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
							disabled={currentPage === totalPages}
							style={{
								padding: "8px 10px",
								border: "1px solid #e5e7eb",
								borderRadius: "6px",
								background: "white",
								cursor: currentPage === totalPages ? "not-allowed" : "pointer",
								opacity: currentPage === totalPages ? 0.4 : 1,
								transition: "all 0.2s",
								color: "#6b7280",
							}}
							onMouseEnter={(e) => {
								if (currentPage !== totalPages) {
									e.currentTarget.style.background = "#f3f4f6";
									e.currentTarget.style.borderColor = "#d1d5db";
								}
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.background = "white";
								e.currentTarget.style.borderColor = "#e5e7eb";
							}}
						>
							<ChevronRight size={18} />
						</button>
					</div>
				</div>
			)}
		</div>
	);
};
