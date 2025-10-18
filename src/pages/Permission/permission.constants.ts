import { Tab, TabId } from "./permission.types";

export const TABS: Tab[] = [
	{ id: "system-roles", label: "System Roles" },
	{ id: "feature", label: "Feature Permissions" },
	{ id: "project", label: "Project Access" },
	{ id: "resource-limit", label: "Resource Limits" },
	{ id: "api-keys", label: "API Keys" },
	{ id: "code-execution", label: "Code Execution" },
	{ id: "security", label: "Security Settings" },
	{ id: "change-history", label: "Change History" },
];

export const DEFAULT_TAB: TabId = "system-roles";

export const getTodayDateFormatted = (): string => {
	const today = new Date();
	return today.toISOString().split("T")[0];
};

export const ROLE_OPTIONS = [
	{ value: "all", label: "All Roles" },
	{ value: "system-admin", label: "System Admin" },
	{ value: "group-admin", label: "Group Admin" },
	{ value: "member", label: "Member" },
];

export const STATUS_OPTIONS = [
	{ value: "all", label: "All Status" },
	{ value: "active", label: "Active" },
	{ value: "inactive", label: "Inactive" },
	{ value: "pending", label: "Pending" },
];
