import { CreateCodeBlockRequest } from "@/services/code-block/code-block.type";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type InboxType = null | "normal" | "quillCode" | "image" | "file";

export type UploadPreview = {
	id: string;
	name: string;
	size: number;
	type: string;
	progress: number;
	status: "pending" | "uploading" | "uploaded" | "error";
};

type PreviewMeta = {
	uploadingImages?: number;
	uploadingFiles?: number;
	previewUploads?: UploadPreview[];
};

export type ChatInputPayload = (
	| { type: "text"; text: string; clientTempId?: string }
	| { type: "files"; files: File[] }
	| {
			type: "preview";
			text: string;
			clientTempId: string;
			meta?: PreviewMeta;
	  }
	| {
			type: "preview-progress";
			clientTempId: string;
			meta: PreviewMeta;
	  }
) & { attachmentIds?: string[]; codeBlock?: CreateCodeBlockRequest };

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
