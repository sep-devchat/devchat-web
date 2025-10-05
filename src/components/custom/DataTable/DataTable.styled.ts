import styled from "styled-components";

export const TableContainer = styled.div<{ className?: string }>`
	background-color: white;
	border-radius: 0.5rem;
	padding: 1rem 0;
	border: 1px solid #f3f4f6;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

export const Title = styled.h3`
	font-size: 20px;
	font-weight: 600;
	color: #27364b;
	margin-bottom: 10px;
	text-align: center;
`;

export const TableWrapper = styled.div`
	overflow-x: auto;
`;

export const Table = styled.table`
	width: 100%;
`;

export const TableHead = styled.thead`
	background: #f1f4f9;
`;

export const TableRow = styled.tr<{ isHeader?: boolean }>`
	border-bottom: 1px solid
		${(props) => (props.isHeader ? "#e5e7eb" : "#f3f4f6")};

	${(props) =>
		!props.isHeader &&
		`
        &:nth-child(odd) {
            background-color: white;
        }
        &:nth-child(even) {
            background-color: #F1F4F9;
        }
        &:hover {
            background-color: #e5e7eb;
        }
        transition: background-color 0.15s ease;
    `}
`;

export const TableHeader = styled.th<{
	align?: "left" | "center" | "right";
	width?: string;
}>`
	padding: 0.75rem 1rem;
	font-size: 0.875rem;
	font-weight: 600;
	color: #27364b;
	text-align: ${(props) => props.align || "left"};
	${(props) => props.width && `width: ${props.width};`}
`;

export const TableBody = styled.tbody``;

export const TableCell = styled.td<{ align?: "left" | "center" | "right" }>`
	padding: 0.75rem 1rem;
	font-size: 0.875rem;
	color: #27364b;
	text-align: ${(props) => props.align || "left"};
`;
