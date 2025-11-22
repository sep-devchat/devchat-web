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
	width: ${(props) => (props.$isHalf ? "25%" : "20%")};
	min-width: ${(props) => (props.$isHalf ? "30%" : "15%")};
	max-width: ${(props) => (props.$isHalf ? "35%" : "25%")};
	flex-shrink: 0;
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

	@media (min-width: 1024px) {
		height: var(--titlebar-height, 2rem);
	}

	@media (min-width: 1440px) {
		height: var(--titlebar-height, 2.5rem);
	}
`;

export const RightPanelWrapper = styled.div<{ $fullWidth?: boolean }>`
	height: 100%;
	display: flex;
	flex-direction: column;
	min-height: 0; /* allow inner flex children to scroll */
	${(props) =>
		props.$fullWidth &&
		`
		flex: 1;
		width: 100%;
	`}
`;
