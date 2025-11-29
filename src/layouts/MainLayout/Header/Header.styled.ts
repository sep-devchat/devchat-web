import styled from "styled-components";

export const HeaderContainer = styled.header`
	background: #e2e8f0;
	display: flex;
	align-items: center;
	justify-content: space-between;

	padding: 0 16px;

	@media (min-width: 1920px) {
		height: 52px;
		padding: 0 17.6px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		height: 50px;
		padding: 0 12.8px;
	}

	@media (max-width: 1220px) {
		height: 47.5px;
		padding: 0 11.2px;
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

	@media (min-width: 1920px) {
		padding: 6.6px 10px;
		border-radius: 6.6px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		padding: 4.8px 6px;
		border-radius: 4.8px;
	}

	@media (max-width: 1220px) {
		padding: 4.2px 2px;
		border-radius: 4.2px;
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

	@media (min-width: 1920px) {
		bottom: calc(100% + 8.8px);
		padding: 6.6px 8.8px;
		border-radius: 6.6px;
		font-size: 14px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		bottom: calc(100% + 6.4px);
		padding: 4.8px 6.4px;
		border-radius: 4.8px;
		font-size: 11px;
	}

	@media (max-width: 1220px) {
		bottom: calc(100% + 5.6px);
		padding: 4.2px 5.6px;
		border-radius: 4.2px;
		font-size: 11px;
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

	@media (min-width: 1920px) {
		gap: 6.6px;
		margin-right: 17.6px;
		font-size: 18px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		gap: 4.8px;
		margin-right: 12.8px;
		font-size: 15px;
	}

	@media (max-width: 1220px) {
		gap: 4.2px;
		margin-right: 11.2px;
		font-size: 14px;
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

	@media (min-width: 1920px) {
		padding: 6.6px 13.2px;
		border-radius: 6.6px;
		font-size: 18px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		padding: 4.8px 9.6px;
		border-radius: 4.8px;
		font-size: 15px;
	}

	@media (max-width: 1220px) {
		padding: 4.2px 8.4px;
		border-radius: 4.2px;
		font-size: 14px;
	}
`;
