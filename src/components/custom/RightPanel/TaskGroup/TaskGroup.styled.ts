import { theme } from "@/themes";
import styled from "styled-components";

export const PageWrapper = styled.div`
	height: 100%;
	width: 600px;
	position: relative;
	display: flex;
	flex-direction: column;
	margin-right: 18px;
	background: ${theme.color.grey30};
	border-radius: 10px;
	margin-right: 18px;
	margin-left: 12px;

	@media (max-width: 1220px) {
		width: 100%;
		margin: 0;
		border-radius: 0px 10px 10px 0px;
	}

	@media (min-width: 1440px) {
		width: 420px;
		margin-right: 14.4px;
		margin-left: 9.6px;
		border-radius: 8px;
	}

	@media (min-width: 1920px) {
		width: 660px;
		margin-right: 19.8px;
		margin-left: 13.2px;
		border-radius: 11px;
	}
`;

export const Header = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 52px;
	padding: 14px 12px;
	background: ${theme.color.grey30};
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;

	@media (min-width: 1440px) {
		height: 50px;
		border-top-left-radius: 8px;
		border-top-right-radius: 8px;
	}

	@media (min-width: 1920px) {
		height: 52px;
		padding: 15.4px 13.2px;
		border-top-left-radius: 11px;
		border-top-right-radius: 11px;
	}
`;

export const HeaderLeft = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	@media (min-width: 1440px) {
		gap: 6.4px;
	}

	@media (min-width: 1920px) {
		gap: 8.8px;
	}
`;

export const HeaderIcon = styled.div`
	width: 32px;
	height: 32px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	color: #1e2a3b;

	@media (min-width: 1440px) {
		width: 25.6px;
		height: 25.6px;
	}

	@media (min-width: 1920px) {
		width: 35.2px;
		height: 35.2px;
	}
`;

export const Title = styled.h2`
	margin: 0;
	font-size: 16px;
	font-weight: 600;
	color: #1a1a1a;

	@media (min-width: 1440px) {
		font-size: 15px;
	}
	@media (max-width: 1220px) {
		font-size: 14px;
	}

	@media (min-width: 1920px) {
		font-size: 18px;
	}
`;

export const HeaderRight = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;

	@media (min-width: 1440px) {
		gap: 6.4px;
	}

	@media (min-width: 1920px) {
		gap: 8.8px;
	}
`;

export const ContentArea = styled.div`
	height: 100%;
	background: #f9fafb;
	border-bottom-left-radius: 10px;
	border-bottom-right-radius: 10px;
	padding: 16px;
	overflow-y: auto;
	scrollbar-width: thin;
	display: flex;
	flex-direction: column;
	gap: 12px;
	&::-webkit-scrollbar {
		width: 8px;
	}
	&::-webkit-scrollbar-thumb {
		background: #ccc;
		border-radius: 4px;
	}
	&::-webkit-scrollbar-track {
		background: #f1f1f1;
	}

	@media (min-width: 1440px) {
		border-bottom-left-radius: 8px;
		border-bottom-right-radius: 8px;
		padding: 12.8px;
		gap: 1px;
	}
	@media (max-width: 1220px) {
		border-bottom-left-radius: 8px;
		border-bottom-right-radius: 8px;
		padding: 13px;
		gap: 5px;
	}
	@media (min-width: 1920px) {
		border-bottom-left-radius: 11px;
		border-bottom-right-radius: 11px;
		padding: 17.6px;
		gap: 8px;
	}
`;

export const TaskCard = styled.div`
	background: white;
	padding: 16px;
	border-radius: 8px;
	margin-bottom: 12px;
	border: 1px solid #e5e7eb;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
	transition: box-shadow 0.2s;

	@media (min-width: 1440px) {
		padding: 11px;
		border-radius: 6.4px;
		margin-bottom: 9.6px;
	}

	@media (max-width: 1220px) {
		border-radius: 6.4px;
		padding: 12.8px;
		margin-bottom: 3px;
	}

	@media (min-width: 1920px) {
		padding: 14px;
		border-radius: 8px;
		margin-bottom: 5px;
	}
`;

export const TaskHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 8px;

	@media (min-width: 1440px) {
		margin-bottom: -3px;
	}

	@media (max-width: 1220px) {
		margin-bottom: -3px;
	}

	@media (min-width: 1920px) {
		margin-bottom: -3px;
	}
`;

