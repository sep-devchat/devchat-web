import React, { useMemo } from "react";
import {
	DateText,
	DividerWrapper,
	Line,
	MessagesViewport,
	MessagesViewportVariant,
} from "../ChatArea.styled";
import ThreadPreview from "../ThreadPreview";
import { MessageRow } from "./MessageRow";
import { MessageResponse } from "@/services/messageAPI";
import { ThreadResponse } from "@/services/threadAPI";
import {
	formatDateHeader,
	formatMessageTime,
	isSameDay,
} from "../ChatArea.helpers";
import ChatAreaLoading from "../ChatAreaLoading";

interface ThreadPreviewPayload {
	threadId: string;
	latestMessage: MessageResponse;
	threadMeta: ThreadResponse | null | undefined;
}

type ChatDisplayItem =
	| { type: "thread"; payload: ThreadPreviewPayload }
	| { type: "msg"; payload: MessageResponse };

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
	latestMessagePerThread,
	threadDetailsMap,
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
		if (threadId) {
			return messages.map((msg) => ({ type: "msg", payload: msg }));
		}

		const items: ChatDisplayItem[] = [];
		const threadsAdded = new Set<string>();

		const threadPreviews: ThreadPreviewPayload[] = Array.from(
			latestMessagePerThread.entries(),
		).map(([threadIdValue, latestMessage]) => ({
			threadId: threadIdValue,
			latestMessage,
			threadMeta: threadDetailsMap[threadIdValue] ?? null,
		}));

		threadPreviews.sort((a, b) => {
			const ta = new Date(a.latestMessage.createdAt).getTime();
			const tb = new Date(b.latestMessage.createdAt).getTime();
			return ta - tb;
		});

		for (const preview of threadPreviews) {
			items.push({ type: "thread", payload: preview });
			threadsAdded.add(preview.threadId);
		}

		for (const msg of messages) {
			const tid = msg.thread?.id;
			if (!tid || !threadsAdded.has(tid)) {
				items.push({ type: "msg", payload: msg });
			}
		}

		items.sort((a, b) => {
			const ta =
				a.type === "msg"
					? new Date(a.payload.createdAt).getTime()
					: new Date(a.payload.latestMessage.createdAt).getTime();
			const tb =
				b.type === "msg"
					? new Date(b.payload.createdAt).getTime()
					: new Date(b.payload.latestMessage.createdAt).getTime();
			return ta - tb;
		});

		return items;
	}, [messages, latestMessagePerThread, threadDetailsMap, threadId]);

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
				{displayItems.map((item, idx) => {
					if (item.type === "thread") {
						const {
							threadId: threadIdentifier,
							latestMessage,
							threadMeta,
						} = item.payload;
						const prevItem = displayItems[idx - 1];
						const prevDate = prevItem
							? prevItem.type === "msg"
								? prevItem.payload.createdAt
								: prevItem.payload.latestMessage.createdAt
							: undefined;
						const showDateHeader =
							!prevDate || !isSameDay(prevDate, latestMessage.createdAt);

						return (
							<div
								key={`thread-${threadIdentifier}-${latestMessage.id}`}
								className="w-full"
							>
								{showDateHeader && (
									<DividerWrapper>
										<Line />
										<DateText>
											{formatDateHeader(latestMessage.createdAt)}
										</DateText>
										<Line />
									</DividerWrapper>
								)}
								<ThreadPreview
									threadId={threadIdentifier}
									latestMessage={latestMessage}
									threadMeta={threadMeta}
								/>
							</div>
						);
					}

					const m: MessageResponse = item.payload;
					const prevItem = displayItems[idx - 1];
					const prevDate = prevItem
						? prevItem.type === "msg"
							? prevItem.payload.createdAt
							: prevItem.payload.latestMessage.createdAt
						: undefined;
					const showDateHeader = !prevDate || !isSameDay(prevDate, m.createdAt);
					const isSameSenderAsPrev =
						!showDateHeader &&
						prevItem?.type === "msg" &&
						(prevItem.payload?.sender?.id ?? null) === (m.sender?.id ?? null);
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
