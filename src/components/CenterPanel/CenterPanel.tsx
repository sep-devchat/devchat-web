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
    CPComposerActions,
    CPComposerRoot,
    CPCounter,
    CPDate,
    CPEmoji,
    CPEmojiPicker,
    CPHash,
    CPHeader,
    CPHeaderIcon,
    CPHeaderLeft,
    CPHoverActions,
    CPInput,
    CPMessages,
    CPMsgCol,
    CPReactionCount,
    CPReactionPill,
    CPReactions,
    CPRepBtn,
    CPReplyAuthor,
    CPReplyContent,
    CPSendBtn,
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

import { Bell, Hash, Spool, SquareCode, Users } from 'lucide-react';

export type ChatMessage = {
    id: string;
    authorId: string;
    authorName: string;
    avatar?: string;
    time?: string; // ISO string
    content: string;
    sentByMe?: boolean;
    replyCount?: number;
    replies?: ChatMessage[];
    reactions?: Record<string, string[]>; // emoji -> userIds
};

type Props = {
    currentUserId: string;
    setIconSelected?: (icon: string) => void;
    iconSelected?: string;
};

const mockInitial: ChatMessage[] = [
    {
        id: "m1",
        authorId: "u2",
        authorName: "Nguyễn Văn A",
        avatar: "https://i.pravatar.cc/40?img=12",
        time: "2025-08-29T00:05:00Z",
        content:
            "Một chút về rules của chúng mình để giữ tiêu chuẩn cộng đồng nào:\n- Luôn hoà đồng, thân thiện và cùng nhau chia sẻ và giải đáp thắc mắc với nhau.\n- Không chia sẻ những hình ảnh 18+, hình ảnh đen tối (dark meme thì vào channel meme)...",
        replyCount: 2,
        replies: [
            {
                id: "r1",
                authorId: "u3",
                authorName: "Trần B",
                time: "2025-08-29T00:06:00Z",
                content: "Cám ơn bạn đã tóm tắt!",
            },
            {
                id: "r2",
                authorId: "u4",
                authorName: "Lê C",
                time: "2025-08-29T00:07:00Z",
                content: "Mình sẽ tuân thủ!",
            },
        ],
        reactions: { "👍": ["u3"], "❤️": ["u4"] },
    },
    {
        id: "m2",
        authorId: "me",
        authorName: "Bạn",
        avatar: "https://i.pravatar.cc/40?img=32",
        time: "2025-08-29T00:10:00Z",
        content: "Hello mọi người, test message bên phải (của chính mình)",
        sentByMe: true,
        replyCount: 0,
        reactions: {},
    },
];

