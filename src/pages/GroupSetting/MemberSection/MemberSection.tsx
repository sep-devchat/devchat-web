/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import CTable from "@/components/custom/CTable/CTable";
import FloatingCard, {
	Action,
} from "@/components/custom/FloatingCardSetting/FloatingCard";
import {
	SectionWrapper,
	TitleArea,
	TitleSection,
} from "../GroupSetting.styled";
import { ContentArea, Avatar } from "./MemberSection.styled";
import { deleteMemberGroup, membersGroup } from "@/services/userGroupAPI";
import { useForm } from "react-hook-form";
import { useParams } from "@tanstack/react-router";
import { useAuth } from "@/hooks";
import { detailGroup } from "@/services/groupAPI";

// shadcn components (adjust import paths if your project uses different aliases)
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";

/**
 * RoleBadge: nhỏ, hiển thị icon/initial + tên role (dùng trong cột Role)
 */
// const RoleBadge: React.FC<{ role?: any }> = ({ role }) => {
// 	if (!role) {
// 		return <span className="text-sm text-gray-500">No role</span>;
// 	}
// 	// show small circle with first letter as icon
// 	const initial = (role.name ?? "").trim()[0]?.toUpperCase() ?? "?";
// 	return (
// 		<div className="inline-flex items-center gap-2">
// 			<span
// 				className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold text-white"
// 				style={{ backgroundColor: "#4f46e5" }}
// 				title={role.name}
// 				aria-hidden
// 			>
// 				{initial}
// 			</span>
// 			<span className="text-sm">{role.name}</span>
// 		</div>
// 	);
// };

