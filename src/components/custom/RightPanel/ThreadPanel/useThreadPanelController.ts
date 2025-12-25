import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import type {
	ChatInputPayload,
	ChatInputProps,
} from "@/components/custom/ChatInputComponent/ChatTypeModal/InboxType";
import { detailThread } from "@/services/threadAPI";
import { detailUser } from "@/services/userAPI";
import { MessageResponse, ThreadMessageResponse } from "@/services/messageAPI";
import { SocketEvents } from "@/utils/constants";
import useSocket from "@/hooks/useSocket";
import useSocketEvent from "@/hooks/useSocketEvent";
import { RootState } from "@/store";
import { ThreadMessagesProps, ThreadPanelProps, UIMessage } from "./types";
import { MessageReportType } from "@/services/reportAPI";

interface QueuedEmit {
	event: string;
	payload: Record<string, unknown> | string;
	onAck?: (ack: any) => void;
}

interface ThreadPanelControllerResult {
	isLoading: boolean;
	hasThreadSelected: boolean;
	threadName: string;
	messagesProps: ThreadMessagesProps;
	chatInputProps: ChatInputProps;
	deleteDialogProps: {
		open: boolean;
		submitting: boolean;
		messageContent: string | null;
		onOpenChange: (open: boolean) => void;
		onConfirm: () => void;
	};
	reportDialogProps: {
		open: boolean;
		message: MessageResponse | null;
		messageType: MessageReportType | null;
		onOpenChange: (open: boolean) => void;
	};
}

const defaultMessageGroups: Array<[string, UIMessage[]]> = [];
const THREAD_PAGE_SIZE = 50;
const THREAD_SCROLL_TOP_THRESHOLD_PX = 120;