export const TaskTitle = styled.h3`
	margin: 0;
	font-size: 16px;
	font-weight: 600;
	color: #1a1a1a;

	@media (min-width: 1440px) {
		font-size: 15px;
	}

	@media (max-width: 1220px) {
		font-size: 14px;
	}

	@media (min-width: 1920px) {
		font-size: 18px;
	}
`;

export const TaskActions = styled.div`
	display: flex;
	gap: 8px;

	@media (min-width: 1440px) {
		gap: 6.4px;
	}
	@media (max-width: 1220px) {
		gap: -3px;
	}
	@media (min-width: 1920px) {
		gap: 8.8px;
	}
`;

export const TaskDescription = styled.p`
	margin: 0 0 12px 0;
	font-size: 14px;
	color: #6b7280;
	line-height: 1.5;

	@media (min-width: 1440px) {
		margin-bottom: 9.6px;
		font-size: 13px;
	}
	@media (max-width: 1220px) {
		margin-bottom: 9.6px;
		font-size: 12px;
	}
	@media (min-width: 1920px) {
		margin-bottom: 13.2px;
		font-size: 16px;
	}
`;

export const TaskBadges = styled.div`
	display: flex;
	gap: 8px;
	flex-wrap: wrap;
	margin-bottom: 12px;

	@media (min-width: 1440px) {
		gap: 6.4px;
		margin-bottom: 12px;
	}
	@media (max-width: 1220px) {
		gap: 5px;
		margin-bottom: 8px;
	}
	@media (min-width: 1920px) {
		gap: 8.8px;
		margin-bottom: 13.2px;
	}
`;

export const Badge = styled.span<{ bg: string; color: string }>`
	padding: 4px 12px;
	border-radius: 999px;
	font-size: 12px;
	font-weight: 500;
	background: ${(props) => props.bg};
	color: ${(props) => props.color};
	display: inline-flex;
	align-items: center;
	gap: 4px;

	@media (min-width: 1440px) {
		padding: 3.2px 9.6px;
		font-size: 12px;
		gap: 3.2px;
	}

	@media (max-width: 1220px) {
		padding: 4px 10px;
		font-size: 11px;
		gap: 3.2px;
	}

	@media (min-width: 1920px) {
		padding: 4.4px 13.2px;
		font-size: 14px;
		gap: 4.4px;
	}
`;

export const TaskMeta = styled.div`
	display: flex;
	font-size: 13px;
	color: #6b7280;
	gap: 16px;
	flex-wrap: wrap;

	@media (min-width: 1440px) {
		font-size: 12px;
		gap: 16px;
	}

	@media (max-width: 1220px) {
		font-size: 11px;
		gap: 14px;
	}

	@media (min-width: 1920px) {
		font-size: 14px;
		gap: 18px;
	}
`;

export const MetaItem = styled.span`
	display: flex;
	align-items: center;
	gap: 4px;

	@media (min-width: 1440px) {
		gap: 4px;
	}

	@media (min-width: 1920px) {
		gap: 4.4px;
	}
`;

export const AvatarImg = styled.img`
	width: 20px;
	height: 20px;
	border-radius: 50%;
	object-fit: cover;
	display: inline-block;
	@media (min-width: 1440px) {
		width: 22px;
		height: 22px;
	}

	@media (max-width: 1220px) {
		width: 20px;
		height: 20px;
	}

	@media (min-width: 1920px) {
		width: 24px;
		height: 24px;
	}
`;

export const AvatarInitials = styled.div`
	width: 20px;
	height: 20px;
	border-radius: 50%;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	font-size: 12px;
	font-weight: 600;
	color: white;
	background: ${theme.color.primary};

	@media (min-width: 1440px) {
		width: 16px;
		height: 16px;
		font-size: 13px;
	}

	@media (max-width: 1220px) {
		width: 16px;
		height: 16px;
		font-size: 12px;
	}

	@media (min-width: 1920px) {
		width: 22px;
		height: 22px;
		font-size: 16px;
	}
`;

export const DialogOverlay = styled.div<{ open: boolean }>`
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.5);
	display: ${(props) => (props.open ? "flex" : "none")};
	align-items: center;
	justify-content: center;
	z-index: 50;
`;

export const DialogContent = styled.div<{ maxWidth?: string }>`
	background: white;
	border-radius: 8px;
	box-shadow:
		0 20px 25px -5px rgba(0, 0, 0, 0.1),
		0 10px 10px -5px rgba(0, 0, 0, 0.04);
	width: 90%;
	max-width: ${(props) => props.maxWidth || "56rem"};
	min-width: 500px;
	max-height: 90vh;
	display: flex;
	flex-direction: column;
	@media (min-width: 1440px) {
		max-width: 44.8rem;
		min-width: 400px;
		border-radius: 6.4px;
	}

	@media (min-width: 1920px) {
		max-width: 61.6rem;
		min-width: 550px;
		border-radius: 8.8px;
	}
`;

