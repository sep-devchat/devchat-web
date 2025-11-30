/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { MessageResponse } from "@/services/messageAPI";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

type MessageActionsProps = {
	m: MessageResponse;
	hoveredMessageId: string | null;
	setHoveredMessageId: (v: string | null) => void;
	handleEdit: (m: MessageResponse) => void;
	handleCopy: (m: MessageResponse) => void;
	handleReport: (m: MessageResponse) => void;
	handleDelete: (m: MessageResponse) => void;
	handleReply: (m: MessageResponse) => void;
	reactionPickerFor: string | null;
	setReactionPickerFor: (v: string | null) => void;
	handleReact: (messageId: string, reaction: string) => void;
	handleCreateThread: (m: MessageResponse) => void;
	isCurrentUser: boolean;
	existingThreadId: string | null;
	showThreadAction?: boolean;
};

const MessageActions: React.FC<MessageActionsProps> = ({
	m,
	hoveredMessageId,
	setHoveredMessageId,
	handleEdit,
	isCurrentUser,
	handleCopy,
	handleReport,
	handleDelete,
	handleReply,
	handleCreateThread,
	existingThreadId,
	showThreadAction = true,
}) => {
	return (
		<div
			className={`flex gap-2 items-center opacity-0 group-hover:opacity-100 transition max-[1220px]:gap-[5.6px] min-[1440px]:gap-[6.4px] min-[1920px]:gap-[8.8px]`}
		>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<button
						className="text-sm px-2 py-1 rounded hover:bg-muted max-[1220px]:text-[11px] max-[1220px]:px-[5.6px] max-[1220px]:py-[2.8px] max-[1220px]:rounded-[4.2px] min-[1440px]:text-[12px] min-[1440px]:px-[6.4px] min-[1440px]:py-[3.2px] min-[1440px]:rounded-[4.8px] min-[1920px]:text-[14px] min-[1920px]:px-[8.8px] min-[1920px]:py-[4.4px] min-[1920px]:rounded-[6.6px]"
						onClick={(e) => {
							e.stopPropagation();
							setHoveredMessageId(
								hoveredMessageId === `menu-${m.id}` ? null : `menu-${m.id}`,
							);
						}}
						aria-label="more"
					>
						⋯
					</button>
				</DropdownMenuTrigger>

				<DropdownMenuContent
					side="bottom"
					align="start"
					className="w-40 max-[1220px]:w-[112px] min-[1440px]:w-[128px] min-[1920px]:w-[176px]"
					onClick={(e) => e.stopPropagation()}
				>
					{showThreadAction &&
						(existingThreadId ? (
							<DropdownMenuItem
								className="px-3 py-2 cursor-pointer max-[1220px]:px-[8.4px] max-[1220px]:py-[5.6px] max-[1220px]:text-[11px] min-[1440px]:px-[9.6px] min-[1440px]:py-[6.4px] min-[1440px]:text-[12px] min-[1920px]:px-[13.2px] min-[1920px]:py-[8.8px] min-[1920px]:text-[14px]"
								onSelect={() => {
									handleCreateThread(m);
									setHoveredMessageId(null);
								}}
							>
								Open Thread
							</DropdownMenuItem>
						) : (
							isCurrentUser && (
								<DropdownMenuItem
									className="px-3 py-2 cursor-pointer max-[1220px]:px-[8.4px] max-[1220px]:py-[5.6px] max-[1220px]:text-[11px] min-[1440px]:px-[9.6px] min-[1440px]:py-[6.4px] min-[1440px]:text-[12px] min-[1920px]:px-[13.2px] min-[1920px]:py-[8.8px] min-[1920px]:text-[14px]"
									onSelect={() => {
										handleCreateThread(m);
										setHoveredMessageId(null);
									}}
								>
									Create Thread
								</DropdownMenuItem>
							)
						))}

					{isCurrentUser && (
						<DropdownMenuItem
							onSelect={() => {
								handleEdit(m);
								setHoveredMessageId(null);
							}}
							className="px-3 py-2 cursor-pointer max-[1220px]:px-[8.4px] max-[1220px]:py-[5.6px] max-[1220px]:text-[11px] min-[1440px]:px-[9.6px] min-[1440px]:py-[6.4px] min-[1440px]:text-[12px] min-[1920px]:px-[13.2px] min-[1920px]:py-[8.8px] min-[1920px]:text-[14px]"
						>
							Edit
						</DropdownMenuItem>
					)}

					<DropdownMenuItem
						onSelect={() => {
							handleCopy(m);
							setHoveredMessageId(null);
						}}
						className="px-3 py-2 cursor-pointer max-[1220px]:px-[8.4px] max-[1220px]:py-[5.6px] max-[1220px]:text-[11px] min-[1440px]:px-[9.6px] min-[1440px]:py-[6.4px] min-[1440px]:text-[12px] min-[1920px]:px-[13.2px] min-[1920px]:py-[8.8px] min-[1920px]:text-[14px]"
					>
						Copy
					</DropdownMenuItem>

					{!isCurrentUser && (
						<DropdownMenuItem
							onSelect={() => {
								handleReport(m);
								setHoveredMessageId(null);
							}}
							className="px-3 py-2 cursor-pointer max-[1220px]:px-[8.4px] max-[1220px]:py-[5.6px] max-[1220px]:text-[11px] min-[1440px]:px-[9.6px] min-[1440px]:py-[6.4px] min-[1440px]:text-[12px] min-[1920px]:px-[13.2px] min-[1920px]:py-[8.8px] min-[1920px]:text-[14px]"
						>
							Report
						</DropdownMenuItem>
					)}

					{isCurrentUser && (
						<>
							<DropdownMenuSeparator />

							<DropdownMenuItem
								onSelect={() => {
									handleDelete(m);
									setHoveredMessageId(null);
								}}
								className="px-3 py-2 text-red-600 max-[1220px]:px-[8.4px] max-[1220px]:py-[5.6px] max-[1220px]:text-[11px] min-[1440px]:px-[9.6px] min-[1440px]:py-[6.4px] min-[1440px]:text-[12px] min-[1920px]:px-[13.2px] min-[1920px]:py-[8.8px] min-[1920px]:text-[14px]"
							>
								Delete
							</DropdownMenuItem>
						</>
					)}
				</DropdownMenuContent>
			</DropdownMenu>

			<button
				className="text-sm px-2 py-1 rounded hover:bg-muted max-[1220px]:text-[11px] max-[1220px]:px-[5.6px] max-[1220px]:py-[2.8px] max-[1220px]:rounded-[4.2px] min-[1440px]:text-[12px] min-[1440px]:px-[6.4px] min-[1440px]:py-[3.2px] min-[1440px]:rounded-[4.8px] min-[1920px]:text-[14px] min-[1920px]:px-[8.8px] min-[1920px]:py-[4.4px] min-[1920px]:rounded-[6.6px]"
				onClick={(e) => {
					e.stopPropagation();
					handleReply(m);
				}}
				aria-label="reply"
			>
				↩
			</button>
		</div>
	);
};

export default MessageActions;
