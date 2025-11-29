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
	width: 600px;
	position: relative;
	display: flex;
	flex-direction: column;
	margin-right: 18px;
	background: ${theme.color.grey10};
	border-radius: 10px;
	margin-right: 18px;
	margin-left: 12px;

	@media (max-width: 1220px) {
		width: 100%;
		margin: 0;
		border-radius: 0px 10px 10px 0px;
	}

	@media (min-width: 1440px) {
		width: 420px;
		margin-right: 14.4px;
		margin-left: 9.6px;
		border-radius: 8px;
	}

	@media (min-width: 1920px) {
		width: 660px;
		margin-right: 19.8px;
		margin-left: 13.2px;
		border-radius: 11px;
	}
`;

export const CPHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 52px;
	padding: 14px 12px;
	background: #e2e8f0;
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;

	@media (max-width: 1220px) {
		height: 47.5px;
		padding: 9.8px 8.4px;
		border-top-left-radius: 0;
		border-top-right-radius: 8.4px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		height: 50px;
		padding: 11.2px 9.6px;
		border-top-left-radius: 8px;
		border-top-right-radius: 8px;
	}

	@media (min-width: 1920px) {
		height: 52px;
		padding: 15.4px 13.2px;
		border-top-left-radius: 11px;
		border-top-right-radius: 11px;
	}
`;

export const CPHeaderIcon = styled.div`
	width: 32px;
	height: 32px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	color: #1e2a3b;

	@media (min-width: 1440px) {
		width: 25.6px;
		height: 25.6px;
	}

	@media (min-width: 1920px) {
		width: 35.2px;
		height: 35.2px;
	}
`;

export const CPHeaderLeft = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	@media (min-width: 1440px) {
		gap: 6.4px;
	}

	@media (min-width: 1920px) {
		gap: 8.8px;
	}
`;

export const CPTitle = styled.h2`
	margin: 0;
	font-size: 16px;
	font-weight: 600;
	color: #1a1a1a;

	@media (min-width: 1440px) {
		font-size: 15px;
	}
	@media (max-width: 1220px) {
		font-size: 14px;
	}

	@media (min-width: 1920px) {
		font-size: 18px;
	}