export default function MemberSection() {
	const params = useParams({ strict: false }) as { groupId?: string };
	const groupId = params.groupId;
	const { profile } = useAuth();

	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(20);
	const [totalRow, setTotalRow] = useState(0);
	const [rowData, setRowData] = useState<any[]>([]);
	const [allMembersCache, setAllMembersCache] = useState<any[]>([]);
	const [search, setSearch] = useState("");
	const [selectedRows, setSelectedRows] = useState<any[]>([]); // multi-selection
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [roles] = useState<any[] | null>(null);
	const [roleLoading] = useState(false);
	const [isGroupOwner, setIsGroupOwner] = useState(false);

	const {
		formState: { isSubmitting },
	} = useForm({
		defaultValues: {
			name: "",
			description: "",
			privacy: "public",
			avatar: null,
		},
	});

	// fetch group details to determine if current user is owner
	const fetchGroupDetails = useCallback(async () => {
		if (!groupId || !profile?.id) return;
		try {
			const res = await detailGroup(groupId);
			const createdBy = res?.data?.createdBy;
			setIsGroupOwner(createdBy === profile.id);
		} catch (err) {
			console.error("fetch group details failed", err);
			setIsGroupOwner(false);
		}
	}, [groupId, profile?.id]);

	// fetch members
	const fetchData = useCallback(async () => {
		if (!groupId) return;
		try {
			setLoading(true);
			const res = await membersGroup(groupId);
			const members = res?.data ?? [];
			// Filter out current logged-in user
			const filteredMembers = members.filter(
				(member: any) => member.id !== profile?.id,
			);
			setRowData(filteredMembers);
			setAllMembersCache(filteredMembers);
			if (res?.pagination) {
				setTotalRow(res.pagination.total ?? filteredMembers.length);
			} else {
				setTotalRow(filteredMembers.length);
			}
		} catch (err) {
			console.error("fetch members failed", err);
		} finally {
			setLoading(false);
		}
	}, [groupId, profile?.id]);

	useEffect(() => {
		fetchGroupDetails();
	}, [fetchGroupDetails]);

	useEffect(() => {
		fetchData();
	}, [fetchData, profile?.id]);

	// quick client-side search
	useEffect(() => {
		if (!search) {
			setRowData(allMembersCache);
			return;
		}
		const q = search.trim().toLowerCase();
		const filtered = allMembersCache.filter((m) => {
			const fullName = `${m.firstName ?? ""} ${m.lastName ?? ""}`.toLowerCase();
			return (
				(m.username ?? "").toLowerCase().includes(q) ||
				(m.email ?? "").toLowerCase().includes(q) ||
				fullName.includes(q)
			);
		});
		setRowData(filtered);
	}, [search, allMembersCache]);

	// selection handler — handle multiple selections for owners
	const handleSelectionChange = (rows: any[] | any) => {
		if (!rows) {
			setSelectedRows([]);
			return;
		}
		if (Array.isArray(rows)) {
			setSelectedRows(rows);
		} else {
			setSelectedRows([rows]);
		}
	};

	// load roles once when needed
	// const ensureRoles = async () => {
	// 	if (roles) return roles;
	// 	setRoleLoading(true);
	// 	try {
	// 		const res = await listRoleGroup();
	// 		const r = res?.data ?? [];
	// 		setRoles(r);
	// 		return r;
	// 	} catch (err) {
	// 		console.error("load roles failed", err);
	// 		return [];
	// 	} finally {
	// 		setRoleLoading(false);
	// 	}
	// };

	/**
	 * handleAddRole: accepts roleItem or null to remove role.
	 * If roleItem === null => we attempt to remove role (send { role: null })
	 */
	// const handleAddRole = async (userId: string, roleItem: any | null) => {
	// 	if (!groupId) return;
	// 	try {
	// 		setRoleLoading(true);
	// 		await updateRoleMember(groupId, userId, { role: roleItem });
	// 		// optimistic update
	// 		setRowData((prev) =>
	// 			prev.map((r) => (r.id === userId ? { ...r, role: roleItem } : r)),
	// 		);
	// 		if (selectedRow?.id === userId) {
	// 			setSelectedRow((s: any) => (s ? { ...s, role: roleItem } : s));
	// 		}
	// 	} catch (err) {
	// 		console.error("update role failed", err);
	// 	} finally {
	// 		setRoleLoading(false);
	// 	}
	// };

	const confirmDelete = async () => {
		if (!groupId || selectedRows.length === 0) return;
		try {
			setLoading(true);
			// Delete all selected members
			await Promise.all(
				selectedRows.map((member) =>
					deleteMemberGroup(groupId, member.id).catch((err) =>
						console.error(`Failed to delete member ${member.id}:`, err),
					),
				),
			);
			await fetchData();
			setSelectedRows([]);
			setOpenDeleteDialog(false);
		} catch (err) {
			console.error("delete members failed", err);
		} finally {
			setLoading(false);
		}
	};

	const handleCancelDelete = () => {
		setOpenDeleteDialog(false);
	};

	const computeInitials = (name?: string | null) => {
		if (!name || name.trim() === "") return "NA";
		const pieces = name.trim().split(/\s+/).filter(Boolean);
		if (pieces.length === 0) return "NA";
		const initials = pieces
			.map((p) => p[0] ?? "")
			.join("")
			.slice(0, 2)
			.toUpperCase();
		return initials || "NA";
	};

	const AvatarItem: React.FC<{ src?: string | null; name?: string }> = ({
		src,
		name,
	}) => {
		const initials = computeInitials(name);

		return (
			<Avatar title={name ?? "Avatar"}>
				{src && src.trim() ? (
					<img
						src={src}
						alt={name ?? "avatar"}
						style={{ borderRadius: "50%" }}
						onError={(e) => {
							// Fallback to initials if image fails to load
							const target = e.target as HTMLImageElement;
							target.style.display = "none";
						}}
					/>
				) : (
					<span>{initials}</span>
				)}
			</Avatar>
		);
	};

	// --- Updated role column: show role badge + dropdown listing roles from API ---
	const columnDefs: any[] = useMemo(
		() => [
			{
				field: "avatar",
				headerName: "Avatar",
				editable: false,
				align: "center",
				valueFormatter: (_v: any, row?: any) => {
					const src = row?.avatarUrl ?? null;
					const firstName = row?.firstName ?? "";
					const lastName = row?.lastName ?? "";
					const fullName = `${firstName} ${lastName}`.trim();
					return <AvatarItem src={src} name={fullName || "Unknown"} />;
				},
			},
			{
				field: "name",
				headerName: "Name",
				editable: false,
				align: "left",
				valueFormatter: (_v: any, row?: any) =>
					`${row?.firstName ?? ""} ${row?.lastName ?? ""}`.trim(),
			},
			{
				field: "email",
				headerName: "Email",
				editable: false,
				align: "left",
				valueFormatter: (v: any) => v ?? "—",
			},
		],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[roles, roleLoading],
	);

	const actions: Action[] = isGroupOwner
		? [
				// {
				//   key: "assign",
				//   label: "Assign role",
				//   variant: "secondary",
				//   onClick: async () => {
				//     if (selectedRows.length === 0) return;
				//     const loaded = await ensureRoles();
				//     if (!loaded || loaded.length === 0) return;
				//     const names = loaded.map((r: any, idx: number) => `${idx + 1}. ${r.name}`).join("\n");
				//     const choice = window.prompt(`Select role by number:\n${names}`);
				//     if (!choice) return;
				//     const idx = parseInt(choice, 10) - 1;
				//     if (isNaN(idx) || idx < 0 || idx >= loaded.length) return;
				//     const picked = loaded[idx];
				//     await Promise.all(selectedRows.map(member => handleAddRole(member.id, picked)));
				//   },
				//   disabled: selectedRows.length === 0 || isSubmitting,
				// },
				{
					key: "delete",
					label: `Delete (${selectedRows.length})`,
					variant: "destructive",
					onClick: () => setOpenDeleteDialog(true),
					disabled: selectedRows.length === 0 || isSubmitting,
				},
			]
		: [];

	return (
		<SectionWrapper>
			<TitleArea>
				<TitleSection>Members</TitleSection>
			</TitleArea>

			<ContentArea>
				<div className="mb-3 flex items-center gap-3">
					<input
						className="border rounded px-3 py-2 w-64"
						placeholder="Search members by name, username or email..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
					<div className="text-sm text-gray-500">
						Showing {rowData.length} member(s)
					</div>
				</div>

				<CTable
					columns={columnDefs}
					data={rowData}
					onEdit={() => {}}
					rowKey={"id"}
					loading={loading}
					pagination
					serverSide
					page={page}
					onPageChange={(p: number) => {
						setPage(p);
						fetchData();
					}}
					totalRows={totalRow}
					initialPageSize={limit}
					onPageSizeChange={(s: number) => setLimit(s)}
					// Show multiple selection only for group owners
					rowSelection={isGroupOwner ? "multiple" : undefined}
					onSelectionChange={isGroupOwner ? handleSelectionChange : undefined}
				/>
			</ContentArea>

			<FloatingCard
				visible={selectedRows.length > 0 && isGroupOwner}
				message={
					<div>
						<div>
							<strong>{selectedRows.length}</strong> member
							{selectedRows.length !== 1 ? "s" : ""} selected
						</div>
						{/*{selectedRows.length > 0 && (
							<div className="text-xs text-gray-600 mt-1 max-h-32 overflow-y-auto">
								{selectedRows.map((member) => (
									<div key={member.id}>
										{member.firstName} {member.lastName}
									</div>
								))}
							</div>
						)}*/}
					</div>
				}
				actions={actions}
				icon={<></>}
			/>

			<Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Confirm delete</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete{" "}
							<strong>
								{selectedRows.length === 1
									? `${selectedRows[0]?.firstName ?? ""} ${selectedRows[0]?.lastName ?? ""}`
									: `${selectedRows.length} member${selectedRows.length !== 1 ? "s" : ""}`}
							</strong>
							? This action cannot be undone.
						</DialogDescription>
					</DialogHeader>
					{selectedRows.length > 1 && (
						<div className="max-h-64 overflow-y-auto bg-gray-50 p-3 rounded mb-4">
							<div className="text-sm font-semibold mb-2">
								Selected members:
							</div>
							<ul className="text-sm space-y-1">
								{selectedRows.map((member) => (
									<li key={member.id} className="text-gray-700">
										• {member.firstName} {member.lastName} ({member.email})
									</li>
								))}
							</ul>
						</div>
					)}
					<DialogFooter className="flex gap-2">
						<Button variant="ghost" onClick={handleCancelDelete}>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={confirmDelete}
							disabled={isSubmitting || loading}
						>
							{isSubmitting || loading ? "Deleting..." : "Delete"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</SectionWrapper>
	);
}
