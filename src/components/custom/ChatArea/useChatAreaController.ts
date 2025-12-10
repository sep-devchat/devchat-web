/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
	useLayoutEffect,
} from "react";
import { MessageResponse } from "@/services/messageAPI";
import { useSocket } from "@/hooks";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useSocketEvent from "@/hooks/useSocketEvent";
import { SocketEvents } from "@/utils/constants";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import {
	detailThread,
	listThreads,
	createThread,
	ThreadListResponse,
	ThreadResponse,
} from "@/services/threadAPI";
import { useParams, useSearch } from "@tanstack/react-router";
import {
	ChatInputPayload,
	ChatInputProps,
	InboxType,
} from "../ChatInputComponent/ChatTypeModal/InboxType";
import { detailUser, UserResponse } from "@/services/userAPI";
import {
	sendFriendRequest,
	listFriends,
	unfriendUser,
	listAllFriendRequests,
	acceptFriendRequest,
	declineFriendRequest,
	FriendUser,
} from "@/services/friendAPI";
import { toast } from "sonner";
import type { DirectMessageHeaderProps } from "./parts/DirectMessageHeader";
import type { ChatMessagesViewportProps } from "./parts/ChatMessagesViewport";
import type { ChatDialogsProps } from "./parts/ChatDialogs";
import { MessageReportType } from "@/services/reportAPI";

const AI_PROVIDER_USERNAMES = ["openai-bot", "gemini-bot"];
const detectAiMention = (text: string): "openai" | "gemini" | null => {
	const match = text.match(/@(openai|gemini)\b/i);
	if (!match) return null;
	return match[1].toLowerCase() as "openai" | "gemini";
};
const buildAiPreviewContent = (provider: "openai" | "gemini") =>
	provider === "openai" ? "OpenAI is thinking..." : "Gemini is thinking...";
const isAiUsername = (username?: string | null) =>
	AI_PROVIDER_USERNAMES.includes((username ?? "").toLowerCase());
const isAiBotSender = (sender?: { username?: string | null }) =>
	isAiUsername(sender?.username ?? "");

const MESSAGE_PAGE_SIZE = 50;
const SCROLL_TOP_THRESHOLD_PX = 120;
const SCROLL_BOTTOM_THRESHOLD_PX = 80;

const sortChronologically = <T extends { createdAt: string | Date }>(
	items: T[],
): T[] =>
	items
		.slice()
		.sort(
			(a, b) =>
				new Date(a.createdAt as any).getTime() -
				new Date(b.createdAt as any).getTime(),
		);

const extractSocketArray = (resp: any) =>
	Array.isArray(resp)
		? resp
		: Array.isArray(resp?.data)
			? resp.data
			: Array.isArray(resp?.messages)
				? resp.messages
				: [];

const normalizeChannelMessages = (resp: any): MessageResponse[] =>
	sortChronologically(extractSocketArray(resp) as MessageResponse[]);

const normalizeDirectMessages = (resp: any): MessageResponse[] =>
	sortChronologically(
		extractSocketArray(resp).map((dm: any) => ({
			id: dm.id,
			content: dm.content ?? "",
			createdAt: dm.createdAt,
			sender: dm.from ?? dm.sender ?? null,
			codeBlockId: dm.codeBlockId,
		})) as MessageResponse[],
	);

const toRealtimeDirectMessage = (payload: any) => {
	const resolvedCodeBlockId =
		payload?.codeBlockId ??
		payload?.codeBlock?.id ??
		payload?.codeBlock?.codeBlockId ??
		null;

	const serverMsg: any = {
		...payload,
		id:
			payload?.id ??
			payload?._id ??
			payload?.messageId ??
			payload?.clientTempId ??
			`dm-${Date.now()}`,
		createdAt: payload?.createdAt ?? new Date().toISOString(),
		updatedAt:
			payload?.updatedAt ?? payload?.createdAt ?? new Date().toISOString(),
		content: payload?.content ?? payload?.message ?? "",
		sender: payload?.from ?? payload?.sender ?? null,
	};

	if (resolvedCodeBlockId) {
		serverMsg.codeBlockId = resolvedCodeBlockId;
	}

	return serverMsg;
};

export interface ChatAreaControllerResult {
	shouldShowDirectHeader: boolean;
	directHeaderProps: DirectMessageHeaderProps | null;
	shouldShowThreadHeader: boolean;
	thread: ThreadResponse | null;
	messagesViewportProps: ChatMessagesViewportProps;
	chatDialogsProps: ChatDialogsProps;
	chatInputProps: ChatInputProps;
}

