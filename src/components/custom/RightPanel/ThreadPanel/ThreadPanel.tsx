import React, {
	useState,
	useRef,
	useCallback,
	useEffect,
	useMemo,
	useLayoutEffect,
} from "react";
import { useSelector } from "react-redux";
import { X, Hash, Folder } from "lucide-react";
import {
	PageWrapper,
	CPHeader,
	CPHeaderIcon,
	CPHeaderLeft,
	CPTitle,
	ThreadIcon,
	MessageInput,
	MessagesArea,
	Message,
	Avatar,
	MessageContent,
	MessageHeader,
	AuthorName,
	MessageTime,
	DividerWrapper,
	Line,
	DateText,
	CloseButton,
} from "./ThreadPanel.styled";
import MarkdownPreview from "@/components/custom/MarkdownPreview";
import ChatInput from "@/components/custom/ChatInput/ChatInput";
import { detailThread } from "@/services/threadAPI";
import { MessageResponse } from "@/services/messageAPI";
import { SocketEvents } from "@/utils/constants";
import { useQueryClient } from "@tanstack/react-query";
import useSocket from "@/hooks/useSocket";
import useSocketEvent from "@/hooks/useSocketEvent";
import { RootState } from "@/store";
import { detailUser } from "@/services/userAPI";
import { ChatInputPayload } from "@/components/custom/ChatInputComponent/ChatTypeModal/InboxType";
// Removed thread creation, no need for add/invalidate actions
// Thêm ngay sau các imports, trước interface UIMessage

