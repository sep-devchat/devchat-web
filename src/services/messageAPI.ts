/* eslint-disable @typescript-eslint/no-explicit-any */
import { get, remove } from "./apiCaller";
import { Profile } from "./auth/auth.type";
import { ChannelResponse } from "./channelAPI";
import { ThreadResponse } from "./threadAPI";

export interface MessageResponse {
	id: string;
	channelId: string;
	channel?: ChannelResponse;
	thread?: ThreadResponse;
	senderId: string;
	parentMessageId: string | null;
	parentMessage: MessageResponse | null;
	content: string;
	createdAt: Date;
	updatedAt: Date;
	sender: Profile;
	codeBlockId?: string;
	groupId?: string;
}

export interface ThreadMessageResponse
	extends Omit<MessageResponse, "parentMessage"> {
	parentMessage: ThreadMessageResponse | null;
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

// Direct Message peers: users you've exchanged direct messages with
export const listDirectMessagePeers = () => {
	return get<Profile[]>(`/api/message/direct/peers`);
};