export const DialogHeader = styled.div`
	padding: 24px 24px 16px 24px;
	border-bottom: 1px solid #e5e7eb;
	display: flex;
	justify-content: space-between;
	align-items: center;

	@media (min-width: 1440px) {
		padding: 16px;
	}

	@media (max-width: 1220px) {
		padding: 19.2px 19.2px 12.8px 19.2px;
	}

	@media (min-width: 1920px) {
		padding: 26.4px 26.4px 17.6px 26.4px;
	}
`;

export const DialogTitle = styled.h2`
	margin: 0;
	font-size: 18px;
	font-weight: 600;
	color: #1a1a1a;

	@media (min-width: 1440px) {
		font-size: 15px;
	}

	@media (max-width: 1220px) {
		font-size: 14px;
	}

	@media (min-width: 1920px) {
		font-size: 18px;
	}
`;

export const DialogBody = styled.div`
	padding: 24px;
	overflow-y: auto;
	flex: 1;

	@media (min-width: 1440px) {
		padding: 19.2px;
	}

	@media (min-width: 1920px) {
		padding: 26.4px;
	}
`;

export const DialogFooter = styled.div`
	padding: 16px 24px;
	border-top: 1px solid #e5e7eb;
	display: flex;
	justify-content: flex-end;
	gap: 8px;

	@media (min-width: 1440px) {
		padding: 12.8px 19.2px;
		gap: 6.4px;
	}

	@media (min-width: 1920px) {
		padding: 17.6px 26.4px;
		gap: 8.8px;
	}
`;

export const WarningBox = styled.div`
	background: #fff6e5;
	border: 1px solid #f1e0b8;
	padding: 12px;
	border-radius: 6px;
	color: #7a5e00;
	font-size: 14px;
	line-height: 1.5;

	@media (min-width: 1440px) {
		padding: 9.6px;
		border-radius: 4.8px;
		font-size: 11.2px;
	}

	@media (min-width: 1920px) {
		padding: 13.2px;
		border-radius: 6.6px;
		font-size: 15.4px;
	}
`;

export const Button = styled.button<{
	variant?: "primary" | "ghost" | "destructive";
}>`
	padding: 8px 16px;
	border-radius: 6px;
	font-size: 14px;
	font-weight: 500;
	border: none;
	cursor: pointer;
	display: inline-flex;
	align-items: center;
	gap: 6px;
	transition: all 0.2s;

	${(props) =>
		props.variant === "primary" &&
		`
    background: #133e87;
    color: white;
    &:hover {
      background: #1952b3;
    }
  `}

	${(props) =>
		props.variant === "ghost" &&
		`
    background: transparent;
    color: #6b7280;
    border: 1.5px solid #d1d5db;
    &:hover {
      background: #f3f4f6;
    }
  `}

  ${(props) =>
		props.variant === "destructive" &&
		`
    background: #ef4444;
    color: white;
    &:hover {
      background: #dc2626;
    }
  `}
  
  ${(props) =>
		!props.variant &&
		`
    background: #608BC1;
    color: white;
    &:hover {
      background: #4a6fa0;
    }
  `}

  &:focus {
		outline: none;
	}

	@media (min-width: 1440px) {
		padding: 6.4px 12.8px;
		border-radius: 4.8px;
		font-size: 13px;
		gap: 4.8px;
	}

	@media (max-width: 1220px) {
		padding: 6px 12.4px;
		border-radius: 4.8px;
		font-size: 12px;
		gap: 4px;
	}

	@media (min-width: 1920px) {
		padding: 8.8px 17.6px;
		border-radius: 4.8px;
		font-size: 16px;
		gap: 6.6px;
	}
`;

export const FormGroup = styled.div`
	margin-bottom: 16px;

	@media (min-width: 1440px) {
		margin-bottom: 12.8px;
	}

	@media (min-width: 1920px) {
		margin-bottom: 17.6px;
	}
`;

export const FieldError = styled.p`
	color: ${theme.color.cancel};
	font-size: 0.85rem;
	margin: 0.35rem 0 0;
	font-weight: 500;

	@media (max-width: 1220px) {
		font-size: 0.8rem;
	}

	@media (min-width: 1920px) {
		font-size: 0.95rem;
	}
`;

