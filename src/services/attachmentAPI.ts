/* eslint-disable @typescript-eslint/no-explicit-any */
import { get } from "./apiCaller";

export interface AttachmentResponse {
	id: string;
	messageId: string;
	channelId?: string | null;
	threadId?: string | null;
	toUserId?: string | null;
	fileName: string;
	originalFileName: string;
	filePath: string;
	fileSize: number;
	fileType: string;
	folder: string;
	format: string;
	publicId: string;
	uploadedBy: string;
	createdAt: string;
	updatedAt: string;
}

export interface ListChannelAttachmentParams {
	groupId: string;
	channelId: string;
	page?: number;
	size?: number;
	threadId?: string;
}

const buildQuery = (page?: number, size?: number, threadId?: string) => {
	const params = new URLSearchParams();
	params.set("page", String(page ?? 1));
	params.set("size", String(size ?? 20));
	if (threadId) params.set("threadId", threadId);
	return params.toString();
};

export const listChannelAttachments = ({
	groupId,
	channelId,
	page = 1,
	size = 20,
	threadId,
}: ListChannelAttachmentParams) => {
	const query = buildQuery(page, size, threadId);
	return get<AttachmentResponse>(
		`/api/group/${groupId}/channel/${channelId}/attachment?${query}`,
	);
};

export const detailChannelAttachment = (
	id: string,
	groupId: string,
	channelId: string,
) => {
	return get<AttachmentResponse>(
		`/api/group/${groupId}/channel/${channelId}/attachment/${id}`,
	);
};

export const listDirectAttachments = (
	targetUserId: string,
	page = 1,
	size = 20,
) => {
	const query = buildQuery(page, size);
	return get<AttachmentResponse>(
		`/api/direct-message/${targetUserId}/attachment?${query}`,
	);
};

export const detailDirectAttachment = (targetUserId: string, id: string) => {
	return get<AttachmentResponse>(
		`/api/direct-message/${targetUserId}/attachment/${id}`,
	);
};

// Backward-compatible aliases
export const listAttachments = (
	groupId: string,
	channelId: string,
	page: number,
	size: number,
	threadId?: string,
) =>
	listChannelAttachments({
		groupId,
		channelId,
		page,
		size,
		threadId,
	});

export const detailAttachment = (
	id: string,
	groupId: string,
	channelId: string,
) => detailChannelAttachment(id, groupId, channelId);
