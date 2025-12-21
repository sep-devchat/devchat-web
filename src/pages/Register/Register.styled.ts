import styled, { keyframes } from "styled-components";

export const RegisterContainer = styled.div<{ backgroundImage: string }>`
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
	width: 100%;
	max-width: 1120px;
	display: grid;
	grid-template-columns: minmax(320px, 0.9fr) minmax(420px, 1.1fr);
	background: rgba(255, 255, 255, 0.92);
	backdrop-filter: blur(12px);
	border-radius: 32px;
	box-shadow: 0 25px 60px rgba(15, 23, 42, 0.18);
	border: 1px solid rgba(255, 255, 255, 0.6);
	overflow: hidden;
	min-height: 620px;

	@media (max-width: 1024px) {
		grid-template-columns: 1fr;
		max-width: 720px;
	}

	@media (max-width: 640px) {
		border-radius: 24px;
		min-height: unset;
	}
`;

export const RegisterCard = styled.div`
	width: 100%;
	padding: 48px 56px;
	background: rgba(255, 255, 255, 0.95);
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 6px;

	@media (max-width: 1280px) {
		padding: 40px;
	}

	@media (max-width: 768px) {
		padding: 32px 28px;
	}

	@media (max-width: 480px) {
		padding: 28px 20px;
	}
`;

export const ImageSection = styled.div<{ backgroundImage: string }>`
	position: relative;
	min-height: 620px;
	background-image:
		linear-gradient(135deg, rgba(7, 13, 30, 0.55), rgba(19, 62, 135, 0.55)),
		url(${(props) => props.backgroundImage});
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	padding: 48px;
	color: #fff;

	@media (max-width: 1280px) {
		padding: 40px;
		min-height: 520px;
	}

	@media (max-width: 1024px) {
		order: -1;
		min-height: 300px;
		padding: 32px 28px;
	}

	@media (max-width: 640px) {
		padding: 24px;
	}
`;

export const HeroTagline = styled.span`
	font-size: 12px;
	letter-spacing: 0.3em;
	text-transform: uppercase;
	color: rgba(255, 255, 255, 0.8);
	margin-bottom: 16px;
`;

export const HeroHeading = styled.h2`
	font-size: 32px;
	font-weight: 600;
	line-height: 1.2;
	margin-bottom: 14px;
`;

export const HeroDescription = styled.p`
	font-size: 16px;
	line-height: 1.5;
	color: rgba(255, 255, 255, 0.9);
	max-width: 360px;
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
	margin-bottom: 10px;
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
		font-size: 16px;
		margin-bottom: 12px;
	}
`;

export const FormGroup = styled.div`
	margin-bottom: 16px;
	position: relative;
	flex: 1;

	@media (max-width: 768px) {
		margin-bottom: 12px;
	}
`;

export const FormRow = styled.div`
	display: flex;
	gap: 12px;

	@media (max-width: 768px) {
		flex-direction: column;
		gap: 10px;
	}
`;

export const Label = styled.label`
	display: block;
	font-size: 14px;
	font-weight: 500;
	color: #1a1a1a;
	margin-bottom: 6px;
	&::after {
		content: " *";
		color: #d83232;
	}

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

export const LabelOption = styled.label`
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
		border-color: #133e87;
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
		padding: 8px 10px;
	}

	@media (min-width: 1920px) {
		font-size: 16px;
		padding: 14px 18px;
	}
`;

export const RegisterButton = styled.button`
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
	margin-top: 10px;

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
		margin-top: 8px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 15px;
		padding: 8px 16px;
	}

	@media (min-width: 1920px) {
		font-size: 18px;
		padding: 14px 28px;
		margin-top: 12px;
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

	// &::before {
	// 	margin-right: 0.75em;
	// }

	// &::after {
	// 	margin-left: 0.75em;
	// }

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
		font-size: 12px;
		padding: 8px 14px;
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
		height: 34px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		height: 36px;
	}

	@media (min-width: 1920px) {
		height: 42px;
	}
`;

export const SignInText = styled.p`
	text-align: center;
	font-size: 14px;
	color: #666666;
	margin-top: 16px;

	@media (max-width: 1220px) {
		font-size: 12px;
		margin-top: 8px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 13px;
		margin-top: 0px;
	}

	@media (min-width: 1920px) {
		font-size: 16px;
		margin-top: 12px;
	}
`;

export const SignInLink = styled.a`
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
`;

export const SocialButtonsRow = styled.div`
	display: flex;
	gap: 12px;
	width: 100%;

	@media (max-width: 480px) {
		flex-direction: column;
		gap: 10px;
	}

	@media (max-width: 1220px) {
		gap: 10px;
	}

	@media (min-width: 1920px) {
		gap: 14px;
	}
