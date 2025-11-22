import React, {
	useState,
	useRef,
	useCallback,
	useEffect,
	useMemo,
} from "react";
import { useSelector } from "react-redux";
import { X, Hash, Plus, Smile, Send, Folder } from "lucide-react";
import {
	PageWrapper,
	CPHeader,
	CPHeaderIcon,
	CPHeaderLeft,
	CPTitle,
	ThreadIcon,
	Input,
	MessageInput,
	InputContainer,
	IconButton,
	MessagesArea,
	Message,
	Avatar,
	MessageContent,
	MessageHeader,
	AuthorName,
	MessageTime,
	MessageText,
	DividerWrapper,
	Line,
	DateText,
	CloseButton,
} from "./ThreadPanel.styled";
import MentionModal from "@/components/custom/MentionModal/MentionModal";
import { detailThread } from "@/services/threadAPI";
import { MessageResponse } from "@/services/messageAPI";
import { SocketEvents } from "@/utils/constants";
import { useQueryClient } from "@tanstack/react-query";
import useSocket from "@/hooks/useSocket";
import useSocketEvent from "@/hooks/useSocketEvent";
import { RootState } from "@/store";
import { detailUser } from "@/services/userAPI";
// Removed thread creation, no need for add/invalidate actions

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

const MentionText: React.FC<{ content: string }> = ({ content }) => {
	const mentionRegex = /(@[\w_]+|@everyone|@here)/g;
	const parts = content.split(mentionRegex);
	return (
		<span>
			{parts.map((part, index) => {
				if (part.match(mentionRegex)) {
					return (
						<span key={index} style={{ fontWeight: "bold", color: "#133E87" }}>
							{part}
						</span>
					);
				}
				return <span key={index}>{part}</span>;
			})}
		</span>
	);
};

const useMention = (inputRef: React.RefObject<HTMLInputElement>) => {
	const [showMentionModal, setShowMentionModal] = useState(false);
	const [mentionSearchTerm, setMentionSearchTerm] = useState("");
	const [mentionStartIndex, setMentionStartIndex] = useState(-1);

	const handleInputChange = useCallback(
		(value: string, cursorPosition: number) => {
			let atIndex = -1;
			for (let i = cursorPosition - 1; i >= 0; i--) {
				if (value[i] === "@") {
					if (i === 0 || value[i - 1] === " " || value[i - 1] === "\n") {
						atIndex = i;
						break;
					}
				} else if (value[i] === " " || value[i] === "\n") {
					break;
				}
			}

			if (atIndex !== -1) {
				const searchTerm = value.slice(atIndex + 1, cursorPosition);

				if (!searchTerm.includes(" ") && !searchTerm.includes("\n")) {
					setMentionSearchTerm(searchTerm);
					setMentionStartIndex(atIndex);
					setShowMentionModal(true);
					return;
				}
			}

			setShowMentionModal(false);
			setMentionSearchTerm("");
			setMentionStartIndex(-1);
		},
		[inputRef],
	);

	const handleMentionSelect = useCallback(
		(
			mention: string,
			currentValue: string,
			onValueChange: (value: string) => void,
		) => {
			if (mentionStartIndex !== -1) {
				const beforeMention = currentValue.slice(0, mentionStartIndex);
				const afterMention = currentValue.slice(
					mentionStartIndex + 1 + mentionSearchTerm.length,
				);
				const newValue = beforeMention + mention + " " + afterMention;

				onValueChange(newValue);

				setTimeout(() => {
					if (inputRef.current) {
						const newCursorPosition = beforeMention.length + mention.length + 1;
						inputRef.current.setSelectionRange(
							newCursorPosition,
							newCursorPosition,
						);
						inputRef.current.focus();
					}
				}, 0);
			}

			setShowMentionModal(false);
			setMentionSearchTerm("");
			setMentionStartIndex(-1);
		},
		[mentionStartIndex, mentionSearchTerm, inputRef],
	);

	const closeMentionModal = useCallback(() => {
		setShowMentionModal(false);
		setMentionSearchTerm("");
		setMentionStartIndex(-1);
	}, []);

	return {
		showMentionModal,
		mentionSearchTerm,
		handleInputChange,
		handleMentionSelect,
		closeMentionModal,
	};
};

