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
	isCurrentUser: boolean;
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
}) => {
	return (
		<div
			className={`flex gap-2 items-center opacity-0 group-hover:opacity-100 transition`}
		>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<button
						className="text-sm px-2 py-1 rounded hover:bg-muted"
						onClick={(e) => {
							// stop propagation để không trigger click on message
							e.stopPropagation();
							// vẫn dùng hoveredMessageId nếu bạn cần tracking (optional)
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
					align="end"
					className="w-40"
					onClick={(e) => e.stopPropagation()}
				>
					{isCurrentUser && (
						<DropdownMenuItem
							onSelect={() => {
								handleEdit(m);
								setHoveredMessageId(null);
							}}
							className="px-3 py-2 cursor-pointer"
						>
							Edit
						</DropdownMenuItem>
					)}

					<DropdownMenuItem
						onSelect={() => {
							handleCopy(m);
							setHoveredMessageId(null);
						}}
						className="px-3 py-2 cursor-pointer"
					>
						Copy
					</DropdownMenuItem>

					{!isCurrentUser && (
						<DropdownMenuItem
							onSelect={() => {
								handleReport(m);
								setHoveredMessageId(null);
							}}
							className="px-3 py-2 cursor-pointer"
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
								className="px-3 py-2 text-red-600"
							>
								Delete
							</DropdownMenuItem>
						</>
					)}
				</DropdownMenuContent>
			</DropdownMenu>

			{/* </div> */}

			<button
				className="text-sm px-2 py-1 rounded hover:bg-muted"
				onClick={(e) => {
					e.stopPropagation();
					handleReply(m);
				}}
				aria-label="reply"
			>
				↩
			</button>

			{/* <div className="relative">
				<button
					className="text-sm px-2 py-1 rounded hover:bg-muted"
					onClick={(e) => {
						e.stopPropagation();
						setReactionPickerFor(reactionPickerFor === m.id ? null : m.id);
					}}
					aria-label="reaction"
				>
					😊
				</button>

				{reactionPickerFor === m.id && (
					<div
						className="absolute right-0 mt-2 w-max rounded shadow-md bg-popover p-2 z-50 grid grid-cols-6 gap-1"
						onClick={(e) => e.stopPropagation()}
					>
						{["❤️", "😂", "😮", "😢", "😡", "👍"].map((r) => (
							<button
								key={r}
								className="p-1 text-lg rounded hover:bg-muted"
								onClick={() => handleReact(m.id, r)}
							>
								{r}
							</button>
						))}
					</div>
				)}
			</div> */}
		</div>
	);
};

export default MessageActions;
