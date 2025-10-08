import styled from "styled-components";
import bgImage from "@/assets/image/loginBackground.png";

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

export const ContentWrapper = styled.div`
	flex: 1;
	min-height: 0;
	display: grid;
	grid-template-columns: repeat(12, minmax(0, 1fr));
	gap: 0;
	overflow: hidden;
`;

export const LeftSection = styled.div`
	grid-column: span 2;
	display: flex;
	min-width: 0;
	overflow: hidden;
`;

export const RightSection = styled.div`
	grid-column: span 10;
	display: flex;
	min-height: 0;
	min-width: 0;
	overflow: hidden;
`;

export const CenterPanel = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	min-height: 0;
	min-width: 0;
	overflow: hidden;
`;

export const OutletContainer = styled.div`
	flex: 1;
	min-height: 0;
	overflow: hidden;
	border-radius: 0 0 0.625rem 0;
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