export const useChatAreaController = (): ChatAreaControllerResult => {
	const params = useParams({ strict: false }) as {
		groupId?: string;
		id?: string;
		userId?: string; // direct message target user id when on /chat/user/$userId route
	};
	const search = useSearch({ strict: false }) as {
		channel?: string;
		thread?: string;
	};
	// const navigate = useNavigate();
	const groupId = params.groupId ?? undefined;
	const channelIdParam = search.channel ?? undefined;
	const threadIdParam = search.thread ?? params.id ?? undefined; // prefer query param for threads
	const directUserIdParam = params.userId ?? undefined; // if present => in direct message mode
	const isDirectMode = !!directUserIdParam && !groupId; // treat any route with userId (and without group) as DM, even if channel search lingers
	const queryClient = useQueryClient();
	const profile = useSelector((state: RootState) => state.user.profile);
	const [realtimeMessages, setRealtimeMessages] = useState<MessageResponse[]>(
		[],
	);
	const [friendRequestId, setFriendRequestId] = useState<string | null>(null);

	const listRef = useRef<HTMLDivElement | null>(null);
	const bottomRef = useRef<HTMLDivElement | null>(null);
	const { socket, waitUntilReady } = useSocket();
	const [filesFromModal, setFilesFromModal] = useState<File[] | undefined>(
		undefined,
	);
	const [inboxTypeSelected, setInboxTypeSelected] = useState<InboxType>(null);
	const viewportVariant = inboxTypeSelected ?? undefined;
	const [emitQueue, setEmitQueue] = useState<any[]>([]);
	const [socketLoading, setSocketLoading] = useState<boolean>(false);
	const messagePageRef = useRef(1);
	const [hasMoreMessages, setHasMoreMessages] = useState(true);
	const hasMoreMessagesRef = useRef(true);
	const [fetchingOlderMessages, setFetchingOlderMessages] = useState(false);
	const fetchingOlderRef = useRef(false);
	const pendingPrependScrollRef = useRef<{
		prevScrollHeight: number;
		prevScrollTop: number;
	} | null>(null);
	const shouldStickToBottomRef = useRef(true);
	// track the last room we attempted to join to avoid redundant joins
	const lastJoinKeyRef = useRef<string | null>(null);
	// moved hovered state to per-row component to avoid whole list re-renders on hover
	const [editingMessage, setEditingMessage] = useState<MessageResponse | null>(
		null,
	);
	const [replyToMessage, setReplyToMessage] = useState<MessageResponse | null>(
		null,
	);
	const [reactionPickerFor, setReactionPickerFor] = useState<string | null>(
		null,
	);
	const [reportMessageDialogOpen, setReportMessageDialogOpen] = useState(false);
	const [messagePendingReport, setMessagePendingReport] =
		useState<MessageResponse | null>(null);
	const [reportMessageType, setReportMessageType] =
		useState<MessageReportType | null>(null);
	// Delete confirmation dialog state
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [messagePendingDelete, setMessagePendingDelete] =
		useState<MessageResponse | null>(null);
	const [deleteSubmitting, setDeleteSubmitting] = useState(false);
	// Markdown rendering handled by react-markdown with GFM and safe sanitize

	// Query thread detail only when user navigates to a specific thread
	const {
		data: threadDataResp,
		isLoading: threadLoading,
		isError: threadError,
	} = useQuery<ThreadResponse | null>({
		queryKey: ["thread", groupId, channelIdParam, threadIdParam],
		queryFn: async () => {
			if (!groupId || !channelIdParam || !threadIdParam) return null;
			const resp = await detailThread(groupId, channelIdParam, threadIdParam);
			const data =
				(resp as any)?.data !== undefined ? (resp as any).data : (resp as any);
			return (data ?? null) as ThreadResponse | null;
		},
		enabled: !!(groupId && channelIdParam && threadIdParam),
	});

	const thread: ThreadResponse | null = threadDataResp ?? null;

	const applyPaginationResult = useCallback((page: number, batch: number) => {
		messagePageRef.current = page;
		const hasMore = batch === MESSAGE_PAGE_SIZE;
		hasMoreMessagesRef.current = hasMore;
		setHasMoreMessages(hasMore);
	}, []);

	const upsertChannelMessages = useCallback(
		(incoming: MessageResponse[], replace = false) => {
			if (!groupId || !channelIdParam) return;
			queryClient.setQueryData(
				["messages", groupId, channelIdParam],
				(old: any) => {
					const toArray = (o: any) =>
						Array.isArray(o?.data) ? o.data : Array.isArray(o) ? o : [];
					const current = toArray(old);
					let next: MessageResponse[];
					if (replace) next = incoming.slice();
					else {
						const map = new Map<string, MessageResponse>();
						for (const msg of current) {
							if (msg?.id) map.set(msg.id, msg as MessageResponse);
						}
						for (const msg of incoming) {
							if (msg?.id) map.set(msg.id, msg as MessageResponse);
						}
						next = Array.from(map.values());
					}
					next.sort(
						(a: any, b: any) =>
							new Date(a.createdAt as any).getTime() -
							new Date(b.createdAt as any).getTime(),
					);
					if (Array.isArray(old)) return next;
					return { ...old, data: next };
				},
			);
		},
		[groupId, channelIdParam, queryClient],
	);

	const upsertDirectMessages = useCallback(
		(targetUserId: string, incoming: MessageResponse[], replace = false) => {
			if (!targetUserId) return;
			queryClient.setQueryData(
				["direct_messages", targetUserId],
				(old: any) => {
					const toArray = (o: any) =>
						Array.isArray(o?.data) ? o.data : Array.isArray(o) ? o : [];
					const current = toArray(old);
					let next: MessageResponse[];
					if (replace) next = incoming.slice();
					else {
						const map = new Map<string, MessageResponse>();
						for (const msg of current) {
							if (msg?.id) map.set(msg.id, msg as MessageResponse);
						}
						for (const msg of incoming) {
							if (msg?.id) map.set(msg.id, msg as MessageResponse);
						}
						next = Array.from(map.values());
					}
					next.sort(
						(a: any, b: any) =>
							new Date(a.createdAt as any).getTime() -
							new Date(b.createdAt as any).getTime(),
					);
					if (Array.isArray(old)) return next;
					return { ...old, data: next };
				},
			);
		},
		[queryClient],
	);

	const schedulePrependScrollRestore = useCallback(() => {
		if (!pendingPrependScrollRef.current) return;
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				const pending = pendingPrependScrollRef.current;
				const container = listRef.current;
				if (!pending || !container) return;
				const newHeight = container.scrollHeight;
				const delta = newHeight - pending.prevScrollHeight;
				container.scrollTop = pending.prevScrollTop + delta;
				pendingPrependScrollRef.current = null;
			});
		});
	}, []);

	const handleChannelMessagesPage = useCallback(
		(resp: any, options: { page: number; replace?: boolean }) => {
			const normalized = normalizeChannelMessages(resp);
			upsertChannelMessages(normalized, options?.replace ?? false);
			if (!isDirectMode) {
				applyPaginationResult(options.page, normalized.length);
			}
			if (options.page > 1) schedulePrependScrollRestore();
			else shouldStickToBottomRef.current = true;
		},
		[
			upsertChannelMessages,
			isDirectMode,
			applyPaginationResult,
			schedulePrependScrollRestore,
		],
	);

	const handleDirectMessagesPage = useCallback(
		(
			resp: any,
			options: { page: number; replace?: boolean; targetUserId: string },
		) => {
			const normalized = normalizeDirectMessages(resp);
			upsertDirectMessages(
				options.targetUserId,
				normalized,
				options?.replace ?? false,
			);
			if (isDirectMode && directUserIdParam === options.targetUserId) {
				applyPaginationResult(options.page, normalized.length);
				if (options.page > 1) schedulePrependScrollRestore();
				else shouldStickToBottomRef.current = true;
			}
		},
		[
			upsertDirectMessages,
			isDirectMode,
			directUserIdParam,
			applyPaginationResult,
			schedulePrependScrollRestore,
		],
	);

	// List all threads for current group/channel to detect existing thread per root message
	const { data: threadsResp } = useQuery<ThreadListResponse | null>({
		queryKey: ["threads", groupId, channelIdParam],
		queryFn: async () => {
			if (!groupId || !channelIdParam) return null;
			try {
				const resp = await listThreads(groupId, channelIdParam);
				return (resp as any)?.data !== undefined
					? (resp as any)
					: (resp as any);
			} catch (e) {
				console.error("Failed to list threads", e);
				return null;
			}
		},
		enabled: !!(groupId && channelIdParam),
	});

	const threadsByMessageId = useMemo(() => {
		const map: Record<string, ThreadResponse> = {};
		const arr = (threadsResp as any)?.data ?? [];
		if (Array.isArray(arr)) {
			for (const t of arr) {
				if (t && t.messageId) map[t.messageId] = t as ThreadResponse;
			}
		}
		return map;
	}, [threadsResp]);

	// Fetch opponent user info when in Direct Message mode
	const {
		data: opponent,
		isLoading: opponentLoading,
		isError: opponentError,
	} = useQuery<UserResponse | null>({
		queryKey: ["dm_opponent", directUserIdParam],
		queryFn: async () => {
			if (!isDirectMode || !directUserIdParam) return null;
			try {
				const res = await detailUser(directUserIdParam);
				return (res as any)?.data ?? (res as any);
			} catch {
				return null;
			}
		},
		enabled: !!(isDirectMode && directUserIdParam),
	});

	// Try to determine friend relationship (best-effort)
	const { data: friendList } = useQuery<FriendUser[]>({
		queryKey: ["friends"],
		queryFn: async () => {
			try {
				const res = await listFriends();
				return res.data ?? [];
			} catch {
				return [];
			}
		},
		enabled: !!(isDirectMode && directUserIdParam),
	});

	const { data: friendRequests } = useQuery<any>({
		queryKey: ["friend_requests"],
		queryFn: async () => {
			try {
				const res = await listAllFriendRequests();
				return (res as any)?.data ?? (res as any);
			} catch {
				return [];
			}
		},
		enabled: !!(isDirectMode && directUserIdParam),
	});

	const isFriend = useMemo(() => {
		if (!friendList || !Array.isArray(friendList)) return false;
		const meId = profile?.id;
		const targetId = directUserIdParam;
		if (!meId || !targetId) return false;
		return friendList.some((fr) => fr.id === directUserIdParam);
	}, [friendList, profile?.id, directUserIdParam, friendRequestId]);

	const isPending = useMemo(() => {
		if (!friendRequests || !Array.isArray(friendRequests)) return false;
		const targetId = directUserIdParam;
		const meId = profile?.id;
		if (!targetId || !meId) return false;
		return friendRequests.some((fr: any) => {
			return fr.fromUserId === meId && fr.toUserId === targetId;
		});
	}, [friendRequests, directUserIdParam, profile?.id, friendRequestId]);

	const isInvite = useMemo(() => {
		if (!friendRequests || !Array.isArray(friendRequests)) return false;
		const targetId = directUserIdParam;
		const meId = profile?.id;
		if (!targetId || !meId) return false;
		return friendRequests.some((fr: any) => {
			if (fr.fromUserId === targetId && fr.toUserId === meId) {
				setFriendRequestId(fr.id);
			}
			return fr.fromUserId === targetId && fr.toUserId === meId;
		});
	}, [friendRequests, directUserIdParam, profile?.id, friendRequestId]);

	// Subscribe to messages for this room using the query cache as source of truth.
	// We keep optimistics in realtimeMessages and merge them for rendering.
	// Query messages differently for direct mode vs group/channel mode
	const {
		data: messagesData,
		isLoading: messagesLoading,
		isError: messagesError,
	} = useQuery<any[]>({
		queryKey: isDirectMode
			? ["direct_messages", directUserIdParam]
			: ["messages", groupId, channelIdParam],
		queryFn: async () => {
			if (isDirectMode) {
				const cached = queryClient.getQueryData<any>([
					"direct_messages",
					directUserIdParam,
				]);
				if (
					cached &&
					typeof cached === "object" &&
					Array.isArray((cached as any).data)
				) {
					return (cached as any).data;
				}
				if (Array.isArray(cached)) return cached as any[];
				return [] as any[];
			}
			if (!groupId || !channelIdParam) return [] as any[];
			const cached = queryClient.getQueryData<any>([
				"messages",
				groupId,
				channelIdParam,
			]);
			if (
				cached &&
				typeof cached === "object" &&
				Array.isArray((cached as any).data)
			) {
				return (cached as any).data;
			}
			if (Array.isArray(cached)) return cached as any[];
			return [] as any[];
		},
		enabled: isDirectMode ? !!directUserIdParam : !!(groupId && channelIdParam),
	});

	const processedMessageIds = useRef<Set<string>>(new Set());

	// Handle server echo for MESSAGE to replace optimistics and update cache
	const onServerMessage = useCallback(
		(payload: any) => {
			if (!payload) return;

			const messageId = payload.id ?? payload._id ?? payload.messageId ?? null;

			if (messageId && processedMessageIds.current.has(messageId)) {
				return;
			}

			const threadId = payload.threadId || payload.thread?.id;
			if (threadId) {
				return;
			}

			if (threadIdParam) {
				return;
			}

			if (groupId && payload.groupId && payload.groupId !== groupId) return;
			if (
				channelIdParam &&
				payload.channelId &&
				payload.channelId !== channelIdParam
			)
				return;

			if (messageId) {
				processedMessageIds.current.add(messageId);
				if (processedMessageIds.current.size > 1000) {
					const arr = Array.from(processedMessageIds.current);
					arr
						.slice(0, 500)
						.forEach((id) => processedMessageIds.current.delete(id));
				}
			}

			const serverMsg: MessageResponse = {
				...payload,
				id:
					payload.id ??
					payload._id ??
					payload.messageId ??
					payload.clientTempId ??
					`srv-${Date.now()}`,
				createdAt: payload.createdAt ?? new Date().toISOString(),
			};

			// Normalize thread shape into MessageResponse.thread
			if (!serverMsg.thread && (payload.threadId || payload.thread?.id)) {
				const tid = payload.threadId || payload.thread?.id;
				if (tid) serverMsg.thread = { id: tid } as any;
			}

			// Remove matching optimistic and add server message to realtime list
			setRealtimeMessages((prev) => {
				const next: MessageResponse[] = [];
				const resolvedParentIds: Record<string, string> = {};
				for (const message of prev) {
					let skip = false;
					const current = message;
					let resolvedTempId: string | null = null;
					if (payload.clientTempId && message.id === payload.clientTempId) {
						skip = true;
						resolvedTempId = message.id;
					} else if (
						!payload.clientTempId &&
						message.id?.startsWith?.("temp-")
					) {
						const sameSender =
							message.sender?.id === payload.senderId ||
							message.sender?.id === payload.sender?.id;
						const sameChannel = message.channelId === payload.channelId;
						const sameThread =
							(message.thread?.id ?? null) ===
							(payload.threadId ?? payload.thread?.id ?? null);
						const sameContent =
							(message.content || "") === (payload.content || "");
						const sameAttachments = Array.isArray((message as any).attachments)
							? Array.isArray(payload.attachments) &&
								(message as any).attachments.length ===
									payload.attachments?.length
							: !(message as any).attachments && !payload.attachments;
						if (
							sameSender &&
							sameChannel &&
							sameThread &&
							(sameContent || sameAttachments)
						) {
							skip = true;
							resolvedTempId = message.id;
						}
					}
					if (resolvedTempId) {
						resolvedParentIds[resolvedTempId] = serverMsg.id;
					}
					if (skip) continue;
					const aiPreviewMeta = (message as any).aiPreviewMeta;
					if (aiPreviewMeta) {
						const updatedParentId =
							aiPreviewMeta.parentMessageId ||
							(resolvedParentIds[aiPreviewMeta.parentTempId] ?? null);
						if (!aiPreviewMeta.parentMessageId && updatedParentId) {
							(current as any).aiPreviewMeta = {
								...aiPreviewMeta,
								parentMessageId: updatedParentId,
							};
						}
						const parentMatchId = ((current as any).aiPreviewMeta
							?.parentMessageId ?? null) as string | null;
						if (
							parentMatchId &&
							serverMsg.parentMessageId &&
							parentMatchId === serverMsg.parentMessageId &&
							isAiBotSender(serverMsg.sender)
						) {
							continue; // remove preview once AI responds
						}
					}
					next.push(current);
				}
				const withParentUpdates = next.map((msg) => {
					const aiPreviewMeta = (msg as any).aiPreviewMeta;
					if (!aiPreviewMeta || aiPreviewMeta.parentMessageId) return msg;
					const tempId = aiPreviewMeta.parentTempId;
					if (!tempId) return msg;
					const resolvedId = resolvedParentIds[tempId];
					if (!resolvedId) return msg;
					const updated = { ...msg } as MessageResponse;
					(updated as any).aiPreviewMeta = {
						...aiPreviewMeta,
						parentMessageId: resolvedId,
					};
					return updated;
				});
				withParentUpdates.push(serverMsg);
				return withParentUpdates;
			});

			// Update query cache with the server message
			if (!groupId || !channelIdParam) return;
			queryClient.setQueryData(
				["messages", groupId, channelIdParam],
				(old: any) => {
					const toArray = (o: any) =>
						Array.isArray(o?.data) ? o.data : Array.isArray(o) ? o : [];
					const arr = toArray(old);
					const id = serverMsg.id;
					const next = [...arr.filter((x: any) => x?.id !== id), serverMsg];
					next.sort(
						(a: any, b: any) =>
							new Date(a.createdAt as any).getTime() -
							new Date(b.createdAt as any).getTime(),
					);
					if (Array.isArray(old)) return next;
					return { ...old, data: next };
				},
			);
		},
		[groupId, channelIdParam, queryClient],
	);

	useEffect(() => {
		processedMessageIds.current.clear();
	}, [groupId, channelIdParam, directUserIdParam, isDirectMode]);

	useSocketEvent(SocketEvents.MESSAGE, onServerMessage);
	// mark socket as authenticated/ready before DM fetches

	// Direct message realtime handler (capture globally)
	const onServerDirectMessage = useCallback(
		(payload: any) => {
			if (!payload) return;
			// Determine other participant id relative to current user
			const fromId = payload.from?.id || payload.sender?.id;
			const toId = payload.to?.id;
			const myId = profile?.id;
			let otherUserId: string | undefined;
			if (myId && fromId === myId) otherUserId = toId;
			else otherUserId = fromId;
			if (!otherUserId) return;

			const involvesMe = !!myId && (fromId === myId || toId === myId);
			if (!involvesMe) return; // ignore messages not involving current user

			const serverMsg = toRealtimeDirectMessage(payload);

			// If currently viewing this DM, update realtime optimistic list
			if (isDirectMode && directUserIdParam === otherUserId) {
				setRealtimeMessages((prev) => {
					const withoutOptimistics = prev.filter((m) => {
						if (payload.clientTempId && m.id === payload.clientTempId)
							return false;
						if (!payload.clientTempId && m.id?.startsWith?.("temp-")) {
							const sameSender =
								m.sender?.id === (payload.from?.id || payload.sender?.id);
							const sameContent = (m.content || "") === (payload.content || "");
							if (sameSender && sameContent) return false;
						}
						return true;
					});
					return [...withoutOptimistics, serverMsg];
				});
			}

			// Always update cache for that DM partner so latest messages are available when navigating later
			queryClient.setQueryData(["direct_messages", otherUserId], (old: any) => {
				const toArray = (o: any) =>
					Array.isArray(o?.data) ? o.data : Array.isArray(o) ? o : [];
				const arr = toArray(old);
				const id = serverMsg.id;
				const next = [...arr.filter((x: any) => x?.id !== id), serverMsg];
				next.sort(
					(a: any, b: any) =>
						new Date(a.createdAt as any).getTime() -
						new Date(b.createdAt as any).getTime(),
				);
				if (Array.isArray(old)) return next;
				return { ...old, data: next };
			});
		},
		[profile?.id, isDirectMode, directUserIdParam, queryClient],
	);
	useSocketEvent(SocketEvents.DIRECT_MESSAGE, onServerDirectMessage);

	// Handle server echo for EDIT_MESSAGE to update content
	const onServerEditMessage = useCallback(
		(payload: any) => {
			const editedId: string | undefined = payload?.messageId ?? payload?.id;
			const newContent: string | undefined = payload?.content;
			if (!editedId) return;

			setRealtimeMessages((prev) =>
				prev.map((m) =>
					m?.id === editedId
						? {
								...m,
								...payload,
								id: editedId,
								content: newContent ?? m.content,
							}
						: m,
				),
			);

			if (!groupId || !channelIdParam) return;
			queryClient.setQueryData(
				["messages", groupId, channelIdParam],
				(old: any) => {
					if (!old) return old;
					const apply = (arr: any[]) =>
						arr.map((m) =>
							m?.id === editedId
								? {
										...m,
										...payload,
										id: editedId,
										content: newContent ?? m.content,
									}
								: m,
						);
					if (Array.isArray(old)) return apply(old);
					const dataArr = Array.isArray(old.data) ? old.data : [];
					return { ...old, data: apply(dataArr) };
				},
			);
		},
		[groupId, channelIdParam, queryClient],
	);

	useSocketEvent(SocketEvents.EDIT_MESSAGE, onServerEditMessage);

	const onServerEditDirectMessage = useCallback(
		(payload: any) => {
			const editedId: string | undefined =
				payload?.messageId ??
				payload?.id ??
				payload?._id ??
				payload?.clientTempId;
			if (!editedId) return;

			const serverMsg = { ...toRealtimeDirectMessage(payload), id: editedId };
			const fromId = payload?.from?.id ?? payload?.sender?.id ?? null;
			const toId = payload?.to?.id ?? payload?.recipient?.id ?? null;
			const myId = profile?.id ?? null;
			let otherUserId: string | undefined;
			if (myId) {
				if (fromId === myId) otherUserId = toId ?? undefined;
				else if (toId === myId) otherUserId = fromId ?? undefined;
			}
			const targetUserId =
				otherUserId ?? (isDirectMode ? directUserIdParam : undefined);

			if (
				isDirectMode &&
				directUserIdParam &&
				targetUserId === directUserIdParam
			) {
				setRealtimeMessages((prev) =>
					prev.map((m) => (m?.id === editedId ? { ...m, ...serverMsg } : m)),
				);
			}

			if (targetUserId) {
				queryClient.setQueryData(
					["direct_messages", targetUserId],
					(old: any) => {
						if (!old) return old;
						const toArray = (o: any) =>
							Array.isArray(o?.data) ? o.data : Array.isArray(o) ? o : [];
						const current = toArray(old);
						if (!current.length) return old;
						const next = current.map((msg: any) =>
							msg?.id === editedId ? { ...msg, ...serverMsg } : msg,
						);
						if (Array.isArray(old)) return next;
						return { ...old, data: next };
					},
				);
			}
		},
		[profile?.id, isDirectMode, directUserIdParam, queryClient],
	);

	useSocketEvent(SocketEvents.EDIT_DIRECT_MESSAGE, onServerEditDirectMessage);

	const messagesFromCache: MessageResponse[] = useMemo(() => {
		return Array.isArray(messagesData) ? (messagesData as any) : [];
	}, [messagesData]);

	const messages: MessageResponse[] = useMemo(() => {
		const byId = new Map<string, MessageResponse>();
		for (const m of messagesFromCache) {
			if (!m || !m.id) continue;
			byId.set(m.id, m as any);
		}
		for (const m of realtimeMessages) {
			if (!m || !m.id) continue;
			byId.set(m.id, m as any);
		}
		const list = Array.from(byId.values());
		list.sort(
			(a: any, b: any) =>
				new Date(a.createdAt as any).getTime() -
				new Date(b.createdAt as any).getTime(),
		);
		return list;
	}, [messagesFromCache, realtimeMessages]);

	const latestMessagePerThread = useMemo(() => {
		const map = new Map<string, MessageResponse>();
		for (const m of messages) {
			const tId = m.thread?.id as string | undefined;
			if (!tId) continue;
			const prev = map.get(tId);
			if (
				!prev ||
				new Date(m.createdAt as any).getTime() >
					new Date(prev.createdAt as any).getTime()
			) {
				map.set(tId, m);
			}
		}
		return map;
	}, [messages]);

	const threadDetailsMap = useMemo<
		Record<string, ThreadResponse | null>
	>(() => {
		// Optionally populate with thread metadata if available elsewhere
		return {};
	}, [groupId, channelIdParam]);

	// Join socket room whenever group/channel changes (or first mount)
	useEffect(() => {
		if (isDirectMode) return; // skip room join logic in direct mode
		if (!groupId || !channelIdParam) return;

		let cancelled = false;

		const joinRoomFlow = async () => {
			await waitUntilReady();
			if (cancelled) return;

			const joinKey = `${groupId}:${channelIdParam}`;
			// If we're already in this room and socket is connected, skip
			if (lastJoinKeyRef.current === joinKey && socket?.connected) return;
			lastJoinKeyRef.current = joinKey;

			const payload = { groupId, channelId: channelIdParam };

			try {
				if (!socket || !socket.connected) throw new Error("socket-not-ready");
				setSocketLoading(true);
				socket.emit(SocketEvents.JOIN_ROOM, payload);
				console.debug("[ChatArea] emitted JOIN_ROOM", payload);
				// Fallback: request messages immediately as well (in case JOINED_ROOM isn't fired)
				const req = {
					groupId,
					channelId: channelIdParam,
					page: 1,
					take: MESSAGE_PAGE_SIZE,
				};
				socket.emit(SocketEvents.FETCH_MESSAGES, req, (resp: any) => {
					if (cancelled) return;
					try {
						if (resp && (resp.error || resp.code)) {
							console.error(
								"[ChatArea] FETCH_MESSAGES ack error (fallback)",
								resp,
							);
							setSocketLoading(false);
							return;
						}
						handleChannelMessagesPage(resp, { page: 1, replace: true });
						console.debug(
							"[ChatArea] FETCH_MESSAGES fallback -> set messages",
							extractSocketArray(resp).length,
						);
						setSocketLoading(false);
					} catch (e) {
						console.error(
							"[ChatArea] error handling FETCH_MESSAGES fallback",
							e,
						);
						setSocketLoading(false);
					}
				});
			} catch (err) {
				if (cancelled) return;
				console.debug("[ChatArea] queue JOIN_ROOM due to", err);
				setEmitQueue((q) => [
					...q,
					{ event: SocketEvents.JOIN_ROOM, payload },
					{
						event: SocketEvents.FETCH_MESSAGES,
						payload: {
							groupId,
							channelId: channelIdParam,
							page: 1,
							take: MESSAGE_PAGE_SIZE,
						},
					},
				]);
				setSocketLoading(true);
			}
		};

		joinRoomFlow();

		return () => {
			cancelled = true;
		};
	}, [
		groupId,
		channelIdParam,
		socket,
		queryClient,
		isDirectMode,
		waitUntilReady,
	]);

	useEffect(() => {
		if (!socket) return;
		if (isDirectMode) {
			if (!directUserIdParam) {
				socket.emit(SocketEvents.CHAT_VIEW, {
					type: "direct",
					active: false,
				});
				return;
			}
			socket.emit(SocketEvents.CHAT_VIEW, {
				type: "direct",
				peerUserId: directUserIdParam,
				active: true,
			});
			return () => {
				socket.emit(SocketEvents.CHAT_VIEW, {
					type: "direct",
					peerUserId: directUserIdParam,
					active: false,
				});
			};
		}

		if (groupId && channelIdParam) {
			socket.emit(SocketEvents.CHAT_VIEW, {
				type: "group",
				groupId,
				channelId: channelIdParam,
				active: true,
			});
			return () => {
				socket.emit(SocketEvents.CHAT_VIEW, {
					type: "group",
					groupId,
					channelId: channelIdParam,
					active: false,
				});
			};
		}

		return () => {
			socket.emit(SocketEvents.CHAT_VIEW, { type: "group", active: false });
			socket.emit(SocketEvents.CHAT_VIEW, { type: "direct", active: false });
		};
	}, [socket, isDirectMode, groupId, channelIdParam, directUserIdParam]);

	// Reset optimistics when switching room
	useEffect(() => {
		setRealtimeMessages([]);
	}, [groupId, channelIdParam, directUserIdParam, isDirectMode]);

	useEffect(() => {
		messagePageRef.current = 1;
		hasMoreMessagesRef.current = true;
		setHasMoreMessages(true);
		setFetchingOlderMessages(false);
		fetchingOlderRef.current = false;
		pendingPrependScrollRef.current = null;
		shouldStickToBottomRef.current = true;
	}, [groupId, channelIdParam, directUserIdParam, isDirectMode]);

	// After JOINED_ROOM, ask server for messages via FETCH_MESSAGES (ack)
	const onJoinedRoom = useCallback(() => {
		if (!groupId || !channelIdParam) return;
		const req = {
			groupId,
			channelId: channelIdParam,
			page: 1,
			take: MESSAGE_PAGE_SIZE,
		};
		try {
			if (!socket) throw new Error("socket-not-ready");
			setSocketLoading(true);
			socket.emit(SocketEvents.FETCH_MESSAGES, req, (resp: any) => {
				try {
					if (resp && (resp.error || resp.code)) {
						console.error("[ChatArea] FETCH_MESSAGES ack error", resp);
						setSocketLoading(false);
						return;
					}
					handleChannelMessagesPage(resp, { page: 1, replace: true });
					console.debug(
						"[ChatArea] FETCH_MESSAGES ack -> set messages in cache",
						extractSocketArray(resp).length,
					);
					setSocketLoading(false);
				} catch (innerErr) {
					console.error(
						"[ChatArea] error handling FETCH_MESSAGES ack",
						innerErr,
					);
					setSocketLoading(false);
				}
			});
		} catch (err) {
			console.debug("[ChatArea] queue FETCH_MESSAGES due to", err);
			setEmitQueue((q) => [
				...q,
				{ event: SocketEvents.FETCH_MESSAGES, payload: req },
			]);
			setSocketLoading(true);
		}
	}, [socket, groupId, channelIdParam, queryClient]);

	useSocketEvent(SocketEvents.JOINED_ROOM, onJoinedRoom);

	// Fetch direct messages when entering direct mode or target user changes
	useEffect(() => {
		if (!isDirectMode || !directUserIdParam) return;

		let cancelled = false;
		const payload = {
			targetUserId: directUserIdParam,
			page: 1,
			take: MESSAGE_PAGE_SIZE,
		};

		const fetchDirectMessages = async () => {
			await waitUntilReady();
			if (cancelled || !socket) return;
			setSocketLoading(true);
			try {
				socket.emit(
					SocketEvents.FETCH_DIRECT_MESSAGES,
					payload,
					(resp: any) => {
						if (cancelled) return;
						try {
							if (resp && (resp.error || resp.code)) {
								console.error(
									"[ChatArea] FETCH_DIRECT_MESSAGES ack error",
									resp,
								);
								setSocketLoading(false);
								return;
							}
							handleDirectMessagesPage(resp, {
								page: 1,
								replace: true,
								targetUserId: directUserIdParam,
							});
							setSocketLoading(false);
						} catch (e) {
							console.error(
								"[ChatArea] error handling FETCH_DIRECT_MESSAGES ack",
								e,
							);
							setSocketLoading(false);
						}
					},
				);
			} catch (err) {
				if (cancelled) return;
				console.debug("[ChatArea] queue FETCH_DIRECT_MESSAGES due to", err);
				setEmitQueue((q) => [
					...q,
					{
						event: SocketEvents.FETCH_DIRECT_MESSAGES,
						payload,
					},
				]);
				setSocketLoading(true);
			}
		};

		fetchDirectMessages();

		return () => {
			cancelled = true;
		};
	}, [
		isDirectMode,
		directUserIdParam,
		socket,
		waitUntilReady,
		handleDirectMessagesPage,
	]);

	// Queue flush & connect handling
	useEffect(() => {
		if (!socket) {
			console.debug(
				"[ChatArea] socket is undefined (will queue emits until socket exists)",
			);
			return;
		}

		let cancelled = false;

		const flushQueuedEmits = async (queued: any[]) => {
			if (!queued.length) return;
			try {
				await waitUntilReady();
			} catch (err) {
				console.error(
					"[ChatArea] waitUntilReady failed while flushing queue",
					err,
				);
				return;
			}
			if (cancelled) return;
			queued.forEach((item) => {
				try {
					socket.emit(item.event, item.payload, (ack: any) => {
						const handleFetchMessagesAck = () => {
							try {
								if (ack && (ack.error || ack.code)) {
									console.error(
										"[ChatArea] flush FETCH_MESSAGES ack error",
										ack,
									);
									setSocketLoading(false);
									return;
								}
								const page = (item.payload as any)?.page ?? 1;
								handleChannelMessagesPage(ack, {
									page,
									replace: page === 1,
								});
								console.debug(
									"[ChatArea] flush FETCH_MESSAGES -> set messages",
									extractSocketArray(ack).length,
								);
								setSocketLoading(false);
							} catch (e) {
								console.error(
									"[ChatArea] flush FETCH_MESSAGES handling error",
									e,
								);
								setSocketLoading(false);
							}
						};

						const handleFetchDirectMessagesAck = () => {
							try {
								if (ack && (ack.error || ack.code)) {
									console.error(
										"[ChatArea] flush FETCH_DIRECT_MESSAGES ack error",
										ack,
									);
									setSocketLoading(false);
									return;
								}
								const targetUserId = (item.payload as any)?.targetUserId;
								const page = (item.payload as any)?.page ?? 1;
								if (targetUserId) {
									handleDirectMessagesPage(ack, {
										page,
										replace: page === 1,
										targetUserId,
									});
								}
								setSocketLoading(false);
							} catch (e) {
								console.error(
									"[ChatArea] flush FETCH_DIRECT_MESSAGES handling error",
									e,
								);
								setSocketLoading(false);
							}
						};

						if (item.event === SocketEvents.FETCH_MESSAGES) {
							handleFetchMessagesAck();
						} else if (item.event === SocketEvents.FETCH_DIRECT_MESSAGES) {
							handleFetchDirectMessagesAck();
						} else {
							console.debug("[ChatArea] flush ack", item.event, ack);
						}
					});
				} catch (err) {
					console.error("[ChatArea] flush emit error", err);
					setEmitQueue((q) => [...q, item]);
				}
			});
		};

		if (socket.connected && emitQueue.length > 0) {
			const queued = [...emitQueue];
			setEmitQueue([]);
			flushQueuedEmits(queued);
		}

		const onConnect = () => {
			const handleConnectAsync = async () => {
				try {
					await waitUntilReady();
				} catch (err) {
					console.error("[ChatArea] waitUntilReady failed on connect", err);
					return;
				}
				if (cancelled) return;

				if (emitQueue.length) {
					const queued = [...emitQueue];
					setEmitQueue([]);
					await flushQueuedEmits(queued);
				}

				// Re-join the current room on reconnect (group mode only)
				if (!isDirectMode && groupId && channelIdParam) {
					const payload = { groupId, channelId: channelIdParam };
					try {
						socket.emit(SocketEvents.JOIN_ROOM, payload);
						console.debug("[ChatArea] re-joined room after connect", payload);
						lastJoinKeyRef.current = `${groupId}:${channelIdParam}`;
						// Proactively fetch messages in case server doesn't emit JOINED_ROOM
						setSocketLoading(true);
						const req = { groupId, channelId: channelIdParam, page: 1 };
						socket.emit(SocketEvents.FETCH_MESSAGES, req, (resp: any) => {
							try {
								if (resp && (resp.error || resp.code)) {
									console.error(
										"[ChatArea] FETCH_MESSAGES ack error (onConnect)",
										resp,
									);
									setSocketLoading(false);
									return;
								}
								handleChannelMessagesPage(resp, { page: 1, replace: true });
								console.debug(
									"[ChatArea] FETCH_MESSAGES (onConnect) -> set messages",
									extractSocketArray(resp).length,
								);
								setSocketLoading(false);
							} catch (e) {
								console.error(
									"[ChatArea] error handling FETCH_MESSAGES (onConnect)",
									e,
								);
								setSocketLoading(false);
							}
						});
					} catch (err) {
						console.debug("[ChatArea] queue re-join due to", err);
						setEmitQueue((q) => [
							...q,
							{ event: SocketEvents.JOIN_ROOM, payload },
						]);
					}
				}
			};

			handleConnectAsync().catch((err) =>
				console.error("[ChatArea] onConnect handler error", err),
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
		groupId,
		channelIdParam,
		queryClient,
		isDirectMode,
		waitUntilReady,
	]);

	const send = useCallback(
		async (payload?: ChatInputPayload) => {
			if (!payload) return;

			// guard: phải have channel selected
			// guard: phải have channel selected OR in direct mode have target user
			if (!isDirectMode && !channelIdParam) {
				console.warn("[ChatArea] missing channelIdParam — cannot send message");
				window.alert("Please select a channel before sending a message.");
				return;
			}
			if (isDirectMode && !directUserIdParam) {
				console.warn(
					"[ChatArea] missing directUserIdParam — cannot send direct message",
				);
				window.alert("Missing target user.");
				return;
			}

			const tempId = `temp-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

			const baseEmit: any = isDirectMode
				? {
						toUserId: directUserIdParam,
						attachmentIds: payload.attachmentIds,
						codeBlock: payload.codeBlock,
					}
				: {
						groupId: groupId ?? null,
						channelId: channelIdParam ?? null,
						attachmentIds: payload.attachmentIds,
						codeBlock: payload.codeBlock,
					};

			const queueEmit = (eventName: string, payloadToSend: any) => {
				setEmitQueue((q) => [
					...q,
					{ event: eventName, payload: payloadToSend },
				]);
			};

			// helper: create sender payload server có thể mong
			const senderPayload = {
				id: profile?.id ?? null,
				firstName: profile?.firstName ?? null,
				lastName: profile?.lastName ?? null,
				username: profile?.username ?? null,
				avatarUrl: profile?.avatarUrl ?? null,
			};

			// helper to actually emit safely with logging & ack handling; returns a promise resolving ack
			const safeEmit = (ev: string, p: any): Promise<any> => {
				console.debug("[ChatArea] safeEmit prepared", ev, p, {
					socketConnected: socket?.connected,
				});
				// quick guard: ensure required identifiers exist
				if (!isDirectMode && (!p.groupId || !p.channelId)) {
					console.warn(
						"[ChatArea] safeEmit missing groupId or channelId — queueing instead",
						{ groupId: p.groupId, channelId: p.channelId },
					);
					queueEmit(ev, p);
					return Promise.resolve({ queued: true });
				}
				if (isDirectMode && !p.toUserId) {
					console.warn(
						"[ChatArea] safeEmit missing toUserId — queueing instead",
						{ toUserId: p.toUserId },
					);
					queueEmit(ev, p);
					return Promise.resolve({ queued: true });
				}

				return new Promise((resolve) => {
					try {
						if (!socket) throw new Error("socket-not-ready");
						socket.emit(ev, p, (ack: any) => {
							console.debug("[ChatArea] emit ack", ev, ack);
							if (ack && (ack.error || ack.code)) {
								console.error("[ChatArea] server ack error", ack);
							}
							resolve(ack);
						});
						console.debug("[ChatArea] emitted", ev);
					} catch (err) {
						console.warn("[ChatArea] emit failed, queueing", err);
						queueEmit(ev, p);
						resolve({ queued: true, error: String(err) });
					}
				});
			};

			if (payload.type === "preview") {
				const text = (payload.text || "").trim();
				const clientTempId =
					payload.clientTempId ||
					`temp-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
				const previewUploads = payload.meta?.previewUploads?.map(
					(entry: any) => ({ ...entry }),
				);
				const optimistic: MessageResponse = {
					id: clientTempId,
					content: text,
					createdAt: new Date().toISOString(),
					channelId: channelIdParam,
					thread: threadIdParam ? ({ id: threadIdParam } as any) : undefined,
					sender: {
						id: profile?.id ?? "me",
						firstName: profile?.firstName,
						lastName: profile?.lastName,
						username: profile?.username,
						avatarUrl: profile?.avatarUrl,
					} as any,
				} as any;
				(optimistic as any).pending = true;
				if (previewUploads?.length) {
					(optimistic as any).previewUploads = previewUploads;
				}

				setRealtimeMessages((prev) => [...prev, optimistic]);
				return;
			}

			if (payload.type === "preview-progress") {
				if (!payload.clientTempId) return;
				setRealtimeMessages((prev) =>
					prev.map((msg) => {
						if (msg.id !== payload.clientTempId) return msg;
						const next = { ...msg } as any;
						next.previewUploads =
							payload.meta?.previewUploads?.map((entry: any) => ({
								...entry,
							})) ?? [];
						return next;
					}),
				);
				return;
			}

			if (payload.type === "text") {
				const text = payload.text.trim();
				if (!text) return;

				// edit flow
				if (editingMessage) {
					const ev = isDirectMode
						? SocketEvents.EDIT_DIRECT_MESSAGE
						: SocketEvents.EDIT_MESSAGE;
					const p = {
						...baseEmit,
						messageId: editingMessage.id,
						content: text,
					};
					console.debug("[ChatArea] edit payload", p);
					safeEmit(ev, p);
					setEditingMessage(null);
					return;
				}

				// optimistic
				const optimistic: MessageResponse = {
					id: payload.clientTempId || tempId,
					content: text,
					createdAt: new Date().toISOString(),
					channelId: channelIdParam,
					thread: threadIdParam ? ({ id: threadIdParam } as any) : undefined,
					sender: {
						id: profile?.id ?? "me",
						firstName: profile?.firstName,
						lastName: profile?.lastName,
						username: profile?.username,
						avatarUrl: profile?.avatarUrl,
					} as any,
				} as any;

				setRealtimeMessages((prev) => {
					const targetId = payload.clientTempId || tempId;
					const filtered = prev.filter((m) => m.id !== targetId);
					return [...filtered, optimistic];
				});

				const ev = isDirectMode
					? SocketEvents.SEND_DIRECT_MESSAGE
					: SocketEvents.MESSAGE;
				const p = isDirectMode
					? {
							...baseEmit,
							parentMessageId: replyToMessage?.id || null,
							content: text,
							clientTempId: payload.clientTempId || tempId,
							codeBlock: payload.codeBlock,
							senderId: senderPayload.id,
							sender: senderPayload,
						}
					: {
							...baseEmit,
							parentMessageId: replyToMessage?.id || null,
							content: text,
							clientTempId: payload.clientTempId || tempId,
							codeBlock: payload.codeBlock,
							senderId: senderPayload.id,
							sender: senderPayload,
						};

				const ackPromise = safeEmit(ev, p);
				setReplyToMessage(null);
				if (!isDirectMode) {
					const aiProvider = detectAiMention(text);
					if (aiProvider) {
						const previewId = `ai-preview-${payload.clientTempId || tempId}`;
						const providerLabel = aiProvider === "openai" ? "OpenAI" : "Gemini";
						const aiPreviewMessage: MessageResponse = {
							id: previewId,
							content: buildAiPreviewContent(aiProvider),
							createdAt: new Date().toISOString(),
							channelId: channelIdParam as string,
							thread: threadIdParam
								? ({ id: threadIdParam } as any)
								: undefined,
							senderId: `${aiProvider}-bot`,
							sender: {
								id: `${aiProvider}-bot`,
								firstName: providerLabel,
								lastName: "Bot",
								username: `${aiProvider}-bot`,
								avatarUrl: null,
							} as any,
							parentMessageId: null,
							parentMessage: null,
						} as any;
						(aiPreviewMessage as any).pending = true;
						(aiPreviewMessage as any).aiPreviewMeta = {
							provider: aiProvider,
							parentTempId: payload.clientTempId || tempId,
							parentMessageId: null,
						};
						setRealtimeMessages((prev) => [...prev, aiPreviewMessage]);
					}
				}
				return ackPromise; // allow caller (ChatInput) to access server-assigned messageId for AI ask
			}

			if (payload.type === "files") {
				const files = payload.files;
				if (!files || files.length === 0) return;

				const isMarkdownText = (f: File) => {
					const mt = (f.type || "").toLowerCase();
					if (mt === "text/markdown" || mt === "text/plain") return true;
					const lower = f.name.toLowerCase();
					return (
						lower.endsWith(".md") ||
						lower.endsWith(".markdown") ||
						lower.endsWith(".txt")
					);
				};

				const mdFiles = files.filter(isMarkdownText);
				const otherFiles = files.filter((f) => !isMarkdownText(f));

				// 1) For markdown/text files: read their content and send as text messages (markdown)
				for (const f of mdFiles) {
					try {
						const content = await f.text();
						console.log("[ChatArea] read markdown file", f.text(), content);
						const mdTempId = `temp-${Date.now()}-${Math.floor(Math.random() * 10000)}-md`;

						const optimisticMd: MessageResponse = {
							id: mdTempId,
							content,
							createdAt: new Date().toISOString(),
							channelId: channelIdParam,
							thread: threadIdParam
								? ({ id: threadIdParam } as any)
								: undefined,
							sender: {
								id: profile?.id ?? "me",
								firstName: profile?.firstName,
								lastName: profile?.lastName,
								username: profile?.username,
								avatarUrl: profile?.avatarUrl,
							} as any,
						} as any;

						setRealtimeMessages((prev) => [...prev, optimisticMd]);

						const evMd = isDirectMode
							? SocketEvents.SEND_DIRECT_MESSAGE
							: SocketEvents.MESSAGE;
						const pMd = isDirectMode
							? {
									...baseEmit,
									parentMessageId: replyToMessage?.id || null,
									content,
									clientTempId: mdTempId,
									senderId: senderPayload.id,
									sender: senderPayload,
								}
							: {
									...baseEmit,
									parentMessageId: replyToMessage?.id || null,
									content,
									clientTempId: mdTempId,
									senderId: senderPayload.id,
									sender: senderPayload,
								};
						console.debug(
							"[ChatArea] about to emit markdown message",
							evMd,
							pMd,
						);
						safeEmit(evMd, pMd);
					} catch (e) {
						console.error("Failed to read markdown file", f.name, e);
					}
				}

				// 2) For remaining files: send as attachments as before
				if (otherFiles.length > 0) {
					const attachmentsMeta = otherFiles.map((f) => ({
						name: f.name,
						size: f.size,
						type: f.type,
					}));

					const optimisticFilesMsg: MessageResponse = {
						id: tempId,
						content: "",
						createdAt: new Date().toISOString(),
						channelId: channelIdParam,
						thread: threadIdParam ? ({ id: threadIdParam } as any) : undefined,
						sender: {
							id: profile?.id ?? "me",
							firstName: profile?.firstName,
							lastName: profile?.lastName,
							username: profile?.username,
							avatarUrl: profile?.avatarUrl,
						} as any,
						attachments: attachmentsMeta,
					} as any;

					setRealtimeMessages((prev) => [...prev, optimisticFilesMsg]);

					const ev = isDirectMode
						? SocketEvents.SEND_DIRECT_MESSAGE
						: SocketEvents.MESSAGE;
					const p = isDirectMode
						? {
								...baseEmit,
								parentMessageId: replyToMessage?.id || null,
								content: "",
								attachments: attachmentsMeta,
								clientTempId: tempId,
								senderId: senderPayload.id,
								sender: senderPayload,
							}
						: {
								...baseEmit,
								parentMessageId: replyToMessage?.id || null,
								content: "",
								attachments: attachmentsMeta,
								clientTempId: tempId,
								senderId: senderPayload.id,
								sender: senderPayload,
							};

					console.debug("[ChatArea] about to emit attachments", ev, p);
					safeEmit(ev, p);
				}

				setReplyToMessage(null);
				return;
			}
		},
		[
			socket,
			profile,
			groupId,
			channelIdParam,
			threadIdParam,
			editingMessage,
			replyToMessage,
			isDirectMode,
			directUserIdParam,
		],
	);

	// Compute a stable room key (group/channel/thread) to detect hard switches
	const roomKey = isDirectMode
		? `dm:${directUserIdParam}`
		: `${groupId ?? ""}:${channelIdParam ?? ""}:${threadIdParam ?? ""}`;

	const scrollToBottomInstant = useCallback((force = false) => {
		if (!force && !shouldStickToBottomRef.current) return;
		const container = listRef.current;
		try {
			if (container) {
				container.scrollTop = container.scrollHeight;
			}
			// Anchor-based fallback for cases where direct scrollTop is ignored due to layout timing
			bottomRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
			if (force) shouldStickToBottomRef.current = true;
		} catch {
			/* noop */
		}
	}, []);

	// Ensure we start at the bottom immediately on room change (avoid top flash)
	useLayoutEffect(() => {
		// Run across frames in case content height changes after first paint
		scrollToBottomInstant(true);
		const id = requestAnimationFrame(() => scrollToBottomInstant(true));
		return () => cancelAnimationFrame(id);
	}, [roomKey, scrollToBottomInstant]);

	// Keep anchored to bottom when new messages arrive or input type changes
	useLayoutEffect(() => {
		scrollToBottomInstant();
	}, [messages, inboxTypeSelected, scrollToBottomInstant]);

	// Also scroll after data loads finish for this room
	useEffect(() => {
		if (!messagesLoading && !threadLoading && !socketLoading) {
			const id1 = requestAnimationFrame(() => scrollToBottomInstant(true));
			const id2 = requestAnimationFrame(() => scrollToBottomInstant(true));
			return () => {
				cancelAnimationFrame(id1);
				cancelAnimationFrame(id2);
			};
		}
	}, [
		messagesLoading,
		threadLoading,
		socketLoading,
		roomKey,
		scrollToBottomInstant,
	]);

	const loadOlderMessages = useCallback(() => {
		if (fetchingOlderRef.current || !hasMoreMessagesRef.current) return;
		if (isDirectMode) {
			if (!directUserIdParam) return;
		} else if (!groupId || !channelIdParam) {
			return;
		}
		if (!socket || !socket.connected) return;

		const nextPage = messagePageRef.current + 1;
		const payload = isDirectMode
			? {
					targetUserId: directUserIdParam,
					page: nextPage,
					take: MESSAGE_PAGE_SIZE,
				}
			: {
					groupId,
					channelId: channelIdParam,
					page: nextPage,
					take: MESSAGE_PAGE_SIZE,
				};

		if (listRef.current) {
			pendingPrependScrollRef.current = {
				prevScrollHeight: listRef.current.scrollHeight,
				prevScrollTop: listRef.current.scrollTop ?? 0,
			};
		} else {
			pendingPrependScrollRef.current = null;
		}

		fetchingOlderRef.current = true;
		setFetchingOlderMessages(true);
		const event = isDirectMode
			? SocketEvents.FETCH_DIRECT_MESSAGES
			: SocketEvents.FETCH_MESSAGES;

		try {
			socket.emit(event, payload, (resp: any) => {
				try {
					if (resp && (resp.error || resp.code)) {
						console.error(`[ChatArea] ${event} ack error (older)`, resp);
						pendingPrependScrollRef.current = null;
						return;
					}
					if (isDirectMode && directUserIdParam) {
						handleDirectMessagesPage(resp, {
							page: nextPage,
							replace: false,
							targetUserId: directUserIdParam,
						});
					} else {
						handleChannelMessagesPage(resp, {
							page: nextPage,
							replace: false,
						});
					}
				} finally {
					fetchingOlderRef.current = false;
					setFetchingOlderMessages(false);
				}
			});
		} catch (err) {
			console.error("[ChatArea] loadOlderMessages failed", err);
			fetchingOlderRef.current = false;
			setFetchingOlderMessages(false);
			pendingPrependScrollRef.current = null;
		}
	}, [
		channelIdParam,
		directUserIdParam,
		groupId,
		handleChannelMessagesPage,
		handleDirectMessagesPage,
		isDirectMode,
		socket,
	]);

	useEffect(() => {
		const container = listRef.current;
		if (!container) return;
		let rafId: number | null = null;
		const onScroll = () => {
			if (rafId) cancelAnimationFrame(rafId);
			rafId = requestAnimationFrame(() => {
				const { scrollTop, scrollHeight, clientHeight } = container;
				const nearBottom =
					scrollHeight - (scrollTop + clientHeight) <
					SCROLL_BOTTOM_THRESHOLD_PX;
				shouldStickToBottomRef.current = nearBottom;
				if (
					scrollTop < SCROLL_TOP_THRESHOLD_PX &&
					hasMoreMessagesRef.current &&
					!fetchingOlderRef.current
				) {
					loadOlderMessages();
				}
			});
		};
		container.addEventListener("scroll", onScroll);
		return () => {
			if (rafId) cancelAnimationFrame(rafId);
			container.removeEventListener("scroll", onScroll);
		};
	}, [loadOlderMessages, roomKey]);

	const handleCopy = useCallback((m: MessageResponse) => {
		if (!m.content) return;
		navigator.clipboard?.writeText(m.content).catch(() => {
			const ta = document.createElement("textarea");
			ta.value = m.content || "";
			document.body.appendChild(ta);
			ta.select();
			document.execCommand("copy");
			ta.remove();
		});
	}, []);

	const handleEdit = useCallback((m: MessageResponse) => {
		setEditingMessage(m);
	}, []);

	const handleReply = useCallback((m: MessageResponse) => {
		setReplyToMessage(m);
	}, []);

	const handleGoToMessage = useCallback((id: string) => {
		// Attempt to locate the message element and smoothly scroll to it
		const el = document.getElementById(`message-${id}`);
		if (!el) return;
		el.scrollIntoView({ behavior: "smooth", block: "center" });
		// Temporary highlight
		el.classList.add(
			"ring",
			"ring-primary",
			"ring-offset-2",
			"ring-offset-background",
			"transition-colors",
		);
		setTimeout(() => {
			el.classList.remove(
				"ring",
				"ring-primary",
				"ring-offset-2",
				"ring-offset-background",
				"transition-colors",
			);
		}, 1600);
	}, []);

	const handleCreateThread = useCallback(
		(m: MessageResponse) => {
			if (!groupId || !channelIdParam || !m?.id) return;
			const existing = threadsByMessageId[m.id];
			if (existing) {
				// Dispatch event to open existing thread panel
				window.dispatchEvent(
					new CustomEvent("app:threadSelected", {
						detail: { threadId: existing.id },
					}),
				);
				return;
			}
			createThread(groupId, channelIdParam, { messageId: m.id })
				.then((resp: any) => {
					const threadData = resp?.data || resp;
					if (threadData?.id) {
						queryClient.invalidateQueries({
							queryKey: ["threads", groupId, channelIdParam],
						});
						window.dispatchEvent(
							new CustomEvent("app:threadSelected", {
								detail: { threadId: threadData.id },
							}),
						);
					} else {
						console.warn("Thread create response missing id", threadData);
					}
				})
				.catch((err) => {
					console.error("Failed to create thread", err);
				});
		},
		[groupId, channelIdParam, threadsByMessageId, queryClient],
	);

	const handleReport = useCallback(
		(m: MessageResponse) => {
			let type: MessageReportType | null = null;
			if (isDirectMode) type = MessageReportType.DIRECT_MESSAGE;
			else if (threadIdParam) type = MessageReportType.THREAD_MESSAGE;
			else type = MessageReportType.CHANNEL_MESSAGE;
			if (!type) {
				toast.error("Cannot determine message type to report");
				return;
			}
			setMessagePendingReport(m);
			setReportMessageType(type);
			setReportMessageDialogOpen(true);
		},
		[isDirectMode, threadIdParam],
	);

	const handleDelete = useCallback(async (m: MessageResponse) => {
		setMessagePendingDelete(m);
		setDeleteDialogOpen(true);
	}, []);

	const confirmDelete = useCallback(() => {
		if (!messagePendingDelete) return;
		setDeleteSubmitting(true);
		try {
			if (isDirectMode) {
				if (!directUserIdParam) {
					throw new Error("missing-direct-user-id");
				}
				socket?.emit(
					SocketEvents.DELETE_DIRECT_MESSAGE,
					messagePendingDelete.id,
				);
				return;
			}
			// Emit DELETE_MESSAGE with the messageId as payload
			socket?.emit(SocketEvents.DELETE_MESSAGE, messagePendingDelete.id);
		} catch (err) {
			console.error("Delete message emit failed", err);
			toast.error("Unable to delete message. Please try again.");
		} finally {
			setDeleteSubmitting(false);
			setDeleteDialogOpen(false);
			setMessagePendingDelete(null);
		}
	}, [socket, messagePendingDelete, isDirectMode, directUserIdParam]);

	// Apply server confirmation for DELETE_MESSAGE to remove from state and cache
	const onServerDeleteMessage = useCallback(
		(payload: any) => {
			const deletedId: string | undefined =
				payload?.messageId ??
				payload?.id ??
				(typeof payload === "string" ? payload : undefined);
			if (!deletedId) return;

			// Remove from optimistic realtime list
			setRealtimeMessages((prev) => prev.filter((m) => m.id !== deletedId));

			// Remove from query cache
			if (!groupId || !channelIdParam) return;
			queryClient.setQueryData(
				["messages", groupId, channelIdParam],
				(old: any) => {
					if (!old) return old;
					const toArray = (o: any) =>
						Array.isArray(o?.data) ? o.data : Array.isArray(o) ? o : [];
					const arr = toArray(old);
					const filtered = arr.filter((msg: any) => msg?.id !== deletedId);
					if (Array.isArray(old)) return filtered;
					return { ...old, data: filtered };
				},
			);
		},
		[groupId, channelIdParam, queryClient],
	);

	useSocketEvent(SocketEvents.DELETE_MESSAGE, onServerDeleteMessage);

	const onServerDeleteDirectMessage = useCallback(
		(payload: any) => {
			const deletedId: string | undefined =
				payload?.messageId ??
				payload?.id ??
				(typeof payload === "string" ? payload : undefined);
			if (!deletedId) return;

			setRealtimeMessages((prev) => prev.filter((m) => m.id !== deletedId));

			const pruneList = (old: any) => {
				if (!old) return old;
				const toArray = (o: any) =>
					Array.isArray(o?.data) ? o.data : Array.isArray(o) ? o : [];
				const arr = toArray(old);
				const filtered = arr.filter((msg: any) => msg?.id !== deletedId);
				if (filtered.length === arr.length) return old;
				if (Array.isArray(old)) return filtered;
				return { ...old, data: filtered };
			};

			const directQueries = queryClient.getQueriesData({
				queryKey: ["direct_messages"],
			});
			directQueries.forEach(([key]) => {
				queryClient.setQueryData(key, pruneList);
			});
		},
		[queryClient],
	);

	useSocketEvent(
		SocketEvents.DELETE_DIRECT_MESSAGE,
		onServerDeleteDirectMessage,
	);

	const handleDeleteDialogOpenChange = useCallback((open: boolean) => {
		setDeleteDialogOpen(open);
		if (!open) {
			setMessagePendingDelete(null);
		}
	}, []);

	const handleReportMessageDialogOpenChange = useCallback((open: boolean) => {
		setReportMessageDialogOpen(open);
		if (!open) {
			setMessagePendingReport(null);
			setReportMessageType(null);
		}
	}, []);

	const handleReact = useCallback(
		(messageId: string, reaction: string) => {
			socket?.emit("message:reaction", {
				groupId: groupId ?? null,
				channelId: channelIdParam ?? null,
				messageId,
				reaction,
			});
			setReactionPickerFor(null);
		},
		[socket, groupId, channelIdParam],
	);

	// Thread lifecycle handlers: keep local thread list cache in sync
	const onThreadCreated = React.useCallback(
		(thread: ThreadResponse) => {
			if (!thread) return;
			// Guard: ensure we are in a group/channel context before mutating cache
			if (!groupId || !channelIdParam) return;
			queryClient.setQueryData(
				["threads", groupId, channelIdParam],
				(old: any) => {
					const arr: any[] = Array.isArray(old?.data)
						? old.data
						: Array.isArray(old)
							? old
							: [];
					const existsIdx = arr.findIndex((t: any) => t?.id === thread.id);
					let next: any[];
					if (existsIdx >= 0) {
						next = arr.map((t: any) => (t?.id === thread.id ? thread : t));
					} else {
						next = [...arr, thread];
					}
					next.sort(
						(a: any, b: any) =>
							new Date(a.createdAt || a.updatedAt || 0).getTime() -
							new Date(b.createdAt || b.updatedAt || 0).getTime(),
					);
					if (Array.isArray(old)) return next;
					return { ...old, data: next };
				},
			);
		},
		[groupId, channelIdParam, queryClient],
	);

	const onThreadUpdated = React.useCallback(
		(thread: ThreadResponse) => {
			if (!thread) return;
			if (!groupId || !channelIdParam) return;
			queryClient.setQueryData(
				["threads", groupId, channelIdParam],
				(old: any) => {
					const arr: any[] = Array.isArray(old?.data)
						? old.data
						: Array.isArray(old)
							? old
							: [];
					const next = arr.map((t: any) => (t?.id === thread.id ? thread : t));
					if (Array.isArray(old)) return next;
					return { ...old, data: next };
				},
			);
		},
		[groupId, channelIdParam, queryClient],
	);

	const onThreadDeleted = React.useCallback(
		(id: string) => {
			if (!id) return;
			queryClient.setQueryData(
				["threads", groupId, channelIdParam],
				(old: any) => {
					const arr: any[] = Array.isArray(old?.data)
						? old.data
						: Array.isArray(old)
							? old
							: [];
					const next = arr.filter((t: any) => t?.id !== id);
					if (Array.isArray(old)) return next;
					return { ...old, data: next };
				},
			);
		},
		[groupId, channelIdParam, queryClient],
	);

	useSocketEvent(SocketEvents.THREAD_CREATED, onThreadCreated);
	useSocketEvent(SocketEvents.THREAD_UPDATED, onThreadUpdated);
	useSocketEvent(SocketEvents.THREAD_DELETED, onThreadDeleted);

	const handleAcceptInvite = useCallback(async () => {
		if (!friendRequestId) return;
		await acceptFriendRequest(friendRequestId);
		toast.success("Friend invite accepted");
		queryClient.invalidateQueries({ queryKey: ["friends"] });
	}, [friendRequestId, queryClient]);

	const handleDenyInvite = useCallback(async () => {
		if (!friendRequestId) return;
		await declineFriendRequest(friendRequestId);
		toast.success("Friend invite denied");
		queryClient.invalidateQueries({ queryKey: ["friends"] });
	}, [friendRequestId, queryClient]);

	const handleAddFriend = useCallback(async () => {
		if (!directUserIdParam) return;
		await sendFriendRequest({ toUserId: directUserIdParam, message: "" });
		toast.success("Friend request sent");
		queryClient.invalidateQueries({ queryKey: ["friends"] });
	}, [directUserIdParam, queryClient]);

	const handleRemoveFriend = useCallback(async () => {
		if (!isFriend) {
			toast("Couldn't identify friendship to remove");
			return;
		}
		if (!directUserIdParam) return;
		await unfriendUser(directUserIdParam);
		toast.success("Removed from friends");
		queryClient.invalidateQueries({ queryKey: ["friends"] });
	}, [isFriend, directUserIdParam, queryClient]);

	const directHeaderProps: DirectMessageHeaderProps | null = isDirectMode
		? {
				opponent: opponent as UserResponse | null,
				loading: opponentLoading,
				error: !!opponentError,
				isFriend,
				isPending,
				isInvite,
				onAcceptInvite: handleAcceptInvite,
				onDenyInvite: handleDenyInvite,
				onAddFriend: handleAddFriend,
				onRemoveFriend: handleRemoveFriend,
			}
		: null;

	const messagesViewportProps: ChatMessagesViewportProps = {
		listRef,
		bottomRef,
		variant: viewportVariant ?? undefined,
		anchorToEnd: !!inboxTypeSelected,
		messagesLoading,
		threadLoading,
		socketLoading,
		messagesError: !!messagesError,
		threadError: !!threadError,
		isDirectMode,
		threadId: threadIdParam,
		messages,
		latestMessagePerThread,
		threadDetailsMap,
		threadsByMessageId,
		hasMoreMessages,
		isFetchingOlderMessages: fetchingOlderMessages,
		reactionPickerFor,
		onSetReactionPickerFor: setReactionPickerFor,
		onEdit: handleEdit,
		onCopy: handleCopy,
		onReport: handleReport,
		onDelete: handleDelete,
		onReply: handleReply,
		onReact: handleReact,
		onGoToMessage: handleGoToMessage,
		onCreateThread: handleCreateThread,
		channelId: channelIdParam,
		groupId,
		directUserId: directUserIdParam,
		currentUserId: profile?.id,
	};

	const chatDialogsProps: ChatDialogsProps = {
		deleteDialogOpen,
		deleteSubmitting,
		messagePendingDelete,
		onDeleteDialogOpenChange: handleDeleteDialogOpenChange,
		onConfirmDelete: confirmDelete,
		reportMessageDialogOpen,
		messagePendingReport,
		reportMessageType,
		onReportMessageDialogOpenChange: handleReportMessageDialogOpenChange,
	};

	const chatInputProps: ChatInputProps = {
		setInboxTypeSelected,
		initialFiles: filesFromModal,
		onInitialFilesHandled: () => setFilesFromModal(undefined),
		onSend: send,
		editingMessage,
		onCancelEdit: () => setEditingMessage(null),
		replyTo: replyToMessage,
		onCancelReply: () => setReplyToMessage(null),
		editingMode: !!editingMessage,
	};

	return {
		shouldShowDirectHeader: isDirectMode,
		directHeaderProps,
		shouldShowThreadHeader: !!threadIdParam,
		thread,
		messagesViewportProps,
		chatDialogsProps,
		chatInputProps,
	};
};
