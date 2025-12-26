import type { CodeBlock } from "@/services/codeCollabAPI";

const formatOwnerName = (user?: CodeBlock["user"]) => {
	if (!user) return "Unknown author";
	const first = user.firstName?.trim() ?? "";
	const last = user.lastName?.trim() ?? "";
	const fullName = `${first} ${last}`.trim();
	return fullName || user.username || "Unknown author";
};

const formatTimestamp = (value?: string | Date) => {
	if (!value) return "";
	const parsed = value instanceof Date ? value : new Date(value);
	if (Number.isNaN(parsed.getTime())) {
		return "";
	}
	return parsed.toLocaleString();
};

export const buildCodeBlockTitle = (language?: string | null) =>
	language ? `${language} snippet` : "Code snippet";

export const buildCodeBlockSubtitleFromBlock = (
	block?: Pick<CodeBlock, "user" | "createdAt"> | null,
) => {
	if (!block) return formatOwnerName();
	// const owner = formatOwnerName(block.user);
	const timestamp = formatTimestamp(block.createdAt);
	return timestamp;
};