const ThreadPanel: React.FC<ThreadPanelProps> = ({
	groupId,
	channelId,
	threadId,
	onClose,
}) => {
	// Creation removed: dispatch and channelKey no longer needed

	const [threadName, setThreadName] = useState<string>("Thread");
	const [message, setMessage] = useState<string>("");
	const [attachments, setAttachments] = useState<File[]>([]);
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

	const messageInputRef = useRef<HTMLInputElement>(null);
	const {
		showMentionModal,
		mentionSearchTerm,
		handleInputChange,
		handleMentionSelect,
		closeMentionModal,
	} = useMention(messageInputRef);

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
						setBaseMessages(raw as MessageResponse[]);
						queryClient.setQueryData(
							["thread_messages", groupId, channelId, threadId],
							raw,
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
				optimistic: m.id.startsWith("optimistic-"),
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
					if (
						m.id.startsWith("optimistic-") &&
						m.content === incoming.content &&
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

	const handleSendMessage = (): void => {
		if (!socket) return;
		if (!message.trim() && attachments.length === 0) return;
		if (!threadId || !groupId || !channelId) return;
		// extract fenced code block if present
		let codeBlock: { language?: string; content: string } | null = null;
		let plainContent = message.trim();
		const fenced = plainContent.match(/```(\w+)?\n([\s\S]*?)```/);
		if (fenced) {
			const lang = fenced[1];
			const inner = fenced[2];
			codeBlock = { language: lang, content: inner };
			// remove fenced block from content (optional: keep preceding text)
			plainContent = plainContent.replace(fenced[0], "").trim();
		}
		const optimistic: MessageResponse = {
			id: `optimistic-${Date.now()}`,
			channelId: channelId,
			thread: { id: threadId } as any,
			senderId: profile?.id || "unknown",
			parentMessageId: null,
			parentMessage: null as any,
			content: plainContent || (codeBlock ? `Code snippet` : ""),
			createdAt: new Date(),
			updatedAt: new Date(),
			sender: profile as any,
			attachments: attachments.map((f) => ({
				name: f.name,
				size: f.size,
				type: f.type,
			})),
			codeBlock,
		} as any;
		setRealtimeMessages((prev) => [...prev, optimistic]);
		const payload: any = {
			groupId,
			channelId,
			threadId,
			content: plainContent,
			attachments: attachments.map((f) => ({
				name: f.name,
				size: f.size,
				type: f.type,
			})),
			codeBlock,
		};
		try {
			socket.emit(SocketEvents.SEND_THREAD_MESSAGE, payload);
		} catch {}
		setMessage("");
		setAttachments([]);
		closeMentionModal();
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
		if (showMentionModal) return;
		if (e.key === "Enter") handleSendMessage();
	};

	const handleMessageChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	): void => {
		const newValue = e.target.value;
		const cursorPosition = e.target.selectionStart || 0;
		setMessage(newValue);
		handleInputChange(newValue, cursorPosition);
	};

	const fileInputRef = useRef<HTMLInputElement>(null);
	const openFilePicker = () => fileInputRef.current?.click();
	const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		if (files.length) setAttachments((prev) => [...prev, ...files]);
		// reset value so selecting same file again triggers change
		e.target.value = "";
	};

	const handleMentionSelectWrapper = (mention: string): void => {
		handleMentionSelect(mention, message, setMessage);
	};

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
				<MessagesArea
					ref={messagesContainerRef}
					onScroll={handleMessagesScroll}
				>
					<div
						style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}
					>
						Loading thread...
					</div>
				</MessagesArea>
			</PageWrapper>
		);
	}

	if (threadId) {
		const groupedMessages = groupMessagesByDate(uiMessages);

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

				<MessagesArea
					ref={messagesContainerRef}
					onScroll={handleMessagesScroll}
				>
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							textAlign: "center",
							marginBottom: "20px",
							alignItems: "center",
							gap: "6px",
						}}
					>
						<ThreadIcon>
							<Hash size={24} />
						</ThreadIcon>
						<CPTitle style={{ fontSize: "24px", fontWeight: "bold" }}>
							{threadName}
						</CPTitle>
					</div>

					{Object.entries(groupedMessages).map(([date, dateMessages]) => (
						<div key={date}>
							<DividerWrapper>
								<Line />
								<DateText>{date}</DateText>
								<Line />
							</DividerWrapper>

							{dateMessages.map((msg) => {
								const bubbleStyle: React.CSSProperties = msg.isCurrentUser
									? {
											background: "linear-gradient(135deg,#133E87,#0F2D5C)",
											color: "#fff",
											borderRadius: 16,
											padding: "8px 12px",
											alignSelf: "flex-end",
											maxWidth: "78%",
											boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
										}
									: {
											background: "#F3F4F6",
											color: "#111",
											borderRadius: 16,
											padding: "8px 12px",
											alignSelf: "flex-start",
											maxWidth: "78%",
										};
								const authorLabel = msg.isCurrentUser ? "You" : msg.author;
								const headerStyle: React.CSSProperties = msg.isCurrentUser
									? { flexDirection: "row-reverse", gap: 6 }
									: {};
								return (
									<Message
										key={msg.id}
										style={msg.optimistic ? { opacity: 0.55 } : undefined}
									>
										<Avatar
											style={
												msg.isCurrentUser
													? { order: 2, boxShadow: "0 0 0 2px #133E87" }
													: { boxShadow: "0 0 0 2px #CBD5E1" }
											}
										>
											<img
												src={msg.avatarUrl}
												alt={authorLabel}
												style={{
													width: "100%",
													height: "100%",
													borderRadius: "50%",
													objectFit: "cover",
												}}
											/>
										</Avatar>
										<MessageContent
											style={
												msg.isCurrentUser
													? { alignItems: "flex-end" }
													: undefined
											}
										>
											<MessageHeader style={headerStyle}>
												<AuthorName
													style={
														msg.isCurrentUser ? { color: "#fff" } : undefined
													}
												>
													{authorLabel}
												</AuthorName>
												<MessageTime style={{ fontSize: 11, opacity: 0.7 }}>
													{msg.time}
												</MessageTime>
											</MessageHeader>
											<div style={bubbleStyle}>
												<MessageText style={{ margin: 0 }}>
													<MentionText content={msg.content} />
												</MessageText>
												{msg.codeBlock && (
													<div style={{ marginTop: 6 }}>
														<pre
															style={{
																background: msg.isCurrentUser
																	? "#0B254A"
																	: "#E2E8F0",
																padding: "8px 10px",
																borderRadius: 8,
																overflowX: "auto",
																fontSize: 13,
															}}
														>
															<code>{msg.codeBlock.content}</code>
														</pre>
														{msg.codeBlock.language && (
															<div
																style={{
																	fontSize: 11,
																	opacity: 0.7,
																	marginTop: 4,
																}}
															>
																Language: {msg.codeBlock.language}
															</div>
														)}
													</div>
												)}
												{msg.attachments && msg.attachments.length > 0 && (
													<ul
														style={{
															listStyle: "none",
															padding: 0,
															margin: "6px 0 0",
															display: "flex",
															flexDirection: "column",
															gap: 4,
														}}
													>
														{msg.attachments.map((att) => (
															<li
																key={att.name}
																style={{
																	fontSize: 12,
																	display: "flex",
																	alignItems: "center",
																	gap: 6,
																}}
															>
																<span
																	style={{
																		background: msg.isCurrentUser
																			? "#0B254A"
																			: "#E2E8F0",
																		padding: "2px 6px",
																		borderRadius: 6,
																		maxWidth: 220,
																		whiteSpace: "nowrap",
																		overflow: "hidden",
																		textOverflow: "ellipsis",
																	}}
																>
																	{att.name}
																</span>
																<span style={{ fontSize: 10, opacity: 0.6 }}>
																	{Math.round(att.size / 1024)}KB
																</span>
															</li>
														))}
													</ul>
												)}
											</div>
										</MessageContent>
									</Message>
								);
							})}
						</div>
					))}
				</MessagesArea>

				<MessageInput style={{ position: "relative" }}>
					<InputContainer>
						<IconButton onClick={openFilePicker}>
							<Plus size={20} />
						</IconButton>
						<Input
							ref={messageInputRef}
							type="text"
							placeholder="Enter message"
							value={message}
							onChange={handleMessageChange}
							onKeyPress={handleKeyPress}
						/>
						<IconButton>
							<Smile size={20} />
						</IconButton>
						<IconButton onClick={handleSendMessage}>
							<Send size={20} />
						</IconButton>
						<input
							ref={fileInputRef}
							style={{ display: "none" }}
							type="file"
							multiple
							onChange={handleFilesSelected}
						/>
					</InputContainer>
					{attachments.length > 0 && (
						<div
							style={{
								marginTop: 8,
								display: "flex",
								flexWrap: "wrap",
								gap: 6,
							}}
						>
							{attachments.map((f) => (
								<div
									key={f.name}
									style={{
										fontSize: 11,
										background: "#E2E8F0",
										padding: "2px 6px",
										borderRadius: 6,
									}}
								>
									{f.name} ({Math.round(f.size / 1024)}KB)
								</div>
							))}
						</div>
					)}

					<MentionModal
						show={showMentionModal}
						searchTerm={mentionSearchTerm}
						onSelect={handleMentionSelectWrapper}
						onClose={closeMentionModal}
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
				<div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
					No thread selected.
				</div>
			</MessagesArea>
		</PageWrapper>
	);
};

export default ThreadPanel;

// Socket event handlers (placed after export to avoid re-renders) are not used here; kept inside component scope above.
