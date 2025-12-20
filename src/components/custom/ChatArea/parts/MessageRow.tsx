import React, { useState } from "react";
import { CornerUpLeft, FileText, Image as ImageIcon } from "lucide-react";
import { MessageResponse } from "@/services/messageAPI";
import { getReplyPreviewText, truncatePreview } from "@/utils/replyPreview";
import { MessageItem, MessageBubbleStyle } from "../ChatArea.styled";
import MarkdownPreview from "../../MarkdownPreview";
import MessageActions from "../../MessageActions/MessageActions";
import { Progress } from "@/components/ui/progress";
import type { UploadPreview } from "@/components/custom/ChatInputComponent/ChatTypeModal/InboxType";

const MarkdownPreviewMemo = React.memo(MarkdownPreview);

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
	handleGoToMessage?: (id: string) => void;
	handleCreateThread: (m: MessageResponse) => void;
	existingThreadId: string | null;
	codeBlockId?: string;
	channelId: string;
	groupId: string;
	directUserId?: string;
	isThreadMode: boolean;
};

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
		codeBlockId,
		channelId,
		groupId,
		directUserId,
		isThreadMode,
	}) => {
		const [hovered, setHovered] = useState(false);
		const [windowWidth, setWindowWidth] = React.useState(
			typeof window !== "undefined" ? window.innerWidth : 1440,
		);

		React.useEffect(() => {
			const handleResize = () => setWindowWidth(window.innerWidth);
			window.addEventListener("resize", handleResize);
			return () => window.removeEventListener("resize", handleResize);
		}, []);

		const getResponsiveSize = (base: number) => {
			if (windowWidth <= 1220) return base * 0.7;
			if (windowWidth >= 1920) return base * 1.1;
			if (windowWidth >= 1440) return base * 0.8;
			return base;
		};

		const getResponsiveFontSize = () => {
			if (windowWidth <= 1220) return "11px";
			if (windowWidth >= 1920) return "14px";
			if (windowWidth >= 1440) return "12px";
			return "14px";
		};

		const parentPreviewText = truncatePreview(
			getReplyPreviewText(m.parentMessage ?? null),
		);
		const previewUploads = ((m as any).previewUploads ?? []) as UploadPreview[];

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
								style={{
									width: `${getResponsiveSize(32)}px`, // 32px = 8 * 4
									height: `${getResponsiveSize(32)}px`,
								}}
								className="rounded-full"
							/>
						) : (
							<div
								style={{
									width: `${getResponsiveSize(32)}px`,
									height: `${getResponsiveSize(32)}px`,
									fontSize: getResponsiveFontSize(),
								}}
								className="rounded-full bg-muted flex items-center justify-center font-medium select-none"
							>
								{initials || (name[0] ?? "?")}
							</div>
						)
					) : (
						<div
							style={{
								width: `${getResponsiveSize(32)}px`,
								height: `${getResponsiveSize(32)}px`,
							}}
						/>
					)}

					<div
						className={`flex flex-col max-w-[80%]  ${isCurrentUser ? "items-end" : ""}`}
					>
						{showAvatarAndHeader && (
							<div
								className={`flex items-center mb-1 ${isCurrentUser ? "flex-row-reverse" : ""}`}
								style={{
									gap: `${getResponsiveSize(16)}px`, // 16px = gap-4
									fontSize: getResponsiveFontSize(),
									marginBottom: `${getResponsiveSize(4)}px`,
								}}
							>
								<span
									className="font-bold"
									style={{
										fontSize:
											windowWidth <= 1220
												? "12px"
												: windowWidth >= 1920
													? "16px"
													: windowWidth >= 1440
														? "13px"
														: "14px",
									}}
								>
									{name}
								</span>
								<span>{formatMessageTime(m.createdAt)}</span>
							</div>
						)}
						<div
							className={`flex w-full items-end ${isCurrentUser ? "flex-row-reverse" : ""}`}
							style={{
								gap: `${getResponsiveSize(8)}px`,
							}}
						>
							<MessageBubbleStyle
								className={`message-bubble relative w-fit rounded-lg shadow-none ${isCurrentUser ? "me" : "other"} ${(m as any).pending ? "opacity-50" : ""}`}
								style={{
									whiteSpace: "pre-wrap",
									padding: `${getResponsiveSize(8)}px ${getResponsiveSize(12)}px`,
									fontSize: getResponsiveFontSize(),
								}}
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
										className={`group/parent w-full text-left focus:outline-none`}
										style={{
											marginBottom: `${getResponsiveSize(8)}px`,
											maxWidth: `${getResponsiveSize(320)}px`,
										}}
									>
										<div
											className="flex items-start rounded-md bg-muted/40 hover:bg-muted/60 transition-colors ring-1 ring-border/40 hover:ring-border"
											style={{
												gap: `${getResponsiveSize(8)}px`,
												padding: `${getResponsiveSize(4)}px ${getResponsiveSize(8)}px`,
											}}
										>
											<div
												className="text-muted-foreground group-hover/parent:text-primary transition-colors"
												style={{
													marginTop: `${getResponsiveSize(2)}px`,
												}}
											>
												<CornerUpLeft size={getResponsiveSize(14)} />
											</div>
											<div
												className="flex flex-col leading-snug"
												style={{
													fontSize: getResponsiveFontSize(),
												}}
											>
												<span className="font-medium text-muted-foreground/80 group-hover/parent:text-primary/80">
													{(m.parentMessage?.sender as any)?.name ||
														(m.parentMessage?.sender as any)?.username ||
														"Original message"}
												</span>
												<span className="text-muted-foreground/70 group-hover/parent:text-muted-foreground/90 truncate">
													{parentPreviewText}
												</span>
											</div>
										</div>
									</button>
								)}

								<MarkdownPreviewMemo
									content={m.content || ""}
									codeBlockId={codeBlockId}
									channelId={channelId}
									groupId={groupId}
									directUserId={directUserId}
									codeBlockUpdatedAt={m.updatedAt}
								/>

								{previewUploads.length > 0 && (
									<div className="mt-3 flex w-full min-w-[220px] max-w-[320px] flex-col gap-2">
										{previewUploads.map((upload) => {
											const isImage = upload.type?.startsWith("image/");
											const FileIcon = isImage ? ImageIcon : FileText;

											return (
												<div
													key={upload.id}
													className="rounded-md border border-border/60 bg-background/80 p-2"
												>
													<div className="flex items-center gap-2">
														<FileIcon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
														<div className="flex min-w-0 flex-1 flex-col">
															<div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
																<span className="truncate" title={upload.name}>
																	{upload.name}
																</span>
																<span className="ml-2 flex-shrink-0">
																	{Math.round(upload.progress ?? 0)}%
																</span>
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
													</div>
												</div>
											);
										})}
									</div>
								)}

								{existingThreadId && !isThreadMode && (
									<button
										onClick={(e) => {
											e.stopPropagation();
											handleCreateThread(m);
										}}
										className="inline-flex items-center rounded-full bg-primary/15 font-medium text-primary hover:bg-primary/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
										style={{
											marginTop: `${getResponsiveSize(8)}px`,
											gap: `${getResponsiveSize(4)}px`,
											padding: `${getResponsiveSize(2)}px ${getResponsiveSize(8)}px`,
											fontSize:
												windowWidth <= 1220
													? "10px"
													: windowWidth >= 1920
														? "12px"
														: windowWidth >= 1440
															? "11px"
															: "11px",
										}}
										type="button"
										aria-label="Open thread"
									>
										<span
											className="inline-block rounded-full bg-primary animate-pulse"
											style={{
												width: `${getResponsiveSize(6)}px`,
												height: `${getResponsiveSize(6)}px`,
											}}
										/>
										Thread
										<span style={{ fontSize: getResponsiveFontSize() }}>
											↗
										</span>
									</button>
								)}
								<span
									className="absolute tracking-wide text-muted-foreground/70 opacity-0 group-hover/bubble:opacity-100 transition-opacity"
									style={{
										bottom: `${getResponsiveSize(-16)}px`,
										left: `${getResponsiveSize(8)}px`,
										fontSize:
											windowWidth <= 1220
												? "9px"
												: windowWidth >= 1920
													? "11px"
													: windowWidth >= 1440
														? "10px"
														: "10px",
									}}
								>
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
									directUserId={directUserId}
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
