/* eslint-disable @typescript-eslint/no-explicit-any */
import bgImage from "@/assets/image/loginBackground.png";
import { useNavigate, useRouter } from "@tanstack/react-router";
import {
	CircleX,
	LogOut,
	// Search,
	User,
} from "lucide-react";
import React, { useEffect, useRef } from "react";
import {
	ContentWrapper,
	Header,
	LogoSection,
	MainContent,
	MenuIcon,
	MenuItem,
	MenuNav,
	NotificationButton,
	// SearchContainer,
	// SearchIcon,
	// SearchInput,
	SettingRows,
	SettingsContainer,
	Sidebar,
	SidebarContent,
	Title,
} from "./SettingsMenu.styled";
import { Separator } from "@radix-ui/react-select";
import { logout } from "@/services/auth/authAPI";
import cookieUtils from "@/services/cookieUtils";
import { useSocket } from "@/hooks";

type SettingsSection =
	// | "general"
	// | "appearance"
	// "notification" |
	// "privacy" |
	"account";

interface MenuItemType {
	id: SettingsSection;
	label: string;
	icon: React.ComponentType<any>;
}

interface SettingsMenuProps {
	children: React.ReactNode;
	activeSection: SettingsSection;
	onSectionChange: (section: SettingsSection) => void;
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({
	children,
	activeSection,
	onSectionChange,
}) => {
	const contentWrapperRef = useRef<HTMLDivElement>(null);
	const navigate = useNavigate();
	const router = useRouter();
	const { socket } = useSocket();

	const menuItems: MenuItemType[] = [
		// { id: "general", label: "General", icon: Settings },
		{ id: "account", label: "Account", icon: User },
		// { id: "appearance", label: "Appearance", icon: Palette },
		// { id: "notification", label: "Notification and activity", icon: Bell },
		// { id: "privacy", label: "Privacy", icon: Shield },
	];

	useEffect(() => {
		if (contentWrapperRef.current) {
			contentWrapperRef.current.scrollTop = 0;
		}
	}, [activeSection]);

	const handleSectionChange = (section: SettingsSection) => {
		onSectionChange(section);
		if (contentWrapperRef.current) {
			contentWrapperRef.current.scrollTop = 0;
		}
	};

	const handleReturn = () => {
		router.history.back();
	};

	const handleLogout = async () => {
		await logout();
		window.localStorage.removeItem("accessToken");
		cookieUtils.clear();
		socket.disconnect();
		navigate({ to: "/auth/login" });
	};

	return (
		<SettingsContainer backgroundImage={bgImage}>
			<Header>
				<NotificationButton></NotificationButton>
				<Title>Setting</Title>
				<NotificationButton>{/* <Bell size={16} /> */}</NotificationButton>
			</Header>
			<SettingRows>
				{/* <NavigatorIcon>
					<LogoSection>
						<LogoBox>LOGO</LogoBox>
					</LogoSection>

					<IndentedSection>
						<IconContainer>
							{icons.map(({ Icon, selected }, index) => (
								<CircleIcon key={index} selected={selected}>
									<Icon />
								</CircleIcon>
							))}
						</IconContainer>
					</IndentedSection>
				</NavigatorIcon> */}
				<Sidebar>
					<SidebarContent>
						{/* <SearchContainer>
							<SearchIcon>
								<Search size={16} />
							</SearchIcon>
							<SearchInput placeholder="Search" />
						</SearchContainer> */}

						<MenuNav>
							{menuItems.map((item) => {
								const IconComponent = item.icon;
								return (
									<MenuItem
										key={item.id}
										$isActive={activeSection === item.id}
										onClick={() => handleSectionChange(item.id)}
									>
										<MenuIcon>
											<IconComponent size={20} />
										</MenuIcon>
										{item.label}
									</MenuItem>
								);
							})}
							<Separator className="bg-gray-300 h-0.25" />
							<MenuItem onClick={() => handleLogout()} $isActive={false}>
								<LogOut className="text-red-500" />{" "}
								<span className="text-red-500">Logout</span>
							</MenuItem>
						</MenuNav>
					</SidebarContent>
				</Sidebar>

				<MainContent>
					<ContentWrapper ref={contentWrapperRef}>
						<LogoSection>
							<CircleX size={35} onClick={handleReturn} />
						</LogoSection>
						{children}
					</ContentWrapper>
				</MainContent>
			</SettingRows>
		</SettingsContainer>
	);
};
