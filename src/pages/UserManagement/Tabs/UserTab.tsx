/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
	BanButton,
	ContentArea,
	ContentHeader,
	Divider,
} from "../UserManagement.styled";
import CTable, { ColDef } from "@/components/custom/CTable/CTable";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { listUsers, setUserActive } from "@/services/userAPI";
import { LockKeyhole, LockKeyholeOpen, Search, X } from "lucide-react";
import { toast } from "sonner";
import ReportDetailModal from "./ReportDetailModal";
import { CancelButton } from "@/components/custom/ActionButton/CancelButton";
import { DeleteButton } from "@/components/custom/ActionButton/DeleteButton";
import { SaveButton } from "@/components/custom/ActionButton/SaveButton";

// Types
type Reporter = {
	id: string | number;
	name: string;
	avatar?: string;
	contact?: string;
};

type Report = {
	id: string | number;
	reporter: Reporter;
	message: string;
	originalMessage?: string;
	messageLink?: string;
	attachments?: { id: string | number; name: string; url?: string }[];
	type?: string;
	severity?: "low" | "medium" | "high";
	createdAt: string;
	read?: boolean;
	status?: "open" | "resolved" | "dismissed";
	adminNotes?: string;
};

type Row = {
	id: string | number;
	avatar?: string;
	userCode: string;
	userName: string;
	memQuanity: string | number;
	reports?: Report[];
	banned?: boolean;
	isActive?: boolean;
	email?: string | null;
	[k: string]: any;
};

const sampleReports: Report[] = [
	{
		id: "sample-r-1",
		reporter: {
			id: "u-s1",
			name: "Alice (sample)",
			avatar: "/images/avatar-a.jpg",
			contact: "alice@example.com",
		},
		message: "Sample: user spam quảng cáo trong thread A.",
		originalMessage: "Check out my product: https://spam.example.com ...",
		messageLink: "#/messages/123",
		attachments: [{ id: "a1", name: "screenshot.png", url: "/files/s1.png" }],
		type: "Spam",
		severity: "medium",
		createdAt: new Date().toISOString(),
		read: false,
		status: "open",
		adminNotes: "",
	},
];

