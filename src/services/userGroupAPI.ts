/* eslint-disable @typescript-eslint/no-explicit-any */
import { get, post, put, remove } from "./apiCaller";

export interface InviteRequest {
	userIdOrEmail: string;
}

export interface RemoveGrRequest {
	userId: string;
}

export interface UpdateInvitationRequest {
	userIdOrEmail: string;
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

export const inviteToGroup = (groupId: string, data: InviteRequest) => {
	return post(`/api/group/${groupId}/member`, data);
};

export const updateInvitation = (
	groupId: string,
	data: UpdateInvitationRequest,
) => {
	return put(`/api/group/${groupId}/member`, data);
};

export const membersGroup = (groupId: string, page: number, limit: number) => {
	return get(`/api/group/${groupId}/member?page=${page}&limit=${limit}`);
};

export const deleteMemberGroup = (groupId: string, data: RemoveGrRequest) => {
	return remove(`/api/group/${groupId}/member`, data);
};

export const updateRoleMember = (
	groupId: string,
	userId: string,
	data: UpdateRoleRequest,
) => {
	return put(`/api/group/${groupId}/member/${userId}/role`, data);
};

export const listInvitationGr = () => {
	return get("/api/user/group-requests/received?status=0");
};
