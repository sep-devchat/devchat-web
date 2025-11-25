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
} from "@/components/ui/dialog"; // đường import giả định shadcn dialog
import { listUsers, setUserActive } from "@/services/userAPI";
import { LockKeyhole, LockKeyholeOpen } from "lucide-react";
import { toast } from "sonner";
import ReportDetailModal from "./ReportDetailModal";

// Types
type Reporter = {
	id: string | number;
	name: string;
	avatar?: string;
	contact?: string; // email or username
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
	reports?: Report[]; // nhiều report
	banned?: boolean; // deprecated - keep for compatibility
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
	const [page, setPage] = useState(1); // 1-based
	const [limit, setLimit] = useState(10);
	const [total, setTotal] = useState(0);
	const [totalRow, setTotalRow] = useState(0);

	const [confirmState, setConfirmState] = useState<{
		open: boolean;
		mode: "ban" | "unban" | null;
		targetId: string | number | null;
	}>({ open: false, mode: null, targetId: null });

	const fetchData = async (pageParam?: number, limitParam?: number) => {
		const p = pageParam ?? page;
		const l = limitParam ?? limit;

		setLoading(true);
		try {
			const res = await listUsers(p, l);
			const users = Array.isArray(res) ? res : (res?.data ?? []);
			const mapped: Row[] = users.map((u: any) => {
				const userName =
					u.firstName || u.lastName
						? `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim()
						: u.username;
				return {
					id: u.id,
					// keep avatar undefined when not provided so we can render initials
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

	// fetch users on mount
	useEffect(() => {
		fetchData(page, limit);
	}, [page, limit]);

	const handleLimitItem = (size: number) => {
		setLimit(size);
		setPage(1); // navigate to first page when pageSize changes
		fetchData(1, size);
	};

	// Called by CTable when an editable cell is saved
	const handleEdit = (rowIndex: number, field: string, newValue: any) => {
		setRowData((prev) => {
			const next = [...prev];
			next[rowIndex] = { ...next[rowIndex], [field]: newValue };
			return next;
		});
	};

	// const handleOpenReports = (rowId: string | number) => {
	// 	setRowData((prev) =>
	// 		prev.map((r) =>
	// 			r.id === rowId
	// 				? {
	// 						...r,
	// 						reports: r.reports?.map((rep) => ({ ...rep, read: true })) ?? [],
	// 					}
	// 				: r,
	// 		),
	// 	);
	// 	setActiveRowId(rowId);
	// 	const row = rowData.find((r) => r.id === rowId) ?? null;
	// 	setActiveReportId(
	// 		row?.reports && row.reports.length > 0 ? row.reports[0].id : null,
	// 	);
	// 	setReportModalVisible(true);
	// };

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
		// Prevent any admin deactivation
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
		// Deactivate user (soft ban)
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
			setRowData(previous); // rollback
		} finally {
			closeConfirm();
		}
	};

	const performUnban = async (id: string | number) => {
		// Reactivate user
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
			setRowData(previous); // rollback
		} finally {
			closeConfirm();
		}
	};

	const handleBanClick = (id: string | number) => openConfirm("ban", id);
	const handleUnbanClick = (id: string | number) => openConfirm("unban", id);

	// helper to compute initials
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
		// if we have a valid src and it hasn't failed yet, try to render image
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

		// fallback: colored circle with initials
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
				// Admin rows: never show deactivate; if inactive allow activation
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
					fetchData(p, limit);
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

			{/* Confirm dialog (replaces window.confirm) */}
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
								? "Bạn có chắc chắn muốn khóa (xóa) user này? Hành động không thể hoàn tác."
								: "Bạn có chắc chắn muốn mở khóa user này?"}
						</p>
					</div>

					<DialogFooter className="flex justify-end gap-2">
						<button
							className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
							onClick={() =>
								setConfirmState({ open: false, mode: null, targetId: null })
							}
						>
							Cancel
						</button>

						<button
							className={`px-4 py-2 rounded ${confirmState.mode === "ban" ? "bg-red-600 text-white" : "bg-green-600 text-white"}`}
							onClick={async () => {
								const id = confirmState.targetId;
								if (!id) return;
								if (confirmState.mode === "ban") await performBan(id);
								if (confirmState.mode === "unban") await performUnban(id);
							}}
						>
							{confirmState.mode === "ban" ? "Ban" : "Unban"}
						</button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</ContentArea>
	);
}
