import styled, { css } from "styled-components";

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

	&:focus {
		outline: none;
	}
`;

export const SearchWrapper = styled.div`
	margin-bottom: 24px;
	position: relative;
	display: flex;
	align-items: center;

	& > svg {
		position: absolute;
		left: 12px;
		color: #9ca3af;
	}
`;

export const SearchInput = styled.input`
	width: 100%;
	padding: 10px 12px 10px 38px;
	border: 1px solid #e5e7eb;
	border-radius: 6px;
	font-size: 14px;
	outline: none;
	transition: border-color 0.2s;

	&:focus {
		border-color: #133e87;
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

const badgeVariants = css<{ variant?: string }>`
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
          background: #1CCA9333; /* Using 20% alpha on green */
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

export const Badge = styled.span<{ variant?: string }>`
	display: inline-block;
	padding: 4px 12px;
	border-radius: 12px;
	font-size: 13px;
	font-weight: 500;
	white-space: nowrap;
	${badgeVariants}
`;

export const CellBackgroundSpan = styled.span<{ variant?: string }>`
	display: inline-block;
	padding: 4px 12px;
	border-radius: 12px;
	font-size: 13px;
	font-weight: 500;
	white-space: nowrap;
	${badgeVariants}
`;

const IconBase = styled.span`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 20px;
	height: 20px;
	border-radius: 50%;
	font-size: 14px;
	font-weight: bold;
`;

export const CheckIconWrapper = styled(IconBase)`
	background: #1cca9333;
	color: #1cca93;
`;

export const CloseIconWrapper = styled(IconBase)`
	background: #fee2e2;
	color: #d83232;
`;

export const ActionGroup = styled.div`
	display: flex;
	gap: 8px;
	justify-content: center;
`;

export const IconButton = styled.button<{ variant?: "danger" | "default" }>`
	background: transparent;
	border: none;
	cursor: pointer;
	padding: 6px;
	border-radius: 4px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	transition: background 0.2s;

	& > svg {
		color: ${(props) => (props.variant === "danger" ? "#D83232" : "#3B82F6")};
		font-size: 16px;
	}

	&:hover {
		background: ${(props) =>
			props.variant === "danger" ? "#fee2e2" : "#f3f4f6"};
	}

	&:active {
		transform: scale(0.95);
	}

	&:focus {
		outline: none;
	}
`;

export const PaginationWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	// margin-top: 24px;

	& > p {
		font-size: 14px;
		color: #666;
		margin: 0;
	}

	& > div {
		display: flex;
		gap: 6px;
		align-items: center;
	}
`;

export const PaginationButton = styled.button<{ $isActive?: boolean }>`
	padding: 8px 12px;
	border: 1px solid #e5e7eb;
	border-radius: 6px;
	background: white;
	color: #6b7280;
	cursor: pointer;
	font-size: 14px;
	font-weight: 500;
	min-width: 36px;
	transition: all 0.2s;

	/* Active state (for page numbers) */
	${(props) =>
		props.$isActive &&
		css`
			border-color: #133e87;
			background: #133e87;
			color: white;
			font-weight: 600;

			&:hover {
				background: #133e87 !important;
				border-color: #133e87 !important;
			}
		`}

	&:disabled {
		cursor: not-allowed;
		opacity: 0.4;
	}

	&:focus {
		outline: none;
	}

	&:not(:hover):not(:disabled) {
		border-color: #e5e7eb;
		background: white;
		color: #6b7280;
	}

	&:hover:not(:disabled):not([$isActive="true"]) {
		background: #f3f4f6;
		border-color: #d1d5db;
	}
`;
