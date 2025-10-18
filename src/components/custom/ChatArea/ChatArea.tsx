/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import {
	ChatAreaContainer,
	DateText,
	DividerWrapper,
	Line,
	MessageBubbleStyle,
	MessageItem,
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
import MessageActions from "../MessageActions/MessageActions";
import { useParams, useSearch } from "@tanstack/react-router";
import { ImageWithModal } from "../ImageWithModal/ImageWithModal";
import ThreadPreview from "./ThreadPreview";
import ThreadHeader from "./ThreadHeader";
import {
	formatDateHeader,
	formatMessageTime,
	isSameDay,
	createMarkdownRenderer,
} from "./ChatArea.helpers";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	ChatInputPayload,
	InboxType,
} from "../ChatInputComponent/ChatTypeModal/InboxType";

type Thread = {
	id: string;
	name?: string;
	description?: string;
	channelId?: string;
	createdAt?: string;
	createdBy?: any;
};

const ChatArea: React.FC = () => {
	const params = useParams({ strict: false }) as {
		groupId?: string;
		id?: string;
	};
	const search = useSearch({ strict: false }) as { channel?: string };
	// const navigate = useNavigate();
	const groupId = params.groupId ?? undefined;
	const channelIdParam = search.channel ?? undefined;
	const threadIdParam = params.id ?? undefined; // if present => show thread
	const queryClient = useQueryClient();
	const profile = useSelector((state: RootState) => state.user.profile);
	const [realtimeMessages, setRealtimeMessages] = useState<MessageResponse[]>(
		[],
	);

	const listRef = useRef<HTMLDivElement | null>(null);
	const { socket } = useSocket();
	const [filesFromModal, setFilesFromModal] = useState<File[] | undefined>(
		undefined,
	);
	const [inboxTypeSelected, setInboxTypeSelected] = useState<InboxType>(null);
	const viewportVariant = inboxTypeSelected ?? undefined;
	const [emitQueue, setEmitQueue] = useState<any[]>([]);
	// track the last room we attempted to join to avoid redundant joins
	const lastJoinKeyRef = useRef<string | null>(null);
	const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
	const [editingMessage, setEditingMessage] = useState<MessageResponse | null>(
		null,
	);
	const [replyToMessage, setReplyToMessage] = useState<MessageResponse | null>(
		null,
	);
	const [reactionPickerFor, setReactionPickerFor] = useState<string | null>(
		null,
	);
	// Delete confirmation dialog state
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [messagePendingDelete, setMessagePendingDelete] =
		useState<MessageResponse | null>(null);
	const [deleteSubmitting, setDeleteSubmitting] = useState(false);
	const { parseContentToElements, isOnlySingleImageMarkdown } =
		createMarkdownRenderer();

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

	// Subscribe to messages for this room using the query cache as source of truth.
	// We keep optimistics in realtimeMessages and merge them for rendering.
	const {
		data: messagesData,
		isLoading: messagesLoading,
		isError: messagesError,
	} = useQuery<any[]>({
		queryKey: ["messages", groupId, channelIdParam],
		queryFn: async () => {
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
		enabled: !!(groupId && channelIdParam),
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
		if (!groupId || !channelIdParam) return;

		const joinKey = `${groupId}:${channelIdParam}`;
		// If we're already in this room and socket is connected, skip
		if (lastJoinKeyRef.current === joinKey && socket?.connected) return;
		lastJoinKeyRef.current = joinKey;

		const payload = { groupId, channelId: channelIdParam };

		try {
			if (!socket || !socket.connected) throw new Error("socket-not-ready");
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
				} catch (e) {
					console.error("[ChatArea] error handling FETCH_MESSAGES fallback", e);
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
		}
	}, [groupId, channelIdParam, socket]);

	// Reset optimistics when switching room
	useEffect(() => {
		setRealtimeMessages([]);
	}, [groupId, channelIdParam]);

	// After JOINED_ROOM, ask server for messages via FETCH_MESSAGES (ack)
	const onJoinedRoom = useCallback(
		(_evtPayload?: any) => {
			if (!groupId || !channelIdParam) return;
			const req = { groupId, channelId: channelIdParam };
			try {
				if (!socket) throw new Error("socket-not-ready");
				socket.emit(SocketEvents.FETCH_MESSAGES, req, (resp: any) => {
					try {
						if (resp && (resp.error || resp.code)) {
							console.error("[ChatArea] FETCH_MESSAGES ack error", resp);
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
					} catch (innerErr) {
						console.error(
							"[ChatArea] error handling FETCH_MESSAGES ack",
							innerErr,
						);
					}
				});
			} catch (err) {
				console.debug("[ChatArea] queue FETCH_MESSAGES due to", err);
				setEmitQueue((q) => [
					...q,
					{ event: SocketEvents.FETCH_MESSAGES, payload: req },
				]);
			}
		},
		[socket, groupId, channelIdParam, queryClient],
	);

	useSocketEvent(SocketEvents.JOINED_ROOM, onJoinedRoom);

	// Queue flush & connect handling (unchanged)
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
						console.debug("[ChatArea] flush ack", item.event, ack);
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
							console.debug("[ChatArea] flush ack", item.event, ack);
						});
					} catch (err) {
						console.error("[ChatArea] emit flush error", err);
						setEmitQueue((q) => [...q, item]);
					}
				});
			}

			// Re-join the current room on reconnect
			if (groupId && channelIdParam) {
				const payload = { groupId, channelId: channelIdParam };
				try {
					socket.emit(SocketEvents.JOIN_ROOM, payload);
					console.debug("[ChatArea] re-joined room after connect", payload);
					lastJoinKeyRef.current = `${groupId}:${channelIdParam}`;
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
	}, [socket, emitQueue, groupId, channelIdParam]);

	const send = useCallback(
		async (payload?: ChatInputPayload) => {
			if (!payload) return;

			// guard: phải have channel selected
			if (!channelIdParam) {
				console.warn("[ChatArea] missing channelIdParam — cannot send message");
				window.alert("Please select a channel before sending a message.");
				return;
			}

			const tempId = `temp-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

			const baseEmit: any = {
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

			// helper to actually emit safely with logging & ack handling
			const safeEmit = (ev: string, p: any) => {
				console.debug("[ChatArea] safeEmit prepared", ev, p, {
					socketConnected: socket?.connected,
				});
				// quick guard: ensure groupId + channelId exist (server probably expects these)
				if (!p.groupId || !p.channelId) {
					console.warn(
						"[ChatArea] safeEmit missing groupId or channelId — queueing instead",
						{ groupId: p.groupId, channelId: p.channelId },
					);
					queueEmit(ev, p);
					return;
				}

				try {
					if (!socket) throw new Error("socket-not-ready");
					socket.emit(ev, p, (ack: any) => {
						console.debug("[ChatArea] emit ack", ev, ack);
						if (ack && (ack.error || ack.code)) {
							console.error("[ChatArea] server ack error", ack);
							// optional: mark optimistic message failed or remove
						}
					});
					console.debug("[ChatArea] emitted", ev);
				} catch (err) {
					console.warn("[ChatArea] emit failed, queueing", err);
					queueEmit(ev, p);
				}
			};

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
					id: tempId,
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

				const ev = SocketEvents.MESSAGE;
				const p = {
					...baseEmit,
					parentMessageId: replyToMessage?.id || null,
					content: text,
					clientTempId: tempId,
					senderId: senderPayload.id,
					sender: senderPayload,
				};

				// log payload before emit (very important for debugging)
				console.debug("[ChatArea] about to emit message", ev, p);
				safeEmit(ev, p);

				setReplyToMessage(null);
				return;
			}

			if (payload.type === "files") {
				const files = payload.files;
				if (!files || files.length === 0) return;

				const attachmentsMeta = files.map((f) => ({
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

				const ev = SocketEvents.MESSAGE;
				const p = {
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

	// Auto-scroll on messages change
	useEffect(() => {
		const el = listRef.current;
		if (!el) return;
		el.scrollTop = el.scrollHeight;
	}, [messages, inboxTypeSelected]);

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
			{/* If thread present, show its header */}
			{threadIdParam && <ThreadHeader thread={thread} />}

			<MessagesViewport
				ref={listRef}
				variant={viewportVariant}
				className={inboxTypeSelected ? "items-end" : ""}
			>
				{messagesLoading || threadLoading ? (
					<p className="text-sm text-muted-foreground">Loading messages…</p>
				) : messagesError || threadError ? (
					<p className="text-sm text-red-500">Failed to load messages.</p>
				) : displayItems.length === 0 ? (
					<p className="text-sm text-muted-foreground">
						No messages yet. Start the conversation below.
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
							<div key={`${m.id}-${idx}`} className="w-full">
								{showDateHeader && (
									<DividerWrapper>
										<Line />
										<DateText>{formatDateHeader(m.createdAt)}</DateText>
										<Line />
									</DividerWrapper>
								)}
								<div
									className={`group relative w-full`}
									onMouseEnter={() => setHoveredMessageId(m.id)}
									onMouseLeave={() =>
										setHoveredMessageId((id) => (id === m.id ? null : id))
									}
								>
									<MessageItem
										className={`flex items-start gap-2 ${positionClassName}`}
									>
										{m.sender?.avatarUrl ? (
											<img
												src={m.sender.avatarUrl}
												alt={name}
												className="h-8 w-8 rounded-full"
											/>
										) : (
											<div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium select-none">
												{initials || (name[0] ?? "?")}
											</div>
										)}

										<div
											className={`flex flex-col max-w-[70%]  ${isCurrentUser ? "items-end" : ""}`}
										>
											<div
												className={`flex gap-4 items-center text-xs text-muted-foreground mb-1 ${isCurrentUser ? "flex-row-reverse" : ""}`}
											>
												<span className="font-bold text-sm">{name}</span>
												<span>{formatMessageTime(m.createdAt)}</span>
											</div>
											<div
												className={`flex w-full items-end gap-2 ${isCurrentUser ? "flex-row-reverse" : ""}`}
											>
												<MessageBubbleStyle
													className={`message-bubble w-fit max-w-full rounded-lg px-3 py-2 text-sm shadow-none ${isCurrentUser ? "me" : "other"}`}
													// giữ lại whitespace cho text
													style={{ whiteSpace: "pre-wrap" }}
												>
													{isOnlySingleImageMarkdown(m.content)
														? // nếu chỉ 1 ảnh markdown, hiển thị ảnh lớn (bên trong bubble)
															(() => {
																const match = m.content
																	.trim()
																	.match(
																		/^!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)$/,
																	);
																const url = match ? match[2] : null;
																const alt = match ? match[1] : "";
																return url ? (
																	<ImageWithModal
																		src={url}
																		alt={alt || "image"}
																		maxWidthPx={420}
																		maxHeightPx={520}
																	/>
																) : (
																	m.content
																);
															})()
														: // nội dung có text và/hoặc nhiều ảnh => render hỗn hợp
															parseContentToElements(m.content).map((el, i) => (
																<span
																	key={i}
																	className={typeof el === "string" ? "" : ""}
																>
																	{el}
																</span>
															))}
												</MessageBubbleStyle>

												<div className="flex items-end">
													<MessageActions
														m={m}
														hoveredMessageId={hoveredMessageId}
														setHoveredMessageId={(v) => setHoveredMessageId(v)}
														handleEdit={handleEdit}
														handleCopy={handleCopy}
														handleReport={handleReport}
														handleDelete={handleDelete}
														handleReply={handleReply}
														reactionPickerFor={reactionPickerFor}
														setReactionPickerFor={(v) =>
															setReactionPickerFor(v)
														}
														handleReact={handleReact}
													/>
												</div>
											</div>
										</div>
									</MessageItem>
								</div>
							</div>
						);
					})
				)}
			</MessagesViewport>

			{/* Delete confirmation dialog */}
			<Dialog
				open={deleteDialogOpen}
				onOpenChange={(open) => {
					setDeleteDialogOpen(open);
					if (!open) setMessagePendingDelete(null);
				}}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete message?</DialogTitle>
						<DialogDescription>
							This action cannot be undone. The message will be permanently
							removed for everyone in this conversation.
						</DialogDescription>
					</DialogHeader>
					<div className="rounded-md bg-slate-50 border p-3 text-sm text-slate-700 max-h-40 overflow-auto">
						{messagePendingDelete?.content
							? messagePendingDelete.content
							: "(No text content)"}
					</div>
					<DialogFooter>
						<DialogClose className="inline-flex items-center justify-center h-9 rounded-md border px-4 text-sm font-medium bg-white hover:bg-slate-50">
							Cancel
						</DialogClose>
						<button
							onClick={confirmDelete}
							disabled={deleteSubmitting}
							className="inline-flex items-center justify-center h-9 rounded-md px-4 text-sm font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
						>
							{deleteSubmitting ? "Deleting…" : "Delete"}
						</button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

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
