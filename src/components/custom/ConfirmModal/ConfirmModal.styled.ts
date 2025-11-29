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

	@media (max-width: 1220px) {
		border-radius: 5.6px;
		padding: 16.8px;
		max-width: 300px;
		box-shadow: 0 2.8px 4.2px rgba(0, 0, 0, 0.1);
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		border-radius: 6.4px;
		padding: 19.2px;
		max-width: 360px;
		box-shadow: 0 3.2px 4.8px rgba(0, 0, 0, 0.1);
	}

	@media (min-width: 1920px) {
		border-radius: 8.8px;
		padding: 26.4px;
		max-width: 480px;
		box-shadow: 0 4.4px 6.6px rgba(0, 0, 0, 0.1);
	}
`;

export const Header = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
	margin-bottom: 16px;

	@media (max-width: 1220px) {
		gap: 8.4px;
		margin-bottom: 11.2px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		gap: 9.6px;
		margin-bottom: 12.8px;
	}

	@media (min-width: 1920px) {
		gap: 13.2px;
		margin-bottom: 17.6px;
	}
`;

export const IconWrapper = styled.div`
	color: #ef4444;
`;

export const Title = styled.h3`
	font-size: 18px;
	font-weight: 600;
	color: #ef4444;
	margin: 0;

	@media (max-width: 1220px) {
		font-size: 14px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 15px;
	}

	@media (min-width: 1920px) {
		font-size: 18px;
	}
`;

export const Message = styled.p`
	color: #6b7280;
	margin: 0 0 24px 0;
	line-height: 1.5;

	@media (max-width: 1220px) {
		margin: 0 0 16.8px 0;
		font-size: 12px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		margin: 0 0 19.2px 0;
		font-size: 13px;
	}

	@media (min-width: 1920px) {
		margin: 0 0 26.4px 0;
		font-size: 16px;
	}
`;

export const ButtonGroup = styled.div`
	display: flex;
	gap: 12px;
	justify-content: flex-end;

	@media (max-width: 1220px) {
		gap: 8.4px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		gap: 9.6px;
	}

	@media (min-width: 1920px) {
		gap: 13.2px;
	}
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

	@media (max-width: 1220px) {
		padding: 5.6px 11.2px;
		border-radius: 4.2px;
		font-size: 12px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		padding: 6.4px 12.8px;
		border-radius: 4.8px;
		font-size: 13px;
	}

	@media (min-width: 1920px) {
		padding: 8.8px 17.6px;
		border-radius: 6.6px;
		font-size: 16px;
	}
`;
