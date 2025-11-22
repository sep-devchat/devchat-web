import React, { useState, useRef, useCallback, useEffect } from "react";
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
import { RootState } from "@/store";
import { detailUser } from "@/services/userAPI";
// Removed thread creation, no need for add/invalidate actions

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
}) => {
	// Creation removed: dispatch and channelKey no longer needed

	const [threadName, setThreadName] = useState<string>("Thread");
	const [message, setMessage] = useState<string>("");
	const [messages, setMessages] = useState<ChatMessage[]>([]);
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
		if (threadId && groupId && channelId) {
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

	const getCurrentDate = (): string => {
		const now = new Date();
		return now.toLocaleDateString("en-US", {
			month: "long",
			day: "numeric",
			year: "numeric",
		});
	};

	// Creation removed: component now only views existing thread content.

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
					{onClose && (
						<CloseButton onClick={onClose}>
							<X size={20} />
						</CloseButton>
					)}
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

	if (threadId) {
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
					{onClose && (
						<CloseButton onClick={onClose}>
							<X size={20} />
						</CloseButton>
					)}
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
				{onClose && (
					<CloseButton onClick={onClose}>
						<X size={20} />
					</CloseButton>
				)}
			</CPHeader>
			<MessagesArea>
				<div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
					No thread selected.
				</div>
			</MessagesArea>
		</PageWrapper>
	);
};

export default ThreadPanel;
