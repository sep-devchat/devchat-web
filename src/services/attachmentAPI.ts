/* eslint-disable @typescript-eslint/no-explicit-any */
import { get } from "./apiCaller";

export interface AttachmentResponse {
	id: string;
	messageId: string;
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

export const listAttachments = (
	groupId: string,
	channelId: string,
	page: number,
	size: number,
	threadId?: string,
) => {
	return get<AttachmentResponse>(
		`/api/group/${groupId}/channel/${channelId}/attachment?page=${page}&size=${size}${threadId ? `&threadId=${threadId}` : ""}`,
	);
};

export const detailAttachment = (
	id: string,
	groupId: string,
	channelId: string,
) => {
	return get<AttachmentResponse>(
		`/api/group/${groupId}/channel/${channelId}/attachment/${id}`,
	);
};
