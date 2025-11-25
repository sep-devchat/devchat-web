import { get } from "./apiCaller";

export type TrendGranularity = "daily" | "monthly";

export interface UserOverviewStatsResponse {
	totalUsers: number;
	dailyRegistrations: number;
	monthlyRegistrations: number;
	activeUsers: number;
}

export interface UserTrendPoint {
	label: string;
	start: string;
	end: string;
	registrations: number;
	activeUsers: number;
	logins: number;
}

export interface UserLoginStat {
	periodLabel: string;
	successfulLogins: number;
	peakHour: string | null;
}

export const fetchUserOverviewStats = (params: { timezone?: string }) =>
	get<UserOverviewStatsResponse>("/api/user/analytics/overview", params);

export const fetchUserTrendStats = (params: {
	timezone?: string;
	granularity: TrendGranularity;
	start: string;
	end: string;
}) => get<UserTrendPoint[]>("/api/user/analytics/trend", params);

export const fetchUserLoginStats = (params: { timezone?: string }) =>
	get<UserLoginStat[]>("/api/user/analytics/login-stats", params);
