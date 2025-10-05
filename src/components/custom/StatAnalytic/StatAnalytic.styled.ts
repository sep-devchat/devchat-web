import styled from "styled-components";

interface CardWrapperProps {
	$bgColor: string;
}

interface IconProps {
	$iconColor: string;
}

interface ChangeTextProps {
	$changeType: "positive" | "negative" | "neutral";
}

export const CardWrapper = styled.div<CardWrapperProps>`
	background-color: ${(props) => {
		const colorMap: Record<string, string> = {
			"bg-card-1": "#D3EAF2",
			"bg-card-2": "#FFE58F",
			"bg-card-3": "#FFEBEB",
			"bg-card-4": "#F3F3E0",
		};
		return colorMap[props.$bgColor] || "#D3EAF2";
	}};
	border-radius: 0.5rem;
	padding: 1.5rem;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	transition:
		transform 0.2s,
		box-shadow 0.2s;

	&:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
	}
`;

export const Header = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

export const Title = styled.span`
	font-size: 14px;
	font-weight: 300;
	color: #666666;
`;

export const IconWrapper = styled.div<IconProps>`
	color: ${(props) => {
		const colorMap: Record<string, string> = {
			"icon-card-1": "#34A853",
			"icon-card-2": "#EFB008",
			"icon-card-3": "#C98B64",
			"icon-card-4": "#B8B847",
		};
		return colorMap[props.$iconColor] || "#34A853";
	}};

	svg {
		width: 1.25rem;
		height: 1.25rem;
	}
`;

export const Value = styled.div`
	font-size: 32px;
	font-weight: 700;
	color: #27364b;
	margin-bottom: 0.25rem;
`;

export const ChangeWrapper = styled.div<ChangeTextProps>`
	font-size: 0.875rem;
	font-weight: 500;
	color: ${(props) => {
		const colorMap = {
			positive: "#1CCA93",
			negative: "#D83232",
			neutral: "#4b5563",
		};
		return colorMap[props.$changeType];
	}};
	display: flex;
	align-items: center;
	gap: 0.25rem;

	svg {
		width: 1rem;
		height: 1rem;
	}
`;

export const ChangeLabel = styled.span`
	color: #666666;
	font-weight: 300;
`;
