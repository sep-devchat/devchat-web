import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { listMessages, type MessageResponse } from "@/services/messageAPI";
import { useSocket } from "@/hooks";
import useSocketEvent from "@/hooks/useSocketEvent";
import { SocketEvents } from "@/utils/constants";

export const Route = createFileRoute("/test-socket")({
	component: RouteComponent,
});

function RouteComponent() {
	// Realtime messages appended when server emits back
	const [realtimeMessages, setRealtimeMessages] = useState<MessageResponse[]>(
		[],
	);
	const [input, setInput] = useState("");
	const [channelId, setChannelId] = useState("test");
	const [threadId, setThreadId] = useState(""); // optional; null when empty
	const listRef = useRef<HTMLDivElement | null>(null);
	const inputRef = useRef<HTMLInputElement | null>(null);
	const { socket } = useSocket();

	// Fetch messages using TanStack Query
	const { data, isLoading, isError } = useQuery({
		queryKey: ["messages"],
		queryFn: () => listMessages(),
	});

	// Server returns messages in DESC order; reverse to ASC for chat display
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

	const send = () => {
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
		el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
	}, [messages]);

	return (
		<div className="p-4">
			<div className="mx-auto max-w-2xl">
				<Card className="h-[70vh] flex flex-col">
					<CardHeader>
						<CardTitle>Chat Demo</CardTitle>
					</CardHeader>
					<CardContent className="flex-1 flex flex-col gap-3">
						<div className="flex items-center gap-2">
							<Input
								placeholder="Channel ID (required)"
								value={channelId}
								onChange={(e) => setChannelId(e.target.value)}
								disabled
							/>
							<Input
								placeholder="Thread ID (optional)"
								value={threadId}
								onChange={(e) => setThreadId(e.target.value)}
							/>
						</div>
						<div
							ref={listRef}
							className="flex-1 overflow-y-auto rounded-md border bg-muted/30 p-3 space-y-2"
						>
							{isLoading ? (
								<p className="text-sm text-muted-foreground">
									Loading messages…
								</p>
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
									const avatar = m.sender?.avatarUrl;
									return (
										<div key={m.id} className="flex items-start gap-2">
											{avatar ? (
												<img
													src={avatar}
													alt={name}
													className="h-8 w-8 rounded-full object-cover border"
													loading="lazy"
													referrerPolicy="no-referrer"
												/>
											) : (
												<div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium select-none">
													{initials || (name[0] ?? "?")}
												</div>
											)}
											<div>
												<div className="text-xs text-muted-foreground mb-1">
													{name}
												</div>
												<div className="w-fit max-w-full rounded-lg border bg-background px-3 py-2 text-sm shadow-sm">
													{m.content}
												</div>
											</div>
										</div>
									);
								})
							)}
						</div>

						<div className="flex items-center gap-2">
							<Input
								ref={inputRef}
								placeholder="Type a message..."
								value={input}
								onChange={(e) => setInput(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										send();
									}
								}}
							/>
							<Button
								onClick={send}
								disabled={!input.trim() || !channelId.trim()}
							>
								Send
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
