import styled from "styled-components";

export const Card = styled.div`
	background: white;
	border-radius: 12px;
	padding: 16px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	transition:
		transform 0.2s,
		box-shadow 0.2s;

	&:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
	}
`;

export const TrendContainer = styled.div`
	display: flex;
	align-items: center;
	gap: 6px;
`;

export const TrendIcon = styled.span<{ $direction: "up" | "down" }>`
	font-size: 16px;
	color: ${({ $direction }) => ($direction === "up" ? "#1CCA93" : "#D83232")};
`;

export const TrendValue = styled.span<{ $direction: "up" | "down" }>`
	font-size: 18px;
	font-weight: 500;
	color: ${({ $direction }) => ($direction === "up" ? "#1CCA93" : "#D83232")};
`;

export const TrendText = styled.span`
	font-size: 18px;
	font-weight: 100;
	color: #1a1a1a;
`;

export const Value = styled.div`
	font-size: 40px;
	font-weight: 700;
	color: #27364b;
	margin-bottom: 4px;
	line-height: 1;
`;

export const Label = styled.div`
	font-size: 20px;
	color: #666;
	font-weight: 300;
`;

export const ValueContainer = styled.div<{ $color: string }>`
	border-left: 4px solid
		${({ $color }) => {
			switch ($color) {
				case "blue":
					return "#3b82f6";
				case "red":
					return "#ef4444";
				case "green":
					return "#10b981";
				case "yellow":
					return "#f59e0b";
				default:
					return "#3b82f6";
			}
		}};
	padding-left: 16px;
`;
