import { Task, TaskPriority, TaskStatus } from "@/types/task";
import { get, post, put, remove } from "./apiCaller";

// --- Approximated DTOs based on controllers ---

/**
 * Request body for creating a new task.
 * Based on `CreateTaskRequest` from `task.controller.ts`.
 */
export interface CreateTaskRequest {
	name: string;
	description?: string;
	priority?: number;
	status?: TaskStatus;
	startDate?: string;
	dueDate?: string;
	assigneeId?: string | null;
}

/**
 * Request body for updating an existing task.
 * Based on `UpdateTaskRequest` from `task.controller.ts`.
 */
export interface UpdateTaskRequest {
	name?: string;
	description?: string;
	priority?: number;
	status?: TaskStatus;
	startDate?: string;
	dueDate?: string;
	assigneeId?: string | null;
}

/**
 * Request body for updating a task from GroupTodo component.
 * Only includes fields that the GroupTodo component actually uses.
 */
export interface GroupTodoUpdateRequest {
	name?: string;
	description?: string;
	priority?: number;
	status?: TaskStatus;
	startDate?: string;
	dueDate?: string;
}

export interface UpdateTaskStatusRequest {
	status: TaskStatus;
}

/**
 * Query parameters for fetching a list of tasks.
 * Based on `TaskQuery` from `task.controller.ts`.
 */
type MaybeArray<T> = T | T[] | string;

export interface TaskQuery {
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: "ASC" | "DESC";
	status?: MaybeArray<TaskStatus>;
	assigneeId?: string;
	priority?: MaybeArray<TaskPriority>;
	search?: string;
	unassigned?: boolean;
	startDateFrom?: string;
	startDateTo?: string;
	dueDateFrom?: string;
	dueDateTo?: string;
}

/**
 * Response for task statistics.
 */
export interface TaskStatisticsByStatus {
	todo: number;
	inProgress: number;
	done: number;
}

export interface TaskStatisticsByPriority {
	low: number;
	medium: number;
	high: number;
}

export interface TaskStatisticsResponse {
	totalTasks: number;
	pendingTasks: number;
	completedTasks: number;
	unassignedTasks: number;
	overdueTasks: number;
	byStatus: TaskStatisticsByStatus;
	byPriority: TaskStatisticsByPriority;
}

/**
 * Response for task audit log/history.
 */
export interface AuditLogResponse {
	id: string;
	userId: string;
	action: string;
	entityType: string;
	oldValues: string | null;
	newValues: string | null;
	timestamp: string;
	userName: string;
}

/**
 * Represents a task object returned from the API.
 * Based on `TaskResponse` from `task.controller.ts`.
 */
export type TaskResponse = Task;
// --- API Service Definition ---

/**
 * Creates a new task within a specific group.
 * Corresponds to `POST /group/:groupId/task`.
 * @param groupId - The ID of the group where the task will be created.
 * @param data - The task data.
 * @returns A promise that resolves to the created task.
 */
const createTask = (groupId: string, data: CreateTaskRequest) => {
	return post(`/api/group/${groupId}/task`, data);
};

/**
 * Retrieves all tasks within a specific group, with optional filtering and pagination.
 * Corresponds to `GET /group/:groupId/task`.
 * @param groupId - The ID of the group.
 * @param query - The query parameters for filtering and pagination.
 * @returns A promise that resolves to a paginated list of tasks.
 */
const getTasks = (groupId: string, query: TaskQuery) => {
	return get<TaskResponse[]>(`/api/group/${groupId}/task`, query);
};

/**
 * Retrieves a specific task by its ID.
 * Corresponds to `GET /group/:groupId/task/:id`.
 * @param groupId - The ID of the group.
 * @param taskId - The ID of the task.
 * @returns A promise that resolves to the requested task.
 */
const getTaskById = (groupId: string, taskId: string) => {
	return get(`/api/group/${groupId}/task/${taskId}`);
};

/**
 * Updates an existing task.
 * Corresponds to `PUT /group/:groupId/task/:id`.
 * @param groupId - The ID of the group.
 * @param taskId - The ID of the task to update.
 * @param data - The updated task data.
 * @returns A promise that resolves to the updated task.
 */
const updateTask = (
	groupId: string,
	taskId: string,
	data: UpdateTaskRequest | GroupTodoUpdateRequest,
) => {
	return put(`/api/group/${groupId}/task/${taskId}`, data);
};

const updateTaskStatus = (
	groupId: string,
	taskId: string,
	data: UpdateTaskStatusRequest,
) => {
	return put(`/api/group/${groupId}/task/${taskId}/status`, data);
};

/**
 * Deletes a task.
 * Corresponds to `DELETE /group/:groupId/task/:id`.
 * @param groupId - The ID of the group.
 * @param taskId - The ID of the task to delete.
 * @returns A promise that resolves when the task is deleted.
 */
const deleteTask = (groupId: string, taskId: string) => {
	return remove<null>(`/api/group/${groupId}/task/${taskId}`);
};

/**
 * Retrieves task statistics for a specific group.
 * Corresponds to `GET /group/:groupId/task/statistics`.
 * @param groupId - The ID of the group.
 * @param startDate - Optional start date for filtering (ISO string).
 * @param endDate - Optional end date for filtering (ISO string).
 * @returns A promise that resolves to task statistics.
 */
const getTaskStatistics = (
	groupId: string,
	startDate?: string,
	endDate?: string,
) => {
	const params = new URLSearchParams();
	if (startDate) params.append("startDate", startDate);
	if (endDate) params.append("endDate", endDate);
	const queryString = params.toString();
	const url = `/api/group/${groupId}/task/statistics${queryString ? `?${queryString}` : ""}`;
	return get<TaskStatisticsResponse>(url);
};

/**
 * Retrieves task history/audit logs for a specific task.
 * Corresponds to `GET /group/:groupId/task/:taskId/history`.
 * @param groupId - The ID of the group.
 * @param taskId - The ID of the task.
 * @returns A promise that resolves to task history.
 */
const getTaskHistory = (groupId: string, taskId: string) => {
	return get<AuditLogResponse[]>(
		`/api/group/${groupId}/task/${taskId}/history`,
	);
};

/**
 * Retrieves all tasks for the currently authenticated user within a specific group.
 * Corresponds to `GET /user/task/:groupId`.
 * @param groupId - The ID of the group.
 * @returns A promise that resolves to a list of tasks.
 */
export const taskAPI = {
	createTask,
	getTasks,
	getTaskById,
	updateTask,
	updateTaskStatus,
	deleteTask,
	getTaskStatistics,
	getTaskHistory,
};
