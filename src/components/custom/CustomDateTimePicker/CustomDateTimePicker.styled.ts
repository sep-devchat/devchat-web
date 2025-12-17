import styled from "styled-components";
import { theme } from "@/themes";

export const Container = styled.div`
	position: relative;
	width: 100%;
`;

export const DateButton = styled.button<{
	disabled: boolean;
	hasValue: boolean;
}>`
	width: 100%;
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding: 0.85rem 1rem;
	border: 1.5px solid ${theme.color.grey200};
	border-radius: 0.75rem;
	background: ${({ disabled }) =>
		disabled ? theme.color.grey100 : theme.color.white};
	color: ${({ hasValue }) =>
		hasValue ? theme.color.grey900 : theme.color.grey400};
	cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
	transition: all 0.2s ease;
	font-weight: 500;
	text-align: left;

	&:hover:not(:disabled) {
		border-color: ${theme.color.primary80};
	}

	&:focus-visible {
		outline: none;
		box-shadow: 0 0 0 3px rgba(25, 82, 179, 0.25);
		border-color: ${theme.color.primary80};
	}

	svg {
		flex-shrink: 0;
		color: ${theme.color.grey500};
	}

	span {
		flex: 1;
	}

	@media (max-width: 1220px) {
		padding: 0.75rem 0.85rem;
		border-radius: 0.6rem;
		font-size: 0.9rem;
	}

	@media (min-width: 1440px) {
		padding: 0.9rem 1rem;
		border-radius: 0.9rem;
		font-size: 0.95rem;
	}

	@media (min-width: 1920px) {
		padding: 1rem 1.1rem;
		font-size: 1rem;
	}
`;

export const ClearButton = styled.button`
	padding: 0.25rem 0.5rem;
	border: none;
	background: transparent;
	color: ${theme.color.grey500};
	cursor: pointer;
	font-size: 1.25rem;
	line-height: 1;
	border-radius: 0.25rem;
	transition: all 0.2s ease;

	&:hover {
		background: ${theme.color.grey100};
		color: ${theme.color.grey900};
	}
`;

export const Overlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(15, 23, 42, 0.45);
	z-index: 10000;
	display: flex;
	align-items: center;
	justify-content: center;
	animation: fadeIn 0.2s ease;

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
`;

export const PickerContainer = styled.div`
	background: ${theme.color.white};
	border-radius: 1.25rem;
	padding: 1.5rem;
	width: min(22rem, 90vw);
	box-shadow: 0 30px 60px rgba(15, 23, 42, 0.25);
	animation: slideIn 0.25s ease;

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(-20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
`;

export const Header = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 1rem;
`;

export const MonthYear = styled.span`
	font-weight: 600;
	color: ${theme.color.grey900};
	font-size: 1rem;
`;

export const NavButton = styled.button`
	border: none;
	background: transparent;
	cursor: pointer;
	padding: 0.4rem;
	display: flex;
	align-items: center;
	color: ${theme.color.grey600};
	border-radius: 0.5rem;
	transition: background 0.2s ease;

	&:hover {
		background: ${theme.color.grey100};
	}

	&:focus-visible {
		outline: none;
		box-shadow: 0 0 0 2px rgba(25, 82, 179, 0.3);
	}
`;

export const DaysGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	gap: 0.35rem;
`;

export const WeekdayHeader = styled.div`
	text-align: center;
	font-weight: 600;
	color: ${theme.color.grey500};
	font-size: 0.85rem;
	padding: 0.5rem 0;
`;

export const DayCell = styled.button<{
	isCurrentMonth: boolean;
	isSelected: boolean;
	isToday: boolean;
}>`
	border: none;
	border-radius: 0.6rem;
	padding: 0.55rem 0;
	font-weight: ${({ isSelected, isToday }) =>
		isSelected || isToday ? 600 : 500};
	cursor: pointer;
	color: ${({ isCurrentMonth, isSelected }) => {
		if (!isCurrentMonth) return theme.color.grey300;
		if (isSelected) return theme.color.white;
		return theme.color.grey900;
	}};
	background: ${({ isSelected, isToday }) => {
		if (isSelected) return theme.color.primary80;
		if (isToday) return theme.color.indigoLight;
		return "transparent";
	}};
	transition: all 0.2s ease;

	&:hover {
		background: ${({ isSelected }) =>
			isSelected ? theme.color.primary80 : theme.color.grey100};
	}

	&:focus-visible {
		outline: none;
		box-shadow: 0 0 0 2px rgba(25, 82, 179, 0.3);
	}
`;

export const TimePickerSection = styled.div`
	margin-top: 1.25rem;
	padding-top: 1.25rem;
	border-top: 1px solid ${theme.color.grey200};
`;

export const TimeLabel = styled.div`
	display: flex;
	align-items: center;
	gap: 0.5rem;
	font-weight: 600;
	color: ${theme.color.grey900};
	margin-bottom: 0.75rem;
	font-size: 0.9rem;

	svg {
		color: ${theme.color.grey500};
	}
`;

export const TimeInputs = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
`;

export const TimeInput = styled.input`
	width: 4rem;
	padding: 0.75rem;
	border: 1.5px solid ${theme.color.grey200};
	border-radius: 0.75rem;
	text-align: center;
	font-size: 1.1rem;
	font-weight: 600;
	color: ${theme.color.grey900};
	transition: all 0.2s ease;

	&:focus {
		outline: none;
		border-color: ${theme.color.primary80};
		box-shadow: 0 0 0 3px rgba(25, 82, 179, 0.1);
	}

	&::-webkit-inner-spin-button,
	&::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	&[type="number"] {
		-moz-appearance: textfield;
	}
`;

export const TimeSeparator = styled.span`
	font-size: 1.5rem;
	font-weight: 700;
	color: ${theme.color.grey500};
`;

export const Footer = styled.div`
	margin-top: 1.25rem;
	padding-top: 1rem;
	border-top: 1px solid ${theme.color.grey200};
	display: flex;
	justify-content: flex-end;
`;

export const FooterButton = styled.button`
	padding: 0.625rem 1.5rem;
	border: none;
	border-radius: 0.625rem;
	background: ${theme.color.primary80};
	color: ${theme.color.white};
	font-weight: 600;
	cursor: pointer;
	transition: all 0.2s ease;

	&:hover {
		background: ${theme.color.primary};
	}

	&:focus-visible {
		outline: none;
		box-shadow: 0 0 0 3px rgba(25, 82, 179, 0.3);
	}
`;
