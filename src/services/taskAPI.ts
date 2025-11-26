import { Task, TaskStatus } from "@/types/task";
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
	assigneeId?: string;
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
	assigneeId?: string;
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
export interface TaskQuery {
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: "ASC" | "DESC";
	status?: TaskStatus;
	assigneeId?: string;
	priority?: number;
	startDateFrom?: string;
	startDateTo?: string;
	dueDateFrom?: string;
	dueDateTo?: string;
	search?: string;
	overdue?: boolean | null;
	unassigned?: boolean | null;
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
 * Retrieves all tasks for the currently authenticated user within a specific group.
 * Corresponds to `GET /user/task/:groupId`.
 * @param groupId - The ID of the group.
 * @returns A promise that resolves to a list of tasks.
 */
const getUserTasksByGroup = (groupId: string) => {
	return get<Task[]>(`/api/user/task/${groupId}`);
};

export const taskAPI = {
	createTask,
	getTasks,
	getTaskById,
	updateTask,
	updateTaskStatus,
	deleteTask,
	getUserTasksByGroup,
};
