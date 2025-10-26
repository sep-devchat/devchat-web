/* eslint-disable @typescript-eslint/no-explicit-any */
import { get, put, post } from "./apiCaller";

export interface FriendRequest {
	id: string;
	senderId: string;
	receiverId: string;
	status: number; // 0-Pending, 1-Accepted, 2-Declined, 3-Cancelled
	message: string;
	createdAt: string;
	respondedAt: string | null;
	sender: {
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
	receiver: {
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
	data: FriendRequest[];
	pagination: any;
	message: string;
}

export interface ApiResponse<T> {
	data: T;
	pagination?: any;
	message?: string;
}

export const listSentFriendRequests = (status: number = 0) => {
	return get<ApiResponse<FriendRequest[]>>(
		`/api/user/friend-request/sent?status=${status}`,
	);
};

export const listReceivedFriendRequests = (status: number = 0) => {
	return get<ApiResponse<FriendRequest[]>>(
		`/api/user/friend-requests/received?status=${status}`,
	);
};

export const sendFriendRequest = (data: {
	receiverId: string;
	message: string;
}) => {
	return post<any>(`/api/user-friend`, data);
};

export const updateFriendRequestStatus = (
	id: string,
	data: { status: number },
) => {
	return put<any>(`/api/user-friend/${id}`, data);
};

export const cancelFriendRequest = (id: string) => {
	return put<any>(`/api/user-friend/${id}`, { status: 3 });
};

//wait BE fix
export const unfriendUser = (id: string) => {
	return put<any>(`/api/user-friend/${id}`, { status: 4 });
};

export const listFriends = (page: number = 1, limit: number = 100) => {
	return get<any>(`/api/user-friend?page=${page}&limit=${limit}`);
};

export const listInvitationFriend = () => {
	return get("/api/user-friend/invitation");
};
