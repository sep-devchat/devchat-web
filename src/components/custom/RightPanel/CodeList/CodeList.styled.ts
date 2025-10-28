import { theme } from "@/themes";
import styled from "styled-components";

export const PageWrapper = styled.div`
	height: 100%;
	width: 600px;
	position: relative;
	display: flex;
	flex-direction: column;
	margin-left: 12px;
	background: ${theme.color.grey10};
	border-radius: 10px;
	margin-right: 18px;
`;

export const CPHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 52px;
	padding: 14px 12px;
	background: ${theme.color.grey30};
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
`;

export const CPHeaderIcon = styled.div`
	width: 44px;
	height: 44px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: 700;
	// color: #4338ca;
`;

export const CPHeaderLeft = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
`;

export const CPHeaderRight = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
`;

export const CPChatArea = styled.div`
	height: 100%;
	background: ${theme.color.grey10};
	border-bottom-left-radius: 10px;
	border-bottom-right-radius: 10px;
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
`;

export const CPTitle = styled.h2`
	margin: 0;
	font-size: 18px;
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

// ------------------------------ Code Item

export const CPContent = styled.div`
	flex: 1;
	padding: 16px;
	overflow-y: auto;
	display: flex;
	flex-direction: column;
	gap: 16px; // Khoảng cách giữa các item code
`;

export const CPCodeItem = styled.div<{ $isDark?: boolean }>`
	background: ${(p) => (p.$isDark ? "#334155" : "#f4f4f5")};
	border-radius: 8px;
	border: 1px solid ${theme.color.grey30};
	height: 201px;
`;

export const CPCodeItemHeader = styled.div<{ $isDark?: boolean }>`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 8px 16px;
	background: ${(p) => (p.$isDark ? "#334155" : "#f4f4f5")};
	color: ${(p) => (p.$isDark ? theme.color.grey10 : theme.color.grey90)};
	border-bottom: 1px solid ${theme.color.grey30};
`;

export const CPCodeItemInfo = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;
`;

export const CPCodeItemTitle = styled.span<{ $isDark?: boolean }>`
	font-size: 14px;
	font-weight: 500;
	// color: #e2e8f0;
	color: ${(p) => (p.$isDark ? theme.color.grey10 : theme.color.grey90)};
`;

export const CPRunButton = styled.button`
	background: none;
	border: none;
	color: #94a3b8; // Màu icon
	cursor: pointer;
	padding: 4px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 4px;

	&:hover {
		background: #475569;
		color: #e2e8f0; // Màu icon khi hover
	}
`;

// ... other imports
export const CPCodeEditorWrapper = styled.div<{ $isDark?: boolean }>`
	height: calc(100% - 42.57px);

	& > pre {
		border: none;
		margin: 0;
		padding: 16px;
		background: ${(p) => (p.$isDark ? "#0f172a" : "#f4f4f5")};
		color: ${(p) => (p.$isDark ? "#e2e8f0" : "#0f172a")};
		overflow-y: auto;
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
	background: white; // Đổi nền trắng cho modal
	padding: 24px;
	border-radius: 10px;
	width: 600px;
	max-width: 90%;
	color: #0f172a; // Màu chữ tối
	box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);

	h3 {
		margin-top: 0;
	}

	pre {
		background: #f4f4f5; // Nền sáng cho code trong modal
		color: #1e293b;
		padding: 16px;
		border-radius: 8px;
		overflow-x: auto;
	}
`;
