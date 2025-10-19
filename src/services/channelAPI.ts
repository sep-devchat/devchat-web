/* eslint-disable @typescript-eslint/no-explicit-any */
import { get, post, put, remove } from "./apiCaller";
import { GroupResponse } from "./groupAPI";

export interface ChannelResponse {
	id: string;
	name: string;
	description: string | null;
	groupId: string;
	group?: GroupResponse;
	createdAt: Date;
	createdBy: string;
	isPrivate?: boolean;
}

export interface ChannelPostRequest {
	name: string;
	description?: string | null;
	isPrivate?: boolean;
}

export interface ChannelPutRequest {
	name?: string;
	description?: string | null;
	isPrivate?: boolean;
}

export interface ChannelListResponse {
	data: ChannelResponse[];
	pagination: any;
	message: string;
}

export const listChannels = (groupId: string) => {
	return get<ChannelListResponse>(`/api/group/${groupId}/channel`);
};

export const detailChannel = (groupId: string, channelId: string) => {
	return get<ChannelResponse>(`/api/group/${groupId}/channel/${channelId}`);
};

export const createChannel = (groupId: string, data: ChannelPostRequest) => {
	return post<ChannelResponse>(`/api/group/${groupId}/channel`, data);
};

export const updateChannel = (
	groupId: string,
	channelId: string,
	data: ChannelPutRequest,
) => {
	return put<ChannelResponse>(
		`/api/group/${groupId}/channel/${channelId}`,
		data,
	);
};

export const deleteChannel = (groupId: string, channelId: string) => {
	return remove<ChannelResponse>(`/api/group/${groupId}/channel/${channelId}`);
};
