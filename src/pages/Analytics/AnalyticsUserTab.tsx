import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Activity, Clock, UserPlus, Users } from "lucide-react";

import { useAppSelector } from "@/hooks/useStore";
import {
	fetchUserOverviewStats,
	fetchUserTrendStats,
	fetchUserLoginStats,
} from "@/services/adminAnalyticsAPI";
import StatAnalytic from "@/components/custom/StatAnalytic/StatAnalytic";
import CustomLineChart from "@/components/custom/LineChart/LineChart";
import DataTable from "@/components/custom/DataTable/DataTable";
import { StatsGrid, TablesGrid } from "./Analytics.styled";
import {
	CUSTOM_PRESET_VALUE,
	Granularity,
	RangeState,
	StatCardConfig,
	UserLoginTableRow,
	UserTrendChartPoint,
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

const defaultPreset = defaultPresetByGranularity.daily;

const AnalyticsUserTab = () => {
	const [statGranularity, setStatGranularity] = useState<Granularity>("daily");
	const [selectedPreset, setSelectedPreset] = useState<string>(defaultPreset);
	const [range, setRange] = useState<RangeState>(() =>
		getPresetRange("daily", defaultPreset),
	);
	const profile = useAppSelector((state) => state.user.profile);
	const resolvedTimezone = useMemo(() => {
		if (profile?.timezone) {
			return profile.timezone;
		}
		return dayjs.tz?.guess?.() ?? "UTC";
	}, [profile?.timezone]);
	const nowInTimezone = useMemo(
		() => dayjs().tz(resolvedTimezone),
		[resolvedTimezone],
	);
	const formatCount = (value?: number) =>
		typeof value === "number" ? value.toLocaleString() : "—";

	const overviewQuery = useQuery({
		queryKey: ["admin-user-overview", resolvedTimezone],
		queryFn: async () => {
			const response = await fetchUserOverviewStats({
				timezone: resolvedTimezone,
			});
			return response.data;
		},
	});

	const trendQuery = useQuery({
		queryKey: [
			"admin-user-trend",
			statGranularity,
			range.start,
			range.end,
			resolvedTimezone,
		],
		queryFn: async () => {
			const response = await fetchUserTrendStats({
				timezone: resolvedTimezone,
				granularity: statGranularity,
				start: range.start,
				end: range.end,
			});
			return response.data;
		},
		enabled: Boolean(range.start && range.end),
	});

	const loginStatsQuery = useQuery({
		queryKey: ["admin-user-login-stats", resolvedTimezone],
		queryFn: async () => {
			const response = await fetchUserLoginStats({
				timezone: resolvedTimezone,
			});
			return response.data;
		},
	});

	const overviewStatsData = overviewQuery.data;
	const userStats: StatCardConfig[] = useMemo(
		() => [
			{
				title: "Total Registered Users",
				value: formatCount(overviewStatsData?.totalUsers),
				change: "All time",
				changeType: "positive",
				icon: Users,
				iconColor: "icon-card-1",
				bgColor: "bg-card-1",
			},
			{
				title: "Daily Registrations",
				value: formatCount(overviewStatsData?.dailyRegistrations),
				change: nowInTimezone.format("MMM D, YYYY"),
				changeType: "positive",
				icon: UserPlus,
				iconColor: "icon-card-2",
				bgColor: "bg-card-2",
			},
			{
				title: "Monthly Registrations",
				value: formatCount(overviewStatsData?.monthlyRegistrations),
				change: nowInTimezone.format("MMMM YYYY"),
				changeType: "positive",
				icon: Activity,
				iconColor: "icon-card-3",
				bgColor: "bg-card-3",
			},
			{
				title: "Active Users",
				value: formatCount(overviewStatsData?.activeUsers),
				change: "Last 30 days",
				changeType: "positive",
				icon: Clock,
				iconColor: "icon-card-4",
				bgColor: "bg-card-4",
			},
		],
		[overviewStatsData, nowInTimezone],
	);

	const loginStats: UserLoginTableRow[] = useMemo(
		() =>
			(loginStatsQuery.data ?? []).map((stat) => ({
				period: stat.periodLabel,
				success: formatCount(stat.successfulLogins),
				peakHour: stat.peakHour ?? "—",
			})),
		[loginStatsQuery.data],
	);

	const chartData: UserTrendChartPoint[] = useMemo(
		() =>
			(trendQuery.data ?? []).map((item) => ({
				name: item.label,
				registrations: item.registrations,
				active: item.activeUsers,
				logins: item.logins,
			})),
		[trendQuery.data],
	);

	const handleGranularityChange = (mode: Granularity) => {
		setStatGranularity(mode);
		const nextDefault = periodPresets[mode][0].value;
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

	const rangeInputType = getRangeInputType(statGranularity);

	return (
		<div className="space-y-6">
			<StatsGrid>
				{userStats.map((stat) => (
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

			<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
				<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<h3 className="text-lg font-semibold text-slate-900">
						User registration & activity trend
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
				<div className="mt-4">
					<CustomLineChart
						data={chartData}
						lines={[
							{
								dataKey: "registrations",
								stroke: "#6366f1",
								name: "Registrations",
							},
							{
								dataKey: "active",
								stroke: "#10b981",
								name: "Active users",
							},
							{
								dataKey: "logins",
								stroke: "#f97316",
								name: "Logins",
							},
						]}
						timeButtons={null as unknown as string[]}
					/>
				</div>
			</div>

			<TablesGrid>
				<DataTable
					title="User Login Statistics"
					columns={[
						{ key: "period", header: "Period", align: "left" },
						{ key: "success", header: "Successful Logins", align: "center" },
						{ key: "peakHour", header: "Peak Hour", align: "right" },
					]}
					data={loginStats}
				/>
			</TablesGrid>
		</div>
	);
};

export default AnalyticsUserTab;
