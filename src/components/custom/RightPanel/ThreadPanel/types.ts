import type { MessageResponse } from "@/services/messageAPI";

export interface UIMessage {
	id: string;
	author: string;
	content: string;
	time: string;
	avatarUrl?: string;
	date: string;
	optimistic?: boolean;
	isCurrentUser?: boolean;
	attachments?: Array<{ name: string; size: number; type: string }>;
	codeBlock?: { language?: string; content: string } | null;
}

export type GroupedMessages = Array<[string, UIMessage[]]>;

export interface ThreadPanelProps {
	groupId: string;
	channelId: string;
	threadId?: string;
	onClose?: () => void;
	onThreadCreated?: (threadId: string) => void;
}

export interface ThreadMessagesProps {
	groupedMessages: GroupedMessages;
	messageMap: Map<string, MessageResponse>;
	actionMenuFor: string | null;
	setActionMenuFor: (val: string | null) => void;
	reactionPickerFor: string | null;
	setReactionPickerFor: (val: string | null) => void;
	handleGoToMessage: (id: string) => void;
	handleCopyMessage: (message: MessageResponse) => void;
	handleEditMessage: (message: MessageResponse) => void;
	handleReplyMessage: (message: MessageResponse) => void;
	handleReportMessage: (message: MessageResponse) => void;
	handleDeleteMessage: (message: MessageResponse) => void;
	handleReact: (messageId: string, reaction: string) => void;
	handleCreateThreadFromThreadView: (message: MessageResponse) => void;
	messagesContainerRef: (node: HTMLDivElement | null) => void;
	onMessagesScroll: () => void;
	bottomRef: (node: HTMLDivElement | null) => void;
	threadId?: string;
}
