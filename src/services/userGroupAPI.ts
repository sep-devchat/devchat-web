/* eslint-disable @typescript-eslint/no-explicit-any */
import { get, post, put, remove, patch } from "./apiCaller";
import { ApiResponse } from "./friendAPI";
export interface GroupInvitationRequest {
	toUserIdOrEmail: string;
	groupId: string;
	message: string;
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
export interface GroupInvitation {
	id: string;
	fromUserId: string;
	toUserId: string;
	groupId: string;
	message: string;
	createdBy: string;
	fromUser: {
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
	toUser: {
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
	group: {
		id: string;
		name: string;
		description: string;
		avatar: string | null;
		createdBy: string;
		createdAt: string;
		updatedAt: string;
		isActive: boolean;
	};
	createdAt: string;
	updatedAt: string;
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
		avatar: string | null;
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
export const inviteToGroup = (data: GroupInvitationRequest) => {
	return post(`/api/group-invitation`, data);
};

export const acceptGroupInvitation = (invitationId: string) => {
	return patch(`/api/group-invitation/${invitationId}/accept`, {});
};

export const declineGroupInvitation = (invitationId: string) => {
	return patch(`/api/group-invitation/${invitationId}/decline`, {});
};

export const deleteGroupInvitation = (invitationId: string) => {
	return remove(`/api/group-invitation/${invitationId}`, {});
};

export const membersGroup = (groupId: string) => {
	return get(`/api/group/${groupId}/members`);
};

export const deleteMemberGroup = (groupId: string, userId: string) => {
	return remove(`/api/group/${groupId}/members/${userId}`);
};

export const updateRoleMember = (
	groupId: string,
	userId: string,
	data: UpdateRoleRequest,
) => {
	return put(`/api/group/${groupId}/member/${userId}/role`, data);
};

export const listReceivedInvitationGr = () => {
	return get<ApiResponse<GroupInvitation[]>>(
		`/api/user/group-invitations/received`,
	);
};

export const listSentInvitationGr = () => {
	return get<ApiResponse<GroupInvitation[]>>(
		`/api/user/group-invitations/sent`,
	);
};

export const listAllPendingInvitations = () => {
	return get<ApiResponse<GroupInvitation[]>>(`/api/group-invitation`);
};

export const leaveGroup = (groupId: string) => {
	return post(`/api/group/${groupId}/members/leave`, {});
};
