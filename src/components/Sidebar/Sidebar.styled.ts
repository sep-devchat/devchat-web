import styled from "styled-components";

export const SidebarContainer = styled.div`
	height: 100%;
	width: max-content;
	background-repeat: no-repeat;
	display: flex;
	flex-direction: column;
`;

export const SettingRows = styled.div`
	display: flex;
	width: max-content;
	flex: 1;
	padding: 0 0px 16px 24px;
	min-height: 0;
`;

export const NavigatorIcon = styled.div`
	width: 60px;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
`;

export const LogoSection = styled.div`
	margin-top: 20px;
	margin-bottom: 30px;
	z-index: 2;
`;

export const LogoBox = styled.div`
	width: 40px;
	height: 40px;
	background: #6b7280;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 8px;
	font-weight: bold;
	color: #fff;
	text-align: center;
	line-height: 1;
	letter-spacing: 0.5px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

export const IndentedSection = styled.div`
	width: 100%;
	background: rgba(255, 255, 255, 0.45);
	border-radius: 80px 0 0 80px;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 40px 0;
	padding-bottom: 60px;
	position: relative;
	flex: 1;
	max-height: 365px;
`;

export const IconContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 20px;
	flex: 1;
	justify-content: flex-start;
	padding-top: 20px;
`;

export const CircleIcon = styled.div<{ selected?: boolean }>`
	width: 32px;
	height: 32px;
	background: ${(props) =>
		props.selected ? "rgba(32, 102, 223, 0.2)" : "#fff"};
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: all 0.2s ease;
	box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

	&:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	svg {
		width: 16px;
		height: 16px;
		color: ${(props) => (props.selected ? "#133E87" : "#AAAAAA")};
	}
`;

export const Sidebar = styled.div`
	width: 308px;
	background: rgba(255, 255, 255, 0.3);
	border-right: 1px solid #e5e7eb;
	height: 100%;
	border-radius: 8px 0px 0px 8px;
`;

export const SidebarContent = styled.div`
	padding: 24px;
	height: 100%;
	display: flex;
	flex-direction: column;
`;

export const HeaderContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 24px;
	padding: 0 4px;
`;

export const GroupTitle = styled.h2`
	font-size: 16px;
	font-weight: 600;
	color: #1a1a1a;
	margin: 0;
`;

export const HeaderButtons = styled.div`
	display: flex;
	gap: 8px;
`;

export const HeaderButton = styled.button`
	background: transparent;
	border: none;
	border-radius: 6px;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: all 0.2s ease;
	color: #1e2a3b;
	padding: 0 10px;
	padding-right: 0px;

	&:focus {
		outline: none;
	}

	svg {
		width: 20px;
		height: 20px;
	}
`;

export const MenuNav = styled.nav`
	display: flex;
	flex-direction: column;
	gap: 8px;
	flex: 1;
`;

export const MenuItem = styled.button<{ $isActive: boolean }>`
	width: 100%;
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 12px 16px;
	border: none;
	border-radius: 8px;
	text-align: left;
	font-weight: 500;
	transition: all 0.2s ease;
	cursor: pointer;

	&:focus {
		outline: none;
	}

	${({ $isActive }) =>
		$isActive
			? `
    background: rgba(32, 102, 223, 0.09);
    color: #133E87;
  `
			: `
    background: transparent;
    color: #1A1A1A;
    border: none;
   
    &:hover {
      background: #f9fafb;
      border: none;
    }
   
    &:focus {
      outline: none;
    }
  `}
`;

export const MenuIcon = styled.div`
	width: 20px;
	height: 20px;
	display: flex;
	align-items: center;
	justify-content: center;
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

export const Input = styled.input`
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

export const Button = styled.button<{ variant?: "primary" | "secondary" }>`
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

export const MainContent = styled.div`
	width: 100%;
	flex: 1;
	border-radius: 0 8px 8px 0;
	background: white;
	overflow: hidden;
	display: flex;
	flex-direction: column;
`;

export const ContentWrapper = styled.div`
	flex: 1;
	overflow-y: auto;
	padding: 0;
	scrollbar-width: none;
	-ms-overflow-style: none;

	&::-webkit-scrollbar {
		display: none;
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
