import { theme } from "@/themes";
import styled from "styled-components";

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
