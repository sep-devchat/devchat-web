import styled from "styled-components";

export const NotificationContainer = styled.div`
	position: relative;
`;

export const BellButton = styled.button`
	position: relative;
	padding: 0;
	border: 0;
	background: transparent;
	cursor: pointer;
	outline: none;

	&:focus {
		outline: none;
	}
`;

export const BellIcon = styled.div`
	width: 1.25rem;
	height: 1.25rem;
	margin-right: 10px;
	color: #374151;

	.dark & {
		color: white;
	}
`;

export const UnreadBadge = styled.span`
	position: absolute;
	top: -0.25rem;
	right: 0.25rem;
	background-color: #d83232;
	color: white;
	font-size: 8px;
	font-weight: bold;
	border-radius: 9999px;
	width: 1rem;
	height: 1rem;
	display: flex;
	align-items: center;
	justify-content: center;

	@media (max-width: 1220px) {
		font-size: 6px;
		width: calc(1rem * 0.7);
		height: calc(1rem * 0.7);
	}

	@media (min-width: 1440px) {
		font-size: 6px;
		width: calc(1rem * 0.8);
		height: calc(1rem * 0.8);
	}

	@media (min-width: 1920px) {
		font-size: 9px;
		width: calc(1rem * 1.1);
		height: calc(1rem * 1.1);
	}
`;

export const PopupWrapper = styled.div`
	position: absolute;
	right: 0;
	margin-top: 0.5rem;
	width: 24rem;
	background-color: white;
	border-radius: 0.5rem;
	box-shadow:
		0 20px 25px -5px rgba(0, 0, 0, 0.1),
		0 10px 10px -5px rgba(0, 0, 0, 0.04);
	border: 1px solid #e5e7eb;
	z-index: 50;
	max-height: 600px;
	display: flex;
	flex-direction: column;

	.dark & {
		background-color: #1f2937;
		border-color: #374151;
	}

	@media (max-width: 1220px) {
		width: calc(24rem * 0.7);
		max-height: calc(600px * 0.7);
	}

	@media (min-width: 1440px) {
		width: calc(24rem * 0.8);
		max-height: calc(600px * 0.8);
	}

	@media (min-width: 1920px) {
		width: calc(24rem * 1.1);
		max-height: calc(600px * 1.1);
	}
`;

export const PopupHeader = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 1rem;
	border-bottom: 1px solid #e5e7eb;

	.dark & {
		border-color: #374151;
	}

	@media (max-width: 1220px) {
		padding: calc(1rem * 0.7);
	}

	@media (min-width: 1440px) {
		padding: calc(1rem * 0.8);
	}

	@media (min-width: 1920px) {
		padding: calc(1rem * 1.1);
	}
`;

export const PopupTitle = styled.h3`
	font-size: 1.05rem;
	font-weight: 500;
	color: #1a1a1a;

	.dark & {
		color: white;
	}

	@media (max-width: 1220px) {
		font-size: 14px;
	}

	@media (min-width: 1440px) {
		font-size: 15px;
	}

	@media (min-width: 1920px) {
		font-size: 18px;
	}
`;

export const MarkAllButton = styled.button`
	font-size: 0.875rem;
	color: #133e87;
	font-weight: 500;
	background: transparent;
	border: none;
	cursor: pointer;

	&:hover {
		color: #1952b3;
	}
	&:focus {
		outline: none;
	}

	@media (max-width: 1220px) {
		font-size: 12px;
	}

	@media (min-width: 1440px) {
		font-size: 13px;
	}

	@media (min-width: 1920px) {
		font-size: 16px;
	}
`;

export const NotificationList = styled.div`
	overflow-y: auto;
	flex: 1;
`;

export const EmptyState = styled.div`
	padding: 2rem;
	text-align: center;
	color: #6b7280;

	.dark & {
		color: #9ca3af;
	}

	@media (max-width: 1220px) {
		padding: calc(2rem * 0.7);
	}

	@media (min-width: 1440px) {
		padding: calc(2rem * 0.8);
	}

	@media (min-width: 1920px) {
		padding: calc(2rem * 1.1);
	}
`;

export const EmptyIcon = styled.div`
	width: 3rem;
	height: 3rem;
	margin: 0 auto 0.75rem;
	opacity: 0.5;

	@media (max-width: 1220px) {
		width: calc(3rem * 0.7);
		height: calc(3rem * 0.7);
	}

	@media (min-width: 1440px) {
		width: calc(3rem * 0.8);
		height: calc(3rem * 0.8);
	}

	@media (min-width: 1920px) {
		width: calc(3rem * 1.1);
		height: calc(3rem * 1.1);
	}
`;

export const NotificationItem = styled.div<{ $isRead: boolean }>`
	padding: 1rem;
	border-bottom: 1px solid #f3f4f6;
	transition: background-color 0.2s;
	cursor: pointer;
	background-color: ${({ $isRead }) => ($isRead ? "transparent" : "#eff6ff")};

	&:hover {
		background-color: #f9fafb;
	}

	.dark & {
		border-color: #374151;
		background-color: ${({ $isRead }) =>
			$isRead ? "transparent" : "rgba(37, 99, 235, 0.2)"};

		&:hover {
			background-color: rgba(55, 65, 81, 0.5);
		}
	}

	@media (max-width: 1220px) {
		padding: calc(1rem * 0.7);
	}

	@media (min-width: 1440px) {
		padding: calc(1rem * 0.8);
	}

	@media (min-width: 1920px) {
		padding: calc(1rem * 1.1);
	}
`;

export const NotificationContent = styled.div`
	display: flex;
	gap: 0.75rem;
