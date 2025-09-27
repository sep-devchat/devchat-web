import styled from "styled-components";

const theme = {
	color: {
		grey10: "#f9fafb",
		grey30: "#e5e7eb",
		grey100: "#f3f4f6",
		grey200: "#e5e7eb",
		grey300: "#d1d5db",
		grey400: "#9ca3af",
		grey500: "#6b7280",
		grey600: "#4b5563",
		grey900: "#111827",
		white: "#ffffff",
		indigo: "#4338ca",
		indigoLight: "#eef2ff",
		green: "#10b981",
		orange: "#f59e0b",
	},
};

export const PageWrapper = styled.div`
	height: 100%;
	width: 1000px;
	position: relative;
	display: flex;
	flex-direction: column;
	margin-left: 12px;
	background: ${theme.color.grey10};
	border-radius: 10px;
	margin-right: 18px;
	border: 1px solid ${theme.color.grey200};
`;

export const CPHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 52px;
	padding: 8px 12px;
	background: ${theme.color.grey200};
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
	border-bottom: 1px solid ${theme.color.grey300};
`;

export const CPHeaderIcon = styled.div`
	width: 32px;
	height: 32px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	color: #1e2a3b;
`;

export const CPHeaderLeft = styled.div`
	display: flex;
	align-items: center;
`;

export const CPTitle = styled.h2`
	margin: 0;
	font-size: 16px;
	font-weight: 600;
	color: #1a1a1a;
`;

export const MessagesArea = styled.div`
	flex: 1;
	padding: 16px;
	overflow-y: auto;

	&:has(> div:first-child) {
		display: flex;
		flex-direction: column;
		justify-content: end;
		padding: 32px 24px;
	}
`;

export const ThreadIcon = styled.div`
	width: 48px;
	height: 48px;
	border-radius: 50%;
	background: #94a3b8;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #ffffff;
	margin-bottom: 5px;
`;

export const ThreadForm = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 24px;
`;

export const FormGroup = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

export const Label = styled.label`
	font-size: 14px;
	font-weight: 500;
	color: #1a1a1a;
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

export const CheckboxGroup = styled.div`
	display: flex;
	align-items: flex-start;
	gap: 12px;
`;

export const Checkbox = styled.input`
	width: 16px;
	height: 16px;
	margin-top: 2px;
	accent-color: #133e87;
`;

export const CheckboxLabel = styled.label`
	font-size: 14px;
	font-weight: 500;
	color: #1a1a1a;
	display: block;
	margin-bottom: 4px;
`;

export const CheckboxDescription = styled.p`
	font-size: 14px;
	color: ${theme.color.grey500};
	margin: 0;
	line-height: 1.4;
`;

export const MessageInput = styled.div`
	padding: 16px;
	border-top: 1px solid ${theme.color.grey200};
`;

export const InputContainer = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	background: ${theme.color.white};
	border: 1px solid ${theme.color.grey300};
	border-radius: 24px;
	padding: 8px 16px;

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

export const DateDivider = styled.div`
	text-align: center;
	font-size: 12px;
	color: #1a1a1a;
	margin: 16px 0 24px 0;
`;

export const Message = styled.div`
	display: flex;
	gap: 12px;
	margin-bottom: 16px;
`;

export const Avatar = styled.div`
	width: 32px;
	height: 32px;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	font-size: 14px;
	font-weight: 500;
	flex-shrink: 0;
`;

export const MessageContent = styled.div`
	flex: 1;
	min-width: 0;
`;

export const MessageHeader = styled.div`
	display: flex;
	align-items: baseline;
	gap: 8px;
	margin-bottom: 4px;
`;

export const AuthorName = styled.span`
	font-weight: 500;
	color: #1a1a1a;
	font-size: 14px;
`;

export const MessageTime = styled.span`
	font-size: 12px;
	color: ${theme.color.grey500};
	align-items: center;
`;

export const MessageText = styled.p`
	margin: 0;
	font-size: 14px;
	color: ${theme.color.grey600};
	line-height: 1.5;
	background: #eff2f5;
	padding: 6px 10px;
	border-radius: 8px;
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

export const PrivateText = styled.span`
	margin-top: 8px;
	color: #666;
	font-size: 12px;
`;
