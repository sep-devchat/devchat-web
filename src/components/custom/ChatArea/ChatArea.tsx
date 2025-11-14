/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
	useLayoutEffect,
} from "react";
import {
	ChatAreaContainer,
	DateText,
	DividerWrapper,
	Line,
	MessagesViewport,
} from "./ChatArea.styled";
import { MessageResponse } from "@/services/messageAPI";
import { useSocket } from "@/hooks";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useSocketEvent from "@/hooks/useSocketEvent";
import { SocketEvents } from "@/utils/constants";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import ChatInput from "../ChatInput/ChatInput";
import { detailThread } from "@/services/threadAPI";
import { useParams, useSearch } from "@tanstack/react-router";
import ThreadPreview from "./ThreadPreview";
import ThreadHeader from "./ThreadHeader";
import {
	formatDateHeader,
	formatMessageTime,
	isSameDay,
} from "./ChatArea.helpers";
import {
	ChatInputPayload,
	InboxType,
} from "../ChatInputComponent/ChatTypeModal/InboxType";
// (Removed inline MarkdownPreview usage after refactor)
import ChatAreaLoading from "./ChatAreaLoading";
import { detailUser, UserResponse } from "@/services/userAPI";
import {
	sendFriendRequest,
	listFriends,
	unfriendUser,
} from "@/services/friendAPI";
import { toast } from "sonner";
import { DirectMessageHeader } from "./parts/DirectMessageHeader";
import { MessageRow } from "./parts/MessageRow";
import { DeleteMessageDialog } from "./parts/DeleteMessageDialog";
import { ReportUserDialog } from "./parts/ReportUserDialog";

type Thread = {
	id: string;
	name?: string;
	description?: string;
	channelId?: string;
	createdAt?: string;
	createdBy?: any;
};

// MessageRow & DirectMessageHeader extracted to ./parts

