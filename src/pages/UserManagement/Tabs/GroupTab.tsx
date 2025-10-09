/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
	BanButton,
	ContentArea,
	ContentHeader,
	Divider,
} from "../UserManagement.styled";
import CTable, { ColDef } from "@/components/custom/CTable/CTable";
import ReportDetailModal from "./ReportDetailModal";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { listGroups, deleteGroup, updateGroup } from "@/services/groupAPI";
import { LockKeyhole, LockKeyholeOpen } from "lucide-react";
import { toast } from "sonner";

// Types (kept same as yours)
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
type GroupRow = {
	id: string | number;
	avatar?: string;
	groupCode: string;
	groupName: string;
	memQuanity: string | number;
	reports?: Report[];
	banned?: boolean;
	isActive?: boolean;
	originalApi?: any;
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
		message: "Sample: group spam quảng cáo trong thread A.",
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

export default function GroupTab() {
	// all data & current page-slice
	const [allGroups, setAllGroups] = useState<GroupRow[]>([]);
	const [rowData, setRowData] = useState<GroupRow[]>([]);

	// modal / selection
	const [reportModalVisible, setReportModalVisible] = useState(false);
	const [activeRowId, setActiveRowId] = useState<string | number | null>(null);
	const [activeReportId, setActiveReportId] = useState<string | number | null>(
		null,
	);

	// loading / paging
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1); // 1-based page in state
	const [limit, setLimit] = useState(10);
	const [totalItems, setTotalItems] = useState(0); // total item count
	const [totalPages, setTotalPages] = useState(1); // total pages (derived)

	const [confirmState, setConfirmState] = useState<{
		open: boolean;
		mode: "ban" | "unban" | null;
		targetId: string | number | null;
	}>({
		open: false,
		mode: null,
		targetId: null,
	});

	// fetch all groups (API doesn't provide useful pagination metadata)
	const fetchAllGroups = async () => {
		setLoading(true);
		try {
			const res = await listGroups();
			const groups = Array.isArray(res) ? res : (res?.data ?? []);
			const mapped: GroupRow[] = groups.map((g: any) => ({
				id: g.id,
				avatar: g.avatar ?? "/images/default-avatar.png",
				groupCode: (g.id && String(g.id).slice(0, 8)) || "G-0000",
				groupName: g.name ?? `Group-${String(g.id).slice(0, 8)}`,
				memQuanity: 0,
				reports: g.reports ?? sampleReports,
				banned: !g.isActive,
				isActive: !!g.isActive,
				originalApi: g,
			}));

			setAllGroups(mapped);

			// compute totals correctly
			const items = mapped.length;
			const pages = Math.max(1, Math.ceil(items / limit));
			setTotalItems(items);
			setTotalPages(pages);

			// ensure current page is valid (clamp)
			const validPage = Math.min(Math.max(1, page), pages);
			if (validPage !== page) setPage(validPage);

			// set displayed slice
			const start = (validPage - 1) * limit;
			setRowData(mapped.slice(start, start + limit));
		} catch (err) {
			console.error("Failed to load groups", err);
			toast.error("Failed to load groups");
		} finally {
			setLoading(false);
		}
	};

	// mount: load once
	useEffect(() => {
		fetchAllGroups();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// recalc slice when allGroups / page / limit change
	useEffect(() => {
		const items = allGroups.length;
		const pages = Math.max(1, Math.ceil(items / limit));
		setTotalItems(items);
		setTotalPages(pages);

		// clamp page if out of range
		if (page > pages) {
			setPage(pages);
			return; // will re-run effect with clamped page
		}

		const start = (page - 1) * limit;
		setRowData(allGroups.slice(start, start + limit));
	}, [allGroups, page, limit]);

	const handleLimitItem = (size: number) => {
		setLimit(size);
		setPage(1); // reset to first page
	};

	// Called by CTable when an editable cell is saved (rowIndex is index within current page slice)
	const handleEdit = (rowIndex: number, field: string, newValue: any) => {
		const globalIndex = (page - 1) * limit + rowIndex;
		setAllGroups((prev) => {
			const next = [...prev];
			if (!next[globalIndex]) return prev;
			next[globalIndex] = { ...next[globalIndex], [field]: newValue };
			return next;
		});
	};

	const handleOpenReports = (rowId: string | number) => {
		setAllGroups((prev) =>
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
		const row = allGroups.find((r) => r.id === rowId) ?? null;
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
		setAllGroups((prev) =>
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
		const row = allGroups.find((r) => r.id === rowId);
		const rep = row?.reports?.find((x) => x.id === reportId);
		if (!rep) return;
		updateReport(rowId, reportId, { read: !rep.read });
	};

	const deleteSingleReport = (
		rowId: string | number,
		reportId: string | number,
	) => {
		setAllGroups((prev) =>
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

	const markAllReportsRead = (rowId: string | number) => {
		setAllGroups((prev) =>
			prev.map((r) =>
				r.id === rowId
					? {
							...r,
							reports: r.reports?.map((rep) => ({ ...rep, read: true })) ?? [],
						}
					: r,
			),
		);
	};

	const openConfirm = (mode: "ban" | "unban", id: string | number) => {
		setConfirmState({ open: true, mode, targetId: id });
	};

	const closeConfirm = () =>
		setConfirmState({ open: false, mode: null, targetId: null });

	const performBan = async (id: string | number) => {
		try {
			await deleteGroup(String(id));
			setAllGroups((prev) => prev.filter((r) => r.id !== id));
			toast.success("Group banned (deleted) successfully");
			// no need to call fetchAllGroups — slice will update via useEffect
		} catch (err) {
			console.error("Failed to delete/ban group", err);
			toast.error("Failed to ban group");
		} finally {
			closeConfirm();
		}
	};

	const performUnban = async (id: string | number) => {
		try {
			const grp = allGroups.find((r) => r.id === id);
			if (!grp) throw new Error("Group not found");
			await updateGroup(String(id), {
				name: grp.groupName,
				description: grp.originalApi?.description ?? null,
				avatar: grp.avatar ?? null,
			} as any);
			setAllGroups((prev) =>
				prev.map((r) =>
					r.id === id ? { ...r, isActive: true, banned: false } : r,
				),
			);
			toast.success("Group unbanned successfully");
		} catch (err) {
			console.error("Failed to unban group", err);
			toast.error("Failed to unban group");
		} finally {
			closeConfirm();
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
			valueFormatter: (value: any, row?: GroupRow) => (
				<img
					src={value || "/images/default-avatar.png"}
					alt={row?.groupName ?? "avatar"}
					className="w-8 h-8 rounded-full object-cover inline-block"
				/>
			),
		},
		{
			field: "groupCode",
			headerName: "Group Code",
			editable: false,
			align: "left",
		},
		{
			field: "groupName",
			headerName: "Group Name",
			editable: false,
			align: "left",
		},
		{
			field: "memQuanity",
			headerName: "Member quantity",
			editable: false,
			align: "left",
		},
		{
			field: "reports",
			headerName: "Reports",
			editable: false,
			align: "center",
			valueFormatter: (_value: any, row?: GroupRow) => {
				const reports = row?.reports ?? [];
				const count = reports.length;
				if (count === 0)
					return <span className="text-gray-400 text-sm">—</span>;
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
						{hasUnread && (
							<span
								className="inline-block w-2 h-2 rounded-full"
								style={{ backgroundColor: "red" }}
								aria-hidden
								title="Unread reports"
							/>
						)}
					</a>
				);
			},
		},
		{
			field: "action",
			headerName: "Ban",
			editable: false,
			align: "center",
			valueFormatter: (_value: any, row?: GroupRow) => {
				const banned = !!row?.banned;
				const isActive = row?.isActive ?? !banned;
				if (isActive) {
					return (
						<BanButton
							onClick={(e) => {
								e.preventDefault();
								if (!row) return;
								handleBanClick(row.id);
							}}
							className="ban inline-flex items-center gap-2 px-3 py-1 text-sm rounded-md focus:outline-none"
							title="Ban group (delete)"
						>
							<LockKeyhole size={12} /> Ban
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
							className="unban inline-flex items-center gap-2 px-3 py-1 text-sm rounded-md focus:outline-none"
							title="Unban group"
						>
							<LockKeyholeOpen size={12} /> Unban
						</BanButton>
					);
				}
			},
		},
	];

	const activeRow = activeRowId ? getRowById(activeRowId) : null;

	return (
		<ContentArea>
			<ContentHeader>Group List</ContentHeader>
			<Divider />
			<CTable
				columns={columnDefs}
				data={rowData}
				onEdit={handleEdit}
				rowKey={"id"}
				loading={loading}
				pagination
				serverSide={false}
				page={page}
				onPageChange={(p) => {
					// clamp with totalPages (useful if external table gives invalid value)
					const clamped = Math.min(Math.max(1, p), totalPages);
					setPage(clamped);
				}}
				totalRows={totalItems} // total item count
				initialPageSize={limit}
				onPageSizeChange={(s) => handleLimitItem(s)}
			/>

			<ReportDetailModal
				open={reportModalVisible}
				onOpenChange={(open) => {
					if (!open) handleCloseReportModal();
					else setReportModalVisible(open);
				}}
				row={activeRow ? { ...activeRow, userName: activeRow.groupName } : null}
				activeReportId={activeReportId}
				setActiveReportId={(id) => setActiveReportId(id)}
				updateReport={updateReport}
				toggleSingleReportRead={toggleSingleReportRead}
				deleteSingleReport={deleteSingleReport}
				markAllReportsRead={(rowId) => markAllReportsRead(rowId)}
			/>

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
								? "Bạn có chắc chắn muốn khóa (xóa) group này? Hành động không thể hoàn tác."
								: "Bạn có chắc chắn muốn mở khóa group này?"}
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

	function getRowById(id: string | number): GroupRow | null {
		return allGroups.find((r) => r.id === id) ?? null;
	}
}
