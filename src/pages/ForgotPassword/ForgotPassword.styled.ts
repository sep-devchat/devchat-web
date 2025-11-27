import { Button } from "@/components/ui/button";
import { InputWithLabel } from "@/components/custom/InputLabel/InputLabel";
import { theme } from "@/themes";
import styled from "styled-components";

export const PageWrapper = styled.div`
	height: 100%;
	width: 100%;
	position: relative;
`;

export const ContentCard = styled.div`
	display: flex;
	padding: 60px 100px;
	justify-content: center;
	align-items: center;
	gap: 30px;
	border-radius: 30px;
	background: linear-gradient(
		135deg,
		rgba(255, 255, 255, 0.05) 10%,
		rgba(255, 255, 255, 0.1) 100%
	);
	border: 1px solid rgba(255, 255, 255, 0.45);
	box-shadow: 0 25px 60px rgba(15, 23, 42, 0.16);
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	flex-direction: column;
`;

export const TitleGr = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0px;
`;

export const TitleCard = styled.h1`
	color: ${theme.color.primary90};
	font-size: 58px;
	font-style: normal;
	font-weight: 800;
	line-height: normal;
`;

export const EmailInput = styled(InputWithLabel)`
	width: 100%;
`;

export const SubmitButton = styled(Button)`
	width: 100%;
	background: ${theme.color.primary90};
	color: #fff;
	padding: 16px 0;
	&:hover {
		color: ${theme.color.primary90};
		border: 1px solid ${theme.color.primary90};
		background: #fff;
	}
`;

export const BackText = styled.p`
	color: #666;
	text-align: center;
	font-feature-settings:
		"liga" off,
		"clig" off;
	font-size: 16px;
	font-style: normal;
	font-weight: 400;
	line-height: 100%; /* 16px */
	letter-spacing: 0.16px;
	cursor: pointer;
	&:hover {
		text-decoration: underline;
	}
`;

export const Text = styled.p`
	color: #666;
	text-align: center;
	font-feature-settings:
		"liga" off,
		"clig" off;
	font-size: 16px;
	font-style: normal;
	font-weight: 400;
	line-height: 100%; /* 16px */
	letter-spacing: 0.16px;
`;

export const ResendText = styled.p`
	color: ${theme.color.primary};
	text-align: center;
	font-feature-settings:
		"liga" off,
		"clig" off;
	font-size: 16px;
	font-style: normal;
	font-weight: 400;
	line-height: 100%; /* 16px */
	letter-spacing: 0.16px;
	cursor: pointer;
	&:hover {
		text-decoration: underline;
	}
`;

export const BackArrow = styled.div`
	display: flex;
	padding: 8px;
	justify-content: center;
	align-items: center;
	position: absolute;
	left: 36px;
	top: 31px;
	border-radius: 100px;
	background: ${theme.color.primary90};
	color: #fff;
`;

export const ResendGr = styled.div`
	display: flex;
	gap: 6px;
`;
