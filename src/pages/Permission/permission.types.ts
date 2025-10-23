export type TabId = "system-roles" | "feature" | "change-history";

export interface Tab {
	id: TabId;
	label: string;
}

export interface FilterValues {
	search?: string;
	role?: string;
	status?: string;
	dateRange?: string;
}

export interface Permission {
	id: string;
	label: string;
}

export interface RolePermission {
	[key: string]: boolean | string | number | React.ReactNode | Permission[];
}

export interface Column {
	key: string;
	label: string;
	width?: string;
	align?: "left" | "center" | "right";
}
