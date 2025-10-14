import styled from "styled-components";

export const Overlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
`;

export const Modal = styled.div`
	background: white;
	border-radius: 8px;
	padding: 24px;
	max-width: 400px;
	width: 90%;
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const Header = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
	margin-bottom: 16px;
`;

export const IconWrapper = styled.div`
	color: #ef4444;
`;

export const Title = styled.h3`
	font-size: 18px;
	font-weight: 600;
	color: #ef4444;
	margin: 0;
`;

export const Message = styled.p`
	color: #6b7280;
	margin: 0 0 24px 0;
	line-height: 1.5;
`;

export const ButtonGroup = styled.div`
	display: flex;
	gap: 12px;
	justify-content: flex-end;
`;

export const Button = styled.button<{ variant?: "primary" | "secondary" }>`
	padding: 8px 16px;
	border-radius: 6px;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s;
	border: none;

	${(props) =>
		props.variant === "primary"
			? `
    background-color: #ef4444;
    color: white;
    &:hover {
      background-color: #dc2626;
    }
  `
			: `
    background-color: #f3f4f6;
    color: #374151;
    &:hover {
      background-color: #e5e7eb;
    }
  `}

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	&:focus {
		outline: none;
	}
`;
