import React, { useState } from "react";
import { MessageResponse } from "@/services/messageAPI";
import { MessageItem, MessageBubbleStyle } from "../ChatArea.styled";
import MarkdownPreview from "../../MarkdownPreview";
import MessageActions from "../../MessageActions/MessageActions";

export type MessageRowProps = {
	m: MessageResponse;
	name: string;
	initials: string;
	isCurrentUser: boolean;
	positionClassName: string;
	showAvatarAndHeader: boolean;
	handleEdit: (m: MessageResponse) => void;
	handleCopy: (m: MessageResponse) => void;
	handleReport: (m: MessageResponse) => void;
	handleDelete: (m: MessageResponse) => void;
	handleReply: (m: MessageResponse) => void;
	handleReact: (messageId: string, reaction: string) => void;
	reactionPickerFor: string | null;
	setReactionPickerFor: (v: string | null) => void;
	formatMessageTime: (d: any) => string;
};

const MarkdownPreviewMemo = React.memo(MarkdownPreview);

export const MessageRow: React.FC<MessageRowProps> = React.memo(
	({
		m,
		name,
		initials,
		isCurrentUser,
		positionClassName,
		showAvatarAndHeader,
		handleEdit,
		handleCopy,
		handleReport,
		handleDelete,
		handleReply,
		handleReact,
		reactionPickerFor,
		setReactionPickerFor,
		formatMessageTime,
	}) => {
		const [hovered, setHovered] = useState(false);

		return (
			<div
				className="group relative w-full"
				onMouseEnter={() => setHovered(true)}
				onMouseLeave={() => setHovered(false)}
			>
				<MessageItem className={`flex items-start gap-2 ${positionClassName}`}>
					{showAvatarAndHeader ? (
						m.sender?.avatarUrl ? (
							<img
								src={m.sender.avatarUrl}
								alt={name}
								className="h-8 w-8 rounded-full"
							/>
						) : (
							<div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium select-none">
								{initials || (name[0] ?? "?")}
							</div>
						)
					) : (
						<div className="h-8 w-8" />
					)}

					<div
						className={`flex flex-col max-w-[80%]  ${isCurrentUser ? "items-end" : ""}`}
					>
						{showAvatarAndHeader && (
							<div
								className={`flex gap-4 items-center text-xs text-muted-foreground mb-1 ${isCurrentUser ? "flex-row-reverse" : ""}`}
							>
								<span className="font-bold text-sm">{name}</span>
								<span>{formatMessageTime(m.createdAt)}</span>
							</div>
						)}
						<div
							className={`flex w-full items-end gap-2 ${isCurrentUser ? "flex-row-reverse" : ""}`}
						>
							<MessageBubbleStyle
								className={`message-bubble w-fit rounded-lg px-3 py-2 text-sm shadow-none ${isCurrentUser ? "me" : "other"} ${(m as any).pending ? "opacity-50" : ""}`}
								style={{ whiteSpace: "pre-wrap" }}
							>
								<MarkdownPreviewMemo content={m.content || ""} />
							</MessageBubbleStyle>

							<div className="flex items-end">
								<MessageActions
									m={m}
									hoveredMessageId={hovered ? m.id : null}
									setHoveredMessageId={(v) => setHovered(v === m.id)}
									handleEdit={handleEdit}
									handleCopy={handleCopy}
									handleReport={handleReport}
									handleDelete={handleDelete}
									handleReply={handleReply}
									reactionPickerFor={reactionPickerFor === m.id ? m.id : null}
									setReactionPickerFor={setReactionPickerFor}
									handleReact={handleReact}
								/>
							</div>
						</div>
					</div>
				</MessageItem>
			</div>
		);
	},
);

MessageRow.displayName = "MessageRow";
