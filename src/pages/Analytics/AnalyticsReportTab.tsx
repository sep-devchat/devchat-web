import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { AlertTriangle, Flag, ShieldCheck, UserCheck } from "lucide-react";

import { useAppSelector } from "@/hooks/useStore";
import {
	getReportAnalyticsSummary,
	getReportAnalyticsTrend,
	getReportCategoryBreakdown,
	getReportMessageTypeDistribution,
	getReportReporterLeaderboard,
	MessageReportType,
} from "@/services/reportAPI";
import StatAnalytic from "@/components/custom/StatAnalytic/StatAnalytic";
import CustomLineChart from "@/components/custom/LineChart/LineChart";
import CustomPieChart from "@/components/custom/PieChart/PieChart";
import CustomBarChart from "@/components/custom/BarChart/BarChart";
import DataTable from "@/components/custom/DataTable/DataTable";
import { StatsGrid, ChartsGrid, TablesGrid } from "./Analytics.styled";
import {
	CATEGORY_COLOR_PALETTE,
	REPORT_TYPE_COLORS,
	REPORT_TYPE_LABELS,
	CUSTOM_PRESET_VALUE,
	Granularity,
	RangeState,
	ReportCategoryBarPoint,
	ReportCategoryTableRow,
	ReporterTableRow,
	ReportTypeChartSlice,
	ReportTrendPoint,
	StatCardConfig,
} from "./Analytics.types";
import {
	compareRangeValues,
	defaultPresetByGranularity,
	getPresetRange,
	getRangeInputType,
	periodPresets,
} from "./AnalyticsRange.utils";

dayjs.extend(utc);
dayjs.extend(timezone);

