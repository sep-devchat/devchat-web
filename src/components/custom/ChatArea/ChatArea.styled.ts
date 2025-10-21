import { theme } from "@/themes";
import styled from "styled-components";

export const ChatAreaContainer = styled.div`
	height: 100%;
	background: rgba(255, 255, 255, 0.6);
	border-radius: 10px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	min-height: 0; /* allow the scrolling child to shrink inside flex parents */
	max-height: 100%;
	overflow: hidden; /* keep rounded corners clean */
`;

type Variant = "normal" | "quillCode" | "image" | "file";

export const MessagesViewport = styled.div<{ variant?: Variant }>`
	padding: 0.75rem;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	flex: 1 1 auto;
	min-height: 62vh;
	overflow-y: auto;
	overscroll-behavior: contain;
	max-height: var(--chat-viewport-max-height, 82vh);

	/* variant-specific overrides */
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

	/* Responsive adjustments */
	@media (min-width: 1024px) {
		padding: 1rem;
		gap: 0.625rem;
	}

	@media (min-width: 1440px) {
		padding: 1.25rem;
		gap: 0.75rem;
	}

	/* Cho màn hình rất lớn có thể tăng max-height */
	@media (min-height: 1080px) {
		max-height: var(--chat-viewport-max-height, 85vh);

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
`;

export const Composer = styled.form`
	display: flex;
	gap: 8px;
	padding: 10px;
	border-top: 1px solid rgba(0, 0, 0, 0.06);
	background: rgba(255, 255, 255, 0.7);
	border-radius: 0 0 10px 10px;
	flex: 0 0 auto;
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
`;

export const DividerWrapper = styled.div`
	display: flex;
	align-items: center;
	width: 100%;
	margin-bottom: 24px;
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
`;

export const MessageItem = styled.div`
	max-width: 100%;
	display: flex;
	gap: 8px;

	@media (max-width: 640px) {
		max-width: 82%;
	}
`;

export const MessageBubbleStyle = styled.div`
	&.message-bubble {
		/* common bubble */
		border-radius: 25px;
		padding: 0.5rem 0.75rem;
		max-width: 70%;
		word-break: break-word;
		/* shadow-none already applied by className in JSX, but you can add here if needed */
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
`;
