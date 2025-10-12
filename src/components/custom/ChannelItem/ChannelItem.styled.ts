import { theme } from "@/themes";
import styled from "styled-components";

export const ChannelItemContainer = styled.div`
	display: flex;
	align-items: center;
	padding: 8px 12px;
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	gap: 8px;
	min-height: 40px;
	transition: background-color 0.2s ease;
	&:hover {
		background: ${theme.color.grey30 || "#F3F4F6"};
	}
`;

export const ChannelIconWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	color: #6b7280;
`;

export const ChannelNameText = styled.span`
	flex: 1;
	font-size: 14px;
	color: #374151;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;

	&.active {
		font-weight: 600;
	}
`;

export const MoreButton = styled.button`
	display: none;
	align-items: center;
	justify-content: center;
	width: 24px;
	height: 24px;
	border: none;
	background: transparent;
	border-radius: 4px;
	cursor: pointer;
	color: #6b7280;
	transition: all 0.2s;

	${ChannelItemContainer}:hover & {
		display: flex;
	}

	&:hover {
		color: #374151;
	}

	&.active {
		display: flex;
		background-color: rgba(0, 0, 0, 0.1);
	}

	&:focus {
		outline: none;
	}
`;

export const DropdownMenu = styled.div`
	position: absolute;
	top: 100%;
	right: 8px;
	margin-top: 4px;
	background: white;
	border-radius: 8px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	min-width: 180px;
	z-index: 1000;
	overflow: hidden;
`;

export const DropdownItem = styled.button`
	width: 100%;
	padding: 10px 16px;
	border: none;
	background: transparent;
	text-align: left;
	cursor: pointer;
	font-size: 14px;
	color: #374151;
	transition: background-color 0.2s;
	display: flex;
	align-items: center;
	gap: 8px;

	&.danger {
		color: #dc2626;
	}

	&:focus {
		outline: none;
	}
`;

export const ChannelModalOverlay = styled.div`
	position: fixed;
	inset: 0;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 9999;
`;

export const ChannelModalContent = styled.div`
	background: white;
	border-radius: 12px;
	width: 90%;
	max-width: 480px;
	max-height: 90vh;
	overflow-y: auto;
	box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;

export const ChannelModalHeader = styled.div`
	padding: 20px 24px;
	border-bottom: 1px solid #e5e7eb;
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

export const ChannelModalTitle = styled.h2`
	font-size: 20px;
	font-weight: 600;
	color: #111827;
	margin: 0;
`;

export const ChannelModalBody = styled.div`
	padding: 24px;
`;

export const ChannelModalFooter = styled.div`
	padding: 16px 24px;
	border-top: 1px solid #e5e7eb;
	display: flex;
	gap: 12px;
	justify-content: flex-end;
`;

export const InfoRow = styled.div`
	margin-bottom: 20px;

	&:last-child {
		margin-bottom: 0;
	}
`;

export const InfoLabel = styled.label`
	display: block;
	font-size: 14px;
	font-weight: 500;
	color: #374151;
	margin-bottom: 8px;
`;

export const InfoValue = styled.div`
	font-size: 14px;
	color: #6b7280;
	padding: 10px 12px;
	background-color: #f9fafb;
	border-radius: 6px;
	border: 1px solid #e5e7eb;
`;

export const EditInput = styled.input`
	width: 100%;
	padding: 10px 12px;
	font-size: 14px;
	border: 1px solid #d1d5db;
	border-radius: 6px;
	outline: none;
	transition: border-color 0.2s;

	&:focus {
		border-color: #133e87;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	&:disabled {
		background-color: #f3f4f6;
		cursor: not-allowed;
	}

	&:focus {
		outline: none;
	}
`;

export const EditTextarea = styled.textarea`
	width: 100%;
	padding: 10px 12px;
	font-size: 14px;
	border: 1px solid #d1d5db;
	border-radius: 6px;
	outline: none;
	transition: border-color 0.2s;
	resize: vertical;
	min-height: 80px;
	font-family: inherit;

	&:disabled {
		background-color: #f3f4f6;
		cursor: not-allowed;
	}

	&:focus {
		outline: none;
	}
`;

export const ModalButton = styled.button<{
	variant?: "primary" | "secondary" | "danger";
}>`
	padding: 8px 16px;
	border-radius: 6px;
	font-size: 14px;
	font-weight: 500;
	border: none;
	cursor: pointer;
	transition: all 0.2s;

	${({ variant }) => {
		if (variant === "primary") {
			return `
				background-color: #133e87;
				color: white;
				&:hover:not(:disabled) {
					background-color: #1952b3;
				}
			`;
		}
		if (variant === "secondary") {
			return `
				background-color: transparent;
				color: #374151;
                border: 1px solid #d1d5db;
                &:hover:not(:disabled) {
					  border: 1px solid #133e87;
				}
			`;
		}
		if (variant === "danger") {
			return `
				background-color: #dc2626;
				color: white;
				&:hover:not(:disabled) {
					background-color: #b91c1c;
				}
			`;
		}
		return `
			background-color: transparent;
			color: #374151;
			border: 1px solid #d1d5db;
			&:hover:not(:disabled) {
				background-color: #f3f4f6;
			}
            &:focus { outline: none; }
		`;
	}}

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
`;

export const DeleteConfirmText = styled.p`
	font-size: 14px;
	color: #6b7280;
	margin: 0 0 16px 0;
	line-height: 1.5;
    text
`;

export const DeleteWarning = styled.div`
	background-color: #fef2f2;
	border: 1px solid #fecaca;
	border-radius: 6px;
	padding: 12px;
	margin-bottom: 16px;
`;

export const DeleteWarningText = styled.p`
	font-size: 13px;
	color: #991b1b;
	margin: 0;
	line-height: 1.5;
`;
