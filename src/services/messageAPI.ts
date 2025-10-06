/* eslint-disable @typescript-eslint/no-explicit-any */
import { get } from "./apiCaller";
import { Profile } from "./auth/auth.type";

export interface MessageResponse {
	id: string;
	channelId: string;
	threadId: string | null;
	senderId: string;
	parentMessageId: string | null;
	content: string;
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date | null;
	sender: Profile;
}

export const listMessages = () => {
	return get<MessageResponse[]>("/api/message");
};
