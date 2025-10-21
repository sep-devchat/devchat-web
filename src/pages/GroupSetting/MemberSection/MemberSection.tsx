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
import { ContentArea } from "./MemberSection.styled";
import {
	deleteMemberGroup,
	membersGroup,
	updateRoleMember,
} from "@/services/userGroupAPI";
import { listRoleGroup } from "@/services/roleAPI";
import { useForm } from "react-hook-form";
import { useParams } from "@tanstack/react-router";

// shadcn components (adjust import paths if your project uses different aliases)
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
const RoleBadge: React.FC<{ role?: any }> = ({ role }) => {
	if (!role) {
		return <span className="text-sm text-gray-500">No role</span>;
	}
	// show small circle with first letter as icon
	const initial = (role.name ?? "").trim()[0]?.toUpperCase() ?? "?";
	return (
		<div className="inline-flex items-center gap-2">
			<span
				className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold text-white"
				style={{ backgroundColor: "#4f46e5" }}
				title={role.name}
				aria-hidden
			>
				{initial}
			</span>
			<span className="text-sm">{role.name}</span>
		</div>
	);
};

export default function MemberSection() {
	const params = useParams({ strict: false }) as { groupId?: string };
	const groupId = params.groupId;

	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(20);
	const [totalRow, setTotalRow] = useState(0);
	const [rowData, setRowData] = useState<any[]>([]);
	const [allMembersCache, setAllMembersCache] = useState<any[]>([]);
	const [search, setSearch] = useState("");
	const [selectedRow, setSelectedRow] = useState<any | null>(null); // single selection
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [roles, setRoles] = useState<any[] | null>(null);
	const [roleLoading, setRoleLoading] = useState(false);

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

	// fetch members
	const fetchData = useCallback(
		async (p = 1, l = limit) => {
			if (!groupId) return;
			try {
				setLoading(true);
				const res = await membersGroup(groupId, p, l);
				const members = res?.data ?? [];
				setRowData(members);
				setAllMembersCache(members);
				if (res?.pagination) {
					setTotalRow(res.pagination.total ?? members.length);
				} else {
					setTotalRow(members.length);
				}
			} catch (err) {
				console.error("fetch members failed", err);
			} finally {
				setLoading(false);
			}
		},
		[groupId, limit],
	);

	useEffect(() => {
		fetchData(page, limit);
	}, [fetchData, page, limit]);

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

	// selection handler — normalize to single item
	const handleSelectionChange = (rows: any[] | any) => {
		if (!rows) {
			setSelectedRow(null);
			return;
		}
		if (Array.isArray(rows)) {
			setSelectedRow(rows.length > 0 ? rows[0] : null);
		} else {
			setSelectedRow(rows ?? null);
		}
	};

	// load roles once when needed
	const ensureRoles = async () => {
		if (roles) return roles;
		setRoleLoading(true);
		try {
			const res = await listRoleGroup();
			const r = res?.data ?? [];
			setRoles(r);
			return r;
		} catch (err) {
			console.error("load roles failed", err);
			return [];
		} finally {
			setRoleLoading(false);
		}
	};

	/**
	 * handleAddRole: accepts roleItem or null to remove role.
	 * If roleItem === null => we attempt to remove role (send { role: null })
	 */
	const handleAddRole = async (userId: string, roleItem: any | null) => {
		if (!groupId) return;
		try {
			setRoleLoading(true);
			await updateRoleMember(groupId, userId, { role: roleItem });
			// optimistic update
			setRowData((prev) =>
				prev.map((r) => (r.id === userId ? { ...r, role: roleItem } : r)),
			);
			if (selectedRow?.id === userId) {
				setSelectedRow((s: any) => (s ? { ...s, role: roleItem } : s));
			}
		} catch (err) {
			console.error("update role failed", err);
		} finally {
			setRoleLoading(false);
		}
	};

	const confirmDelete = async () => {
		if (!groupId || !selectedRow) return;
		try {
			setLoading(true);
			await deleteMemberGroup(groupId, { userId: selectedRow.id });
			await fetchData(page, limit);
			setSelectedRow(null);
			setOpenDeleteDialog(false);
		} catch (err) {
			console.error("delete member failed", err);
		} finally {
			setLoading(false);
		}
	};

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

	// --- Updated role column: show role badge + dropdown listing roles from API ---
	const columnDefs: any[] = useMemo(
		() => [
			{
				field: "avatar",
				headerName: "Avatar",
				editable: false,
				align: "center",
				valueFormatter: (row?: any) => {
					const src = row?.avatarUrl ?? null;
					return (
						<AvatarItem
							src={src}
							name={`${row?.firstName ?? ""} ${row?.lastName ?? ""}`}
						/>
					);
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
			{
				field: "role",
				headerName: "Role",
				editable: false,
				align: "center",
				valueFormatter: (_v: any, row?: any) => {
					const currentRole = row?.role ?? null;
					// Dropdown: current role visible + a trigger to open dropdown of available roles
					return (
						<div className="flex items-center gap-2">
							<RoleBadge role={currentRole} />

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										size="sm"
										variant="outline"
										onClick={() => {
											// ensure roles loaded before opening (most UI libs open on click; we preload)
											ensureRoles();
										}}
										aria-label={`change-role-${row?.id}`}
									>
										Manage
									</Button>
								</DropdownMenuTrigger>

								<DropdownMenuContent align="end" className="min-w-[160px]">
									{/* Show loading / no roles */}
									{roleLoading ? (
										<DropdownMenuItem onSelect={() => {}}>
											Loading...
										</DropdownMenuItem>
									) : roles && roles.length > 0 ? (
										<>
											{roles.map((r) => (
												<DropdownMenuItem
													key={r.name ?? r.id}
													onSelect={async () => {
														await handleAddRole(row.id, r);
													}}
												>
													{r.name}
												</DropdownMenuItem>
											))}
											<DropdownMenuItem
												onSelect={async () => await handleAddRole(row.id, null)}
											>
												Remove role
											</DropdownMenuItem>
										</>
									) : (
										<DropdownMenuItem onSelect={() => {}}>
											No roles
										</DropdownMenuItem>
									)}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					);
				},
			},
		],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[roles, roleLoading],
	);

	const actions: Action[] = [
		// {
		//   key: "assign",
		//   label: "Assign role",
		//   variant: "secondary",
		//   onClick: async () => {
		//     if (!selectedRow) return;
		//     const loaded = await ensureRoles();
		//     if (!loaded || loaded.length === 0) return;
		//     const names = loaded.map((r: any, idx: number) => `${idx + 1}. ${r.name}`).join("\n");
		//     const choice = window.prompt(`Select role by number for ${selectedRow.firstName ?? ""} ${selectedRow.lastName ?? ""}:\n${names}`);
		//     if (!choice) return;
		//     const idx = parseInt(choice, 10) - 1;
		//     if (isNaN(idx) || idx < 0 || idx >= loaded.length) return;
		//     const picked = loaded[idx];
		//     await handleAddRole(selectedRow.id, picked);
		//   },
		//   disabled: !selectedRow || isSubmitting,
		// },
		{
			key: "delete",
			label: "Delete",
			variant: "primary",
			onClick: () => setOpenDeleteDialog(true),
			disabled: !selectedRow || isSubmitting,
		},
	];

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
						fetchData(p, limit);
					}}
					totalRows={totalRow}
					initialPageSize={limit}
					onPageSizeChange={(s: number) => setLimit(s)}
					// set single-selection mode; if your CTable expects a different prop name, adjust accordingly
					rowSelection="single"
					onSelectionChange={handleSelectionChange}
				/>
			</ContentArea>

			<FloatingCard
				visible={!!selectedRow}
				message={
					<div>
						<strong>
							{selectedRow
								? `${selectedRow.firstName ?? ""} ${selectedRow.lastName ?? ""}`
								: 0}
						</strong>{" "}
						selected
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
								{selectedRow
									? `${selectedRow.firstName ?? ""} ${selectedRow.lastName ?? ""}`
									: ""}
							</strong>
							? This action cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="flex gap-2">
						<Button variant="ghost" onClick={() => setOpenDeleteDialog(false)}>
							Cancel
						</Button>
						<Button variant="destructive" onClick={confirmDelete}>
							Confirm
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</SectionWrapper>
	);
}
