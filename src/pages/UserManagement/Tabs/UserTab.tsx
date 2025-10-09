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
import { deleteUser, listUsers, updateUser } from "@/services/userAPI";
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
					avatar: u.avatarUrl ?? "/images/default-avatar.png",
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
			// note: adjust these fields based on your API shape
			setTotal(res?.pagination?.totalPage ?? res?.pagination?.total ?? 0);
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

	const handleOpenReports = (rowId: string | number) => {
		setRowData((prev) =>
			prev.map((r) =>
				r.id === rowId
					? {
							...r,
							reports: r.reports?.map((rep) => ({ ...rep, read: true })) ?? [],
						}
					: r,
			),
		);
		setActiveRowId(rowId);
		const row = rowData.find((r) => r.id === rowId) ?? null;
		setActiveReportId(
			row?.reports && row.reports.length > 0 ? row.reports[0].id : null,
		);
		setReportModalVisible(true);
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
	// const getReportById = (row: Row | null, reportId: string | number | null) =>
	//   row?.reports?.find((rep) => rep.id === reportId) ?? null;

	const openConfirm = (mode: "ban" | "unban", id: string | number) => {
		setConfirmState({ open: true, mode, targetId: id });
	};

	const closeConfirm = () =>
		setConfirmState({ open: false, mode: null, targetId: null });

	const performBan = async (id: string | number) => {
		try {
			await deleteUser(String(id));
			setRowData((prev) => prev.filter((r) => r.id !== id));
			toast.success("User banned (deleted) successfully");
			fetchData();
		} catch (err) {
			console.error("Failed to delete/ban user", err);
			toast.error("Failed to ban user");
		} finally {
			closeConfirm();
		}
	};

	const performUnban = async (id: string | number) => {
		try {
			const user = rowData.find((r) => r.id === id);
			if (!user) throw new Error("User not found");
			await updateUser(String(id), {
				username: user.userCode,
				email: user.email ?? "",
				firstName: user.originalApi?.firstName ?? "",
				lastName: user.originalApi?.lastName ?? "",
				avatarUrl: user.avatar ?? "",
				isActive: true,
			});
			setRowData((prev) =>
				prev.map((r) =>
					r.id === id ? { ...r, isActive: true, banned: false } : r,
				),
			);
			toast.success("User unbanned successfully");
			fetchData();
		} catch (err) {
			console.error("Failed to unban user", err);
		}
	};

	const handleBanClick = (id: string | number) => openConfirm("ban", id);
	const handleUnbanClick = (id: string | number) => openConfirm("unban", id);

	const columnDefs: ColDef[] = [
		{
			field: "avatar",
			headerName: "Avatar",
			editable: false,
			align: "center",
			valueFormatter: (value: any, row?: Row) => {
				const src = value || "/images/default-avatar.png";
				return (
					<img
						src={src}
						alt={row?.userName ?? "avatar"}
						className="w-8 h-8 rounded-full object-cover inline-block"
					/>
				);
			},
		},
		{
			field: "userCode",
			headerName: "User Code",
			editable: false,
			align: "left",
		},
		{
			field: "userName",
			headerName: "User Name",
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
			field: "reports",
			headerName: "Reports",
			editable: false,
			align: "center",
			valueFormatter: (_value: any, row?: Row) => {
				const reports = row?.reports ?? [];
				const count = reports.length;
				if (count === 0) {
					return <span className="text-gray-400 text-sm">—</span>;
				}
				const hasUnread = reports.some((r) => !r.read);
				return (
					<a
						href="#"
						onClick={(e) => {
							e.preventDefault();
							if (!row) return;
							handleOpenReports(row.id);
						}}
						className="text-blue-600 underline text-sm inline-flex items-center gap-2"
					>
						<span>Detail ({count})</span>
						{hasUnread ? (
							<span
								className="inline-block w-2 h-2 rounded-full"
								style={{ backgroundColor: "red" }}
								aria-hidden
								title="Unread reports"
							/>
						) : null}
					</a>
				);
			},
		},
		{
			field: "action",
			headerName: "Action",
			editable: false,
			align: "center",
			valueFormatter: (_value: any, row?: Row) => {
				if (!row) return null;
				const isActive = row.isActive ?? true;
				// isActive = true -> show Ban; isActive = false -> show Unban
				if (isActive) {
					return (
						<BanButton
							onClick={(e) => {
								e.preventDefault();
								if (!row) return;
								handleBanClick(row.id);
							}}
							// className={`inline-flex items-center gap-2 px-3 py-1 text-sm rounded-md focus:outline-none bg-red-100 text-red-600`}
							className="ban"
							title="Ban user (delete)"
						>
							<LockKeyhole size={12} />
							Ban
						</BanButton>
					);
				} else {
					return (
						<BanButton
							onClick={(e) => {
								e.preventDefault();
								if (!row) return;
								handleUnbanClick(row.id);
							}}
							// className={`inline-flex items-center gap-2 px-3 py-1 text-sm rounded-md focus:outline-none bg-green-100 text-green-700`}
							className="unban"
							title="Unban (reactivate) user"
						>
							<LockKeyholeOpen size={12} />
							Unban
						</BanButton>
					);
				}
			},
		},
	];

	const activeRow = activeRowId ? getRowById(activeRowId) : null;
	// const activeReport = getReportById(activeRow, activeReportId);

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
				}} // <-- updated
				totalRows={total}
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
