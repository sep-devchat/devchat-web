import styled from "styled-components";

export const SidebarContainer = styled.div`
	width: 400px;
	background-color: rgba(255, 255, 255, 0.3);
	border-right: 1px solid #e5e7eb;
	display: flex;
	flex-direction: column;
	position: fixed;
	height: calc(100vh - 48px);
	left: 24px;
	top: 24px;
	border-radius: 10px;
`;

export const SidebarNav = styled.nav`
	display: flex;
	flex-direction: column;
	gap: 8px;
	flex: 1;
	padding: 24px;
	overflow-y: auto;
`;

export const SidebarBottom = styled.div`
	border-top: 1px solid #e5e7eb;
	padding: 16px 24px;
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

export const SidebarItemButton = styled.button<{ $active: boolean }>`
	width: 100%;
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 12px 16px;
	border: none;
	border-radius: 8px;
	text-align: left;
	font-size: 14px;
	font-weight: 500;
	transition: all 0.2s ease;
	cursor: pointer;

	&:focus {
		outline: none;
	}

	${(props) =>
		props.$active
			? `
    background: rgba(32, 102, 223, 0.09);
    color: #133E87;
  `
			: `
    background: transparent;
    color: #1A1A1A;
    
    &:hover {
      background: #f9fafb;
    }
  `}
`;
