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
	padding: 0 1.25rem 0.875rem 1.25rem;
	min-height: 0;

	@media (min-width: 1440px) {
		padding: 0 1.5rem 1rem 1.5rem;
	}

	@media (max-width: 1220px) {
		padding: 0 0.875rem 0.625rem 0.875rem;
	}
`;

export const NavigatorIcon = styled.div`
	width: 3.25rem;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;

	@media (min-width: 1440px) {
		width: 3.75rem;
	}

	@media (max-width: 1220px) {
		width: 2.75rem;
	}
`;

export const LogoSection = styled.div`
	position: absolute;
	top: 1rem;
	right: 1rem;
	z-index: 10;
	cursor: pointer;
	height: max-content;
	color: ${theme.color.grey500};

	&:hover {
		color: ${theme.color.primary};
	}

	@media (min-width: 1440px) {
		top: 1.25rem;
		right: 1.25rem;
	}

	@media (max-width: 1220px) {
		top: 0.875rem;
		right: 0.875rem;
	}
`;

export const IndentedSection = styled.div`
	width: 100%;
	background: rgba(255, 255, 255, 0.45);
	border-radius: 4.5rem 0 0 4.5rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 2rem 0;
	padding-bottom: 3.25rem;
	position: relative;
	flex: 1;
	max-height: 20rem;

	@media (min-width: 1440px) {
		border-radius: 5rem 0 0 5rem;
		padding: 2.5rem 0;
		padding-bottom: 3.75rem;
		max-height: 22.5rem;
	}

	@media (max-width: 1220px) {
		border-radius: 3.75rem 0 0 3.75rem;
		padding: 1.75rem 0;
		padding-bottom: 2.75rem;
		max-height: 18rem;
	}
`;

export const IconContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1rem;
	flex: 1;
	justify-content: flex-start;
	padding-top: 1rem;

	@media (min-width: 1440px) {
		gap: 1.25rem;
		padding-top: 1.25rem;
	}

	@media (max-width: 1220px) {
		gap: 0.875rem;
		padding-top: 0.875rem;
	}
`;

export const CircleIcon = styled.div<{ selected?: boolean }>`
	width: 1.75rem;
	height: 1.75rem;
	background: ${(props) =>
		props.selected ? "rgba(32, 102, 223, 0.2)" : "#fff"};
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: all 0.2s ease;
	box-shadow: 0 0.125rem 0.375rem rgba(0, 0, 0, 0.1);

	&:hover {
		transform: translateY(-0.0625rem);
		box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.15);
	}

	svg {
		width: 0.875rem;
		height: 0.875rem;
		color: ${(props) => (props.selected ? "#133E87" : "#AAAAAA")};
	}

	@media (min-width: 1440px) {
		width: 2rem;
		height: 2rem;

		svg {
			width: 1rem;
			height: 1rem;
		}
	}

	@media (max-width: 1220px) {
		width: 1.5rem;
		height: 1.5rem;

		svg {
			width: 0.75rem;
			height: 0.75rem;
		}
	}
`;

export const Sidebar = styled.div`
	width: 24rem;
	background: rgba(255, 255, 255, 0.3);
	border-right: 1px solid #e5e7eb;
	height: 100%;
	border-radius: 0.5rem 0 0 0.5rem;

	@media (max-width: 1220px) {
		width: 280px;
	}

	@media (min-width: 1440px) {
		width: 380px;
	}

	@media (min-width: 1920px) {
		width: 420px;
	}
`;

export const SidebarContent = styled.div`
	padding: 1.25rem;
	height: 100%;
	display: flex;
	flex-direction: column;

	@media (min-width: 1440px) {
		padding: 1.5rem;
	}

	@media (max-width: 1220px) {
		padding: 0.875rem;
	}
`;

export const SearchContainer = styled.div`
	position: relative;
	margin-bottom: 1.25rem;

	@media (min-width: 1440px) {
		margin-bottom: 1.5rem;
	}

	@media (max-width: 1220px) {
		margin-bottom: 0.875rem;
	}
`;

export const SearchInput = styled.input`
	width: 100%;
	padding: 0.625rem 0.625rem 0.625rem 2.25rem;
	background: #f9fafb;
	border: none;
	border-radius: 0.5rem;
	font-size: 0.8125rem;
	transition: all 0.2s ease;

	&:focus {
		outline: none;
	}

	&::placeholder {
		color: #9ca3af;
	}

	@media (max-width: 1220px) {
		font-size: 12.5px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 13.5px;
	}

	@media (min-width: 1920px) {
		font-size: 16.5px;
	}
`;