export const FormRow = styled.div`
	display: flex;
	gap: 16px;
	flex-wrap: wrap;

	@media (min-width: 1440px) {
		gap: 12.8px;
	}

	@media (min-width: 1920px) {
		gap: 17.6px;
	}

	@media (max-width: 768px) {
		flex-direction: column;
		gap: 12px;
	}
`;

export const FormColumn = styled.div`
	flex: 1;
	min-width: 0;

	@media (max-width: 768px) {
		width: 100%;
	}
`;

export const Label = styled.label`
	display: block;
	font-size: 14px;
	font-weight: 500;
	color: #374151;
	margin-bottom: 6px;

	@media (min-width: 1440px) {
		font-size: 13px;
		margin-bottom: 5px;
	}

	@media (max-width: 1220px) {
		font-size: 12px;
		margin-bottom: 5px;
	}

	@media (min-width: 1920px) {
		font-size: 16px;
		margin-bottom: 7px;
	}
`;

export const Input = styled.input`
	width: 100%;
	padding: 10px 14px;
	border: 1.5px solid #e5e7eb;
	border-radius: 8px;
	font-size: 14px;
	font-family: inherit;
	box-sizing: border-box;
	transition: all 0.2s ease;
	background: white;

	&:hover {
		border-color: #608bc1;
		background-color: #f8fafc;
	}

	&:focus {
		outline: none;
		border-color: #608bc1;
		box-shadow: 0 0 0 3px rgba(96, 139, 193, 0.1);
		background-color: white;
	}

	&:disabled {
		background: #f9fafb;
		cursor: not-allowed;
		opacity: 0.6;
	}

	@media (min-width: 1440px) {
		padding: 10px 14px;
		font-size: 11.2px;
		border-radius: 6.4px;
		&::placeholder {
			font-size: 12px;
		}
	}
	@media (max-width: 1220px) {
		padding: 8px 11.2px;
		font-size: 11.2px;
		border-radius: 6.4px;
		&::placeholder {
			font-size: 11px;
		}
	}

	@media (min-width: 1920px) {
		padding: 11px 15.4px;
		font-size: 15.4px;
		border-radius: 8.8px;
		&::placeholder {
			font-size: 14px;
		}
	}
`;

export const TextArea = styled.textarea`
	width: 100%;
	padding: 10px 14px;
	border: 1.5px solid #e5e7eb;
	border-radius: 8px;
	min-height: 100px;
	font-family: inherit;
	font-size: 14px;
	resize: vertical;
	box-sizing: border-box;
	transition: all 0.2s ease;
	background: white;
	line-height: 1.5;

	&:hover {
		border-color: #608bc1;
		background-color: #f8fafc;
	}

	&:focus {
		outline: none;
		border-color: #608bc1;
		box-shadow: 0 0 0 3px rgba(96, 139, 193, 0.1);
		background-color: white;
	}

	@media (min-width: 1440px) {
		padding: 10px 14px;
		border-radius: 6.4px;
		min-height: 80px;
		font-size: 12px;
	}

	@media (max-width: 1220px) {
		padding: 8px 11.2px;
		border-radius: 6.4px;
		min-height: 80px;
		font-size: 11.2px;
	}

	@media (min-width: 1920px) {
		padding: 11px 15.4px;
		border-radius: 8.8px;
		min-height: 110px;
		font-size: 15.4px;
	}
`;

export const SelectWrapper = styled.div`
	position: relative;
`;

export const CustomSelect = styled.div<{ $isOpen: boolean }>`
	width: 100%;
	padding: 12px 40px 12px 16px;
	border: 1.5px solid ${(props) => (props.$isOpen ? "#133e87" : "#e5e7eb")};
	border-radius: 10px;
	font-size: 14px;
	color: #1f2937;
	background: ${(props) =>
		props.$isOpen ? "white" : "linear-gradient(to bottom, #ffffff, #f9fafb)"};
	cursor: pointer;
	transition: all 0.3s ease;
	box-shadow: ${(props) =>
		props.$isOpen
			? "0 0 0 4px rgba(59, 130, 246, 0.12), 0 4px 6px rgba(0, 0, 0, 0.07)"
			: "0 1px 3px rgba(0, 0, 0, 0.05)"};
	user-select: none;
	font-weight: 300 !important;

	&:hover {
		border-color: #133e87;
		background: white;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
		transform: translateY(-1px);
	}

	@media (min-width: 1440px) {
		padding: 9.6px 32px 9.6px 12.8px;
		border-radius: 8px;
		font-size: 11.2px;
	}

	@media (min-width: 1920px) {
		padding: 13.2px 44px 13.2px 17.6px;
		border-radius: 11px;
		font-size: 15.4px;
	}
`;

