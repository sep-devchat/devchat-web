import React from "react";
import * as S from "./StatCard.styled";

interface StatCardProps {
	value: string | number;
	label: string;
	trend: number;
	trendDirection: "up" | "down";
	color: "blue" | "red" | "green" | "yellow";
}

export const StatCard: React.FC<StatCardProps> = ({
	value,
	label,
	trend,
	trendDirection,
	color,
}) => {
	return (
		<S.Card>
			<S.TrendContainer>
				<S.TrendValue $direction={trendDirection}>{trend}%</S.TrendValue>
				<S.TrendIcon $direction={trendDirection}>
					{trendDirection === "up" ? "↑" : "↓"}
				</S.TrendIcon>
				<S.TrendText>since last month</S.TrendText>
			</S.TrendContainer>
			<S.ValueContainer $color={color}>
				<S.Value>{value}</S.Value>
				<S.Label>{label}</S.Label>
			</S.ValueContainer>
		</S.Card>
	);
};
