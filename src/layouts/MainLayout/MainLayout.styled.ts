import styled from "styled-components";
import bgImage from "@/assets/image/loginBackground.png";
import { ResizablePanelGroup, ResizablePanel } from "@/components/ui/resizable";

export const MainLayoutContainer = styled.div`
	height: 100vh;
	width: 100vw;
	overflow: hidden;
	background-image: url(${bgImage});
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	display: flex;
	flex-direction: column;
	padding: 0 1rem;
	box-sizing: border-box;
	padding-right: 0;
`;

export const ContentWrapper = styled(ResizablePanelGroup)`
	flex: 1;
	min-height: 0;
	display: grid;
	grid-template-columns: repeat(12, minmax(0, 1fr));
	gap: 0;
	overflow: hidden;
`;

export const LeftSection = styled.div<{ $isHalf: boolean }>`
	grid-column: span 2;
	display: flex;
	min-width: 0;
	overflow: hidden;
	flex-shrink: 0;

	width: ${(props) => (props.$isHalf ? "30%" : "25%")};
	min-width: ${(props) => (props.$isHalf ? "35%" : "30%")};
	max-width: ${(props) => (props.$isHalf ? "40%" : "30%")};

	@media (max-width: 1220px) {
		width: ${(props) => (props.$isHalf ? "30%" : "25%")};
		min-width: ${(props) => (props.$isHalf ? "35%" : "30%")};
		max-width: ${(props) => (props.$isHalf ? "40%" : "30%")};
	}

	@media (min-width: 1440px) {
		width: ${(props) => (props.$isHalf ? "20%" : "26%")};
		min-width: ${(props) => (props.$isHalf ? "24%" : "12%")};
		max-width: ${(props) => (props.$isHalf ? "28%" : "22%")};
	}

	@media (min-width: 1920px) {
		width: ${(props) => (props.$isHalf ? "27.5%" : "22%")};
		min-width: ${(props) => (props.$isHalf ? "33%" : "16.5%")};
		max-width: ${(props) => (props.$isHalf ? "38.5%" : "27.5%")};
	}
`;

export const RightSection = styled(ResizablePanel)`
	grid-column: span 10;
	display: flex;
	min-height: 0;
	min-width: 0;
	overflow: hidden;
`;

export const CenterPanel = styled.div<{
	$isHalf?: boolean;
	$hasRightBorderRadius?: boolean;
}>`
	flex: 1;
	display: flex;
	flex-direction: column;
	min-height: 0;
	min-width: 0;
	overflow: hidden;

	/* Base border radius: 10px */
	border-top-right-radius: ${(props) => {
		if (props.$isHalf) return "10px";
		if (props.$hasRightBorderRadius === true) return "10px";
		return "0";
	}};

	border-bottom-right-radius: ${(props) => {
		if (props.$isHalf) return "10px";
		if (props.$hasRightBorderRadius === true) return "10px";
		return "0";
	}};
`;

export const OutletContainer = styled.div`
	flex: 1;
	overflow: hidden;
	background: white;
`;

export const BottomSpacer = styled.div`
	flex: 0 0 auto;
	height: var(--titlebar-height, 1.5rem);
`;

export const RightPanelWrapper = styled.div<{ $fullWidth?: boolean }>`
	height: 100%;
	display: flex;
	flex-direction: column;
	min-height: 0;
	${(props) =>
		props.$fullWidth &&
		`
		flex: 1;
		width: 100%;
	`}

	/* Base font size */
	font-size: 16px;
`;