export const CustomDateInput = styled.input.attrs({ type: "date" })<{
	$isOpen?: boolean;
}>`
	width: 100%;
	padding: 12px 40px 12px 16px;
	border: 1.5px solid ${(props) => (props.$isOpen ? "#133e87" : "#e5e7eb")};
	border-radius: 10px;
	font-size: 14px;
	color: #1f2937;
	background: ${(props) =>
		props.$isOpen ? "white" : "linear-gradient(to bottom, #ffffff, #f9fafb)"};
	cursor: pointer;
	transition: all 0.3s ease;
	box-shadow: ${(props) =>
		props.$isOpen
			? "0 0 0 4px rgba(59, 130, 246, 0.12), 0 4px 6px rgba(0, 0, 0, 0.07)"
			: "0 1px 3px rgba(0, 0, 0, 0.05)"};
	user-select: none;
	font-weight: 300 !important;
	-webkit-appearance: none;
	appearance: none;

	&::-webkit-calendar-picker-indicator {
		position: relative;
		right: 8px;
		opacity: 0.8;
		cursor: pointer;
	}

	&:hover {
		border-color: #133e87;
		background: white;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
		transform: translateY(-1px);
	}

	&:focus {
		outline: none;
		border-color: #0b4fcc;
		box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12);
		background: white;
	}

	&:disabled,
	&[aria-disabled="true"] {
		cursor: not-allowed;
		opacity: 0.6;
		border-color: #e5e7eb;
		background: linear-gradient(to bottom, #ffffff, #f9fafb);
		box-shadow: none;
		transform: none;
	}

	&::placeholder {
		color: #9ca3af;
	}
`;

export const OptionsDropdown = styled.div`
	position: absolute;
	top: calc(100% + 8px);
	left: 0;
	right: 0;
	background: white;
	border: 1.5px solid #e5e7eb;
	border-radius: 12px;
	box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
	z-index: 1000;
	overflow: hidden;
	animation: slideDown 0.2s ease-out;

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (min-width: 1440px) {
		top: calc(100% + 6.4px);
		border-radius: 9.6px;
	}

	@media (min-width: 1920px) {
		top: calc(100% + 8.8px);
		border-radius: 13.2px;
	}
`;

export const Option = styled.div<{ $isSelected: boolean; $isFirst?: boolean }>`
	padding: 12px 16px;
	font-size: 14px;
	color: ${(props) => (props.$isFirst ? "#6b7280" : "#1f2937")};
	font-weight: ${(props) => (props.$isSelected ? "600" : "500")};
	font-style: ${(props) => (props.$isFirst ? "italic" : "normal")};
	background: ${(props) =>
		props.$isSelected ? "linear-gradient(135deg, #133e87, #2563eb)" : "white"};
	color: ${(props) =>
		props.$isSelected ? "white" : props.$isFirst ? "#6b7280" : "#1f2937"};
	cursor: pointer;
	transition: all 0.2s ease;
	margin: 6px 8px;
	border-radius: 8px;
	min-height: 42px;
	display: flex;
	align-items: center;

	&:hover {
		background: ${(props) =>
			props.$isSelected
				? "linear-gradient(135deg, #133e87, #2563eb)"
				: "linear-gradient(to right, #dbeafe, #eff6ff)"};
		color: ${(props) => (props.$isSelected ? "white" : "#1e40af")};
		transform: translateX(4px);
	}

	&:active {
		transform: translateX(4px) scale(0.98);
	}

	@media (min-width: 1440px) {
		padding: 9.6px 12.8px;
		font-size: 11.2px;
		margin: 4.8px 6.4px;
		border-radius: 6.4px;
		min-height: 33.6px;
	}

	@media (min-width: 1920px) {
		padding: 13.2px 17.6px;
		font-size: 15.4px;
		margin: 6.6px 8.8px;
		border-radius: 8.8px;
		min-height: 46.2px;
	}
`;

export const SelectIcon = styled.div<{ $isOpen: boolean }>`
	position: absolute;
	right: 12px;
	top: 50%;
	transform: translateY(-50%)
		rotate(${(props) => (props.$isOpen ? "180deg" : "0deg")});
	color: #6b7280;
	pointer-events: none;
	transition: transform 0.3s ease;
	@media (min-width: 1440px) {
		right: 9.6px;
	}

	@media (min-width: 1920px) {
		right: 13.2px;
	}
`;

