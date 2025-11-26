import { get, post, type ApiResponseDto } from "./apiCaller";
import type { Profile } from "./auth/auth.type";
import type {
	DirectMessageResponse,
	MessageResponse,
	ThreadMessageResponse,
} from "./messageAPI";
import type { ReportCategory } from "./reportCategoryAPI";

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

export interface ReportResponse {
	id: string;
	content: string | null;
	messageId: string;
	messageType: MessageReportType;
	message: MessageResponse | null;
	directMessage: DirectMessageResponse | null;
	threadMessage: ThreadMessageResponse | null;
	reportCategories: ReportCategory[];
	createdBy: Profile;
	createdAt: Date;
}

export interface ReportListQuery {
	page: number;
	limit: number;
	messageId?: string;
	messageType?: MessageReportType;
	createdById?: string;
	reportCategoryIds?: string[];
}

export type ReportListResponse = ApiResponseDto<ReportResponse[]>;

export const createReport = (
	payload: CreateReportPayload,
): Promise<ApiResponseDto<unknown>> => {
	return post("/api/report", payload);
};

export const listReports = (
	params: ReportListQuery,
): Promise<ReportListResponse> => {
	return get<ReportResponse[]>("/api/report", params);
};
