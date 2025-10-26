import { TabId, Column, RolePermission } from "./permission.types";

export const COLUMNS: Record<TabId, Column[]> = {
	"system-roles": [
		{ key: "role", label: "ROLE NAME", width: "200px" },
		{ key: "users", label: "USERS", align: "center", width: "100px" },
		{ key: "description", label: "DESCRIPTION" },
		{ key: "status", label: "STATUS", align: "center", width: "120px" },
		{ key: "lastModified", label: "LAST MODIFIED", width: "150px" },
	],
	feature: [
		{ key: "code", label: "CODE" },
		{ key: "name", label: "PERMISSION NAME" },
		{ key: "description", label: "DESCRIPTION" },
	],
	"change-history": [
		{ key: "time", label: "TIME", width: "180px" },
		{ key: "user", label: "USER", width: "200px" },
		{ key: "action", label: "ACTION", width: "200px" },
		{ key: "target", label: "TARGET", width: "200px" },
		{ key: "changes", label: "CHANGES" },
		{ key: "ip", label: "IP ADDRESS", width: "140px" },
	],
};

export const MOCK_DATA: Record<TabId, RolePermission[]> = {
	"system-roles": [
		{
			id: "1",
			role: "SYS_AD",
			name: "System Admin",
			level: 4,
			color: "#d1d5db",
			permissions: [
				{ id: "1", label: "Full system access with all permissions" },
				{ id: "2", label: "Manage all users and roles" },
				{ id: "3", label: "Configure system settings" },
				{ id: "4", label: "View all audit logs" },
			],
			users: 3,
			status: "Active",
			lastModified: "2025-10-15 14:30",
		},
		{
			id: "2",
			role: "SYS_AD",
			name: "System Admin",
			level: 3,
			color: "#fed7aa",
			permissions: [
				{
					id: "1",
					label: "Administrative access with limited system settings",
				},
				{ id: "2", label: "Manage user roles" },
				{ id: "3", label: "Access analytics" },
			],
			users: 8,
			status: "Active",
			lastModified: "2025-10-14 09:15",
		},
		{
			id: "3",
			role: "SYS_AD",
			name: "System Admin",
			level: 1,
			color: "#a7f3d0",
			permissions: [
				{ id: "1", label: "Basic user access" },
				{ id: "2", label: "Use core features" },
			],
			users: 1250,
			status: "Active",
			lastModified: "2025-10-10 08:00",
		},
	],
	feature: [
		{
			code: "REAL_TIME_CHAT",
			name: "Real-time Chat",
			description: "Allow sending and receiving real-time messages",
		},
		{
			code: "CODE_EXEC",
			name: "Code Execution",
			description: "Run code snippets in sandbox environment",
		},
		{
			code: "AI_ASSISTANT",
			name: "AI Assistant",
			description: "Use AI to suggest code and debug",
		},
		{
			code: "GITHUB_INT",
			name: "GitHub Integration",
			description: "Connect with GitHub repos and PRs",
		},
		{
			code: "SNIPPET_LIB",
			name: "Snippet Library",
			description: "Save and share code snippets",
		},
		{
			code: "FILE_UPLOAD",
			name: "File Upload",
			description: "Upload files and attachments",
		},
	],
	"change-history": [
		{
			time: "2025-10-16 14:32:15",
			user: "admin@devchat.com",
			action: "Updated Role",
			target: "user@example.com",
			changes: "Role: Group Admin → System Admin",
			ip: "192.168.1.100",
		},
		{
			time: "2025-10-16 13:15:42",
			user: "admin@devchat.com",
			action: "Enabled Feature",
			target: "developer@devchat.com",
			changes: "Code Execution: Disabled → Enabled",
			ip: "192.168.1.100",
		},
		{
			time: "2025-10-16 11:20:18",
			user: "superadmin@devchat.com",
			action: "Disabled Feature",
			target: "guest@devchat.com",
			changes: "AI Assistant: Enabled → Disabled",
			ip: "192.168.1.50",
		},
		{
			time: "2025-10-16 09:45:30",
			user: "admin@devchat.com",
			action: "Updated Limit",
			target: "team@devchat.com",
			changes: "AI Requests: 100/day → 200/day",
			ip: "192.168.1.100",
		},
		{
			time: "2025-10-15 16:20:45",
			user: "moderator@devchat.com",
			action: "Added API Key",
			target: "GitHub API",
			changes: "Status: Inactive → Active",
			ip: "192.168.1.75",
		},
	],
};
