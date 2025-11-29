import { MessageReportType } from "@/services/reportAPI";
import type { LucideIcon } from "lucide-react";

export type PresetOption = {
	label: string;
	value: string;
};

export type PeriodPresetMap = Readonly<
	Record<Granularity, readonly PresetOption[]>
>;

export type StatCardConfig = {
	title: string;
	value: string;
	change: string;
	changeType: "positive" | "neutral" | "negative";
	icon: LucideIcon;
	iconColor: string;
	bgColor: string;
};

export type UserTrendChartPoint = {
	name: string;
	registrations: number;
	active: number;
	logins: number;
};

export type UserLoginTableRow = {
	period: string;
	success: string;
	peakHour: string;
};

export type ReportTrendPoint = {
	name: string;
	reports: number;
};

export type ReportTypeChartSlice = {
	name: string;
	value: number;
	color: string;
};

export type ReportCategoryBarPoint = {
	name: string;
	count: number;
};

export type ReportCategoryTableRow = {
	category: string;
	reports: string;
	share: string;
};

export type ReporterTableRow = {
	reporter: string;
	email: string;
	reports: string;
};

export type Granularity = "daily" | "monthly";

export type RangeState = {
	start: string;
	end: string;
};

export const CUSTOM_PRESET_VALUE = "custom";

export const CATEGORY_COLOR_PALETTE = [
	"#6366f1",
	"#14b8a6",
	"#f97316",
	"#8b5cf6",
	"#0ea5e9",
];

export const REPORT_TYPE_LABELS: Record<MessageReportType, string> = {
	[MessageReportType.DIRECT_MESSAGE]: "Direct message",
	[MessageReportType.CHANNEL_MESSAGE]: "Channel message",
	[MessageReportType.THREAD_MESSAGE]: "Thread reply",
};

export const REPORT_TYPE_COLORS: Record<MessageReportType, string> = {
	[MessageReportType.DIRECT_MESSAGE]: "#6366f1",
	[MessageReportType.CHANNEL_MESSAGE]: "#10b981",
	[MessageReportType.THREAD_MESSAGE]: "#f97316",
};