export default function CenterPanel({ currentUserId, setIconSelected, iconSelected }: Props) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [hovered, setHovered] = useState<string | null>(null);
    const [openThreadFor, setOpenThreadFor] = useState<string | null>(null);
    const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
    const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
    const emojis = ["👍", "❤️", "😂", "🎉", "😮"];
    const compact = iconSelected === "spool" || iconSelected === "code";

    useEffect(() => {
        setMessages(mockInitial);
    }, []);

    const handleSend = async () => {
        if (!input.trim()) return;
        const created: ChatMessage = {
            id: `m${Date.now()}`,
            authorId: currentUserId,
            authorName: "Bạn",
            avatar: `https://i.pravatar.cc/40?u=${currentUserId}`,
            time: new Date().toISOString(),
            content: input.trim(),
            sentByMe: true,
            replyCount: 0,
            reactions: {},
        };
        setMessages((s) => [...s, created]);
        setInput("");
    };

    const toggleThread = (id: string) => {
        setOpenThreadFor((v) => (v === id ? null : id));
    };

    const handleSendReply = async (parentId: string) => {
        const content = replyInputs[parentId]?.trim();
        if (!content) return;
        const created: ChatMessage = {
            id: `r${Date.now()}`,
            authorId: currentUserId,
            authorName: "Bạn",
            time: new Date().toISOString(),
            content,
            sentByMe: true,
        };

        setMessages((prev) =>
            prev.map((m) =>
                m.id === parentId
                    ? {
                        ...m,
                        replies: [...(m.replies || []), created],
                        replyCount: (m.replyCount || 0) + 1,
                    }
                    : m
            )
        );
        setReplyInputs((r) => ({ ...r, [parentId]: "" }));
        setOpenThreadFor(parentId); // keep opened
    };

    const handleReact = (messageId: string, emoji: string) => {
        setMessages((prev) =>
            prev.map((m) => {
                if (m.id !== messageId) return m;
                const copy = { ...(m.reactions || {}) } as Record<string, string[]>;
                const users = new Set(copy[emoji] || []);
                if (users.has(currentUserId)) {
                    users.delete(currentUserId);
                } else {
                    users.add(currentUserId);
                }
                copy[emoji] = Array.from(users);
                return { ...m, reactions: copy } as ChatMessage;
            })
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

    const renderedMessages = useMemo(() => messages || [], [messages]);

    return (
        <CenterPanelRoot
        >
            <CPHeader
                style={{
                    borderTopRightRadius: compact ? "10px" : "0",
                }}
            >
                <CPHeaderLeft>
                    <CPHeaderIcon>
                        {/* Hash left icon also with tooltip/click */}
                        <IconBtn
                            aria-label="channel-hash"
                            onMouseEnter={() => setHoveredIcon("hash")}
                            onMouseLeave={() => setHoveredIcon((h) => (h === "hash" ? null : h))}
                            onClick={() => onIconClick("hash")}
                            onKeyDown={(e) => onIconKeyDown(e, "hash")}
                            title="Channel"
                        >
                            <Hash />
                            <Tooltip visible={hoveredIcon === "hash"}>Channel</Tooltip>
                        </IconBtn>
                    </CPHeaderIcon>
                    <CPTitle>
                        Welcome to <CPChannel>#Rules</CPChannel> !
                    </CPTitle>
                </CPHeaderLeft>

                <CPHeaderLeft>
                    {/* Bell */}
                    <IconBtn
                        aria-label="notifications"
                        onMouseEnter={() => setHoveredIcon("notifications")}
                        onMouseLeave={() => setHoveredIcon((h) => (h === "notifications" ? null : h))}
                        onClick={() => onIconClick("notifications")}
                        onKeyDown={(e) => onIconKeyDown(e, "notifications")}
                    >
                        <Bell />
                        <Tooltip visible={hoveredIcon === "notifications"}>Notifications</Tooltip>
                    </IconBtn>

                    {/* Spool */}
                    <IconBtn
                        aria-label="spool"
                        onMouseEnter={() => setHoveredIcon("spool")}
                        onMouseLeave={() => setHoveredIcon((h) => (h === "spool" ? null : h))}
                        onClick={() => onIconClick("spool")}
                        onKeyDown={(e) => onIconKeyDown(e, "spool")}
                    >
                        <Spool />
                        <Tooltip visible={hoveredIcon === "spool"}>Spool</Tooltip>
                    </IconBtn>

                    {/* SquareCode -> "code" */}
                    <IconBtn
                        aria-label="code"
                        onMouseEnter={() => setHoveredIcon("code")}
                        onMouseLeave={() => setHoveredIcon((h) => (h === "code" ? null : h))}
                        onClick={() => onIconClick("code")}
                        onKeyDown={(e) => onIconKeyDown(e, "code")}
                    >
                        <SquareCode />
                        <Tooltip visible={hoveredIcon === "code"}>Code</Tooltip>
                    </IconBtn>

                    {/* Users */}
                    <IconBtn
                        aria-label="users"
                        onMouseEnter={() => setHoveredIcon("users")}
                        onMouseLeave={() => setHoveredIcon((h) => (h === "users" ? null : h))}
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
                    <CPDate>{new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</CPDate>

                    <CPAvatarChannel>
                        <CPHash>#</CPHash>
                        <CPTitle>
                            Welcome to <CPChannel>#Rules</CPChannel> !
                        </CPTitle>
                    </CPAvatarChannel>

                    {renderedMessages.map((m) => {
                        const isMe = m.sentByMe || m.authorId === currentUserId;
                        const isHovered = hovered === m.id;
                        return (
                            <div
                                key={m.id}
                                className={`cp-msg-row ${isMe ? "right" : "left"}`}
                                onMouseEnter={() => setHovered(m.id)}
                                onMouseLeave={() => setHovered((h) => (h === m.id ? null : h))}
                            >
                                {!isMe && (
                                    <CPAvatar
                                        src={m.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.authorName)}`}
                                        alt={m.authorName}
                                    />
                                )}

                                <CPMsgCol>
                                    <div className={`cp-bubble ${isMe ? "me" : "them"}`}>
                                        <CPBubbleTop>
                                            {!isMe && <CPAuthorName>{m.authorName}</CPAuthorName>}
                                            <CPTimeSmall>{m.time ? new Date(m.time).toLocaleTimeString() : ""}</CPTimeSmall>
                                        </CPBubbleTop>

                                        <CPBubbleContent style={{ whiteSpace: "pre-line" }}>{m.content}</CPBubbleContent>

                                        {m.reactions && Object.keys(m.reactions).length > 0 && (
                                            <CPReactions>
                                                {Object.entries(m.reactions).map(([emo, users]) => (
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
                                                        <CPEmoji key={e} onClick={() => handleReact(m.id, e)} aria-label={`react-${e}`}>
                                                            {e}
                                                        </CPEmoji>
                                                    ))}
                                                </CPEmojiPicker>
                                                <CPRepBtn onClick={() => toggleThread(m.id)}>Reply</CPRepBtn>
                                            </CPHoverActions>
                                        )}
                                    </div>

                                    <CPThreadPreviewRow>
                                        {m.replyCount ? (
                                            <CPThreadPreview onClick={() => toggleThread(m.id)}>
                                                <CPThreadIcon>💬</CPThreadIcon>
                                                <CPThreadText>{m.replyCount} replies — open thread</CPThreadText>
                                            </CPThreadPreview>
                                        ) : null}
                                    </CPThreadPreviewRow>

                                    {openThreadFor === m.id && (
                                        <CPThreadExpanded>
                                            <CPThreadList>
                                                {(m.replies || []).map((r) => (
                                                    <div
                                                        key={r.id}
                                                        className={`cp-reply-row ${r.authorId === currentUserId ? "cp-reply-me" : "cp-reply-them"}`}
                                                    >
                                                        <CPReplyAuthor>{r.authorName || "Bạn"}</CPReplyAuthor>
                                                        <CPReplyContent style={{ whiteSpace: "pre-line" }}>{r.content}</CPReplyContent>
                                                    </div>
                                                ))}
                                            </CPThreadList>

                                            <CPThreadComposer>
                                                <input
                                                    value={replyInputs[m.id] || ""}
                                                    onChange={(e) => setReplyInputs((s) => ({ ...s, [m.id]: e.target.value }))}
                                                    placeholder="Write a reply..."
                                                />
                                                <button onClick={() => handleSendReply(m.id)}>Reply</button>
                                            </CPThreadComposer>
                                        </CPThreadExpanded>
                                    )}
                                </CPMsgCol>

                                {isMe && <div className="cp-avatar-spacer" style={{ width: 40 }} />}
                            </div>
                        );
                    })}
                </CPMessages>

                <CPComposerRoot>
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
                        <CPCounter>{input.length}/2000</CPCounter>
                        <CPSendBtn onClick={handleSend}>Send</CPSendBtn>
                    </CPComposerActions>
                </CPComposerRoot>
            </CPChatArea>
        </CenterPanelRoot>
    );
}
