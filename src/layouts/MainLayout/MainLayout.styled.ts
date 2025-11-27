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

	@media (max-width: 960px) {
		padding: 0 0.5rem;
	}
`;

export const ContentWrapper = styled(ResizablePanelGroup)`
	flex: 1;
	min-height: 0;
	display: flex;
	overflow: hidden;
	align-items: stretch;
	width: 100%;

	@media (max-width: 900px) {
		flex-direction: column;
		gap: 0.5rem;
	}
`;

export const LeftSection = styled.div<{ $isHalf: boolean }>`
	display: flex;
	min-width: 0;
	overflow: hidden;
	flex: 0 0
		${(props) =>
			props.$isHalf
				? "clamp(220px, 32vw, 320px)"
				: "clamp(260px, 18vw, 360px)"};
	max-width: ${(props) =>
		props.$isHalf ? "clamp(240px, 36vw, 360px)" : "clamp(300px, 22vw, 380px)"};
	flex-shrink: 0;
	transition: flex-basis 0.2s ease;

	@media (max-width: 900px) {
		flex: 0 0 100%;
		max-width: 100%;
		order: 2;
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

	@media (max-width: 900px) {
		flex: 1 1 100%;
		order: 1;
	}
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

	@media (max-width: 1100px) {
		border-radius: ${(props) => (props.$fullBleed ? "0" : "10px")};
	}
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
