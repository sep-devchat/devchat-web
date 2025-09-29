import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	ChatAreaContainer,
	MessagesViewport,
	Composer,
} from "./ChatArea.styled";
import { listMessages, MessageResponse } from "@/services/messageAPI";
import { useSocket } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import useSocketEvent from "@/hooks/useSocketEvent";
import { SocketEvents } from "@/utils/constants";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

export type ChatMessage = {
	id: string;
	author: "me" | "other";
	text: string;
};

type ChatAreaProps = {
	initialMessages?: ChatMessage[];
	onSend?: (text: string) => void;
};

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
	const [input, setInput] = useState("");
	const channelId = "test";
	const threadId = ""; // optional; null when empty
	const listRef = useRef<HTMLDivElement | null>(null);
	const inputRef = useRef<HTMLInputElement | null>(null);
	const { socket } = useSocket();

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

	const onServerMessage = useCallback((msg: MessageResponse) => {
		// Append full message with sender profile to realtime list
		setRealtimeMessages((prev) => [...prev, msg]);
	}, []);

	useSocketEvent(SocketEvents.MESSAGE, onServerMessage);

	const send = (e?: React.FormEvent) => {
		e?.preventDefault();
		const text = input.trim();
		if (!text || !channelId.trim()) return;
		// Emit message to server following CreateMessageRequest DTO
		socket.emit(SocketEvents.MESSAGE, {
			channelId: channelId.trim(),
			threadId: threadId.trim() || null,
			parentMessageId: null,
			content: text,
		});
		setInput("");
		// Keep focus in the input after sending
		queueMicrotask(() => inputRef.current?.focus());
	};

	useEffect(() => {
		// Auto-scroll to the bottom when messages change
		const el = listRef.current;
		if (!el) return;
		el.scrollTop = el.scrollHeight;
	}, [messages]);

	return (
		<ChatAreaContainer>
			<MessagesViewport ref={listRef}>
				{isLoading ? (
					<p className="text-sm text-muted-foreground">Loading messages…</p>
				) : isError ? (
					<p className="text-sm text-red-500">Failed to load messages.</p>
				) : messages.length === 0 ? (
					<p className="text-sm text-muted-foreground">
						No messages yet. Start the conversation below.
					</p>
				) : (
					messages.map((m) => {
						const name =
							[m.sender?.firstName, m.sender?.lastName]
								.filter(Boolean)
								.join(" ") ||
							m.sender?.username ||
							"Unknown";
						const initials =
							(m.sender?.firstName?.[0] || "") +
							(m.sender?.lastName?.[0] || "");
						const positionClassName =
							m.sender?.id === profile?.id
								? "justify-start flex-row-reverse"
								: "";
						const isCurrentUser = m.sender?.id === profile?.id;
						return (
							<div
								key={m.id}
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
									className={`flex flex-col ${m.sender?.id === profile?.id ? "items-end" : ""}`}
								>
									<div
										className={`flex gap-4 items-center text-xs text-muted-foreground mb-1 ${isCurrentUser ? "flex-row-reverse" : ""}`}
									>
										<span className="font-bold text-sm">{name}</span>
										<span>{formatMessageTime(m.createdAt)}</span>
									</div>
									<div
										className={`w-fit max-w-full rounded-lg bg-background px-3 py-2 text-sm shadow-none ${isCurrentUser ? "bg-[hsl(var(--primary))] text-white" : "border"}`}
									>
										{m.content}
									</div>
								</div>
							</div>
						);
					})
				)}
			</MessagesViewport>

			<Composer onSubmit={send}>
				<Input
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="Write a message"
					className="shadow-none"
				/>
				<Button type="submit" disabled={!input.trim()}>
					Send
				</Button>
			</Composer>
		</ChatAreaContainer>
	);
};

export default ChatArea;
