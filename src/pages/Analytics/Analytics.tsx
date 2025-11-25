import { useQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
	Activity,
	Users,
	UserPlus,
	Clock,
	Zap,
	Database,
	Globe,
	Code,
	Share2,
	FileCode,
	MessageSquare,
	TrendingUp,
} from "lucide-react";

import {
	AnalyticsContainer,
	StatsGrid,
	ChartsGrid,
	TablesGrid,
	Badge,
	ProgressBar,
} from "./Analytics.styled";
import StatAnalytic from "@/components/custom/StatAnalytic/StatAnalytic";
import CustomLineChart from "@/components/custom/LineChart/LineChart";
import DataTable from "@/components/custom/DataTable/DataTable";
import CustomPieChart from "@/components/custom/PieChart/PieChart";
import CustomBarChart from "@/components/custom/BarChart/BarChart";
import LanguageChart from "@/components/custom/LanguageChart/LanguageChart";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useAppSelector } from "@/hooks/useStore";
import {
	fetchUserOverviewStats,
	fetchUserTrendStats,
	fetchUserLoginStats,
} from "@/services/adminAnalyticsAPI";

dayjs.extend(utc);
dayjs.extend(timezone);

type Granularity = "daily" | "monthly";

type RangeState = {
	start: string;
	end: string;
};

const CUSTOM_PRESET_VALUE = "custom";

const formatDateInput = (date: Date) => date.toISOString().split("T")[0];

const formatMonthInput = (date: Date) =>
	`${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}`;

const addDays = (date: Date, amount: number) => {
	const next = new Date(date);
	next.setDate(next.getDate() + amount);
	return next;
};

const addMonths = (date: Date, amount: number) =>
	new Date(date.getFullYear(), date.getMonth() + amount, 1);

const getDailyPresetRange = (preset: string): RangeState => {
	const today = new Date();
	switch (preset) {
		case "today":
			return { start: formatDateInput(today), end: formatDateInput(today) };
		case "yesterday": {
			const y = addDays(today, -1);
			return { start: formatDateInput(y), end: formatDateInput(y) };
		}
		case "last_7_days":
		default:
			return {
				start: formatDateInput(addDays(today, -6)),
				end: formatDateInput(today),
			};
	}
};

const getMonthlyPresetRange = (preset: string): RangeState => {
	const currentMonth = new Date(
		new Date().getFullYear(),
		new Date().getMonth(),
		1,
	);
	switch (preset) {
		case "last_month": {
			const last = addMonths(currentMonth, -1);
			return {
				start: formatMonthInput(last),
				end: formatMonthInput(last),
			};
		}
		case "last_6_months":
			return {
				start: formatMonthInput(addMonths(currentMonth, -5)),
				end: formatMonthInput(currentMonth),
			};
		case "last_12_months":
			return {
				start: formatMonthInput(addMonths(currentMonth, -11)),
				end: formatMonthInput(currentMonth),
			};
		case "this_month":
		default:
			return {
				start: formatMonthInput(currentMonth),
				end: formatMonthInput(currentMonth),
			};
	}
};

const getPresetRange = (mode: Granularity, preset: string): RangeState =>
	mode === "daily"
		? getDailyPresetRange(preset)
		: getMonthlyPresetRange(preset);

const parseMonthInput = (value: string) => {
	const [yearStr, monthStr] = value.split("-");
	const year = Number(yearStr);
	const monthIndex = Number(monthStr) - 1;
	if (Number.isNaN(year) || Number.isNaN(monthIndex)) {
		return null;
	}
	return new Date(year, monthIndex, 1);
};

const compareRangeValues = (mode: Granularity, left: string, right: string) => {
	if (!left || !right) {
		return 0;
	}
	if (mode === "daily") {
		const a = new Date(left);
		const b = new Date(right);
		if (Number.isNaN(a.valueOf()) || Number.isNaN(b.valueOf())) {
			return 0;
		}
		return a.getTime() - b.getTime();
	}
	const a = parseMonthInput(left);
	const b = parseMonthInput(right);
	if (!a || !b) {
		return 0;
	}
	return a.getTime() - b.getTime();
};

