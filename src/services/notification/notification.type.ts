export interface NotificationResponse {
	id: string;
	toUserId: string;
	title: string;
	content: string;
	notificationSource: string;
	isRead: boolean;
	createdAt: string;
}

export interface NotificationQuery {
	unread?: boolean;
	cursorCreatedAt?: string;
	limit?: number;
}
