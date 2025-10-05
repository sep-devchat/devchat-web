import styled from "styled-components";

export const AnalyticsContainer = styled.div`
	min-height: 100vh;
	background-color: transparent;
	padding-left: 24px;
`;

export const AnalyticsHeader = styled.div`
	margin-bottom: 16px;
`;

export const StatsGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 16px;
	margin-bottom: 16px;
`;

export const ChartsGrid = styled.div`
	display: grid;
	grid-template-columns: 2fr 1fr;
	gap: 16px;
	margin-bottom: 16px;

	@media (max-width: 1024px) {
		grid-template-columns: 1fr;
	}
`;

export const TablesGrid = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 16px;

	@media (max-width: 1024px) {
		grid-template-columns: 1fr;
	}
`;

export const Badge = styled.span<{
	variant: "success" | "warning" | "info" | "error";
}>`
	padding: 4px 12px;
	border-radius: 12px;
	font-size: 12px;
	font-weight: 500;
	text-transform: uppercase;

	${(props) => {
		switch (props.variant) {
			case "success":
				return `
          background-color: #B5FFE8;
          color: #1CCA93 ;
        `;
			case "warning":
				return `
          background-color: #FFF7BC ;
          color: #EFB008 ;
        `;
			case "info":
				return `
          background-color: #dbeafe;
          color: #1e40af;
        `;
			case "error":
				return `
          background-color: #FFBCBC ;
          color: #D83232 ;
        `;
		}
	}}
`;

export const ProgressBar = styled.div<{ progress: number; color: string }>`
	width: 100%;
	height: 8px;
	background-color: #e5e7eb;
	border-radius: 4px;
	overflow: hidden;

	&::after {
		content: "";
		display: block;
		width: ${(props) => props.progress}%;
		height: 100%;
		background-color: ${(props) => props.color};
		border-radius: 4px;
		transition: width 0.3s ease;
	}
`;
