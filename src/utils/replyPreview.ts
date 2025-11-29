const PREVIEW_FALLBACK = "(no longer available)";
const PREVIEW_LENGTH = 60;
const TOKEN_LENGTH = 48;

const truncateTokens = (value: string, tokenLimit = TOKEN_LENGTH) => {
	if (!value) return value;
	const pattern = new RegExp(`(\\S{${tokenLimit}})\\S+`, "g");
	return value.replace(pattern, "$1…");
};

export const sanitizeReplyPreview = (text?: string | null) => {
	if (!text) return "";
	const normalized = text
		.replace(/```[\s\S]*?```/g, " [code block] ")
		.replace(/`([^`]+)`/g, "$1")
		.replace(/!\[[^\]]*\]\([^)]*\)/g, " [image] ")
		.replace(/\[[^\]]*\]\(([^)]*)\)/g, "$1")
		.replace(/https?:\/\/\S+/gi, " [link] ")
		.replace(/@\[([^\]]+)\]\([^)]*\)/g, "@$1")
		.replace(/<br\s*\/?>(?=\s|$)/gi, " ")
		.replace(/<[^>]+>/g, " ")
		.replace(/&(?:nbsp|amp|lt|gt|quot);/gi, " ")
		.replace(/[*_~>#`]/g, " ")
		.replace(/\s+/g, " ")
		.trim();
	return truncateTokens(normalized);
};

const buildAttachmentSummary = (attachments: any[] | undefined | null) => {
	if (!attachments || attachments.length === 0) return "";
	if (attachments.length === 1) {
		const name = attachments[0]?.name?.trim();
		return name ? `[Attachment] ${name}` : "[Attachment]";
	}
	return `[${attachments.length} attachments]`;
};

export const getReplyPreviewText = (
	msg?: { content?: string | null; attachments?: any[] | null } | null,
) => {
	if (!msg) return PREVIEW_FALLBACK;
	const attachments = Array.isArray(msg.attachments) ? msg.attachments : [];
	const textPortion =
		msg.content && msg.content.trim().length > 0
			? sanitizeReplyPreview(msg.content)
			: "";
	const attachmentLabel = buildAttachmentSummary(attachments);
	const combined = [textPortion, attachmentLabel]
		.filter(Boolean)
		.join(" ")
		.trim();
	return combined || PREVIEW_FALLBACK;
};

export const truncatePreview = (value: string, limit = PREVIEW_LENGTH) => {
	if (!value) return value;
	if (value.length <= limit) return value;
	const boundary = value.lastIndexOf(" ", limit - 1);
	const cutIndex = boundary > limit * 0.5 ? boundary : limit - 1;
	return `${value.slice(0, cutIndex).trim()}…`;
};

export const REPLY_PREVIEW_DEFAULT_LENGTH = PREVIEW_LENGTH;
export const REPLY_PREVIEW_FALLBACK = PREVIEW_FALLBACK;
