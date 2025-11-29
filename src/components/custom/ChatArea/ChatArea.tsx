import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChatAreaContainer } from "./ChatArea.styled";
import ChatInput from "../ChatInput/ChatInput";
import { DirectMessageHeader } from "./parts/DirectMessageHeader";
import ChatDialogs from "./parts/ChatDialogs";
import MessagesViewport from "./parts/MessagesViewport"; // giữ nguyên file viewport cũ
import { useChatAreaController } from "./useChatAreaController";

import { useParams, useSearch } from "@tanstack/react-router";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
	detailThread,
	listThreads,
} from "@/api/thread";
import {
	detailUser,
	listAllFriendRequests,
	listFriends,
} from "@/api/user";
import { ThreadHeader } from "./parts/ThreadHeader";
import ThreadPreview from "./parts/ThreadPreview";
import MessageRow from "./parts/MessageRow";
import {
	isSameDay,
	formatDateHeader,
	formatMessageTime,
} from "./utils/date";
import {
	ChatAreaLoading,
	DividerWrapper,
	Line,
	DateText,
} from "./parts/StyledParts";
import { MessageResponse, ThreadResponse, ThreadListResponse } from "@/types";
import {
	ReportMessageDialog,
	ReportUserDialog,
	DeleteMessageDialog,
} from "./dialogs";
import { toast } from "sonner";
import { useSocket } from "@/hooks/useSocket";

