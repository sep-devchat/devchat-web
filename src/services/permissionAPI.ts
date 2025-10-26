/* eslint-disable @typescript-eslint/no-explicit-any */
import { get, post, put, remove } from "./apiCaller";

export interface FeaturePermissionResponse {
	id: string;
	code: string;
	name: string;
	description: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string | null;
}

export interface FeaturePermissionRequest {
	code: string;
	name: string;
	description: string;
}

export interface FeaturePermissionUpdateRequest {
	code?: string;
	name?: string;
	description?: string;
}

export interface PaginationResponse<T> {
	data: T;
	pagination: {
		page: number;
		take: number;
		totalRecord: number;
		totalPage: number;
	} | null;
	message?: string;
}

export const listPermissions = (page: number = 1, take: number = 20) => {
	return get<PaginationResponse<FeaturePermissionResponse[]>>(
		`/api/permission?page=${page}&take=${take}`,
	);
};

export const getAllPermissions = () => {
	return get<PaginationResponse<FeaturePermissionResponse[]>>(
		`/api/permission`,
	);
};

export const detailPermission = (id: string) => {
	return get<PaginationResponse<FeaturePermissionResponse>>(
		`/api/permission/${id}`,
	);
};

export const createPermission = (data: FeaturePermissionRequest) => {
	return post<PaginationResponse<FeaturePermissionResponse>>(
		`/api/permission`,
		data,
	);
};

export const updatePermission = (
	id: string,
	data: FeaturePermissionUpdateRequest,
) => {
	return put<PaginationResponse<FeaturePermissionResponse>>(
		`/api/permission/${id}`,
		data,
	);
};

export const deletePermission = (id: string) => {
	return remove<PaginationResponse<FeaturePermissionResponse>>(
		`/api/permission/${id}`,
	);
};
