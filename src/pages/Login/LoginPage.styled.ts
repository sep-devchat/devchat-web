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

	@media (max-width: 768px) {
		flex-direction: column;
		max-width: 400px;
		gap: 16px;
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
	max-height: 600px;
	align-self: center;

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
	height: 670px;

	@media (max-width: 768px) {
		flex: none;
		min-height: 300px;
		margin: 10px;
	}
`;

export const WelcomeTitle = styled.h1`
	font-size: 26px;
	font-weight: 600;
	color: #1a1a1a;
	margin-bottom: 8px;
	line-height: 1.2;
`;

export const WelcomeSubtitle = styled.p`
	font-size: 15px;
	color: #666666;
	margin-bottom: 28px;
	line-height: 1.5;
`;

export const FormGroup = styled.div`
	margin-bottom: 20px;
	position: relative;
`;

export const Label = styled.label`
	display: block;
	font-size: 14px;
	font-weight: 500;
	color: #1a1a1a;
	margin-bottom: 6px;
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
`;

export const GitHubButton = styled(SocialButton)`
	color: #3c4043;
	height: 38px;
`;

export const SignUpText = styled.p`
	text-align: center;
	font-size: 14px;
	color: #666666;
	margin-top: 16px;
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
`;

export const SocialButtonsContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
	width: 100%;
`;

export const SocialButtonsRow = styled.div`
	display: flex;
	gap: 12px;
	width: 100%;

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
`;
