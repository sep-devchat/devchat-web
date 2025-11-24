import { useSearch } from "@tanstack/react-router";
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

export default function Analytics() {
	const search = useSearch({ from: "/admin/dashboard" });
	const activeTab = search.tab || "user";

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

	const renderUserTab = () => (
		<>
			<StatsGrid>
				<StatAnalytic
					title="Total Registered Users"
					value="2,847"
					change="16.8%"
					changeType="positive"
					icon={Users}
					iconColor="icon-card-1"
					bgColor="bg-card-1"
				/>
				<StatAnalytic
					title="Daily Active Users"
					value="1,923"
					change="76.8%"
					changeType="positive"
					icon={Activity}
					iconColor="icon-card-2"
					bgColor="bg-card-2"
				/>
				<StatAnalytic
					title="New User Registrations"
					value="347"
					change="76.8%"
					changeType="positive"
					icon={UserPlus}
					iconColor="icon-card-3"
					bgColor="bg-card-3"
				/>
				<StatAnalytic
					title="Avg. Session Duration"
					value="42m"
					change="76.8%"
					changeType="positive"
					icon={Clock}
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
						{ dataKey: "cpu", stroke: "#3b82f6", name: "New registrations" },
						{ dataKey: "response", stroke: "#f97316", name: "Churn rate" },
						{ dataKey: "memory", stroke: "#10b981", name: "Active users" },
					]}
					timeButtons={["1D", "1M", "1Y", "Max"]}
				/>
				<CustomPieChart
					title="User Activity Distribution"
					description="Description about this chart and its key insights."
					data={userActivityData}
					innerRadius={0}
					outerRadius={100}
					height={300}
				/>
			</ChartsGrid>

			<TablesGrid>
				<DataTable
					title="Most Active Users"
					columns={[
						{ key: "username", header: "Username", align: "left" },
						{ key: "messages", header: "Messages", align: "center" },
						{ key: "onlineTime", header: "Online Time", align: "center" },
						{
							key: "status",
							header: "Status",
							align: "center",
							render: (value) => (
								<Badge variant={value === "Online" ? "success" : "error"}>
									{value}
								</Badge>
							),
						},
					]}
					data={[
						{
							username: "mike_frontend",
							messages: "2,847",
							onlineTime: "127h",
							status: "Online",
						},
						{
							username: "john_backend",
							messages: "2,234",
							onlineTime: "98h",
							status: "Online",
						},
						{
							username: "sarah_dev",
							messages: "1,987",
							onlineTime: "89h",
							status: "Online",
						},
					]}
				/>
				<DataTable
					title="User Engagement Metrics"
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
						{ metric: "Avg. Messages/Day", value: "23.4", change: "+12.3%" },
						{ metric: "Peak Concurrent Users", value: "456", change: "+3.2%" },
						{ metric: "User Return Rate", value: "67.8%", change: "-2.1%" },
					]}
				/>
			</TablesGrid>
		</>
	);

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
