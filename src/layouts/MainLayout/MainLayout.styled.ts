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

	@media (max-width: 1280px) {
		padding: 0 0.75rem;
	}
`;

export const ContentWrapper = styled(ResizablePanelGroup)`
	flex: 1;
	min-height: 0;
	display: flex;
	overflow: hidden;
	align-items: stretch;
	width: 100%;
`;

export const LeftSection = styled.div<{ $isHalf: boolean }>`
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
	display: flex;
	flex: 1 1 auto;
	min-height: 0;
	min-width: 0;
	overflow: hidden;
	transition: width 0.2s ease;
	position: relative;
`;

export const CenterPanel = styled.div<{
	$isHalf?: boolean;
	$hasRightBorderRadius?: boolean;
	$isCollapsed?: boolean;
}>`
	flex: 1;
	display: flex;
	flex-direction: column;
	min-height: 0;
	min-width: 0;
	overflow: hidden;
	gap: ${(props) => (props.$isCollapsed ? "0.75rem" : "0")};

	${(props) =>
		props.$isCollapsed &&
		`
		position: absolute;
		top: 0;
		left: 0;
		right: ${props.$isHalf ? "16px" : "0"};
		flex: 0 0 auto;
		width: calc(100% - ${props.$isHalf ? "16px" : "0px"});
		pointer-events: none;
		z-index: 5;

		& > * {
			pointer-events: auto;
		}
	`}
`;

export const OutletContainer = styled.div<{
	$hidden?: boolean;
	$fullBleed?: boolean;
}>`
	flex: 1;
	overflow: hidden;
	background: ${(props) => (props.$fullBleed ? "transparent" : "white")};
	display: ${(props) => (props.$hidden ? "none" : "block")};
`;

export const BottomSpacer = styled.div`
	flex: 0 0 auto;
	height: var(--titlebar-height, 1.5rem);
`;

export const RightPanelWrapper = styled.div<{ $fullWidth?: boolean }>`
	height: 100%;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	min-height: 0; /* allow inner flex children to scroll */
	${(props) =>
		props.$fullWidth &&
		`
		flex: 1;
		width: 100%;
	`}
`;

export const CollapsedHeaderBar = styled.div<{ $isCollapsed?: boolean }>`
	background: ${(props) => (props.$isCollapsed ? "#e2e8f0" : "transparent")};
	border-radius: ${(props) => (props.$isCollapsed ? "10px" : "0")};
	box-shadow: ${(props) =>
		props.$isCollapsed ? "0 8px 24px rgba(15, 23, 42, 0.12)" : "none"};
	padding: 0;
	position: ${(props) => (props.$isCollapsed ? "sticky" : "relative")};
	top: ${(props) => (props.$isCollapsed ? "0" : "auto")};
	z-index: ${(props) => (props.$isCollapsed ? 5 : 1)};
`;
