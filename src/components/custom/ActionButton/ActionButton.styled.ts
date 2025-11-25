import { theme } from "@/themes";
import styled, { css } from "styled-components";

/* 🧩 Base button styles */
const baseStyles = css`
	padding: 8px 16px;
	border-radius: 6px;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.15s ease;
	border: 1px solid transparent;
	white-space: nowrap;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	min-height: 36px;
`;

/* 🧱 BaseProps to avoid DOM prop leak */
export type BaseProps = {
	$fullWidth?: boolean;
	$variant?: "cancel" | "info" | "save" | "delete";
};

/* 🎯 StyledButton definition */
export const StyledButton = styled.button<BaseProps>`
	${baseStyles}

	${({ $fullWidth }) => $fullWidth && "width: 100%;"}

  /* Cancel variant */
  ${({ $variant }) =>
		$variant === "cancel" &&
		css`
			background: transparent;
			color: ${theme.color.primary};
			border-color: ${theme.color.primary};

			&:hover:not(:disabled) {
				background: ${theme.color.primary20};
			}

			&:focus {
				outline: none;
				box-shadow: 0 0 0 4px ${theme.color.primary20};
			}

			&:disabled {
				color: ${theme.color.grey50};
				cursor: not-allowed;
				opacity: 1;
			}
		`}

  /* Info variant */
  ${({ $variant }) =>
		$variant === "info" &&
		css`
			background: ${theme.color.primary};
			color: #fff;

			&:hover:not(:disabled) {
				background: ${theme.color.primary80};
			}

			&:focus {
				outline: none;
				box-shadow: 0 0 0 4px ${theme.color.primary20};
			}

			&:disabled {
				background: #c7d2fe; /* light indigo */
				color: #3730a3; /* darker indigo text */
				border-color: #c7d2fe;
				cursor: not-allowed;
				opacity: 1;
			}
		`}

  /* Save variant */
  ${({ $variant }) =>
		$variant === "save" &&
		css`
<<<<<<< HEAD
			background: ${theme.color.successBackground} !important;
			color: #fff;

			&:hover:not(:disabled) {
				background: ${theme.color.successBackground80} !important;
=======
			background: ${theme.color.successBackground};
			color: ${theme.color.success};
			border-color: ${theme.color.success};

			&:hover:not(:disabled) {
				background: #d2f7eb;
>>>>>>> fb8e9f9 (feat: report category)
			}

			&:focus {
				outline: none;
				box-shadow: 0 0 0 4px rgba(18, 130, 95, 0.15);
			}

			&:disabled {
				color: ${theme.color.grey50};
				cursor: not-allowed;
				opacity: 1;
			}
		`}

  /* Delete variant */
  ${({ $variant }) =>
		$variant === "delete" &&
		css`
			background: ${theme.color.error};
			color: #fff;

			&:hover:not(:disabled) {
				background: ${theme.color.error60};
			}

			&:focus {
				outline: none;
				box-shadow: 0 0 0 4px rgba(216, 50, 50, 0.15);
			}

			&:disabled {
				color: ${theme.color.grey50};
				cursor: not-allowed;
				opacity: 1;
			}
		`}
`;
