import { get, post, put, remove } from "./apiCaller";

export interface ThreadResponse {
	id: string;
	name: string;
	description: string;
	channelId: string;
	createdAt: string;
	createdBy: string;
}

export interface ThreadPostRequest {
	name: string;
	description: string;
}

export interface ThreadPutRequest {
	name?: string;
	description?: string;
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
