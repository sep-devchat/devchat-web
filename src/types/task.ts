// This file defines the core Task types based on the backend's DTOs.

// --- Placeholder Types ---
// Ideally, these interfaces would be in their own dedicated files (e.g., src/types/user.ts)
// but are included here for simplicity based on the request.

/**
 * Placeholder for the User object.
 * Based on the `UserResponse` class mentioned in `TaskResponse`.
 */
export interface User {
	id: string;
	username: string;
	email: string;
	firstName: string;
	lastName: string;
	avatarUrl?: string;
	// Other properties like avatar, etc., would go here.
}

/**
 * Placeholder for the Group object.
 * Based on the `GroupResponse` class mentioned in `TaskResponse`.
 */
export interface Group {
	id: string;
	name: string;
	// Other properties like description, members, etc., would go here.
}

// --- Enums ---

/**
 * Defines the possible statuses for a task.
 * Matches `TaskStatusEnum` from the backend.
 */
export enum TaskStatus {
	TODO = 0,
	IN_PROGRESS = 1,
	DONE = 2,
}

/**
 * Defines the possible priority levels for a task.
 * Matches `TaskPriorityEnum` from the backend.
 */
export enum TaskPriority {
	LOW = 0,
	MEDIUM = 1,
	HIGH = 2,
}

// --- Main Task Interface ---

/**
 * Represents a Task object in the frontend application.
 * This interface is derived from the `TaskResponse` DTO.
 */
export interface Task {
	id: string;
	name: string;
	description: string | null;
	status: TaskStatus;
	priority: TaskPriority;
	startDate: string | null;
	dueDate: string | null; // Dates are serialized as strings over the wire.
	createdAt: string;
	updatedAt: string;
	isActive: boolean;

	// Relational IDs
	groupId: string;
	createdBy: string;
	assigneeId: string | null;

	// Expanded relational objects
	creator: User;
	group: Group;
	assignee: User | null;
}
