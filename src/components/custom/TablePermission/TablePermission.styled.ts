import styled from "styled-components";

export const TableContainer = styled.div`
	background: white;
	border-radius: 8px;
	padding: 24px;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const TableHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24px;
`;

export const TableTitle = styled.h2`
	font-size: 20px;
	font-weight: 600;
	color: #1a1a1a;
	margin: 0 0 4px 0;
`;

export const TableSubtitle = styled.p`
	font-size: 14px;
	color: #666;
	margin: 0;
`;

export const ActionButton = styled.button`
	background: #133e87;
	color: white;
	border: none;
	border-radius: 6px;
	padding: 10px 16px;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	display: flex;
	align-items: center;
	gap: 6px;
	transition: background 0.2s;

	&:hover {
		background: #1952b3;
	}

	&:active {
		background: #1e40af;
	}
`;

export const Table = styled.table`
	width: 100%;
	border-collapse: collapse;
	font-size: 14px;
`;

export const Thead = styled.thead`
	background: #f9fafb;
	border-bottom: 1px solid #e5e7eb;
`;

export const Tbody = styled.tbody``;

export const Tr = styled.tr`
	border-bottom: 1px solid #f3f4f6;

	&:last-child {
		border-bottom: none;
	}

	&:hover {
		background: #f9fafb;
	}
`;

export const Th = styled.th<{
	width?: string;
	align?: "left" | "center" | "right";
}>`
	padding: 12px 16px;
	text-align: ${(props) => props.align || "left"};
	font-weight: 600;
	color: #6b7280;
	font-size: 12px;
	text-transform: uppercase;
	letter-spacing: 0.5px;
	width: ${(props) => props.width || "auto"};
`;

export const Td = styled.td<{ align?: "left" | "center" | "right" }>`
	padding: 16px;
	text-align: ${(props) => props.align || "left"};
	color: #374151;
	vertical-align: middle;
`;

export const Badge = styled.span<{ variant?: string }>`
	display: inline-block;
	padding: 4px 12px;
	border-radius: 12px;
	font-size: 13px;
	font-weight: 500;
	white-space: nowrap;

	${(props) => {
		switch (props.variant) {
			case "purple":
				return `
          background: #ede9fe;
          color: #7c3aed;
        `;
			case "blue":
				return `
          background: #dbeafe;
          color: #133e87;
        `;
			case "green":
				return `
          background: #1CCA9333;
          color: #1CCA93;
        `;
			case "yellow":
				return `
          background: #fef3c7;
          color: #d97706;
        `;
			case "red":
				return `
          background: #fee2e2;
          color: #D83232;
        `;
			default:
				return `
          background: #f3f4f6;
          color: #6b7280;
        `;
		}
	}}
`;

export const CheckIcon = styled.span`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 20px;
	height: 20px;
	border-radius: 50%;
	background: #1cca9333;
	color: #1cca93;
	font-size: 14px;
	font-weight: bold;
`;

export const CloseIcon = styled.span`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 20px;
	height: 20px;
	border-radius: 50%;
	background: #fee2e2;
	color: #d83232;
	font-size: 14px;
	font-weight: bold;
`;

export const IconButton = styled.button<{ variant?: "danger" }>`
	background: transparent;
	border: none;
	cursor: pointer;
	padding: 6px;
	border-radius: 4px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	transition: background 0.2s;

	&:hover {
		background: ${(props) =>
			props.variant === "danger" ? "#fee2e2" : "#f3f4f6"};
	}

	&:active {
		transform: scale(0.95);
	}
`;

export const EditIcon = styled.span`
	color: #133e87;
	font-size: 16px;
`;

export const DeleteIcon = styled.span`
	color: #d83232;
	font-size: 16px;
`;
