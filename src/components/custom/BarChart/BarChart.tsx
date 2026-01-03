import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	Cell,
} from "recharts";

interface BarConfig {
	dataKey: string;
	fill: string;
	name: string;
}

interface BarData {
	[key: string]: string | number;
}

interface CustomBarChartProps {
	data: BarData[];
	bars: BarConfig[];
	title?: string;
	description?: string;
	xAxisKey?: string;
	height?: number;
	showGrid?: boolean;
	showLegend?: boolean;
	colors?: string[];
}

const formatTooltipValue = (value: unknown) => {
	if (value === null || value === undefined) return "-";
	const num = typeof value === "number" ? value : Number(String(value));
	if (!Number.isFinite(num)) return String(value);
	return new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(
		num,
	);
};

const CustomTooltip = ({ active, payload, label }: any) => {
	if (!active || !payload || payload.length === 0) return null;
	return (
		<div className="bg-gray-800 text-white px-3 py-2 rounded-md shadow-lg border border-gray-700">
			<p className="text-xs font-medium mb-1">{String(label ?? "")}</p>
			{payload.map((entry: any, index: number) => (
				<p key={index} className="text-xs">
					<span style={{ color: entry.color }}>●</span>{" "}
					{formatTooltipValue(entry.value)}
				</p>
			))}
		</div>
	);
};

export default function CustomBarChart({
	data,
	bars,
	title,
	description,
	xAxisKey = "name",
	height = 300,
	showGrid = true,
	showLegend = true,
	colors = ["#AEF5DF", "#7BFFD5", "#33EFB3", "#1CCA93"],
}: CustomBarChartProps) {
	// const calculatePercentage = (index: number) => {
	// 	const item = data[index];
	// 	const dataKey = bars[0]?.dataKey || "value";
	// 	const value = item[dataKey];
	// 	const numValue = typeof value === "number" ? value : 0;

	// 	const totalGroups = data.length;
	// 	const percentage =
	// 		totalGroups > 0 ? ((numValue / totalGroups) * 100).toFixed(1) : "0.0";
	// 	return percentage + "%";
	// };

	const renderCustomLegend = () => {
		if (!showLegend) return null;

		return (
			<div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-3">
				{data.map((item, index) => (
					<div key={index} className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div
								className="w-3 h-3 rounded-full flex-shrink-0"
								style={{ backgroundColor: colors[index] }}
							/>
							<span className="text-sm text-gray-700">{item[xAxisKey]}</span>
						</div>
						{/* <span className="text-sm font-semibold text-gray-900">
							{calculatePercentage(index)}
						</span> */}
					</div>
				))}
			</div>
		);
	};

	return (
		<div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
			{title && (
				<h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
			)}
			{description && (
				<p className="text-xs text-gray-500 mb-4">{description}</p>
			)}

			<div className="relative">
				<ResponsiveContainer width="100%" height={height}>
					<BarChart
						data={data}
						margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
						barCategoryGap="20%"
					>
						{showGrid && (
							<CartesianGrid
								strokeDasharray="3 3"
								stroke="#f0f0f0"
								vertical={false}
							/>
						)}
						<XAxis
							dataKey={xAxisKey}
							tick={{ fill: "#9ca3af", fontSize: 11 }}
							axisLine={false}
							tickLine={false}
							dy={10}
						/>
						<YAxis
							tick={{ fill: "#9ca3af", fontSize: 11 }}
							axisLine={false}
							tickLine={false}
							ticks={[0, 0]}
						/>
						<Tooltip content={<CustomTooltip />} />
						<Bar
							dataKey={bars[0]?.dataKey || "value"}
							radius={[4, 4, 0, 0]}
							maxBarSize={60}
						>
							{data.map((_, index) => (
								<Cell key={`cell-${index}`} fill={colors[index]} />
							))}
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			</div>

			{renderCustomLegend()}
		</div>
	);
}
