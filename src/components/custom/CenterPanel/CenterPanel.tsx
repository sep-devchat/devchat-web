// CenterPanel.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
	CenterPanelRoot,
	CPAuthorName,
	CPAvatar,
	CPAvatarChannel,
	CPBubbleContent,
	CPBubbleTop,
	CPChannel,
	CPChatArea,
	CPContainer,
	CPDate,
	CPDateArea,
	CPDateDivider,
	CPEmoji,
	CPEmojiPicker,
	CPHash,
	CPHeader,
	CPHeaderIcon,
	CPHeaderLeft,
	CPHeaderTitle,
	CPHoverActions,
	CPMessages,
	CPMsgCol,
	CPReactionCount,
	CPReactionPill,
	CPReactions,
	CPRepBtn,
	CPReplyAuthor,
	CPReplyContent,
	CPThreadComposer,
	CPThreadExpanded,
	CPThreadIcon,
	CPThreadList,
	CPThreadPreview,
	CPThreadPreviewRow,
	CPThreadText,
	CPTimeSmall,
	CPTitle,
	IconBtn,
	Tooltip,
} from "./CenterPanel.styled";

import { Bell, Hash, Spool, SquareCode, Users } from "lucide-react";
import { Message as DataMessage } from "@/sampleData";

/**
 * Adapted to Message/Attachment interface coming from sampleData:
 * Message fields used: messageId, channelId, threadId, senderId, content, messageType, parentMessageId, createdAt, updatedAt, deletedAt, attachments
 *
 * Notes:
 * - Reactions are stored locally in component state (not persisted back into message objects).
 * - Replies are represented as Message objects where threadId === parentMessageId.
 */

// local reactions store: messageId -> { emoji: userIds[] }
type ReactionsStore = Record<string, Record<string, string[]>>;

type Props = {
	currentUserId: string;
	setIconSelected?: (icon: string) => void;
	iconSelected?: string;
};

