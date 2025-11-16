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
`;

export const HeaderLeft = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
`;

export const HeaderIcon = styled.div`
	width: 32px;
	height: 32px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	color: #1e2a3b;
`;

export const Title = styled.h2`
	margin: 0;
	font-size: 16px;
	font-weight: 600;
	color: #1a1a1a;
`;

export const HeaderRight = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
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
`;

export const TaskCard = styled.div`
	background: white;
	padding: 16px;
	border-radius: 8px;
	margin-bottom: 12px;
	border: 1px solid #e5e7eb;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
	transition: box-shadow 0.2s;
`;

export const TaskHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 8px;
`;

export const TaskTitle = styled.h3`
	margin: 0;
	font-size: 16px;
	font-weight: 600;
	color: #1a1a1a;
`;

export const TaskActions = styled.div`
	display: flex;
	gap: 8px;
`;

export const TaskDescription = styled.p`
	margin: 0 0 12px 0;
	font-size: 14px;
	color: #6b7280;
	line-height: 1.5;
`;

export const TaskBadges = styled.div`
	display: flex;
	gap: 8px;
	flex-wrap: wrap;
	margin-bottom: 12px;
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
`;

export const TaskMeta = styled.div`
	display: flex;
	font-size: 13px;
	color: #6b7280;
	gap: 16px;
	flex-wrap: wrap;
`;

export const MetaItem = styled.span`
	display: flex;
	align-items: center;
	gap: 4px;
`;

export const AvatarImg = styled.img`
	width: 20px;
	height: 20px;
	border-radius: 50%;
	object-fit: cover;
	display: inline-block;
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
`;

export const DialogHeader = styled.div`
	padding: 24px 24px 16px 24px;
	border-bottom: 1px solid #e5e7eb;
`;

export const DialogTitle = styled.h2`
	margin: 0;
	font-size: 18px;
	font-weight: 600;
	color: #1a1a1a;
`;

export const DialogBody = styled.div`
	padding: 24px;
	overflow-y: auto;
	flex: 1;
`;

export const DialogFooter = styled.div`
	padding: 16px 24px;
	border-top: 1px solid #e5e7eb;
	display: flex;
	justify-content: flex-end;
	gap: 8px;
`;

export const WarningBox = styled.div`
	background: #fff6e5;
	border: 1px solid #f1e0b8;
	padding: 12px;
	border-radius: 6px;
	color: #7a5e00;
	font-size: 14px;
	line-height: 1.5;
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
`;

export const FormGroup = styled.div`
	margin-bottom: 16px;
`;

export const FormRow = styled.div`
	display: flex;
	gap: 16px;
`;

export const FormColumn = styled.div`
	flex: 1;
`;

export const Label = styled.label`
	display: block;
	font-size: 14px;
	font-weight: 500;
	color: #374151;
	margin-bottom: 6px;
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

	/* ensure the native calendar icon doesn't overflow the padding */
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

	/* disabled / aria-disabled */
	&:disabled,
	&[aria-disabled="true"] {
		cursor: not-allowed;
		opacity: 0.6;
		border-color: #e5e7eb;
		background: linear-gradient(to bottom, #ffffff, #f9fafb);
		box-shadow: none;
		transform: none;
	}

	/* small devices / long dates handling */
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
`;

export const CalendarHeader = styled.div`
	margin-bottom: 16px;
`;

export const MonthYearNav = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 8px;
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
`;

export const MonthYear = styled.div`
	font-size: 16px;
	font-weight: 600;
	color: #1f2937;
`;

export const CalendarInstruction = styled.div`
	font-size: 12px;
	color: #133e87;
	font-weight: 500;
	text-align: center;
`;

export const WeekDays = styled.div`
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	gap: 4px;
	margin-bottom: 8px;
`;

export const WeekDay = styled.div`
	text-align: center;
	font-size: 12px;
	font-weight: 600;
	color: #6b7280;
	padding: 8px 0;
`;

export const DaysGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	gap: 4px;
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
`;

export const Description = styled.p`
	font-size: 14px;
	color: #6b7280;
	margin: 4px 0 0 0;
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
`;

// ================== Filter Area ================== //

export const FilterArea = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
	width: 100%;
`;

export const FilterRow = styled.div`
	display: flex;
	gap: 12px;
	width: 100%;
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
`;

export const FilterTags = styled.div`
	display: flex;
	gap: 8px;
	flex-wrap: wrap;
	align-items: center;
	margin-left: 8px;
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
`;

export const ChipClose = styled.button`
	background: transparent;
	border: none;
	cursor: pointer;
	padding: 0;
	color: inherit;
	font-size: 14px;
`;

export const NativeSelect = styled.select`
	width: 100%;
	padding: 10px;
	border-radius: 8px;
	border: 1px solid #e5e7eb;
`;

export const NativeDateInput = styled.input`
	width: 100%;
	padding: 10px;
	border-radius: 8px;
	border: 1px solid #e5e7eb;
`;

export const CheckboxLabel = styled.label`
	display: inline-flex;
	gap: 8px;
	align-items: center;
`;

export const SearchContainer = styled.div`
	position: relative;
	width: 100%;
	display: flex;
	gap: 40px;
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
`;

export const SearchClearButton = styled.button`
	border: none;
	background: transparent;
	cursor: pointer;
	padding-left: 8px;
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
`;
