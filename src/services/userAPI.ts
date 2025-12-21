/* eslint-disable @typescript-eslint/no-explicit-any */
import { get, post, put } from "./apiCaller";

export interface UserResponse {
	id: string;
	username: string;
	email: string;
	firstName: string;
	lastName: string;
	avatarUrl: string | null;
	isActive: true;
	isAdmin?: boolean;
	emailVerified: false;
	createdAt: Date;
	updatedAt: Date;
	lastLogin: Date;
	timezone: string;
}

export interface UserLanguage {
	languageId: string;
	proficiencyLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
	orderIndex: number;
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
	userLanguages?: UserLanguage[];
}

export const listUsers = (page: number, limit: number, search?: string) => {
	let url = `/api/user?page=${page}&limit=${limit}`;
	if (search && search.trim()) {
		url += `&search=${encodeURIComponent(search.trim())}`;
	}
	return get<UserResponse[]>(url);
};

export const detailUser = (id: string) => {
	return get<UserResponse>(`/api/user/${id}`);
};

export const updateUser = (id: string, data: UserPostRequest) => {
	return put<UserPostRequest>(`/api/user/${id}`, data);
};

export const deleteUser = (id: string, banReason: string) => {
	return post<UserResponse>(`/api/user/${id}/delete`, {
		banReason: banReason.trim(),
	});
};

export const setUserActive = (id: string, isActive: boolean) => {
	return put<UserResponse>(`/api/user/${id}/active`, { isActive });
};
