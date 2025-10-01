import styled from "styled-components";
import loginBackground from "../../assets/image/loginBackground.png";

export const LayoutContainer = styled.div`
	display: flex;
	min-height: 100vh;
	font-family:
		-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
	background: url(${loginBackground}) no-repeat center center;
	background-size: cover;
	padding: 24px;
`;

export const MainContent = styled.div`
	flex: 1;
	margin-left: 400px;
	display: flex;
	flex-direction: column;
`;

export const ContentArea = styled.main`
	flex: 1;
	overflow: auto;
`;
