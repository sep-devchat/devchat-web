import React, {
	useState,
	useRef,
	useCallback,
	useEffect,
	useMemo,
	useLayoutEffect,
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
	DividerWrapper,
	Line,
	DateText,
	CloseButton,
} from "./ThreadPanel.styled";
import MarkdownPreview from "@/components/custom/MarkdownPreview";
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
	const bottomRef = useRef<HTMLDivElement | null>(null);
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
									const codeBlockClasses = msg.isCurrentUser
										? "mt-1.5 overflow-x-auto rounded-lg bg-[#0B254A] px-2.5 py-2 text-[13px] text-white"
										: "mt-1.5 overflow-x-auto rounded-lg bg-gray-200 px-2.5 py-2 text-[13px] text-gray-900";
									const attachmentChipClass = msg.isCurrentUser
										? "max-w-[220px] truncate rounded-md bg-[#0B254A] px-1.5 py-0.5 text-white"
										: "max-w-[220px] truncate rounded-md bg-gray-200 px-1.5 py-0.5 text-gray-900";
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
														? "flex flex-col align-end gap-1.5"
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
													{msg.codeBlock && (
														<div>
															<pre className={codeBlockClasses}>
																<code>{msg.codeBlock.content}</code>
															</pre>
															{msg.codeBlock.language && (
																<div className="mt-1 text-[11px] opacity-70">
																	Language: {msg.codeBlock.language}
																</div>
															)}
														</div>
													)}
													{msg.attachments && msg.attachments.length > 0 && (
														<ul className="mt-1.5 flex list-none flex-col gap-1 p-0">
															{msg.attachments.map((att) => (
																<li
																	key={att.name}
																	className="flex items-center gap-1.5 text-xs"
																>
																	<span className={attachmentChipClass}>
																		{att.name}
																	</span>
																	<span className="text-[10px] opacity-60">
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

						<div ref={bottomRef} />
					</div>
				</MessagesArea>

				<MessageInput className="relative">
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
							className="hidden"
							type="file"
							multiple
							onChange={handleFilesSelected}
						/>
					</InputContainer>
					{attachments.length > 0 && (
						<div className="mt-2 flex flex-wrap gap-1.5">
							{attachments.map((f) => (
								<div
									key={f.name}
									className="rounded-md bg-gray-200 px-1.5 py-0.5 text-[11px]"
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
				<div className="p-10 text-center text-gray-500">
					No thread selected.
				</div>
			</MessagesArea>
		</PageWrapper>
	);
};

export default ThreadPanel;

// Socket event handlers (placed after export to avoid re-renders) are not used here; kept inside component scope above.