export const DateInputWrapper = styled.div`
	position: relative;
`;

export const DateInput = styled.input`
	width: 100%;
	padding: 10px 40px 10px 16px;
	border: 1.5px solid #e5e7eb;
	border-radius: 10px;
	font-size: 14px;
	color: #374151;
	background: white;
	cursor: pointer;
	transition: all 0.2s ease;
	box-sizing: border-box;

	&:hover {
		border-color: #133e87;
		background-color: #f8fafc;
	}

	&:focus {
		outline: none;
		border-color: #133e87;
		box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12);
	}

	@media (min-width: 1440px) {
		padding: 8px 32px 8px 12.8px;
		border-radius: 8px;
		font-size: 11.2px;
	}

	@media (min-width: 1920px) {
		padding: 11px 44px 11px 17.6px;
		border-radius: 11px;
		font-size: 15.4px;
	}
`;

export const CalendarIcon = styled.div`
	position: absolute;
	right: 12px;
	top: 50%;
	transform: translateY(-50%);
	color: #6b7280;
	cursor: pointer;
	transition: color 0.2s;

	&:hover {
		color: #133e87;
	}

	@media (min-width: 1440px) {
		right: 9.6px;
	}

	@media (min-width: 1920px) {
		right: 13.2px;
	}
`;

export const CalendarDropdown = styled.div`
	position: absolute;
	top: calc(100% + 8px);
	left: 0;
	background: white;
	border: 1px solid #e5e7eb;
	border-radius: 12px;
	padding: 16px;
	box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
	z-index: 1000;
	min-width: 440px;
	animation: slideDown 0.2s ease-out;

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (min-width: 1440px) {
		top: calc(100% + 6.4px);
		border-radius: 9.6px;
		padding: 12.8px;
		min-width: 352px;
	}

	@media (min-width: 1920px) {
		top: calc(100% + 8.8px);
		border-radius: 13.2px;
		padding: 17.6px;
		min-width: 484px;
	}
`;

export const CalendarHeader = styled.div`
	margin-bottom: 16px;

	@media (min-width: 1440px) {
		margin-bottom: 12.8px;
	}

	@media (min-width: 1920px) {
		margin-bottom: 17.6px;
	}
`;

export const MonthYearNav = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 8px;

	@media (min-width: 1440px) {
		margin-bottom: 6.4px;
	}

	@media (min-width: 1920px) {
		margin-bottom: 8.8px;
	}
`;

export const NavButton = styled.button`
	background: none;
	border: none;
	color: #6b7280;
	cursor: pointer;
	padding: 4px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 6px;
	transition: all 0.2s;

	&:hover:not(:disabled) {
		background: #f3f4f6;
		color: #133e87;
	}

	&:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	@media (min-width: 1440px) {
		padding: 3.2px;
		border-radius: 4.8px;
	}

	@media (min-width: 1920px) {
		padding: 4.4px;
		border-radius: 6.6px;
	}
`;

export const MonthYear = styled.div`
	font-size: 16px;
	font-weight: 600;
	color: #1f2937;

	@media (min-width: 1440px) {
		font-size: 12.8px;
	}

	@media (min-width: 1920px) {
		font-size: 17.6px;
	}
`;

export const CalendarInstruction = styled.div`
	font-size: 12px;
	color: #133e87;
	font-weight: 500;
	text-align: center;
	@media (min-width: 1440px) {
		font-size: 9.6px;
	}

	@media (min-width: 1920px) {
		font-size: 13.2px;
	}
`;

export const WeekDays = styled.div`
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	gap: 4px;
	margin-bottom: 8px;

	@media (min-width: 1440px) {
		gap: 3.2px;
		margin-bottom: 6.4px;
	}

	@media (min-width: 1920px) {
		gap: 4.4px;
		margin-bottom: 8.8px;
	}
`;

export const WeekDay = styled.div`
	text-align: center;
	font-size: 12px;
	font-weight: 600;
	color: #6b7280;
	padding: 8px 0;
	@media (min-width: 1440px) {
		font-size: 9.6px;
		padding: 6.4px 0;
	}

	@media (min-width: 1920px) {
		font-size: 13.2px;
		padding: 8.8px 0;
	}
`;

export const DaysGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	gap: 4px;

	@media (min-width: 1440px) {
		gap: 3.2px;
	}

	@media (min-width: 1920px) {
		gap: 4.4px;
	}
`;

