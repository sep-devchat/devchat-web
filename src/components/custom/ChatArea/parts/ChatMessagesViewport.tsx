import React, { useMemo } from "react";
import {
	DateText,
	DividerWrapper,
	Line,
	MessagesViewport,
	MessagesViewportVariant,
} from "../ChatArea.styled";
import { MessageRow } from "./MessageRow";
import { MessageResponse } from "@/services/messageAPI";
import { ThreadResponse } from "@/services/threadAPI";
import {
	formatDateHeader,
	formatMessageTime,
	isSameDay,
} from "../ChatArea.helpers";
import ChatAreaLoading from "../ChatAreaLoading";

type ChatDisplayItem = MessageResponse;

export interface ChatMessagesViewportProps {
	listRef: React.RefObject<HTMLDivElement>;
	bottomRef: React.RefObject<HTMLDivElement>;
	variant?: MessagesViewportVariant;
	anchorToEnd: boolean;
	messagesLoading: boolean;
	threadLoading: boolean;
	socketLoading: boolean;
	messagesError: boolean;
	threadError: boolean;
	isDirectMode: boolean;
	threadId?: string;
	messages: MessageResponse[];
	latestMessagePerThread: Map<string, MessageResponse>;
	threadDetailsMap: Record<string, ThreadResponse | null | undefined>;
	threadsByMessageId: Record<string, ThreadResponse>;
	hasMoreMessages: boolean;
	isFetchingOlderMessages: boolean;
	reactionPickerFor: string | null;
	onSetReactionPickerFor: (id: string | null) => void;
	onEdit: (m: MessageResponse) => void;
	onCopy: (m: MessageResponse) => void;
	onReport: (m: MessageResponse) => void;
	onDelete: (m: MessageResponse) => void;
	onReply: (m: MessageResponse) => void;
	onReact: (messageId: string, reaction: string) => void;
	onGoToMessage: (id: string) => void;
	onCreateThread: (m: MessageResponse) => void;
	channelId?: string;
	groupId?: string;
	directUserId?: string;
	currentUserId?: string | null;
}

const ChatMessagesViewport: React.FC<ChatMessagesViewportProps> = ({
	listRef,
	bottomRef,
	variant,
	anchorToEnd,
	messagesLoading,
	threadLoading,
	socketLoading,
	messagesError,
	threadError,
	isDirectMode,
	threadId,
	messages,
	threadsByMessageId,
	hasMoreMessages,
	isFetchingOlderMessages,
	reactionPickerFor,
	onSetReactionPickerFor,
	onEdit,
	onCopy,
	onReport,
	onDelete,
	onReply,
	onReact,
	onGoToMessage,
	onCreateThread,
	channelId,
	groupId,
	directUserId,
	currentUserId,
}) => {
	const displayItems = useMemo<ChatDisplayItem[]>(() => {
		return messages;
	}, [messages]);

	const renderHistoryNotice = () => {
		if (!displayItems.length) return null;
		if (isFetchingOlderMessages) {
			return (
				<div className="flex justify-center py-2 text-xs text-muted-foreground">
					Loading earlier messages...
				</div>
			);
		}
		if (hasMoreMessages) {
			return (
				<div className="flex justify-center py-2 text-[11px] uppercase tracking-wide text-muted-foreground opacity-80">
					Scroll up for earlier messages
				</div>
			);
		}
		return (
			<div className="flex justify-center py-2 text-[11px] uppercase tracking-wide text-muted-foreground opacity-70">
				You're all caught up
			</div>
		);
	};

	const renderContent = () => {
		if (messagesLoading || threadLoading || socketLoading) {
			return <ChatAreaLoading rows={8} />;
		}
		if (messagesError || threadError) {
			return <p className="text-sm text-red-500">Failed to load messages.</p>;
		}
		if (displayItems.length === 0) {
			return (
				<p className="text-sm text-muted-foreground">
					{isDirectMode
						? "No direct messages yet. Say hello below."
						: "No messages yet. Start the conversation below."}
				</p>
			);
		}

		return (
			<>
				{renderHistoryNotice()}
				{displayItems.map((m, idx) => {
					const prevMessage = displayItems[idx - 1];
					const prevDate = prevMessage?.createdAt;
					const showDateHeader = !prevDate || !isSameDay(prevDate, m.createdAt);
					const isSameSenderAsPrev =
						!showDateHeader &&
						(prevMessage?.sender?.id ?? null) === (m.sender?.id ?? null);
					const showAvatarAndHeader = !isSameSenderAsPrev;

					const name =
						[m.sender?.firstName, m.sender?.lastName]
							.filter(Boolean)
							.join(" ") ||
						m.sender?.username ||
						"Unknown";
					const initials =
						(m.sender?.firstName?.[0] || "") + (m.sender?.lastName?.[0] || "");
					const isCurrentUser =
						!!currentUserId && m.sender?.id === currentUserId;
					const positionClassName = isCurrentUser
						? "justify-start flex-row-reverse"
						: "";

					return (
						<div key={m.id} className="w-full">
							{showDateHeader && (
								<DividerWrapper>
									<Line />
									<DateText>{formatDateHeader(m.createdAt)}</DateText>
									<Line />
								</DividerWrapper>
							)}
							<MessageRow
								m={m}
								name={name}
								initials={initials}
								isCurrentUser={isCurrentUser}
								positionClassName={positionClassName}
								showAvatarAndHeader={showAvatarAndHeader}
								handleEdit={onEdit}
								handleCopy={onCopy}
								handleReport={onReport}
								handleDelete={onDelete}
								handleReply={onReply}
								handleReact={onReact}
								reactionPickerFor={reactionPickerFor}
								setReactionPickerFor={onSetReactionPickerFor}
								formatMessageTime={formatMessageTime}
								handleGoToMessage={onGoToMessage}
								existingThreadId={threadsByMessageId[m.id]?.id || null}
								handleCreateThread={onCreateThread}
								codeBlockId={m.codeBlockId}
								channelId={channelId || ""}
								groupId={groupId || ""}
								directUserId={directUserId}
								isThreadMode={!!threadId}
							/>
						</div>
					);
				})}
			</>
		);
	};

	return (
		<MessagesViewport
			ref={listRef}
			variant={variant}
			className={anchorToEnd ? "items-end" : ""}
		>
			{renderContent()}
			<div ref={bottomRef} />
		</MessagesViewport>
	);
};

export default ChatMessagesViewport;