export const SearchIcon = styled.div`
	position: absolute;
	left: 0.625rem;
	top: 50%;
	transform: translateY(-50%);
	color: #9ca3af;
	width: 0.875rem;
	height: 0.875rem;

	@media (min-width: 1440px) {
		left: 0.75rem;
		width: 1rem;
		height: 1rem;
	}

	@media (max-width: 1220px) {
		left: 0.5rem;
		width: 0.75rem;
		height: 0.75rem;
	}
`;

export const MenuNav = styled.nav`
	display: flex;
	flex-direction: column;
	gap: 0.375rem;
	flex: 1;

	@media (min-width: 1440px) {
		gap: 0.5rem;
	}

	@media (max-width: 1220px) {
		gap: 0.25rem;
	}
`;

export const MenuItem = styled.button<{ $isActive: boolean }>`
	width: 100%;
	display: flex;
	align-items: center;
	gap: 0.625rem;
	padding: 0.625rem 0.875rem;
	border: none;
	border-radius: 0.5rem;
	text-align: left;
	font-weight: 500;
	font-size: 0.875rem;
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

	@media (max-width: 1220px) {
		font-size: 14px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 15px;
	}

	@media (min-width: 1920px) {
		font-size: 18px;
	}
`;

export const MenuIcon = styled.div<{ $isDelete?: boolean }>`
	width: 1.125rem;
	height: 1.125rem;
	display: flex;
	align-items: center;
	justify-content: center;
	color: ${({ $isDelete }) =>
		$isDelete ? theme.color.error : theme.color.black};

	@media (max-width: 1220px) {
		width: 18px;
		height: 18px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		width: 20px;
		height: 20px;
	}

	@media (min-width: 1920px) {
		width: 22px;
		height: 22px;
	}
`;

export const MenuLabel = styled.div<{ $isDelete?: boolean }>`
	color: ${({ $isDelete }) =>
		$isDelete ? theme.color.error : theme.color.black};
`;

export const MainContent = styled.div`
	width: 100%;
	flex: 1;
	border-radius: 0 0.5rem 0.5rem 0;
	background: white;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	position: relative;
`;

export const ContentWrapper = styled.div`
	flex: 1;
	overflow-y: auto;
	padding: 0;
	scrollbar-width: none;
	-ms-overflow-style: none;
	position: relative;

	&::-webkit-scrollbar {
		display: none;
	}

	width: 100%;

	@media (max-width: 1220px) {
		width: auto;
	}
`;

export const Header = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0.25rem 1rem;
	flex-shrink: 0;

	@media (min-width: 1440px) {
		padding: 0.3125rem 1.125rem;
	}

	@media (max-width: 1220px) {
		padding: 0.1875rem 0.75rem;
	}
`;

export const Title = styled.h1`
	font-size: 0.9375rem;
	font-weight: bold;
	color: #1a1a1a;

	@media (max-width: 1220px) {
		font-size: 14px;
		padding: 3px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 16px;
		padding: 5px;
	}

	@media (min-width: 1920px) {
		font-size: 18px;
		padding: 8px;
	}
`;

export const NotificationButton = styled.button`
	padding: 0.4375rem;
	background: transparent;
	border: none;
	border-radius: 0.375rem;
	cursor: pointer;
	color: #1a1a1a;
	transition: all 0.2s ease;

	&:hover {
		background: #f3f4f6;
	}

	@media (min-width: 1440px) {
		padding: 0.5rem;
	}

	@media (max-width: 1220px) {
		padding: 0.3125rem;
	}
`;

// ----------------------------------- Server Profile

export const SectionWrapper = styled.div`
	width: 100%;
	height: 100%;
	padding: 1rem;

	@media (min-width: 1440px) {
		padding: 1.25rem;
	}

	@media (max-width: 1220px) {
		padding: 0.875rem;
	}
`;

export const TitleArea = styled.div`
	display: flex;
	flex-direction: column;
	margin-bottom: 1.5rem;

	@media (min-width: 1440px) {
		margin-bottom: 2rem;
	}

	@media (max-width: 1220px) {
		margin-bottom: 1.25rem;
	}
`;

export const TitleSection = styled.h2`
	font-size: 1.25rem;
	font-weight: 600;
	color: #1a1a1a;

	@media (max-width: 1220px) {
		font-size: 14.5px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 15.5px;
	}

	@media (min-width: 1920px) {
		font-size: 18px;
	}
