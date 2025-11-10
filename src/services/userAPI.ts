/* eslint-disable @typescript-eslint/no-explicit-any */
import { get, put, remove } from "./apiCaller";

export interface UserResponse {
	id: string;
	username: string;
	email: string;
	firstName: string;
	lastName: string;
	avatarUrl: string | null;
	isActive: true;
	emailVerified: false;
	createdAt: Date;
	updatedAt: Date;
	lastLogin: Date;
	timezone: string;
}

export interface UserPostRequest {
	id?: string;
	username?: string;
	email?: string | null;
	firstName?: string | null;
	lastName?: string | null;
	avatarUrl?: string | null;
	timezone?: string;
	isActive?: boolean;
	password?: string;
}

export const listUsers = (page: number, limit: number) => {
	return get<UserResponse[]>(`/api/user?page=${page}&limit=${limit}`);
};

export const detailUser = (id: string) => {
	return get<UserResponse>(`/api/user/${id}`);
};

export const updateUser = (id: string, data: UserPostRequest) => {
	return put<UserPostRequest>(`/api/user/${id}`, data);
};

export const deleteUser = (id: string) => {
	return remove<UserResponse>(`/api/user/${id}`);
};
