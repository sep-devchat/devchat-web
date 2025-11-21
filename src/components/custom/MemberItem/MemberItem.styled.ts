import { theme } from "@/themes";
import styled from "styled-components";
import { TooltipProps } from "./MemberItem";

export const MemberItem = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 8px;
	border-radius: 8px;
	cursor: pointer;
	transition: background-color 0.2s ease;

	&:hover {
		background: ${theme.color.grey30 || "#F3F4F6"};
	}
`;

export const MemberAvatarContainer = styled.div`
	position: relative;
`;

export const MemberAvatar = styled.img`
	width: 40px;
	height: 40px;
	border-radius: 50%;
	object-fit: cover;
`;

export const OnlineIndicator = styled.div`
	position: absolute;
	bottom: 2px;
	right: 2px;
	width: 12px;
	height: 12px;
	background: #10b981;
	border: 2px solid white;
	border-radius: 50%;
`;

export const OfflineIndicator = styled.div`
	position: absolute;
	bottom: 2px;
	right: 2px;
	width: 12px;
	height: 12px;
	background: #6b7280;
	border: 2px solid white;
	border-radius: 50%;
`;

export const MemberName = styled.span`
	font-size: 14px;
	font-weight: 500;
	color: ${theme.color.grey90 || "#111827"};
	text-overflow: ellipsis;
	flex: 1;
	min-width: 0;

	@media (max-width: 1220px) {
		font-size: 12px;
	}
`;
export const Tooltip = styled.div<TooltipProps>`
	position: absolute;
	right: 100%;
	top: 50%;
	transform: translateY(-50%);
	background: #000;
	color: white;
	padding: 8px 12px;
	border-radius: 6px;
	font-size: 12px;
	white-space: nowrap;
	margin-right: 8px;
	opacity: ${(props) => (props.show ? 1 : 0)};
	visibility: ${(props) => (props.show ? "visible" : "hidden")};
	transition:
		opacity 0.2s ease,
		visibility 0.2s ease;
	z-index: 9999;
	&::after {
		content: "";
		position: absolute;
		top: 50%;
		left: 100%;
		transform: translateY(-50%);
		width: 0;
		height: 0;
		border: 5px solid transparent;
		border-left-color: #000;
	}

	@media (max-width: 1220px) {
		left: 40%;
		right: auto;
		margin-right: 0;
		margin-left: 8px;

		&::after {
			left: auto;
			right: 100%;
			border-left-color: transparent;
			border-right-color: #000;
		}
	}
`;

export const TooltipContainer = styled.div`
	position: relative;
`;
export const TooltipCard = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 12px;
	background: #1e1f22;
	color: #fff;
	padding: 16px;
	border-radius: 8px;
	width: 260px;
	box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);

	@media (max-width: 768px) {
		min-width: 240px;
		max-width: 320px;
	}
`;

export const TooltipHeader = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
`;

export const TooltipAvatar = styled.img`
	width: 39px;
	height: 39px;
	border-radius: 50%;
`;

export const TooltipName = styled.div`
	font-size: 12px;
	font-weight: bold;
`;

export const TooltipUsername = styled.div`
	font-size: 10px;
	color: #aaa;
`;

export const TooltipInput = styled.input`
	width: 100%;
	padding: 8px 10px;
	border: none;
	border-radius: 6px;
	background: #2b2d31;
	color: #fff;
	font-size: 12px;

	&:focus {
		outline: 2px solid #133e87;
	}
`;
