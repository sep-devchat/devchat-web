import { theme } from "@/themes";
import styled, { keyframes } from "styled-components";

const borderPulse = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

export const GroupSidebarContainer = styled.div`
	width: 65px;
	height: 93%;
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
`;

export const LogoSection = styled.div`
	margin-top: 7px;
	margin-bottom: 5px;
	z-index: 2;
`;

export const LogoBox = styled.div`
	width: 40px;
	height: 40px;
	border-radius: 50%;
	background: #6b7280;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;

	position: relative;
	transition:
		box-shadow 300ms ease,
		transform 250ms ease,
		opacity 280ms ease,
		filter 280ms ease;

	/* border gradient animation background */
	&::before {
		content: "";
		position: absolute;
		inset: -2px;
		border-radius: inherit;

		background: linear-gradient(
			120deg,
			${theme.color.primary},
			${theme.color.secondary},
			${theme.color.primary}
		);
		background-size: 300% 300%;

		/* mask để background chỉ hiển thị phần viền */
		-webkit-mask:
			linear-gradient(#fff 0 0) content-box,
			linear-gradient(#fff 0 0);
		-webkit-mask-composite: xor;
		mask-composite: exclude;

		padding: 2px;
		opacity: 0; /* mặc định tắt */
		transition: opacity 350ms ease;
		pointer-events: none;
	}

	/* Khi đang ở trang chủ */
	&[data-focused="true"] {
		transform: translateY(-2px);
		filter: brightness(1.05);

		&::before {
			opacity: 1;
			animation: ${borderPulse} 3s ease-in-out infinite;
		}
	}

	/* Khi KHÔNG focus – animation tắt mượt */
	&:not([data-focused="true"])::before {
		animation: none;
		opacity: 0;
	}

	&:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
	}
`;

export const GroupList = styled.ul`
	width: 100%;
	border-radius: 54px 0 0 54px;
	background: rgba(255, 255, 255, 0.45);
	display: flex;
	flex-direction: column;
	gap: 20px;
	align-items: center;
	position: relative;
	height: max-content;
	overflow-y: auto;
	scrollbar-width: none;
	overflow-x: visible;
	padding-bottom: 40px;

	@media (max-width: 1220px) {
		gap: 12px;
	}

	@media (min-width: 1440px) {
		gap: 16px;
	}

	@media (min-width: 1920px) {
		gap: 20px;
	}
`;

export const GroupListOnly = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 20px;
	align-items: center;
	overflow-y: auto;
	scrollbar-width: none;
	overflow-x: visible;
	height: 100%;
	border-top-radius: 60px;
	padding-top: 40px;

	@media (max-width: 1220px) {
		gap: 12px;
	}

	@media (min-width: 1440px) {
		gap: 16px;
	}

	@media (min-width: 1920px) {
		gap: 20px;
	}
`;

export const GroupItem = styled.li`
	display: flex;
	flex-direction: column;
	gap: 12px;
	flex: 1;
	justify-content: flex-start;
`;

export const Triangle = styled.svg`
	position: absolute;
	left: -15px;
	top: 50%;
	width: 12px;
	height: 39px;
	transform: translateY(-50%) scale(0.92);
	pointer-events: none;
	z-index: 3;
	opacity: 0;
	transition:
		opacity 140ms ease,
		transform 140ms ease;
	filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.12));
	display: block;
`;

export const GroupButton = styled.button<{
	$color?: string;
	$active?: boolean;
}>`
	position: relative;
	width: 40px;
	height: 40px;
	border-radius: 200px;
	display: grid;
	place-items: center;
	border: 1px solid rgba(0, 0, 0, 0.06);
	background-color: ${({ $color }) => $color ?? "none"};
	color: #fff;
	font-weight: 600;
	letter-spacing: 0.4px;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
	cursor: pointer;
	border: none;
	transition:
		transform 120ms ease,
		box-shadow 160ms ease,
		border-color 160ms ease,
		border-radius 200ms ease,
		background-color 160ms ease,
		color 160ms ease;

	/* tam giác bên trái (ẩn mặc định) */
	&.left-triangle {
		content: "";
		position: absolute;
		left: -12px; /* di chuyển tam giác ra ngoài trái */
		top: 50%;
		width: 12px;
		height: 39px;
		pointer-events: none;
		z-index: 3;
		clip-path: polygon(100% 50%, 0 0, 0 100%);
		opacity: 0;
		transform-origin: center;
		transition:
			opacity 140ms ease,
			transform 140ms ease;
		background: linear-gradient(
			90deg,
			var(--second-40, #d4d491) 0%,
			var(--primary-50, #4d85e6) 100%
		);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
	}

	&:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
		border-color: rgba(0, 0, 0, 0.12);
	}

	/* show tam giác khi hover OR focus-visible OR đang được chọn */
	&:hover .left-triangle,
	&:focus-visible .left-triangle,
	&[aria-selected="true"] .left-triangle {
		opacity: 1;
		transform: translateY(-50%) scale(1);
	}

	/* outline khi được chọn — giữ như trước, nhưng nâng z-index để tam giác không bị che */
	&[aria-selected="true"] {
		// outline: 2px solid rgba(59, 130, 246, 0.6);
		outline-offset: 2px;
		z-index: 2;
	}

	/* nâng z-index khi focus để tam giác hiển thị bên trên các phần tử xung quanh */
	&:focus-visible {
		z-index: 4;
	}

	&:focus {
		outline: none;
	}

	@media (max-width: 1220px) {
		width: 38px;
		height: 38px;
		font-size: 12.5px;
	}

	@media (min-width: 1440px) {
		width: 39px;
		height: 39px;
		font-size: 13.5px;
	}

	@media (min-width: 1920px) {
		width: 42px;
		height: 42px;
		font-size: 16px;
	}
`;

export const UnreadBadge = styled.span`
	position: absolute;
	top: -2px;
	right: -2px;
	min-width: 18px;
	height: 18px;
	padding: 0 5px;
	border-radius: 9999px;
	background: hsl(var(--destructive, 0 84% 60%));
	color: white;
	font-size: 11px;
	font-weight: 700;
	line-height: 18px;
	text-align: center;
	box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.9);
`;

// A variant of GroupButton used for the "Create group" action
export const CreateGroupButton = styled(GroupButton)`
	background-color: hsl(var(--secondary));
	color: hsl(var(--foreground));
	border-style: dashed;
	border-color: hsl(var(--border));
	box-shadow: none;
	border-width: 1px;
	transition:
		transform 120ms ease,
		box-shadow 160ms ease,
		border-color 160ms ease,
		border-radius 200ms ease,
		background-color 160ms ease,
		color 160ms ease;

	&:hover {
		background-color: hsl(var(--secondary));
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
	}
`;
