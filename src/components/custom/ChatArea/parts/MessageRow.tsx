import React, { useState } from "react";
import { CornerUpLeft } from "lucide-react";
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
	handleGoToMessage?: (id: string) => void; // optional navigation to parent
	handleCreateThread: (m: MessageResponse) => void;
	existingThreadId: string | null;
};

const MarkdownPreviewMemo = React.memo(MarkdownPreview);

const truncate = (s: string, n: number) =>
	s.length > n ? s.slice(0, n) + "…" : s;

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
		handleGoToMessage,
		handleCreateThread,
		existingThreadId,
	}) => {
		const [hovered, setHovered] = useState(false);

		return (
			<div
				id={`message-${m.id}`}
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
								className={`message-bubble relative w-fit rounded-lg px-3 py-2 text-sm shadow-none ${isCurrentUser ? "me" : "other"} ${(m as any).pending ? "opacity-50" : ""}`}
								style={{ whiteSpace: "pre-wrap" }}
							>
								{m.parentMessageId && (
									<button
										type="button"
										aria-label="Go to parent message"
										onClick={() =>
											m.parentMessageId &&
											typeof handleGoToMessage === "function" &&
											handleGoToMessage(m.parentMessageId)
										}
										className={`group/parent mb-2 w-full max-w-[320px] text-left focus:outline-none`}
									>
										<div className="flex items-start gap-2 rounded-md bg-muted/40 hover:bg-muted/60 transition-colors ring-1 ring-border/40 hover:ring-border px-2 py-1">
											<div className="mt-0.5 text-muted-foreground group-hover/parent:text-primary transition-colors">
												<CornerUpLeft size={14} />
											</div>
											<div className="flex flex-col text-xs leading-snug">
												<span className="font-medium text-muted-foreground/80 group-hover/parent:text-primary/80">
													{(m.parentMessage?.sender as any)?.name ||
														(m.parentMessage?.sender as any)?.username ||
														"Original message"}
												</span>
												<span className="text-muted-foreground/70 group-hover/parent:text-muted-foreground/90 truncate">
													{truncate(
														m.parentMessage?.content || "(no longer available)",
														80,
													)}
												</span>
											</div>
										</div>
									</button>
								)}
								<MarkdownPreviewMemo content={m.content || ""} />

								{existingThreadId && !m.thread?.id && (
									<button
										onClick={(e) => {
											e.stopPropagation();
											handleCreateThread(m);
										}}
										className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-medium text-primary hover:bg-primary/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
										type="button"
										aria-label="Open thread"
									>
										<span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
										Thread
										<span className="text-xs">↗</span>
									</button>
								)}
								<span className="absolute -bottom-4 left-2 text-[10px] tracking-wide text-muted-foreground/70 opacity-0 group-hover/bubble:opacity-100 transition-opacity">
									{formatMessageTime(m.createdAt)}
								</span>
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
									isCurrentUser={isCurrentUser}
									handleCreateThread={handleCreateThread}
									existingThreadId={existingThreadId}
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
