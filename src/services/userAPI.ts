/* eslint-disable @typescript-eslint/no-explicit-any */
import { get, put, remove } from "./apiCaller";
export type { UserLanguage } from "./auth/auth.type";

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
    userLanguages?: import("./auth/auth.type").UserLanguage[];
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
    userLanguages?: import("./auth/auth.type").UserLanguage[];
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

export const deleteUser = (id: string) => {
    return remove<UserResponse>(`/api/user/${id}`);
};

export const setUserActive = (id: string, isActive: boolean) => {
    return put<UserResponse>(`/api/user/${id}/active`, { isActive });
};