import styled from "styled-components";

export const HeaderContainer = styled.header`
	height: 55px;
	background: #e2e8f0;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 16px;
`;

export const IconBtn = styled.button`
	background: transparent;
	border: none;
	padding: 6px;
	border-radius: 6px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	color: inherit;
	position: relative;
	transition: background 0.15s ease;

	&:hover {
		background: #f3f4f6;
	}

	&:focus {
		outline: 2px solid rgba(79, 70, 229, 0.15);
		outline-offset: 2px;
	}
`;

export const Tooltip = styled.span<{ visible?: boolean }>`
	position: absolute;
	bottom: calc(100% + 8px);
	left: 50%;
	transform: translateX(-50%);
	background: #111827;
	color: white;
	padding: 6px 8px;
	border-radius: 6px;
	font-size: 12px;
	white-space: nowrap;
	pointer-events: none;
	opacity: ${(p) => (p.visible ? 1 : 0)};
	visibility: ${(p) => (p.visible ? "visible" : "hidden")};
	transition:
		opacity 0.12s ease,
		visibility 0.12s ease;
	z-index: 30;
`;

export const NavTabTitle = styled.div`
	display: flex;
	flex-direction: row;
	gap: 6px;
	border: none;
	margin-right: 16px;
	font-size: 16px;
	font-weight: 600;
	color: #1e2a3b;
	align-items: center;
`;
