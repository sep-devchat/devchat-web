import { theme } from "@/themes";
import styled from "styled-components";

export const Root = styled.div``;

export const Row = styled.div<{ gap?: number }>`
	display: flex;
	gap: ${(p) => p.gap ?? 8}px;
	align-items: center;
`;

export const SearchBox = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	background: ${theme.color.grey20};
	padding: 6px 10px;
	border-radius: 8px;
	flex: 1 1 auto;
`;

export const SearchInput = styled.input`
	background: transparent;
	border: none;
	outline: none;
	font-size: 14px;
	color: #0f172a;
	width: 100%;
`;

export const AddBtn = styled.button`
	display: inline-flex;
	align-items: center;
	gap: 8px;
	background: ${theme.color.primary};
	color: white;
	border: none;
	padding: 4px 8px;
	border-radius: 8px;
	cursor: pointer;
	font-weight: 600;
`;

export const Card = styled.div`
	background: #fff;
	border: 1px solid rgba(226, 232, 240, 1);
	border-radius: 10px;
	padding: 14px;
	box-shadow: 0 4px 10px rgba(2, 6, 23, 0.06);
`;

export const Field = styled.div`
	margin-bottom: 8px;
`;

export const TextInput = styled.input`
	width: 100%;
	padding: 8px;
	border: 1px solid rgba(226, 232, 240, 1);
	border-radius: 8px;
	outline: none;
`;

export const Textarea = styled.textarea`
	width: 100%;
	padding: 8px;
	border: 1px solid rgba(226, 232, 240, 1);
	border-radius: 8px;
	outline: none;
	resize: vertical;
`;

export const Select = styled.select`
	padding: 8px;
	border: 1px solid rgba(226, 232, 240, 1);
	border-radius: 8px;
`;

export const ActionsCol = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

export const TaskList = styled.ul`
	list-style: none;
	padding: 0;
	margin: 0;
	display: flex;
	flex-direction: column;
	gap: 12px;
`;

export const TaskItem = styled.li<{ dragging?: boolean }>`
	display: flex;
	gap: 12px;
	padding: 12px;
	background: #ffffff;
	border-radius: 10px;
	border: 1px solid rgba(226, 232, 240, 1);
	box-shadow: ${(p) =>
		p.dragging
			? "0 8px 20px rgba(2,6,23,0.12)"
			: "0 2px 6px rgba(2,6,23,0.04)"};
	align-items: flex-start;
	transition:
		box-shadow 0.15s ease,
		transform 0.12s ease;
`;

export const Checkbox = styled.input``;

export const TaskMain = styled.div`
	flex: 1;
`;

export const TaskTitle = styled.div<{ done?: boolean }>`
	font-weight: 600;
	color: ${(p) => (p.done ? "#94a3b8" : "#0f172a")};
	text-decoration: ${(p) => (p.done ? "line-through" : "none")};
`;

export const TaskDesc = styled.div`
	font-size: 13px;
	color: #64748b;
	margin-top: 6px;
`;

export const Meta = styled.div`
	text-align: right;
	font-size: 12px;
	color: #64748b;
	display: flex;
	gap: 16px;
`;

export const IconBtn = styled.button<{ danger?: boolean }>`
	background: ${(p) => (p.danger ? "rgba(254,226,226,1)" : "transparent")};
	border: none;
	padding: 6px;
	border-radius: 8px;
	cursor: pointer;
`;

/* NEW: priority badge */
export const PriorityBadge = styled.span<{ level?: number }>`
	display: inline-flex;
	align-items: center;
	gap: 8px;
	padding: 6px 8px;
	border-radius: 999px;
	font-size: 12px;
	font-weight: 600;
	color: #fff;
	background: ${(p) =>
		p.level === 1 ? "#dc2626" : p.level === 2 ? "#f97316" : "#64748b"};
`;

/* NEW: three-dot dropdown */
export const MoreWrap = styled.div`
	position: relative;
`;

export const MoreButton = styled.button`
	width: 36px;
	height: 36px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	border-radius: 8px;
	border: none;
	background: transparent;
	cursor: pointer;
`;

export const Dropdown = styled.div`
	position: absolute;
	right: 0;
	top: 40px;
	background: white;
	border: 1px solid rgba(226, 232, 240, 1);
	border-radius: 8px;
	box-shadow: 0 8px 24px rgba(2, 6, 23, 0.12);
	z-index: 40;
	min-width: 140px;
	padding: 6px;
`;

export const DropdownItem = styled.button`
	display: flex;
	gap: 8px;
	align-items: center;
	width: 100%;
	padding: 8px 10px;
	background: transparent;
	border: none;
	text-align: left;
	cursor: pointer;
	border-radius: 6px;
	&:hover {
		background: #f8fafc;
	}
`;

/* NEW: drag handle */
export const DragHandle = styled.div`
	width: 28px;
	height: 28px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	border-radius: 6px;
	cursor: grab;
	color: #94a3b8;
`;
