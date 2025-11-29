import { theme } from "@/themes";
import styled from "styled-components";

export const PageWrapper = styled.div<{ $isDark?: boolean }>`
	display: flex;
	flex-direction: column;
	height: 100%;
	background: ${(p) => (p.$isDark ? "#1f2937" : "#ffffff")};
	color: ${(p) => (p.$isDark ? theme.color.grey10 : theme.color.grey90)};
	border-left: 1px solid ${theme.color.grey30};
	width: 100%;
	margin-left: 0;
	border-radius: 10px;
	margin-right: 18px;
	margin-left: 12px;

	@media (max-width: 1220px) {
		width: 100%;
		margin: 0;
		border-radius: 0px 10px 10px 0px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
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
	overflow: hidden;
`;

export const CPHeader = styled.div`
	display: flex;
	align-items: center;
	height: 52px;
	padding: 14px 12px;
	background: ${theme.color.grey30};
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;

	@media (max-width: 1220px) {
		height: 47.5px;
		padding: 9.8px 8.4px;
		border-bottom: 1px solid white;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		height: 50px;
		padding: 11.2px 9.6px;
		border-top-left-radius: 8px;
		border-top-right-radius: 8px;
		border-bottom: 1px solid white;
	}

	@media (min-width: 1920px) {
		height: 52px;
		padding: 15.4px 13.2px;
		border-top-left-radius: 11px;
		border-top-right-radius: 11px;
		border-bottom: 1px solid white;
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

export const CPHeaderRight = styled.div`
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

export const CPChatArea = styled.div`
	height: 100%;
	background: ${theme.color.grey10};
	border-bottom-left-radius: 10px;
	border-bottom-right-radius: 10px;

	@media (min-width: 1440px) and (max-width: 1919px) {
		border-bottom-left-radius: 8px;
		border-bottom-right-radius: 8px;
	}

	@media (min-width: 1920px) {
		border-bottom-left-radius: 11px;
		border-bottom-right-radius: 11px;
	}
`;

export const CPHash = styled.div`
	width: 44px;
	height: 44px;
	border-radius: 999px;
	background: #eef2ff;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: 700;
	color: #4338ca;

	@media (max-width: 1220px) {
		width: 30.8px;
		height: 30.8px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		width: 35.2px;
		height: 35.2px;
	}

	@media (min-width: 1920px) {
		width: 48.4px;
		height: 48.4px;
	}
`;

export const CPTitle = styled.h2`
	margin: 0;
	font-size: 16px;
	font-weight: 600;
	@media (min-width: 1440px) {
		font-size: 15px;
	}
	@media (max-width: 1220px) {
		font-size: 14px;
	}

	@media (min-width: 1920px) {
		font-size: 18px;
	}
	color: #0f172a;
`;

export const CloseButton = styled.button`
	border: none;
	background: transparent;
	color: #475569;
	width: 34px;
	height: 34px;
	border-radius: 50%;
	display: grid;
	place-items: center;
	cursor: pointer;
	transition:
		background 0.2s ease,
		color 0.2s ease;

	&:hover {
		background: rgba(148, 163, 184, 0.2);
		color: #0f172a;
	}

	@media (min-width: 1440px) {
		padding: 6.4px;
	}

	@media (min-width: 1920px) {
		padding: 8.8px;
	}
`;

export const CPContent = styled.div`
	flex: 1;
	padding: 16px;
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
	flex-direction: column;
	gap: 16px;
	background: #f8fafc;
	overflow: hidden;
`;

export const CodeListScroller = styled.div`
	flex: 1;
	overflow-y: auto;
	display: flex;
	flex-direction: column;
	gap: 16px;
	@media (max-width: 1220px) {
		padding: 12.2px;
		gap: 11.2px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		padding: 12.8px;
		gap: 12.8px;
	}

	@media (min-width: 1920px) {
		padding: 17.6px;
		gap: 17.6px;
	}
`;

export const CPCodeItem = styled.div`
	background: #ffffff;
	color: #0f172a;
	border-radius: 14px;
	box-shadow: 0 12px 20px rgba(15, 23, 42, 0.08);
	overflow: hidden;
	border: 1px solid rgba(15, 23, 42, 0.08);
  
  @media (max-width: 1220px) {
		border-radius: 5.6px;
		height: 140.7px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		border-radius: 6.4px;
		height: 160.8px;
	}

	@media (min-width: 1920px) {
		border-radius: 8.8px;
		height: 221.1px;
	}
  
  &::-webkit-scrollbar {
		width: 6px;
	}

	&::-webkit-scrollbar-thumb {
		background: ${theme.color.grey200};
		border-radius: 999px;
	}

	&::-webkit-scrollbar-track {
		background: transparent;
	}
`;

