import React from "react";
import { CornerUpLeft } from "lucide-react";
import MarkdownPreview from "@/components/custom/MarkdownPreview";
import MessageActions from "@/components/custom/MessageActions/MessageActions";
import { getReplyPreviewText, truncatePreview } from "@/utils/replyPreview";
import type { MessageResponse } from "@/services/messageAPI";
import { ThreadMessagesProps } from "../types";
import {
	Message,
	Avatar,
	MessageContent,
	MessageHeader,
	AuthorName,
	MessageTime,
	DividerWrapper,
	Line,
	DateText,
} from "../ThreadPanel.styled";

const ThreadMessages: React.FC<ThreadMessagesProps> = ({
	groupedMessages,
	messageMap,
	actionMenuFor,
	setActionMenuFor,
	reactionPickerFor,
	setReactionPickerFor,
	handleGoToMessage,
	handleCopyMessage,
	handleEditMessage,
	handleReplyMessage,
	handleReportMessage,
	handleDeleteMessage,
	handleReact,
	handleCreateThreadFromThreadView,
	messagesContainerRef,
	onMessagesScroll,
	bottomRef,
	threadId,
}) => {
	const getSenderLabel = (sender?: MessageResponse["sender"] | null) => {
		if (!sender) return "Original message";
		const fullName = [sender.firstName, sender.lastName]
			.filter(Boolean)
			.join(" ");
		return (
			fullName || sender.username || (sender as any)?.name || "Original message"
		);
	};

	return (
		<div
			ref={messagesContainerRef}
			onScroll={onMessagesScroll}
			className="flex flex-col gap-6 overflow-y-auto behave-scroll px-5"
		>
			{groupedMessages.map(([date, dateMessages]) => (
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
						const markdownPreviewClassName = msg.isCurrentUser
							? "prose-invert text-black text-sm"
							: "text-sm text-slate-900";
						const rowWrapperClass = msg.isCurrentUser
							? "flex items-start justify-start gap-2 flex-row-reverse"
							: "flex items-start justify-start gap-2";
						const actionMessage = messageMap.get(msg.id);
						const shouldShowActions = !!actionMessage && !msg.optimistic;
						const messageWrapperClass = ["group", messageClassName]
							.filter(Boolean)
							.join(" ");

						const parentMessage: MessageResponse | null =
							actionMessage?.parentMessage ?? null;
						const parentMessageId = actionMessage?.parentMessageId;
						const parentPreviewText = parentMessage
							? truncatePreview(getReplyPreviewText(parentMessage))
							: "View original message";

						return (
							<Message
								key={msg.id}
								id={`thread-message-${msg.id}`}
								className={messageWrapperClass}
							>
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
											className={msg.isCurrentUser ? "text-white" : undefined}
										>
											{authorLabel}
										</AuthorName>
										<MessageTime className="text-[11px] opacity-70">
											{msg.time}
										</MessageTime>
									</MessageHeader>
									<div className={rowWrapperClass}>
										<div className={bubbleClasses}>
											{parentMessageId && (
												<button
													type="button"
													className="group/parent mb-2 w-full max-w-[320px] text-left focus:outline-none"
													onClick={() => handleGoToMessage(parentMessageId)}
												>
													<div className="flex items-start gap-2 rounded-md bg-muted/40 px-2 py-1 ring-1 ring-border/40 transition-colors hover:bg-muted/60 hover:ring-border">
														<div className="mt-0.5 text-muted-foreground transition-colors group-hover/parent:text-primary">
															<CornerUpLeft size={14} />
														</div>
														<div className="flex flex-col text-xs leading-snug">
															<span className="font-medium text-muted-foreground/80 transition-colors group-hover/parent:text-primary/80">
																{getSenderLabel(parentMessage?.sender ?? null)}
															</span>
															<span className="truncate text-muted-foreground/70 transition-colors group-hover/parent:text-muted-foreground/90">
																{parentPreviewText}
															</span>
														</div>
													</div>
												</button>
											)}
											<MarkdownPreview
												content={msg.content}
												className={markdownPreviewClassName}
											/>
										</div>
										{shouldShowActions && actionMessage && (
											<MessageActions
												m={actionMessage}
												hoveredMessageId={
													actionMenuFor === `menu-${actionMessage.id}`
														? actionMenuFor
														: null
												}
												setHoveredMessageId={setActionMenuFor}
												handleEdit={handleEditMessage}
												handleCopy={handleCopyMessage}
												handleReport={handleReportMessage}
												handleDelete={handleDeleteMessage}
												handleReply={handleReplyMessage}
												reactionPickerFor={
													reactionPickerFor === actionMessage.id
														? actionMessage.id
														: null
												}
												setReactionPickerFor={setReactionPickerFor}
												handleReact={handleReact}
												isCurrentUser={!!msg.isCurrentUser}
												handleCreateThread={handleCreateThreadFromThreadView}
												existingThreadId={threadId || null}
												showThreadAction={false}
											/>
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
	);
};

export default ThreadMessages;
