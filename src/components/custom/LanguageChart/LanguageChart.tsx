import React from "react";

interface Language {
	name: string;
	value: number;
	color: string;
}

interface LanguageDistributionProps {
	title?: string;
	description?: string;
	data: Language[];
	height?: number;
}

const LanguageChart: React.FC<LanguageDistributionProps> = ({
	title = "Language Distribution",
	description = "Distribution of programming languages across the codebase",
	data,
	height = 40,
}) => {
	const total = data.reduce((sum, lang) => sum + lang.value, 0);

	const languagesWithPercentage = data.map((lang) => ({
		...lang,
		percentage: `${((lang.value / total) * 100).toFixed(1)}%`,
	}));

	return (
		<div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
			<div className="mb-4">
				{title && (
					<h3 className="text-base font-semibold text-gray-900 mb-1">
						{title}
					</h3>
				)}
				{description && <p className="text-xs text-gray-500">{description}</p>}
			</div>

			<div
				className="w-full flex rounded overflow-hidden mb-4"
				style={{ height: `${height}px` }}
			>
				{languagesWithPercentage.map((lang, index) => (
					<div
						key={index}
						style={{
							width: `${(lang.value / total) * 100}%`,
							backgroundColor: lang.color,
						}}
						className="transition-all hover:opacity-80"
						title={`${lang.name}: ${lang.percentage}`}
					/>
				))}
			</div>

			<div className="space-y-2">
				{languagesWithPercentage.map((lang, index) => (
					<div key={index} className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div
								className="w-3 h-3 rounded-full flex-shrink-0"
								style={{ backgroundColor: lang.color }}
							/>
							<span className="text-sm text-gray-700">{lang.name}</span>
						</div>
						<span className="text-sm font-semibold text-gray-900">
							{lang.percentage}
						</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default LanguageChart;