export const CPCodeItemHeader = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12px 16px;
	background: linear-gradient(90deg, #e2e8f0, #f8fafc);
	border-bottom: 1px solid rgba(15, 23, 42, 0.08);
	color: ${(p) => (p.$isDark ? theme.color.grey10 : theme.color.grey90)};

	@media (max-width: 1220px) {
		padding: 7px 12.2px;
		border-top-left-radius: 5.6px;
		border-top-left-radius: 5.6px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		padding: 7px 12.8px;
		border-top-left-radius: 6.4px;
		border-top-left-radius: 6.4px;
	}

	@media (min-width: 1920px) {
		padding: 8.8px 17.6px;
		border-top-left-radius: 8.8px;
		border-top-left-radius: 8.8px;
	}

`;

export const CPCodeItemInfo = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;

	@media (max-width: 1220px) {
		gap: 7px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		gap: 8px;
	}

	@media (min-width: 1920px) {
		gap: 11px;
	}
`;

export const CPCodeItemTitle = styled.div<{ $isDark?: boolean }>`
	display: flex;
	flex-direction: column;
	font-size: 14px;
	font-weight: 500;
	color: ${(p) => (p.$isDark ? theme.color.grey10 : theme.color.grey90)};

	@media (max-width: 1220px) {
		font-size: 12px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 13px;
	}

	@media (min-width: 1920px) {
		font-size: 16px;
	}
	line-height: 1.2;
`;

export const CPCodeItemSubtitle = styled.span<{ $isDark?: boolean }>`
	font-size: 12px;
	font-weight: 400;
	color: ${(p) => (p.$isDark ? theme.color.grey40 : theme.color.grey500)};
	margin-top: 2px;
`;

export const CPRunButton = styled.button`
	background: none;
	border: none;
	color: #94a3b8;
	cursor: pointer;
	padding: 4px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 4px;

	&:hover {
		background: #475569;
		color: #e2e8f0;
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

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		background: transparent;
	}
`;

export const CPActionButtons = styled.div`
	display: flex;
	align-items: center;
	gap: 4px;
`;

export const CPCollaborateButton = styled(CPRunButton)``;

// ... other imports
export const CPCodeEditorWrapper = styled.div<{ $isDark?: boolean }>`
	background: ${(p) => (p.$isDark ? "#1e293b" : "#fdfdfd")};
	border-top: 1px solid rgba(15, 23, 42, 0.04);

	& > pre {
		border: none;
		margin: 0;
		padding: 16px;
		background: transparent;
		color: ${(p) => (p.$isDark ? "#e2e8f0" : "#0f172a")};
		overflow-y: auto;
		font-size: 12px;
	}

	@media (max-width: 1220px) {
		height: calc(100% - 29.8px);

		& > pre {
			padding: 11.2px;
			font-size: 11px;
		}
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		height: calc(100% - 34.06px);

		& > pre {
			padding: 12.8px;
			font-size: 12px;
		}
	}

	@media (min-width: 1920px) {
		height: calc(100% - 46.83px);

		& > pre {
			padding: 17.6px;
			font-size: 14px;
		}
	}
`;

// --- STYLES CHO MODAL VÍ DỤ ---

export const CPModalOverlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
`;

export const CPModalContent = styled.div`
	background: white;
	padding: 24px;
	border-radius: 10px;
	width: 600px;
	max-width: 90%;
	color: #0f172a;
	box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
	display: flex;
	flex-direction: column;
	max-height: 90vh;
	overflow-y: auto;

	h3 {
		margin-top: 0;
		font-size: 16px;
	}

	pre {
		background: #f4f4f5;
		color: #1e293b;
		padding: 16px;
		border-radius: 8px;
		overflow-x: auto;
		font-size: 12px;
	}

	@media (max-width: 1220px) {
		padding: 16.8px;
		border-radius: 7px;
		width: 420px;

		h3 {
			font-size: 14px;
		}

		pre {
			padding: 11.2px;
			border-radius: 5.6px;
			font-size: 11px;
		}
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		padding: 19.2px;
		border-radius: 8px;
		width: 480px;

		h3 {
			font-size: 15px;
		}

		pre {
			padding: 12.8px;
			border-radius: 6.4px;
			font-size: 12px;
		}
	}

	@media (min-width: 1920px) {
		padding: 26.4px;
		border-radius: 11px;
		width: 660px;

		h3 {
			font-size: 18px;
		}

		pre {
			padding: 17.6px;
			border-radius: 8.8px;
			font-size: 14px;
		}
	}
`;

export const ModalHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	gap: 16px;
	margin-bottom: 12px;
	border-bottom: 1px solid ${theme.color.grey30};
	padding-bottom: 12px;
`;

export const ModalMeta = styled.p`
	margin: 4px 0 0;
	font-size: 13px;
	color: ${theme.color.grey500};
`;

export const ModalSection = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
	margin-top: 16px;
`;

export const ModalLabel = styled.span`
	font-size: 12px;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	color: ${theme.color.grey500};
`;

export const ModalActions = styled.div`
	display: flex;
	justify-content: flex-end;
	gap: 12px;
	margin-top: 24px;
`;

export const ModalSecondaryButton = styled.button`
	padding: 10px 18px;
	border-radius: 8px;
	border: 1px solid ${theme.color.grey200};
	background: ${theme.color.white};
	color: ${theme.color.grey600};
	font-weight: 600;
	cursor: pointer;
	transition: background 0.2s ease;

	&:hover {
		background: ${theme.color.grey50};
	}
`;

export const ModalRunButton = styled.button`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	padding: 10px 20px;
	border-radius: 8px;
	border: none;
	background: ${theme.color.primary};
	color: ${theme.color.white};
	font-weight: 600;
	cursor: pointer;
	transition: background 0.2s ease;

	&:hover {
		background: ${theme.color.primary80};
	}

	&:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
`;

export const EmptyMessage = styled.div`
	margin-top: 48px;
	text-align: center;
	color: ${theme.color.grey500};
	font-size: 14px;
	line-height: 1.5;
`;

export const StatusText = styled.div`
	text-align: center;
	font-size: 13px;
	color: ${theme.color.grey500};
`;

export const ErrorText = styled(StatusText)`
	color: ${theme.color.error};
`;

export const Footer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
	margin-top: auto;
`;

export const FooterButton = styled.button`
	align-self: center;
	padding: 8px 18px;
	border-radius: 999px;
	border: none;
	background: ${theme.color.primary};
	color: ${theme.color.white};
	font-size: 13px;
	font-weight: 600;
	cursor: pointer;
	transition: background 0.2s ease;

	&:hover {
		background: ${theme.color.primary80};
	}

	&:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
`;