`;

export const MessagesArea = styled.div`
	flex: 1;
	min-height: 0;
	overflow-y: auto;
	overflow-x: hidden;
	scrollbar-width: thin;
	overscroll-behavior: contain;

	&::-webkit-scrollbar {
		width: 8px;
	}
	&::-webkit-scrollbar-track {
		background: transparent;
	}
	&::-webkit-scrollbar-thumb {
		background: #cbd5e1;
		border-radius: 4px;
	}
	&::-webkit-scrollbar-thumb:hover {
		background: #94a3b8;
	}

	&:has(> div:first-child) {
		display: flex;
		flex-direction: column;
		justify-content: end;
	}

	@media (max-width: 1220px) {
		&::-webkit-scrollbar {
			width: 5.6px;
		}

		&::-webkit-scrollbar-thumb {
			border-radius: 2.8px;
		}
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		&::-webkit-scrollbar {
			width: 6.4px;
		}

		&::-webkit-scrollbar-thumb {
			border-radius: 3.2px;
		}
	}

	@media (min-width: 1920px) {
		&::-webkit-scrollbar {
			width: 8.8px;
		}

		&::-webkit-scrollbar-thumb {
			border-radius: 4.4px;
		}
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

	@media (max-width: 1220px) {
		width: 33.6px;
		height: 33.6px;
		margin-bottom: 3.5px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		width: 38.4px;
		height: 38.4px;
		margin-bottom: 4px;
	}

	@media (min-width: 1920px) {
		width: 52.8px;
		height: 52.8px;
		margin-bottom: 5.5px;
	}
`;

export const ThreadForm = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 24px;

	@media (max-width: 1220px) {
		gap: 16.8px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		gap: 19.2px;
	}

	@media (min-width: 1920px) {
		gap: 26.4px;
	}
`;

export const FormGroup = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;

	@media (max-width: 1220px) {
		gap: 5.6px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		gap: 6.4px;
	}

	@media (min-width: 1920px) {
		gap: 8.8px;
	}
`;

export const Label = styled.label`
	font-size: 14px;
	font-weight: 500;
	color: #1a1a1a;

	@media (max-width: 1220px) {
		font-size: 12px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 13px;
	}

	@media (min-width: 1920px) {
		font-size: 16px;
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
		font-size: 12px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		padding: 6.4px 9.6px;
		border-radius: 4.8px;
		font-size: 13px;
	}

	@media (min-width: 1920px) {
		padding: 8.8px 13.2px;
		border-radius: 6.6px;
		font-size: 16px;
	}
`;

export const CheckboxGroup = styled.div`
	display: flex;
	align-items: flex-start;
	gap: 12px;

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

export const Checkbox = styled.input`
	width: 16px;
	height: 16px;
	margin-top: 2px;
	accent-color: #133e87;

	@media (max-width: 1220px) {
		width: 11.2px;
		height: 11.2px;
		margin-top: 1.4px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		width: 12.8px;
		height: 12.8px;
		margin-top: 1.6px;
	}

	@media (min-width: 1920px) {
		width: 17.6px;
		height: 17.6px;
		margin-top: 2.2px;
	}
`;

export const CheckboxLabel = styled.label`
	font-size: 14px;
	font-weight: 500;
	color: #1a1a1a;
	display: block;
	margin-bottom: 4px;

	@media (max-width: 1220px) {
		font-size: 12px;
		margin-bottom: 2.8px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 13px;
		margin-bottom: 3.2px;
	}

	@media (min-width: 1920px) {
		font-size: 16px;
		margin-bottom: 4.4px;
	}
`;

export const CheckboxDescription = styled.p`
	font-size: 14px;
	color: ${theme.color.grey500};
	margin: 0;
	line-height: 1.4;

	@media (max-width: 1220px) {
		font-size: 12px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 13px;
	}

	@media (min-width: 1920px) {
		font-size: 16px;
	}
`;

export const MessageInput = styled.div`
	border-top: 1px solid ${theme.color.grey200};

	@media (max-width: 1220px) {
		padding: 11.2px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		padding: 12.8px;
	}

	@media (min-width: 1920px) {
		padding: 17.6px;
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

	@media (min-width: 1440px) and (max-width: 1919px) {
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

	@media (min-width: 1440px) and (max-width: 1919px) {
		padding: 3.2px;
		border-radius: 3.2px;
	}

	@media (min-width: 1920px) {
		padding: 4.4px;
		border-radius: 4.4px;
	}
`;

export const DateDivider = styled.div`
	text-align: center;
	font-size: 12px;
	color: #1a1a1a;
	margin: 16px 0 24px 0;

	@media (max-width: 1220px) {
		font-size: 11px;
		margin: 11.2px 0 16.8px 0;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 12px;
		margin: 12.8px 0 19.2px 0;
	}

	@media (min-width: 1920px) {
		font-size: 14px;
		margin: 17.6px 0 26.4px 0;
	}
`;

export const Message = styled.div`
	display: flex;
	gap: 12px;
	margin-bottom: 16px;

	@media (max-width: 1220px) {
		gap: 10px;
		margin-bottom: 10px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		gap: 9.6px;
		margin-bottom: 12.8px;
	}

	@media (min-width: 1920px) {
		gap: 13.2px;
		margin-bottom: 14px;
	}
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

	@media (max-width: 1220px) {
		width: 22.4px;
		height: 22.4px;
		font-size: 12px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		width: 25.6px;
		height: 25.6px;
		font-size: 13px;
	}

	@media (min-width: 1920px) {
		width: 35.2px;
		height: 35.2px;
		font-size: 16px;
	}
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

	@media (max-width: 1220px) {
		gap: 5.6px;
		margin-bottom: 2.8px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		gap: 6.4px;
		margin-bottom: 3.2px;
	}

	@media (min-width: 1920px) {
		gap: 8.8px;
		margin-bottom: 4.4px;
	}
`;

export const AuthorName = styled.span`
	font-weight: 500;
	color: #1a1a1a;
	font-size: 14px;

	@media (max-width: 1220px) {
		font-size: 12px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 13px;
	}

	@media (min-width: 1920px) {
		font-size: 16px;
	}
`;

export const MessageTime = styled.span`
	font-size: 12px;
	color: ${theme.color.grey500};
	align-items: center;

	@media (max-width: 1220px) {
		font-size: 11px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 12px;
	}

	@media (min-width: 1920px) {
		font-size: 14px;
	}
`;

export const MessageText = styled.p`
	margin: 0;
	font-size: 14px;
	color: ${theme.color.grey600};
	line-height: 1.5;
	background: #eff2f5;
	padding: 6px 10px;
	border-radius: 8px;

	@media (max-width: 1220px) {
		font-size: 12px;
		padding: 4.2px 7px;
		border-radius: 5.6px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 13px;
		padding: 4.8px 8px;
		border-radius: 6.4px;
	}

	@media (min-width: 1920px) {
		font-size: 16px;
		padding: 6.6px 11px;
		border-radius: 8.8px;
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

	@media (min-width: 1440px) and (max-width: 1919px) {
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
		font-size: 11px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		margin: 0 12.8px;
		font-size: 12px;
	}

	@media (min-width: 1920px) {
		margin: 0 17.6px;
		font-size: 14px;
	}
`;

export const PrivateText = styled.span`
	margin-top: 8px;
	color: #666;
	font-size: 12px;

	@media (max-width: 1220px) {
		margin-top: 5.6px;
		font-size: 11px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		margin-top: 6.4px;
		font-size: 12px;
	}

	@media (min-width: 1920px) {
		margin-top: 8.8px;
		font-size: 14px;
	}
`;

export const CloseButton = styled.button`
	background: none;
	border: none;
	cursor: pointer;
	padding: 8px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #888;
	transition: color 0.2s;

	&:hover {
		color: #fff;
	}

	&:focus {
		outline: none;
	}

	@media (max-width: 1220px) {
		padding: 5.6px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		padding: 6.4px;
	}

	@media (min-width: 1920px) {
		padding: 8.8px;
	}
`;
