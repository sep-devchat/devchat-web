import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { theme } from "@/themes";
import styled from "styled-components";

export const SettingsContainer = styled.div<{ backgroundImage: string }>`
	height: 100vh;
	width: 100%;
	background-image: url(${(props) => props.backgroundImage});
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	overflow: hidden;
	display: flex;
	flex-direction: column;
`;

export const SettingRows = styled.div`
	display: flex;
	width: 100%;
	flex: 1;
	padding: 0 24px 16px 24px;
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
	// margin-top: 20px;
	margin-bottom: 30px;
	margin-left: 20px;
	z-index: 2;
	cursor: pointer;
	height: max-content;
	color: ${theme.color.grey500};

	&:hover {
		color: ${theme.color.primary};
	}
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
	width: 480px;
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

export const SearchContainer = styled.div`
	position: relative;
	margin-bottom: 24px;
`;

export const SearchInput = styled.input`
	width: 100%;
	padding: 12px 12px 12px 40px;
	background: #f9fafb;
	border: none;
	border-radius: 8px;
	font-size: 14px;
	transition: all 0.2s ease;

	&:focus {
		outline: none;
	}

	&::placeholder {
		color: #9ca3af;
	}
`;

export const SearchIcon = styled.div`
	position: absolute;
	left: 12px;
	top: 50%;
	transform: translateY(-50%);
	color: #9ca3af;
	width: 16px;
	height: 16px;
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

export const MenuLabel = styled.div<{ $isDelete?: boolean }>`
	color: ${({ $isDelete }) =>
		$isDelete ? theme.color.error : theme.color.black};
`;

export const MenuIcon = styled.div<{ $isDelete?: boolean }>`
	width: 20px;
	height: 20px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: ${({ $isDelete }) =>
		$isDelete ? theme.color.error : theme.color.black};
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

export const Header = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 5px 18px;
	flex-shrink: 0;
`;

export const Title = styled.h1`
	font-size: 16px;
	font-weight: bold;
	color: #1a1a1a;
`;

export const NotificationButton = styled.button`
	padding: 8px;
	background: transparent;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	color: #1a1a1a;
	transition: all 0.2s ease;

	&:hover {
		background: #f3f4f6;
	}
`;

// ----------------------------------- Server Profile

export const SectionWrapper = styled.div`
	width: 100%;
	height: 100%;
	padding: 24px;
`;

export const TitleArea = styled.div`
	display: flex;
	flex-direction: column;
	gap: 6px;
	margin-bottom: 40px;
`;

export const TitleSection = styled.h2`
	font-weight: 700;
	font-size: 23px;
	color: ${theme.color.black};
`;

export const DescripSection = styled.p`
	font-size: 16px;
	color: ${theme.color.grey90};
`;

export const LabelItem = styled.h2`
	font-weight: 600;
	font-size: 20px;
	color: ${theme.color.grey600};
`;

export const Form = styled.form`
	display: flex;
	flex-direction: column;
	gap: 20px;
`;

/* Avatar row */
export const AvatarRow = styled.div`
	display: flex;
	gap: 16px;
	align-items: center;
`;

export const AvatarPreviewBox = styled.div`
	width: 96px;
	height: 96px;
	border-radius: 50%;
	background: var(--muted, #f3f4f6);
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
`;

export const AvatarImg = styled.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
	display: block;
`;

export const NoAvatar = styled.div`
	text-align: center;
	color: var(--muted-foreground, #6b7280);
`;

/* Controls next to avatar */
export const AvatarControls = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
	flex: 1;
`;

/* File input wrapper to keep native input but styled container */
export const FileInputWrapper = styled.div`
	input[type="file"] {
		font-size: 14px;
	}
`;

export const Note = styled.div`
	font-size: 12px;
	color: var(--muted-foreground, #6b7280);
`;

/* small link/button */
export const SmallButton = styled.button`
	background: transparent;
	border: none;
	color: #2563eb;
	padding: 0;
	font-size: 13px;
	cursor: pointer;
	text-decoration: underline;
	width: fit-content;
`;

/* Form fields */
export const Field = styled.div`
	display: flex;
	flex-direction: column;
	gap: 6px;
`;

/* Use the existing Input/Textarea components but wrap to set width and spacing */
export const StyledInput = styled(Input)`
	width: 100%;
	box-sizing: border-box;
`;

export const StyledTextarea = styled(Textarea)`
	width: 100%;
	min-height: 96px;
	resize: vertical;
`;

export const Footer = styled.div`
	display: flex;
	gap: 12px;
	justify-content: flex-start;
	align-items: center;
	margin-top: 6px;
`;

/* Buttons: keep using Button component, but we wrap to set size if needed */
export const SubmitButton = styled(Button)``;

/* Error text */
export const ErrorText = styled.div`
	color: #dc2626;
	font-size: 13px;
	margin-top: 4px;
`;
