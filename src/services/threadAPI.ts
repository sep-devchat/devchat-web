import { get, post, put, remove } from "./apiCaller";
import { Profile } from "./auth/auth.type";

export interface ThreadResponse {
	id: string;
	name: string;
	messageId: string;
	channelId: string;
	createdAt: string;
	createdBy: Profile;
	createdById: string;
}

export interface ThreadPostRequest {
	messageId: string;
}

export interface ThreadPutRequest {
	name: string;
}

export interface ThreadListResponse {
	data: ThreadResponse[];
	message: string;
}

export const listThreads = (groupId: string, channelId: string) => {
	return get<ThreadListResponse>(
		`/api/group/${groupId}/channel/${channelId}/thread`,
	);
};

export const detailThread = (
	groupId: string,
	channelId: string,
	threadId: string,
) => {
	return get<ThreadResponse>(
		`/api/group/${groupId}/channel/${channelId}/thread/${threadId}`,
	);
};

export const createThread = (
	groupId: string,
	channelId: string,
	data: ThreadPostRequest,
) => {
	return post<ThreadResponse>(
		`/api/group/${groupId}/channel/${channelId}/thread`,
		data,
	);
};

export const updateThread = (
	groupId: string,
	channelId: string,
	threadId: string,
	data: ThreadPutRequest,
) => {
	return put<ThreadResponse>(
		`/api/group/${groupId}/channel/${channelId}/thread/${threadId}`,
		data,
	);
};

export const deleteThread = (
	groupId: string,
	channelId: string,
	threadId: string,
) => {
	return remove<ThreadResponse>(
		`/api/group/${groupId}/channel/${channelId}/thread/${threadId}`,
	);
};
