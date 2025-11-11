import { get, post, put, remove } from "./apiCaller";
import { ApiResponse } from "./friendAPI";

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

export interface GroupRequest {
	id: string;
	groupId: string;
	userId: string;
	addedById: string;
	joinedAt: string | null;
	invitedAt: string;
	status: number;
	group: {
		id: string;
		name: string;
		description: string;
		avatar: string;
		createdBy: string;
		createdAt: string;
		updatedAt: string;
		isActive: boolean;
	};
	user: {
		id: string;
		username: string;
		email: string;
		firstName: string;
		lastName: string;
		avatarUrl: string;
		isActive: boolean;
		emailVerified: boolean;
		createdAt: string;
		updatedAt: string;
		lastLogin: string | null;
		timezone: string | null;
	};
	addedBy: {
		id: string;
		username: string;
		email: string;
		firstName: string;
		lastName: string;
		avatarUrl: string;
		isActive: boolean;
		emailVerified: boolean;
		createdAt: string;
		updatedAt: string;
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
	return get(`/api/group/${groupId}/member`, { page, limit });
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

export const listReceivedInvitationGr = (status: number = 0) => {
	return get(`/api/user/group-requests/received?status=${status}`);
};

export const listSentInvitationGr = (status: number = 0) => {
	return get<ApiResponse<GroupRequest[]>>(
		`/api/user/group-requests/sent?status=${status}`,
	);
};