export default function UserTab() {
	const [rowData, setRowData] = useState<Row[]>([]);
	const [reportModalVisible, setReportModalVisible] = useState(false);
	const [activeRowId, setActiveRowId] = useState<string | number | null>(null);
	const [activeReportId, setActiveReportId] = useState<string | number | null>(
		null,
	);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [total, setTotal] = useState(0);
	const [totalRow, setTotalRow] = useState(0);
	const [searchTerm, setSearchTerm] = useState("");
	const [searchInput, setSearchInput] = useState("");

	const [confirmState, setConfirmState] = useState<{
		open: boolean;
		mode: "ban" | "unban" | null;
		targetId: string | number | null;
	}>({ open: false, mode: null, targetId: null });

	const fetchData = async (
		pageParam?: number,
		limitParam?: number,
		searchParam?: string,
	) => {
		const p = pageParam ?? page;
		const l = limitParam ?? limit;
		const s = searchParam ?? searchTerm;

		setLoading(true);
		try {
			const res = await listUsers(p, l, s);
			const users = Array.isArray(res) ? res : (res?.data ?? []);
			const mapped: Row[] = users.map((u: any) => {
				const userName =
					u.firstName || u.lastName
						? `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim()
						: u.username;
				return {
					id: u.id,
					avatar: u.avatarUrl ?? null,
					userCode: u.username ?? String(u.id).slice(0, 8),
					userName,
					memQuanity: 0,
					reports: u.reports ?? sampleReports,
					banned: !u.isActive,
					isActive: !!u.isActive,
					email: u.email ?? null,
					originalApi: u,
				};
			});
			setRowData(mapped);
			setTotal(res?.pagination?.totalPage ?? res?.pagination?.total ?? 0);
			setTotalRow(res?.pagination?.totalRecord ?? 0);
		} catch (err) {
			console.error("Failed to load users", err);
			toast.error("Failed to load users");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData(page, limit, searchTerm);
	}, [page, limit, searchTerm]);

	const handleLimitItem = (size: number) => {
		setLimit(size);
		setPage(1);
		fetchData(1, size, searchTerm);
	};

	const handleSearch = () => {
		setSearchTerm(searchInput);
		setPage(1);
	};

	const handleClearSearch = () => {
		setSearchInput("");
		setSearchTerm("");
		setPage(1);
	};

	const handleEdit = (rowIndex: number, field: string, newValue: any) => {
		setRowData((prev) => {
			const next = [...prev];
			next[rowIndex] = { ...next[rowIndex], [field]: newValue };
			return next;
		});
	};

	const handleCloseReportModal = () => {
		setReportModalVisible(false);
		setActiveRowId(null);
		setActiveReportId(null);
	};

	const updateReport = (
		rowId: string | number,
		reportId: string | number,
		patch: Partial<Report>,
	) => {
		setRowData((prev) =>
			prev.map((r) =>
				r.id === rowId
					? {
							...r,
							reports:
								r.reports?.map((rep) =>
									rep.id === reportId ? { ...rep, ...patch } : rep,
								) ?? [],
						}
					: r,
			),
		);
	};

	const toggleSingleReportRead = (
		rowId: string | number,
		reportId: string | number,
	) => {
		const row = rowData.find((r) => r.id === rowId);
		const rep = row?.reports?.find((x) => x.id === reportId);
		if (!rep) return;
		updateReport(rowId, reportId, { read: !rep.read });
	};

	const deleteSingleReport = (
		rowId: string | number,
		reportId: string | number,
	) => {
		setRowData((prev) =>
			prev.map((r) =>
				r.id === rowId
					? {
							...r,
							reports: r.reports?.filter((rep) => rep.id !== reportId) ?? [],
						}
					: r,
			),
		);
		if (activeReportId === reportId) setActiveReportId(null);
	};

	const getRowById = (id: string | number) =>
		rowData.find((r) => r.id === id) ?? null;

	const openConfirm = (mode: "ban" | "unban", id: string | number) => {
		const target = rowData.find((r) => String(r.id) === String(id));
		if (mode === "ban" && target?.originalApi?.isAdmin) {
			toast.warning("Admin accounts cannot be deactivated");
			return;
		}
		setConfirmState({ open: true, mode, targetId: id });
	};

	const closeConfirm = () =>
		setConfirmState({ open: false, mode: null, targetId: null });

	const performBan = async (id: string | number) => {
		const target = rowData.find((r) => String(r.id) === String(id));
		if (target?.originalApi?.isAdmin) {
			toast.warning("Admin accounts cannot be deactivated");
			closeConfirm();
			return;
		}
		const previous = rowData;
		setRowData((prev) =>
			prev.map((r) =>
				r.id === id ? { ...r, isActive: false, banned: true } : r,
			),
		);
		try {
			await setUserActive(String(id), false);
			toast.success("User deactivated successfully");
			fetchData();
		} catch (err) {
			console.error("Failed to deactivate user", err);
			toast.error("Failed to deactivate user");
			setRowData(previous);
		} finally {
			closeConfirm();
		}
	};

	const performUnban = async (id: string | number) => {
		const previous = rowData;
		setRowData((prev) =>
			prev.map((r) =>
				r.id === id ? { ...r, isActive: true, banned: false } : r,
			),
		);
		try {
			await setUserActive(String(id), true);
			toast.success("User activated successfully");
			fetchData();
		} catch (err) {
			console.error("Failed to activate user", err);
			toast.error("Failed to activate user");
			setRowData(previous);
		} finally {
			closeConfirm();
		}
	};

	const handleBanClick = (id: string | number) => openConfirm("ban", id);
	const handleUnbanClick = (id: string | number) => openConfirm("unban", id);

	const computeInitials = (name?: string | null) => {
		if (!name) return "--";
		const pieces = name.trim().split(/\s+/).filter(Boolean);
		if (pieces.length === 0) return "--";
		const initials = pieces
			.map((p) => p[0] ?? "")
			.join("")
			.slice(0, 2)
			.toUpperCase();
		return initials;
	};

	const AvatarItem: React.FC<{ src?: string | null; name?: string }> = ({
		src,
		name,
	}) => {
		const [failed, setFailed] = useState(false);
		const initials = computeInitials(name ?? "");
		if (src && !failed) {
			return (
				<img
					src={src}
					alt={name ?? "avatar"}
					className="w-8 h-8 rounded-full object-cover inline-block"
					onError={() => setFailed(true)}
				/>
			);
		}

		return (
			<span
				className="inline-flex items-center justify-center w-8 h-8 rounded-full font-semibold text-white"
				style={{ backgroundColor: "#8b5cf6" }}
				aria-hidden
				title={name ?? initials}
			>
				{initials}
			</span>
		);
	};

	const columnDefs: ColDef[] = [
		{
			field: "avatar",
			headerName: "Avatar",
			editable: false,
			align: "center",
			valueFormatter: (value: any, row?: Row) => {
				const src = value ?? null;
				return (
					<AvatarItem src={src} name={row?.userName ?? row?.userCode ?? ""} />
				);
			},
		},
		{
			field: "userCode",
			headerName: "Username",
			editable: false,
			align: "left",
		},
		{
			field: "userName",
			headerName: "Full Name",
			editable: false,
			align: "left",
		},
		{
			field: "email",
			headerName: "Email",
			editable: false,
			align: "left",
			valueFormatter: (v: any) => v ?? "—",
		},
		{
			field: "action",
			headerName: "Action",
			editable: false,
			align: "center",
			valueFormatter: (_value: any, row?: Row) => {
				if (!row) return null;
				const isActive = row.isActive ?? true;
				const isAdminRow = !!row.originalApi?.isAdmin;
				if (isAdminRow) {
					if (isActive) {
						return (
							<span
								className="text-xs text-gray-400"
								title="Admin account cannot be deactivated"
							>
								Active (admin)
							</span>
						);
					} else {
						return (
							<BanButton
								onClick={(e) => {
									e.preventDefault();
									handleUnbanClick(row.id);
								}}
								className="unban"
								title="Activate admin account"
							>
								<LockKeyholeOpen size={12} />
								Activate
							</BanButton>
						);
					}
				}
				if (isActive) {
					return (
						<BanButton
							onClick={(e) => {
								e.preventDefault();
								handleBanClick(row.id);
							}}
							className="ban"
							title="Deactivate user"
						>
							<LockKeyhole size={12} />
							Deactivate
						</BanButton>
					);
				}
				return (
					<BanButton
						onClick={(e) => {
							e.preventDefault();
							handleUnbanClick(row.id);
						}}
						className="unban"
						title="Activate user"
					>
						<LockKeyholeOpen size={12} />
						Activate
					</BanButton>
				);
			},
		},
	];

	const activeRow = activeRowId ? getRowById(activeRowId) : null;

	return (
		<ContentArea>
			<ContentHeader>User List</ContentHeader>
			<Divider />

			<div
				style={{
					background: "#fff",
					padding: "0",
					borderRadius: "8px 8px 0 0",
				}}
			>
				<div style={{ display: "flex", gap: "8px" }}>
					<div style={{ position: "relative", flex: 1 }}>
						<input
							type="text"
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									handleSearch();
								}
							}}
							placeholder="Search by username, email, first or last name..."
							style={{
								width: "100%",
								padding: "10px 12px 10px 12px",
								border: "1px solid #e5e7eb",
								borderRadius: "6px",
								outline: "none",
								transition: "all 0.2s",
								fontSize: "14px",
							}}
							onBlur={(e) => {
								e.target.style.boxShadow = "none";
							}}
						/>
						{searchInput && (
							<button
								onClick={handleClearSearch}
								style={{
									position: "absolute",
									right: "12px",
									top: "50%",
									transform: "translateY(-50%)",
									color: "#6b7280",
									background: "none",
									border: "none",
									cursor: "pointer",
									padding: "4px",
									display: "flex",
									alignItems: "center",
									outline: "none",
								}}
								title="Clear search"
								onMouseEnter={(e) => {
									e.currentTarget.style.color = "#133e87";
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.color = "#6b7280";
								}}
							>
								<X size={18} />
							</button>
						)}
					</div>
					<button
						onClick={handleSearch}
						disabled={loading}
						style={{
							padding: "8px 24px",
							background: "#133e87",
							color: "white",
							border: "1px solid #133e87",
							borderRadius: "8px",
							cursor: loading ? "not-allowed" : "pointer",
							display: "flex",
							alignItems: "center",
							gap: "8px",
							transition: "all 0.2s",
							opacity: loading ? 0.6 : 1,
							whiteSpace: "nowrap",
							fontSize: "14px",
							outline: "none",
						}}
						onMouseEnter={(e) => {
							if (!loading) {
								e.currentTarget.style.background = "#1952b3";
								e.currentTarget.style.color = "#fff";
								e.currentTarget.style.border = "1px solid #1952b3";
							}
						}}
						onMouseLeave={(e) => {
							if (!loading) {
								e.currentTarget.style.background = "#133e87";
								e.currentTarget.style.color = "white";
								e.currentTarget.style.border = "1px solid #133e87";
							}
						}}
					>
						<Search size={18} />
						Search
					</button>
				</div>

				{searchTerm && (
					<div
						style={{
							paddingBottom: "16px",
							fontSize: "14px",
							color: "#4b5563",
						}}
					>
						Searching for:{" "}
						<span style={{ fontWeight: 600 }}>"{searchTerm}"</span>
						{totalRow > 0 && (
							<span>
								{" "}
								- Found {totalRow} result{totalRow !== 1 ? "s" : ""}
							</span>
						)}
					</div>
				)}
			</div>

			<CTable
				columns={columnDefs}
				data={rowData}
				onEdit={handleEdit}
				rowKey={"id"}
				loading={loading}
				pagination
				serverSide
				page={page}
				onPageChange={(p) => {
					setPage(p);
					fetchData(p, limit, searchTerm);
				}}
				totalRows={totalRow}
				totalPages={total}
				initialPageSize={limit}
				onPageSizeChange={(s) => handleLimitItem(s)}
			/>

			<ReportDetailModal
				open={reportModalVisible}
				onOpenChange={(open) => {
					if (!open) handleCloseReportModal();
					else setReportModalVisible(open);
				}}
				row={activeRow}
				activeReportId={activeReportId}
				setActiveReportId={(id) => setActiveReportId(id)}
				updateReport={updateReport}
				toggleSingleReportRead={toggleSingleReportRead}
				deleteSingleReport={deleteSingleReport}
				markAllReportsRead={(rowId) => {
					setRowData((prev) =>
						prev.map((r) =>
							r.id === rowId
								? {
										...r,
										reports:
											r.reports?.map((rep) => ({ ...rep, read: true })) ?? [],
									}
								: r,
						),
					);
				}}
			/>

			{/* Confirm dialog */}
			<Dialog
				open={confirmState.open}
				onOpenChange={(open) => {
					if (!open)
						setConfirmState({ open: false, mode: null, targetId: null });
				}}
			>
				<DialogContent className="max-w-md w-full">
					<DialogHeader>
						<DialogTitle>
							{confirmState.mode === "ban" ? "Confirm ban" : "Confirm unban"}
						</DialogTitle>
					</DialogHeader>

					<div className="py-2">
						<p className="text-sm text-gray-700">
							{confirmState.mode === "ban"
								? "Are you sure you want to deactivate this user? This action cannot be undone."
								: "Are you sure you want to activate this user?"}
						</p>
					</div>

					<DialogFooter className="flex justify-end gap-2">
						<CancelButton
							className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
							onClick={() =>
								setConfirmState({ open: false, mode: null, targetId: null })
							}
						>
							Cancel
						</CancelButton>

						{confirmState.mode === "ban" ? (
							<DeleteButton
								onClick={async () => {
									const id = confirmState.targetId;
									if (!id) return;
									await performBan(id);
								}}
							>
								Deactivate
							</DeleteButton>
						) : (
							<SaveButton
								className="px-4 py-2 rounded bg-green-600 text-white"
								onClick={async () => {
									const id = confirmState.targetId;
									if (!id) return;
									await performUnban(id);
								}}
							>
								Activate
							</SaveButton>
						)}
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</ContentArea>
	);
}