`;

export const SocialButtonWrapper = styled.div`
	position: relative;
	flex: 1;
	min-width: 0;

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

export const Select = styled.select<{
	hasError?: boolean;
	isLoading?: boolean;
}>`
	width: 100%;
	padding: 12px 40px 12px 16px;
	border: ${({ hasError }) => (hasError ? "2px" : "1px")} solid
		${({ hasError }) => (hasError ? "#ef4444" : "#d1d5db")};
	border-radius: 8px;
	font-size: 14px;
	background-color: ${({ isLoading }) => (isLoading ? "#f3f4f6" : "#fff")};
	color: ${({ isLoading, value }) => {
		if (isLoading) return "#666666";
		if (!value || value === "") return "#666666";
		return "#1A1A1A";
	}};
	cursor: ${({ isLoading }) => (isLoading ? "not-allowed" : "pointer")};
	outline: none;
	appearance: none;
	background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
	background-position: right 12px center;
	background-repeat: no-repeat;
	background-size: 16px;
	transition: all 0.2s ease-in-out;

	&:focus {
		border-color: ${({ hasError }) => (hasError ? "#ef4444" : "#133e87")};
		box-shadow: 0 0 0 3px
			${({ hasError }) =>
				hasError ? "rgba(239, 68, 68, 0.1)" : "rgba(59, 130, 246, 0.1)"};
	}

	&:hover:not(:disabled) {
		border-color: ${({ hasError }) => (hasError ? "#ef4444" : "#9ca3af")};
	}

	&:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		background-color: #f3f4f6;
	}

	@media (max-width: 1220px) {
		font-size: 12px;
		padding: 10px 36px 10px 14px;
		background-size: 14px;
		background-position: right 10px center;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 13px;
		padding: 11px 38px 11px 15px;
		background-size: 15px;
		background-position: right 11px center;
	}

	@media (min-width: 1920px) {
		font-size: 16px;
		padding: 14px 44px 14px 18px;
		background-size: 18px;
		background-position: right 14px center;
	}

	option {
		color: #1a1a1a;
		background-color: #fff;
		padding: 8px 12px;

		&:first-child {
			color: #9ca3af;
			font-style: italic;
		}

		&:hover {
			background-color: #f3f4f6;
		}

		&:checked,
		&:selected {
			background-color: #133e87;
			color: #fff;
			font-weight: 500;
		}
	}

	&::-webkit-scrollbar {
		width: 8px;
	}

	&::-webkit-scrollbar-track {
		background: #f1f1f1;
		border-radius: 4px;
	}

	&::-webkit-scrollbar-thumb {
		background: #c1c1c1;
		border-radius: 4px;
	}

	&::-webkit-scrollbar-thumb:hover {
		background: #a8a8a8;
	}
`;

export const SelectWrapper = styled.div`
	position: relative;
	width: 100%;

	&::after {
		content: "";
		position: absolute;
		top: 50%;
		right: 12px;
		width: 16px;
		height: 16px;
		transform: translateY(-50%);
		background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
		background-repeat: no-repeat;
		background-position: center;
		background-size: contain;
		pointer-events: none;
		transition: transform 0.2s ease-in-out;
	}

	&:focus-within::after {
		transform: translateY(-50%) rotate(180deg);
	}
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const AvatarUploadContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;

	@media (max-width: 1220px) {
		gap: 12px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		gap: 14px;
	}

	@media (min-width: 1920px) {
		gap: 18px;
	}
`;

export const AvatarUploadBox = styled.div`
	display: flex;
	align-items: center;
	gap: 20px;
	padding: 10px;
	background-color: #fff;
	border-radius: 12px;
	border: 2px dashed #d1d5db;

	@media (max-width: 1220px) {
		gap: 16px;
		padding: 8px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		gap: 18px;
		padding: 9px;
	}

	@media (min-width: 1920px) {
		gap: 24px;
		padding: 12px;
	}

	@media (max-width: 480px) {
		flex-direction: column;
		text-align: center;
		padding: 16px;
	}
`;

export const AvatarPreviewWrapper = styled.div`
	position: relative;
	width: 96px;
	height: 96px;
	flex-shrink: 0;

	@media (max-width: 1220px) {
		width: 80px;
		height: 80px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		width: 88px;
		height: 88px;
	}

	@media (min-width: 1920px) {
		width: 110px;
		height: 110px;
	}
`;

