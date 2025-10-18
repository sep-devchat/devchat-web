import React, { useState } from "react";
import { useSearch } from "@tanstack/react-router";
import { TabId } from "./permission.types";
import { DEFAULT_TAB, TABS } from "./permission.constants";
import { COLUMNS, MOCK_DATA } from "./permission.mockData";
import * as S from "./Permission.styled";
import RolePermissions from "@/components/custom/RolePermission/RolePermission";
import { Shield, UserCog, User } from "lucide-react";
import CodePermission from "@/components/custom/CodePermission/CodePermission";
import SecurityPermission from "@/components/custom/SecurityPermission/SecurityPermission";
import {
	TablePermission,
	RolePermission as RolePermissionType,
} from "@/components/custom/TablePermission/TablePermission";
import { PermissionModal } from "@/components/custom/TablePermission/Modal/Modal";

interface RolePermissionRole {
	id: string;
	name: string;
	description?: string;
	color: string;
	icon?: React.ReactNode;
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

export const Permission: React.FC = () => {
	const search = useSearch({ from: "/admin/permission" });
	const activeTab = (search.tab as TabId) || DEFAULT_TAB;

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalMode, setModalMode] = useState<"create" | "edit">("create");
	const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
	const [tableData, setTableData] = useState<
		Record<TabId, RolePermissionType[]>
	>({
		...MOCK_DATA,
	} as any);

	const handleEdit = (index: number) => {
		console.log(`Edit item at index ${index} in tab ${activeTab}`);
		setSelectedRowIndex(index);
		setModalMode("edit");
		setIsModalOpen(true);
	};

	const handleDelete = (index: number) => {
		if (window.confirm("Bạn có chắc chắn muốn xóa mục này?")) {
			console.log(`Delete item at index ${index} in tab ${activeTab}`);
			setTableData((prev) => ({
				...prev,
				[activeTab]: prev[activeTab].filter((_, i) => i !== index),
			}));
		}
	};

	const handleActionButtonClick = () => {
		console.log(`Add new item in tab ${activeTab}`);
		setSelectedRowIndex(null);
		setModalMode("create");
		setIsModalOpen(true);
	};

	const handleModalSubmit = (data: RolePermissionType) => {
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
	};

	const handleModalClose = () => {
		setIsModalOpen(false);
		setSelectedRowIndex(null);
	};

	const getTableTitle = (): string => {
		const tab = TABS.find((t) => t.id === activeTab);
		return tab ? tab.label : "";
	};

	const getTableSubtitle = (): string => {
		const subtitles: Record<TabId, string> = {
			"system-roles": "Manage user roles and permissions across the system",
			feature: "Configure feature permissions for different user roles",
			project: "Control project access and collaboration settings",
			"resource-limit": "Set resource usage limits for each user role",
			"api-keys": "Manage API key access and permissions",
			"code-execution": "Configure code execution environments and limits",
			security: "Manage security policies and enforcement rules",
			"change-history": "View audit log of all permission changes",
		};
		return subtitles[activeTab] || "";
	};

	const getActionButtonText = (): string | undefined => {
		const buttonTexts: Partial<Record<TabId, string>> = {
			"system-roles": "Add Role",
			feature: "Add Feature",
			project: "Add Project",
			"resource-limit": "Add Limit",
			"api-keys": "Add API Key",
			"code-execution": "Add Environment",
			security: "Add Policy",
		};
		return buttonTexts[activeTab];
	};

	const getModalTitle = (): string => {
		const titles: Partial<Record<TabId, string>> = {
			"api-keys":
				modalMode === "create" ? "Thêm API Key mới" : "Chỉnh sửa API Key",
			"resource-limit":
				modalMode === "create" ? "Thêm giới hạn mới" : "Chỉnh sửa giới hạn",
			feature:
				modalMode === "create" ? "Thêm tính năng mới" : "Chỉnh sửa tính năng",
		};
		return (
			titles[activeTab] || (modalMode === "create" ? "Thêm mới" : "Chỉnh sửa")
		);
	};

