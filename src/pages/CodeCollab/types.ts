// types.ts
export interface Change {
	id: string;
	userName: string;
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
	sender?: {
		id: string;
		firstName?: string;
		lastName?: string;
		username?: string;
		avatarUrl?: string;
	};
	attachments?: any[];
}