export const AvatarImage = styled.img`
	width: 100%;
	height: 100%;
	border-radius: 50%;
	object-fit: cover;
	border: 3px solid #133e87;
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const RemoveAvatarButton = styled.button`
	position: absolute;
	top: -3px;
	right: -4px;
	width: 28px;
	height: 28px;
	border-radius: 50%;
	background-color: #ef4444;
	border: 2px solid white;
	color: white;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 16px;
	font-weight: bold;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	transition: all 0.2s;

	&:hover:not(:disabled) {
		background-color: #dc2626;
		transform: scale(1.1);
	}

	&:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	@media (max-width: 1220px) {
		width: 24px;
		height: 24px;
		font-size: 14px;
	}

	@media (min-width: 1920px) {
		width: 32px;
		height: 32px;
		font-size: 18px;
	}
`;

export const LoadingOverlay = styled.div`
	position: absolute;
	inset: 0;
	border-radius: 50%;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
`;

export const LoadingSpinner = styled.svg`
	animation: ${spin} 1s linear infinite;
`;

export const DefaultAvatarCircle = styled.div`
	width: 100%;
	height: 100%;
	border-radius: 50%;
	background-color: #e5e7eb;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 3px solid #d1d5db;
`;

export const AvatarUploadInfo = styled.div`
	flex: 1;
`;

export const UploadTitle = styled.div`
	font-size: 14px;
	font-weight: 600;
	color: #1f2937;
	margin-bottom: 4px;

	@media (max-width: 1220px) {
		font-size: 12px;
		margin-bottom: 3px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 13px;
	}

	@media (min-width: 1920px) {
		font-size: 16px;
		margin-bottom: 5px;
	}
`;

export const UploadSubtitle = styled.div`
	font-size: 13px;
	color: #6b7280;
	margin-bottom: 12px;

	@media (max-width: 1220px) {
		font-size: 11px;
		margin-bottom: 8px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 12px;
		margin-bottom: 10px;
	}

	@media (min-width: 1920px) {
		font-size: 15px;
		margin-bottom: 12px;
	}
`;

export const UploadButton = styled.label<{ disabled?: boolean }>`
	display: inline-flex;
	align-items: center;
	gap: 8px;
	padding: 10px 20px;
	font-size: 14px;
	font-weight: 600;
	color: white;
	background-color: #133e87;
	border: none;
	border-radius: 8px;
	cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
	opacity: ${(props) => (props.disabled ? 0.6 : 1)};
	transition: all 0.2s;
	box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);

	&:hover:not([disabled]) {
		background-color: #1952b3;
		transform: translateY(-1px);
		box-shadow: 0 4px 6px rgba(59, 130, 246, 0.4);
	}

	&:active:not([disabled]) {
		transform: translateY(0);
	}

	@media (max-width: 1220px) {
		padding: 8px 16px;
		font-size: 12px;
		gap: 6px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		padding: 9px 18px;
		font-size: 13px;
		gap: 7px;
	}

	@media (min-width: 1920px) {
		padding: 12px 24px;
		font-size: 16px;
		gap: 10px;
	}
`;

export const ProgressContainer = styled.div``;

export const ProgressTitle = styled.div`
	font-size: 14px;
	font-weight: 600;
	color: #1f2937;
	margin-bottom: 8px;

	@media (max-width: 1220px) {
		font-size: 12px;
		margin-bottom: 6px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 13px;
		margin-bottom: 7px;
	}

	@media (min-width: 1920px) {
		font-size: 16px;
		margin-bottom: 10px;
	}
`;

export const ProgressBar = styled.div`
	width: 100%;
	height: 10px;
	background-color: #e5e7eb;
	border-radius: 999px;
	overflow: hidden;
	margin-bottom: 6px;

	@media (max-width: 1220px) {
		height: 8px;
		margin-bottom: 5px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		height: 9px;
	}

	@media (min-width: 1920px) {
		height: 12px;
		margin-bottom: 7px;
	}
`;

export const ProgressFill = styled.div<{ progress: number }>`
	width: ${(props) => props.progress}%;
	height: 100%;
	background-color: #133e87;
	transition: width 0.3s ease;
	border-radius: 999px;
`;

export const ProgressText = styled.div`
	font-size: 12px;
	color: #6b7280;
	font-weight: 500;

	@media (max-width: 1220px) {
		font-size: 10px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 11px;
	}

	@media (min-width: 1920px) {
		font-size: 14px;
	}
`;

export const HiddenFileInput = styled.input`
	display: none;
`;