	const getRoleColor = (roleName: string): string => {
		const colors: Record<string, string> = {
			"System Admin": "#EFB00833",
			"Group Admin": "#B54BB333",
			Member: "#1CCA9333",
			"DevChat Platform": "#B54BB333",
			"API Gateway": "#608BC133",
			"Mobile App": "#1CCA9333",
		};
		return colors[roleName] || "#F0F0F0";
	};

	const getRoleStyle = (roleName: string) => {
		const roleMap: Record<
			string,
			{
				icon: React.ReactNode;
				iconColor: string;
				iconBgColor: string;
				permissions: Array<{ id: string; label: string }>;
			}
		> = {
			"System Admin": {
				icon: <Shield size={18} />,
				iconColor: "#f97316",
				iconBgColor: "#FFE8D4",
				permissions: [
					{ id: "1", label: "Full system access with all permissions" },
					{ id: "2", label: "Manage all users and roles" },
					{ id: "3", label: "Configure system settings" },
					{ id: "4", label: "View all audit logs" },
				],
			},
			"Group Admin": {
				icon: <UserCog size={18} />,
				iconColor: "#9333ea",
				iconBgColor: "#E8D4F8",
				permissions: [
					{
						id: "1",
						label: "Administrative access with limited system settings",
					},
					{ id: "2", label: "Manage user roles" },
					{ id: "3", label: "Access analytics" },
				],
			},
			Member: {
				icon: <User size={18} />,
				iconColor: "#1CCA93",
				iconBgColor: "#D4F8E8",
				permissions: [
					{ id: "1", label: "Basic user access" },
					{ id: "2", label: "Use core features" },
				],
			},
		};

		return (
			roleMap[roleName] || {
				icon: <User size={18} />,
				iconColor: "#6b7280",
				iconBgColor: "#F0F0F0",
				permissions: [],
			}
		);
	};

	const convertToRolePermissionFormat = (): RolePermissionRole[] => {
		if (activeTab === "system-roles") {
			return tableData["system-roles"].map((item: any) => {
				const roleStyle = getRoleStyle(item.role);
				return {
					id: item.role.toLowerCase().replace(/\s+/g, "-"),
					name: item.role,
					description: item.description,
					color: getRoleColor(item.role),
					icon: roleStyle.icon,
					permissions: roleStyle.permissions,
					metadata: {
						users: item.users,
						status: item.status,
						lastModified: item.lastModified,
					},
				};
			});
		}

		if (activeTab === "project") {
			return tableData.project.map((item: any) => ({
				id: item.project.toLowerCase().replace(/\s+/g, "-"),
				name: item.project,
				description: `Owner: ${item.owner}`,
				color: getRoleColor(item.project),
				icon: <Shield size={18} />,
				permissions: [
					{ id: "1", label: `${item.members} members with ${item.access}` },
					{ id: "2", label: `Last activity: ${item.lastActivity}` },
				],
				metadata: {
					members: item.members,
					access: item.access,
					lastActivity: item.lastActivity,
				},
			}));
		}

		return [];
	};

