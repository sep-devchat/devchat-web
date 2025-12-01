import styled from "styled-components";
import { theme } from "@/themes";

export const SelectWrapper = styled.div<{ $disabled: boolean }>`
	position: relative;
	width: 100%;
	opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
`;

export const SelectControl = styled.button<{
	$open: boolean;
	$disabled: boolean;
}>`
	position: relative;
	appearance: none;
	border: none;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 0.5rem;
	width: 100%;
	padding: 0.85rem 3rem 0.85rem 1rem;
	background: ${({ $disabled }) =>
		$disabled ? theme.color.grey100 : theme.color.white};
	border: 1.5px solid
		${({ $open }) => ($open ? theme.color.primary80 : theme.color.grey200)};
	border-radius: 0.75rem;
	cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
	transition:
		border-color 0.2s ease,
		box-shadow 0.2s ease;
	box-shadow: ${({ $open }) =>
		$open
			? "0 0 0 3px rgba(19, 62, 135, 0.15)"
			: "0 1px 2px rgba(15, 23, 42, 0.08)"};
	text-align: left;
	font-size: 0.95rem;

	&:hover {
		border-color: ${({ $disabled }) =>
			$disabled ? theme.color.grey200 : theme.color.primary80};
	}

	&:focus-visible {
		outline: none;
		box-shadow: 0 0 0 3px rgba(25, 82, 179, 0.25);
	}

	@media (max-width: 1220px) {
		padding: 0.75rem 2.75rem 0.75rem 0.85rem;
		border-radius: 0.6rem;
		font-size: 0.9rem;
	}

	@media (min-width: 1440px) {
		padding: 0.9rem 3.1rem 0.9rem 1rem;
		border-radius: 0.9rem;
		font-size: 0.975rem;
	}

	@media (min-width: 1920px) {
		padding: 1rem 3.25rem 1rem 1.1rem;
		font-size: 1rem;
	}
`;

export const ValueText = styled.span<{ $isPlaceholder: boolean }>`
	flex: 1;
	min-width: 0;
	color: ${({ $isPlaceholder }) =>
		$isPlaceholder ? theme.color.grey400 : theme.color.grey900};
	font-weight: 500;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;

export const ActionArea = styled.div`
	display: flex;
	align-items: center;
	gap: 0.25rem;
`;

export const ClearButton = styled.button`
	border: none;
	background: transparent;
	padding: 0.25rem;
	display: flex;
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
`;

export const Chevron = styled.div<{ $open: boolean; $disabled: boolean }>`
	position: absolute;
	right: 1rem;
	top: 50%;
	transform: translateY(-50%)
		rotate(${({ $open }) => ($open ? "180deg" : "0deg")});
	transition: transform 0.25s ease;
	color: ${({ $disabled }) =>
		$disabled ? theme.color.grey400 : theme.color.grey500};
	pointer-events: none;
`;

export const Dropdown = styled.div`
	position: absolute;
	left: 0;
	right: 0;
	margin-top: 0.35rem;
	background: ${theme.color.white};
	border: 1px solid ${theme.color.grey200};
	border-radius: 0.85rem;
	box-shadow: 0 20px 45px rgba(15, 23, 42, 0.12);
	z-index: 20;
	max-height: 14rem;
	overflow-y: auto;
	padding: 0.4rem;
	scrollbar-width: thin;

	@media (max-width: 1220px) {
		border-radius: 0.7rem;
	}

	@media (min-width: 1920px) {
		border-radius: 1rem;
	}
`;

export const Option = styled.div<{ $selected: boolean }>`
	padding: 0.65rem 0.75rem;
	border-radius: 0.6rem;
	font-weight: ${({ $selected }) => ($selected ? 600 : 500)};
	font-size: 0.925rem;
	color: ${({ $selected }) =>
		$selected ? theme.color.white : theme.color.grey900};
	background: ${({ $selected }) =>
		$selected ? theme.color.primary80 : "transparent"};
	cursor: pointer;
	transition:
		background 0.2s ease,
		color 0.2s ease;

	&:hover {
		background: ${({ $selected }) =>
			$selected ? theme.color.primary80 : theme.color.grey100};
	}

	@media (max-width: 1220px) {
		padding: 0.6rem 0.65rem;
		font-size: 0.875rem;
	}

	@media (min-width: 1440px) {
		padding: 0.7rem 0.85rem;
		font-size: 0.95rem;
	}

	@media (min-width: 1920px) {
		padding: 0.8rem 1rem;
		font-size: 1rem;
	}
`;

export const PlaceholderOption = styled(Option)`
	font-style: italic;
	color: ${theme.color.grey500};
	background: transparent;

	&:hover {
		background: ${theme.color.grey100};
	}
`;
