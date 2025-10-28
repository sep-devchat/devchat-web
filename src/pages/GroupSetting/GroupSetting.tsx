/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useEffect, useState, Suspense } from "react";
import {
	Palette,
	Search,
	Bell,
	Settings as SettingsIcon,
	CircleX,
	Trash,
	ExternalLink,
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
	MenuLabel,
} from "./GroupSetting.styled";
import bgImage from "@/assets/image/loginBackground.png";
import ProfileSection from "./Sections/ProfileSection";
import { DeleteSection } from "./Sections/DeleteSection";
import InviteSection from "./Sections/InviteSection/InviteSection";
import ActivitySection from "./Sections/ActivitySection/ActivitySection";
import MemberSection from "./MemberSection/MemberSection";
import { OutGroupSection } from "./Sections/OutGroupSection";

/* 1) Định nghĩa lại kiểu section hợp lệ */
type SettingsSection = "profile" | "invite" | "member" | "activity" | "delete";

interface MenuItemType {
	id: SettingsSection;
	label: string;
	icon: React.ComponentType<any>;
}

interface GroupSettingProps {
	setSettingSelect: (value: boolean) => void;
	isAdmin: boolean;
}

export const GroupSetting: React.FC<GroupSettingProps> = ({
	setSettingSelect,
	isAdmin,
}) => {
	const [activeSection, setActiveSection] =
		useState<SettingsSection>("profile");
	const contentWrapperRef = useRef<HTMLDivElement | null>(null);
	// const params = useParams({ strict: false }) as { groupId?: string };
	// const currentGroup = params.groupId;
	// const [isAdmin, setIsAdmin] = useState<boolean>(false);

	// const currentUserProfile = useSelector(
	// 	(state: RootState) => state.user.profile,
	// );
	// const currentUserId = currentUserProfile?.id || "";

	// useEffect(() => {
	// 	const fetchGroupDetail = async () => {
	// 		try {
	// 			const res = await detailGroup(currentGroup || "");
	// 			const createdBy = res?.data?.createdBy || res;
	// 			if (currentUserId === createdBy) {
	// 				setIsAdmin(true);
	// 			}
	// 		} catch (err) {
	// 			console.error("Failed to fetch channel detail:", err);
	// 			alert("Failed to load channel details.");
	// 		}
	// 	};
	// 	fetchGroupDetail();
	// }, [currentGroup]);

	/* Khi đổi section, scroll top content */
	useEffect(() => {
		if (contentWrapperRef.current) contentWrapperRef.current.scrollTop = 0;
	}, [activeSection]);

	const menuItems: MenuItemType[] = [
		{ id: "profile", label: "Group Profile", icon: SettingsIcon },
		{ id: "invite", label: "Invites", icon: Palette },
		{ id: "member", label: "Member", icon: Bell },
		// { id: "activity", label: "Activity", icon: User },
		{
			id: "delete",
			label: isAdmin ? "Delete Group" : "Out group",
			icon: isAdmin ? Trash : ExternalLink,
		},
	];

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
				// Nếu là admin thì show DeleteSection, không thì fallback về ActivitySection
				return isAdmin ? (
					<DeleteSection setSettingSelect={setSettingSelect} />
				) : (
					<OutGroupSection setSettingSelect={setSettingSelect} />
				);

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
								const isDeleteTab = item.id === "delete";
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
										<MenuIcon $isDelete={isDeleteTab}>
											<Icon size={20} />
										</MenuIcon>
										<MenuLabel $isDelete={isDeleteTab}>{item.label}</MenuLabel>
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
