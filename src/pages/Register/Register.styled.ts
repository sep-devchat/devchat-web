import styled from "styled-components";

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
	display: flex;
	width: 100%;
	max-width: 1200px;
	min-height: 500px;
	gap: 10px;

	@media (max-width: 768px) {
		flex-direction: column;
		max-width: 400px;
		gap: 16px;
	}
`;

export const RegisterCard = styled.div`
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

	@media (max-width: 768px) {
		flex: none;
		padding: 24px 32px;
		max-width: 100%;
		min-height: 400px;
	}
`;

export const ImageSection = styled.div<{ backgroundImage: string }>`
	flex: 0 0 50%;
	min-height: 500px;
	background-image: url(${(props) => props.backgroundImage});
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	border-radius: 16px;
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
	margin: -15px;
	margin-right: 10px;

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
	flex: 1;
`;

export const FormRow = styled.div`
	display: flex;
	gap: 16px;

	@media (max-width: 768px) {
		flex-direction: column;
		gap: 0;
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
`;

export const LabelOption = styled.label`
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

export const SignInText = styled.p`
	text-align: center;
	font-size: 14px;
	color: #666666;
	margin-top: 16px;
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
		border-color: ${({ hasError }) => (hasError ? "#ef4444" : "#3b82f6")};
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
			background-color: #3b82f6;
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
