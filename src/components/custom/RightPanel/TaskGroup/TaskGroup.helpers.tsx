import { AlertCircle, CheckCircle2, Circle, Clock } from "lucide-react";
import { Task, AlertType, TaskFormData } from "./TaskGroup.types";
import { CreateTaskRequest, UpdateTaskRequest } from "@/services/taskAPI";
import { Task as ApiTask, TaskStatus, TaskPriority } from "@/types/task";

const TASK_LOCK_WINDOW_IN_MS = 3 * 24 * 60 * 60 * 1000;

export const resolveLockState = (apiTask: ApiTask) => {
	if (apiTask.status !== TaskStatus.DONE || !apiTask.updatedAt) {
		return { isLocked: false, lockedAt: undefined as string | undefined };
	}

	const updatedAtMs = Date.parse(apiTask.updatedAt);
	if (Number.isNaN(updatedAtMs)) {
		return { isLocked: false, lockedAt: undefined };
	}

	const lockThreshold = Date.now() - TASK_LOCK_WINDOW_IN_MS;
	const isLocked = updatedAtMs <= lockThreshold;
	return {
		isLocked,
		lockedAt: isLocked ? apiTask.updatedAt : undefined,
	};
};

export const convertApiTaskToLocal = (apiTask: ApiTask): Task => {
	const statusMap: Record<TaskStatus, Task["status"]> = {
		[TaskStatus.TODO]: "To Do",
		[TaskStatus.IN_PROGRESS]: "In Progress",
		[TaskStatus.DONE]: "Done",
	};

	const priorityMap: Record<TaskPriority, Task["priority"]> = {
		[TaskPriority.LOW]: "Low",
		[TaskPriority.MEDIUM]: "Medium",
		[TaskPriority.HIGH]: "High",
	};

	const { isLocked, lockedAt } = resolveLockState(apiTask);

	return {
		id: apiTask.id,
		name: apiTask.name,
		description: apiTask.description || "",
		status: statusMap[apiTask.status] || "To Do",
		priority: priorityMap[apiTask.priority] || "Medium",
		startDate: apiTask.startDate || "",
		dueDate: apiTask.dueDate || new Date().toISOString().split("T")[0],
		assignedTo: apiTask.assignee?.id || "",
		isLocked,
		lockedAt,
		updatedAt: apiTask.updatedAt,
	};
};

export const convertLocalToApiCreate = (
	localTask: Omit<Task, "id">,
): CreateTaskRequest => {
	const statusMap: Record<Task["status"], TaskStatus> = {
		"To Do": TaskStatus.TODO,
		"In Progress": TaskStatus.IN_PROGRESS,
		Done: TaskStatus.DONE,
	};

	const priorityMap: Record<Task["priority"], TaskPriority> = {
		Low: TaskPriority.LOW,
		Medium: TaskPriority.MEDIUM,
		High: TaskPriority.HIGH,
	};

	return {
		name: localTask.name,
		description: localTask.description,
		status: statusMap[localTask.status],
		priority: priorityMap[localTask.priority],
		startDate: localTask.startDate
			? new Date(localTask.startDate).toISOString()
			: undefined,
		dueDate: localTask.dueDate
			? new Date(localTask.dueDate).toISOString()
			: undefined,
		assigneeId:
			localTask.assignedTo && localTask.assignedTo.trim() !== ""
				? localTask.assignedTo
				: undefined,
	};
};

export const convertLocalToApiUpdate = (
	localTask: Partial<Task>,
): UpdateTaskRequest => {
	const statusMap: Record<Task["status"], TaskStatus> = {
		"To Do": TaskStatus.TODO,
		"In Progress": TaskStatus.IN_PROGRESS,
		Done: TaskStatus.DONE,
	};

	const priorityMap: Record<Task["priority"], TaskPriority> = {
		Low: TaskPriority.LOW,
		Medium: TaskPriority.MEDIUM,
		High: TaskPriority.HIGH,
	};

	return {
		name: localTask.name,
		description: localTask.description,
		status: localTask.status ? statusMap[localTask.status] : undefined,
		priority: localTask.priority ? priorityMap[localTask.priority] : undefined,
		startDate: localTask.startDate
			? new Date(localTask.startDate).toISOString()
			: undefined,
		dueDate: localTask.dueDate
			? new Date(localTask.dueDate).toISOString()
			: undefined,
		assigneeId:
			localTask.assignedTo && localTask.assignedTo.trim() !== ""
				? localTask.assignedTo
				: null,
	};
};

export const fireAlert = (
	type: AlertType,
	message: string,
	duration = 4000,
) => {
	if (typeof window === "undefined") return;
	window.dispatchEvent(
		new CustomEvent("app:alert", { detail: { type, message, duration } }),
	);
};

export const getPriorityColor = (priority: Task["priority"]) => {
	switch (priority) {
		case "High":
			return { text: "#D83232", bg: "#D8323233" };
		case "Medium":
			return { text: "#EFB008", bg: "#EFB00833" };
		case "Low":
			return { text: "#1CCA93", bg: "#1CCA9333" };
		default:
			return { text: "#6b7280", bg: "#f3f4f6" };
	}
};

export const getStatusColor = (status: Task["status"]) => {
	switch (status) {
		case "To Do":
			return { text: "#EFB008", bg: "#EFB00833" };
		case "In Progress":
			return { text: "#608BC1", bg: "#608BC133" };
		case "Done":
			return { text: "#1CCA93", bg: "#1CCA9333" };
		default:
			return { text: "#6b7280", bg: "#f3f4f6" };
	}
};

export const getStatusIcon = (status: Task["status"]) => {
	switch (status) {
		case "To Do":
			return <Circle size={14} />;
		case "In Progress":
			return <Clock size={14} />;
		case "Done":
			return <CheckCircle2 size={14} />;
		default:
			return <Circle size={14} />;
	}
};

export const getPriorityIcon = () => {
	return <AlertCircle size={14} />;
};

export const formatDate = (dateString?: string) => {
	if (!dateString) return "No date";
	const date = new Date(dateString);
	return date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
};

export const hasTaskChanged = (
	current: TaskFormData,
	original: TaskFormData,
) => {
	return (
		current.name !== original.name ||
		current.description !== original.description ||
		current.status !== original.status ||
		current.priority !== original.priority ||
		current.startDate !== original.startDate ||
		current.dueDate !== original.dueDate ||
		current.assignedTo !== original.assignedTo
	);
};
