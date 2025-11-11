// SimplifiedChatArea/SimplifiedChatArea.styled.ts
import styled from "styled-components";

export const Container = styled.div`
	height: 100%;
	display: flex;
	flex-direction: column;
	background: linear-gradient(to bottom, #f7f9fc, #e8f0fc);
`;

export const MessagesContainer = styled.div`
	flex: 1;
	overflow-y: auto;
	padding: 1.5rem;
	display: flex;
	flex-direction: column;
	gap: 1rem;

	&::-webkit-scrollbar {
		width: 8px;
	}

	&::-webkit-scrollbar-track {
		background: rgba(209, 224, 253, 0.3);
		border-radius: 4px;
	}

	&::-webkit-scrollbar-thumb {
		background: rgba(166, 194, 242, 0.5);
		border-radius: 4px;
		transition: background 0.2s;

		&:hover {
			background: rgba(166, 194, 242, 0.7);
		}
	}
`;

export const DateDivider = styled.div`
	display: flex;
	align-items: center;
	gap: 0.75rem;
	margin: 1rem 0;
`;

export const DateLine = styled.div`
	flex: 1;
	height: 1px;
	background: linear-gradient(
		to right,
		transparent,
		rgba(166, 194, 242, 0.3),
		transparent
	);
`;

export const DateText = styled.span`
	font-size: 0.75rem;
	font-weight: 500;
	color: #6b7c93;
	padding: 0.25rem 0.75rem;
	background: rgba(209, 224, 253, 0.3);
	border-radius: 12px;
	white-space: nowrap;
`;

export const MessageGroup = styled.div`
	display: flex;
	flex-direction: column;
`;

export const MessageRow = styled.div<{ $isCurrentUser: boolean }>`
	display: flex;
	align-items: flex-start;
	gap: 0.75rem;
	margin-bottom: 0.625rem;
	flex-direction: ${(props) => (props.$isCurrentUser ? "row-reverse" : "row")};
`;

export const Avatar = styled.div<{ $hasImage?: boolean }>`
	width: 2.5rem;
	height: 2.5rem;
	border-radius: 50%;
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 0.875rem;
	font-weight: 600;
	color: #ffffff;
	background: ${(props) =>
		props.$hasImage
			? "transparent"
			: "linear-gradient(135deg, #7B9FE8 0%, #A6C2F2 50%, #F5E6D3 100%)"};
	box-shadow: 0 2px 8px rgba(123, 159, 232, 0.25);
	transition: all 0.2s;
`;

export const AvatarImage = styled.img`
	width: 100%;
	height: 100%;
	border-radius: 50%;
	object-fit: cover;
`;

export const AvatarSpacer = styled.div`
	width: 2.5rem;
	height: 2.5rem;
	flex-shrink: 0;
`;

export const MessageContent = styled.div<{ $isCurrentUser: boolean }>`
	display: flex;
	flex-direction: column;
	max-width: 75%;
	align-items: ${(props) => (props.$isCurrentUser ? "flex-end" : "flex-start")};
`;

export const MessageHeader = styled.div<{ $isCurrentUser: boolean }>`
	display: flex;
	gap: 0.5rem;
	align-items: center;
	font-size: 0.8125rem;
	color: #6b7c93;
	margin-bottom: 0.375rem;
	flex-direction: ${(props) => (props.$isCurrentUser ? "row-reverse" : "row")};
`;

export const SenderName = styled.span`
	font-weight: 600;
	color: #27364b;
`;

export const MessageTime = styled.span`
	color: #8ba3c7;
`;

export const MessageBubble = styled.div<{ $isCurrentUser: boolean }>`
	border-radius: 12px;
	padding: 0.875rem 1rem;
	font-size: 0.9375rem;
	line-height: 1.5;
	white-space: pre-wrap;
	word-wrap: break-word;
	transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
	position: relative;
	box-shadow: ${(props) =>
		props.$isCurrentUser
			? "0 2px 8px rgba(123, 159, 232, 0.3)"
			: "0 2px 6px rgba(0, 0, 0, 0.06)"};

	${(props) =>
		props.$isCurrentUser
			? `
    background: linear-gradient(135deg, #7B9FE8 0%, #A6C2F2 100%);
    color: #ffffff;
    border-bottom-right-radius: 4px;
  `
			: `
    background: #ffffff;
    color: #2c3e50;
    border: 1px solid rgba(209, 224, 253, 0.5);
    border-bottom-left-radius: 4px;
  `}
`;

export const InputArea = styled.div`
	padding: 1.25rem 1.5rem;
	border-top: 1px solid rgba(209, 224, 253, 0.5);
	background: linear-gradient(to bottom, #ffffff, #f7f9fc);
	flex-shrink: 0;
	box-shadow: 0 -2px 10px rgba(123, 159, 232, 0.08);
`;

export const InputWrapper = styled.div`
	display: flex;
	gap: 0.75rem;
	align-items: flex-end;
`;

export const StyledTextarea = styled.textarea`
	flex: 1;
	padding: 0.875rem 1rem;
	border-radius: 10px;
	border: 1px solid rgba(209, 224, 253, 0.6);
	background: #ffffff;
	font-size: 0.9375rem;
	line-height: 1.5;
	resize: none;
	min-height: 44px;
	max-height: 120px;
	transition: all 0.2s;
	color: #2c3e50;

	&::placeholder {
		color: #8ba3c7;
	}

	&:focus {
		outline: none;
		border-color: #7b9fe8;
		box-shadow: 0 0 0 3px rgba(123, 159, 232, 0.1);
	}

	&:hover:not(:focus) {
		border-color: rgba(166, 194, 242, 0.8);
	}
`;

export const SendButton = styled.button<{ $disabled: boolean }>`
	padding: 0.875rem 1.5rem;
	border-radius: 10px;
	background: ${(props) =>
		props.$disabled
			? "linear-gradient(135deg, #c5d4ea 0%, #d9e5f5 100%)"
			: "#7B9FE8"};
	color: #ffffff;
	font-size: 0.9375rem;
	font-weight: 600;
	border: none;
	cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
	transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
	flex-shrink: 0;
	opacity: ${(props) => (props.$disabled ? 0.6 : 1)};
	box-shadow: ${(props) =>
		props.$disabled ? "none" : "0 2px 8px rgba(123, 159, 232, 0.3)"};

	&:focus {
		outline: none;
	}

	&:active:not(:disabled) {
		transform: translateY(0);
	}
`;
