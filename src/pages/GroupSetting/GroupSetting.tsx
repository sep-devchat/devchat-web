/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useEffect, useState, Suspense } from "react";
import {
	Palette,
	Search,
	User,
	Bell,
	Settings as SettingsIcon,
	CircleX,
	Trash,
} from "lucide-react";
import {
	Header,
	SettingRows,
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
	LogoSection,
} from "./GroupSetting.styled";
import bgImage from "@/assets/image/loginBackground.png";
import ProfileSection from "./Sections/ProfileSection";
import DeleteSection from "./Sections/DeleteSection";
import InviteSection from "./Sections/InviteSection";
import ActivitySection from "./Sections/ActivitySection";
import MemberSection from "./Sections/MemberSection";

/* 1) Định nghĩa lại kiểu section hợp lệ */
type SettingsSection = "profile" | "invite" | "member" | "activity" | "delete";

interface MenuItemType {
	id: SettingsSection;
	label: string;
	icon: React.ComponentType<any>;
}

const menuItems: MenuItemType[] = [
	{ id: "profile", label: "Server Profile", icon: SettingsIcon },
	{ id: "invite", label: "Invites", icon: Palette },
	{ id: "member", label: "Member", icon: Bell },
	{ id: "activity", label: "Activity", icon: User },
	{ id: "delete", label: "Delete Server", icon: Trash },
];

// export const GroupSetting: React.FC = () => {
interface GroupSettingProps {
	setSettingSelect: (value: boolean) => void;
}

export const GroupSetting: React.FC<GroupSettingProps> = ({
	setSettingSelect,
}) => {
	const [activeSection, setActiveSection] =
		useState<SettingsSection>("profile");
	const contentWrapperRef = useRef<HTMLDivElement | null>(null);

	/* Khi đổi section, scroll top content */
	useEffect(() => {
		if (contentWrapperRef.current) contentWrapperRef.current.scrollTop = 0;
	}, [activeSection]);

	const renderActiveSection = () => {
		switch (activeSection) {
			case "profile":
				return <ProfileSection />;
			case "invite":
				return <InviteSection />;
			case "member":
				return <MemberSection />;
			case "activity":
				return <ActivitySection />;
			case "delete":
				return <DeleteSection />;
			default:
				return null;
		}
	};

	return (
		<SettingsContainer backgroundImage={bgImage}>
			<Header>
				<Title>Group Setting</Title>
			</Header>

			<SettingRows>
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
								const Icon = item.icon;
								return (
									<MenuItem
										key={item.id}
										$isActive={activeSection === item.id}
										onClick={() => setActiveSection(item.id)}
										role="button"
										tabIndex={0}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ")
												setActiveSection(item.id);
										}}
									>
										<MenuIcon>
											<Icon size={20} />
										</MenuIcon>
										{item.label}
									</MenuItem>
								);
							})}
						</MenuNav>
					</SidebarContent>
				</Sidebar>

				<MainContent>
					{/* wrapper ref để scrollTop khi đổi section */}
					<ContentWrapper ref={contentWrapperRef}>
						{/* Suspense để hiển thị loading khi lazy load */}
						<Suspense fallback={<div>Loading...</div>}>
							{renderActiveSection()}
						</Suspense>
					</ContentWrapper>
				</MainContent>

				<LogoSection>
					<CircleX size={35} onClick={() => setSettingSelect(false)} />
				</LogoSection>
			</SettingRows>
		</SettingsContainer>
	);
};

export default GroupSetting;
