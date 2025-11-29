import { theme } from "@/themes";
import styled from "styled-components";

export const ChatAreaContainer = styled.div`
	height: 100%;
	background: rgba(255, 255, 255, 0.6);
	border-radius: 10px;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	min-height: 0;
	max-height: 100%;
	overflow: hidden;
	backdrop-filter: blur(6px);

	@media (max-width: 1220px) {
		border-radius: 7px;
	}

	@media (min-width: 1440px) {
		border-radius: 8px;
	}

	@media (min-width: 1920px) {
		border-radius: 11px;
	}
`;

export type MessagesViewportVariant = "normal" | "quillCode" | "image" | "file";

export const MessagesViewport = styled.div<{
	variant?: MessagesViewportVariant;
}>`
	padding: 0.75rem;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	flex: 1 1 auto;
	min-height: 62vh;
	overflow-y: auto;
	overscroll-behavior: contain;
	max-height: var(--chat-viewport-max-height, 82vh);

	${(p) =>
		p.variant === "normal"
			? `max-height: var(--chat-viewport-max-height, 82vh);`
			: p.variant === "quillCode"
				? `max-height: var(--chat-viewport-max-height, 76vh);`
				: p.variant === "image"
					? `max-height: var(--chat-viewport-max-height, 72vh);`
					: p.variant === "file"
						? `max-height: var(--chat-viewport-max-height, 77vh);`
						: ""}

	@media (max-width: 1220px) {
		padding: 0.525rem;
		gap: 0.35rem;
		min-height: 43.4vh;

		${(p) =>
			p.variant === "quillCode"
				? `max-height: var(--chat-viewport-max-height, 53.2vh);`
				: p.variant === "image"
					? `max-height: var(--chat-viewport-max-height, 50.4vh);`
					: p.variant === "file"
						? `max-height: var(--chat-viewport-max-height, 53.9vh);`
						: ""}
	}

	@media (min-width: 1024px) {
		padding: 1rem;
		gap: 0.625rem;
	}

	@media (min-width: 1440px) {
		padding: 0.8rem;
		gap: 0.5rem;
		min-height: 49.6vh;

		${(p) =>
			p.variant === "quillCode"
				? `max-height: var(--chat-viewport-max-height, 60.8vh);`
				: p.variant === "image"
					? `max-height: var(--chat-viewport-max-height, 57.6vh);`
					: p.variant === "file"
						? `max-height: var(--chat-viewport-max-height, 61.6vh);`
						: ""}
	}

	@media (min-width: 1920px) {
		padding: 1.375rem;
		gap: 0.825rem;
		min-height: 68.2vh;

		${(p) =>
			p.variant === "quillCode"
				? `max-height: var(--chat-viewport-max-height, 83.6vh);`
				: p.variant === "image"
					? `max-height: var(--chat-viewport-max-height, 79.2vh);`
					: p.variant === "file"
						? `max-height: var(--chat-viewport-max-height, 84.7vh);`
						: ""}
	}

	/* Cho màn hình rất lớn có thể tăng max-height */
	@media (min-height: 1080px) {
		${(p) =>
			p.variant === "quillCode"
				? `max-height: var(--chat-viewport-max-height, 79vh);`
				: p.variant === "image"
					? `max-height: var(--chat-viewport-max-height, 75vh);`
					: p.variant === "file"
						? `max-height: var(--chat-viewport-max-height, 80vh);`
						: ""}
	}
`;

export const MessageRow = styled.div<{ $mine?: boolean }>`
	display: flex;
	justify-content: ${({ $mine }) => ($mine ? "flex-end" : "flex-start")};
`;

export const Bubble = styled.div<{ $mine?: boolean }>`
	max-width: 70%;
	padding: 8px 12px;
	border-radius: 14px;
	background: ${({ $mine }) =>
		$mine ? "hsl(var(--primary))" : "hsl(var(--secondary))"};
	color: ${({ $mine }) =>
		$mine ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))"};
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
	word-break: break-word;
	overflow-wrap: anywhere;

	@media (max-width: 1220px) {
		padding: 5.6px 8.4px;
		border-radius: 9.8px;
		box-shadow: 0 0.7px 1.4px rgba(0, 0, 0, 0.08);
	}

	@media (min-width: 1440px) {
		padding: 6.4px 9.6px;
		border-radius: 11.2px;
		box-shadow: 0 0.8px 1.6px rgba(0, 0, 0, 0.08);
	}

	@media (min-width: 1920px) {
		padding: 8.8px 13.2px;
		border-radius: 15.4px;
		box-shadow: 0 1.1px 2.2px rgba(0, 0, 0, 0.08);
	}
`;

export const Composer = styled.form`
	display: flex;
	gap: 8px;
	padding: 10px;
	border-top: 1px solid rgba(0, 0, 0, 0.06);
	background: rgba(255, 255, 255, 0.7);
	border-radius: 0 0 10px 10px;
	flex: 0 0 auto;

	@media (max-width: 1220px) {
		gap: 5.6px;
		padding: 7px;
		border-radius: 0 0 7px 7px;
	}

	@media (min-width: 1440px) {
		padding: 8px;
		border-radius: 0 0 8px 8px;
	}

	@media (min-width: 1920px) {
		gap: 8.8px;
		padding: 11px;
		border-radius: 0 0 11px 11px;
	}
`;

