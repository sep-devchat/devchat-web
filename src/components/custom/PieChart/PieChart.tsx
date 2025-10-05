import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface PieData {
	name: string;
	value: number;
	color: string;
	[key: string]: string | number | undefined;
}

interface CustomPieChartProps {
	data: PieData[];
	title?: string;
	description?: string;
	innerRadius?: number;
	outerRadius?: number;
	height?: number;
	showLegend?: boolean;
	showPercentages?: boolean;
	horizontalLayout?: boolean;
}

export default function CustomPieChart({
	data,
	title,
	description,
	innerRadius = 0,
	outerRadius = 100,
	height = 300,
	showLegend = true,
	showPercentages = true,
	horizontalLayout = false,
}: CustomPieChartProps) {
	const total = data.reduce((sum, entry) => sum + entry.value, 0);

	const renderCustomLegend = () => {
		if (!showLegend) return null;

		return (
			<div className="mt-6 space-y-3">
				{data.map((entry, index) => {
					const percentage =
						total > 0 ? ((entry.value / total) * 100).toFixed(1) : "0.0";
					return (
						<div key={index} className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<div
									className="w-3 h-3 rounded-full flex-shrink-0"
									style={{ backgroundColor: entry.color }}
								/>
								<span className="text-sm text-gray-700">{entry.name}</span>
							</div>
							{showPercentages && (
								<span className="text-sm font-semibold text-gray-900">
									{percentage}%
								</span>
							)}
						</div>
					);
				})}
			</div>
		);
	};

	if (horizontalLayout) {
		return (
			<div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
				<div className="flex items-center justify-between gap-6">
					<div className="flex-1">
						{title && (
							<h3 className="text-xl font-semibold text-gray-900 mb-1">
								{title}
							</h3>
						)}
						{description && (
							<p className="text-xs text-gray-500">{description}</p>
						)}
					</div>

					<div
						className="flex-shrink-0"
						style={{ width: height, height: height }}
					>
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie
									data={data}
									cx="50%"
									cy="50%"
									innerRadius={innerRadius}
									outerRadius={outerRadius}
									paddingAngle={2}
									dataKey="value"
									stroke="none"
								>
									{data.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={entry.color} />
									))}
								</Pie>
							</PieChart>
						</ResponsiveContainer>
					</div>
				</div>

				{renderCustomLegend()}
			</div>
		);
	}

	return (
		<div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
			{title && (
				<h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
			)}
			{description && (
				<p className="text-xs text-gray-500 mb-4">{description}</p>
			)}

			<div className="flex items-center justify-center">
				<ResponsiveContainer width="100%" height={height}>
					<PieChart>
						<Pie
							data={data}
							cx="50%"
							cy="50%"
							innerRadius={innerRadius}
							outerRadius={outerRadius}
							paddingAngle={0}
							dataKey="value"
							stroke="none"
						>
							{data.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={entry.color} />
							))}
						</Pie>
					</PieChart>
				</ResponsiveContainer>
			</div>

			{renderCustomLegend()}
		</div>
	);
}
