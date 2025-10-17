import { Button } from "@/components/ui/button";
import { theme } from "@/themes";
import styled from "styled-components";

export const PageWrapper = styled.div`
	/* Make page fill viewport and center content */
	min-height: 100vh;
	width: 100%;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	padding: 24px 16px;
	z-index: 1;

	@media (min-width: 640px) {
		padding: 32px 24px;
	}
`;

export const ContentCard = styled.div`
	display: flex;
	width: 100%;
	max-width: 640px;
	padding: 40px 32px;
	justify-content: center;
	align-items: center;
	gap: 24px;
	border-radius: 30px;
	flex-direction: column;
	background: transparent;
	box-shadow: none;
	text-align: center;

	@media (min-width: 768px) {
		padding: 56px 64px;
		gap: 30px;
	}

	/* Light theme enforced */
`;

export const TitleGr = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 18px;
	width: 100%;
	max-width: 520px;
`;

export const TitleCard = styled.h1`
	color: ${theme.color.primary90};
	font-size: 32px;
	font-style: normal;
	font-weight: 800;
	line-height: 1.2;

	@media (min-width: 768px) {
		font-size: 40px;
	}
`;

export const SubmitButton = styled(Button)`
	flex: 1 1 0;
	background: ${theme.color.primary90};
	color: #fff;
	padding: 16px 0;
	&:hover {
		color: ${theme.color.primary90};
		border: 1px solid ${theme.color.primary90};
		background: #fff;
	}
`;

export const LoginButton = styled(Button)`
	flex: 1 1 0;

	color: ${theme.color.primary90};
	border: 1px solid ${theme.color.primary90};
	background: #fff;

	padding: 16px 0;
	&:hover {
		background: ${theme.color.primary90};
		color: #fff;
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
	line-height: 150%;
	letter-spacing: 0.16px;
`;

export const BoldText = styled.p`
	color: #666;
	text-align: center;
	font-feature-settings:
		"liga" off,
		"clig" off;
	font-size: 16px;
	font-style: normal;
	font-weight: 700;
	line-height: 150%;
	letter-spacing: 0.16px;
`;

export const ButtonActionGr = styled.div`
	display: flex;
	width: 100%;
	gap: 16px;
	flex-wrap: nowrap;
`;

export const ConfirmImage = styled.img`
	width: 200px;
	height: auto;
	max-width: 60%;
	aspect-ratio: 1 / 1;

	@media (min-width: 768px) {
		width: 240px;
	}
`;
