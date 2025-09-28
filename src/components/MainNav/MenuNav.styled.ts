import { theme } from "@/themes";
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
	padding-top: 10px;
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

export const SearchContainer = styled.div`
	position: relative;
	margin-bottom: 24px;
`;

export const SearchInput = styled.input`
	width: 100%;
	height: 40px;
	padding: 0 16px 0 40px;
	border: none;
	border-radius: 4px;
	background: rgba(255, 255, 255, 0.7);
	font-size: 14px;
	color: #374151;
	&::placeholder {
		color: #9ca3af;
	}
	&:focus {
		outline: none;
		background: rgba(255, 255, 255, 0.9);
		box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
	}
`;

export const SearchIcon = styled.div`
	position: absolute;
	left: 14px;
	top: 50%;
	transform: translateY(-50%);
	color: #9ca3af;
`;

export const SectionHeader = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 16px;
	padding: 8px 12px;
	background: #c4d6ef;
	border-radius: 8px;
	cursor: pointer;
	transition: all 0.2s ease;
	&:hover {
		background: #c4d6ef;
	}
`;

export const SectionTitle = styled.h3`
	font-size: 16px;
	font-weight: 600;
	color: #374151;
	margin: 0;
	display: flex;
	align-items: center;
	gap: 8px;
	flex: 1;
`;

export const IconButton = styled.button`
	width: 24px;
	height: 24px;
	border: none;
	background: none;
	cursor: pointer;
	border-radius: 4px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #6b7280;
	transition: all 0.2s ease;
	margin-left: 8px;
	&:hover {
		background: rgba(0, 0, 0, 0.05);
		color: #374151;
	}
`;

export const CreateButton = styled.button`
	width: 30px;
	height: 30px;
	background: #1952b3;
	color: white;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.2s ease;
	margin-left: 8px;
	flex-shrink: 0;
	font-size: 18px;
	font-weight: 400;
	line-height: 1;
	&:hover {
		background: #2563eb;
	}
	&:focus {
		outline: none;
	}
	span {
		color: white;
		user-select: none;
		font-size: 20px;
		padding-bottom: 3px;
	}
`;

export const ContactList = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
`;

export const ContactItem = styled.div<{ isSelected?: boolean }>`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 8px;
	border-radius: 8px;
	cursor: pointer;
	transition: background-color 0.2s ease;

	&:hover {
		background: ${({ isSelected }) =>
			isSelected
				? theme.color.grey30 || "#BEE3F8"
				: theme.color.grey30 || "#F3F4F6"};
	}
`;

export const ContactMainInfo = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
	flex: 1;
`;

export const Avatar = styled.div`
	position: relative;
`;

export const AvatarImage = styled.img`
	width: 40px;
	height: 40px;
	border-radius: 50%;
	object-fit: cover;
`;

export const StatusIndicator = styled.div<{
	status: "online" | "offline" | "away" | "busy";
}>`
	position: absolute;
	bottom: 2px;
	right: 2px;
	width: 12px;
	height: 12px;
	border: 2px solid white;
	border-radius: 50%;
	background: ${({ status }) => {
		switch (status) {
			case "online":
				return "#10b981";
			case "offline":
				return "#6b7280";
			case "away":
				return "#f59e0b";
			case "busy":
				return "#ef4444";
			default:
				return "#6b7280";
		}
	}};
`;

export const ContactInfo = styled.div`
	display: flex;
	flex-direction: column;
	gap: 2px;
`;

export const ContactActions = styled.div`
	display: flex;
	align-items: center;
	gap: 4px;
`;
export const ContactName = styled.span`
	font-size: 14px;
	font-weight: 500;
	color: ${theme.color.grey90 || "#111827"};
`;

export const MoreButton = styled.button`
	justify-content: center;
	border: none;
	background: transparent;
	color: #27364b;
	cursor: pointer;
	transition: all 0.2s ease;
	flex-shrink: 0;
	padding: 0;

	&:active {
		background-color: rgba(0, 0, 0, 0.08);
		transform: scale(0.95);
	}

	&:focus {
		outline: none;
		box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.3);
	}
`;

export const DirectMessagesLabel = styled.div`
	font-size: 16px;
	font-weight: 500;
	color: #1a1a1a;
	margin-bottom: 12px;
	letter-spacing: 0.5px;
`;

export const DirectMessagesHeader = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
`;

///
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
`;
