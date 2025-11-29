import { Input } from "@/components/custom/TablePermission/Modal/Modal.styled";
import { Search, Settings as SettingsIcon } from "lucide-react";
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

	@media (max-width: 1220px) {
		gap: 8px;
		border-radius: 8px 0 0 8px;
	}

	@media (min-width: 1440px) {
		gap: 2px;
		border-radius: 12px 0 0 12px;
	}
`;

export const HeaderContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0.75rem;
	border-bottom: 1px solid white;
	flex-shrink: 0;

	@media (max-width: 1220px) {
		padding: 0.375rem;
	}

	@media (min-width: 1440px) {
		padding: 0.35rem;
	}
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

	@media (max-width: 1220px) {
		padding: 0.2rem 0.2rem;
		gap: 8px;
	}

	@media (min-width: 1440px) {
		padding: 0.15rem;
		gap: 8px;
	}
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

	@media (max-width: 1220px) {
		font-size: 0.875rem;
	}

	@media (min-width: 1440px) {
		font-size: 0.875rem;
	}
`;

export const IconButtonGroup = styled.div`
	display: flex;
	gap: 0.5rem;
	flex-shrink: 0;

	@media (max-width: 1220px) {
		gap: 0.25rem;
	}

	@media (min-width: 1440px) {
		gap: 0.15rem;
	}
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

	@media (max-width: 1220px) {
		width: 28px;
		height: 28px;
		border-radius: 4px;
	}

	@media (min-width: 1440px) {
		width: 36px;
		height: 36px;
		border-radius: 8px;
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

	//chua

	@media (max-width: 1220px) {
		padding: 6px 10px;
		font-size: 12px;
		max-width: 250px;
		border-radius: 4px;
	}

	@media (min-width: 1440px) {
		padding: 10px 14px;
		font-size: 15px;
		max-width: 350px;
		border-radius: 8px;
	}
`;

export const SettingsIconStyled = styled(SettingsIcon)`
	width: 20px;

	@media (max-width: 1220px) {
		width: 18px;
	}

	@media (min-width: 1440px) {
		width: 22px;
	}
`;

export const SearchContainer = styled.div`
	position: relative;
	width: 100%;
	display: flex;
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

	@media (max-width: 1220px) {
		left: 0.625rem;
		height: 0.875rem;
		width: 0.875rem;
	}

	@media (min-width: 1440px) {
		left: 1rem;
		height: 1rem;
		width: 1rem;
	}
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

	@media (max-width: 1220px) {
		padding: 0.375rem 0.625rem 0.375rem 2rem;
		font-size: 0.8125rem;
		border-radius: 0.25rem;

		&::placeholder {
			font-size: 0.8125rem;
		}
	}

	@media (min-width: 1440px) {
		padding: 0.5rem 0.875rem 0.5rem 2.5rem;
		font-size: 0.875rem;
		border-radius: 0.5rem;

		&::placeholder {
			font-size: 0.875rem;
		}
	}
`;

export const SectionHeader = styled.div`
	display: flex;
	padding: 0.5rem;
	justify-content: space-between;
	align-items: center;
	flex-shrink: 0;

	@media (max-width: 1220px) {
		padding: 0.375rem;
	}

	@media (min-width: 1440px) {
		padding: 0.5rem;
	}
`;

export const SectionTitle = styled.h3`
	font-size: 1.125rem;
	font-weight: 600;

	@media (max-width: 1220px) {
		font-size: 1rem;
	}

	@media (min-width: 1440px) {
		font-size: 1rem;
	}
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

	@media (max-width: 1220px) {
		width: 1.25rem;
		height: 1.25rem;
		border-radius: 0.2rem;
	}

	@media (min-width: 1440px) {
		width: 2rem;
		height: 2rem;
		border-radius: 0.375rem;
	}
`;

