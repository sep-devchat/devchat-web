import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import {
	CardWrapper,
	Header,
	Title,
	IconWrapper,
	Value,
	ChangeWrapper,
	ChangeLabel,
} from "./StatAnalytic.styled";

interface StatCardProps {
	title: string;
	value: string | number;
	change?: string;
	changeType?: "positive" | "negative" | "neutral";
	icon?: LucideIcon;
	iconColor?: string;
	bgColor?: string;
}

export default function StatAnalytic({
	title,
	value,
	change,
	changeType = "positive",
	icon: Icon,
	iconColor = "icon-card-1",
	bgColor = "bg-card-1",
}: StatCardProps) {
	const TrendIcon = changeType === "negative" ? TrendingDown : TrendingUp;

	return (
		<CardWrapper $bgColor={bgColor}>
			<Header>
				<Title>{title}</Title>
				{Icon && (
					<IconWrapper $iconColor={iconColor}>
						<Icon />
					</IconWrapper>
				)}
			</Header>
			<Value>{value}</Value>
			{change && (
				<ChangeWrapper $changeType={changeType}>
					<TrendIcon />
					<span>
						{change} <ChangeLabel>since last month</ChangeLabel>
					</span>
				</ChangeWrapper>
			)}
		</CardWrapper>
	);
}
