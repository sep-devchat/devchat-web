/* eslint-disable @typescript-eslint/no-explicit-any */
import { get, post, put, remove } from "./apiCaller";

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

export const deleteMemberGroup = (groupId: string, data: InviteRequest) => {
	return remove(`/api/group/${groupId}/member`, data);
};

export const updateRoleMember = (
	groupId: string,
	userId: string,
	data: UpdateRoleRequest,
) => {
	return put(`/api/group/${groupId}/member/${userId}/role`, data);
};