const ChatArea: React.FC = () => {
	const params = useParams({ strict: false }) as {
		groupId?: string;
		id?: string;
		userId?: string;
	};
	const search = useSearch({ strict: false }) as { channel?: string };
	const groupId = params.groupId ?? undefined;
	const channelIdParam = search.channel ?? undefined;
	const threadIdParam = params.id ?? undefined;
	const directUserIdParam = params.userId ?? undefined;
	const isDirectMode = !!directUserIdParam && !groupId && !channelIdParam;

	const queryClient = useQueryClient();
	const profile = useSelector((state: RootState) => state.user.profile);

	const [realtimeMessages, setRealtimeMessages] = useState<MessageResponse[]>([]);
	const [friendRequestId, setFriendRequestId] = useState<string | null>(null);
	const [filesFromModal, setFilesFromModal] = useState<File[] | undefined>();
	const [inboxTypeSelected, setInboxTypeSelected] = useState(null);
	const [emitQueue, setEmitQueue] = useState<any[]>([]);
	const [socketLoading, setSocketLoading] = useState(false);
	const [socketReady, setSocketReady] = useState(false);
	const [editingMessage, setEditingMessage] = useState<MessageResponse | null>(
		null,
	);
	const [replyToMessage, setReplyToMessage] = useState<MessageResponse | null>(
		null,
	);
	const [reactionPickerFor, setReactionPickerFor] = useState<string | null>(null);

	const [reportDialogOpen, setReportDialogOpen] = useState(false);
	const [reportSubmitting, setReportSubmitting] = useState(false);
	const [reportReason, setReportReason] = useState("");
	const [reportMessageDialogOpen, setReportMessageDialogOpen] = useState(false);
	const [messagePendingReport, setMessagePendingReport] =
		useState<MessageResponse | null>(null);
	const [reportMessageType, setReportMessageType] = useState(null);

	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [messagePendingDelete, setMessagePendingDelete] =
		useState<MessageResponse | null>(null);
	const [deleteSubmitting, setDeleteSubmitting] = useState(false);

	const listRef = useRef<HTMLDivElement>(null);
	const bottomRef = useRef<HTMLDivElement>(null);
	const lastJoinKeyRef = useRef<string | null>(null);
	const { socket } = useSocket();

	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	useEffect(() => {
		const onResize = () => setWindowWidth(window.innerWidth);
		window.addEventListener("resize", onResize);
		return () => window.removeEventListener("resize", onResize);
	}, []);

	const getResponsiveFontSize = (base: number, medium: number, large: number) => {
		if (windowWidth <= 1220) return `${base}px`;
		if (windowWidth >= 1920) return `${large}px`;
		if (windowWidth >= 1440) return `${medium}px`;
		return `${base}px`;
	};

	const { data: threadDataResp, isLoading: threadLoading } = useQuery<
		ThreadResponse | null
	>({
		queryKey: ["thread", groupId, channelIdParam, threadIdParam],
		queryFn: async () => {
			if (!groupId || !channelIdParam || !threadIdParam) return null;
			const resp = await detailThread(groupId, channelIdParam, threadIdParam);
			return (resp as any)?.data ?? (resp as any);
		},
		enabled: !!(groupId && channelIdParam && threadIdParam),
	});
	const thread = threadDataResp ?? null;

	const { data: threadsResp } = useQuery<ThreadListResponse | null>({
		queryKey: ["threads", groupId, channelIdParam],
		queryFn: async () => {
			if (!groupId || !channelIdParam) return null;
			const resp = await listThreads(groupId, channelIdParam);
			return (resp as any)?.data ?? (resp as any);
		},
		enabled: !!(groupId && channelIdParam),
	});

	const threadsByMessageId = useMemo(() => {
		const map: Record<string, ThreadResponse> = {};
		const arr = (threadsResp as any) ?? [];
		if (Array.isArray(arr)) {
			for (const t of arr) {
				if (t?.messageId) map[t.messageId] = t;
			}
		}
		return map;
	}, [threadsResp]);

	useQuery({
		queryKey: ["dm_opponent", directUserIdParam],
		enabled: !!(isDirectMode && directUserIdParam),
		queryFn: async () => {
			const res = await detailUser(directUserIdParam!);
			return (res as any)?.data ?? (res as any);
		},
	});

	const { data: friendList = [] } = useQuery({
		queryKey: ["friends"],
		enabled: !!isDirectMode,
		queryFn: async () => {
			const res = await listFriends();
			return (res as any)?.data ?? (res as any);
		},
	});

	const { data: friendRequests = [] } = useQuery({
		queryKey: ["friend_requests"],
		enabled: !!isDirectMode,
		queryFn: async () => {
			const res = await listAllFriendRequests();
			return (res as any)?.data ?? (res as any);
		},
	});

	const {
		shouldShowDirectHeader,
		directHeaderProps,
		displayItems,
		messagesLoading,
		messagesError,
		send,
		handleEdit,
		handleDelete,
		handleCopy,
		handleReport,
		handleReply,
		handleReact,
		handleGoToMessage,
		handleCreateThread,
		chatDialogsProps,
	} = useChatAreaController({
		thread,
		groupId,
		channelIdParam,
		threadIdParam,
		directUserIdParam,
		setRealtimeMessages,
		realtimeMessages,
		threadsByMessageId,
		setMessagePendingDelete,
		setDeleteDialogOpen,
		setMessagePendingReport,
		setReportMessageDialogOpen,
		setReportMessageType,
		setEditingMessage,
		setReplyToMessage,
	});

	return (
		<ChatAreaContainer>
			{shouldShowDirectHeader && directHeaderProps && (
				<DirectMessageHeader {...directHeaderProps} />
			)}

			{threadIdParam && <ThreadHeader thread={thread} />}

			<MessagesViewport
				ref={listRef}
				variant={inboxTypeSelected ?? undefined}
				className={inboxTypeSelected ? "items-end" : ""}
			>
				{messagesLoading || threadLoading || socketLoading ? (
					<ChatAreaLoading rows={8} />
				) : messagesError ? (
					<p className="text-sm text-red-500">Failed to load messages.</p>
				) : displayItems.length === 0 ? (
					<p className="text-sm text-muted-foreground">
						{isDirectMode
							? "No direct messages yet. Say hello below."
							: "No messages yet. Start the conversation below."}
					</p>
				) : (
					displayItems.map((item, idx) => {
						if (item.type === "thread") {
							const { threadId, latestMessage, threadMeta } = item.payload;
							const prevItem = displayItems[idx - 1];
							const prevDate =
								prevItem?.type === "msg"
									? prevItem.payload.createdAt
									: prevItem?.payload?.latestMessage?.createdAt;

							const showDateHeader =
								!prevDate || !isSameDay(prevDate, latestMessage.createdAt);

							return (
								<div key={`thread-${threadId}-${latestMessage.id}`}>
									{showDateHeader && (
										<DividerWrapper
											style={{
												marginBottom:
													windowWidth <= 1220
														? "16.8px"
														: windowWidth >= 1920
															? "26.4px"
															: windowWidth >= 1440
																? "19.2px"
																: "24px",
											}}
										>
											<Line />
											<DateText
												style={{
													fontSize: getResponsiveFontSize(12, 13, 16),
												}}
											>
												{formatDateHeader(latestMessage.createdAt)}
											</DateText>
											<Line />
										</DividerWrapper>
									)}

									<ThreadPreview
										threadId={threadId}
										latestMessage={latestMessage}
										threadMeta={threadMeta}
									/>
								</div>
							);
						}

						const m: MessageResponse = item.payload;
						const prevItem = displayItems[idx - 1];
						const prevDate =
							prevItem?.type === "msg"
								? prevItem.payload.createdAt
								: prevItem?.payload?.latestMessage?.createdAt;

						const showDateHeader =
							!prevDate || !isSameDay(prevDate, m.createdAt);

						const isSameSenderAsPrev =
							!showDateHeader &&
							prevItem?.type === "msg" &&
							prevItem.payload?.sender?.id === m.sender?.id;

						const showAvatarAndHeader = !isSameSenderAsPrev;

						const name =
							[m.sender?.firstName, m.sender?.lastName]
								.filter(Boolean)
								.join(" ") ||
							m.sender?.username ||
							"Unknown";

						const initials =
							(m.sender?.firstName?.[0] || "") +
							(m.sender?.lastName?.[0] || "");

						const isCurrentUser = m.sender?.id === profile?.id;
						const positionClassName = isCurrentUser
							? "justify-start flex-row-reverse"
							: "";

						return (
							<div key={m.id}>
								{showDateHeader && (
									<DividerWrapper
										style={{
											marginBottom:
												windowWidth <= 1220
													? "16.8px"
													: windowWidth >= 1920
														? "26.4px"
														: windowWidth >= 1440
															? "19.2px"
															: "24px",
										}}
									>
										<Line />
										<DateText
											style={{
												fontSize: getResponsiveFontSize(12, 13, 16),
											}}
										>
											{formatDateHeader(m.createdAt)}
										</DateText>
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
									handleEdit={handleEdit}
									handleCopy={handleCopy}
									handleReport={handleReport}
									handleDelete={handleDelete}
									handleReply={handleReply}
									handleReact={handleReact}
									reactionPickerFor={reactionPickerFor}
									setReactionPickerFor={setReactionPickerFor}
									formatMessageTime={formatMessageTime}
									handleGoToMessage={handleGoToMessage}
									existingThreadId={threadsByMessageId[m.id]?.id || null}
									handleCreateThread={handleCreateThread}
									codeBlockId={(m as any).codeBlockId}
									channelId={channelIdParam || ""}
									groupId={groupId || ""}
								/>
							</div>
						);
					})
				)}
			</MessagesViewport>

			<DeleteMessageDialog
				open={deleteDialogOpen}
				messageContent={messagePendingDelete?.content || null}
				submitting={deleteSubmitting}
				onOpenChange={(open) => {
					setDeleteDialogOpen(open);
					if (!open) setMessagePendingDelete(null);
				}}
				onConfirm={() => {
					// TODO: logic
				}}
			/>

			<ReportUserDialog
				open={reportDialogOpen}
				reason={reportReason}
				submitting={reportSubmitting}
				onOpenChange={setReportDialogOpen}
				onReasonChange={setReportReason}
				onSubmit={async () => {
					try {
						setReportSubmitting(true);
						toast.success("Report submitted");
						setReportDialogOpen(false);
						setReportReason("");
					} finally {
						setReportSubmitting(false);
					}
				}}
			/>

			<ReportMessageDialog
				open={reportMessageDialogOpen}
				message={messagePendingReport}
				messageType={reportMessageType ?? undefined}
				onOpenChange={(open) => {
					setReportMessageDialogOpen(open);
					if (!open) {
						setMessagePendingReport(null);
						setReportMessageType(null);
					}
				}}
			/>
      
			<ChatInput
				setInboxTypeSelected={setInboxTypeSelected}
				initialFiles={filesFromModal}
				onInitialFilesHandled={() => setFilesFromModal(undefined)}
				onSend={send}
				editingMessage={editingMessage}
				onCancelEdit={() => setEditingMessage(null)}
				replyTo={replyToMessage}
				onCancelReply={() => setReplyToMessage(null)}
				editingMode={!!editingMessage}
			/>

			<ChatDialogs {...chatDialogsProps} />
		</ChatAreaContainer>
	);
};

export default ChatArea;