const responsiveStyles = `
  <style>
    @media (min-width: 1440px) and (max-width: 1919px) {
      .thread-panel .text-sm,
      .thread-panel input[type="text"] { font-size: 13px !important; }
      .thread-panel .text-xs,
      .thread-panel .text-[13px] { font-size: 13px !important; }
      .thread-panel .text-[11px],
      .thread-panel .text-[10px] { font-size: 12px !important; }
      .thread-panel .px-3 { padding-left: 9.6px; padding-right: 9.6px; }
      .thread-panel .py-2 { padding-top: 6.4px; padding-bottom: 6.4px; }
      .thread-panel .px-5 { padding-left: 16px; padding-right: 16px; }
      .thread-panel .gap-1\.5 { gap: 4.8px; }
      .thread-panel .gap-6 { gap: 19.2px; }
      .thread-panel .rounded-2xl { border-radius: 12.8px; }
      .thread-panel .rounded-lg { border-radius: 6.4px; }
      .thread-panel .rounded-md { border-radius: 4.8px; }
      .thread-panel .max-w-\[220px\] { max-width: 176px; }
    }
    @media (max-width: 1220px) {
      .thread-panel .text-sm,
      .thread-panel input[type="text"] { font-size: 13px !important; }
      .thread-panel .text-xs,
      .thread-panel .text-[13px] { font-size: 12px !important; }
      .thread-panel .text-[11px],
      .thread-panel .text-[10px] { font-size: 11px !important; }
      .thread-panel .px-3 { padding-left: 8.4px; padding-right: 8.4px; }
      .thread-panel .py-2 { padding-top: 5.6px; padding-bottom: 5.6px; }
      .thread-panel .px-5 { padding-left: 14px; padding-right: 14px; }
      .thread-panel .gap-1\.5 { gap: 4.2px; }
      .thread-panel .gap-6 { gap: 16.8px; }
      .thread-panel .rounded-2xl { border-radius: 11.2px; }
      .thread-panel .rounded-lg { border-radius: 5.6px; }
      .thread-panel .rounded-md { border-radius: 4.2px; }
      .thread-panel .max-w-\[78%\] { max-width: 68%; }
      .thread-panel .max-w-\[220px\] { max-width: 154px; }
    }
    @media (min-width: 1920px) {
      .thread-panel .text-sm,
      .thread-panel input[type="text"] { font-size: 16px !important; }
      .thread-panel .text-xs,
      .thread-panel .text-[13px] { font-size: 16px !important; }
      .thread-panel .text-[11px],
      .thread-panel .text-[10px] { font-size: 14px !important; }
      .thread-panel .px-3 { padding-left: 13.2px; padding-right: 13.2px; }
      .thread-panel .py-2 { padding-top: 8.8px; padding-bottom: 8.8px; }
      .thread-panel .px-5 { padding-left: 22px; padding-right: 22px; }
      .thread-panel .gap-1\.5 { gap: 6.6px; }
      .thread-panel .gap-6 { gap: 26.4px; }
      .thread-panel .rounded-2xl { border-radius: 17.6px; }
      .thread-panel .rounded-lg { border-radius: 8.8px; }
      .thread-panel .rounded-md { border-radius: 6.6px; }
      .thread-panel .max-w-\[220px\] { max-width: 242px; }
    }
  </style>
`;
interface UIMessage {
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

interface ThreadPanelProps {
	groupId: string;
	channelId: string;
	threadId?: string;
	onClose?: () => void;
	onThreadCreated?: (threadId: string) => void;
}

const ThreadPanel: React.FC<ThreadPanelProps> = ({
	groupId,
	channelId,
	threadId,
	onClose,
}) => {
	// Creation removed: dispatch and channelKey no longer needed

	const [threadName, setThreadName] = useState<string>("Thread");
	const [realtimeMessages, setRealtimeMessages] = useState<MessageResponse[]>(
		[],
	);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const messagesContainerRef = useRef<HTMLDivElement>(null);
	const [userScrolledUp, setUserScrolledUp] = useState(false);

	const [threadCreatorInfo, setThreadCreatorInfo] = useState<{
		name: string;
		avatarUrl?: string;
	} | null>(null);

	useEffect(() => {
		console.log("threadCreatorInfo:", threadCreatorInfo);
	}, [threadCreatorInfo]);

	const profile = useSelector((state: RootState) => state.user.profile);

	const bottomRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (threadId && groupId && channelId) {
			loadThreadDetails();
		}
	}, [threadId, groupId, channelId]);

	const queryClient = useQueryClient();
	const { socket } = useSocket();

	const [baseMessages, setBaseMessages] = useState<MessageResponse[]>([]);

	useEffect(() => {
		setRealtimeMessages([]);
		setBaseMessages([]);
		if (!socket || !threadId || !groupId || !channelId) return;
		const req = { groupId, channelId, threadId };
		try {
			socket.emit(SocketEvents.FETCH_THREAD_MESSAGES, req, (resp: any) => {
				try {
					const raw = resp?.data ?? resp;
					if (Array.isArray(raw)) {
						const sortRaw = raw.sort(
							(a, b) =>
								new Date(a.createdAt).getTime() -
								new Date(b.createdAt).getTime(),
						);
						setBaseMessages(sortRaw as MessageResponse[]);
						queryClient.setQueryData(
							["thread_messages", groupId, channelId, threadId],
							sortRaw,
						);
					}
				} catch (e) {
					console.error(
						"[ThreadPanel] error parsing FETCH_THREAD_MESSAGES ack",
						e,
					);
				}
			});
		} catch (e) {
			console.error("[ThreadPanel] emit FETCH_THREAD_MESSAGES failed", e);
		}
	}, [socket, threadId, groupId, channelId, queryClient]);

	useEffect(() => {
		if (!socket) return;
		if (!threadId || !groupId || !channelId) {
			socket.emit(SocketEvents.CHAT_VIEW, {
				type: "thread",
				active: false,
			});
			return;
		}
		socket.emit(SocketEvents.CHAT_VIEW, {
			type: "thread",
			groupId,
			channelId,
			threadId,
			active: true,
		});
		return () => {
			socket.emit(SocketEvents.CHAT_VIEW, {
				type: "thread",
				groupId,
				channelId,
				threadId,
				active: false,
			});
		};
	}, [socket, threadId, groupId, channelId]);

	const mergedMessages: MessageResponse[] = useMemo(() => {
		const base = baseMessages;
		if (realtimeMessages.length === 0) return base;
		const map = new Map<string, MessageResponse>();
		base.forEach((m) => map.set(m.id, m));
		realtimeMessages.forEach((m) => map.set(m.id, m));
		return Array.from(map.values()).sort(
			(a, b) =>
				new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
		);
	}, [baseMessages, realtimeMessages]);

	console.log("mergedMessages:", mergedMessages);

	// Auto scroll handling: stay pinned to bottom unless user scrolled up significantly
	useEffect(() => {
		const el = messagesContainerRef.current;
		if (!el) return;
		const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
		const shouldAutoScroll = !userScrolledUp || distanceFromBottom < 160; // always on first load or near bottom
		if (shouldAutoScroll) {
			el.scrollTop = el.scrollHeight;
		}
	}, [mergedMessages, userScrolledUp]);

	const handleMessagesScroll = () => {
		const el = messagesContainerRef.current;
		if (!el) return;
		const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
		// If user more than 200px away from bottom, mark scrolled up
		setUserScrolledUp(distanceFromBottom > 200);
	};

	const scrollToBottomInstant = useCallback(() => {
		const container = messagesContainerRef.current;
		try {
			if (container) {
				container.scrollTop = container.scrollHeight;
			}
			// Anchor-based fallback for cases where direct scrollTop is ignored due to layout timing
			bottomRef.current?.scrollIntoView({ behavior: "auto" });
		} catch {
			/* noop */
		}
	}, []);

	useLayoutEffect(() => {
		scrollToBottomInstant();
	}, [baseMessages, mergedMessages, scrollToBottomInstant]);

	const uiMessages: UIMessage[] = useMemo(() => {
		return mergedMessages.map((m) => {
			const sender: any = m.sender;
			const name = sender
				? sender.firstName && sender.lastName
					? `${sender.firstName} ${sender.lastName}`
					: sender.username || "Unknown User"
				: "Unknown User";
			// basic attachments passthrough if server provides (not typed in MessageResponse but used in ChatArea)
			const rawAttachments: any[] = Array.isArray((m as any).attachments)
				? (m as any).attachments
				: [];
			const parsedAttachments = rawAttachments.map((a) => ({
				name: a.name,
				size: a.size,
				type: a.type,
			}));
			// detect inline fenced code block in content for display convenience
			let codeBlock: UIMessage["codeBlock"] = null;
			const fenceMatch = m.content?.match(/```(\w+)?\n[\s\S]*?```/);
			if (fenceMatch) {
				const full = fenceMatch[0];
				const langMatch = full.match(/^```(\w+)?/);
				const language = langMatch?.[1];
				const inner = full.replace(/^```(\w+)?\n/, "").replace(/```$/, "");
				codeBlock = { language, content: inner };
			}
			const optimisticFlag = Boolean(
				(m as any)?.optimistic ||
					(typeof m.id === "string" && m.id.startsWith("optimistic-")) ||
					(typeof m.id === "string" && m.id.startsWith("optimistic-preview")),
			);
			return {
				id: m.id,
				author: name,
				content: m.content,
				time: new Date(m.createdAt).toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
				}),
				avatarUrl:
					sender?.avatarUrl ||
					"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
				date: new Date(m.createdAt).toLocaleDateString("en-US", {
					month: "long",
					day: "numeric",
					year: "numeric",
				}),
				optimistic: optimisticFlag,
				isCurrentUser: !!profile?.id && sender?.id === profile?.id,
				attachments: parsedAttachments,
				codeBlock,
			};
		});
	}, [mergedMessages, profile?.id]);

	const getDisplayName = (user?: any) => {
		if (!user) return "Unknown User";
		if (user.firstName && user.lastName) {
			return `${user.firstName} ${user.lastName}`;
		}
		return user.username || "Unknown User";
	};

	const loadThreadDetails = async () => {
		if (!threadId || !groupId || !channelId) return;

		setIsLoading(true);
		try {
			const response = await detailThread(groupId, channelId, threadId);
			const threadData: any = response?.data || response;

			if (threadData) {
				setThreadName(threadData.name);

				let creatorName = "Unknown User";
				let creatorAvatar =
					"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face";
				if (threadData.createdBy) {
					if (typeof threadData.createdBy === "object") {
						creatorName = getDisplayName(threadData.createdBy);
						creatorAvatar = threadData.createdBy.avatarUrl || creatorAvatar;
					} else if (typeof threadData.createdBy === "string") {
						try {
							const userRes = await detailUser(threadData.createdBy);
							const userData = userRes?.data || userRes;
							if (userData) {
								creatorName = getDisplayName(userData);
								creatorAvatar = userData.avatarUrl || creatorAvatar;
							}
						} catch (err) {
							console.error(
								`Failed to fetch creator info for ${threadData.createdBy}`,
								err,
							);
						}
					}
				}

				setThreadCreatorInfo({
					name: creatorName,
					avatarUrl: creatorAvatar,
				});

				// No description field in new DTO; start with empty messages.
			}
		} catch (error) {
			console.error("Failed to load thread details:", error);
			alert("Failed to load thread. Please try again.");
			if (onClose) onClose();
		} finally {
			setIsLoading(false);
		}
	};

	// Real-time handlers for thread messages
	const onServerThreadMessage = useCallback(
		(payload: any) => {
			if (!payload) return;
			const raw: any = payload.message || payload;
			if (!raw) return;
			// Accept several shapes: { thread: {id}}, { threadId }, or nested raw.threadId
			const resolvedThreadId =
				raw.thread?.id || raw.threadId || raw.thread_id || null;
			if (!resolvedThreadId) return;
			if (resolvedThreadId !== threadId) return; // different thread
			// Build a normalized MessageResponse ensuring thread object exists
			const incoming: MessageResponse = {
				id: raw.id,
				channelId: raw.channelId || channelId,
				thread: raw.thread || ({ id: resolvedThreadId } as any),
				senderId: raw.senderId || raw.sender?.id || raw.sender_id || "unknown",
				parentMessageId: raw.parentMessageId || raw.parentMessage?.id || null,
				parentMessage: null as any,
				content: raw.content ?? "",
				createdAt: raw.createdAt ? new Date(raw.createdAt) : new Date(),
				updatedAt: raw.updatedAt ? new Date(raw.updatedAt) : new Date(),
				sender: raw.sender ||
					raw.user || {
						id: raw.senderId || "unknown",
						username: raw.username || "Unknown User",
					},
			};
			// Ignore if missing id/content
			if (!incoming.id) return;
			setRealtimeMessages((prev) => {
				const filtered = prev.filter((m) => {
					if (m.id === incoming.id) return false;
					const isOptimistic = Boolean(
						(m as any)?.optimistic ||
							(typeof m.id === "string" && m.id.startsWith("optimistic-")),
					);
					if (
						isOptimistic &&
						m.content?.trim() === incoming.content?.trim() &&
						m.senderId === incoming.senderId
					)
						return false;
					return true;
				});
				return [...filtered, incoming];
			});
			setBaseMessages((prev) => {
				const map = new Map(prev.map((m) => [m.id, m]));
				map.set(incoming.id, incoming);
				return Array.from(map.values());
			});
			queryClient.setQueryData(
				["thread_messages", groupId, channelId, threadId],
				(old: any) => {
					const arr: MessageResponse[] = Array.isArray(old)
						? old
						: (old?.data ?? []);
					const map = new Map(arr.map((m) => [m.id, m]));
					map.set(incoming.id, incoming);
					return Array.from(map.values());
				},
			);
		},
		[threadId, groupId, channelId, queryClient],
	);

	const onServerDeleteThreadMessage = useCallback(
		(payload: any) => {
			if (!payload) return;
			const id = payload.id || payload.messageId;
			if (!id) return;
			setRealtimeMessages((prev) => prev.filter((m) => m.id !== id));
			setBaseMessages((prev) => prev.filter((m) => m.id !== id));
			queryClient.setQueryData(
				["thread_messages", groupId, channelId, threadId],
				(old: any) => {
					const arr: MessageResponse[] = Array.isArray(old)
						? old
						: (old?.data ?? []);
					return arr.filter((m) => m.id !== id);
				},
			);
		},
		[threadId, groupId, channelId, queryClient],
	);

	const onServerEditThreadMessage = useCallback(
		(payload: any) => {
			if (!payload) return;
			const incoming: MessageResponse = payload.message || payload;
			if (!incoming || !incoming.thread || incoming.thread.id !== threadId)
				return;
			setRealtimeMessages((prev) =>
				prev.map((m) => (m.id === incoming.id ? incoming : m)),
			);
			setBaseMessages((prev) =>
				prev.map((m) => (m.id === incoming.id ? incoming : m)),
			);
			queryClient.setQueryData(
				["thread_messages", groupId, channelId, threadId],
				(old: any) => {
					const arr: MessageResponse[] = Array.isArray(old)
						? old
						: (old?.data ?? []);
					return arr.map((m) => (m.id === incoming.id ? incoming : m));
				},
			);
		},
		[threadId, groupId, channelId, queryClient],
	);

	// Listen to dedicated thread message echo event
	useSocketEvent(SocketEvents.SEND_THREAD_MESSAGE, onServerThreadMessage);
	useSocketEvent(
		SocketEvents.DELETE_THREAD_MESSAGE,
		onServerDeleteThreadMessage,
	);
	useSocketEvent(SocketEvents.EDIT_THREAD_MESSAGE, onServerEditThreadMessage);

	// Creation removed: component now only views existing thread content.

	const handleChatInputSend = useCallback(
		async (payload: ChatInputPayload) => {
			if (!payload) return;
			if (!threadId || !groupId || !channelId) return;
			if (!socket) return;

			if (payload.type === "preview") {
				const previewId =
					payload.clientTempId ||
					`optimistic-preview-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
				const optimistic: MessageResponse = {
					id: previewId,
					channelId,
					thread: { id: threadId } as any,
					content: payload.text?.trim() || "Uploading attachments...",
					createdAt: new Date(),
					updatedAt: new Date(),
					parentMessageId: null,
					parentMessage: null as any,
					sender: profile as any,
					senderId: profile?.id || "unknown",
					attachments: [],
				} as any;
				(optimistic as any).optimistic = true;
				(optimistic as any).clientTempId = payload.clientTempId || previewId;
				setRealtimeMessages((prev) => [...prev, optimistic]);
				return;
			}

			if (payload.type === "text") {
				const text = payload.text?.trim() ?? "";
				if (!text && !payload.codeBlock) return;
				const optimisticId = payload.clientTempId
					? `optimistic-${payload.clientTempId}`
					: `optimistic-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
				const optimistic: MessageResponse = {
					id: optimisticId,
					channelId,
					thread: { id: threadId } as any,
					content: text,
					createdAt: new Date(),
					updatedAt: new Date(),
					parentMessageId: null,
					parentMessage: null as any,
					sender: profile as any,
					senderId: profile?.id || "unknown",
					attachments: [],
				} as any;
				if (payload.codeBlock) {
					(optimistic as any).codeBlock = payload.codeBlock;
				}
				(optimistic as any).optimistic = true;
				(optimistic as any).clientTempId = payload.clientTempId ?? null;
				setRealtimeMessages((prev) => {
					const filtered = payload.clientTempId
						? prev.filter((m) => m.id !== payload.clientTempId)
						: prev;
					return [...filtered, optimistic];
				});

				const emitPayload: Record<string, unknown> = {
					groupId,
					channelId,
					threadId,
					content: text,
					attachmentIds: payload.attachmentIds,
					codeBlock: payload.codeBlock,
				};

				try {
					socket.emit(SocketEvents.SEND_THREAD_MESSAGE, emitPayload);
				} catch (err) {
					console.error(
						"[ThreadPanel] failed to emit SEND_THREAD_MESSAGE",
						err,
					);
				}
				return;
			}

			if (payload.type === "files" && payload.files?.length) {
				const optimistic: MessageResponse = {
					id: `optimistic-files-${Date.now()}`,
					channelId,
					thread: { id: threadId } as any,
					content: "Uploading attachments...",
					createdAt: new Date(),
					updatedAt: new Date(),
					parentMessageId: null,
					parentMessage: null as any,
					sender: profile as any,
					senderId: profile?.id || "unknown",
					attachments: payload.files.map((file) => ({
						name: file.name,
						size: file.size,
						type: file.type,
					})),
				} as any;
				(optimistic as any).optimistic = true;
				setRealtimeMessages((prev) => [...prev, optimistic]);
			}
		},
		[threadId, groupId, channelId, socket, profile, setRealtimeMessages],
	);

	const groupMessagesByDate = (messages: UIMessage[]) => {
		const grouped: { [key: string]: UIMessage[] } = {};
		messages.forEach((msg) => {
			if (!grouped[msg.date]) {
				grouped[msg.date] = [];
			}
			grouped[msg.date].push(msg);
		});
		return grouped;
	};

	if (isLoading) {
		return (
			<PageWrapper>
				<div dangerouslySetInnerHTML={{ __html: responsiveStyles }} />
				<CPHeader>
					<CPHeaderLeft>
						<CPHeaderIcon>
							<Folder size={20} />
						</CPHeaderIcon>
						<CPTitle>Thread</CPTitle>
					</CPHeaderLeft>
					{onClose && (
						<CloseButton onClick={onClose}>
							<X size={20} />
						</CloseButton>
					)}
				</CPHeader>
				<MessagesArea
					ref={messagesContainerRef}
					onScroll={handleMessagesScroll}
				>
					<div className="p-10 text-center text-gray-500">
						Loading thread...
					</div>
				</MessagesArea>
			</PageWrapper>
		);
	}

	if (threadId) {
		const groupedMessages = groupMessagesByDate(uiMessages);

		return (
			<PageWrapper className="thread-panel">
				<div dangerouslySetInnerHTML={{ __html: responsiveStyles }} />
				<CPHeader>
					<CPHeaderLeft>
						<CPHeaderIcon>
							<Folder size={18} />
						</CPHeaderIcon>
						<CPTitle>Thread</CPTitle>
					</CPHeaderLeft>
					{onClose && (
						<CloseButton onClick={onClose}>
							<X size={20} />
						</CloseButton>
					)}
				</CPHeader>

				<MessagesArea>
					<div className="mb-5 flex flex-row items-center gap-1.5 text-center p-3">
						<ThreadIcon>
							<Hash size={24} />
						</ThreadIcon>
						<CPTitle className="!text-2xl !font-bold">{threadName}</CPTitle>
					</div>

					<div
						ref={messagesContainerRef}
						onScroll={handleMessagesScroll}
						className="flex flex-col gap-6 overflow-y-auto behave-scroll px-5"
					>
						{Object.entries(groupedMessages).map(([date, dateMessages]) => (
							<div key={date}>
								<DividerWrapper>
									<Line />
									<DateText>{date}</DateText>
									<Line />
								</DividerWrapper>

								{dateMessages.map((msg) => {
									const authorLabel = msg.isCurrentUser ? "You" : msg.author;
									const headerClassName = msg.isCurrentUser
										? "flex-row-reverse gap-1.5"
										: "";
									const bubbleClasses = msg.isCurrentUser
										? "max-w-[78%] items-center rounded-2xl bg-[#D2E0F9] px-3 py-2 flex self-end"
										: "max-w-[78%] flex self-start rounded-2xl bg-[#eff2f5] px-3 py-2 text-[#111111]";
									const avatarClassName = msg.isCurrentUser
										? "order-2 ring-2 ring-[#133E87]"
										: "ring-2 ring-slate-300";
									const messageClassName = msg.optimistic
										? "opacity-[0.55] overflow-auto"
										: undefined;
									const markdownPreviewClassName = msg.isCurrentUser
										? "prose-invert text-black text-sm"
										: "text-sm text-slate-900";
									return (
										<Message key={msg.id} className={messageClassName}>
											<Avatar className={avatarClassName}>
												<img
													src={msg.avatarUrl}
													alt={authorLabel}
													className="h-full w-full rounded-full object-cover"
												/>
											</Avatar>
											<MessageContent
												className={
													msg.isCurrentUser
														? "flex flex-col align-end gap-0.5"
														: "flex flex-col gap-1.5"
												}
											>
												<MessageHeader className={headerClassName}>
													<AuthorName
														className={
															msg.isCurrentUser ? "text-white" : undefined
														}
													>
														{authorLabel}
													</AuthorName>
													<MessageTime className="text-[11px] opacity-70">
														{msg.time}
													</MessageTime>
												</MessageHeader>
												<div className={bubbleClasses}>
													<MarkdownPreview
														content={msg.content}
														className={markdownPreviewClassName}
													/>
												</div>
											</MessageContent>
										</Message>
									);
								})}
							</div>
						))}

						<div ref={bottomRef} />
					</div>
				</MessagesArea>

				<MessageInput className="relative">
					<ChatInput
						onSend={handleChatInputSend}
						placeholder="Type your message in the thread..."
					/>
				</MessageInput>
			</PageWrapper>
		);
	}

	return (
		<PageWrapper>
			<CPHeader>
				<CPHeaderLeft>
					<CPHeaderIcon>
						<Folder size={18} />
					</CPHeaderIcon>
					<CPTitle>Thread</CPTitle>
				</CPHeaderLeft>
				{onClose && (
					<CloseButton onClick={onClose}>
						<X size={20} />
					</CloseButton>
				)}
			</CPHeader>
			<MessagesArea ref={messagesContainerRef} onScroll={handleMessagesScroll}>
				<div className="p-10 text-center text-gray-500">
					No thread selected.
				</div>
			</MessagesArea>
		</PageWrapper>
	);
};

export default ThreadPanel;

// Socket event handlers (placed after export to avoid re-renders) are not used here; kept inside component scope above.
