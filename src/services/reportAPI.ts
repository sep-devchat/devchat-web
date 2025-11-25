import { post, type ApiResponseDto } from "./apiCaller";

export enum MessageReportType {
	DIRECT_MESSAGE = "DIRECT_MESSAGE",
	CHANNEL_MESSAGE = "CHANNEL_MESSAGE",
	THREAD_MESSAGE = "THREAD_MESSAGE",
}

export interface CreateReportPayload {
	messageId: string;
	reportCategoryIds: string[];
	messageType: MessageReportType;
	content?: string | null;
}

export const createReport = (
	payload: CreateReportPayload,
): Promise<ApiResponseDto<unknown>> => {
	return post("/api/report", payload);
};
