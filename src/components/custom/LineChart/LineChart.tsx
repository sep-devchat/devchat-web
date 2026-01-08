import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { useMemo, useState } from "react";

interface LineConfig {
	dataKey: string;
	stroke: string;
	name: string;
	strokeWidth?: number;
}

interface LineChartProps {
	data: any[];
	lines: LineConfig[];
	title?: string;
	description?: string;
	xAxisKey?: string;
	height?: number;
	showGrid?: boolean;
	timeButtons?: string[];
}

const formatTooltipLabel = (label: unknown) => {
	if (label === null || label === undefined) return "";
	const raw = String(label).trim();
	if (!raw) return "";
	// If it's a YYYY-MM-DD label, format as "DD MMM, YYYY".
	if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
		const d = new Date(`${raw}T00:00:00`);
		if (!Number.isNaN(d.getTime())) {
			return new Intl.DateTimeFormat(undefined, {
				year: "numeric",
				month: "short",
				day: "2-digit",
			}).format(d);
		}
	}
	return raw;
};

const CustomTooltip = ({ active, payload, label }: any) => {
	if (active && payload && payload.length) {
		return (
			<div className="bg-gray-800 text-white px-3 py-2 rounded-md shadow-lg border border-gray-700">
				<p className="text-xs font-medium mb-1">{formatTooltipLabel(label)}</p>
				{payload.map((entry: any, index: number) => (
					<p key={index} className="text-xs">
						<span style={{ color: entry.color }}>●</span> {entry.value}
					</p>
				))}
			</div>
		);
	}
	return null;
};

export default function CustomLineChart({
	data,
	lines,
	title,
	description,
	xAxisKey = "name",
	height = 300,
	showGrid = true,
	timeButtons = ["1D", "1M", "1Y", "Max"],
}: LineChartProps) {
	const [activeButton, setActiveButton] = useState(3);
	const yDomain = useMemo(() => {
		const values: number[] = [];
		data.forEach((item) => {
			lines.forEach(({ dataKey }) => {
				const rawValue = item?.[dataKey];
				const numericValue =
					typeof rawValue === "number" ? rawValue : Number(rawValue);
				if (!Number.isNaN(numericValue)) {
					values.push(numericValue);
				}
			});
		});
		if (values.length === 0) {
			return { min: 0, max: 10 };
		}
		const minValue = Math.min(...values);
		const maxValue = Math.max(...values);
		const range = maxValue - minValue;
		const padding = Math.max(range * 0.1, 2);
		return {
			min: Math.min(minValue - padding, 0),
			max: maxValue + padding,
		};
	}, [data, lines]);

	return (
		<div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
			<div className="flex items-start justify-between mb-6">
				<div>
					{title && (
						<h3 className="text-base font-semibold text-gray-900">{title}</h3>
					)}
					{description && (
						<p className="text-xs text-gray-500 mt-1">{description}</p>
					)}
				</div>
				{timeButtons && (
					<div className="flex gap-1 bg-gray-100 p-1 rounded-md">
						{timeButtons.map((btn, idx) => (
							<button
								key={btn}
								onClick={() => setActiveButton(idx)}
								className={`px-3 py-1 text-xs rounded transition-all ${
									idx === activeButton
										? "bg-white text-gray-900 font-medium shadow-sm"
										: "text-gray-600 hover:text-gray-900"
								}`}
							>
								{btn}
							</button>
						))}
					</div>
				)}
			</div>

			<div className="relative">
				<ResponsiveContainer width="100%" height={height}>
					<LineChart
						data={data}
						margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
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
							domain={[yDomain.min, yDomain.max]}
						/>
						<Tooltip content={<CustomTooltip />} />
						{lines.map((line) => (
							<Line
								key={line.dataKey}
								type="monotone"
								dataKey={line.dataKey}
								stroke={line.stroke}
								strokeWidth={line.strokeWidth || 2}
								dot={false}
								activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }}
							/>
						))}
					</LineChart>
				</ResponsiveContainer>
			</div>

			<div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
				{lines.map((line) => (
					<div key={line.dataKey} className="flex items-center gap-2">
						<div
							className="w-3 h-3 rounded-full"
							style={{ backgroundColor: line.stroke }}
						/>
						<span className="text-m text-gray-600">{line.name}</span>
					</div>
				))}
			</div>
		</div>
	);
}
