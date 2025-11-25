import { get, post, put, remove, type ApiResponseDto } from "./apiCaller";

export interface ReportCategory {
	id: string;
	name: string;
	description: string;
	isRemoved: boolean;
}

export interface ReportCategoryPayload {
	name: string;
	description: string;
}

export interface ReportCategoryAdminQueryParams {
	page?: number;
	take?: number;
	search?: string;
}

export type ReportCategoryListResponse = ApiResponseDto<ReportCategory[]>;

export const listReportCategoriesAdmin = (
	params: ReportCategoryAdminQueryParams,
): Promise<ReportCategoryListResponse> =>
	get<ReportCategory[]>("/api/report-category/admin", params);

export const listReportCategoriesPublic = (params?: {
	search?: string;
}): Promise<ApiResponseDto<ReportCategory[]>> =>
	get<ReportCategory[]>("/api/report-category", params ?? {});

export const createReportCategory = (
	payload: ReportCategoryPayload,
): Promise<ApiResponseDto<ReportCategory>> =>
	post<ReportCategory>("/api/report-category", payload);

export const updateReportCategory = (
	id: string,
	payload: Partial<ReportCategoryPayload>,
): Promise<ApiResponseDto<ReportCategory>> =>
	put<ReportCategory>(`/api/report-category/${id}`, payload);

export const deleteReportCategory = (
	id: string,
): Promise<ApiResponseDto<ReportCategory>> =>
	remove(`/api/report-category/${id}`);
