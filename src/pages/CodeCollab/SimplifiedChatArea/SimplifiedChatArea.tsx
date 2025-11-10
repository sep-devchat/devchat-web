import React, { useState, useMemo } from "react";
import { MessageResponse } from "../types";
import { formatMessageTime, formatDateHeader } from "../utils";
import * as S from "./SimplifiedChatArea.styled";

const INITIAL_MESSAGES: MessageResponse[] = [
	{
		id: "1",
		content:
			"Hey everyone! I just pushed the initial code for the sum calculator.",
		createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
		sender: {
			id: "user1",
			firstName: "Alice",
			lastName: "Johnson",
			username: "alice",
		},
	},
	{
		id: "2",
		content: "Thanks Alice! I'll review it now.",
		createdAt: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
		sender: {
			id: "user2",
			firstName: "Bob",
			lastName: "Smith",
			username: "bob",
		},
	},
	{
		id: "3",
		content:
			"I made some improvements to the variable naming. Check out my version!",
		createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
		sender: {
			id: "user3",
			firstName: "Như",
			lastName: "Nguyễn",
			username: "nhu",
		},
	},
	{
		id: "4",
		content: "Looking good! The code is much cleaner now.",
		createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
		sender: {
			id: "user1",
			firstName: "Alice",
			lastName: "Johnson",
			username: "alice",
		},
	},
];

export const SimplifiedChatArea: React.FC = () => {
	const [messages, setMessages] = useState<MessageResponse[]>(INITIAL_MESSAGES);
	const [inputValue, setInputValue] = useState("");
	const currentUserId = "user2";

	const handleSend = () => {
		if (!inputValue.trim()) return;

		const newMessage: MessageResponse = {
			id: `temp-${Date.now()}`,
			content: inputValue,
			createdAt: new Date().toISOString(),
			sender: {
				id: currentUserId,
				firstName: "Bob",
				lastName: "Smith",
				username: "bob",
			},
		};

		setMessages((prev) => [...prev, newMessage]);
		setInputValue("");
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	const groupedMessages = useMemo(() => {
		const groups: Array<{ date: string; messages: MessageResponse[] }> = [];
		let currentGroup: MessageResponse[] = [];
		let currentDate = "";

		messages.forEach((msg, idx) => {
			const msgDate = formatDateHeader(msg.createdAt);

			if (msgDate !== currentDate) {
				if (currentGroup.length > 0) {
					groups.push({ date: currentDate, messages: currentGroup });
				}
				currentDate = msgDate;
				currentGroup = [msg];
			} else {
				currentGroup.push(msg);
			}

			if (idx === messages.length - 1) {
				groups.push({ date: currentDate, messages: currentGroup });
			}
		});

		return groups;
	}, [messages]);

	return (
		<S.Container>
			<S.MessagesContainer>
				{groupedMessages.map((group, groupIdx) => (
					<S.MessageGroup key={groupIdx}>
						<S.DateDivider>
							<S.DateLine />
							<S.DateText>{group.date}</S.DateText>
							<S.DateLine />
						</S.DateDivider>

						{group.messages.map((msg, idx) => {
							const prevMsg = idx > 0 ? group.messages[idx - 1] : null;
							const isCurrentUser = msg.sender?.id === currentUserId;
							const isSameSenderAsPrev = prevMsg?.sender?.id === msg.sender?.id;
							const showAvatarAndHeader = !isSameSenderAsPrev;

							const name =
								[msg.sender?.firstName, msg.sender?.lastName]
									.filter(Boolean)
									.join(" ") ||
								msg.sender?.username ||
								"Unknown";

							const initials =
								(msg.sender?.firstName?.[0] || "") +
								(msg.sender?.lastName?.[0] || "");

							return (
								<S.MessageRow key={msg.id} $isCurrentUser={isCurrentUser}>
									{showAvatarAndHeader ? (
										msg.sender?.avatarUrl ? (
											<S.Avatar $hasImage>
												<S.AvatarImage src={msg.sender.avatarUrl} alt={name} />
											</S.Avatar>
										) : (
											<S.Avatar>{initials || name[0]}</S.Avatar>
										)
									) : (
										<S.AvatarSpacer />
									)}

									<S.MessageContent $isCurrentUser={isCurrentUser}>
										{showAvatarAndHeader && (
											<S.MessageHeader $isCurrentUser={isCurrentUser}>
												<S.SenderName>{name}</S.SenderName>
												<S.MessageTime>
													{formatMessageTime(msg.createdAt)}
												</S.MessageTime>
											</S.MessageHeader>
										)}
										<S.MessageBubble $isCurrentUser={isCurrentUser}>
											{msg.content}
										</S.MessageBubble>
									</S.MessageContent>
								</S.MessageRow>
							);
						})}
					</S.MessageGroup>
				))}
			</S.MessagesContainer>

			<S.InputArea>
				<S.InputWrapper>
					<S.StyledTextarea
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						onKeyPress={handleKeyPress}
						placeholder="Type a message..."
						rows={1}
					/>
					<S.SendButton
						onClick={handleSend}
						disabled={!inputValue.trim()}
						$disabled={!inputValue.trim()}
					>
						Send
					</S.SendButton>
				</S.InputWrapper>
			</S.InputArea>
		</S.Container>
	);
};
