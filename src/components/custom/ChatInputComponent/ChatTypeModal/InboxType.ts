/* eslint-disable @typescript-eslint/no-explicit-any */
export type InboxType = null | "normal" | "quillCode" | "image" | "file";

export type ChatInputPayload =
	| { type: "text"; text: string }
	| { type: "files"; files: File[] };

export type ChatInputProps = {
	setInboxTypeSelected?: React.Dispatch<React.SetStateAction<InboxType>>;
	inboxType?: InboxType;
	placeholder?: string;
	onSend?: (payload: ChatInputPayload) => Promise<void> | void;
	disabled?: boolean;

	initialFiles?: File[];
	onInitialFilesHandled?: () => void;

	editingMessage?: any | null;
	onCancelEdit?: () => void;
	replyTo?: any | null;
	onCancelReply?: () => void;
	editingMode?: boolean;
};
