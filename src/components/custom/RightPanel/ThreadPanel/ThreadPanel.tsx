import React, { useState, useRef, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { X, Hash, Plus, Smile, Send, Lock, Folder } from "lucide-react";
import {
	PageWrapper,
	CPHeader,
	CPHeaderIcon,
	CPHeaderLeft,
	CPTitle,
	ThreadIcon,
	ThreadForm,
	FormGroup,
	Label,
	Input,
	CheckboxGroup,
	Checkbox,
	CheckboxLabel,
	CheckboxDescription,
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
	PrivateText,
} from "./ThreadPanel.styled";
import MentionModal from "@/components/custom/MentionModal/MentionModal";
import { createThread, detailThread } from "@/services/threadAPI";
import { RootState } from "@/store";
import { detailUser } from "@/services/userAPI";
import { addThread, invalidateThreadCache } from "@/store/thread.slice";

interface ChatMessage {
	id: string;
	author: string;
	content: string;
	time: string;
	avatarUrl?: string;
	date: string;
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
						<span
							key={index}
							style={{
								fontWeight: "bold",
								color: "#133E87",
							}}
						>
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
	onThreadCreated,
}) => {
	const dispatch = useDispatch();
	const channelKey = `${groupId}-${channelId}`;

	const [threadName, setThreadName] = useState<string>("New Thread");
	const [isPrivate, setIsPrivate] = useState<boolean>(false);
	const [message, setMessage] = useState<string>("");
	const [showCreated, setShowCreated] = useState<boolean>(false);
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [isCreating, setIsCreating] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);

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
		if (!threadId) {
			setThreadName("New Thread");
			setIsPrivate(false);
			setMessage("");
			setShowCreated(false);
			setMessages([]);
			setThreadCreatorInfo(null);
		} else if (groupId && channelId) {
			loadThreadDetails();
		}
	}, [threadId, groupId, channelId]);

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
				setShowCreated(true);

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

				if (threadData.description) {
					const initialMessage: ChatMessage = {
						id: threadData.id,
						author: creatorName,
						content: threadData.description,
						time: new Date(threadData.createdAt).toLocaleTimeString([], {
							hour: "2-digit",
							minute: "2-digit",
						}),
						avatarUrl: creatorAvatar,
						date: new Date(threadData.createdAt).toLocaleDateString("en-US", {
							month: "long",
							day: "numeric",
							year: "numeric",
						}),
					};
					setMessages([initialMessage]);
				}
			}
		} catch (error) {
			console.error("Failed to load thread details:", error);
			alert("Failed to load thread. Please try again.");
			if (onClose) onClose();
		} finally {
			setIsLoading(false);
		}
	};

	const getCurrentDate = (): string => {
		const now = new Date();
		return now.toLocaleDateString("en-US", {
			month: "long",
			day: "numeric",
			year: "numeric",
		});
	};

	const handleClose = (): void => {
		if (onClose) {
			onClose();
		}
	};

	const handleCreateThread = async (): Promise<void> => {
		if (threadName.trim() && message.trim() && !isCreating) {
			setIsCreating(true);
			try {
				const response = await createThread(groupId, channelId, {
					name: threadName.trim(),
					description: message.trim(),
				});

				const createdThread = response?.data;

				dispatch(
					invalidateThreadCache({
						channelKey,
					}),
				);

				if (createdThread) {
					dispatch(
						addThread({
							channelKey,
							thread: createdThread,
						}),
					);
				}

				const currentUserName = getDisplayName(profile);
				const currentUserAvatar =
					profile?.avatarUrl ||
					"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face";

				const firstMessage: ChatMessage = {
					id: Date.now().toString(),
					author: currentUserName,
					content: message.trim(),
					time: new Date().toLocaleTimeString([], {
						hour: "2-digit",
						minute: "2-digit",
					}),
					avatarUrl: currentUserAvatar,
					date: getCurrentDate(),
				};

				setMessages((prevMessages) => [...prevMessages, firstMessage]);
				setMessage("");
				setShowCreated(true);
				closeMentionModal();

				setThreadCreatorInfo({
					name: currentUserName,
					avatarUrl: currentUserAvatar,
				});

				if (onThreadCreated) {
					onThreadCreated(createdThread?.id || "");
				}

				window.dispatchEvent(
					new CustomEvent("app:threadCreated", {
						detail: { groupId, channelId },
					}),
				);
			} catch (error: any) {
				console.error("Error creating thread:", error);
				const errorMessage =
					error?.response?.data?.message ||
					error?.message ||
					"Failed to create thread. Please try again.";
				alert(errorMessage);
			} finally {
				setIsCreating(false);
			}
		}
	};

	const handleSendMessage = (): void => {
		if (message.trim()) {
			const currentUserName = getDisplayName(profile);
			const currentUserAvatar =
				profile?.avatarUrl ||
				"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face";

			const newMessage: ChatMessage = {
				id: Date.now().toString(),
				author: currentUserName,
				content: message.trim(),
				time: new Date().toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
				}),
				avatarUrl: currentUserAvatar,
				date: getCurrentDate(),
			};

			setMessages((prevMessages) => [...prevMessages, newMessage]);
			setMessage("");
			closeMentionModal();
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
		if (showMentionModal) {
			return;
		}

		if (e.key === "Enter") {
			if (showCreated) {
				handleSendMessage();
			} else {
				handleCreateThread();
			}
		}
	};

	const handleMessageChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	): void => {
		const newValue = e.target.value;
		const cursorPosition = e.target.selectionStart || 0;

		setMessage(newValue);
		handleInputChange(newValue, cursorPosition);
	};

	const handleMentionSelectWrapper = (mention: string): void => {
		handleMentionSelect(mention, message, setMessage);
	};

	const groupMessagesByDate = (messages: ChatMessage[]) => {
		const grouped: { [key: string]: ChatMessage[] } = {};
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
					<IconButton onClick={handleClose}>
						<X size={20} />
					</IconButton>
				</CPHeader>
				<MessagesArea>
					<div
						style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}
					>
						Loading thread...
					</div>
				</MessagesArea>
			</PageWrapper>
		);
	}

	if (showCreated) {
		const groupedMessages = groupMessagesByDate(messages);

		return (
			<PageWrapper>
				<CPHeader>
					<CPHeaderLeft>
						<CPHeaderIcon>
							<Folder size={18} />
						</CPHeaderIcon>
						<CPTitle>Thread</CPTitle>
					</CPHeaderLeft>
					<IconButton onClick={handleClose}>
						<X size={20} />
					</IconButton>
				</CPHeader>

				<MessagesArea>
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
							{isPrivate ? <Lock size={24} /> : <Hash size={24} />}
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

							{dateMessages.map((msg) => (
								<Message key={msg.id}>
									<Avatar>
										<img
											src={msg.avatarUrl}
											alt={msg.author}
											style={{
												width: "100%",
												height: "100%",
												borderRadius: "50%",
												objectFit: "cover",
											}}
										/>
									</Avatar>
									<MessageContent>
										<MessageHeader>
											<AuthorName>{msg.author}</AuthorName>
											<MessageTime>{msg.time}</MessageTime>
										</MessageHeader>
										<MessageText>
											<MentionText content={msg.content} />
										</MessageText>
									</MessageContent>
								</Message>
							))}
						</div>
					))}
				</MessagesArea>

				<MessageInput style={{ position: "relative" }}>
					<InputContainer>
						<IconButton>
							<Plus size={20} />
						</IconButton>
						<Input
							ref={messageInputRef}
							type="text"
							placeholder="Enter messages"
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
					</InputContainer>

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
				<IconButton onClick={handleClose}>
					<X size={20} />
				</IconButton>
			</CPHeader>

			<MessagesArea>
				<div>
					<ThreadIcon>
						<Folder size={24} color="white" />
					</ThreadIcon>
				</div>

				<ThreadForm>
					<FormGroup>
						<Label>Thread Name</Label>
						<Input
							type="text"
							value={threadName}
							onChange={(e) => setThreadName(e.target.value)}
							placeholder="Enter thread name"
						/>
					</FormGroup>
					<div>
						<CheckboxLabel htmlFor="private-thread">
							Private Thread
						</CheckboxLabel>
						<CheckboxGroup>
							<Checkbox
								type="checkbox"
								id="private-thread"
								checked={isPrivate}
								onChange={(e) => setIsPrivate(e.target.checked)}
							/>
							<div>
								<CheckboxDescription>
									Only people you invite and moderators can see
								</CheckboxDescription>
							</div>
						</CheckboxGroup>
						{isPrivate && (
							<PrivateText>
								You can invite new people by @mentioning them
							</PrivateText>
						)}
					</div>
				</ThreadForm>
			</MessagesArea>

			<MessageInput style={{ position: "relative" }}>
				<InputContainer>
					<IconButton>
						<Plus size={20} />
					</IconButton>
					<Input
						ref={messageInputRef}
						type="text"
						placeholder="Enter messages"
						value={message}
						onChange={handleMessageChange}
						onKeyPress={handleKeyPress}
						disabled={isCreating}
					/>
					<IconButton>
						<Smile size={20} />
					</IconButton>
					<IconButton onClick={handleCreateThread} disabled={isCreating}>
						<Send size={20} />
					</IconButton>
				</InputContainer>

				<MentionModal
					show={showMentionModal}
					searchTerm={mentionSearchTerm}
					onSelect={handleMentionSelectWrapper}
					onClose={closeMentionModal}
				/>
			</MessageInput>
		</PageWrapper>
	);
};

export default ThreadPanel;
