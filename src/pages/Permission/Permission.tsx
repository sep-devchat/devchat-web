import React, { useState, useEffect } from "react";
import { useSearch } from "@tanstack/react-router";
import { TabId } from "./permission.types";
import { DEFAULT_TAB, TABS } from "./permission.constants";
import { COLUMNS, MOCK_DATA } from "./permission.mockData";
import * as S from "./Permission.styled";
import RolePermissions from "@/components/custom/RolePermission/RolePermission";
import {
	TablePermission,
	RolePermission as RolePermissionType,
} from "@/components/custom/TablePermission/TablePermission";
import { PermissionModal } from "@/components/custom/TablePermission/Modal/Modal";
import { SystemRoleModal } from "@/components/custom/RolePermission/Modal/Modal";
import {
	listPermissions,
	createPermission,
	updatePermission,
	deletePermission,
	FeaturePermissionResponse,
	FeaturePermissionRequest,
} from "@/services/permissionAPI";
import ErrorMessage from "@/components/custom/ErrorMessage/ErrorMessage";

interface RolePermissionRole {
	id: string;
	name: string;
	role: string;
	level: number;
	color: string;
	permissions: Array<{ id: string; label: string }>;
	metadata?: {
		users?: number;
		status?: string;
		lastModified?: string;
		members?: number;
		access?: string;
		lastActivity?: string;
	};
}

interface SystemRoleData {
	id: string;
	role: string;
	name: string;
	level: number;
	color: string;
	permissions: Array<{ id: string; label: string }>;
	users: number;
	status: string;
	lastModified: string;
}

