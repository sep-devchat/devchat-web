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
	display: flex;
	padding: 0;
	margin-right: 12px;
	opacity: ${(props) => (props.show ? 1 : 0)};
	visibility: ${(props) => (props.show ? "visible" : "hidden")};
	transition:
		opacity 0.2s ease,
		visibility 0.2s ease;
	z-index: 9999;
	font-size: 12px;
	color: ${theme.color.grey90 || "#111827"};

	&::after {
		content: "";
		position: absolute;
		top: 50%;
		left: 100%;
		transform: translateY(-50%);
		width: 0;
		height: 0;
		border: 5px solid transparent;
		border-left-color: ${theme.color.white || "#fff"};
	}

	@media (max-width: 1220px) {
		left: 40%;
		right: auto;
		margin-right: 0;
		margin-left: 12px;

		&::after {
			left: auto;
			right: 100%;
			border-left-color: transparent;
			border-right-color: ${theme.color.white || "#fff"};
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
	background: ${theme.color.white || "#fff"};
	color: ${theme.color.grey90 || "#111827"};
	padding: 16px;
	border-radius: 10px;
	width: 260px;
	box-shadow: 0 12px 32px rgba(15, 23, 42, 0.15);
	border: 1px solid ${theme.color.grey200 || "#e5e7eb"};

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
	font-size: 13px;
	font-weight: 600;
	color: ${theme.color.grey900 || "#111827"};
`;

export const TooltipUsername = styled.div`
	font-size: 12px;
	color: ${theme.color.grey500 || "#6b7280"};
`;

export const TooltipActionButton = styled.button`
	width: 100%;
	padding: 10px 14px;
	border-radius: 8px;
	border: 1px solid ${theme.color.primary30 || "#a6c2f2"};
	background: ${theme.color.primary20 || "#d2e0f9"};
	color: ${theme.color.primary90 || "#0d2959"};
	font-size: 13px;
	font-weight: 600;
	transition: all 0.2s ease;
	cursor: pointer;

	&:hover {
		background: ${theme.color.primary30 || "#a6c2f2"};
		color: ${theme.color.white || "#fff"};
	}

	&:focus {
		outline: none;
		box-shadow: 0 0 0 3px rgba(19, 82, 179, 0.2);
	}

	&:disabled {
		cursor: not-allowed;
		background: ${theme.color.grey10 || "#f6f8fc"};
		color: ${theme.color.grey400 || "#9ca3af"};
		border-color: ${theme.color.grey200 || "#e5e7eb"};
		box-shadow: none;
	}
`;
