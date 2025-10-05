import styled from "styled-components";

export const FilterContainer = styled.div`
	background: white;
	border-radius: 12px;
	padding: 16px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

export const FilterGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 16px;
	margin-bottom: 16px;
`;

export const SelectWrapper = styled.div`
	position: relative;
`;

export const CustomSelect = styled.div<{ $isOpen: boolean }>`
	width: 100%;
	padding: 12px 40px 12px 16px;
	border: 1.5px solid ${(props) => (props.$isOpen ? "#3b82f6" : "#e5e7eb")};
	border-radius: 10px;
	font-size: 14px;
	color: #1f2937;
	background: ${(props) =>
		props.$isOpen ? "white" : "linear-gradient(to bottom, #ffffff, #f9fafb)"};
	cursor: pointer;
	transition: all 0.3s ease;
	font-weight: 500;
	box-shadow: ${(props) =>
		props.$isOpen
			? "0 0 0 4px rgba(59, 130, 246, 0.12), 0 4px 6px rgba(0, 0, 0, 0.07)"
			: "0 1px 3px rgba(0, 0, 0, 0.05)"};
	user-select: none;

	&:hover {
		border-color: #3b82f6;
		background: white;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
		transform: translateY(-1px);
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
		props.$isSelected ? "linear-gradient(135deg, #3b82f6, #2563eb)" : "white"};
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
				? "linear-gradient(135deg, #3b82f6, #2563eb)"
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
	border: 1px solid #d1d5db;
	border-radius: 8px;
	font-size: 14px;
	color: #374151;
	background: white;
	cursor: pointer;
	transition: border-color 0.2s;

	&:hover {
		border-color: #9ca3af;
	}

	&:focus {
		outline: none;
		border-color: #3b82f6;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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
		color: #3b82f6;
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
	min-width: 340px;
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
		color: #3b82f6;
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
	color: #3b82f6;
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
		if (props.$isToday) return "#3b82f6";
		return "#374151";
	}};
	background: ${(props) => {
		if (props.$isSelected && !props.$isFuture) return "#3b82f6";
		if (props.$isInRange && !props.$isFuture) return "#dbeafe";
		return "transparent";
	}};
	font-weight: ${(props) => {
		if (props.$isSelected || props.$isToday) return "600";
		return "400";
	}};
	border: ${(props) =>
		props.$isToday && !props.$isSelected ? "2px solid #3b82f6" : "none"};
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

export const ButtonGroup = styled.div`
	display: flex;
	gap: 12px;
	justify-content: end;
`;

export const ApplyButton = styled.button`
	padding: 10px 24px;
	background: #133e87;
	color: white;
	border: none;
	border-radius: 8px;
	font-size: 14px;
	font-weight: 600;
	cursor: pointer;
	transition: background 0.2s;

	&:hover {
		background: #1f57b8ff;
	}

	&:active {
		transform: scale(0.98);
	}
`;

export const ResetButton = styled.button`
	padding: 10px 24px;
	background: white;
	color: #1a1a1a;
	border: 1px solid #666;
	border-radius: 8px;
	font-size: 14px;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.2s;

	&:hover {
		background: #f9fafb;
		border-color: #9ca3af;
	}

	&:active {
		transform: scale(0.98);
	}
`;
