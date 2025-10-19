/* eslint-disable @typescript-eslint/no-explicit-any */
import { get, remove } from "./apiCaller";
import { Profile } from "./auth/auth.type";
import { ChannelResponse } from "./channelAPI";

export interface MessageResponse {
	id: string;
	channelId: string;
	channel?: ChannelResponse;
	threadId: string | null;
	senderId: string;
	parentMessageId: string | null;
	content: string;
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date | null;
	sender: Profile;
}

export const listMessages = (
	channelId: string,
	groupId: string,
	threadId?: string,
) => {
	let url = `/api/group/${groupId}/channel/${channelId}/message`;
	if (threadId) {
		url += `?threadId=${threadId}`;
	}
	return get(url);
};

export const deleteMessage = (id: string) => {
	return remove(`/api/message/${id}`);
};