const ChatArea: React.FC = () => {
	const params = useParams({ strict: false }) as {
		groupId?: string;
		id?: string;
		userId?: string; // direct message target user id when on /chat/user/$userId route
	};
	const search = useSearch({ strict: false }) as { channel?: string };
	// const navigate = useNavigate();
	const groupId = params.groupId ?? undefined;
	const channelIdParam = search.channel ?? undefined;
	const threadIdParam = params.id ?? undefined; // if present => show thread
	const directUserIdParam = params.userId ?? undefined; // if present => in direct message mode
	const isDirectMode = !!directUserIdParam && !groupId && !channelIdParam; // heuristic: DM route has userId only
	const queryClient = useQueryClient();
	const profile = useSelector((state: RootState) => state.user.profile);
	const [realtimeMessages, setRealtimeMessages] = useState<MessageResponse[]>(
		[],
	);

	const listRef = useRef<HTMLDivElement | null>(null);
	const bottomRef = useRef<HTMLDivElement | null>(null);
	const { socket } = useSocket();
	const [filesFromModal, setFilesFromModal] = useState<File[] | undefined>(
		undefined,
	);
	const [inboxTypeSelected, setInboxTypeSelected] = useState<InboxType>(null);
	const viewportVariant = inboxTypeSelected ?? undefined;
	const [emitQueue, setEmitQueue] = useState<any[]>([]);
	const [socketLoading, setSocketLoading] = useState<boolean>(false);
	const [socketReady, setSocketReady] = useState<boolean>(false);
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
	// Report user dialog state (DM header)
	const [reportDialogOpen, setReportDialogOpen] = useState(false);
	const [reportSubmitting, setReportSubmitting] = useState(false);
	const [reportReason, setReportReason] = useState("");
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
	} = useQuery<Thread | null>({
		queryKey: ["thread", groupId, channelIdParam, threadIdParam],
		queryFn: async () => {
			if (!groupId || !channelIdParam || !threadIdParam) return null;
			const resp = await detailThread(groupId, channelIdParam, threadIdParam);
			const data =
				(resp as any)?.data !== undefined ? (resp as any).data : (resp as any);
			return (data ?? null) as Thread | null;
		},
		enabled: !!(groupId && channelIdParam && threadIdParam),
	});

	const thread: Thread | null = threadDataResp ?? null;

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
			} catch (e) {
				return null;
			}
		},
		enabled: !!(isDirectMode && directUserIdParam),
	});

	// Try to determine friend relationship (best-effort)
	const { data: friendList } = useQuery<any>({
		queryKey: ["friends"],
		queryFn: async () => {
			try {
				const res = await listFriends();
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
		// Heuristic: look for entries where target is either sender/receiver and status looks accepted (1 or "ACCEPTED")
		return friendList.some((fr: any) => {
			const sId = fr.senderId || fr.sender?.id;
			const rId = fr.receiverId || fr.receiver?.id;
			const accepted =
				fr.status === 1 || fr.status === "ACCEPTED" || fr.status === "accepted";
			return (
				accepted &&
				((sId === meId && rId === targetId) ||
					(sId === targetId && rId === meId))
			);
		});
	}, [friendList, profile?.id, directUserIdParam]);

	const friendRelationId = useMemo(() => {
		if (!friendList || !Array.isArray(friendList))
			return undefined as string | undefined;
		const meId = profile?.id;
		const targetId = directUserIdParam;
		if (!meId || !targetId) return undefined;
		const match = friendList.find((fr: any) => {
			const sId = fr.senderId || fr.sender?.id;
			const rId = fr.receiverId || fr.receiver?.id;
			const accepted =
				fr.status === 1 || fr.status === "ACCEPTED" || fr.status === "accepted";
			return (
				accepted &&
				((sId === meId && rId === targetId) ||
					(sId === targetId && rId === meId))
			);
		});
		return match?.id as string | undefined;
	}, [friendList, profile?.id, directUserIdParam]);

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

	// Handle server echo for MESSAGE to replace optimistics and update cache
	const onServerMessage = useCallback(
		(payload: any) => {
			if (!payload) return;
			// filter only current room
			if (groupId && payload.groupId && payload.groupId !== groupId) return;
			if (
				channelIdParam &&
				payload.channelId &&
				payload.channelId !== channelIdParam
			)
				return;

			const serverMsg: any = {
				...payload,
				id:
					payload.id ??
					payload._id ??
					payload.messageId ??
					payload.clientTempId ??
					`srv-${Date.now()}`,
				createdAt: payload.createdAt ?? new Date().toISOString(),
			};

			// Remove matching optimistic and add server message to realtime list
			setRealtimeMessages((prev) => {
				const withoutOptimistics = prev.filter((m) => {
					if (payload.clientTempId && m.id === payload.clientTempId) {
						return false;
					}
					// Fallback match for text/files when no clientTempId is present
					if (!payload.clientTempId && m.id?.startsWith?.("temp-")) {
						const sameSender =
							m.sender?.id === payload.senderId ||
							m.sender?.id === payload.sender?.id;
						const sameChannel = m.channelId === payload.channelId;
						const sameThread =
							(m.threadId ?? null) === (payload.threadId ?? null);
						const sameContent = (m.content || "") === (payload.content || "");
						const sameAttachments = Array.isArray((m as any).attachments)
							? Array.isArray(payload.attachments) &&
								(m as any).attachments.length === payload.attachments.length
							: !(m as any).attachments && !payload.attachments;
						if (
							sameSender &&
							sameChannel &&
							sameThread &&
							(sameContent || sameAttachments)
						) {
							return false;
						}
					}
					return true;
				});
				return [...withoutOptimistics, serverMsg];
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

	useSocketEvent(SocketEvents.MESSAGE, onServerMessage);
	// mark socket as authenticated/ready before DM fetches
	useSocketEvent(SocketEvents.SOCKET_READY, () => setSocketReady(true));

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

			const serverMsg: any = {
				id:
					payload.id ??
					payload._id ??
					payload.messageId ??
					payload.clientTempId ??
					`dm-${Date.now()}`,
				createdAt: payload.createdAt ?? new Date().toISOString(),
				content: payload.content ?? "",
				sender: payload.from ?? payload.sender ?? null,
			};

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
			const tId = (m as any)?.threadId as string | null;
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

	const threadDetailsMap = useMemo(() => {
		// Optionally populate with thread metadata if available elsewhere
		return {} as Record<string, any>;
	}, [groupId, channelIdParam]);

	// Join socket room whenever group/channel changes (or first mount)
	useEffect(() => {
		if (isDirectMode) return; // skip room join logic in direct mode
		if (!groupId || !channelIdParam) return;

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
			const req = { groupId, channelId: channelIdParam };
			socket.emit(SocketEvents.FETCH_MESSAGES, req, (resp: any) => {
				try {
					if (resp && (resp.error || resp.code)) {
						console.error(
							"[ChatArea] FETCH_MESSAGES ack error (fallback)",
							resp,
						);
						setSocketLoading(false);
						return;
					}
					const itemsRaw = Array.isArray(resp)
						? resp
						: Array.isArray(resp?.data)
							? resp.data
							: Array.isArray(resp?.messages)
								? resp.messages
								: [];
					const items = itemsRaw
						.slice()
						.sort(
							(a: any, b: any) =>
								new Date(a.createdAt).getTime() -
								new Date(b.createdAt).getTime(),
						);
					queryClient.setQueryData(
						["messages", groupId, channelIdParam],
						items,
					);
					console.debug(
						"[ChatArea] FETCH_MESSAGES fallback -> set messages",
						items.length,
					);
					setSocketLoading(false);
				} catch (e) {
					console.error("[ChatArea] error handling FETCH_MESSAGES fallback", e);
					setSocketLoading(false);
				}
			});
		} catch (err) {
			console.debug("[ChatArea] queue JOIN_ROOM due to", err);
			setEmitQueue((q) => [
				...q,
				{ event: SocketEvents.JOIN_ROOM, payload },
				{
					event: SocketEvents.FETCH_MESSAGES,
					payload: { groupId, channelId: channelIdParam },
				},
			]);
			setSocketLoading(true);
		}
	}, [groupId, channelIdParam, socket, queryClient]);

	// Reset optimistics when switching room
	useEffect(() => {
		setRealtimeMessages([]);
	}, [groupId, channelIdParam, directUserIdParam, isDirectMode]);

	// After JOINED_ROOM, ask server for messages via FETCH_MESSAGES (ack)
	const onJoinedRoom = useCallback(() => {
		if (!groupId || !channelIdParam) return;
		const req = { groupId, channelId: channelIdParam };
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

					const itemsRaw = Array.isArray(resp)
						? resp
						: Array.isArray(resp?.data)
							? resp.data
							: Array.isArray(resp?.messages)
								? resp.messages
								: [];

					// sort chronologically (oldest -> newest), matching existing logic
					const items = itemsRaw.slice().sort((a: any, b: any) => {
						const ta = new Date(a.createdAt).getTime();
						const tb = new Date(b.createdAt).getTime();
						return ta - tb;
					});

					queryClient.setQueryData(
						["messages", groupId, channelIdParam],
						items,
					);
					console.debug(
						"[ChatArea] FETCH_MESSAGES ack -> set messages in cache",
						items.length,
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
		if (!isDirectMode || !directUserIdParam || !socketReady) return;
		if (!socket) {
			return;
		}
		setSocketLoading(true);
		try {
			socket.emit(
				SocketEvents.FETCH_DIRECT_MESSAGES,
				{ targetUserId: directUserIdParam },
				(resp: any) => {
					try {
						if (resp && (resp.error || resp.code)) {
							console.error("[ChatArea] FETCH_DIRECT_MESSAGES ack error", resp);
							setSocketLoading(false);
							return;
						}
						const itemsRaw = Array.isArray(resp)
							? resp
							: Array.isArray(resp?.data)
								? resp.data
								: Array.isArray(resp?.messages)
									? resp.messages
									: [];
						const mapped = itemsRaw.map((dm: any) => ({
							id: dm.id,
							content: dm.content ?? "",
							createdAt: dm.createdAt,
							sender: dm.from ?? null,
						}));
						const items = mapped.slice().sort((a: any, b: any) => {
							const ta = new Date(a.createdAt).getTime();
							const tb = new Date(b.createdAt).getTime();
							return ta - tb;
						});
						queryClient.setQueryData(
							["direct_messages", directUserIdParam],
							items,
						);
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
			console.debug("[ChatArea] queue FETCH_DIRECT_MESSAGES due to", err);
			setSocketLoading(true);
		}
	}, [isDirectMode, directUserIdParam, socket, queryClient, socketReady]);

	// Queue flush & connect handling
	useEffect(() => {
		if (!socket) {
			console.debug(
				"[ChatArea] socket is undefined (will queue emits until socket exists)",
			);
			return;
		}

		if (socket.connected && emitQueue.length > 0) {
			const queued = [...emitQueue];
			setEmitQueue([]);
			queued.forEach((item) => {
				try {
					socket.emit(item.event, item.payload, (ack: any) => {
						// Special handling for FETCH_MESSAGES queued while offline
						if (item.event === SocketEvents.FETCH_MESSAGES) {
							try {
								if (ack && (ack.error || ack.code)) {
									console.error(
										"[ChatArea] flush FETCH_MESSAGES ack error",
										ack,
									);
									setSocketLoading(false);
									return;
								}
								const itemsRaw = Array.isArray(ack)
									? ack
									: Array.isArray(ack?.data)
										? ack.data
										: Array.isArray(ack?.messages)
											? ack.messages
											: [];
								const items = itemsRaw.slice().sort((a: any, b: any) => {
									const ta = new Date(a.createdAt).getTime();
									const tb = new Date(b.createdAt).getTime();
									return ta - tb;
								});
								if (groupId && channelIdParam) {
									queryClient.setQueryData(
										["messages", groupId, channelIdParam],
										items,
									);
								}
								console.debug(
									"[ChatArea] flush FETCH_MESSAGES -> set messages",
									items.length,
								);
								setSocketLoading(false);
							} catch (e) {
								console.error(
									"[ChatArea] flush FETCH_MESSAGES handling error",
									e,
								);
								setSocketLoading(false);
							}
						} else {
							console.debug("[ChatArea] flush ack", item.event, ack);
						}
					});
				} catch (err) {
					console.error("[ChatArea] flush emit error", err);
					setEmitQueue((q) => [...q, item]);
				}
			});
		}

		const onConnect = () => {
			// Flush queued emits
			if (emitQueue.length) {
				const queued = [...emitQueue];
				setEmitQueue([]);
				queued.forEach((item) => {
					try {
						socket.emit(item.event, item.payload, (ack: any) => {
							if (item.event === SocketEvents.FETCH_MESSAGES) {
								try {
									if (ack && (ack.error || ack.code)) {
										console.error(
											"[ChatArea] flush FETCH_MESSAGES ack error",
											ack,
										);
										setSocketLoading(false);
										return;
									}
									const itemsRaw = Array.isArray(ack)
										? ack
										: Array.isArray(ack?.data)
											? ack.data
											: Array.isArray(ack?.messages)
												? ack.messages
												: [];
									const items = itemsRaw.slice().sort((a: any, b: any) => {
										const ta = new Date(a.createdAt).getTime();
										const tb = new Date(b.createdAt).getTime();
										return ta - tb;
									});
									if (groupId && channelIdParam) {
										queryClient.setQueryData(
											["messages", groupId, channelIdParam],
											items,
										);
									}
									console.debug(
										"[ChatArea] flush(onConnect) FETCH_MESSAGES -> set messages",
										items.length,
									);
									setSocketLoading(false);
								} catch (e) {
									console.error(
										"[ChatArea] flush(onConnect) FETCH_MESSAGES handling error",
										e,
									);
									setSocketLoading(false);
								}
							} else {
								console.debug("[ChatArea] flush ack", item.event, ack);
							}
						});
					} catch (err) {
						console.error("[ChatArea] emit flush error", err);
						setEmitQueue((q) => [...q, item]);
					}
				});
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
					const req = { groupId, channelId: channelIdParam };
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
							const itemsRaw = Array.isArray(resp)
								? resp
								: Array.isArray(resp?.data)
									? resp.data
									: Array.isArray(resp?.messages)
										? resp.messages
										: [];
							const items = itemsRaw.slice().sort((a: any, b: any) => {
								const ta = new Date(a.createdAt).getTime();
								const tb = new Date(b.createdAt).getTime();
								return ta - tb;
							});
							queryClient.setQueryData(
								["messages", groupId, channelIdParam],
								items,
							);
							console.debug(
								"[ChatArea] FETCH_MESSAGES (onConnect) -> set messages",
								items.length,
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

		socket.on?.("connect", onConnect);

		return () => {
			socket.off?.("connect", onConnect);
		};
	}, [socket, emitQueue, groupId, channelIdParam, queryClient, isDirectMode]);

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
					}
				: {
						groupId: groupId ?? null,
						channelId: channelIdParam ?? null,
						threadId: threadIdParam ?? null,
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
				const optimistic: MessageResponse = {
					id: clientTempId,
					content: text,
					createdAt: new Date().toISOString(),
					channelId: channelIdParam,
					threadId: threadIdParam ?? null,
					groupId,
					sender: {
						id: profile?.id ?? "me",
						firstName: profile?.firstName,
						lastName: profile?.lastName,
						username: profile?.username,
						avatarUrl: profile?.avatarUrl,
					} as any,
					pending: true,
				} as any;

				setRealtimeMessages((prev) => [...prev, optimistic]);
				return;
			}

			if (payload.type === "text") {
				const text = payload.text.trim();
				if (!text) return;

				// edit flow
				if (editingMessage) {
					const ev = SocketEvents.EDIT_MESSAGE;
					// Per DTO, server expects messageId and content
					const p = {
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
					threadId: threadIdParam ?? null,
					groupId,
					sender: {
						id: profile?.id ?? "me",
						firstName: profile?.firstName,
						lastName: profile?.lastName,
						username: profile?.username,
						avatarUrl: profile?.avatarUrl,
					} as any,
				} as any;

				setRealtimeMessages((prev) => [...prev, optimistic]);

				const ev = isDirectMode
					? SocketEvents.SEND_DIRECT_MESSAGE
					: SocketEvents.MESSAGE;
				const p = isDirectMode
					? {
							...baseEmit,
							content: text,
							clientTempId: payload.clientTempId || tempId,
							senderId: senderPayload.id,
							sender: senderPayload,
						}
					: {
							...baseEmit,
							parentMessageId: replyToMessage?.id || null,
							content: text,
							clientTempId: payload.clientTempId || tempId,
							senderId: senderPayload.id,
							sender: senderPayload,
						};

				// log payload before emit (very important for debugging)
				console.debug("[ChatArea] about to emit message", ev, p);
				const ack = await safeEmit(ev, p);
				return ack; // allow caller (ChatInput) to access server-assigned messageId for AI ask

				setReplyToMessage(null);
				return;
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
						const mdTempId = `temp-${Date.now()}-${Math.floor(Math.random() * 10000)}-md`;

						const optimisticMd: MessageResponse = {
							id: mdTempId,
							content,
							createdAt: new Date().toISOString(),
							channelId: channelIdParam,
							threadId: threadIdParam ?? null,
							groupId,
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
						threadId: threadIdParam ?? null,
						groupId,
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

	// Compute displayItems (messages + thread previews) for rendering
	const displayItems = useMemo(() => {
		// If viewing a specific thread, just show messages
		if (threadIdParam) {
			return messages.map((msg) => ({ type: "msg", payload: msg }));
		}

		// Otherwise, show thread previews and messages
		const items: Array<{ type: "thread" | "msg"; payload: any }> = [];
		const threadsAdded = new Set<string>();

		// Add thread previews first (sorted by latest message time)
		const threadPreviews = Array.from(latestMessagePerThread.entries())
			.map(([threadId, latestMessage]) => ({
				threadId,
				latestMessage,
				threadMeta: threadDetailsMap[threadId] ?? null,
			}))
			.sort((a, b) => {
				const ta = new Date(a.latestMessage.createdAt).getTime();
				const tb = new Date(b.latestMessage.createdAt).getTime();
				return ta - tb;
			});

		for (const preview of threadPreviews) {
			items.push({ type: "thread", payload: preview });
			threadsAdded.add(preview.threadId);
		}

		// Add messages that are not part of any thread
		for (const msg of messages) {
			if (!msg.threadId || !threadsAdded.has(msg.threadId)) {
				items.push({ type: "msg", payload: msg });
			}
		}

		// Sort all items chronologically
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
	}, [messages, threadIdParam, latestMessagePerThread, threadDetailsMap]);

	// Compute a stable room key (group/channel/thread) to detect hard switches
	const roomKey = isDirectMode
		? `dm:${directUserIdParam}`
		: `${groupId ?? ""}:${channelIdParam ?? ""}:${threadIdParam ?? ""}`;

	const scrollToBottomInstant = useCallback(() => {
		const container = listRef.current;
		try {
			if (container) {
				container.scrollTop = container.scrollHeight;
			}
			// Anchor-based fallback for cases where direct scrollTop is ignored due to layout timing
			bottomRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
		} catch {
			/* noop */
		}
	}, []);

	// Ensure we start at the bottom immediately on room change (avoid top flash)
	useLayoutEffect(() => {
		// Run across frames in case content height changes after first paint
		scrollToBottomInstant();
		const id = requestAnimationFrame(scrollToBottomInstant);
		return () => cancelAnimationFrame(id);
	}, [roomKey, scrollToBottomInstant]);

	// Keep anchored to bottom when new messages arrive or input type changes
	useLayoutEffect(() => {
		scrollToBottomInstant();
	}, [messages, inboxTypeSelected, scrollToBottomInstant]);

	// Also scroll after data loads finish for this room
	useEffect(() => {
		if (!messagesLoading && !threadLoading && !socketLoading) {
			const id1 = requestAnimationFrame(scrollToBottomInstant);
			const id2 = requestAnimationFrame(scrollToBottomInstant);
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

	const handleReport = useCallback(
		(m: MessageResponse) => {
			const reason = window.prompt("Report message - please enter reason:");
			if (!reason) return;
			socket?.emit("message:report", {
				groupId: groupId ?? null,
				channelId: channelIdParam ?? null,
				messageId: m.id,
				reason,
			});
		},
		[socket, groupId, channelIdParam],
	);

	const handleDelete = useCallback(async (m: MessageResponse) => {
		setMessagePendingDelete(m);
		setDeleteDialogOpen(true);
	}, []);

	const confirmDelete = useCallback(() => {
		if (!messagePendingDelete) return;
		setDeleteSubmitting(true);
		try {
			// Emit DELETE_MESSAGE with the messageId as payload
			socket?.emit(SocketEvents.DELETE_MESSAGE, messagePendingDelete.id);
		} catch (err) {
			console.error("Delete message emit failed", err);
		} finally {
			setDeleteSubmitting(false);
			setDeleteDialogOpen(false);
			setMessagePendingDelete(null);
		}
	}, [socket, messagePendingDelete]);

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

	// Local ThreadPreview/ThreadHeader and markdown helpers were moved to separate files

	return (
		<ChatAreaContainer>
			{isDirectMode && (
				<DirectMessageHeader
					opponent={opponent as any}
					loading={opponentLoading}
					error={!!opponentError}
					isFriend={isFriend}
					onAddFriend={async () => {
						if (!directUserIdParam) return;
						await sendFriendRequest({
							toUserId: directUserIdParam,
							message: "",
						});
						toast.success("Friend request sent");
						queryClient.invalidateQueries({ queryKey: ["friends"] });
					}}
					onRemoveFriend={async () => {
						if (!friendRelationId) {
							toast("Couldn't identify friendship to remove");
							return;
						}
						await unfriendUser(friendRelationId);
						toast.success("Removed from friends");
						queryClient.invalidateQueries({ queryKey: ["friends"] });
					}}
					onBlock={() => toast("Block user is not available yet")}
					onOpenReport={() => setReportDialogOpen(true)}
				/>
			)}
			{/* If thread present, show its header */}
			{threadIdParam && <ThreadHeader thread={thread} />}

			<MessagesViewport
				ref={listRef}
				variant={viewportVariant}
				className={inboxTypeSelected ? "items-end" : ""}
			>
				{messagesLoading || threadLoading || socketLoading ? (
					<ChatAreaLoading rows={8} />
				) : messagesError || threadError ? (
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
							// For date header logic, compare with previous displayed item's createdAt
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
									key={`thread-${threadId}-${latestMessage.id}`}
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
										threadId={threadId}
										latestMessage={latestMessage}
										threadMeta={threadMeta}
									/>
								</div>
							);
						}

						// normal message
						const m: MessageResponse = item.payload;
						const prevItem = displayItems[idx - 1];
						const prevDate = prevItem
							? prevItem.type === "msg"
								? prevItem.payload.createdAt
								: prevItem.payload.latestMessage.createdAt
							: undefined;
						const showDateHeader =
							!prevDate || !isSameDay(prevDate, m.createdAt);

						// Group with previous message if same sender and no date break
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
							(m.sender?.firstName?.[0] || "") +
							(m.sender?.lastName?.[0] || "");
						const isCurrentUser = m.sender?.id === profile?.id;
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
									handleEdit={handleEdit}
									handleCopy={handleCopy}
									handleReport={handleReport}
									handleDelete={handleDelete}
									handleReply={handleReply}
									handleReact={handleReact}
									reactionPickerFor={reactionPickerFor}
									setReactionPickerFor={(v) => setReactionPickerFor(v)}
									formatMessageTime={formatMessageTime}
								/>
							</div>
						);
					})
				)}
				{/* Keep an anchor at the very end for reliable bottom scrolling */}
				{/* <div ref={bottomRef} /> */}
			</MessagesViewport>

			<DeleteMessageDialog
				open={deleteDialogOpen}
				messageContent={messagePendingDelete?.content || null}
				submitting={deleteSubmitting}
				onOpenChange={(open) => {
					setDeleteDialogOpen(open);
					if (!open) setMessagePendingDelete(null);
				}}
				onConfirm={confirmDelete}
			/>
			<ReportUserDialog
				open={reportDialogOpen}
				reason={reportReason}
				submitting={reportSubmitting}
				onOpenChange={(open) => setReportDialogOpen(open)}
				onReasonChange={(v) => setReportReason(v)}
				onSubmit={async () => {
					try {
						setReportSubmitting(true);
						console.debug("Report user", directUserIdParam, reportReason);
						toast.success("Report submitted");
						setReportDialogOpen(false);
						setReportReason("");
					} finally {
						setReportSubmitting(false);
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
		</ChatAreaContainer>
	);
};

export default ChatArea;