export const useThreadPanelController = ({
	groupId,
	channelId,
	threadId,
	onClose,
}: ThreadPanelProps): ThreadPanelControllerResult => {
	const [threadName, setThreadName] = useState<string>("Thread");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [realtimeMessages, setRealtimeMessages] = useState<
		ThreadMessageResponse[]
	>([]);
	const [baseMessages, setBaseMessages] = useState<ThreadMessageResponse[]>([]);
	const realtimeMessagesRef = useRef<ThreadMessageResponse[]>([]);
	const baseMessagesRef = useRef<ThreadMessageResponse[]>([]);
	const [userScrolledUp, setUserScrolledUp] = useState(false);
	const messagesContainerRef = useRef<HTMLDivElement | null>(null);
	const bottomRef = useRef<HTMLDivElement | null>(null);
	const attachMessagesContainerRef = useCallback(
		(node: HTMLDivElement | null) => {
			messagesContainerRef.current = node;
		},
		[],
	);
	const attachBottomRef = useCallback((node: HTMLDivElement | null) => {
		bottomRef.current = node;
	}, []);
	const schedulePrependScrollRestore = useCallback(() => {
		if (!pendingPrependScrollRef.current) return;
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				const pending = pendingPrependScrollRef.current;
				const container = messagesContainerRef.current;
				if (!pending || !container) return;
				const newHeight = container.scrollHeight;
				const delta = newHeight - pending.prevScrollHeight;
				container.scrollTop = pending.prevScrollTop + delta;
				pendingPrependScrollRef.current = null;
			});
		});
	}, []);
	const [editingMessage, setEditingMessage] =
		useState<ThreadMessageResponse | null>(null);
	const [replyToMessage, setReplyToMessage] =
		useState<ThreadMessageResponse | null>(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [messagePendingDelete, setMessagePendingDelete] =
		useState<ThreadMessageResponse | null>(null);
	const [deleteSubmitting, setDeleteSubmitting] = useState(false);
	const [actionMenuFor, setActionMenuFor] = useState<string | null>(null);
	const [reactionPickerFor, setReactionPickerFor] = useState<string | null>(
		null,
	);
	const [threadCreatorInfo, setThreadCreatorInfo] = useState<{
		name: string;
		avatarUrl?: string;
	} | null>(null);
	const activeDetailRequestKeyRef = useRef<string | null>(null);
	const isMountedRef = useRef(true);
	const [reportMessageDialogOpen, setReportMessageDialogOpen] = useState(false);
	const [messagePendingReport, setMessagePendingReport] =
		useState<MessageResponse | null>(null);
	const [reportMessageType, setReportMessageType] =
		useState<MessageReportType | null>(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => {
			isMountedRef.current = false;
			activeDetailRequestKeyRef.current = null;
		};
	}, []);
	const [emitQueue, setEmitQueue] = useState<QueuedEmit[]>([]);
	const threadPageRef = useRef(1);
	const hasMoreMessagesRef = useRef(true);
	const fetchingOlderRef = useRef(false);
	const [hasMoreMessages, setHasMoreMessages] = useState(true);
	const [isFetchingOlderMessages, setIsFetchingOlderMessages] = useState(false);
	const pendingPrependScrollRef = useRef<{
		prevScrollHeight: number;
		prevScrollTop: number;
	} | null>(null);

	useEffect(() => {
		if (threadCreatorInfo) {
			console.log("threadCreatorInfo:", threadCreatorInfo);
		}
	}, [threadCreatorInfo]);

	useEffect(() => {
		realtimeMessagesRef.current = realtimeMessages;
	}, [realtimeMessages]);

	useEffect(() => {
		baseMessagesRef.current = baseMessages;
	}, [baseMessages]);

	const profile = useSelector((state: RootState) => state.user.profile);
	const queryClient = useQueryClient();
	const { socket, waitUntilReady } = useSocket();

	const queueEmit = useCallback(
		(
			event: string,
			payload: Record<string, unknown> | string,
			onAck?: (ack: any) => void,
		) => {
			setEmitQueue((prev) => [...prev, { event, payload, onAck }]);
		},
		[],
	);

	const safeEmit = useCallback(
		(
			event: string,
			payload: Record<string, unknown> | string,
			options?: { onAck?: (ack: any) => void },
		): Promise<any> => {
			const hasThreadContext = Boolean(groupId && channelId && threadId);
			if (!hasThreadContext) {
				queueEmit(event, payload, options?.onAck);
				return Promise.resolve({ queued: true });
			}

			return new Promise<any>((resolve) => {
				try {
					if (!socket || !socket.connected) {
						queueEmit(event, payload, options?.onAck);
						resolve({ queued: true });
						return;
					}
					socket.emit(event, payload, (ack: any) => {
						options?.onAck?.(ack);
						resolve(ack);
					});
				} catch (err) {
					console.error("[ThreadPanel] safeEmit error", err);
					queueEmit(event, payload, options?.onAck);
					resolve({ queued: true, error: String(err) });
				}
			});
		},
		[queueEmit, socket, groupId, channelId, threadId],
	);

	const handleFetchThreadMessagesAck = useCallback(
		(resp: any, options: { page: number; replace: boolean }): void => {
			try {
				if (resp && (resp.error || resp.code)) {
					console.warn("[ThreadPanel] FETCH_THREAD_MESSAGES ack error", resp);
					return;
				}
				const raw = resp?.data ?? resp?.messages ?? resp;
				if (!Array.isArray(raw)) {
					setBaseMessages([]);
					setRealtimeMessages([]);
					hasMoreMessagesRef.current = false;
					setHasMoreMessages(false);
					return;
				}
				const sorted = (raw
					.slice()
					.sort(
						(a, b) =>
							new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
					) ?? []) as ThreadMessageResponse[];
				let nextBase: ThreadMessageResponse[] = sorted;
				setBaseMessages((prev) => {
					if (options.replace) {
						nextBase = sorted;
						return sorted;
					}
					const map = new Map(prev.map((m) => [m.id, m] as const));
					for (const item of sorted) {
						if (!map.has(item.id)) {
							map.set(item.id, item);
						}
					}
					nextBase = Array.from(map.values()).sort(
						(a, b) =>
							new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
					);
					return nextBase;
				});
				queryClient.setQueryData(
					["thread_messages", groupId, channelId, threadId],
					() => nextBase,
				);
				threadPageRef.current = options.page;
				const hasMore = sorted.length === THREAD_PAGE_SIZE;
				hasMoreMessagesRef.current = hasMore;
				setHasMoreMessages(hasMore);
				if (!options.replace && options.page > 1) {
					schedulePrependScrollRestore();
				} else {
					pendingPrependScrollRef.current = null;
				}
			} catch (e) {
				console.error(
					"[ThreadPanel] error handling FETCH_THREAD_MESSAGES response",
					e,
				);
			} finally {
				fetchingOlderRef.current = false;
				setIsFetchingOlderMessages(false);
			}
		},
		[queryClient, groupId, channelId, threadId, schedulePrependScrollRestore],
	);

	const joinRoomForThread = useCallback(async () => {
		if (!groupId || !channelId) return false;
		try {
			const ack = await safeEmit(SocketEvents.JOIN_ROOM, {
				groupId,
				channelId,
			});
			if (ack && (ack.error || ack.code)) {
				console.error("[ThreadPanel] JOIN_ROOM ack error", ack);
				return false;
			}
			return true;
		} catch (err) {
			console.error("[ThreadPanel] failed to join room", err);
			return false;
		}
	}, [groupId, channelId, safeEmit]);

	const fetchThreadMessages = useCallback(
		async (
			options: { page?: number; replace?: boolean; blockUI?: boolean } = {},
		) => {
			const { page = 1, replace = true, blockUI = false } = options;
			await waitUntilReady();
			const shouldShowBlockingLoader = blockUI && page === 1 && replace;
			if (!threadId || !groupId || !channelId) {
				setBaseMessages([]);
				setRealtimeMessages([]);
				hasMoreMessagesRef.current = false;
				setHasMoreMessages(false);
				if (shouldShowBlockingLoader) {
					setIsLoading(false);
				}
				return;
			}
			const run = async (allowRetry: boolean) => {
				const ack = await safeEmit(
					SocketEvents.FETCH_THREAD_MESSAGES,
					{ groupId, channelId, threadId, page, take: THREAD_PAGE_SIZE },
					{
						onAck: (resp) =>
							handleFetchThreadMessagesAck(resp, { page, replace }),
					},
				);
				const needsJoin = Boolean(
					allowRetry &&
						ack &&
						typeof ack === "object" &&
						(ack.error === "channel_not_selected_err" ||
							ack.code === "channel_not_selected_err"),
				);
				if (needsJoin) {
					console.warn(
						"[ThreadPanel] server rejected FETCH_THREAD_MESSAGES, retrying after JOIN_ROOM",
					);
					const joined = await joinRoomForThread();
					if (joined) {
						await run(false);
					}
				}
			};
			if (shouldShowBlockingLoader) {
				setIsLoading(true);
			}
			try {
				await run(true);
			} finally {
				if (shouldShowBlockingLoader) {
					setIsLoading(false);
				}
			}
		},
		[
			threadId,
			groupId,
			channelId,
			safeEmit,
			handleFetchThreadMessagesAck,
			joinRoomForThread,
			waitUntilReady,
		],
	);

	const processedThreadMessageIds = useRef<Set<string>>(new Set());
	const fetchThreadMessagesRef = useRef(fetchThreadMessages);
	useEffect(() => {
		fetchThreadMessagesRef.current = fetchThreadMessages;
	}, [fetchThreadMessages]);

	const onServerThreadMessage = useCallback(
		(payload: any) => {
			if (!payload) return;
			const raw: any = payload.message || payload;
			if (!raw) return;

			const messageId = raw.id ?? raw._id ?? raw.messageId;

			if (messageId && processedThreadMessageIds.current.has(messageId)) {
				console.debug(
					"[ThreadPanel] Skip already processed message",
					messageId,
				);
				return;
			}

			const resolvedThreadId =
				raw.thread?.id || raw.threadId || raw.thread_id || null;

			if (!resolvedThreadId) {
				console.debug("[ThreadPanel] Skip non-thread message", messageId);
				return;
			}

			if (resolvedThreadId !== threadId) {
				console.debug(
					"[ThreadPanel] Skip wrong thread",
					messageId,
					resolvedThreadId,
					threadId,
				);
				return;
			}

			if (raw.groupId && groupId && raw.groupId !== groupId) {
				console.debug("[ThreadPanel] Skip wrong group", messageId);
				return;
			}
			if (raw.channelId && channelId && raw.channelId !== channelId) {
				console.debug("[ThreadPanel] Skip wrong channel", messageId);
				return;
			}

			if (messageId) {
				processedThreadMessageIds.current.add(messageId);
				if (processedThreadMessageIds.current.size > 1000) {
					const entries = Array.from(processedThreadMessageIds.current);
					entries
						.slice(0, 500)
						.forEach((id) => processedThreadMessageIds.current.delete(id));
				}
			}

			const incoming: MessageResponse = {
				id: messageId,
				channelId: raw.channelId || channelId,
				thread: raw.thread || ({ id: resolvedThreadId } as any),
				senderId: raw.senderId || raw.sender?.id || raw.sender_id || "unknown",
				parentMessageId: raw.parentMessageId || raw.parentMessage?.id || null,
				parentMessage: raw.parentMessage,
				content: raw.content ?? "",
				createdAt: raw.createdAt ? new Date(raw.createdAt) : new Date(),
				updatedAt: raw.updatedAt ? new Date(raw.updatedAt) : new Date(),
				sender: raw.sender ||
					raw.user || {
						id: raw.senderId || "unknown",
						username: raw.username || "Unknown User",
					},
			};

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
					const arr: ThreadMessageResponse[] = Array.isArray(old)
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

	useEffect(() => {
		processedThreadMessageIds.current.clear();
	}, [threadId, groupId, channelId]);

	const onServerEditThreadMessage = useCallback(
		(payload: any) => {
			if (!payload) return;
			const incoming: MessageResponse = payload.message || payload;
			if (!incoming) return;
			const incomingThreadId =
				(incoming as any).threadId ??
				incoming.thread?.id ??
				payload.threadId ??
				payload.thread?.id;
			if (!incomingThreadId || incomingThreadId !== threadId) return;
			setRealtimeMessages((prev) =>
				prev.map((m) => (m.id === incoming.id ? incoming : m)),
			);
			setBaseMessages((prev) =>
				prev.map((m) => (m.id === incoming.id ? incoming : m)),
			);
			queryClient.setQueryData(
				["thread_messages", groupId, channelId, threadId],
				(old: any) => {
					const arr: ThreadMessageResponse[] = Array.isArray(old)
						? old
						: (old?.data ?? []);
					return arr.map((m) => (m.id === incoming.id ? incoming : m));
				},
			);
		},
		[threadId, groupId, channelId, queryClient],
	);

	useSocketEvent(SocketEvents.SEND_THREAD_MESSAGE, onServerThreadMessage);
	useSocketEvent(SocketEvents.EDIT_THREAD_MESSAGE, onServerEditThreadMessage);

	useEffect(() => {
		if (!socket) return;
		let cancelled = false;

		const flushQueued = async (queued: QueuedEmit[]) => {
			for (const item of queued) {
				await new Promise<void>((resolve) => {
					try {
						socket.emit(item.event, item.payload, (ack: any) => {
							item.onAck?.(ack);
							resolve();
						});
					} catch (err) {
						console.error("[ThreadPanel] flush emit failed", err);
						setEmitQueue((prev) => [...prev, item]);
						resolve();
					}
				});
			}
		};

		const tryFlushNow = () => {
			if (!socket.connected || emitQueue.length === 0) return;
			const queued = [...emitQueue];
			setEmitQueue([]);
			void flushQueued(queued);
		};

		tryFlushNow();

		const onConnect = () => {
			const handleConnect = async () => {
				try {
					await waitUntilReady();
				} catch (err) {
					console.error("[ThreadPanel] waitUntilReady failed", err);
					return;
				}
				if (cancelled) return;
				tryFlushNow();
				if (threadId && groupId && channelId) {
					void fetchThreadMessages({ page: 1, replace: true });
				}
			};
			handleConnect().catch((err) =>
				console.error("[ThreadPanel] onConnect handler error", err),
			);
		};

		socket.on?.("connect", onConnect);

		return () => {
			cancelled = true;
			socket.off?.("connect", onConnect);
		};
	}, [
		socket,
		emitQueue,
		waitUntilReady,
		fetchThreadMessages,
		threadId,
		groupId,
		channelId,
		queryClient,
	]);

	const loadThreadDetails = useCallback(async () => {
		if (!threadId || !groupId || !channelId) {
			activeDetailRequestKeyRef.current = null;
			return;
		}
		const contextKey = `${groupId}:${channelId}:${threadId}`;
		activeDetailRequestKeyRef.current = contextKey;
		try {
			const response = await detailThread(groupId, channelId, threadId);
			if (activeDetailRequestKeyRef.current !== contextKey) {
				return;
			}
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
							if (activeDetailRequestKeyRef.current !== contextKey) {
								return;
							}
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

				if (isMountedRef.current) {
					setThreadCreatorInfo({
						name: creatorName,
						avatarUrl: creatorAvatar,
					});
				}
			}
		} catch (error) {
			if (activeDetailRequestKeyRef.current !== contextKey) {
				return;
			}
			console.error("Failed to load thread details:", error);
			if (isMountedRef.current) {
				alert("Failed to load thread. Please try again.");
				if (onClose) onClose();
			}
		}
	}, [threadId, groupId, channelId, onClose]);

	useEffect(() => {
		if (threadId && groupId && channelId) {
			void loadThreadDetails();
		}
	}, [threadId, groupId, channelId, loadThreadDetails]);

	const loadOlderThreadMessages = useCallback(() => {
		if (!threadId || !groupId || !channelId) return;
		if (fetchingOlderRef.current || !hasMoreMessagesRef.current) return;
		const container = messagesContainerRef.current;
		if (container) {
			pendingPrependScrollRef.current = {
				prevScrollHeight: container.scrollHeight,
				prevScrollTop: container.scrollTop ?? 0,
			};
		} else {
			pendingPrependScrollRef.current = null;
		}
		const nextPage = threadPageRef.current + 1;
		fetchingOlderRef.current = true;
		setIsFetchingOlderMessages(true);
		void fetchThreadMessages({ page: nextPage, replace: false }).catch(
			(err) => {
				console.error(
					"[ThreadPanel] failed to load older thread messages",
					err,
				);
				fetchingOlderRef.current = false;
				setIsFetchingOlderMessages(false);
				pendingPrependScrollRef.current = null;
			},
		);
	}, [threadId, groupId, channelId, fetchThreadMessages]);

	useEffect(() => {
		setEditingMessage(null);
		setReplyToMessage(null);
	}, [threadId]);

	useEffect(() => {
		setRealtimeMessages([]);
		setBaseMessages([]);
		threadPageRef.current = 1;
		hasMoreMessagesRef.current = true;
		fetchingOlderRef.current = false;
		setHasMoreMessages(true);
		setIsFetchingOlderMessages(false);
		pendingPrependScrollRef.current = null;
		if (!threadId || !groupId || !channelId) {
			setIsLoading(false);
			return;
		}
		void fetchThreadMessagesRef.current?.({
			page: 1,
			replace: true,
			blockUI: true,
		});
	}, [threadId, groupId, channelId]);

	const onJoinedRoom = useCallback(
		(payload: any) => {
			const joinedGroupId = payload?.groupId ?? payload?.group?.id;
			const joinedChannelId = payload?.channelId ?? payload?.channel?.id;
			if (!groupId || !channelId) return;
			if (joinedGroupId !== groupId || joinedChannelId !== channelId) return;
			if (!threadId) return;
			void fetchThreadMessages({ page: 1, replace: true, blockUI: false });
		},
		[groupId, channelId, threadId, fetchThreadMessages],
	);

	useSocketEvent(SocketEvents.JOINED_ROOM, onJoinedRoom);

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
		if (realtimeMessages.length === 0) return baseMessages;
		const map = new Map<string, MessageResponse>();
		baseMessages.forEach((m) => map.set(m.id, m));
		realtimeMessages.forEach((m) => map.set(m.id, m));
		return Array.from(map.values()).sort(
			(a, b) =>
				new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
		);
	}, [baseMessages, realtimeMessages]);

	const messageMap = useMemo(() => {
		const map = new Map<string, MessageResponse>();
		mergedMessages.forEach((message) => map.set(message.id, message));
		return map;
	}, [mergedMessages]);

	useEffect(() => {
		const el = messagesContainerRef.current;
		if (!el) return;
		const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
		const shouldAutoScroll = !userScrolledUp || distanceFromBottom < 160;
		if (shouldAutoScroll) {
			el.scrollTop = el.scrollHeight;
		}
	}, [mergedMessages, userScrolledUp]);

	const handleMessagesScroll = useCallback(() => {
		const el = messagesContainerRef.current;
		if (!el) return;
		const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
		setUserScrolledUp(distanceFromBottom > 200);
		if (
			el.scrollTop < THREAD_SCROLL_TOP_THRESHOLD_PX &&
			hasMoreMessagesRef.current &&
			!fetchingOlderRef.current
		) {
			loadOlderThreadMessages();
		}
	}, [loadOlderThreadMessages]);

	const scrollToBottomInstant = useCallback(() => {
		const container = messagesContainerRef.current;
		try {
			if (container) {
				container.scrollTop = container.scrollHeight;
			}
			bottomRef.current?.scrollIntoView({ behavior: "auto" });
		} catch {
			/* noop */
		}
	}, []);

	useLayoutEffect(() => {
		if (pendingPrependScrollRef.current) return;
		if (!userScrolledUp) {
			scrollToBottomInstant();
		}
	}, [baseMessages, mergedMessages, scrollToBottomInstant, userScrolledUp]);

	const uiMessages: UIMessage[] = useMemo(() => {
		return mergedMessages.map((m) => {
			const sender: any = m.sender;
			const name = sender
				? sender.firstName && sender.lastName
					? `${sender.firstName} ${sender.lastName}`
					: sender.username || "Unknown User"
				: "Unknown User";
			const rawAttachments: any[] = Array.isArray((m as any).attachments)
				? (m as any).attachments
				: [];
			const parsedAttachments = rawAttachments.map((a) => ({
				name: a.name,
				size: a.size,
				type: a.type,
			}));
			const previewUploads = Array.isArray((m as any).previewUploads)
				? ((m as any).previewUploads as any[]).map((upload) => ({
						...upload,
					}))
				: undefined;
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
				updatedAt: (m as any).updatedAt ?? m.updatedAt ?? m.createdAt,
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
				uploadPreviews: previewUploads,
			};
		});
	}, [mergedMessages, profile?.id]);

	const groupedMessages = useMemo(() => {
		const grouped: Record<string, UIMessage[]> = {};
		uiMessages.forEach((msg) => {
			if (!grouped[msg.date]) {
				grouped[msg.date] = [];
			}
			grouped[msg.date].push(msg);
		});
		return Object.entries(grouped);
	}, [uiMessages]);

	const handleCopyMessage = useCallback((message: MessageResponse) => {
		if (!message?.content) return;
		navigator.clipboard?.writeText(message.content).catch(() => {
			const ta = document.createElement("textarea");
			ta.value = message.content || "";
			ta.style.position = "fixed";
			ta.style.opacity = "0";
			document.body.appendChild(ta);
			ta.select();
			document.execCommand("copy");
			ta.remove();
		});
	}, []);

	const handleEditMessage = useCallback((message: MessageResponse) => {
		setEditingMessage(message);
	}, []);

	const handleReplyMessage = useCallback((message: MessageResponse) => {
		setReplyToMessage(message);
	}, []);

	const handleReportMessage = useCallback((message: MessageResponse) => {
		setMessagePendingReport(message);
		setReportMessageType(MessageReportType.THREAD_MESSAGE);
		setReportMessageDialogOpen(true);
	}, []);

	const handleReportMessageDialogOpenChange = useCallback((open: boolean) => {
		setReportMessageDialogOpen(open);
		if (!open) {
			setMessagePendingReport(null);
			setReportMessageType(null);
		}
	}, []);

	const handleDeleteMessage = useCallback((message: MessageResponse) => {
		setMessagePendingDelete(message as ThreadMessageResponse);
		setDeleteDialogOpen(true);
	}, []);

	const confirmDelete = useCallback(async () => {
		if (!messagePendingDelete || !threadId) return;
		setDeleteSubmitting(true);
		const deleteId = messagePendingDelete.id;
		try {
			socket?.emit(SocketEvents.DELETE_THREAD_MESSAGE, deleteId);
		} catch (err) {
			console.error("[ThreadPanel] failed to emit DELETE_THREAD_MESSAGE", err);
		} finally {
			setDeleteSubmitting(false);
			setDeleteDialogOpen(false);
			setMessagePendingDelete(null);
		}
	}, [
		messagePendingDelete,
		safeEmit,
		threadId,
		channelId,
		groupId,
		queryClient,
	]);

	const onServerDeleteThreadMessage = useCallback(
		(payload: any) => {
			if (!payload) return;
			console.log("[ThreadPanel] onServerDeleteThreadMessage", payload);
			const id = payload.id || payload.messageId || payload;
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

	const handleDeleteDialogOpenChange = useCallback((open: boolean) => {
		setDeleteDialogOpen(open);
		if (!open) {
			setMessagePendingDelete(null);
		}
	}, []);

	useSocketEvent(
		SocketEvents.DELETE_THREAD_MESSAGE,
		onServerDeleteThreadMessage,
	);

	const handleReact = useCallback((messageId: string, reaction: string) => {
		console.debug("[ThreadPanel] reaction placeholder", {
			messageId,
			reaction,
		});
		toast.info("Reactions for thread messages will arrive soon.");
	}, []);

	const handleGoToMessage = useCallback((id: string) => {
		if (!id) return;
		const element = document.getElementById(`thread-message-${id}`);
		if (!element) return;
		try {
			element.scrollIntoView({ behavior: "smooth", block: "center" });
			element.classList.add(
				"ring",
				"ring-primary",
				"ring-offset-2",
				"ring-offset-background",
				"transition-colors",
			);
			window.setTimeout(() => {
				element.classList.remove(
					"ring",
					"ring-primary",
					"ring-offset-2",
					"ring-offset-background",
					"transition-colors",
				);
			}, 1600);
		} catch (err) {
			console.error("[ThreadPanel] failed to scroll to message", err);
		}
	}, []);

	const handleCreateThreadFromThreadView = useCallback(
		(_message?: MessageResponse) => {
			toast.info("You're already viewing this thread.");
		},
		[],
	);

	const handleChatInputSend = useCallback(
		async (payload: ChatInputPayload) => {
			if (!payload) return;
			if (!threadId || !groupId || !channelId) return;

			const parentMessageId = replyToMessage?.id ?? null;

			if (payload.type === "preview-progress") {
				if (!payload.clientTempId) return;
				setRealtimeMessages((prev) =>
					prev.map((m) => {
						if (m.id !== payload.clientTempId) return m;
						const next = { ...m } as any;
						next.previewUploads =
							payload.meta?.previewUploads?.map((entry: any) => ({
								...entry,
							})) ?? [];
						return next;
					}),
				);
				return;
			}

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
				(optimistic as any).pending = true;
				const previewUploads = payload.meta?.previewUploads?.map(
					(entry: any) => ({ ...entry }),
				);
				if (previewUploads?.length) {
					(optimistic as any).previewUploads = previewUploads;
				}
				(optimistic as any).clientTempId = payload.clientTempId || previewId;
				setRealtimeMessages((prev) => [...prev, optimistic]);
				return;
			}

			if (payload.type === "text") {
				const text = payload.text?.trim() ?? "";
				if (!text && !payload.codeBlock) return;
				if (editingMessage) {
					const updated: ThreadMessageResponse = {
						...editingMessage,
						content: text,
						updatedAt: new Date(),
					};
					if (payload.codeBlock) {
						(updated as any).codeBlock = payload.codeBlock;
					} else if ((updated as any).codeBlock) {
						delete (updated as any).codeBlock;
					}
					setRealtimeMessages((prev) =>
						prev.map((m) => (m.id === editingMessage.id ? updated : m)),
					);
					setBaseMessages((prev) =>
						prev.map((m) => (m.id === editingMessage.id ? updated : m)),
					);
					await safeEmit(SocketEvents.EDIT_THREAD_MESSAGE, {
						threadMessageId: editingMessage.id,
						content: text,
						codeBlock: payload.codeBlock,
						attachmentIds: payload.attachmentIds,
						threadId,
						channelId,
						groupId,
					});
					setReplyToMessage(null);
					setEditingMessage(null);
					return;
				}

				const optimisticId = payload.clientTempId
					? `optimistic-${payload.clientTempId}`
					: `optimistic-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
				const optimistic: ThreadMessageResponse = {
					id: optimisticId,
					channelId,
					thread: { id: threadId } as any,
					content: text,
					createdAt: new Date(),
					updatedAt: new Date(),
					parentMessageId,
					parentMessage: parentMessageId
						? (replyToMessage as any)
						: (null as any),
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
					const targetId = payload.clientTempId || optimisticId;
					const filtered = prev.filter((m) => m.id !== targetId);
					return [...filtered, optimistic];
				});

				const ackPromise = safeEmit(SocketEvents.SEND_THREAD_MESSAGE, {
					threadId,
					content: text,
					attachmentIds: payload.attachmentIds,
					codeBlock: payload.codeBlock,
					parentMessageId,
					clientTempId: payload.clientTempId ?? optimisticId,
				});
				setReplyToMessage(null);
				return ackPromise;
			}

			if (payload.type === "files" && payload.files?.length) {
				const files = payload.files;
				const isMarkdownText = (file: File) => {
					const mime = (file.type || "").toLowerCase();
					if (mime === "text/markdown" || mime === "text/plain") return true;
					const lower = file.name.toLowerCase();
					return (
						lower.endsWith(".md") ||
						lower.endsWith(".markdown") ||
						lower.endsWith(".txt")
					);
				};
				const markdownFiles = files.filter(isMarkdownText);
				const otherFiles = files.filter((f) => !isMarkdownText(f));

				for (const file of markdownFiles) {
					try {
						const content = await file.text();
						const mdTempId = `optimistic-${Date.now()}-${Math.floor(
							Math.random() * 1000,
						)}-md`;
						const optimisticMd: ThreadMessageResponse = {
							id: mdTempId,
							channelId,
							thread: { id: threadId } as any,
							content,
							createdAt: new Date(),
							updatedAt: new Date(),
							parentMessageId,
							parentMessage: parentMessageId
								? (replyToMessage as any)
								: (null as any),
							sender: profile as any,
							senderId: profile?.id || "unknown",
						} as any;
						(optimisticMd as any).optimistic = true;
						setRealtimeMessages((prev) => [...prev, optimisticMd]);
						await safeEmit(SocketEvents.SEND_THREAD_MESSAGE, {
							groupId,
							channelId,
							threadId,
							content,
							parentMessageId,
							clientTempId: mdTempId,
						});
					} catch (err) {
						console.error("[ThreadPanel] failed to process markdown file", err);
					}
				}

				if (otherFiles.length > 0) {
					const attachmentsMeta = otherFiles.map((file) => ({
						name: file.name,
						size: file.size,
						type: file.type,
					}));
					const filesTempId = `optimistic-files-${Date.now()}`;
					const optimisticFiles: MessageResponse = {
						id: filesTempId,
						channelId,
						thread: { id: threadId } as any,
						content: "",
						createdAt: new Date(),
						updatedAt: new Date(),
						parentMessageId,
						parentMessage: parentMessageId
							? (replyToMessage as any)
							: (null as any),
						sender: profile as any,
						senderId: profile?.id || "unknown",
						attachments: attachmentsMeta,
					} as any;
					(optimisticFiles as any).optimistic = true;
					setRealtimeMessages((prev) => [...prev, optimisticFiles]);
					await safeEmit(SocketEvents.SEND_THREAD_MESSAGE, {
						groupId,
						channelId,
						threadId,
						content: "",
						attachments: attachmentsMeta,
						parentMessageId,
						clientTempId: filesTempId,
					});
				}
				setReplyToMessage(null);
				return;
			}
		},
		[
			threadId,
			groupId,
			channelId,
			profile,
			safeEmit,
			setRealtimeMessages,
			setBaseMessages,
			editingMessage,
			setEditingMessage,
			replyToMessage,
			setReplyToMessage,
		],
	);

	const chatInputProps: ChatInputProps = {
		onSend: handleChatInputSend as ChatInputProps["onSend"],
		placeholder: "Type your message in the thread...",
		editingMessage,
		onCancelEdit: () => setEditingMessage(null),
		replyTo: replyToMessage,
		onCancelReply: () => setReplyToMessage(null),
		editingMode: !!editingMessage,
	};

	const messagesProps: ThreadMessagesProps = {
		groupedMessages: groupedMessages ?? defaultMessageGroups,
		messageMap,
		actionMenuFor,
		setActionMenuFor,
		reactionPickerFor,
		setReactionPickerFor,
		handleGoToMessage,
		handleCopyMessage,
		handleEditMessage,
		handleReplyMessage,
		handleDeleteMessage,
		handleReact,
		handleCreateThreadFromThreadView,
		messagesContainerRef: attachMessagesContainerRef,
		onMessagesScroll: handleMessagesScroll,
		bottomRef: attachBottomRef,
		handleReportMessage,
		hasMoreMessages,
		isFetchingOlderMessages,
		threadId,
	};

	return {
		isLoading,
		hasThreadSelected: Boolean(threadId),
		threadName,
		messagesProps,
		chatInputProps,
		deleteDialogProps: {
			open: deleteDialogOpen,
			submitting: deleteSubmitting,
			messageContent: messagePendingDelete?.content ?? null,
			onOpenChange: handleDeleteDialogOpenChange,
			onConfirm: confirmDelete,
		},
		reportDialogProps: {
			open: reportMessageDialogOpen,
			message: messagePendingReport,
			messageType: reportMessageType,
			onOpenChange: handleReportMessageDialogOpenChange,
		},
	};
};

function getDisplayName(user?: any) {
	if (!user) return "Unknown User";
	if (user.firstName && user.lastName) {
		return `${user.firstName} ${user.lastName}`;
	}
	return user.username || "Unknown User";
}