export const DayCell = styled.div<{
	$isCurrentMonth: boolean;
	$isToday: boolean;
	$isSelected: boolean;
	$isInRange: boolean;
	$isFuture: boolean;
}>`
	aspect-ratio: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 14px;
	border-radius: 8px;
	cursor: ${(props) =>
		props.$isCurrentMonth && !props.$isFuture ? "pointer" : "not-allowed"};
	position: relative;
	color: ${(props) => {
		if (!props.$isCurrentMonth) return "#d1d5db";
		if (props.$isFuture) return "#9ca3af";
		if (props.$isSelected) return "white";
		if (props.$isToday) return "#133e87";
		return "#374151";
	}};
	background: ${(props) => {
		if (props.$isSelected && !props.$isFuture) return "#133e87";
		if (props.$isInRange && !props.$isFuture) return "#dbeafe";
		return "transparent";
	}};
	font-weight: ${(props) => {
		if (props.$isSelected || props.$isToday) return "600";
		return "400";
	}};
	border: ${(props) =>
		props.$isToday && !props.$isSelected ? "2px solid #133e87" : "none"};
	transition: all 0.2s;

	&:hover {
		${(props) =>
			props.$isCurrentMonth &&
			!props.$isSelected &&
			!props.$isFuture &&
			`
      background: #f3f4f6;
      color: #1f2937;
    `}
	}

	@media (min-width: 1440px) {
		font-size: 11.2px;
		border-radius: 6.4px;
	}

	@media (min-width: 1920px) {
		font-size: 15.4px;
		border-radius: 8.8px;
	}
`;

export const HeaderWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 8px;
`;

export const SubTitle = styled.h2`
	font-size: 18px;
	font-weight: 600;
	color: #111827;
	margin: 0;

	@media (min-width: 1440px) {
		font-size: 15px;
	}
	@media (max-width: 1220px) {
		font-size: 14px;
	}

	@media (min-width: 1920px) {
		font-size: 18px;
	}
`;

export const Description = styled.p`
	font-size: 14px;
	color: #6b7280;
	margin: 4px 0 0 0;

	@media (min-width: 1440px) {
		font-size: 13px;
	}
	@media (max-width: 1220px) {
		font-size: 12px;
	}
	@media (min-width: 1920px) {
		font-size: 16px;
		margin: 4.4px 0 0 0;
	}
`;

export const CloseButton = styled.button`
	background: none;
	border: none;
	cursor: pointer;
	padding: 8px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #888;
	transition: color 0.2s;

	&:hover {
		color: #fff;
	}

	&:focus {
		outline: none;
	}

	@media (min-width: 1440px) {
		padding: 6.4px;
	}

	@media (min-width: 1920px) {
		padding: 8.8px;
	}
`;

export const FilterArea = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
	width: 100%;
	@media (min-width: 1440px) {
		gap: 9.6px;
	}

	@media (min-width: 1920px) {
		gap: 13.2px;
	}
`;

export const FilterRow = styled.div`
	display: flex;
	gap: 12px;
	width: 100%;
	@media (min-width: 1440px) {
		gap: 9.6px;
	}

	@media (min-width: 1920px) {
		gap: 13.2px;
	}
`;

export const IconBtn = styled.button`
	background: transparent;
	border: none;
	padding: 6px;
	border-radius: 6px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	color: inherit;
	position: relative;
	transition: background 0.15s ease;
	&:hover {
		background: #f3f4f6;
		outline: none;
	}
	&:focus {
		background: #eff6ff;
		color: #6366f1;
		outline: none;
	}

	@media (min-width: 1440px) {
		padding: 4.8px;
		border-radius: 4.8px;
	}

	@media (min-width: 1920px) {
		padding: 6.6px;
		border-radius: 6.6px;
	}
`;

export const FilterTags = styled.div`
	display: flex;
	gap: 8px;
	flex-wrap: wrap;
	align-items: center;
	margin-left: 8px;

	@media (min-width: 1440px) {
		gap: 6.4px;
		margin-left: 6.4px;
	}

	@media (min-width: 1920px) {
		gap: 8.8px;
		margin-left: 8.8px;
	}
`;

