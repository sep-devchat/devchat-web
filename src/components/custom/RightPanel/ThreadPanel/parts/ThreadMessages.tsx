import React from "react";
import { CornerUpLeft } from "lucide-react";
import MarkdownPreview from "@/components/custom/MarkdownPreview";
import MessageActions from "@/components/custom/MessageActions/MessageActions";
import { getReplyPreviewText, truncatePreview } from "@/utils/replyPreview";
import type { ThreadMessageResponse } from "@/services/messageAPI";
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
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import type { UploadPreview } from "@/components/custom/ChatInputComponent/ChatTypeModal/InboxType";

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
	hasMoreMessages,
	isFetchingOlderMessages,
	threadId,
}) => {
	const getSenderLabel = (sender?: ThreadMessageResponse["sender"] | null) => {
		if (!sender) return "Original message";
		const fullName = [sender.firstName, sender.lastName]
			.filter(Boolean)
			.join(" ");
		return (
			fullName || sender.username || (sender as any)?.name || "Original message"
		);
	};

	let previousSenderId: string | null = null;

	const renderHistoryNotice = () => {
		if (!groupedMessages.length) return null;
		if (isFetchingOlderMessages) {
			return (
				<div className="flex justify-center py-2 text-xs text-muted-foreground">
					Loading earlier messages...
				</div>
			);
		}
		if (hasMoreMessages) {
			return (
				<div className="flex justify-center py-2 text-[11px] uppercase tracking-wide text-muted-foreground opacity-80">
					Scroll up for earlier messages
				</div>
			);
		}
		return (
			<div className="flex justify-center py-2 text-[11px] uppercase tracking-wide text-muted-foreground opacity-70">
				You're all caught up
			</div>
		);
	};

	return (
		<div
			ref={messagesContainerRef}
			onScroll={onMessagesScroll}
			className="flex flex-col gap-6 overflow-y-auto behave-scroll px-5"
		>
			{renderHistoryNotice()}
			{groupedMessages.map(([date, dateMessages]) => (
				<div key={date}>
					<DividerWrapper>
						<Line />
						<DateText>{date}</DateText>
						<Line />
					</DividerWrapper>

					{dateMessages.map((msg) => {
						const authorLabel = msg.isCurrentUser ? "You" : msg.author;
						const uploadPreviews = (msg.uploadPreviews ??
							[]) as UploadPreview[];
						const headerClassName = msg.isCurrentUser
							? "flex-row-reverse gap-1.5"
							: "";
						const bubbleClasses = msg.isCurrentUser
							? "max-w-[78%] items-center rounded-2xl bg-[#D2E0F9] px-3 py-2 flex self-end flex-col items-start"
							: "max-w-[78%] flex self-start flex-col rounded-2xl bg-[#eff2f5] px-3 py-2 text-[#111111]";
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
							? "flex items-center justify-start gap-2 flex-row-reverse"
							: "flex items-center justify-start gap-2";
						const actionMessage = messageMap.get(msg.id);
						const shouldShowActions = !!actionMessage && !msg.optimistic;
						const messageWrapperClass = ["group", messageClassName]
							.filter(Boolean)
							.join(" ");

						const parentMessage: ThreadMessageResponse | null =
							actionMessage?.parentMessage ?? null;
						const parentMessageId = actionMessage?.parentMessageId;
						const parentPreviewText = parentMessage
							? truncatePreview(getReplyPreviewText(parentMessage))
							: "View original message";

						const currentSenderId = actionMessage?.sender?.id ?? null;
						const isSameSenderAsPrevious = Boolean(
							previousSenderId &&
								currentSenderId &&
								previousSenderId === currentSenderId,
						);
						const showAvatar = !isSameSenderAsPrevious;
						const showAuthorMeta = !isSameSenderAsPrevious;
						const showTimestamp = !isSameSenderAsPrevious;
						const timestampClass = showTimestamp
							? "text-[11px] opacity-70"
							: "text-[11px] opacity-0 group-hover:opacity-70 transition-opacity duration-150";

						const renderedMessage = (
							<Message
								key={msg.id}
								id={`thread-message-${msg.id}`}
								className={cn(
									messageWrapperClass,
									isSameSenderAsPrevious &&
										msg.isCurrentUser &&
										"flex-row-reverse",
								)}
							>
								{showAvatar ? (
									<Avatar className={avatarClassName}>
										<img
											src={msg.avatarUrl}
											alt={authorLabel}
											className="h-full w-full rounded-full object-cover"
										/>
									</Avatar>
								) : (
									<div className="w-8 h-8 shrink-0" aria-hidden="true" />
								)}
								<MessageContent
									className={
										msg.isCurrentUser
											? "flex flex-col align-end gap-1.5"
											: "flex flex-col gap-1.5"
									}
								>
									<MessageHeader className={headerClassName}>
										{showAuthorMeta && (
											<AuthorName
												className={msg.isCurrentUser ? "text-white" : undefined}
											>
												{authorLabel}
											</AuthorName>
										)}
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
											{uploadPreviews.length > 0 && (
												<div className="mt-3 flex w-full min-w-[200px] max-w-[320px] flex-col gap-2">
													{uploadPreviews.map((upload) => (
														<div
															key={upload.id}
															className="rounded-md border border-border/60 bg-background/80 p-2"
														>
															<div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
																<span className="truncate" title={upload.name}>
																	{upload.name}
																</span>
																<span>{Math.round(upload.progress ?? 0)}%</span>
															</div>
															<Progress
																value={upload.progress ?? 0}
																className="mt-1"
															/>
															<p className="mt-1 text-[11px] text-muted-foreground">
																{upload.status === "error"
																	? "Upload failed"
																	: upload.status === "uploaded"
																		? "Uploaded"
																		: "Uploading..."}
															</p>
														</div>
													))}
												</div>
											)}
										</div>
										<MessageTime className={timestampClass}>
											{msg.time}
										</MessageTime>
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

						previousSenderId = currentSenderId ?? null;
						return renderedMessage;
					})}
				</div>
			))}

			<div ref={bottomRef} />
		</div>
	);
};

export default ThreadMessages;
