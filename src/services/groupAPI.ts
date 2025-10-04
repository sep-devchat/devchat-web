/* eslint-disable @typescript-eslint/no-explicit-any */
import { get, post, put, remove } from "./apiCaller";

export interface GroupResponse {
	id: string;
	name: string;
	description: string | null;
	avatar: string | null;
	createdBy: string;
	createdAt: Date;
	updatedAt: Date;
	isActive: boolean;
}

export interface GroupPostRequest {
	id?: string;
	name: string;
	description: string | null;
	avatar: string | null;
}

export const listGroups = () => {
	return get<GroupResponse[]>("/api/group?page=1&limit=10");
};

export const detailGroup = (id: string) => {
	return get<GroupResponse>(`/api/group/${id}`);
};

export const createGroup = (data: GroupPostRequest) => {
	return post<GroupResponse>("/api/group", data);
};

export const updateGroup = (id: string, data: GroupPostRequest) => {
	return put<GroupResponse>(`/api/group/${id}`, data);
};

export const deleteGroup = (id: string) => {
	return remove<GroupResponse>(`/api/group/${id}`);
};
