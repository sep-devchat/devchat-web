import { theme } from "@/themes";
import styled from "styled-components";

export const TableArea = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	height: calc(100% - 58px);
`;

export const TableWrapper = styled.div`
	display: flex;
	height: calc(100% - 62px);
`;

export const PageButton = styled.button`
	padding: 4px 8px;

	&.focusing {
		background: ${theme.color.primary};
		color: ${theme.color.white};
	}

	&.non-focus {
		background: ${theme.color.white};
		border: 1px solid #ccc;
	}
`;
