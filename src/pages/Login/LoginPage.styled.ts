import styled from "styled-components";

export const LoginContainer = styled.div<{ backgroundImage: string }>`
	min-height: 100vh;
	width: 100%;
	background-image: url(${(props) => props.backgroundImage});
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 40px 24px;
`;

export const ContentContainer = styled.div`
	display: flex;
	width: 100%;
	max-width: 1200px;
	gap: 10px;

	@media (min-width: 1440px) and (max-width: 1919px) {
		max-width: 1000px;
	}

	@media (min-width: 1920px) {
		max-width: 1200px;
	}
`;

export const LoginCard = styled.div`
	flex: 0 0 50%;
	max-width: none;
	padding: 32px 48px;
	background: rgba(255, 255, 255, 0.95);
	backdrop-filter: blur(10px);
	display: flex;
	flex-direction: column;
	justify-content: center;
	border-radius: 16px;
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
	align-self: center;

	@media (max-width: 1220px) {
		margin: 0 auto;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		padding: 16px 28px;
	}

	@media (min-width: 1920px) {
		padding: 24px 32px;
	}

	@media (max-width: 768px) {
		flex: none;
		padding: 24px 32px;
		max-width: 100%;
		min-height: 400px;
	}
`;

export const ImageSection = styled.div<{ backgroundImage: string }>`
	flex: 0 0 50%;
	background-image: url(${(props) => props.backgroundImage});
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	border-radius: 16px;
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
	margin: -15px;
	margin-left: 10px;
	height: 660px;
	transition: opacity 0.3s ease;

	@media (max-width: 768px) {
		flex: none;
		min-height: 300px;
		margin: 10px;
	}

	@media (max-width: 1220px) {
		display: none;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		height: 500px;
	}

	@media (min-width: 1920px) {
		height: 670px;
	}
`;

export const WelcomeTitle = styled.h1`
	font-size: 24px;
	font-weight: 600;
	color: #1a1a1a;
	margin-bottom: 8px;
	line-height: 1.2;

	@media (max-width: 1220px) {
		font-size: 20px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 20px;
	}

	@media (min-width: 1920px) {
		font-size: 22px;
	}
`;

export const WelcomeSubtitle = styled.p`
	font-size: 15px;
	color: #666666;
	margin-bottom: 28px;
	line-height: 1.5;

	@media (max-width: 1220px) {
		font-size: 15px;
		margin-bottom: 10px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 14px;
		margin-bottom: 10px;
	}

	@media (min-width: 1920px) {
		font-size: 17px;
		margin-bottom: 16px;
	}
`;

export const FormGroup = styled.div`
	margin-bottom: 20px;
	position: relative;

	@media (max-width: 1220px) {
		margin-bottom: 10px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		margin-bottom: 10px;
	}

	@media (min-width: 1920px) {
		margin-bottom: 12px;
	}
`;

export const Label = styled.label`
	display: block;
	font-size: 14px;
	font-weight: 500;
	color: #1a1a1a;
	margin-bottom: 6px;

	@media (max-width: 1220px) {
		font-size: 14px;
		margin-bottom: 6px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 13px;
		margin-bottom: 5px;
	}

	@media (min-width: 1920px) {
		font-size: 16px;
		margin-bottom: 8px;
	}
`;

export const Input = styled.input`
	width: 100%;
	padding: 12px 16px;
	border: 1px solid #d1d5db;
	border-radius: 8px;
	font-size: 14px;
	background: #ffffff;
	transition: all 0.2s ease;

	&::placeholder {
		color: #666666;
	}

	&:focus {
		outline: none;
		border-color: #3b82f6;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	&:hover {
		border-color: #9ca3af;
	}

	@media (max-width: 1220px) {
		font-size: 12.5px;
		padding: 10px 12px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 13px;
		padding: 11px 15px;
	}

	@media (min-width: 1920px) {
		font-size: 16px;
		padding: 14px 18px;
	}
`;

export const ForgotPasswordLink = styled.a`
	position: absolute;
	right: 0;
	top: 80px;
	font-size: 12px;
	color: #608bc1;
	text-decoration: none;

	&:hover {
		text-decoration: underline;
	}

	@media (max-width: 1220px) {
		font-size: 13px;
		top: 70px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 12px;
		top: 75px;
	}

	@media (min-width: 1920px) {
		font-size: 14px;
		top: 90px;
	}
`;

export const SignInButton = styled.button`
	width: 100%;
	padding: 12px 24px;
	background: #133e87;
	color: #ffffff;
	border: none;
	border-radius: 8px;
	font-size: 16px;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.2s ease;
	margin-top: 20px;

	&:hover {
		background: #1952b3;
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);
	}

	&:active {
		transform: translateY(0);
	}

	&:disabled {
		background: #9ca3af;
		cursor: not-allowed;
		transform: none;
		box-shadow: none;
	}

	@media (max-width: 1220px) {
		font-size: 16px;
		padding: 12px 22px;
		margin-top: 24px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 15px;
		padding: 11px 22px;
		margin-top: 30px;
	}

	@media (min-width: 1920px) {
		font-size: 18px;
		padding: 14px 28px;
		margin-top: 34px;
	}
`;

