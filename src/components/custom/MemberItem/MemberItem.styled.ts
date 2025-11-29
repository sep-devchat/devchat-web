import { theme } from "@/themes";
import styled from "styled-components";
import { TooltipProps } from "./MemberItem";

export const MemberItem = styled.div`
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding: 0.75rem;
	border-radius: 0.5rem;
	cursor: pointer;
	transition: background-color 0.2s ease;

	&:hover {
		background: ${theme.color.grey30 || "#F3F4F6"};
	}

	@media (max-width: 1220px) {
		gap: 0.625rem;
		padding: 0.375rem;
		border-radius: 0.375rem;
	}

	@media (min-width: 1440px) {
		gap: 10px;
		padding: 3px;
		border-radius: 0.625rem;
	}
`;

export const MemberAvatarContainer = styled.div`
	position: relative;
`;

export const MemberAvatar = styled.img`
	width: 2.5rem;
	height: 2.5rem;
	border-radius: 50%;
	object-fit: cover;

	@media (max-width: 1220px) {
		width: 2.25rem;
		height: 2.25rem;
	}

	@media (min-width: 1440px) {
		width: 2.5rem;
		height: 2.5rem;
	}
`;

export const OnlineIndicator = styled.div`
	position: absolute;
	bottom: 0.125rem;
	right: 0.125rem;
	width: 0.75rem;
	height: 0.75rem;
	background: #10b981;
	border: 0.125rem solid white;
	border-radius: 50%;

	@media (max-width: 1220px) {
		width: 0.625rem;
		height: 0.625rem;
		border-width: 0.0625rem;
	}

	@media (min-width: 1440px) {
		bottom: 0.05rem;
		right: 0.005rem;
		width: 0.8rem;
		height: 0.8rem;
		border-width: 0.1875rem;
	}
`;

export const OfflineIndicator = styled.div`
	position: absolute;
	bottom: 0.125rem;
	right: 0.125rem;
	width: 0.75rem;
	height: 0.75rem;
	background: #6b7280;
	border: 0.125rem solid white;
	border-radius: 50%;

	@media (max-width: 1220px) {
		width: 0.625rem;
		height: 0.625rem;
		border-width: 0.0625rem;
	}

	@media (min-width: 1440px) {
		bottom: 0.05rem;
		right: 0.005rem;
		width: 0.8rem;
		height: 0.8rem;
		border-width: 0.1875rem;
	}
`;

export const MemberName = styled.span`
	font-size: 0.875rem;
	font-weight: 500;
	color: ${theme.color.grey90 || "#111827"};
	text-overflow: ellipsis;
	flex: 1;
	min-width: 0;

	@media (max-width: 1220px) {
		font-size: 0.75rem;
	}

	@media (min-width: 1440px) {
		font-size: 0.8rem;
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
		margin-left: 0.5rem;
		padding: 0.375rem 0.625rem;
		font-size: 0.6875rem;
		border-radius: 0.25rem;

		&::after {
			left: auto;
			right: 100%;
			border-left-color: transparent;
			border-right-color: #000;
			border-width: 0.25rem;
		}
	}

	@media (min-width: 1440px) {
		padding: 0.5rem;
		font-size: 0.5rem;
		border-radius: 0.5rem;
		margin-right: 0.625rem;

		&::after {
			border-width: 0.375rem;
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


	@media (min-width: 1440px) {
		width: 16rem;
		padding: 1.25rem;
		gap: 0.5rem;
		border-radius: 0.625rem;
	}
  
  	@media (max-width: 1220px) {
		min-width: 15rem;
		max-width: 20rem;
		padding: 0.875rem;
		gap: 0.625rem;
		border-radius: 0.375rem;
	}
`;

export const TooltipHeader = styled.div`
	display: flex;
	align-items: center;
	gap: 0.75rem;

	@media (max-width: 1220px) {
		gap: 0.625rem;
	}

	@media (min-width: 1440px) {
		gap: 0.5rem;
	}
`;

export const TooltipAvatar = styled.img`
	width: 2.4375rem;
	height: 2.4375rem;
	border-radius: 50%;

	@media (max-width: 1220px) {
		width: 2.25rem;
		height: 2.25rem;
	}

	@media (min-width: 1440px) {
		width: 2.5rem;
		height: 2.5rem;
	}
`;

export const TooltipName = styled.div`
		font-size: 13px;
	font-weight: 600;
	color: ${theme.color.grey900 || "#111827"};

	@media (max-width: 1220px) {
		font-size: 0.6875rem;
	}

	@media (min-width: 1440px) {
		font-size: 0.75rem;
	}
`;

export const TooltipUsername = styled.div`
	font-size: 12px;
	color: ${theme.color.grey500 || "#6b7280"};
  
  @media (max-width: 1220px) {
		font-size: 0.5625rem;
	}

	@media (min-width: 1440px) {
		font-size: 0.6rem;
	}
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
    @media (max-width: 1220px) {
		padding: 0.375rem 0.5rem;
		border-radius: 0.25rem;
		font-size: 0.6875rem;
	}

	@media (min-width: 1440px) {
		padding: 0.5rem 0.75rem;
		border-radius: 0.5rem;
		font-size: 0.65rem;
	}
`;