export const Input = styled.input`
	width: 100%;
	padding: 8px 12px;
	border: 1px solid ${theme.color.grey300};
	border-radius: 6px;
	background: ${theme.color.white};
	font-size: 14px;
	color: #1a1a1a;
	outline: none;

	&:focus {
		border-color: ${theme.color.indigo};
		box-shadow: 0 0 0 3px ${theme.color.indigoLight};
	}

	&::placeholder {
		color: ${theme.color.grey400};
	}

	@media (max-width: 1220px) {
		padding: 5.6px 8.4px;
		border-radius: 4.2px;
		font-size: 14px;

		&:focus {
			box-shadow: 0 0 0 2.1px ${theme.color.indigoLight};
		}
	}

	@media (min-width: 1440px) {
		padding: 6.4px 9.6px;
		border-radius: 4.8px;
		font-size: 15px;

		&:focus {
			box-shadow: 0 0 0 2.4px ${theme.color.indigoLight};
		}
	}

	@media (min-width: 1920px) {
		padding: 8.8px 13.2px;
		border-radius: 6.6px;
		font-size: 18px;

		&:focus {
			box-shadow: 0 0 0 3.3px ${theme.color.indigoLight};
		}
	}
`;

export const InputContainer = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	background: ${theme.color.white};
	border: 1px solid ${theme.color.grey300};
	border-radius: 24px;
	padding: 8px 16px;
	width: 100%;

	${Input} {
		border: none;
		padding: 0;
		background: transparent;

		&:focus {
			box-shadow: none;
		}
	}

	@media (max-width: 1220px) {
		gap: 5.6px;
		border-radius: 16.8px;
		padding: 5.6px 11.2px;
	}

	@media (min-width: 1440px) {
		gap: 6.4px;
		border-radius: 19.2px;
		padding: 6.4px 12.8px;
	}

	@media (min-width: 1920px) {
		gap: 8.8px;
		border-radius: 26.4px;
		padding: 8.8px 17.6px;
	}
`;

export const IconButton = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 4px;
	background: none;
	border: none;
	color: ${theme.color.grey400};
	cursor: pointer;
	border-radius: 4px;

	&:hover {
		color: ${theme.color.grey600};
		background: ${theme.color.grey100};
	}

	@media (max-width: 1220px) {
		padding: 2.8px;
		border-radius: 2.8px;
	}

	@media (min-width: 1440px) {
		padding: 3.2px;
		border-radius: 3.2px;
	}

	@media (min-width: 1920px) {
		padding: 4.4px;
		border-radius: 4.4px;
	}
`;

export const DividerWrapper = styled.div`
	display: flex;
	align-items: center;
	width: 100%;
	margin-bottom: 24px;

	@media (max-width: 1220px) {
		margin-bottom: 16.8px;
	}

	@media (min-width: 1440px) {
		margin-bottom: 19.2px;
	}

	@media (min-width: 1920px) {
		margin-bottom: 26.4px;
	}
`;

export const Line = styled.div`
	flex-grow: 1;
	border-top: 1px solid #d1d5db;
`;

export const DateText = styled.span`
	margin: 0 16px;
	color: #374151;
	font-weight: 400;
	font-size: 12px;

	@media (max-width: 1220px) {
		margin: 0 11.2px;
		font-size: 12px;
	}

	@media (min-width: 1440px) {
		margin: 0 12.8px;
		font-size: 13px;
	}

	@media (min-width: 1920px) {
		margin: 0 17.6px;
		font-size: 16px;
	}
`;

export const MessageItem = styled.div`
	max-width: 100%;
	display: flex;
	gap: 8px;

	@media (max-width: 640px) {
		max-width: 88%;
	}

	@media (max-width: 1220px) {
		gap: 5.6px;
	}

	@media (min-width: 1440px) {
		gap: 6.4px;
	}

	@media (min-width: 1920px) {
		gap: 8.8px;
	}
`;

export const MessageBubbleStyle = styled.div`
	&.message-bubble {
		border-radius: 25px;
		padding: 0.5rem 0.75rem;
		max-width: max-content;
		word-break: break-word;
	}

	&.message-bubble.me {
		background: ${theme.color.primary20};
		align-self: flex-end;
	}

	&.message-bubble.other {
		background: #eff2f5;
		color: inherit;
		align-self: flex-start;
	}

	@media (max-width: 1220px) {
		&.message-bubble {
			border-radius: 17.5px;
			padding: 0.35rem 0.525rem;
			font-size: 11px;
		}
	}

	@media (min-width: 1440px) {
		&.message-bubble {
			border-radius: 20px;
			padding: 0.4rem 0.6rem;
			font-size: 12px;
		}
	}

	@media (min-width: 1920px) {
		&.message-bubble {
			border-radius: 27.5px;
			padding: 0.55rem 0.825rem;
			font-size: 14px;
		}
	}
`;
