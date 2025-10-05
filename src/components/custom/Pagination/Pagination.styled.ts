import styled from "styled-components";

export const PaginationContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: end;
	gap: 0.5rem;
	padding: 1rem 16px;
	background-color: #ffffff;
	border-radius: 0 0 16px 16px;
`;

export const NavButton = styled.button`
	padding: 0.5rem;
	border-radius: 0.25rem;
	border: 1px solid #d1d5db;
	background-color: white;
	cursor: pointer;
	transition: background-color 0.2s;

	&:hover:not(:disabled) {
		background-color: #f3f4f6;
	}

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
`;

export const Ellipsis = styled.span`
	padding: 0.5rem 0.75rem;
`;

interface PageButtonProps {
	$active?: boolean;
}

export const PageButton = styled.button<PageButtonProps>`
	padding: 0.5rem 1rem;
	border-radius: 0.25rem;
	border: 1px solid;
	cursor: pointer;
	transition: all 0.2s;

	${({ $active }) =>
		$active
			? `
    background-color: #133E87;
    color: white;
    border-color: #133E87;
    &:focus {
      outline: none;
    }
  `
			: `
    background-color: white;
    color: #374151;
    border-color: #d1d5db;


   


    &:hover {
      background-color: #f3f4f6;
      border-color: 1px solid #133E87;
    }
   


  `}
`;
