import { Input } from "@/components/custom/TablePermission/Modal/Modal.styled";
import { Plus, Search, Settings as SettingsIcon } from "lucide-react";
import styled from "styled-components";

export const LeftSidebarContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	background: rgba(255, 255, 255, 0.3);
	border-radius: 10px 0 0 10px;
	overflow: hidden;
	gap: 12px;
`;

export const HeaderContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0.5rem;
	border-bottom: 1px solid white;
	flex-shrink: 0;
`;

export const GroupHeader = styled.div`
	width: 100%;
	padding: 0.25rem 0.25rem;
	padding-top: 0.375rem;
	padding-bottom: 0.375rem;
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 12px;
	min-width: 0;
`;

export const TooltipWrapper = styled.div`
	position: relative;
	flex: 1;
	min-width: 0;
	display: flex;
	align-items: center;
`;

export const GroupTitle = styled.h3`
	font-size: 1rem;
	font-weight: 600;
	margin: 0;

	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	min-width: 0;
	width: 100%;
`;

export const IconButtonGroup = styled.div`
	display: flex;
	gap: 0.5rem;
	flex-shrink: 0;
`;

export const IconButton = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 32px;
	height: 32px;
	border: none;
	background: transparent;
	border-radius: 6px;
	cursor: pointer;
	transition: background-color 0.2s;
	flex-shrink: 0;

	&:hover {
		color: #3b82f6;
	}
`;

export const Tooltip = styled.div`
	position: absolute;
	top: calc(100% + 8px);
	left: 0;
	background: #1f2937;
	color: #ffffff;
	padding: 8px 12px;
	border-radius: 6px;
	font-size: 14px;
	font-weight: 500;
	white-space: normal;
	word-break: break-word;
	max-width: 300px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	z-index: 1000;
	animation: fadeIn 0.15s ease-in;

	&::before {
		content: "";
		position: absolute;
		bottom: 100%;
		left: 16px;
		border: 6px solid transparent;
		border-bottom-color: #1f2937;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(-4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
`;

export const PlusIcon = styled(Plus)`
	width: 20px;
	margin-left: 0.75rem;
`;

export const SettingsIconStyled = styled(SettingsIcon)`
	width: 20px;
`;

export const SearchContainer = styled.div`
	position: relative;
	width: 100%;
	display: flex;
	gap: 40px;
`;

export const SearchIconWrapper = styled.div`
	position: absolute;
	left: -3px;
	top: 50%;
	transform: translateY(-50%);
	color: #6b7280;
	pointer-events: none;
	display: flex;
	align-items: center;
`;

export const SearchIcon = styled(Search)`
	pointer-events: none;
	position: absolute;
	left: 0.75rem;
	top: 50%;
	transform: translateY(-50%);
	height: 1rem;
	width: 1rem;
	color: #9ca3af;
	z-index: 1;
`;

export const SearchInput = styled(Input)<{ prefix?: React.ReactNode }>`
	width: 100%;
	padding: 0.5rem 0.75rem 0.5rem 2.25rem;
	border-radius: 0.375rem;
	border: 1px solid rgba(25, 82, 179, 0.21);
	background: rgba(32, 102, 223, 0.09);
	font-size: 0.875rem;
	color: #1f2937;
	transition: all 0.2s ease;

	&:focus {
		outline: none;
		border-color: rgba(25, 82, 179, 0.4);
		background: rgba(32, 102, 223, 0.12);
		box-shadow: 0 0 0 3px rgba(32, 102, 223, 0.1);
	}

	&::placeholder {
		color: #9ca3af;
		font-size: 0.875rem;
	}

	&:hover:not(:focus) {
		border-color: rgba(25, 82, 179, 0.3);
	}
`;

export const SectionHeader = styled.div`
	display: flex;
	padding: 0.5rem;
	justify-content: space-between;
	align-items: center;
	flex-shrink: 0;
`;

export const SectionTitle = styled.h3`
	font-size: 1.125rem;
	font-weight: 600;
`;

export const AddButton = styled.button`
	width: 1.5rem;
	height: 1.5rem;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 0.25rem;
	cursor: pointer;
	background: transparent;
	border: none;

	&:hover {
		background: #e5e7eb;
	}
`;

export const FriendList = styled.ul`
	list-style: none;
	margin: 0;
	padding: 0 8px 8px;
	display: flex;
	flex-direction: column;
	gap: 6px;
	flex: 1;
	overflow-y: auto;
	min-height: 0;

	/* Custom scrollbar */
	&::-webkit-scrollbar {
		width: 6px;
	}

	&::-webkit-scrollbar-track {
		background: transparent;
	}

	&::-webkit-scrollbar-thumb {
		background: rgba(0, 0, 0, 0.2);
		border-radius: 3px;
	}

	&::-webkit-scrollbar-thumb:hover {
		background: rgba(0, 0, 0, 0.3);
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

export const ButtonModal = styled.button<{
	variant?: "primary" | "secondary";
	disabled?: boolean;
}>`
	padding: 10px 16px;
	border-radius: 8px;
	cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
	transition: all 0.2s ease;
	font-size: 14px;

	${(props) =>
		props.variant === "primary"
			? `
    background: ${props.disabled ? "#9ca3af" : "#1952B3"};
    color: white;
    border: none;
    
    &:hover {
      background: ${props.disabled ? "#9ca3af" : "#1d4ed8"};
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

export const ProfileWrapper = styled.div`
	margin-top: auto;
	padding-top: 12px;
	flex-shrink: 0;
	padding: 16px;
`;