export const Permission: React.FC = () => {
	const search = useSearch({ from: "/admin/permission" });
	const activeTab = (search.tab as TabId) || DEFAULT_TAB;

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalMode, setModalMode] = useState<"create" | "edit">("create");

	const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
	const [roleModalMode, setRoleModalMode] = useState<"add" | "edit">("add");
	const [editingRoleData, setEditingRoleData] = useState<SystemRoleData | null>(
		null,
	);

	const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
	const [selectedPermissionId, setSelectedPermissionId] = useState<
		string | null
	>(null);
	const [tableData, setTableData] = useState<
		Record<TabId, RolePermissionType[]>
	>({
		...MOCK_DATA,
	} as any);

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (activeTab === "feature") {
			fetchFeaturePermissions();
		}
	}, [activeTab]);

	const fetchFeaturePermissions = async () => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await listPermissions(1, 100);
			if (response && response.data && Array.isArray(response.data)) {
				const activePermissions = response.data.filter(
					(item: FeaturePermissionResponse) => item.isActive === true,
				);

				const formattedData = activePermissions.map(
					(item: FeaturePermissionResponse) => ({
						id: item.id,
						code: item.code,
						name: item.name,
						description: item.description,
						feature: item.name,
					}),
				);

				setTableData((prev) => ({
					...prev,
					feature: formattedData,
				}));
			}
		} catch (err: any) {
			console.error("Error fetching permissions:", err);
			setError(err.message || "Error fetching permissions");
		} finally {
			setIsLoading(false);
		}
	};

	const handleEdit = (index: number) => {
		console.log(`Edit item at index ${index} in tab ${activeTab}`);

		if (activeTab === "system-roles") {
			const roleToEdit = (
				tableData["system-roles"] as unknown as SystemRoleData[]
			)[index];
			setEditingRoleData(roleToEdit);
			setRoleModalMode("edit");
			setIsRoleModalOpen(true);
		} else if (activeTab === "feature") {
			const permissionToEdit = tableData["feature"][index];
			setSelectedPermissionId(permissionToEdit.id as string);
			setSelectedRowIndex(index);
			setModalMode("edit");
			setIsModalOpen(true);
		} else {
			setSelectedRowIndex(index);
			setModalMode("edit");
			setIsModalOpen(true);
		}
	};

	const handleDelete = async (index: number) => {
		if (activeTab === "feature") {
			const permissionToDelete = tableData["feature"][index];
			const permissionId = permissionToDelete.id as string;

			setIsLoading(true);
			try {
				await deletePermission(permissionId);
				console.log(`Deleted permission with id ${permissionId}`);

				await fetchFeaturePermissions();
			} catch (err: any) {
				console.error("Error deleting permission:", err);
				alert(err.message || "Không thể xóa permission");
			} finally {
				setIsLoading(false);
			}
		} else {
			console.log(`Delete item at index ${index} in tab ${activeTab}`);
			setTableData((prev) => ({
				...prev,
				[activeTab]: prev[activeTab].filter((_, i) => i !== index),
			}));
		}
	};

	const handleActionButtonClick = () => {
		console.log(`Add new item in tab ${activeTab}`);
		if (activeTab === "system-roles") {
			setEditingRoleData(null);
			setRoleModalMode("add");
			setIsRoleModalOpen(true);
		} else {
			setSelectedRowIndex(null);
			setSelectedPermissionId(null);
			setModalMode("create");
			setIsModalOpen(true);
		}
	};

	const handleModalSubmit = async (data: RolePermissionType) => {
		if (activeTab === "feature") {
			setIsLoading(true);
			try {
				if (modalMode === "create") {
					const requestData: FeaturePermissionRequest = {
						code: data.code as string,
						name: data.name as string,
						description: (data.description as string) || "",
					};

					const response = await createPermission(requestData);
					console.log("Created new permission:", response);

					await fetchFeaturePermissions();
				} else if (modalMode === "edit" && selectedPermissionId) {
					const requestData: any = {
						code: data.code as string,
						name: data.name as string,
						description: (data.description as string) || "",
					};

					const response = await updatePermission(
						selectedPermissionId,
						requestData,
					);
					console.log("Updated permission:", response);

					await fetchFeaturePermissions();
				}
			} catch (err: any) {
				console.error("Error saving permission:", err);
				alert(err.message || "Không thể lưu permission");
			} finally {
				setIsLoading(false);
			}
		} else {
			if (modalMode === "create") {
				setTableData((prev) => ({
					...prev,
					[activeTab]: [...prev[activeTab], data],
				}));
				console.log("Created new item:", data);
			} else if (modalMode === "edit" && selectedRowIndex !== null) {
				setTableData((prev) => ({
					...prev,
					[activeTab]: prev[activeTab].map((item, index) =>
						index === selectedRowIndex ? data : item,
					),
				}));
				console.log("Updated item at index", selectedRowIndex, ":", data);
			}
		}
		handleModalClose();
	};

	const handleModalClose = () => {
		setIsModalOpen(false);
		setSelectedRowIndex(null);
		setSelectedPermissionId(null);
	};

	const handleRoleModalSubmit = (data: any) => {
		setTableData((prev) => {
			const currentRoles = prev["system-roles"] as unknown as SystemRoleData[];

			if (roleModalMode === "edit" && editingRoleData) {
				const updatedRoles = currentRoles.map((role) =>
					role.id === editingRoleData.id
						? {
								...role,
								role: data.role,
								name: data.name,
								level: data.level,
								color: data.color,
								permissions: data.permissions,
								lastModified:
									new Date().toLocaleDateString("en-CA") +
									" " +
									new Date().toLocaleTimeString("en-US", {
										hour12: false,
										hour: "2-digit",
										minute: "2-digit",
									}),
							}
						: role,
				);
				return {
					...prev,
					"system-roles": updatedRoles as unknown as RolePermissionType[],
				};
			} else {
				const newRole: SystemRoleData = {
					id: data.role.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(),
					role: data.role,
					name: data.name,
					level: data.level,
					color: data.color,
					permissions: data.permissions,
					users: 0,
					status: "Active",
					lastModified:
						new Date().toLocaleDateString("en-CA") +
						" " +
						new Date().toLocaleTimeString("en-US", {
							hour12: false,
							hour: "2-digit",
							minute: "2-digit",
						}),
				};
				return {
					...prev,
					"system-roles": [
						...currentRoles,
						newRole,
					] as unknown as RolePermissionType[],
				};
			}
		});

		handleRoleModalClose();
	};

	const handleRoleModalClose = () => {
		setIsRoleModalOpen(false);
		setEditingRoleData(null);
		setRoleModalMode("add");
	};

	const getTableTitle = (): string => {
		const tab = TABS.find((t) => t.id === activeTab);
		return tab ? tab.label : "";
	};

	const getTableSubtitle = (): string => {
		const subtitles: Record<TabId, string> = {
			"system-roles": "Manage user roles and permissions across the system",
			feature: "Configure feature permissions for different user roles",
			"change-history": "View audit log of all permission changes",
		};
		return subtitles[activeTab] || "";
	};

	const getActionButtonText = (): string | undefined => {
		const buttonTexts: Partial<Record<TabId, string>> = {
			"system-roles": "Add Role",
			feature: "Add Feature",
		};
		return buttonTexts[activeTab];
	};

	const getModalTitle = (): string => {
		const titles: Partial<Record<TabId, string>> = {
			feature:
				modalMode === "create" ? "Add new Permission" : "Update Permission",
		};
		return titles[activeTab] || (modalMode === "create" ? "Add" : "Update");
	};

	const convertToRolePermissionFormat = (): RolePermissionRole[] => {
		if (activeTab === "system-roles") {
			return (tableData["system-roles"] as unknown as SystemRoleData[]).map(
				(item) => {
					return {
						id: item.id,
						role: item.role,
						name: item.name,
						level: item.level,
						color: item.color,
						permissions: item.permissions,
						metadata: {
							users: item.users,
							status: item.status,
							lastModified: item.lastModified,
						},
					};
				},
			);
		}
		return [];
	};

	const renderCell = (value: any, column: any): React.ReactNode | undefined => {
		if (activeTab === "feature" && column.key === "feature") {
			const currentData = tableData["feature"] || [];
			const rowData = currentData.find((row) => row.name === value);

			return (
				<div>
					<div style={{ fontWeight: 600 }}>{value}</div>
					{rowData && rowData.description && (
						<div style={{ fontSize: "12px", color: "#666" }}>
							{rowData.description}
						</div>
					)}
				</div>
			);
		}

		return undefined;
	};

	if (activeTab === "system-roles") {
		return (
			<S.Container>
				<S.TableWrapper>
					<RolePermissions
						key={JSON.stringify(tableData["system-roles"])}
						roles={convertToRolePermissionFormat()}
						title={getTableTitle()}
						subtitle={getTableSubtitle()}
						type={activeTab as "system-roles" | "project"}
						onAdd={handleActionButtonClick}
						onEdit={handleEdit}
						onDelete={handleDelete}
					/>
				</S.TableWrapper>
				{isRoleModalOpen && (
					<SystemRoleModal
						key={editingRoleData?.id || "new-role"}
						isOpen={isRoleModalOpen}
						onClose={handleRoleModalClose}
						onSave={handleRoleModalSubmit}
						role={editingRoleData || undefined}
						mode={roleModalMode}
					/>
				)}
			</S.Container>
		);
	}

	const currentColumns = COLUMNS[activeTab];
	const currentData = tableData[activeTab] || [];
	const initialData =
		selectedRowIndex !== null ? currentData[selectedRowIndex] : undefined;

	return (
		<S.Container>
			{error && <ErrorMessage />}
			<S.TableWrapper>
				<TablePermission
					title={getTableTitle()}
					subtitle={getTableSubtitle()}
					columns={currentColumns}
					pageSize={10}
					data={currentData}
					actionButtonText={getActionButtonText()}
					onActionButtonClick={
						getActionButtonText() ? handleActionButtonClick : undefined
					}
					onEdit={activeTab !== "change-history" ? handleEdit : undefined}
					onDelete={activeTab !== "change-history" ? handleDelete : undefined}
					renderCell={renderCell}
					showCellBackground={activeTab === "change-history"}
					deleteConfirmTitle="Confirm Deletion"
					deleteConfirmMessage={(rowData: RolePermissionType) => {
						if (activeTab === "feature" && rowData?.name) {
							return `Are you sure you want to delete permission "${rowData.name}"?`;
						}
						return "Are you sure you want to delete this item?";
					}}
					deleteConfirmText="Delete"
					deleteCancelText="Cancel"
					isLoading={isLoading}
				/>
			</S.TableWrapper>

			{activeTab === "feature" && (
				<PermissionModal
					isOpen={isModalOpen}
					onClose={handleModalClose}
					onSubmit={handleModalSubmit}
					columns={currentColumns}
					mode={modalMode}
					initialData={initialData}
					title={getModalTitle()}
					tabType={activeTab as "feature"}
				/>
			)}
		</S.Container>
	);
};

export default Permission;
