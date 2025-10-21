import { theme } from "@/themes";
import styled from "styled-components";

export const SectionWrapper = styled.div`
	// position: fixed;
	// top: 50%;
	// left: 50%;
	// transform: translate(-50%, -50%);
	// width: min(720px, 95vw);
	// max-height: calc(100vh - 48px);
	overflow: auto;
	background: var(--card-bg, #fff);
	border-radius: 12px;
	padding: 20px;
	// z-index: 60;
	// box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
	// box-sizing: border-box;
`;

export const TitleArea = styled.div`
	display: flex;
	flex-direction: column;
	gap: 6px;
	margin-bottom: 20px;
`;

export const TitleSection = styled.h2`
	font-weight: 700;
	font-size: 23px;
	color: ${theme.color.black};
`;

export const DescripSection = styled.p`
	font-size: 16px;
	color: ${theme.color.grey90};
`;

export const ContentArea = styled.div`
	display: flex;
	flex-direction: column;
	gap: 32px;
`;
