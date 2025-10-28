import { get, post, put, remove } from "./apiCaller";

// --- Enums and Types based on the backend DTOs ---

export enum TodoStatusEnum {
	TODO = 0,
	IN_PROGRESS = 1,
	DONE = 2,
}

export enum TodoPriorityEnum {
	LOW = 0,
	MEDIUM = 1,
	HIGH = 2,
}

export interface Todo {
	id: string;
	userId: string;
	name: string;
	description: string | null;
	priority: TodoPriorityEnum;
	status: TodoStatusEnum;
	dueDate: string | null;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface TodoQuery {
	page: number;
	limit: number;
}

export interface CreateTodoRequest {
	name: string;
	description?: string | null;
	priority: TodoPriorityEnum;
	status: TodoStatusEnum;
	dueDate: string | null;
}

export interface UpdateTodoRequest {
	name?: string;
	description?: string | null;
	priority?: TodoPriorityEnum;
	status?: TodoStatusEnum;
	dueDate?: string | null;
}

// --- API Functions ---

export const getTodos = (query: TodoQuery) => {
	return get<Todo[]>("/api/todo", query);
};

export const createTodo = (data: CreateTodoRequest) => {
	return post<Todo>("/api/todo", data);
};

export const updateTodo = (id: string, data: UpdateTodoRequest) => {
	return put<Todo>(`/api/todo/${id}`, data);
};

export const deleteTodo = (id: string) => {
	return remove<void>(`/api/todo/${id}`);
};
