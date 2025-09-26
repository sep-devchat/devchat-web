import React, { useState, useRef, useCallback } from "react";
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
import MentionModal from "@/components/MentionModal/MentionModal";

interface ChatMessage {
	id: string;
	author: string;
	content: string;
	time: string;
	avatarUrl?: string;
	date: string;
}

interface ThreadPanelProps {
	onClose?: () => void;
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

const ThreadPanel: React.FC<ThreadPanelProps> = ({ onClose }) => {
	const [threadName, setThreadName] = useState<string>("New Thread");
	const [isPrivate, setIsPrivate] = useState<boolean>(false);
	const [message, setMessage] = useState<string>("");
	const [showCreated, setShowCreated] = useState<boolean>(false);
	const [messages, setMessages] = useState<ChatMessage[]>([]);

	const messageInputRef = useRef<HTMLInputElement>(null);
	const {
		showMentionModal,
		mentionSearchTerm,
		handleInputChange,
		handleMentionSelect,
		closeMentionModal,
	} = useMention(messageInputRef);

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

	const handleCreateThread = (): void => {
		if (threadName.trim() && message.trim()) {
			const firstMessage: ChatMessage = {
				id: Date.now().toString(),
				author: "You",
				content: message.trim(),
				time: new Date().toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
				}),
				avatarUrl:
					"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
				date: getCurrentDate(),
			};

			setMessages((prevMessages) => [...prevMessages, firstMessage]);
			setMessage("");
			setShowCreated(true);
			closeMentionModal();
		}
	};

	const handleSendMessage = (): void => {
		if (message.trim()) {
			const newMessage: ChatMessage = {
				id: Date.now().toString(),
				author: "You",
				content: message.trim(),
				time: new Date().toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
				}),
				avatarUrl:
					"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
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
					<IconButton>
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
					/>
					<IconButton>
						<Smile size={20} />
					</IconButton>
					<IconButton onClick={handleCreateThread}>
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