//stop

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

	@media (max-width: 1220px) {
		padding: 0 6px 6px;
		gap: 4px;

		&::-webkit-scrollbar {
			width: 4px;
		}
	}

	@media (min-width: 1440px) {
		padding: 0 0 10px;
		gap: 8px;

		&::-webkit-scrollbar {
			width: 8px;
		}
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

	@media (max-width: 1220px) {
		border-radius: 10px;
		padding: 20px;
		max-width: 450px;
	}

	@media (min-width: 1440px) {
		border-radius: 16px;
		padding: 16px;
		max-width: 400px;
	}
`;

export const ModalHeader = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 24px;

	@media (max-width: 1220px) {
		margin-bottom: 20px;
	}

	@media (min-width: 1440px) {
		margin-bottom: 12px;
	}
`;

export const ModalTitle = styled.h3`
	font-size: 17px;
	font-weight: 600;
	color: #1a1a1a;
	margin: 0;

	@media (max-width: 1220px) {
		font-size: 16px;
	}

	@media (min-width: 1440px) {
		font-size: 16px;
	}
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

	@media (max-width: 1220px) {
		padding: 3px;
	}

	@media (min-width: 1440px) {
		padding: 6px;
		border-radius: 6px;
	}
`;

export const Divider = styled.div`
	display: flex;
	align-items: center;
	text-align: center;
	margin-bottom: 20px;
	color: #9ca3af;

	&::before,
	&::after {
		content: "";
		flex: 1;
		border-bottom: 1px solid #e5e7eb;
	}

	@media (max-width: 1220px) {
		margin-bottom: 16px;
	}

	@media (min-width: 1440px) {
		margin-bottom: 12px;
	}
`;

export const FormSection = styled.div`
	margin-bottom: 20px;

	@media (max-width: 1220px) {
		margin-bottom: 16px;
	}

	@media (min-width: 1440px) {
		margin-bottom: 16px;
	}
`;

export const Label = styled.label`
	display: block;
	font-size: 14px;
	font-weight: 500;
	color: #374151;
	margin-bottom: 8px;

	@media (max-width: 1220px) {
		font-size: 13px;
		margin-bottom: 6px;
	}

	@media (min-width: 1440px) {
		font-size: 13px;
		margin-bottom: 10px;
	}
`;

export const ChannelTypeCard = styled.div`
	border: 1px solid #cbd4e1;
	border-radius: 8px;
	padding: 16px;
	display: flex;
	align-items: center;
	gap: 12px;

	@media (max-width: 1220px) {
		border-radius: 6px;
		padding: 12px;
		gap: 10px;
	}

	@media (min-width: 1440px) {
		border-radius: 10px;
		padding: 10px;
		gap: 16px;
	}
`;

export const ChannelTypeIcon = styled.div`
	width: 20px;
	height: 20px;
	color: #6b7280;

	@media (max-width: 1220px) {
		width: 18px;
		height: 18px;
	}

	@media (min-width: 1440px) {
		width: 18px;
		height: 18px;
	}
`;

export const ChannelTypeContent = styled.div`
	flex: 1;
`;

export const ChannelTypeName = styled.div`
	font-weight: 600;
	color: #1a1a1a;
	margin-bottom: 4px;

	@media (max-width: 1220px) {
		font-size: 14px;
	}

	@media (min-width: 1440px) {
		font-size: 14px;
	}
`;

export const ChannelTypeDescription = styled.div`
	font-size: 13px;
	color: #6b7280;
	line-height: 1.4;

	@media (max-width: 1220px) {
		font-size: 12px;
		line-height: 1.3;
	}

	@media (min-width: 1440px) {
		font-size: 12px;
		line-height: 1;
	}
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

	@media (max-width: 1220px) {
		padding: 10px;
		border-radius: 6px;
		font-size: 13px;
	}

	@media (min-width: 1440px) {
		padding: 14px;
		border-radius: 10px;
		font-size: 12px;
	}
`;

export const PrivateSection = styled.div`
	display: flex;
	align-items: flex-start;
	gap: 12px;
	padding: 16px;
	border-radius: 8px;

	@media (max-width: 1220px) {
		gap: 10px;
		padding: 12px;
		border-radius: 6px;
	}

	@media (min-width: 1440px) {
		gap: 16px;
		padding: 8px;
		border-radius: 10px;
	}
`;

export const PrivateIcon = styled.div`
	width: 20px;
	height: 20px;
	color: #6b7280;
	margin-top: 2px;

	@media (max-width: 1220px) {
		width: 18px;
		height: 18px;
	}

	@media (min-width: 1440px) {
		width: 18px;
		height: 18px;
	}
`;

export const PrivateContent = styled.div`
	flex: 1;
`;

export const PrivateTitle = styled.div`
	font-weight: 600;
	color: #1a1a1a;
	margin-bottom: 4px;

	@media (max-width: 1220px) {
		font-size: 14px;
		margin-bottom: 3px;
	}

	@media (min-width: 1440px) {
		font-size: 14px;
		margin-bottom: 6px;
	}
`;

export const PrivateDescription = styled.div`
	font-size: 13px;
	color: #6b7280;
	line-height: 1.4;

	@media (max-width: 1220px) {
		font-size: 12px;
		line-height: 1.3;
	}

	@media (min-width: 1440px) {
		font-size: 12px;
		line-height: 1;
	}
`;

export const Toggle = styled.label`
	position: relative;
	display: inline-block;
	width: 44px;
	height: 24px;
	margin-top: 2px;

	@media (max-width: 1220px) {
		width: 40px;
		height: 22px;
	}

	@media (min-width: 1440px) {
		width: 48px;
		height: 26px;
	}
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

	@media (max-width: 1220px) {
		border-radius: 22px;

		&:before {
			height: 16px;
			width: 16px;
			left: ${(props) => (props.checked ? "21px" : "3px")};
		}
	}

	@media (min-width: 1440px) {
		border-radius: 26px;

		&:before {
			height: 20px;
			width: 20px;
			left: ${(props) => (props.checked ? "25px" : "3px")};
		}
	}
`;

export const ModalFooter = styled.div`
	display: flex;
	gap: 12px;
	justify-content: space-between;
	margin-top: 24px;

	@media (max-width: 1220px) {
		gap: 10px;
		margin-top: 20px;
	}

	@media (min-width: 1440px) {
		gap: 16px;
		margin-top: 12px;
	}
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

	@media (max-width: 1220px) {
		padding: 8px 14px;
		border-radius: 6px;
		font-size: 13px;
	}

	@media (min-width: 1440px) {
		padding: 8px 16px;
		border-radius: 8px;
		font-size: 14px;
	}
`;

export const ProfileWrapper = styled.div`
	margin-top: auto;
	padding-top: 12px;
	flex-shrink: 0;
	padding: 16px;

	@media (max-width: 1220px) {
		padding-top: 10px;
		padding: 8px;
	}

	@media (min-width: 1440px) {
		padding-top: 16px;
		padding: 10px;
	}
`;
