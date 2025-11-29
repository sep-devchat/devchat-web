/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "@tanstack/react-router";
import React from "react";

type MessageResponseMinimal = {
	id: string;
	content?: string | null;
	createdAt: string;
	sender?: any;
};

type ThreadMeta = {
	id?: string;
	name?: string;
	description?: string;
	createdBy?: any;
};

function formatMessageTime(input: string | Date): string {
	const d = input instanceof Date ? input : new Date(input);
	if (isNaN(d.getTime())) return "";

	const now = new Date();
	const padLocal = (n: number) => n.toString().padStart(2, "0");
	const sameYMD = (a: Date, b: Date) =>
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate();

	const yesterday = new Date(now);
	yesterday.setDate(now.getDate() - 1);

	const hhmm = `${padLocal(d.getHours())}:${padLocal(d.getMinutes())}`;
	if (sameYMD(d, now)) return `Today ${hhmm}`;
	if (sameYMD(d, yesterday)) return `Yesterday ${hhmm}`;
	return `${padLocal(d.getDate())}/${padLocal(d.getMonth() + 1)} ${hhmm}`;
}

export const ThreadPreview: React.FC<{
	threadId: string;
	threadMeta: ThreadMeta | null;
	latestMessage: MessageResponseMinimal;
	groupId: string | undefined | null;
	channelIdParam: string | undefined | null;
}> = ({ threadId, threadMeta, latestMessage, groupId, channelIdParam }) => {
	const navigate = useNavigate();

	const creatorName =
		(threadMeta?.createdBy &&
			`${threadMeta.createdBy.firstName || ""} ${threadMeta.createdBy.lastName || ""}`) ||
		(latestMessage.sender &&
			`${latestMessage.sender.firstName || ""} ${latestMessage.sender.lastName || ""}`) ||
		"Unknown";

	const threadTitle = threadMeta?.name || `Thread ${threadId.slice(0, 8)}`;

	const onOpenThread = () => {
		navigate({
			to: `/chat/group/${groupId}`,
			search: () => ({
				...(channelIdParam ? { channel: channelIdParam } : {}),
				thread: threadId,
			}),
		});
	};

	return (
		<div
			className="mb-3 rounded-lg border bg-muted/50 p-3 cursor-pointer"
			onClick={onOpenThread}
		>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium select-none">
						{threadMeta?.createdBy?.firstName?.[0] ??
							threadMeta?.createdBy?.username?.[0] ??
							latestMessage.sender?.firstName?.[0] ??
							"T"}
					</div>
					<div>
						<div className="text-sm font-semibold">{threadTitle}</div>
						<div className="text-xs text-muted-foreground mt-1">
							{creatorName}
						</div>
					</div>
				</div>
				<div className="text-xs text-muted-foreground">
					{formatMessageTime(latestMessage.createdAt)}
				</div>
			</div>

			<div className="mt-3 text-sm text-muted-foreground">
				<div className="truncate">
					{latestMessage.content || "[Attachment]"}
				</div>
			</div>
		</div>
	);
};
export default ThreadPreview;
