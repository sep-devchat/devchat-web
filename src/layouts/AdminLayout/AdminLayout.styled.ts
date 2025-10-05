import styled from "styled-components";
import loginBackground from "../../assets/image/loginBackground.png";

export const LayoutContainer = styled.div`
	display: flex;
	height: 100vh;
	font-family:
		-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
	background: url(${loginBackground}) no-repeat center center;
	background-size: cover;
	padding: 24px;
	overflow: hidden;
`;

export const MainContent = styled.div`
	flex: 1;
	margin-left: 400px;
	display: flex;
	flex-direction: column;
	height: 100%;
	overflow: hidden;
`;

export const ContentArea = styled.main`
	flex: 1;
	overflow-y: auto;
	min-height: 0;

	scrollbar-width: none;
	-ms-overflow-style: none;

	&::-webkit-scrollbar {
		display: none;
	}
`;
