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
import {
	deleteMessage,
	listMessages,
	MessageResponse,
} from "@/services/messageAPI";
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
import {
	ChatInputPayload,
	InboxType,
} from "../ChatInputComponent/ChatTypeModal/InboxType";
// import ThreadPreview, { ThreadHeader as ThreadHeaderImported } from "../ThreadPreview/ThreadPreview";

function pad(n: number) {
	return n.toString().padStart(2, "0");
}

function isSameDay(a?: string | Date | null, b?: string | Date | null) {
	if (!a || !b) return false;
	const da = a instanceof Date ? a : new Date(a);
	const db = b instanceof Date ? b : new Date(b);
	if (isNaN(da.getTime()) || isNaN(db.getTime())) return false;
	return (
		da.getFullYear() === db.getFullYear() &&
		da.getMonth() === db.getMonth() &&
		da.getDate() === db.getDate()
	);
}

function formatDateHeader(input: string | Date): string {
	const d = input instanceof Date ? input : new Date(input);
	if (isNaN(d.getTime())) return "";

	const now = new Date();
	const yesterday = new Date(now);
	yesterday.setDate(now.getDate() - 1);

	const sameYMD = (a: Date, b: Date) =>
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate();

	if (sameYMD(d, now)) return "Today";
	if (sameYMD(d, yesterday)) return "Yesterday";
	return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

function formatMessageTime(input: string | Date): string {
	const d = input instanceof Date ? input : new Date(input);
	if (isNaN(d.getTime())) return "";

	const now = new Date();
	const padLocal = (n: number) => n.toString().padStart(2, "0");
	const sameYMD = (a: Date, b: Date) =>
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate();

	const yesterday = new Date(now);
	yesterday.setDate(now.getDate() - 1);

	const hhmm = `${padLocal(d.getHours())}:${padLocal(d.getMinutes())}`;
	if (sameYMD(d, now)) return `Today ${hhmm}`;
	if (sameYMD(d, yesterday)) return `Yesterday ${hhmm}`;
	return `${padLocal(d.getDate())}/${padLocal(d.getMonth() + 1)} ${hhmm}`;
}

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
	const IMAGE_MARKDOWN_RE = /!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/g;

	const listRef = useRef<HTMLDivElement | null>(null);
	const { socket } = useSocket();
	const [filesFromModal, setFilesFromModal] = useState<File[] | undefined>(
		undefined,
	);
	const [inboxTypeSelected, setInboxTypeSelected] = useState<InboxType>(null);
	const viewportVariant = inboxTypeSelected ?? undefined;
	const [emitQueue, setEmitQueue] = useState<any[]>([]);
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
	let __md_key = 0;

	// Query detailThread only when user navigates to a specific thread (existing logic)
	const {
		data: threadDataResp,
		isLoading: threadLoading,
		isError: threadError,
	} = useQuery({
		queryKey: ["thread", groupId, channelIdParam, threadIdParam],
		enabled: !!(groupId && channelIdParam && threadIdParam),
		queryFn: () => detailThread(groupId!, channelIdParam!, threadIdParam!),
	});

	const thread: Thread | null = useMemo(() => {
		return (threadDataResp?.data ?? null) as Thread | null;
	}, [threadDataResp]);

	// messages query (list all messages for the channel/group)
	const {
		data: messagesResp,
		isLoading: messagesLoading,
		isError: messagesError,
	} = useQuery({
		queryKey: ["messages", groupId, channelIdParam],
		enabled: !!groupId, // enable when group exists; you can tune to channel if needed
		queryFn: () =>
			listMessages(channelIdParam ?? "", groupId ?? "", threadIdParam ?? ""),
	});

	// Filter + order server messages (same logic but now only filter by channel/group as before)
	const serverMessages: MessageResponse[] = useMemo(() => {
		const items = (messagesResp?.data ?? []) as MessageResponse[];
		const filtered = items.filter((it) => {
			if (it.deletedAt != null) return false;

			// channel filter: if user is viewing a channel, only messages with that channel (or thread messages for that channel)
			if (channelIdParam && it.channelId && it.channelId !== channelIdParam)
				return false;

			// If viewing a specific thread (threadIdParam), keep only messages in that thread (existing behavior)
			if (threadIdParam) {
				return (it.threadId ?? null) === threadIdParam;
			}

			return true;
		});

		// Ensure chronological order (oldest -> newest)
		const sorted = filtered.slice().sort((a, b) => {
			const ta = new Date(a.createdAt).getTime();
			const tb = new Date(b.createdAt).getTime();
			return ta - tb;
		});

		return sorted;
	}, [messagesResp, channelIdParam, threadIdParam]);

	// Combined messages (server + realtime optimistic)
	const messages: MessageResponse[] = useMemo(() => {
		// We want chronological order: merge serverMessages and realtimeMessages by createdAt
		const merged = [...serverMessages, ...realtimeMessages];
		const sorted = merged.slice().sort((a, b) => {
			const ta = new Date(a.createdAt).getTime();
			const tb = new Date(b.createdAt).getTime();
			return ta - tb;
		});
		return sorted;
	}, [serverMessages, realtimeMessages]);

	// When user switches channel/thread => clear optimistic realtime messages
	useEffect(() => {
		setRealtimeMessages([]);
	}, [channelIdParam, threadIdParam]);

	// Helper: compute latestMessage per threadId from current messages
	const latestMessagePerThread = useMemo(() => {
		const map = new Map<string, MessageResponse>();
		for (const m of messages) {
			if (!m.threadId) continue;
			const cur = map.get(m.threadId);
			if (!cur) {
				map.set(m.threadId, m);
				continue;
			}
			if (new Date(m.createdAt).getTime() > new Date(cur.createdAt).getTime()) {
				map.set(m.threadId, m);
			}
		}
		return map; // Map<threadId, MessageResponse>
	}, [messages]);

	// Maintain a cache of threadDetails for threadIds seen in current message list
	const [threadDetailsMap, setThreadDetailsMap] = useState<Record<string, any>>(
		{},
	);

	useEffect(() => {
		if (!groupId || !channelIdParam) {
			setThreadDetailsMap({});
			return;
		}

		const threadIds = Array.from(
			new Set(messages.map((m) => m.threadId).filter(Boolean as any)),
		) as string[];

		if (threadIds.length === 0) {
			setThreadDetailsMap({});
			return;
		}

		let mounted = true;

		(async () => {
			try {
				// fetch all thread summaries in parallel (object syntax to avoid overload ambiguity)
				const promises = threadIds.map((tid) =>
					queryClient
						.fetchQuery({
							queryKey: ["thread-summary", groupId, channelIdParam, tid],
							queryFn: async () => {
								const resp = await detailThread(groupId!, channelIdParam!, tid);
								return resp?.data ?? resp ?? null;
							},
							staleTime: 1000 * 60 * 5,
						})
						.then((data) => ({ tid, data }))
						.catch((err) => {
							console.error(
								"[ChatArea] fetch thread-summary failed for",
								tid,
								err,
							);
							return { tid, data: null };
						}),
				);

				const results = await Promise.all(promises);

				if (!mounted) return;

				setThreadDetailsMap((prev) => {
					const next = { ...prev };
					for (const r of results) {
						if (r?.data) next[r.tid] = r.data;
					}
					return next;
				});
			} catch (err) {
				console.error(
					"[ChatArea] unexpected error fetching thread summaries",
					err,
				);
			}
		})();

		return () => {
			mounted = false;
		};
	}, [
		Array.from(latestMessagePerThread.keys()).join("|"),
		groupId,
		channelIdParam,
	]);

	// Socket incoming message handler (keeps same filtering but ensures thread handling)
	const onServerMessage = useCallback(
		(msg: MessageResponse & { clientTempId?: string }) => {
			// filter by channel/thread like before
			if (msg.channelId) {
				if (!channelIdParam) return;
				if (msg.channelId !== channelIdParam) return;
			} else {
				if (channelIdParam) return;
			}

			if (threadIdParam) {
				if ((msg.threadId ?? null) !== threadIdParam) return;
			} else {
				if (msg.threadId) {
					// If msg belongs to some thread but user not viewing that thread detail,
					// we still accept it (so thread preview updates in the timeline),
					// but if you want to ignore thread messages when not viewing a channel, adjust here.
					// Here we accept thread messages (they will be displayed as thread previews).
				}
			}

			setRealtimeMessages((prev) => {
				const tempId = (msg as any).clientTempId;
				if (tempId) {
					const idx = prev.findIndex((m) => m.id === tempId);
					if (idx !== -1) {
						const copy = [...prev];
						copy[idx] = msg;
						return copy;
					}
				}

				// dedupe based on id/content+sender+time
				if (prev.some((m) => m.id === msg.id)) return prev;

				const foundIndex = prev.findIndex((m) => {
					if (!m.content || !msg.content) return false;
					const sameContent = m.content === msg.content;
					const sameSender = m.sender?.id === msg.sender?.id;
					const t1 = new Date(m.createdAt).getTime();
					const t2 = new Date(msg.createdAt).getTime();
					const close = Math.abs(t1 - t2) < 5000;
					return sameContent && sameSender && close;
				});
				if (foundIndex !== -1) {
					const copy = [...prev];
					copy[foundIndex] = msg;
					return copy;
				}

				return [...prev, msg];
			});
		},
		[channelIdParam, threadIdParam],
	);

	useSocketEvent(SocketEvents.MESSAGE, onServerMessage);

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
			if (!emitQueue.length) return;
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
		};

		socket.on?.("connect", onConnect);

		return () => {
			socket.off?.("connect", onConnect);
		};
	}, [socket, emitQueue]);

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
					const ev = "message:update";
					const p = {
						...baseEmit,
						messageId: editingMessage.id,
						content: text,
						clientTempId: tempId,
						senderId: senderPayload.id,
						sender: senderPayload,
					};
					console.debug("[ChatArea] update payload", p);
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

	const handleDelete = useCallback(
		async (m: MessageResponse) => {
			const ok = window.confirm("Are you sure to delete this message?");
			if (!ok) return;

			try {
				socket?.emit("message:delete", {
					groupId: groupId ?? null,
					channelId: channelIdParam ?? null,
					messageId: m.id,
				});

				await deleteMessage(m.id);

				setRealtimeMessages((prev) => prev.filter((x) => x.id !== m.id));

				queryClient.setQueryData(
					["messages", groupId, channelIdParam],
					(old: any) => {
						if (!old) return old;
						const oldData = Array.isArray(old.data) ? old.data : old;
						const filtered = oldData.filter(
							(msg: MessageResponse) => msg.id !== m.id,
						);
						if (old.data) {
							return { ...old, data: filtered };
						}
						return filtered;
					},
				);
			} catch (err: any) {
				console.error("Delete message failed", err);
				window.alert("Delete failed: " + (err?.message ?? "Unknown error"));
			}
		},
		[socket, groupId, channelIdParam, queryClient],
	);

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

	// Thread preview UI
	const ThreadPreview: React.FC<{
		threadId: string;
		threadMeta: any;
		latestMessage: MessageResponse;
	}> = ({ threadId, threadMeta, latestMessage }) => {
		const creatorName = threadMeta?.createdBy ?? "Unknown";
		const threadTitle = threadMeta?.name || `Thread ${threadId.slice(0, 8)}`;

		const shortPreview = (text?: string) => {
			if (!text) return "[Attachment]";
			// nếu là markdown ảnh, chỉ trả về "[Image]"
			if (/!\[.*?\]\(https?:\/\/[^\s)]+\)/.test(text.trim())) return "[Image]";
			// cắt xuống 120 ký tự và bỏ newline
			const singleLine = text.replace(/\s+/g, " ").trim();
			return singleLine.length > 120
				? singleLine.slice(0, 117) + "…"
				: singleLine;
		};

		const onOpenThread = () => {
			// navigate({
			//   to: "/chat/group/$groupId/$id",
			//   params: { groupId: groupId!, id: threadId },
			//   search: (s: any) => ({ ...s, channel: channelIdParam }),
			// });
			console.log("Navigate to thread", { groupId, channelIdParam, threadId });
		};

		//  const avatarLetter =
		// threadMeta?.createdBy?.firstName?.[0] ??
		// threadMeta?.createdBy?.username?.[0] ??
		// latestMessage.sender?.firstName?.[0] ??
		// "T";

		return (
			<div className="mb-3">
				{/* header line */}
				<div
					className="mb-2 text-xs text-muted-foreground flex items-center gap-2"
					style={{ color: "rgba(17,24,39,0.6)" }}
				>
					<span
						className="font-medium text-sm"
						style={{ color: "rgba(17,24,39,0.85)" }}
					>
						{creatorName}
					</span>
					<span>started a thread:</span>
					<button
						onClick={onOpenThread}
						className="text-sm font-semibold text-sky-600 hover:underline"
						aria-label={`Open thread ${threadTitle}`}
						style={{ background: "transparent", border: "none", padding: 0 }}
					>
						{threadTitle}
					</button>
					<span className="ml-auto text-xs text-muted-foreground">
						{formatMessageTime(latestMessage.createdAt)}
					</span>
				</div>

				{/* thread card */}
				<div
					role="button"
					onClick={onOpenThread}
					className="rounded-lg border border-slate-200 bg-[#F1F4F9] p-3 cursor-pointer hover:shadow-sm transition-shadow"
					style={{ boxShadow: "inset 0 0 0 1px rgba(59,130,246,0.03)" }}
				>
					<div className="flex items-start justify-between gap-3">
						<div className="flex items-start gap-3">
							{/* <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-medium select-none text-slate-700">
              {avatarLetter}
            </div> */}

							<div className="min-w-0">
								<div className="flex items-center gap-2">
									<div className="text-sm font-semibold text-slate-800 truncate">
										{threadTitle}
									</div>
								</div>

								<div className="mt-1 text-sm text-slate-600 flex items-start gap-2 min-w-0">
									{/* small sender avatar or dot */}
									<div className="flex-shrink-0 h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center text-[11px] text-slate-700">
										{latestMessage.sender?.firstName?.[0] ??
											latestMessage.sender?.username?.[0] ??
											"U"}
									</div>

									<div className="min-w-0">
										<div className="text-[13px] text-slate-700">
											<span className="font-medium mr-1">
												{`${latestMessage.sender?.firstName || latestMessage.sender?.username || "Unknown"}:`}
											</span>
											<span className="text-slate-600">
												{shortPreview(latestMessage.content)}
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};

	// Thread header UI for when user navigates into a specific thread (existing)
	const ThreadHeader = () => {
		if (!thread) return null;
		return (
			<div className="mb-3 rounded-lg border bg-muted/50 p-3">
				<div className="flex items-center justify-between">
					<div>
						<div className="text-sm font-semibold">
							Thread: {thread.name || thread.id}
						</div>
						{thread.description && (
							<div className="text-xs text-muted-foreground mt-1">
								{thread.description}
							</div>
						)}
					</div>
					<div className="text-xs text-muted-foreground">
						{thread.createdAt ? formatMessageTime(thread.createdAt) : ""}
					</div>
				</div>
			</div>
		);
	};

	function renderInlineMarkdown(input: string): React.ReactNode[] {
		// Patterns to support (order doesn't matter; we pick leftmost match)
		const patterns: { re: RegExp; tag: "strong" | "em" | "u" | "s" }[] = [
			{ re: /\*\*(.+?)\*\*/, tag: "strong" }, // **bold**
			{ re: /\*(.+?)\*/, tag: "em" }, // *italic*
			{ re: /\+\+(.+?)\+\+/, tag: "u" }, // ++underline++
			{ re: /~~(.+?)~~/, tag: "s" }, // ~~strikethrough~~
		];

		// trim nothing special; keep whitespace as-is
		const text = input;

		// find earliest match among patterns
		let earliest: { m: RegExpExecArray; tag: string } | null = null;
		for (const p of patterns) {
			// create fresh regex so exec starts at 0
			const re = new RegExp(p.re.source, "m");
			const m = re.exec(text);
			if (
				m &&
				(earliest === null || (m.index ?? 0) < (earliest.m.index ?? Infinity))
			) {
				earliest = { m, tag: p.tag };
			}
		}

		if (!earliest) {
			// no inline markdown token found: return single text node (React will escape)
			if (text === "")
				return [
					<React.Fragment key={`md-${__md_key++}`}>{text}</React.Fragment>,
				];
			return [text];
		}

		const { m, tag } = earliest;
		const idx = m.index ?? 0;
		const full = m[0];
		const inner = m[1] ?? "";

		const before = text.slice(0, idx);
		const after = text.slice(idx + full.length);

		const result: React.ReactNode[] = [];

		if (before.length > 0) {
			result.push(...renderInlineMarkdown(before));
		}

		// render matched token with recursive parsing inside it (to support nesting)
		const key = `md-${__md_key++}`;
		const children = renderInlineMarkdown(inner);

		switch (tag) {
			case "strong":
				result.push(<strong key={key}>{children}</strong>);
				break;
			case "em":
				result.push(<em key={key}>{children}</em>);
				break;
			case "u":
				result.push(<u key={key}>{children}</u>);
				break;
			case "s":
				result.push(<s key={key}>{children}</s>);
				break;
			default:
				result.push(children);
		}

		if (after.length > 0) {
			result.push(...renderInlineMarkdown(after));
		}

		return result;
	}

	function parseContentToElements(content: string) {
		const elements: React.ReactNode[] = [];
		let lastIndex = 0;
		let match: RegExpExecArray | null;
		let idx = 0;

		// iterate các match ảnh markdown
		while ((match = IMAGE_MARKDOWN_RE.exec(content)) !== null) {
			const matchStart = match.index;
			const matchEnd = IMAGE_MARKDOWN_RE.lastIndex;
			const alt = match[1] || "";
			const url = match[2];

			// phần text trước ảnh (nếu có) — sẽ parse inline markdown ở đây
			if (matchStart > lastIndex) {
				const textPart = content.slice(lastIndex, matchStart);
				// chia thành các React nodes bằng renderInlineMarkdown
				const nodes = renderInlineMarkdown(textPart);
				for (const n of nodes) {
					// ensure unique key
					elements.push(<span key={`text-${idx++}`}>{n}</span>);
				}
			}

			// kiểm tra URL an toàn (chỉ http(s))
			if (/^https?:\/\//i.test(url)) {
				elements.push(
					<ImageWithModal
						key={`img-${idx++}`}
						src={url}
						alt={alt || "image"}
						maxWidthPx={320}
						maxHeightPx={420}
						clickable={true}
						className="my-1"
					/>,
				);
			} else {
				elements.push(<span key={`textbad-${idx++}`}>{match[0]}</span>);
			}

			lastIndex = matchEnd;
		}

		// phần text cuối cùng (nếu có) — parse inline markdown
		if (lastIndex < content.length) {
			const tail = content.slice(lastIndex);
			const nodes = renderInlineMarkdown(tail);
			for (const n of nodes) {
				elements.push(<span key={`text-last-${idx++}`}>{n}</span>);
			}
		}

		// nếu không có match nào (vẫn cần parse markdown cho toàn bộ content)
		if (elements.length === 0) {
			const nodes = renderInlineMarkdown(content);
			return nodes.length ? nodes : [content];
		}

		return elements;
	}

	// helper: phát hiện message chỉ chứa một markdown image (để hiển thị ảnh lớn/khác)
	const isOnlySingleImageMarkdown = (content: string) => {
		const trimmed = content.trim();
		// chuỗi chỉ gồm một lần match và không có ký tự khác
		const m = trimmed.match(/^!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)$/);
		return !!m;
	};

	return (
		<ChatAreaContainer>
			{/* If thread present, show its header */}
			{threadIdParam && <ThreadHeader />}

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
