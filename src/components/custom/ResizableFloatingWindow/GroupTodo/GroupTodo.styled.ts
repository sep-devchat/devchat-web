import styled from "styled-components";

export const Root = styled.div``;

export const Header = styled.div`
	margin-bottom: 12px;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

export const Note = styled.div`
	color: #94a3b8;
	font-size: 12px;
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

export const TaskMain = styled.div`
	flex: 1;
`;

export const TaskContent = styled.div`
	display: grid;
	grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
	gap: 16px;
	width: 100%;
	align-items: flex-start;
	@media (max-width: 768px) {
		grid-template-columns: 1fr;
	}
`;

export const TaskInfoColumn = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

export const InfoFooter = styled.div`
	font-size: 12px;
	color: #94a3b8;
`;

export const TaskMetaColumn = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
	padding-left: 16px;
	border-left: 1px solid #e2e8f0;
	@media (max-width: 768px) {
		border-left: none;
		border-top: 1px solid #e2e8f0;
		padding-left: 0;
		padding-top: 12px;
	}
`;

export const BadgeRow = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
	justify-content: flex-start;
`;

export const DeadlineCard = styled.div<{
	$variant: "default" | "soon" | "overdue";
}>`
	display: inline-flex;
	gap: 8px;
	align-items: center;
	padding: 6px 10px;
	border-radius: 10px;
	font-size: 12px;
	background: ${(p) =>
		p.$variant === "overdue"
			? "rgba(254,226,226,0.9)"
			: p.$variant === "soon"
				? "rgba(254,226,226,0.6)"
				: "rgba(241,245,249,1)"};
	color: ${(p) => (p.$variant === "default" ? "#334155" : "#991b1b")};
`;

export const StatusBlock = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	flex-wrap: wrap;
	font-size: 12px;
	color: #475569;
`;

export const Title = styled.div<{ done?: boolean }>`
	font-weight: 600;
	color: ${(p) => (p.done ? "#94a3b8" : "#0f172a")};
	text-decoration: ${(p) => (p.done ? "line-through" : "none")};
`;

export const Desc = styled.div`
	font-size: 13px;
	color: #64748b;
	margin-top: 6px;
`;

export const Meta = styled.div`
	text-align: right;
	font-size: 12px;
	color: #64748b;
`;

export const ControlsCol = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

export const TaskBoardButton = styled.button`
	border: 1px solid #c7d2fe;
	background: #eef2ff;
	color: #4338ca;
	border-radius: 999px;
	padding: 6px 14px;
	font-size: 12px;
	font-weight: 600;
	cursor: pointer;
	transition:
		background 0.2s ease,
		color 0.2s ease,
		opacity 0.2s ease;
	&:hover:enabled {
		background: #dbeafe;
		color: #3730a3;
	}
	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
`;

export const StatusSelect = styled.select`
	border: 1px solid #cbd5f5;
	background: #ffffff;
	border-radius: 8px;
	padding: 4px 10px;
	font-size: 12px;
	color: #0f172a;
	min-width: 130px;
`;
