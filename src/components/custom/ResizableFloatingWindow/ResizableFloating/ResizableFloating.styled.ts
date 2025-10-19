import { theme } from "@/themes";
import styled from "styled-components";

export const WindowRoot = styled.div`
	width: 100%;
	height: 100%;
	border-radius: 10px;
	box-shadow: 0 10px 30px rgba(2, 6, 23, 0.12);
	background: #ffffff;
	border: 1px solid rgba(226, 232, 240, 1);
	display: flex;
	flex-direction: column;
	overflow: hidden;
`;

export const Titlebar = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 12px;
	user-select: none;
	cursor: move;
	height: 48px;
`;

export const LeftGroup = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
`;

export const TitleText = styled.div`
	font-weight: 600;
	color: #0f172a;
`;

export const Controls = styled.div`
	display: flex;
	gap: 8px;
	align-items: center;
`;

export const IconButton = styled.button<{ danger?: boolean }>`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 6px 8px;
	border-radius: 8px;
	border: none;
	background: ${(p) => (p.danger ? "rgba(254,226,226,1)" : "transparent")};
	color: ${(p) => (p.danger ? "#b91c1c" : "#0f172a")};
	cursor: pointer;

	&:hover {
		opacity: 0.92;
	}
`;

export const TabsRow = styled.nav`
	display: flex;
	gap: 10px;
	padding: 10px 12px;
	border-bottom: 1px solid rgba(226, 232, 240, 1);
	align-items: center;
`;

export const GroupTab = styled.div`
	flex: 1;
	overflow-x: auto;
	//   webkit-overflow-scrolling: touch;
	scrollbar-width: none;
`;

export const TabButton = styled.button<{ selected?: boolean }>`
	padding: 6px 14px;
	border-radius: 10px;
	cursor: pointer;
	font-size: 13px;
	color: ${(p) => (p.selected ? "#0f172a" : "#475569")};
	background: ${(p) => (p.selected ? "#ffffff" : `${theme.color.grey30}`)};
	border: ${(p) =>
		p.selected ? "1px solid rgba(203,213,225,1)" : "1px solid transparent"};
	box-shadow: ${(p) => (p.selected ? "0 1px 0 rgba(0,0,0,0.02)" : "none")};
`;

export const ContentArea = styled.div`
	padding: 16px;
	overflow: auto;
	flex: 1 1 auto;
`;
