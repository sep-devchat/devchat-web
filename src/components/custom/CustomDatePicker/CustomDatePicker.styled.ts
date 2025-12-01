import styled from "styled-components";
import { theme } from "@/themes";

export const DatePickerWrapper = styled.div`
	position: relative;
	width: 100%;
`;

export const DateInput = styled.input<{
	$open: boolean;
	$disabled: boolean;
}>`
	width: 100%;
	padding: 0.85rem 3rem 0.85rem 1rem;
	border: 1.5px solid
		${({ $open }) => ($open ? theme.color.primary80 : theme.color.grey200)};
	border-radius: 0.75rem;
	color: ${theme.color.grey900};
	background: ${({ $disabled }) =>
		$disabled ? theme.color.grey100 : theme.color.white};
	cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
	transition:
		border-color 0.2s ease,
		box-shadow 0.2s ease;
	box-shadow: ${({ $open }) =>
		$open
			? "0 0 0 3px rgba(19, 62, 135, 0.1)"
			: "0 1px 2px rgba(15, 23, 42, 0.08)"};
	outline: none;
	font-weight: 500;

	&::placeholder {
		color: ${theme.color.grey400};
	}

	&:focus-visible {
		box-shadow: 0 0 0 3px rgba(25, 82, 179, 0.25);
	}

	@media (max-width: 1220px) {
		padding: 0.75rem 2.5rem 0.75rem 0.85rem;
		border-radius: 0.6rem;
		font-size: 0.9rem;
	}

	@media (min-width: 1440px) {
		padding: 0.9rem 3rem 0.9rem 1rem;
		border-radius: 0.9rem;
		font-size: 0.95rem;
	}

	@media (min-width: 1920px) {
		padding: 1rem 3.25rem 1rem 1.1rem;
		font-size: 1rem;
	}
`;

export const IconButton = styled.button<{ $hidden?: boolean }>`
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	border: none;
	background: transparent;
	padding: 0.35rem;
	display: ${({ $hidden }) => ($hidden ? "none" : "flex")};
	align-items: center;
	justify-content: center;
	cursor: pointer;
	color: ${theme.color.grey500};
	border-radius: 50%;
	transition:
		background 0.2s ease,
		color 0.2s ease;

	&:hover {
		background: ${theme.color.grey100};
		color: ${theme.color.grey900};
	}

	&:focus-visible {
		outline: none;
		box-shadow: 0 0 0 2px rgba(25, 82, 179, 0.3);
	}

	&:disabled {
		cursor: not-allowed;
		color: ${theme.color.grey300};
	}
`;

export const CalendarButton = styled(IconButton)`
	right: 0.75rem;
`;

export const Backdrop = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(15, 23, 42, 0.45);
	z-index: 10000;
	animation: fadeIn 0.2s ease;
`;

export const Modal = styled.div`
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background: ${theme.color.white};
	border-radius: 1.25rem;
	padding: 1.5rem 1.75rem 1.75rem;
	width: min(22rem, 90vw);
	z-index: 10001;
	box-shadow: 0 30px 60px rgba(15, 23, 42, 0.25);
	animation: slideIn 0.25s ease;
`;

export const ModalHeader = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 0.75rem;
`;

export const MonthLabel = styled.span`
	font-weight: 600;
	color: ${theme.color.grey900};
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
`;

export const Subtitle = styled.p`
	margin: 0 0 1rem;
	text-align: center;
	color: ${theme.color.grey500};
	font-size: 0.9rem;
`;

export const WeekdayGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	gap: 0.35rem;
	margin-bottom: 0.35rem;
`;

export const WeekdayCell = styled.div`
	text-align: center;
	font-weight: 600;
	color: ${theme.color.grey500};
	font-size: 0.85rem;
`;

export const DayGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	gap: 0.35rem;
`;

export const DayCell = styled.button<{
	$isCurrent: boolean;
	$isDisabled: boolean;
	$isSelected: boolean;
	$isToday: boolean;
}>`
	border: none;
	border-radius: 0.6rem;
	padding: 0.55rem 0;
	font-weight: ${({ $isSelected, $isToday }) =>
		$isSelected || $isToday ? 600 : 500};
	cursor: ${({ $isDisabled }) => ($isDisabled ? "not-allowed" : "pointer")};
	color: ${({ $isCurrent, $isDisabled, $isSelected }) => {
		if (!$isCurrent) return theme.color.grey300;
		if ($isDisabled) return theme.color.grey400;
		if ($isSelected) return theme.color.white;
		return theme.color.grey900;
	}};
	background: ${({ $isSelected, $isToday }) => {
		if ($isSelected) return theme.color.primary80;
		if ($isToday) return theme.color.indigoLight;
		return "transparent";
	}};
	opacity: ${({ $isDisabled }) => ($isDisabled ? 0.6 : 1)};
	transition:
		background 0.2s ease,
		color 0.2s ease;

	&:hover {
		background: ${({ $isDisabled, $isSelected }) =>
			$isDisabled
				? "transparent"
				: $isSelected
					? theme.color.primary80
					: theme.color.grey100};
	}
`;

export const ModalActions = styled.div`
	display: flex;
	justify-content: flex-end;
	margin-bottom: 0.5rem;
`;

export const ClearActionButton = styled.button`
	border: none;
	background: transparent;
	color: ${theme.color.grey600};
	font-weight: 600;
	cursor: pointer;
	padding: 0.25rem 0.5rem;
	border-radius: 0.4rem;
	transition:
		color 0.2s ease,
		background 0.2s ease;

	&:hover {
		color: ${theme.color.primary80};
		background: ${theme.color.grey100};
	}

	&:focus-visible {
		outline: none;
		box-shadow: 0 0 0 2px rgba(25, 82, 179, 0.3);
	}
`;

export const AnimationStyles = `
	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translate(-50%, -45%);
		}
		to {
			opacity: 1;
			transform: translate(-50%, -50%);
		}
	}
`;
