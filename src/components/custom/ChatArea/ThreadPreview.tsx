/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { MessageResponse } from "@/services/messageAPI";
import { formatMessageTime } from "./ChatArea.helpers";

type Props = {
	threadId: string;
	threadMeta: any;
	latestMessage: MessageResponse;
	onOpenThread?: (threadId: string) => void;
};

const ThreadPreview: React.FC<Props> = ({
	threadId,
	threadMeta,
	latestMessage,
	onOpenThread,
}) => {
	const creatorName = threadMeta?.createdBy ?? "Unknown";
	const threadTitle = threadMeta?.name || `Thread ${threadId.slice(0, 8)}`;

	const shortPreview = (text?: string) => {
		if (!text) return "[Attachment]";
		if (/!\[.*?\]\(https?:\/\/[^\s)]+\)/.test(text.trim())) return "[Image]";
		const singleLine = text.replace(/\s+/g, " ").trim();
		return singleLine.length > 120
			? singleLine.slice(0, 117) + "…"
			: singleLine;
	};

	const handleOpen = () => onOpenThread?.(threadId);

	return (
		<div className="mb-3">
			<div
				className="mb-2 text-xs text-muted-foreground flex items-center gap-2"
				style={{ color: "rgba(17,24,39,0.6)" }}
			>
				<span
					className="font-medium text-sm"
					style={{ color: "rgba(17,24,39,0.85)" }}
				>
					{creatorName}
				</span>
				<span>started a thread:</span>
				<button
					onClick={handleOpen}
					className="text-sm font-semibold text-sky-600 hover:underline"
					aria-label={`Open thread ${threadTitle}`}
					style={{ background: "transparent", border: "none", padding: 0 }}
				>
					{threadTitle}
				</button>
				<span className="ml-auto text-xs text-muted-foreground">
					{formatMessageTime(latestMessage.createdAt)}
				</span>
			</div>

			<div
				role="button"
				onClick={handleOpen}
				className="rounded-lg border border-slate-200 bg-[#F1F4F9] p-3 cursor-pointer hover:shadow-sm transition-shadow"
				style={{ boxShadow: "inset 0 0 0 1px rgba(59,130,246,0.03)" }}
			>
				<div className="flex items-start justify-between gap-3">
					<div className="flex items-start gap-3">
						<div className="min-w-0">
							<div className="flex items-center gap-2">
								<div className="text-sm font-semibold text-slate-800 truncate">
									{threadTitle}
								</div>
							</div>
							<div className="mt-1 text-sm text-slate-600 flex items-start gap-2 min-w-0">
								<div className="flex-shrink-0 h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center text-[11px] text-slate-700">
									{latestMessage.sender?.firstName?.[0] ??
										latestMessage.sender?.username?.[0] ??
										"U"}
								</div>
								<div className="min-w-0">
									<div className="text-[13px] text-slate-700">
										<span className="font-medium mr-1">{`${latestMessage.sender?.firstName || latestMessage.sender?.username || "Unknown"}:`}</span>
										<span className="text-slate-600">
											{shortPreview(latestMessage.content)}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ThreadPreview;
