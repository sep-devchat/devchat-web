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

export interface ReportAnalyticsSummaryResponse {
	totalReports: number;
	recentReports: number;
	uniqueReporters: number;
	topCategory: string | null;
}

export interface ReportTrendBucketResponse {
	label: string;
	start: string;
	end: string;
	reports: number;
}

export interface ReportTypeDistributionItem {
	type: MessageReportType;
	count: number;
}

export interface ReportCategoryStat {
	id: string;
	name: string;
	count: number;
}

export interface ReportReporterStat {
	id: string;
	name: string;
	email: string | null;
	username: string | null;
	reports: number;
}

export interface ReportAnalyticsRangeParams {
	timezone?: string;
	start?: string;
	end?: string;
}

export interface ReportAnalyticsSummaryParams
	extends ReportAnalyticsRangeParams {
	recentDays?: number;
}

export interface ReportAnalyticsTrendParams extends ReportAnalyticsRangeParams {
	trendDays?: number;
	granularity?: "daily" | "monthly";
}

export interface ReportAnalyticsCategoryParams
	extends ReportAnalyticsRangeParams {
	limit?: number;
}

export interface ReportAnalyticsReporterParams
	extends ReportAnalyticsRangeParams {
	limit?: number;
}

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

export const getReportAnalyticsSummary = (
	params: ReportAnalyticsSummaryParams,
): Promise<ApiResponseDto<ReportAnalyticsSummaryResponse>> => {
	return get<ReportAnalyticsSummaryResponse>(
		"/api/report/analytics/summary",
		params,
	);
};

export const getReportAnalyticsTrend = (
	params: ReportAnalyticsTrendParams,
): Promise<ApiResponseDto<ReportTrendBucketResponse[]>> => {
	return get<ReportTrendBucketResponse[]>(
		"/api/report/analytics/trend",
		params,
	);
};

export const getReportMessageTypeDistribution = (
	params: ReportAnalyticsRangeParams,
): Promise<ApiResponseDto<ReportTypeDistributionItem[]>> => {
	return get<ReportTypeDistributionItem[]>(
		"/api/report/analytics/message-types",
		params,
	);
};

export const getReportCategoryBreakdown = (
	params: ReportAnalyticsCategoryParams,
): Promise<ApiResponseDto<ReportCategoryStat[]>> => {
	return get<ReportCategoryStat[]>("/api/report/analytics/categories", params);
};

export const getReportReporterLeaderboard = (
	params: ReportAnalyticsReporterParams,
): Promise<ApiResponseDto<ReportReporterStat[]>> => {
	return get<ReportReporterStat[]>("/api/report/analytics/reporters", params);
};
