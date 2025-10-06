/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment

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
import { listMessages, MessageResponse } from "@/services/messageAPI";
import { useSocket } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import useSocketEvent from "@/hooks/useSocketEvent";
import { SocketEvents } from "@/utils/constants";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import ChatInput, { ChatInputPayload, InboxType } from "../ChatInput/ChatInput";

export type ChatMessage = {
	id: string;
	author: "me" | "other";
	text: string;
};

type ChatAreaProps = {
	initialMessages?: ChatMessage[];
	onSend?: (text: string) => void;
};

function pad(n: number) {
	return n.toString().padStart(2, "0");
}

/* isSameDay, formatDateHeader, formatMessageTime unchanged (keep as in your file) */
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
	const pad = (n: number) => n.toString().padStart(2, "0");
	const sameYMD = (a: Date, b: Date) =>
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate();

	const yesterday = new Date(now);
	yesterday.setDate(now.getDate() - 1);

	const hhmm = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
	if (sameYMD(d, now)) return `Today ${hhmm}`;
	if (sameYMD(d, yesterday)) return `Yesterday ${hhmm}`;
	return `${pad(d.getDate())}/${pad(d.getMonth() + 1)} ${hhmm}`;
}

const ChatArea: React.FC<ChatAreaProps> = () => {
	const profile = useSelector((state: RootState) => state.user.profile);
	const [realtimeMessages, setRealtimeMessages] = useState<MessageResponse[]>(
		[],
	);
	const channelId = "test";
	const threadId = ""; // optional; null when empty
	const listRef = useRef<HTMLDivElement | null>(null);
	const { socket } = useSocket();
	const [filesFromModal, setFilesFromModal] = useState<File[] | undefined>(
		undefined,
	);
	// Import InboxType from ChatInput if not already imported
	// import type { InboxType } from "../ChatInput/ChatInput";
	const [inboxTypeSelected, setInboxTypeSelected] = useState<InboxType>(null);
	const viewportVariant = inboxTypeSelected ?? undefined;

	// Fetch messages using TanStack Query
	const { data, isLoading, isError } = useQuery({
		queryKey: ["messages"],
		queryFn: () => listMessages(),
	});

	// Server messages as MessageResponse objects
	const serverMessages: MessageResponse[] = useMemo(() => {
		const items = (data?.data ?? []) as MessageResponse[];
		return [...items].reverse();
	}, [data]);

	const messages: MessageResponse[] = useMemo(() => {
		return [...serverMessages, ...realtimeMessages];
	}, [serverMessages, realtimeMessages]);

	const onServerMessage = useCallback(
		(msg: MessageResponse & { clientTempId?: string }) => {
			setRealtimeMessages((prev) => {
				// 1) nếu server trả clientTempId -> replace optimistic message có id === clientTempId
				const tempId = (msg as any).clientTempId;
				if (tempId) {
					const idx = prev.findIndex((m) => m.id === tempId);
					if (idx !== -1) {
						const copy = [...prev];
						copy[idx] = msg;
						return copy;
					}
				}

				// 2) fallback: nếu có optimistic tương tự (content + sender + thời gian gần nhau) -> replace
				const foundIndex = prev.findIndex((m) => {
					if (!m.content || !msg.content) return false;
					const sameContent = m.content === msg.content;
					const sameSender = m.sender?.id === msg.sender?.id;
					const t1 = new Date(m.createdAt).getTime();
					const t2 = new Date(msg.createdAt).getTime();
					const close = Math.abs(t1 - t2) < 5000; // 5s window
					return sameContent && sameSender && close;
				});
				if (foundIndex !== -1) {
					const copy = [...prev];
					copy[foundIndex] = msg;
					return copy;
				}

				// 3) không trùng -> append bình thường
				return [...prev, msg];
			});
		},
		[],
	);

	useSocketEvent(SocketEvents.MESSAGE, onServerMessage);
	const send = useCallback(
		async (payload?: ChatInputPayload) => {
			if (!socket) return;
			if (!payload) return;

			const tempId = `temp-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

			if (payload.type === "text") {
				const text = payload.text.trim();
				if (!text) return;

				const optimistic: MessageResponse = {
					id: tempId,
					content: text,
					createdAt: new Date().toISOString(),
					sender: {
						id: profile?.id ?? "me",
						firstName: profile?.firstName,
						lastName: profile?.lastName,
						username: profile?.username,
						avatarUrl: profile?.avatarUrl,
					} as any,
				} as any;

				setRealtimeMessages((prev) => [...prev, optimistic]);

				// gửi kèm clientTempId để server có thể trả lại
				socket.emit(SocketEvents.MESSAGE, {
					channelId: channelId.trim(),
					threadId: threadId?.trim() || null,
					parentMessageId: null,
					content: text,
					clientTempId: tempId,
				});

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
					content: "", // hoặc tên file
					createdAt: new Date().toISOString(),
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

				// emit metadata + clientTempId; nếu muốn upload bytes qua socket, dùng arrayBuffer + event "file-upload"
				socket.emit(SocketEvents.MESSAGE, {
					channelId: channelId.trim(),
					threadId: threadId?.trim() || null,
					parentMessageId: null,
					content: "",
					attachments: attachmentsMeta,
					clientTempId: tempId,
				});

				return;
			}
		},
		[socket, profile],
	);

	useEffect(() => {
		// Auto-scroll to the bottom when messages change
		const el = listRef.current;
		if (!el) return;
		el.scrollTop = el.scrollHeight;

		console.log("inboxTypeSelected", inboxTypeSelected);
	}, [messages, inboxTypeSelected]);

	return (
		<ChatAreaContainer>
			<MessagesViewport
				ref={listRef}
				variant={viewportVariant}
				className={inboxTypeSelected ? "items-end" : ""}
			>
				{isLoading ? (
					<p className="text-sm text-muted-foreground">Loading messages…</p>
				) : isError ? (
					<p className="text-sm text-red-500">Failed to load messages.</p>
				) : messages.length === 0 ? (
					<p className="text-sm text-muted-foreground">
						No messages yet. Start the conversation below.
					</p>
				) : (
					messages.map((m, idx) => {
						const prev = messages[idx - 1];
						const showDateHeader =
							!prev || !isSameDay(prev.createdAt, m.createdAt);

						const name =
							[m.sender?.firstName, m.sender?.lastName]
								.filter(Boolean)
								.join(" ") ||
							m.sender?.username ||
							"Unknown";
						const initials =
							(m.sender?.firstName?.[0] || "") +
							(m.sender?.lastName?.[0] || "");
						// const positionClassName =
						// 	m.sender?.id === profile?.id
						// 		? "justify-start flex-row-reverse"
						// 		: "";
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
										className={`flex flex-col ${isCurrentUser ? "items-end" : ""}`}
									>
										<div
											className={`flex gap-4 items-center text-xs text-muted-foreground mb-1 ${isCurrentUser ? "flex-row-reverse" : ""}`}
										>
											<span className="font-bold text-sm">{name}</span>
											<span>{formatMessageTime(m.createdAt)}</span>
										</div>

										<MessageBubbleStyle
											className={`message-bubble w-fit max-w-full rounded-lg px-3 py-2 text-sm shadow-none ${isCurrentUser ? "me" : "other"}`}
										>
											{m.content}
										</MessageBubbleStyle>
									</div>
								</MessageItem>
							</div>
						);
					})
				)}
			</MessagesViewport>

			{/* <ChatInput
        inboxType={null} // hoặc "quillCode" | "image" | "file" tùy nhu cầu
        placeholder="Write a message"
        onSend={send}
      /> */}

			<ChatInput
				setInboxTypeSelected={setInboxTypeSelected}
				initialFiles={filesFromModal}
				onInitialFilesHandled={() => setFilesFromModal(undefined)}
				onSend={send}
			/>
		</ChatAreaContainer>
	);
};

export default ChatArea;
