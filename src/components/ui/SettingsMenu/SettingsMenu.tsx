import React, { useRef, useEffect } from "react";
import { Palette, Shield, Search } from "lucide-react";
import {
	Header,
	SettingRows,
	NavigatorIcon,
	LogoSection,
	LogoBox,
	IndentedSection,
	IconContainer,
	CircleIcon,
	Sidebar,
	SidebarContent,
	SearchContainer,
	SearchIcon,
	SearchInput,
	MenuNav,
	MenuItem,
	MenuIcon,
	MainContent,
	ContentWrapper,
	SettingsContainer,
	Title,
	NotificationButton,
} from "./SettingsMenu.styled";
import bgImage from "@/assets/loginBackground.png";
import { Home, User, MessageCircle, Bell, Settings } from "lucide-react";

type SettingsSection =
	| "general"
	| "appearance"
	| "notification"
	| "account"
	| "privacy";

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

	const menuItems: MenuItemType[] = [
		{ id: "general", label: "General", icon: Settings },
		{ id: "appearance", label: "Appearance", icon: Palette },
		{ id: "notification", label: "Notification and activity", icon: Bell },
		{ id: "account", label: "Account", icon: User },
		{ id: "privacy", label: "Privacy", icon: Shield },
	];

	const icons = [
		{ Icon: Home, selected: false },
		{ Icon: User, selected: false },
		{ Icon: MessageCircle, selected: false },
		{ Icon: Bell, selected: false },
		{ Icon: Settings, selected: true },
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

	return (
		<SettingsContainer backgroundImage={bgImage}>
			<Header>
				<NotificationButton></NotificationButton>
				<Title>Setting</Title>
				<NotificationButton>
					<Bell size={16} />
				</NotificationButton>
			</Header>
			<SettingRows>
				<NavigatorIcon>
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
				</NavigatorIcon>
				<Sidebar>
					<SidebarContent>
						<SearchContainer>
							<SearchIcon>
								<Search size={16} />
							</SearchIcon>
							<SearchInput placeholder="Search" />
						</SearchContainer>

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
						</MenuNav>
					</SidebarContent>
				</Sidebar>

				<MainContent>
					<ContentWrapper ref={contentWrapperRef}>{children}</ContentWrapper>
				</MainContent>
			</SettingRows>
		</SettingsContainer>
	);
};