export const FilterChip = styled.div<{ bg?: string; color?: string }>`
	background: ${(props) => props.bg || "#eef2ff"};
	color: ${(props) => props.color || "#4338ca"};
	padding: 6px 10px;
	border-radius: 16px;
	display: inline-flex;
	gap: 8px;
	align-items: center;
	font-size: 13px;

	@media (min-width: 1440px) {
		padding: 4.8px 8px;
		border-radius: 12.8px;
		gap: 6.4px;
		font-size: 10.4px;
	}

	@media (min-width: 1920px) {
		padding: 6.6px 11px;
		border-radius: 17.6px;
		gap: 8.8px;
		font-size: 14.3px;
	}
`;

export const ChipClose = styled.button`
	background: transparent;
	border: none;
	cursor: pointer;
	padding: 0;
	color: inherit;
	font-size: 14px;
	@media (min-width: 1440px) {
		font-size: 11.2px;
	}

	@media (min-width: 1920px) {
		font-size: 15.4px;
	}
`;

export const NativeSelect = styled.select`
	width: 100%;
	padding: 10px;
	border-radius: 8px;
	border: 1px solid #e5e7eb;
	@media (min-width: 1440px) {
		padding: 8px;
		border-radius: 6.4px;
	}

	@media (min-width: 1920px) {
		padding: 11px;
		border-radius: 8.8px;
	}
`;

export const NativeDateInput = styled.input`
	width: 100%;
	padding: 10px;
	border-radius: 8px;
	border: 1px solid #e5e7eb;
	@media (min-width: 1440px) {
		padding: 8px;
		border-radius: 6.4px;
	}

	@media (min-width: 1920px) {
		padding: 11px;
		border-radius: 8.8px;
	}
`;

export const CheckboxLabel = styled.label`
	display: inline-flex;
	gap: 8px;
	align-items: center;
	@media (min-width: 1440px) {
		gap: 6.4px;
	}

	@media (min-width: 1920px) {
		gap: 8.8px;
	}
`;

export const SearchContainer = styled.div`
	position: relative;
	width: 100%;
	display: flex;
	gap: 40px;
	@media (min-width: 1440px) {
		gap: 32px;
	}

	@media (min-width: 1920px) {
		gap: 44px;
	}
`;

export const SearchIconWrapper = styled.div`
	position: absolute;
	left: 12px;
	top: 50%;
	transform: translateY(-50%);
	color: #6b7280;
	pointer-events: none;
	display: flex;
	align-items: center;
	@media (min-width: 1440px) {
		left: 9.6px;
	}

	@media (min-width: 1920px) {
		left: 13.2px;
	}
`;

export const SearchClearButton = styled.button`
	border: none;
	background: transparent;
	cursor: pointer;
	padding-left: 8px;
	@media (min-width: 1440px) {
		padding-left: 6.4px;
	}

	@media (min-width: 1920px) {
		padding-left: 8.8px;
	}
`;

export const SearchInput = styled(Input)<{ prefix?: React.ReactNode }>`
	width: 100%;
	padding-left: 2.25rem;
	padding: 0.5rem 0.75rem;
	border-radius: 0.375rem;
	border: 1px solid rgba(25, 82, 179, 0.21);
	background: rgba(32, 102, 223, 0.09);
	box-shadow: none;

	&:focus {
		outline: none;
		ring: 1px solid rgba(25, 82, 179, 0.21);
	}

	&::placeholder {
		color: #9ca3af;
	}
	@media (min-width: 1440px) {
		padding-left: 1.8rem;
		padding: 0.4rem 0.6rem;
		border-radius: 0.3rem;
	}

	@media (min-width: 1920px) {
		padding-left: 2.475rem;
		padding: 0.55rem 0.825rem;
		border-radius: 0.4125rem;
	}
`;

export const Tag = styled.p`
	font-size: 14px;

	@media (min-width: 1440px) {
		font-size: 13px;
	}

	@media (min-width: 1920px) {
		font-size: 16px;
	}

	@media (max-width: 1220px) {
		font-size: 12px;
	}
`;

export const EmptyStateContainer = styled.div`
	text-align: center;
	padding: 40px;
	color: #6b7280;
`;

export const EmptyStateTitle = styled.div`
	font-size: 18px;
	margin-bottom: 8px;

	@media (max-width: 1220px) {
		font-size: 14px;
	}

	@media (min-width: 1440px) {
		font-size: 15px;
	}

	@media (min-width: 1920px) {
		font-size: 18px;
	}
`;

export const EmptyStateDescription = styled.div`
	font-size: 14px;

	@media (max-width: 1220px) {
		font-size: 12px;
	}

	@media (min-width: 1440px) {
		font-size: 13px;
	}

	@media (min-width: 1920px) {
		font-size: 16px;
	}
`;