`;

export const IconWrapper = styled.div`
	flex-shrink: 0;
	margin-top: 0.25rem;
`;

export const TextContent = styled.div`
	flex: 1;
	min-width: 0;
`;

export const NotificationTitle = styled.p`
	font-size: 0.875rem;
	font-weight: 600;
	color: #111827;
	margin-bottom: 0.25rem;

	.dark & {
		color: white;
	}

	@media (max-width: 1220px) {
		font-size: 12px;
	}

	@media (min-width: 1440px) {
		font-size: 13px;
	}

	@media (min-width: 1920px) {
		font-size: 16px;
	}
`;

export const NotificationMessage = styled.p`
	font-size: 0.875rem;
	color: #4b5563;
	margin-bottom: 0.5rem;

	.dark & {
		color: #d1d5db;
	}

	@media (max-width: 1220px) {
		font-size: 12px;
	}

	@media (min-width: 1440px) {
		font-size: 13px;
	}

	@media (min-width: 1920px) {
		font-size: 16px;
	}
`;

export const NotificationTime = styled.p`
	font-size: 0.75rem;
	color: #6b7280;
	margin-bottom: 0.5rem;

	.dark & {
		color: #9ca3af;
	}

	@media (max-width: 1220px) {
		font-size: 11px;
	}

	@media (min-width: 1440px) {
		font-size: 12px;
	}

	@media (min-width: 1920px) {
		font-size: 14px;
	}
`;

export const ActionButtons = styled.div`
	display: flex;
	gap: 0.5rem;
	margin-top: 0.5rem;
`;

export const AcceptButton = styled.button`
	padding: 0.5rem 1rem;
	background-color: #133e87;
	color: white;
	font-size: 0.875rem;
	font-weight: 500;
	border-radius: 0.375rem;
	border: none;
	cursor: pointer;
	transition: background-color 0.2s;

	&:hover {
		background-color: #1952b3;
	}
	&:focus {
		outline: none;
	}

	@media (max-width: 1220px) {
		padding: calc(0.5rem * 0.7) calc(1rem * 0.7);
		font-size: 12px;
	}

	@media (min-width: 1440px) {
		padding: calc(0.5rem * 0.8) calc(1rem * 0.8);
		font-size: 13px;
	}

	@media (min-width: 1920px) {
		padding: calc(0.5rem * 1.1) calc(1rem * 1.1);
		font-size: 16px;
	}
`;

export const DeclineButton = styled.button`
	padding: 0.5rem 1rem;
	background-color: #e5e7eb;
	color: #1f2937;
	font-size: 0.875rem;
	font-weight: 500;
	border-radius: 0.375rem;
	border: none;
	cursor: pointer;
	transition: background-color 0.2s;

	&:hover {
		background-color: #d1d5db;
	}
	&:focus {
		outline: none;
	}

	.dark & {
		background-color: #374151;
		color: #e5e7eb;

		&:hover {
			background-color: #4b5563;
		}
	}

	@media (max-width: 1220px) {
		padding: calc(0.5rem * 0.7) calc(1rem * 0.7);
		font-size: 12px;
	}

	@media (min-width: 1440px) {
		padding: calc(0.5rem * 0.8) calc(1rem * 0.8);
		font-size: 13px;
	}

	@media (min-width: 1920px) {
		padding: calc(0.5rem * 1.1) calc(1rem * 1.1);
		font-size: 16px;
	}
`;

export const ViewDetailsButton = styled.button`
	padding: 0.5rem 1rem;
	background-color: #d83232;
	color: white;
	font-size: 0.875rem;
	font-weight: 500;
	border-radius: 0.375rem;
	border: none;
	cursor: pointer;
	transition: background-color 0.2s;

	&:hover {
		background-color: #dc2626;
	}
	&:focus {
		outline: none;
	}

	@media (max-width: 1220px) {
		padding: calc(0.5rem * 0.7) calc(1rem * 0.7);
		font-size: 12px;
	}

	@media (min-width: 1440px) {
		padding: calc(0.5rem * 0.8) calc(1rem * 0.8);
		font-size: 13px;
	}

	@media (min-width: 1920px) {
		padding: calc(0.5rem * 1.1) calc(1rem * 1.1);
		font-size: 16px;
	}
`;

export const DeleteButton = styled.button`
	flex-shrink: 0;
	padding: 0.25rem;
	background: transparent;
	border: none;
	border-radius: 0.25rem;
	cursor: pointer;
	transition: background-color 0.2s;

	.dark &:hover {
		background-color: #374151;
	}

	&:focus {
		outline: none;
	}

	@media (max-width: 1220px) {
		padding: calc(0.25rem * 0.7);
	}

	@media (min-width: 1440px) {
		padding: calc(0.25rem * 0.8);
	}

	@media (min-width: 1920px) {
		padding: calc(0.25rem * 1.1);
	}
`;

export const PopupFooter = styled.div`
	padding: 0.75rem;
	border-top: 1px solid #e5e7eb;
	text-align: center;

	.dark & {
		border-color: #374151;
	}

	@media (max-width: 1220px) {
		padding: calc(0.75rem * 0.7);
	}

	@media (min-width: 1440px) {
		padding: calc(0.75rem * 0.8);
	}

	@media (min-width: 1920px) {
		padding: calc(0.75rem * 1.1);
	}
`;

export const FooterMessage = styled.span`
	font-size: 0.8125rem;
	color: #6b7280;

	.dark & {
		color: #9ca3af;
	}

	@media (max-width: 1220px) {
		font-size: 11px;
	}

	@media (min-width: 1440px) {
		font-size: 12px;
	}

	@media (min-width: 1920px) {
		font-size: 14px;
	}
`;
