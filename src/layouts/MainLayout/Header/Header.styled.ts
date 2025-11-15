import styled from "styled-components";

export const HeaderContainer = styled.header`
	height: 52px;
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
		outline: none;
	}

	&:focus {
		background: #eff6ff;
		color: #6366f1;
		outline: none;
	}
`;

export const Tooltip = styled.span<{ visible?: boolean }>`
	position: absolute;
	bottom: calc(100% + 8px);
	left: 50%;
	transform: translateX(-50%);
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

	&:focus {
		background: #eff6ff;
		color: #6366f1;
		outline: none;
	}
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

export const TabButton = styled.button<{ isActive?: boolean }>`
	padding: 6px 12px;
	border-radius: 6px;
	border: none;
	font-size: 16px;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.2s ease;
	background: ${(p) => (p.isActive ? "#D1DCF0" : "transparent")};
	color: ${(p) => (p.isActive ? "#0141A1" : "#1A1A1A")};

	&:hover:not(:disabled) {
		background: ${(p) => (p.isActive ? "#D1DCF0" : "#f1f5f9")};
		color: ${(p) => (p.isActive ? "#0141A1" : "#475569")};
	}

	&:focus-visible {
		outline: 2px solid #0141a1;
		outline-offset: 2px;
	}

	&:active:not(:disabled) {
		background: ${(p) => (p.isActive ? "#D1DCF0" : "#e2e8f0")};
		color: ${(p) => (p.isActive ? "#0141A1" : "#475569")};
		transform: scale(0.98);
	}

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	&:focus {
		outline: none;
	}
`;