	const renderCell = (value: any, column: any): React.ReactNode | undefined => {
		if (activeTab === "feature" && column.key === "feature") {
			const featureDescriptions: Record<string, string> = {
				"Real-time Chat": "Allow sending and receiving real-time messages",
				"Code Execution": "Run code snippets in sandbox environment",
				"AI Assistant": "Use AI to suggest code and debug",
				"GitHub Integration": "Connect with GitHub repos and PRs",
				"Snippet Library": "Save and share code snippets",
				"File Upload": "Upload files and attachments",
			};
			return (
				<div>
					<div style={{ fontWeight: 600 }}>{value}</div>
					<div style={{ fontSize: "12px", color: "#666" }}>
						{featureDescriptions[value]}
					</div>
				</div>
			);
		}

		if (activeTab === "resource-limit" && column.key === "resource") {
			const resourceDescriptions: Record<string, string> = {
				"Messages / Day": "Maximum number of messages that can be sent",
				"Code Execution / Day": "Number of code executions in sandbox",
				"AI Requests / Day": "Number of AI assistant calls",
				"File Upload Size": "Maximum file size per upload",
				"Total Storage": "Total storage space available",
				"Concurrent Connections": "Maximum simultaneous connections",
			};
			return (
				<div>
					<div style={{ fontWeight: 600 }}>{value}</div>
					<div style={{ fontSize: "12px", color: "#666" }}>
						{resourceDescriptions[value]}
					</div>
				</div>
			);
		}

		if (activeTab === "api-keys" && column.key === "service") {
			const serviceDescriptions: Record<string, string> = {
				"OpenAI API": "Use GPT models for AI assistant",
				"GitHub API": "Integrate with repositories and PRs",
				"Code Execution API": "Sandbox environment for running code",
				"Documentation Search API": "Search documentation with slash commands",
				"GitLab API": "Integrate with GitLab repos",
			};
			const rateLimits: Record<string, string> = {
				"OpenAI API": "1000 req/day",
				"GitHub API": "5000 req/hour",
				"Code Execution API": "500 req/day",
				"Documentation Search API": "2000 req/day",
				"GitLab API": "3000 req/hour",
			};
			return (
				<div>
					<div style={{ fontWeight: 600 }}>{value}</div>
					<div style={{ fontSize: "12px", color: "#666" }}>
						{serviceDescriptions[value]}
					</div>
					<div style={{ fontSize: "12px", color: "#999" }}>
						Rate Limit: {rateLimits[value]}
					</div>
				</div>
			);
		}

		return undefined;
	};

	if (activeTab === "system-roles" || activeTab === "project") {
		return (
			<S.Container>
				<S.TableWrapper>
					<RolePermissions
						roles={convertToRolePermissionFormat()}
						title={getTableTitle()}
						subtitle={getTableSubtitle()}
						type={activeTab as "system-roles" | "project"}
						onAdd={handleActionButtonClick}
						onEdit={handleEdit}
						onDelete={handleDelete}
					/>
				</S.TableWrapper>
			</S.Container>
		);
	}

	if (activeTab === "code-execution") {
		return (
			<S.Container>
				<S.TableWrapper>
					<CodePermission />
				</S.TableWrapper>
			</S.Container>
		);
	}

	if (activeTab === "security") {
		return (
			<S.Container>
				<S.TableWrapper style={{ background: "transparent" }}>
					<SecurityPermission />
				</S.TableWrapper>
			</S.Container>
		);
	}

	const currentColumns = COLUMNS[activeTab];
	const currentData = tableData[activeTab] || [];
	const initialData =
		selectedRowIndex !== null ? currentData[selectedRowIndex] : undefined;

	return (
		<S.Container>
			<S.TableWrapper>
				<TablePermission
					title={getTableTitle()}
					subtitle={getTableSubtitle()}
					columns={currentColumns}
					pageSize={5}
					data={currentData}
					actionButtonText={getActionButtonText()}
					onActionButtonClick={
						getActionButtonText() ? handleActionButtonClick : undefined
					}
					onEdit={activeTab !== "change-history" ? handleEdit : undefined}
					onDelete={activeTab !== "change-history" ? handleDelete : undefined}
					renderCell={renderCell}
				/>
			</S.TableWrapper>

			{(activeTab === "api-keys" ||
				activeTab === "resource-limit" ||
				activeTab === "feature") && (
				<PermissionModal
					isOpen={isModalOpen}
					onClose={handleModalClose}
					onSubmit={handleModalSubmit}
					columns={currentColumns}
					mode={modalMode}
					initialData={initialData}
					title={getModalTitle()}
					tabType={activeTab as "api-keys" | "resource-limit" | "feature"}
				/>
			)}
		</S.Container>
	);
};

export default Permission;