export const Divider = styled.div`
	display: flex;
	align-items: center;
	text-align: center;
	margin: 20px 0;
	color: #9ca3af;
	font-size: 14px;

	&::before,
	&::after {
		content: "";
		flex: 1;
		border-bottom: 1px solid #e5e7eb;
	}

	&::before {
		margin-right: 0.75em;
	}

	&::after {
		margin-left: 0.75em;
	}

	@media (max-width: 1220px) {
		font-size: 14px;
		margin: 16px 0;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 13px;
		margin: 18px 0;
	}

	@media (min-width: 1920px) {
		font-size: 16px;
		margin: 24px 0;
	}
`;

export const DividerText = styled.span`
	background: #fff;
`;

export const SocialButton = styled.button`
	width: 100%;
	padding: 10px 16px;
	border: 1px solid #dadce0;
	border-radius: 4px;
	background: #ffffff;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s ease;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 12px;
	margin-bottom: 10px;

	&:hover {
		background: #f0f5fe;
		border-color: #d2e3fc;
	}

	&:active {
		transform: translateY(0);
	}

	@media (max-width: 1220px) {
		font-size: 14px;
		padding: 10px 18px;
		gap: 10px;
		margin-bottom: 8px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 13px;
		padding: 9px 15px;
		gap: 11px;
	}

	@media (min-width: 1920px) {
		font-size: 16px;
		padding: 12px 18px;
		gap: 14px;
		margin-bottom: 12px;
	}
`;

export const GitHubButton = styled(SocialButton)`
	color: #3c4043;
	height: 38px;

	@media (max-width: 1220px) {
		height: 36px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		height: 36px;
	}

	@media (min-width: 1920px) {
		height: 42px;
	}
`;

export const SignUpText = styled.p`
	text-align: center;
	font-size: 14px;
	color: #666666;
	margin-top: 16px;

	@media (max-width: 1220px) {
		font-size: 14px;
		margin-top: 12px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 13px;
		margin-top: 14px;
	}

	@media (min-width: 1920px) {
		font-size: 16px;
		margin-top: 20px;
	}
`;

export const SignUpLink = styled.a`
	color: #608bc1;
	text-decoration: none;
	font-weight: 500;

	&:hover {
		text-decoration: underline;
	}
`;

export const PasswordInputWrapper = styled.div`
	position: relative;
`;

export const EyeIcon = styled.button`
	position: absolute;
	right: 12px;
	top: 50%;
	transform: translateY(-50%);
	background: none;
	border: none;
	cursor: pointer;
	padding: 4px;
	color: #666666;
	display: flex;
	align-items: center;
	justify-content: center;

	&:hover {
		color: #333333;
	}

	&:focus {
		outline: none;
	}

	@media (max-width: 1220px) {
		right: 10px;
		padding: 3px;
	}

	@media (min-width: 1920px) {
		right: 14px;
		padding: 5px;
	}
`;

export const SocialButtonsContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
	width: 100%;
	align-items: stretch;

	@media (max-width: 1220px) {
		gap: 10px;
	}

	@media (min-width: 1920px) {
		gap: 14px;
	}
`;

export const SocialButtonsRow = styled.div`
	display: flex;
	gap: 12px;
	width: 100%;

	@media (max-width: 1220px) {
		gap: 10px;
	}

	@media (min-width: 1920px) {
		gap: 14px;
	}

	@media (max-width: 480px) {
		flex-direction: column;
		gap: 10px;
	}
`;

export const SocialButtonWrapper = styled.div`
	position: relative;
	flex: 1;
	min-width: 0;
`;

export const IconWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
`;

export const GitHubIcon = styled.img`
	width: 18px;
	height: 18px;
	object-fit: contain;

	@media (max-width: 1220px) {
		width: 16px;
		height: 16px;
	}

	@media (min-width: 1920px) {
		width: 20px;
		height: 20px;
	}
`;

export const GoogleLoginWrapper = styled.div`
	width: 100%;
	position: relative;

	& > div {
		width: 100% !important;
		border-radius: 16px !important;
		min-height: 36px !important;
	}

	& button {
		min-height: 36px !important;
		border-radius: 16px !important;
	}

	@media (max-width: 1220px) {
		& > div {
			min-height: 32px !important;
		}
		& button {
			min-height: 32px !important;
		}
	}

	@media (min-width: 1920px) {
		& > div {
			min-height: 40px !important;
		}
		& button {
			min-height: 40px !important;
		}
	}
`;
