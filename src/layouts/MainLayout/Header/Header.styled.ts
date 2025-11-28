import styled from "styled-components";

export const HeaderContainer = styled.header`
	background: #e2e8f0;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12px 16px;
	gap: 0.75rem;
	border-top-right-radius: 10px;
	flex-wrap: wrap;

	@media (max-width: 1280px) {
		padding: 12px;
	}
`;

export const TitleSection = styled.div`
	display: flex;
	align-items: center;
	gap: 0.75rem;
	flex: 1;
	min-width: 0;
	flex-wrap: wrap;
	row-gap: 0.35rem;
`;

export const BackButton = styled.button`
	display: inline-flex;
	align-items: center;
	gap: 0.35rem;
	padding: 6px 10px;
	border-radius: 8px;
	border: none;
	background: white;
	color: #0f172a;
	font-size: 0.9rem;
	font-weight: 600;
	cursor: pointer;
	box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
	transition:
		background 0.15s ease,
		box-shadow 0.15s ease;

	&:hover {
		background: #f8fafc;
		box-shadow: 0 2px 5px rgba(15, 23, 42, 0.12);
	}

	&:focus-visible {
		outline: 2px solid #6366f1;
		outline-offset: 2px;
	}

	&:active {
		transform: translateY(1px);
	}
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

	@media (max-width: 1280px) {
		padding: 4px;
		border-radius: 5px;
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

	@media (max-width: 1280px) {
		margin-right: 8px;
		font-size: 15px;
	}
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

	@media (max-width: 1280px) {
		font-size: 14px;
		padding: 5px 10px;
	}

	@media (max-width: 1024px) {
		flex: 1 1 calc(50% - 8px);
		text-align: center;
		min-width: 120px;
	}
`;
