import styled from "styled-components";

export const ChatAreaContainer = styled.div`
	display: grid;
	grid-template-rows: 1fr auto;
	height: 100%;
	background: rgba(255, 255, 255, 0.6);
	border-radius: 10px;
`;

export const MessagesViewport = styled.div`
	overflow-y: auto;
	padding: 12px;
	display: flex;
	flex-direction: column-reverse; /* newest at bottom, scroll upward */
	gap: 8px;
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
`;

export const Composer = styled.form`
	display: flex;
	gap: 8px;
	padding: 10px;
	border-top: 1px solid rgba(0, 0, 0, 0.06);
	background: rgba(255, 255, 255, 0.7);
	border-radius: 0 0 10px 10px;
`;