export default function Analytics() {
	const search = useSearch({ from: "/admin/dashboard" });
	const activeTab = search.tab || "user";
	const [statGranularity, setStatGranularity] = useState<Granularity>("daily");
	const periodPresets = {
		daily: [
			{ label: "Today", value: "today" },
			{ label: "Yesterday", value: "yesterday" },
			{ label: "Last 7 days", value: "last_7_days" },
		],
		monthly: [
			{ label: "This month", value: "this_month" },
			{ label: "Last month", value: "last_month" },
			{ label: "Last 6 months", value: "last_6_months" },
			{ label: "Last 12 months", value: "last_12_months" },
		],
	} as const;
	const defaultPreset = periodPresets.daily[0].value;
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

	const lineChartData = [
		{ name: "11h", cpu: 75, memory: 45, response: 30, error: 10 },
		{ name: "12h", cpu: 45, memory: 50, response: 65, error: 15 },
		{ name: "13h", cpu: 60, memory: 52, response: 55, error: 20 },
		{ name: "14h", cpu: 50, memory: 48, response: 35, error: 12 },
		{ name: "15h", cpu: 65, memory: 52, response: 25, error: 8 },
	];

	const userActivityData = [
		{ name: "Memory", value: 40, color: "#3b82f6" },
		{ name: "Storage", value: 30, color: "#f97316" },
		{ name: "Network bandwidth", value: 30, color: "#a855f7" },
	];

	const groupSizeData = [
		{ name: "6-10", value: 2 },
		{ name: "11-20", value: 3 },
		{ name: "21-50", value: 1 },
		{ name: "50+", value: 2 },
	];

	const overviewStatsData = overviewQuery.data;
	const userStats = [
		{
			title: "Total Registered Users",
			value: formatCount(overviewStatsData?.totalUsers),
			change: "All time",
			icon: Users,
			iconColor: "icon-card-1",
			bgColor: "bg-card-1",
		},
		{
			title: "Daily Registrations",
			value: formatCount(overviewStatsData?.dailyRegistrations),
			change: nowInTimezone.format("MMM D, YYYY"),
			icon: UserPlus,
			iconColor: "icon-card-2",
			bgColor: "bg-card-2",
		},
		{
			title: "Monthly Registrations",
			value: formatCount(overviewStatsData?.monthlyRegistrations),
			change: nowInTimezone.format("MMMM YYYY"),
			icon: Activity,
			iconColor: "icon-card-3",
			bgColor: "bg-card-3",
		},
		{
			title: "Active Users",
			value: formatCount(overviewStatsData?.activeUsers),
			change: "Last 30 days",
			icon: Clock,
			iconColor: "icon-card-4",
			bgColor: "bg-card-4",
		},
	];

	const loginStats = useMemo(
		() =>
			(loginStatsQuery.data ?? []).map((stat) => ({
				period: stat.periodLabel,
				success: formatCount(stat.successfulLogins),
				peakHour: stat.peakHour ?? "—",
			})),
		[loginStatsQuery.data],
	);

	const chartData = useMemo(
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

	const renderUserTab = () => {
		const rangeInputType = statGranularity === "daily" ? "date" : "month";
		return (
			<div className="space-y-6">
				<StatsGrid>
					{userStats.map((stat) => (
						<StatAnalytic
							key={stat.title}
							title={stat.title}
							value={stat.value}
							change={stat.change}
							changeType="positive"
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

	const renderLanguageTab = () => (
		<>
			<StatsGrid>
				<StatAnalytic
					title="Total Code Snippets"
					value="12,456"
					change="76.8%"
					changeType="positive"
					icon={Code}
					iconColor="icon-card-1"
					bgColor="bg-card-1"
				/>
				<StatAnalytic
					title="Languages Supported"
					value="47"
					change="76.8%"
					changeType="positive"
					icon={Globe}
					iconColor="icon-card-2"
					bgColor="bg-card-2"
				/>
				<StatAnalytic
					title="Shared Snippets"
					value="3,456"
					change="76.8%"
					changeType="positive"
					icon={Share2}
					iconColor="icon-card-3"
					bgColor="bg-card-3"
				/>
				<StatAnalytic
					title="Avg. Snippet Length"
					value="47 lines"
					change="76.8%"
					changeType="positive"
					icon={FileCode}
					iconColor="icon-card-4"
					bgColor="bg-card-4"
				/>
			</StatsGrid>

			<ChartsGrid>
				<CustomLineChart
					title="Language Usage Trends"
					description="Description about this chart and its key insights."
					data={lineChartData}
					lines={[
						{ dataKey: "response", stroke: "#f97316", name: "Java" },
						{ dataKey: "cpu", stroke: "#3b82f6", name: "TypeScript" },
						{ dataKey: "error", stroke: "#eab308", name: "JS" },
					]}
					timeButtons={["1D", "1M", "1Y", "Max"]}
				/>
				<div className="space-y-4">
					<LanguageChart
						title="Language Distribution"
						description="Description about this chart and its key insights."
						data={[
							{ name: "Ruby", value: 12, color: "#701516" },
							{ name: "Java", value: 45, color: "#B8860B" },
							{ name: "TypeScript", value: 18, color: "#3178C6" },
							{ name: "JS", value: 25, color: "#F7DF1E" },
						]}
						height={50}
					/>
					<CustomPieChart
						title="Code Execution Success Rate by Language"
						data={[
							{ name: "Success", value: 85, color: "#3b82f6" },
							{ name: "Failed", value: 15, color: "#991b1b" },
						]}
						height={120}
						innerRadius={20}
						outerRadius={40}
						showLegend={false}
						horizontalLayout={true}
					/>
				</div>
			</ChartsGrid>

			<DataTable
				title="Programming Languages Statistics"
				columns={[
					{
						key: "language",
						header: "Language",
						align: "left",
						render: (value) => <Badge variant="info">{value}</Badge>,
					},
					{ key: "snippets", header: "Snippets", align: "center" },
					{ key: "executions", header: "Executions", align: "center" },
					{ key: "successRate", header: "Success Rate", align: "center" },
					{ key: "avgLength", header: "Avg. Length", align: "center" },
					{
						key: "trend",
						header: "Trend",
						align: "right",
						render: (value) => (
							<Badge variant={value.startsWith("+") ? "success" : "error"}>
								{value}
							</Badge>
						),
					},
				]}
				data={[
					{
						language: "Java",
						snippets: "2,847",
						executions: "2,847",
						successRate: "89.3%",
						avgLength: "32 line",
						trend: "+12.3%",
					},
					{
						language: "Javascript",
						snippets: "2,234",
						executions: "2,234",
						successRate: "89.3%",
						avgLength: "32 line",
						trend: "+6.5%",
					},
					{
						language: "Typescript",
						snippets: "1,987",
						executions: "1,987",
						successRate: "89.3%",
						avgLength: "32 line",
						trend: "-2.1%",
					},
				]}
			/>
		</>
	);

	const renderGroupTab = () => (
		<>
			<StatsGrid>
				<StatAnalytic
					title="Total Groups"
					value="234"
					change="76.8%"
					changeType="positive"
					icon={Users}
					iconColor="icon-card-1"
					bgColor="bg-card-1"
				/>
				<StatAnalytic
					title="Active Groups"
					value="187"
					change="76.8%"
					changeType="positive"
					icon={Activity}
					iconColor="icon-card-2"
					bgColor="bg-card-2"
				/>
				<StatAnalytic
					title="New Groups Created"
					value="23"
					change="76.8%"
					changeType="positive"
					icon={UserPlus}
					iconColor="icon-card-3"
					bgColor="bg-card-3"
				/>
				<StatAnalytic
					title="Avg. Group Size"
					value="12.4"
					change="76.8%"
					changeType="positive"
					icon={TrendingUp}
					iconColor="icon-card-4"
					bgColor="bg-card-4"
				/>
			</StatsGrid>

			<ChartsGrid>
				<CustomLineChart
					title="Group Activity Over Time"
					description="Description about this chart and its key insights."
					data={lineChartData}
					lines={[
						{ dataKey: "cpu", stroke: "#3b82f6", name: "Total messages" },
						{
							dataKey: "response",
							stroke: "#f97316",
							name: "Average members per group",
						},
						{
							dataKey: "memory",
							stroke: "#10b981",
							name: "Group creation rate",
						},
					]}
					timeButtons={["1M", "1Y", "Max"]}
				/>
				<CustomBarChart
					title="Group Size Distribution"
					description="Number of groups"
					data={groupSizeData}
					bars={[{ dataKey: "value", fill: "#22c55e", name: "Groups" }]}
					colors={["#AEF5DF", "#7BFFD5", "#33EFB3", "#1CCA93"]}
					height={300}
					showLegend={true}
				/>
			</ChartsGrid>

			<TablesGrid>
				<DataTable
					title="Most Active Groups"
					columns={[
						{ key: "groupName", header: "Group Name", align: "left" },
						{ key: "members", header: "Members", align: "center" },
						{ key: "messages", header: "Messages", align: "center" },
						{
							key: "activity",
							header: "Activity",
							align: "right",
							render: (value) => (
								<ProgressBar progress={value} color="#133E87" />
							),
						},
					]}
					data={[
						{
							groupName: "React Developers",
							members: "324",
							messages: "12,847",
							activity: 85,
						},
						{
							groupName: "Backend Team",
							members: "189",
							messages: "8,234",
							activity: 65,
						},
						{
							groupName: "Python Community",
							members: "287",
							messages: "6,543",
							activity: 50,
						},
					]}
				/>
				<DataTable
					title="Group Performance Metrics"
					columns={[
						{ key: "metric", header: "Metric", align: "left" },
						{ key: "value", header: "Value", align: "center" },
						{
							key: "change",
							header: "Change",
							align: "right",
							render: (value) => (
								<Badge variant={value.startsWith("+") ? "success" : "error"}>
									{value}
								</Badge>
							),
						},
					]}
					data={[
						{ metric: "Avg. Messages/Day", value: "2,847", change: "+12.3%" },
						{ metric: "Group Retention Rate", value: "89.3%", change: "+8.7%" },
						{ metric: "Avg. Response Time", value: "4.2 min", change: "-2.1%" },
					]}
				/>
			</TablesGrid>
		</>
	);

	const renderSystemTab = () => (
		<>
			<StatsGrid>
				<StatAnalytic
					title="Server Uptime"
					value="99.8%"
					change="76.8%"
					changeType="positive"
					icon={Zap}
					iconColor="icon-card-1"
					bgColor="bg-card-1"
				/>
				<StatAnalytic
					title="API Response Time"
					value="142ms"
					change="76.8%"
					changeType="negative"
					icon={Activity}
					iconColor="icon-card-2"
					bgColor="bg-card-2"
				/>
				<StatAnalytic
					title="Memory Usage"
					value="67.2%"
					change="76.8%"
					changeType="neutral"
					icon={Database}
					iconColor="icon-card-3"
					bgColor="bg-card-3"
				/>
				<StatAnalytic
					title="AI API Calls"
					value="8.7K"
					change="76.8%"
					changeType="positive"
					icon={MessageSquare}
					iconColor="icon-card-4"
					bgColor="bg-card-4"
				/>
			</StatsGrid>
			<ChartsGrid>
				<CustomLineChart
					title="User Growth Over Time"
					description="Description about this chart and its key insights."
					data={lineChartData}
					lines={[
						{ dataKey: "cpu", stroke: "#10b981", name: "CPU usage" },
						{ dataKey: "memory", stroke: "#3b82f6", name: "Memory usage" },
						{ dataKey: "response", stroke: "#f97316", name: "Response time" },
						{ dataKey: "error", stroke: "#ef4444", name: "Error rate" },
					]}
					timeButtons={["24h", "48h", "72h", "Max"]}
				/>
				<CustomPieChart
					title="User Activity Distribution"
					description="Description about this chart and its key insights."
					data={userActivityData}
					innerRadius={60}
					outerRadius={100}
					height={300}
				/>
			</ChartsGrid>

			<TablesGrid>
				<DataTable
					title="User Engagement Metrics"
					columns={[
						{ key: "event", header: "Event", align: "left" },
						{ key: "time", header: "Time", align: "center" },
						{
							key: "severity",
							header: "Severity",
							align: "right",
							render: (value) => {
								const variant =
									value === "INFO"
										? "success"
										: value === "WARNING"
											? "warning"
											: "info";
								return <Badge variant={variant}>{value}</Badge>;
							},
						},
					]}
					data={[
						{ event: "High CPU Usage", time: "2h ago", severity: "INFO" },
						{
							event: "Database Backup Complete",
							time: "4h ago",
							severity: "INFO",
						},
						{
							event: "SSL Certificate Renewed",
							time: "1d ago",
							severity: "WARNING",
						},
					]}
				/>
				<DataTable
					title="User Engagement Metrics"
					columns={[
						{ key: "feature", header: "Feature", align: "left" },
						{ key: "usageCount", header: "Usage Count", align: "center" },
						{
							key: "successRate",
							header: "Success Rate",
							align: "right",
							render: (value) => <Badge variant="success">{value}</Badge>,
						},
					]}
					data={[
						{
							feature: "Code Execution",
							usageCount: "8,923",
							successRate: "94.5%",
						},
						{
							feature: "AI Assistant",
							usageCount: "6,745",
							successRate: "92.2%",
						},
						{
							feature: "GitHub Integration",
							usageCount: "2,134",
							successRate: "86.7%",
						},
					]}
				/>
			</TablesGrid>
		</>
	);

	const renderContent = () => {
		switch (activeTab) {
			case "user":
				return renderUserTab();
			case "language":
				return renderLanguageTab();
			case "group":
				return renderGroupTab();
			case "system":
				return renderSystemTab();
			default:
				return renderUserTab();
		}
	};

	return <AnalyticsContainer>{renderContent()}</AnalyticsContainer>;
}
