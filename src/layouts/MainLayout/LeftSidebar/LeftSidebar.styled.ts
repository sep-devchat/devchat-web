import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import styled from "styled-components";

export const LeftSidebarContainer = styled.div`
	display: flex;
	flex-direction: column;
	border-radius: 10px 0 0 10px;
	background: rgba(255, 255, 255, 0.3);
`;

export const SearchInput = styled(Input)`
	border-radius: 5px;
	border: 1px solid rgba(25, 82, 179, 0.21);
	background: rgba(32, 102, 223, 0.09);
`;

export const IconButton = styled(Button)`
	box-shadow: none;
	border: none;
	font-size: 1.25rem;
	padding: 0;

	&:hover {
		color: hsl(var(--ring));
	}

	&:focus,
	&:focus-visible {
		outline: none;
	}
`;

// Friend list styles
export const FriendList = styled.ul`
	list-style: none;
	margin: 0;
	padding: 0 8px 8px;
	display: flex;
	flex-direction: column;
	gap: 6px;
`;

export const Avatar = styled.div`
	width: 32px;
	height: 32px;
	border-radius: 9999px;
	display: grid;
	place-items: center;
	background: hsl(var(--primary));
	color: hsl(var(--primary-foreground));
	font-weight: 600;
	font-size: 0.85rem;
	letter-spacing: 0.3px;
	flex: 0 0 auto;
`;

export const FriendName = styled.span`
	flex: 1;
	min-width: 0;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	color: hsl(var(--foreground));
	font-size: 0.95rem;
`;

export const ChannelIcon = styled(Avatar)`
	background: hsl(var(--muted));
	color: hsl(var(--foreground));
	font-weight: 700;
`;

export const FriendItem = styled.li`
	position: relative;
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 6px 36px 6px 8px; /* leave room for the remove button */
	border-radius: 8px;
	cursor: pointer;

	&:hover {
		background: rgba(0, 0, 0, 0.05);
	}
`;

export const ModalOverlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
`;

export const ModalContent = styled.div`
	background: white;
	border-radius: 12px;
	padding: 24px;
	width: 90%;
	max-width: 500px;
	position: relative;
	box-shadow:
		0 20px 25px -5px rgba(0, 0, 0, 0.1),
		0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

export const ModalHeader = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 24px;
`;

export const ModalTitle = styled.h3`
	font-size: 17px;
	font-weight: 600;
	color: #1a1a1a;
	margin: 0;
`;

export const CloseButton = styled.button`
	background: none;
	border: none;
	cursor: pointer;
	color: #6b7280;
	padding: 4px;
	border-radius: 4px;
	transition: color 0.2s ease;
	&:hover {
		color: #374151;
	}
	&:focus {
		outline: none;
	}
`;

export const FormSection = styled.div`
	margin-bottom: 20px;
`;

export const Label = styled.label`
	display: block;
	font-size: 14px;
	font-weight: 500;
	color: #374151;
	margin-bottom: 8px;
`;

export const ChannelTypeCard = styled.div`
	border: 1px solid #cbd4e1;
	border-radius: 8px;
	padding: 16px;
	display: flex;
	align-items: center;
	gap: 12px;
`;

export const ChannelTypeIcon = styled.div`
	width: 20px;
	height: 20px;
	color: #6b7280;
	margin-top: 2px;
`;

export const ChannelTypeContent = styled.div`
	flex: 1;
`;

export const ChannelTypeName = styled.div`
	font-weight: 600;
	color: #1a1a1a;
	margin-bottom: 4px;
`;

export const ChannelTypeDescription = styled.div`
	font-size: 13px;
	color: #6b7280;
	line-height: 1.4;
`;

export const InputModal = styled.input`
	width: 100%;
	padding: 12px;
	border: 1px solid #6b7280;
	border-radius: 8px;
	font-size: 14px;
	transition: border-color 0.2s ease;
	background: #f3f5f7;
	&:focus {
		outline: none;
		border-color: #133e87;
	}
	&::placeholder {
		color: #6b7280;
	}
`;

export const PrivateSection = styled.div`
	display: flex;
	align-items: flex-start;
	gap: 12px;
	padding: 16px;
	border-radius: 8px;
`;

export const PrivateIcon = styled.div`
	width: 20px;
	height: 20px;
	color: #6b7280;
	margin-top: 2px;
`;

export const PrivateContent = styled.div`
	flex: 1;
`;

export const PrivateTitle = styled.div`
	font-weight: 600;
	color: #1a1a1a;
	margin-bottom: 4px;
`;

export const PrivateDescription = styled.div`
	font-size: 13px;
	color: #6b7280;
	line-height: 1.4;
`;

export const Toggle = styled.label`
	position: relative;
	display: inline-block;
	width: 44px;
	height: 24px;
	margin-top: 2px;
`;

export const ToggleInput = styled.input`
	opacity: 0;
	width: 0;
	height: 0;
`;

export const ToggleSlider = styled.span<{ checked: boolean }>`
	position: absolute;
	cursor: pointer;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: ${(props) => (props.checked ? "#1952B3" : "#d1d5db")};
	transition: 0.4s;
	border-radius: 24px;
	&:before {
		position: absolute;
		content: "";
		height: 18px;
		width: 18px;
		left: ${(props) => (props.checked ? "23px" : "3px")};
		bottom: 3px;
		background-color: white;
		transition: 0.4s;
		border-radius: 50%;
	}
`;

export const ModalFooter = styled.div`
	display: flex;
	gap: 12px;
	justify-content: space-between;
	margin-top: 24px;
`;

export const ButtonModal = styled.button<{ variant?: "primary" | "secondary" }>`
	padding: 10px 16px;
	border-radius: 8px;
	cursor: pointer;
	transition: all 0.2s ease;
	font-size: 14px;
	${(props) =>
		props.variant === "primary"
			? `
        background: #1952B3;
        color: white;
        border: none;
        &:hover {
            background: #1d4ed8;
        }
        &:disabled {
            background: #9ca3af;
            cursor: not-allowed;
        }
    `
			: `
        background: transparent;
        color: #1952B3;
        border: 1px solid #1952B3;
        &:hover {
            background: #F3F5F7;
        }
    `}
	&:focus {
		outline: none;
	}
`;

export const Divider = styled.div`
	display: flex;
	align-items: center;
	text-align: center;
	margin-bottom: 20px;
	color: #9ca3af;
	font-size: 14px;
	&::before,
	&::after {
		content: "";
		flex: 1;
		border-bottom: 1px solid #e5e7eb;
	}
`;