const AnalyticsReportTab = () => {
	const [statGranularity, setStatGranularity] = useState<Granularity>("daily");
	const [selectedPreset, setSelectedPreset] = useState<string>(
		defaultPresetByGranularity.daily,
	);
	const [range, setRange] = useState<RangeState>(() =>
		getPresetRange("daily", defaultPresetByGranularity.daily),
	);
	const profile = useAppSelector((state) => state.user.profile);
	const resolvedTimezone = useMemo(() => {
		if (profile?.timezone) {
			return profile.timezone;
		}
		return dayjs.tz?.guess?.() ?? "UTC";
	}, [profile?.timezone]);
	const formatCount = (value?: number) =>
		typeof value === "number" ? value.toLocaleString() : "—";
	const rangeInputType = getRangeInputType(statGranularity);

	const handleGranularityChange = (mode: Granularity) => {
		setStatGranularity(mode);
		const nextDefault = defaultPresetByGranularity[mode];
		setSelectedPreset(nextDefault);
		setRange(getPresetRange(mode, nextDefault));
	};

	const handlePresetChange = (value: string) => {
		setSelectedPreset(value);
		if (value === CUSTOM_PRESET_VALUE) {
			return;
		}
		setRange(getPresetRange(statGranularity, value));
	};

	const handleRangeChange = (field: keyof RangeState, value: string) => {
		setRange((previous) => {
			const next: RangeState = { ...previous, [field]: value };
			if (
				next.start &&
				next.end &&
				compareRangeValues(statGranularity, next.start, next.end) > 0
			) {
				if (field === "start") {
					next.end = next.start;
				} else {
					next.start = next.end;
				}
			}
			return next;
		});
		setSelectedPreset(CUSTOM_PRESET_VALUE);
	};

	const requestRange = useMemo(() => {
		if (!range.start || !range.end) {
			return { start: undefined, end: undefined };
		}
		if (statGranularity === "daily") {
			return { start: range.start, end: range.end };
		}
		const startDay = dayjs(`${range.start}-01`).format("YYYY-MM-DD");
		const endDay = dayjs(`${range.end}-01`).endOf("month").format("YYYY-MM-DD");
		return { start: startDay, end: endDay };
	}, [range.end, range.start, statGranularity]);

	const summaryQuery = useQuery({
		queryKey: [
			"admin-report-analytics-summary",
			resolvedTimezone,
			requestRange.start,
			requestRange.end,
		],
		queryFn: () =>
			getReportAnalyticsSummary({
				timezone: resolvedTimezone,
				start: requestRange.start,
				end: requestRange.end,
			}),
		enabled: Boolean(requestRange.start && requestRange.end),
		placeholderData: (previous) => previous,
	});

	const trendQuery = useQuery({
		queryKey: [
			"admin-report-analytics-trend",
			resolvedTimezone,
			statGranularity,
			range.start,
			range.end,
		],
		queryFn: () =>
			getReportAnalyticsTrend({
				timezone: resolvedTimezone,
				granularity: statGranularity,
				start: range.start,
				end: range.end,
			}),
		enabled: Boolean(range.start && range.end),
		placeholderData: (previous) => previous,
	});

	const typeDistributionQuery = useQuery({
		queryKey: [
			"admin-report-analytics-message-types",
			resolvedTimezone,
			requestRange.start,
			requestRange.end,
		],
		queryFn: () =>
			getReportMessageTypeDistribution({
				timezone: resolvedTimezone,
				start: requestRange.start,
				end: requestRange.end,
			}),
		enabled: Boolean(requestRange.start && requestRange.end),
		placeholderData: (previous) => previous,
	});

	const categoryBreakdownQuery = useQuery({
		queryKey: [
			"admin-report-analytics-categories",
			resolvedTimezone,
			requestRange.start,
			requestRange.end,
		],
		queryFn: () =>
			getReportCategoryBreakdown({
				limit: 10,
				timezone: resolvedTimezone,
				start: requestRange.start,
				end: requestRange.end,
			}),
		enabled: Boolean(requestRange.start && requestRange.end),
		placeholderData: (previous) => previous,
	});

	const reporterLeaderboardQuery = useQuery({
		queryKey: [
			"admin-report-analytics-reporters",
			resolvedTimezone,
			requestRange.start,
			requestRange.end,
		],
		queryFn: () =>
			getReportReporterLeaderboard({
				limit: 5,
				timezone: resolvedTimezone,
				start: requestRange.start,
				end: requestRange.end,
			}),
		enabled: Boolean(requestRange.start && requestRange.end),
		placeholderData: (previous) => previous,
	});

	const summary = summaryQuery.data?.data;
	const totalReportCount = summary?.totalReports ?? 0;
	const rangeReportCount = summary?.recentReports ?? 0;
	const uniqueReporters = summary?.uniqueReporters ?? 0;
	const topCategory = summary?.topCategory ?? "—";
	const rangeLabel = useMemo(() => {
		if (!range.start || !range.end) {
			return "All time";
		}
		const format = statGranularity === "daily" ? "MMM D, YYYY" : "MMM YYYY";
		const startValue =
			statGranularity === "daily"
				? dayjs(range.start)
				: dayjs(`${range.start}-01`);
		const endValue =
			statGranularity === "daily" ? dayjs(range.end) : dayjs(`${range.end}-01`);
		if (!startValue.isValid() || !endValue.isValid()) {
			return "Custom range";
		}
		const startLabel = startValue.format(format);
		const endLabel = endValue.format(format);
		return startLabel === endLabel ? startLabel : `${startLabel} – ${endLabel}`;
	}, [range.end, range.start, statGranularity]);

	const trendBuckets = trendQuery.data?.data ?? [];
	const typeDistribution = typeDistributionQuery.data?.data ?? [];
	const categoryBreakdown = categoryBreakdownQuery.data?.data ?? [];
	const reporterLeaderboard = reporterLeaderboardQuery.data?.data ?? [];

	const reportTrendData: ReportTrendPoint[] = useMemo(
		() =>
			trendBuckets.map((bucket) => ({
				name: bucket.label,
				reports: bucket.reports,
			})),
		[trendBuckets],
	);

	const reportCategoryBarData: ReportCategoryBarPoint[] = useMemo(
		() =>
			categoryBreakdown.slice(0, 5).map((category) => ({
				name: category.name,
				count: category.count,
			})),
		[categoryBreakdown],
	);

	const reportTypeChartData: ReportTypeChartSlice[] = useMemo(() => {
		if (!typeDistribution.length) {
			return [{ name: "No reports", value: 1, color: "#e2e8f0" }];
		}

		return typeDistribution.map((item) => ({
			name: REPORT_TYPE_LABELS[item.type as MessageReportType],
			value: item.count,
			color: REPORT_TYPE_COLORS[item.type as MessageReportType],
		}));
	}, [typeDistribution]);

	const reportCategoryTableData: ReportCategoryTableRow[] = useMemo(
		() =>
			categoryBreakdown.slice(0, 6).map((category) => ({
				category: category.name,
				reports: formatCount(category.count),
				share:
					rangeReportCount > 0
						? `${Math.round((category.count / rangeReportCount) * 100)}%`
						: "—",
			})),
		[categoryBreakdown, rangeReportCount],
	);

	const reporterTableData: ReporterTableRow[] = useMemo(
		() =>
			reporterLeaderboard.map((reporter) => ({
				reporter: reporter.name,
				email: reporter.email ?? "—",
				reports: formatCount(reporter.reports),
			})),
		[reporterLeaderboard],
	);

	const stats: StatCardConfig[] = useMemo(
		() => [
			{
				title: "Total reports",
				value: formatCount(totalReportCount),
				change: "All time",
				changeType: "positive",
				icon: AlertTriangle,
				iconColor: "icon-card-1",
				bgColor: "bg-card-1",
			},
			{
				title: "Reports (range)",
				value: formatCount(rangeReportCount),
				change: rangeLabel,
				changeType: "positive",
				icon: Flag,
				iconColor: "icon-card-2",
				bgColor: "bg-card-2",
			},
			{
				title: "Unique reporters",
				value: formatCount(uniqueReporters),
				change: rangeLabel,
				changeType: "neutral",
				icon: UserCheck,
				iconColor: "icon-card-3",
				bgColor: "bg-card-3",
			},
			{
				title: "Top category",
				value: topCategory,
				change: rangeLabel,
				changeType: "neutral",
				icon: ShieldCheck,
				iconColor: "icon-card-4",
				bgColor: "bg-card-4",
			},
		],
		[
			rangeLabel,
			rangeReportCount,
			totalReportCount,
			topCategory,
			uniqueReporters,
		],
	);

	const anyError =
		summaryQuery.isError ||
		trendQuery.isError ||
		typeDistributionQuery.isError ||
		categoryBreakdownQuery.isError ||
		reporterLeaderboardQuery.isError;

	return (
		<div className="space-y-6">
			<StatsGrid>
				{stats.map((stat) => (
					<StatAnalytic
						key={stat.title}
						title={stat.title}
						value={stat.value}
						change={stat.change}
						changeType={stat.changeType}
						icon={stat.icon}
						iconColor={stat.iconColor}
						bgColor={stat.bgColor}
					/>
				))}
			</StatsGrid>

			{anyError && (
				<div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
					Unable to load report analytics. Please refresh to try again.
				</div>
			)}

			<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
				<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<h3 className="text-lg font-semibold text-slate-900">
						Select analytics range
					</h3>
					<div className="flex flex-col gap-3 md:flex-row md:items-center">
						<div className="flex rounded-full bg-slate-100 p-1 text-sm font-medium">
							<button
								type="button"
								className={`rounded-full px-4 py-1 transition ${statGranularity === "daily" ? "bg-white shadow" : "text-slate-500"}`}
								onClick={() => handleGranularityChange("daily")}
							>
								Daily
							</button>
							<button
								type="button"
								className={`rounded-full px-4 py-1 transition ${statGranularity === "monthly" ? "bg-white shadow" : "text-slate-500"}`}
								onClick={() => handleGranularityChange("monthly")}
							>
								Monthly
							</button>
						</div>
						<select
							className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
							value={selectedPreset}
							onChange={(event) => handlePresetChange(event.target.value)}
						>
							{periodPresets[statGranularity].map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
							<option value={CUSTOM_PRESET_VALUE}>Custom range</option>
						</select>
					</div>
				</div>
				<div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
					<div className="flex flex-wrap gap-3 text-sm text-slate-600">
						<label className="flex flex-col gap-1">
							<span className="text-xs font-medium uppercase tracking-wide">
								From
							</span>
							<input
								type={rangeInputType}
								className="rounded-xl border border-slate-200 px-3 py-2 focus:border-indigo-500 focus:outline-none"
								value={range.start}
								onChange={(event) =>
									handleRangeChange("start", event.target.value)
								}
								max={range.end || undefined}
							/>
						</label>
						<label className="flex flex-col gap-1">
							<span className="text-xs font-medium uppercase tracking-wide">
								To
							</span>
							<input
								type={rangeInputType}
								className="rounded-xl border border-slate-200 px-3 py-2 focus:border-indigo-500 focus:outline-none"
								value={range.end}
								onChange={(event) =>
									handleRangeChange("end", event.target.value)
								}
								min={range.start || undefined}
							/>
						</label>
					</div>
				</div>
			</div>

			<ChartsGrid>
				<CustomLineChart
					title="Daily report volume"
					description="Rolling 14-day trend for all report types."
					data={reportTrendData}
					lines={[{ dataKey: "reports", stroke: "#6366f1", name: "Reports" }]}
					timeButtons={null as unknown as string[]}
				/>
				<div className="space-y-4">
					<CustomPieChart
						title="Reports by message type"
						description="Distribution of direct, channel, and thread reports."
						data={reportTypeChartData}
						height={220}
						innerRadius={45}
						outerRadius={80}
						showLegend={true}
					/>
					<CustomBarChart
						title="Top categories"
						description="Most frequently selected report categories."
						data={reportCategoryBarData}
						bars={[{ dataKey: "count", fill: "#8b5cf6", name: "Reports" }]}
						colors={CATEGORY_COLOR_PALETTE}
						height={220}
						showLegend={false}
					/>
				</div>
			</ChartsGrid>

			<TablesGrid>
				<DataTable
					title="Category breakdown"
					columns={[
						{ key: "category", header: "Category", align: "left" },
						{ key: "reports", header: "Reports", align: "center" },
						{ key: "share", header: "Share", align: "right" },
					]}
					data={reportCategoryTableData}
				/>
				<DataTable
					title="Most active reporters"
					columns={[
						{ key: "reporter", header: "Reporter", align: "left" },
						{ key: "email", header: "Email", align: "center" },
						{ key: "reports", header: "Reports", align: "right" },
					]}
					data={reporterTableData}
				/>
			</TablesGrid>
		</div>
	);
};

export default AnalyticsReportTab;
