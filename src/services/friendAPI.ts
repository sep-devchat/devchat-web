/* eslint-disable @typescript-eslint/no-explicit-any */
import { get, post, remove, patch, type ApiResponseDto } from "./apiCaller";
import type { UserLanguage } from "./auth/auth.type";

export interface FriendUser {
	id: string;
	username: string;
	email: string;
	firstName: string | null;
	lastName: string | null;
	avatarUrl: string | null;
	avatar?: string | null;
	name?: string;
	handle?: string;
	mutualFriends?: number;
	isOnline?: boolean;
	isActive: boolean;
	isAdmin?: boolean;
	emailVerified: boolean;
	createdAt: string;
	updatedAt?: string;
	lastLogin?: string | null;
	timezone?: string | null;
	userLanguages?: UserLanguage[];
}

export type FriendListResponse = ApiResponseDto<FriendUser[]>;

export interface FriendRequest {
	id: string;
	fromUserId: string;
	toUserId: string;
	message: string;
	createdBy: string;
	createdAt: string;
	updatedAt: string;
	fromUser: {
		id: string;
		username: string;
		email: string;
		firstName: string;
		lastName: string;
		avatarUrl: string | null;
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
		avatarUrl: string | null;
		isActive: boolean;
		emailVerified: boolean;
		createdAt: string;
		updatedAt: string;
		lastLogin: string | null;
		timezone: string | null;
	};
}

export interface FriendRequestResponse {
	data: FriendRequest;
	pagination: null;
	message: string;
}

export interface ApiResponse<T> {
	data: T;
	pagination?: any;
	message?: string;
}

export interface FriendRequestListResponse {
	data: FriendRequest[];
	pagination: {
		page: number;
		take: number;
		totalRecord: number;
		totalPage: number;
	};
	message: string;
}

export interface MutualFriend {
	id: string;
	username: string;
	email: string;
	firstName: string;
	lastName: string;
	avatarUrl: string | null;
	isActive: boolean;
	emailVerified: boolean;
	createdAt: string;
	updatedAt: string;
	lastLogin: string | null;
	timezone: string | null;
}

export interface MutualFriendsResponse {
	friends: MutualFriend[];
	count: number;
}

export const listAllFriendRequests = (
	page: number = 1,
	limit: number = 100,
	search?: string,
) => {
	let url = `/api/friend-request?page=${page}&limit=${limit}`;
	if (search) {
		url += `&search=${encodeURIComponent(search)}`;
	}
	return get<FriendRequestListResponse>(url);
};

export const listSentFriendRequests = (search?: string) => {
	const params = search ? `?search=${encodeURIComponent(search)}` : "";
	return get<FriendRequestListResponse>(
		`/api/user/friend-requests/sent${params}`,
	);
};

export const listReceivedFriendRequests = (search?: string) => {
	const params = search ? `?search=${encodeURIComponent(search)}` : "";
	return get<FriendRequestListResponse>(
		`/api/user/friend-requests/received${params}`,
	);
};

export const sendFriendRequest = (data: {
	toUserId: string;
	message: string;
}) => {
	return post<FriendRequestResponse>("/api/friend-request", data);
};

export const acceptFriendRequest = (friendRequestId: string) => {
	return patch<any>(`/api/friend-request/${friendRequestId}/accept`);
};

export const declineFriendRequest = (friendRequestId: string) => {
	return patch<any>(`/api/friend-request/${friendRequestId}/decline`);
};

export const deleteFriendRequest = (friendRequestId: string) => {
	return remove<any>(`/api/friend-request/${friendRequestId}`);
};

export const unfriendUser = (friendId: string) => {
	return remove<any>(`/api/friends/${friendId}`);
};

export const listFriends = (
	page: number = 1,
	limit: number = 100,
	search: string = "",
) => {
	return get<FriendUser[]>(
		`/api/friends?page=${page}&limit=${limit}${search ? `&search=${search}` : ""}`,
	);
};

export const listInvitationFriend = () => {
	return get("/api/user-friend/invitation");
};

export const getMutualFriends = (userId: string) => {
	return get<MutualFriendsResponse>(`/api/friends/${userId}/mutual`);
};
