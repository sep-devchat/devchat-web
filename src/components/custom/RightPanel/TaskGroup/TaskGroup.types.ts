import { TaskPriority, TaskStatus } from "@/types/task";

export type Task = {
	id: string;
	name: string;
	description: string;
	status: "Open" | "To Do" | "In Progress" | "Done";
	priority: "Low" | "Medium" | "High";
	startDate: string;
	dueDate: string;
	assignedTo: string;
	isLocked: boolean;
	lockedAt?: string;
};

export type TaskFormData = {
	name: string;
	description: string;
	status: Task["status"];
	priority: Task["priority"];
	startDate: string;
	dueDate: string;
	assignedTo: string;
};

export type TaskFormErrors = Partial<Record<keyof TaskFormData, string>>;

export type GroupMember = {
	id: string;
	username: string;
	email: string;
	role?: string;
	joined_at?: string;
};

export type TaskGroupProps = {
	onClose?: () => void;
	groupId?: string;
};

export type AlertType = "success" | "warning" | "error";

export type SelectOption = {
	value: string;
	label: string;
};

export type EditPermissions = {
	canEdit: boolean;
	fullAccess: boolean;
	canView: boolean;
};

export type TaskFilters = {
	status?: TaskStatus[];
	priority?: TaskPriority[];
	assigneeId?: string;
	unassigned?: boolean;
};
