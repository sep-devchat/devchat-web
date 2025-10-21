/* eslint-disable @typescript-eslint/no-explicit-any */
import { get, post } from "./apiCaller";

export interface InviteRequest {
	userId: string;
}

export interface UpdateInvitationRequest {
	userId: string;
	status: number;
}

export interface UpdateRoleRequest {
	role?: {
		name: string;
		level: number;
	};
	permission?: {
		read: boolean;
		write: boolean;
		delete: boolean;
	};
}

export const createRole = () => {
	return post("/api/admin-role");
};

export const listRoleGroup = (
	role?: string,
	search?: string,
	page?: string,
	limit?: string,
) => {
	let url = "/api/admin-role";
	if (role) {
		url += `?role=${role}`;
	}
	if (search) {
		url += `?search=${search}`;
	}
	if (page) {
		url += `?page=${page}`;
	}
	if (limit) {
		url += `?limit=${limit}`;
	}
	return get(url);
};