`;

export const DescripSection = styled.p`
	color: #666666;
	font-size: 1rem;

	@media (max-width: 1220px) {
		font-size: 12.5px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 13.5px;
	}

	@media (min-width: 1920px) {
		font-size: 16px;
	}
`;

export const LabelItem = styled.h2`
	font-weight: 600;
	font-size: 0.9375rem;
	color: ${theme.color.grey600};

	@media (min-width: 1440px) {
		font-size: 1.0625rem;
	}

	@media (max-width: 1220px) {
		font-size: 0.875rem;
	}
`;

export const Form = styled.form`
	display: flex;
	flex-direction: column;
	gap: 0.875rem;

	@media (min-width: 1440px) {
		gap: 1rem;
	}

	@media (max-width: 1220px) {
		gap: 0.75rem;
	}
`;

/* Avatar row */
export const AvatarRow = styled.div`
	display: flex;
	gap: 0.75rem;
	align-items: center;

	@media (min-width: 1440px) {
		gap: 0.875rem;
	}

	@media (max-width: 1220px) {
		gap: 0.625rem;
	}
`;

export const AvatarPreviewBox = styled.div`
	width: 4.5rem;
	height: 4.5rem;
	border-radius: 50%;
	background: var(--muted, #f3f4f6);
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;

	@media (min-width: 1440px) {
		width: 5rem;
		height: 5rem;
	}

	@media (max-width: 1220px) {
		width: 4rem;
		height: 4rem;
	}
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
	font-size: 0.75rem;

	@media (min-width: 1440px) {
		font-size: 0.8125rem;
	}

	@media (max-width: 1220px) {
		font-size: 0.6875rem;
	}
`;

/* Controls next to avatar */
export const AvatarControls = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.4375rem;
	flex: 1;

	@media (min-width: 1440px) {
		gap: 0.5rem;
	}

	@media (max-width: 1220px) {
		gap: 0.3125rem;
	}
`;

/* File input wrapper to keep native input but styled container */
export const FileInputWrapper = styled.div`
	input[type="file"] {
		font-size: 0.75rem;
	}

	@media (min-width: 1440px) {
		input[type="file"] {
			font-size: 0.8125rem;
		}
	}

	@media (max-width: 1220px) {
		input[type="file"] {
			font-size: 0.6875rem;
		}
	}
`;

export const Note = styled.div`
	font-size: 0.625rem;
	color: var(--muted-foreground, #6b7280);

	@media (min-width: 1440px) {
		font-size: 0.6875rem;
	}

	@media (max-width: 1220px) {
		font-size: 0.5625rem;
	}
`;

/* small link/button */
export const SmallButton = styled.button`
	background: transparent;
	border: none;
	color: #2563eb;
	padding: 0;
	font-size: 0.6875rem;
	cursor: pointer;
	text-decoration: underline;
	width: fit-content;

	@media (min-width: 1440px) {
		font-size: 0.75rem;
	}

	@media (max-width: 1220px) {
		font-size: 0.625rem;
	}
`;

/* Form fields */
export const Field = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.25rem;

	@media (min-width: 1440px) {
		gap: 0.3125rem;
	}

	@media (max-width: 1220px) {
		gap: 0.1875rem;
	}
`;

/* Use the existing Input/Textarea components but wrap to set width and spacing */
export const StyledInput = styled(Input)`
	width: 100%;
	box-sizing: border-box;
`;

export const StyledTextarea = styled(Textarea)`
	width: 100%;
	min-height: 4.5rem;
	resize: vertical;

	@media (min-width: 1440px) {
		min-height: 5rem;
	}

	@media (max-width: 1220px) {
		min-height: 4rem;
	}
`;

export const Footer = styled.div`
	display: flex;
	gap: 0.5rem;
	justify-content: flex-start;
	align-items: center;
	margin-top: 0.25rem;

	@media (min-width: 1440px) {
		gap: 0.625rem;
		margin-top: 0.3125rem;
	}

	@media (max-width: 1220px) {
		gap: 0.375rem;
		margin-top: 0.1875rem;
	}
`;

/* Buttons: keep using Button component, but we wrap to set size if needed */
export const SubmitButton = styled(Button)``;

/* Error text */
export const ErrorText = styled.div`
	color: #dc2626;
	font-size: 0.6875rem;
	margin-top: 0.1875rem;

	@media (min-width: 1440px) {
		font-size: 0.75rem;
		margin-top: 0.25rem;
	}

	@media (max-width: 1220px) {
		font-size: 0.625rem;
		margin-top: 0.125rem;
	}
`;
