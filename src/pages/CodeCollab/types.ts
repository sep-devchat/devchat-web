// types.ts
export interface Change {
	id: string;
	userName: string;
	avatarUrl?: string;
	userId: string;
	timestamp: Date;
	code: string;
}

export interface MessageResponse {
	id: string;
	content?: string;
	createdAt: string;
	channelId?: string;
	threadId?: string | null;
	groupId?: string;
	codeBlockId?: string;
	sender?: {
		id: string;
		firstName?: string;
		lastName?: string;
		username?: string;
		avatarUrl?: string;
	};
	attachments?: any[];
	parentMessageId?: string;
	parentMessage?: MessageResponse;
	thread?: {
		id: string;
	};
}
