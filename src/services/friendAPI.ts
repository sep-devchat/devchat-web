import { get, post, put, remove } from "./apiCaller";

export interface UserInfo {
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
	lastLogin: string;
	timezone: string;
}

export interface FriendRequest {
	id: string;
	senderId: string;
	receiverId: string;
	status: number;
	message: string;
	createdAt: string;
	respondedAt: string | null;
	sender: UserInfo;
	receiver: UserInfo;
}

export interface FriendRequestResponse {
	message: string;
	data: FriendRequest;
}

export interface GetAllFriendsResponse {
	message: string;
	data: FriendRequest[];
	pagination: {
		page: number;
		take: number;
		totalRecord: number;
		totalPage: number;
	};
}

export interface SendFriendRequestPayload {
	receiverId: string;
	message?: string;
}

export interface UpdateFriendRequestPayload {
	status: number;
}

export const sendFriendRequest = (data: SendFriendRequestPayload) => {
	return post<FriendRequestResponse>("/api/user-friend", data);
};

export const getAllFriends = () => {
	return get<GetAllFriendsResponse>("/api/user-friend");
};

export const updateFriendRequestStatus = (
	id: string,
	data: UpdateFriendRequestPayload,
) => {
	return put<FriendRequestResponse>(`/api/user-friend/${id}`, data);
};

export const deleteFriend = (id: string) => {
	return remove<any>(`/api/user-friend/${id}`);
};