export default function CenterPanel({
	currentUserId,
	setIconSelected,
	iconSelected,
}: Props) {
	const [messages, setMessages] = useState<DataMessage[]>([]);
	const [hovered, setHovered] = useState<string | null>(null); // will hold messageId
	const [openThreadFor, setOpenThreadFor] = useState<string | null>(null); // messageId
	const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
	const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
	const [reactions, setReactions] = useState<ReactionsStore>({});

	const emojis = ["👍", "❤️", "😂", "🎉", "😮"];
	const compact = iconSelected === "spool" || iconSelected === "code";

	// a tiny user map for rendering author names & avatars (in real app fetch users)
	const userMap: Record<string, { name: string; avatar?: string }> = {
		"7a8f3e2b-1c4d-4f9a-9d2b-0b4a6c1f1234": {
			name: "Tuấn",
			avatar: "https://i.pravatar.cc/40?img=32",
		},
		"aa11bb22-3333-4444-5555-666677778888": {
			name: "Lê Thành",
			avatar: "https://i.pravatar.cc/40?img=14",
		},
		"cc99dd88-7777-6666-5555-444433332222": {
			name: "Phạm Trang",
			avatar: "https://i.pravatar.cc/40?img=8",
		},
		// current user as "Bạn"
		[currentUserId]: { name: "Bạn", avatar: "https://i.pravatar.cc/40?img=32" },
	};

	// Initial mock messages (adapted to DataMessage interface)
	useEffect(() => {
		const initial: DataMessage[] = [
			{
				messageId: "m-0001-1111-2222-3333-aaaaaaaaaaaa",
				channelId: "ch-1001",
				threadId: null,
				senderId: "7a8f3e2b-1c4d-4f9a-9d2b-0b4a6c1f1234",
				content:
					"Một chút về rules của chúng mình để giữ tiêu chuẩn cộng đồng nào:\n- Luôn hoà đồng, thân thiện và cùng nhau chia sẻ và giải đáp thắc mắc với nhau.\n- Không chia sẻ những hình ảnh 18+, hình ảnh đen tối (dark meme thì vào channel meme)...",
				messageType: "text",
				parentMessageId: null,
				createdAt: "2025-08-29T00:05:00Z",
				updatedAt: null,
				deletedAt: false,
				attachments: [],
			},
			{
				messageId: "m-0002-1111-2222-3333-bbbbbbbbbbbb",
				channelId: "ch-1001",
				threadId: null,
				senderId: currentUserId,
				content: "Hello mọi người, test message bên phải (của chính mình)",
				messageType: "text",
				parentMessageId: null,
				createdAt: "2025-08-29T00:10:00Z",
				updatedAt: null,
				deletedAt: false,
				attachments: [],
			},
			// a message with attachments
			{
				messageId: "m-0004-1111-2222-3333-dddddddddddd",
				channelId: "ch-1002",
				threadId: null,
				senderId: "cc99dd88-7777-6666-5555-444433332222",
				content: null,
				messageType: "image",
				parentMessageId: null,
				createdAt: "2025-09-22T09:00:00Z",
				updatedAt: null,
				deletedAt: false,
				attachments: [
					{
						attachmentId: "att-2001-bbbb-0001",
						messageId: "m-0004-1111-2222-3333-dddddddddddd",
						filename: "design-screenshot.jpg",
						originalFilename: "design-screenshot.jpg",
						filePath: "/uploads/groups/d1a2b3c4/ch-1002/design-screenshot.jpg",
						fileSize: 180000,
						mimeType: "image/jpeg",
						uploadedAt: "2025-09-22T09:00:03Z",
					},
				],
			},
			// a reply stored as a message with threadId = parent messageId
			{
				messageId: "m-0003-1111-2222-3333-cccccccccccc",
				channelId: "ch-1001",
				threadId: "m-0002-1111-2222-3333-bbbbbbbbbbbb",
				senderId: "cc99dd88-7777-6666-5555-444433332222",
				content: "File xem ok, mình có 1 comment ở slide 3.",
				messageType: "text",
				parentMessageId: "m-0002-1111-2222-3333-bbbbbbbbbbbb",
				createdAt: "2025-09-22T08:10:00Z",
				updatedAt: null,
				deletedAt: false,
				attachments: [],
			},
		];
		setMessages(initial);

		// optional: initial reactions
		setReactions({
			["m-0001-1111-2222-3333-aaaaaaaaaaaa"]: {
				"👍": ["aa11bb22-3333-4444-5555-666677778888"],
				"❤️": ["cc99dd88-7777-6666-5555-444433332222"],
			},
		});
	}, [currentUserId]);

	// Helper: top-level messages (exclude replies that have threadId)
	const topLevelMessages = useMemo(
		() => messages.filter((m) => !m.threadId),
		[messages],
	);

	const toggleThread = (id: string) => {
		setOpenThreadFor((v) => (v === id ? null : id));
	};

	// send a new top-level message (ComposerWithAdd calls this)
	// function handleSend(payload: { text: string; attachments?: Attachment[] }) {
	// 	const newMsg: DataMessage = {
	// 		messageId: `${Date.now()}`,
	// 		channelId: "ch-1001",
	// 		threadId: null,
	// 		senderId: currentUserId,
	// 		content: payload.text ?? null,
	// 		messageType:
	// 			payload.attachments && payload.attachments.length > 0 ? "file" : "text",
	// 		parentMessageId: null,
	// 		createdAt: new Date().toISOString(),
	// 		updatedAt: null,
	// 		deletedAt: false,
	// 		attachments: payload.attachments || [],
	// 	};
	// 	setMessages((prev) => [...prev, newMsg]);
	// }

	// send a reply — stored as a Message with threadId = parentId
	const handleSendReply = async (parentId: string) => {
		const content = (replyInputs[parentId] || "").trim();
		if (!content) return;

		const replyMsg: DataMessage = {
			messageId: `r${Date.now()}`,
			channelId: "ch-1001",
			threadId: parentId,
			senderId: currentUserId,
			content,
			messageType: "text",
			parentMessageId: parentId,
			createdAt: new Date().toISOString(),
			updatedAt: null,
			deletedAt: false,
			attachments: [],
		};

		setMessages((prev) => [...prev, replyMsg]);
		setReplyInputs((r) => ({ ...r, [parentId]: "" }));
		setOpenThreadFor(parentId);
	};

	// reactions operate on local reactions state
	const handleReact = (messageId: string, emoji: string) => {
		setReactions((prev) => {
			const copy = { ...prev };
			const msgReacts = { ...(copy[messageId] || {}) } as Record<
				string,
				string[]
			>;
			const users = new Set(msgReacts[emoji] || []);
			if (users.has(currentUserId)) {
				users.delete(currentUserId);
			} else {
				users.add(currentUserId);
			}
			msgReacts[emoji] = Array.from(users);
			copy[messageId] = msgReacts;
			return copy;
		});
	};

	// get replies for a message (messages with threadId === messageId)
	const getReplies = (messageId: string) => {
		return messages
			.filter((m) => m.threadId === messageId)
			.sort(
				(a, b) =>
					new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
			);
	};

	const onIconClick = (name: string) => {
		if (setIconSelected) setIconSelected(name);
	};

	const onIconKeyDown = (e: React.KeyboardEvent, name: string) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			onIconClick(name);
		}
	};

	return (
		<CenterPanelRoot>
			<CPContainer>
				<CPHeader
					style={{
						borderTopRightRadius: compact ? "10px" : "0",
					}}
				>
					<CPHeaderLeft>
						<CPHeaderIcon>
							<IconBtn
								aria-label="channel-hash"
								onMouseEnter={() => setHoveredIcon("hash")}
								onMouseLeave={() =>
									setHoveredIcon((h) => (h === "hash" ? null : h))
								}
								onClick={() => onIconClick("hash")}
								onKeyDown={(e) => onIconKeyDown(e, "hash")}
								title="Channel"
							>
								<Hash />
								<Tooltip visible={hoveredIcon === "hash"}>Channel</Tooltip>
							</IconBtn>
						</CPHeaderIcon>
						<CPHeaderTitle>Group 1</CPHeaderTitle>
					</CPHeaderLeft>

					<CPHeaderLeft>
						<IconBtn
							aria-label="notifications"
							onMouseEnter={() => setHoveredIcon("notifications")}
							onMouseLeave={() =>
								setHoveredIcon((h) => (h === "notifications" ? null : h))
							}
							onClick={() => onIconClick("notifications")}
							onKeyDown={(e) => onIconKeyDown(e, "notifications")}
						>
							<Bell />
							<Tooltip visible={hoveredIcon === "notifications"}>
								Notifications
							</Tooltip>
						</IconBtn>

						<IconBtn
							aria-label="spool"
							onMouseEnter={() => setHoveredIcon("spool")}
							onMouseLeave={() =>
								setHoveredIcon((h) => (h === "spool" ? null : h))
							}
							onClick={() => onIconClick("spool")}
							onKeyDown={(e) => onIconKeyDown(e, "spool")}
						>
							<Spool />
							<Tooltip visible={hoveredIcon === "spool"}>Spool</Tooltip>
						</IconBtn>

						<IconBtn
							aria-label="code"
							onMouseEnter={() => setHoveredIcon("code")}
							onMouseLeave={() =>
								setHoveredIcon((h) => (h === "code" ? null : h))
							}
							onClick={() => onIconClick("code")}
							onKeyDown={(e) => onIconKeyDown(e, "code")}
						>
							<SquareCode />
							<Tooltip visible={hoveredIcon === "code"}>Code</Tooltip>
						</IconBtn>

						<IconBtn
							aria-label="users"
							onMouseEnter={() => setHoveredIcon("users")}
							onMouseLeave={() =>
								setHoveredIcon((h) => (h === "users" ? null : h))
							}
							onClick={() => onIconClick("users")}
							onKeyDown={(e) => onIconKeyDown(e, "users")}
						>
							<Users />
							<Tooltip visible={hoveredIcon === "users"}>Members</Tooltip>
						</IconBtn>
					</CPHeaderLeft>
				</CPHeader>

				<CPChatArea
					style={{
						borderBottomRightRadius: compact ? "10px" : "0",
					}}
				>
					<CPMessages>
						<CPDateArea>
							<CPDateDivider />
							<div style={{ width: "max-content" }}>
								<CPDate>
									{new Date().toLocaleDateString(undefined, {
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</CPDate>
							</div>
							<CPDateDivider />
						</CPDateArea>

						<CPAvatarChannel>
							<CPHash>
								<Hash size={50} />
							</CPHash>
							<CPTitle>
								Welcome to <CPChannel>#Rules</CPChannel> !
							</CPTitle>
						</CPAvatarChannel>

						{topLevelMessages.map((m) => {
							const isMe = m.senderId === currentUserId;
							const isHovered = hovered === m.messageId;
							const replies = getReplies(m.messageId);
							const msgReacts = reactions[m.messageId] || {};
							return (
								<div
									key={m.messageId}
									className={`cp-msg-row ${isMe ? "right" : "left"}`}
									onMouseEnter={() => setHovered(m.messageId)}
									onMouseLeave={() =>
										setHovered((h) => (h === m.messageId ? null : h))
									}
								>
									{!isMe && (
										<CPAvatar
											src={
												userMap[m.senderId]?.avatar ||
												`https://ui-avatars.com/api/?name=${encodeURIComponent(userMap[m.senderId]?.name || "U")}`
											}
											alt={userMap[m.senderId]?.name || "User"}
										/>
									)}

									<CPMsgCol>
										<CPBubbleTop>
											{!isMe && (
												<CPAuthorName>
													{userMap[m.senderId]?.name || "Someone"}
												</CPAuthorName>
											)}
											<CPTimeSmall>
												{m.createdAt
													? new Date(m.createdAt).toLocaleTimeString()
													: ""}
											</CPTimeSmall>
										</CPBubbleTop>

										<div className={`cp-bubble ${isMe ? "me" : "them"}`}>
											<CPBubbleContent style={{ whiteSpace: "pre-line" }}>
												{m.content}
												{/* If there are attachments, show a simple list */}
												{m.attachments && m.attachments.length > 0 && (
													<div style={{ marginTop: 8 }}>
														{m.attachments.map((att) => (
															<div
																key={att.attachmentId}
																style={{ fontSize: 13 }}
															>
																📎 {att.filename ?? att.originalFilename} (
																{att.mimeType})
															</div>
														))}
													</div>
												)}
											</CPBubbleContent>

											{Object.keys(msgReacts).length > 0 && (
												<CPReactions>
													{Object.entries(msgReacts).map(([emo, users]) => (
														<CPReactionPill key={emo}>
															<span>{emo}</span>
															<CPReactionCount>{users.length}</CPReactionCount>
														</CPReactionPill>
													))}
												</CPReactions>
											)}

											{isHovered && (
												<CPHoverActions>
													<CPEmojiPicker>
														{emojis.map((e) => (
															<CPEmoji
																key={e}
																onClick={() => handleReact(m.messageId, e)}
																aria-label={`react-${e}`}
															>
																{e}
															</CPEmoji>
														))}
													</CPEmojiPicker>
													<CPRepBtn onClick={() => toggleThread(m.messageId)}>
														Reply
													</CPRepBtn>
												</CPHoverActions>
											)}
										</div>

										<CPThreadPreviewRow>
											{replies.length ? (
												<CPThreadPreview
													onClick={() => toggleThread(m.messageId)}
												>
													<CPThreadIcon>💬</CPThreadIcon>
													<CPThreadText>
														{replies.length} replies — open thread
													</CPThreadText>
												</CPThreadPreview>
											) : null}
										</CPThreadPreviewRow>

										{openThreadFor === m.messageId && (
											<CPThreadExpanded>
												<CPThreadList>
													{replies.map((r) => (
														<div
															key={r.messageId}
															className={`cp-reply-row ${r.senderId === currentUserId ? "cp-reply-me" : "cp-reply-them"}`}
														>
															<CPReplyAuthor>
																{userMap[r.senderId]?.name || "Bạn"}
															</CPReplyAuthor>
															<CPReplyContent
																style={{ whiteSpace: "pre-line" }}
															>
																{r.content}
															</CPReplyContent>
														</div>
													))}
												</CPThreadList>

												<CPThreadComposer>
													<input
														value={replyInputs[m.messageId] || ""}
														onChange={(e) =>
															setReplyInputs((s) => ({
																...s,
																[m.messageId]: e.target.value,
															}))
														}
														placeholder="Write a reply..."
													/>
													<button onClick={() => handleSendReply(m.messageId)}>
														Reply
													</button>
												</CPThreadComposer>
											</CPThreadExpanded>
										)}
									</CPMsgCol>

									{isMe && (
										<div className="cp-avatar-spacer" style={{ width: 40 }} />
									)}
								</div>
							);
						})}
					</CPMessages>

					{/* <CPComposerRoot>
          <CirclePlus size={28}/>

            <CPInput
              placeholder="Enter messages"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <CPComposerActions>
              <CPSendBtn onClick={handleSend}>
                <Send />
              </CPSendBtn>
            </CPComposerActions>
          </CPComposerRoot> */}
					{/* <ComposerWithAdd onSend={handleSend} /> */}
				</CPChatArea>
			</CPContainer>
		</CenterPanelRoot>
	);
}
