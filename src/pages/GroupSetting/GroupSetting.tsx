/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
	useRef,
	useEffect,
	useState,
	Suspense,
	useCallback,
} from "react";
import {
	Palette,
	Search,
	Bell,
	CreditCard,
	Settings as SettingsIcon,
	CircleX,
	Trash,
	ExternalLink,
	CheckSquare,
	Code,
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
import SubscriptionSection from "./Sections/SubscriptionSection/SubscriptionSection";
import TaskOverviewSection from "./Sections/TaskOverviewSection/TaskOverviewSection";
import GroupProgrammingLanguageSection from "./Sections/GroupProgrammingLanguageSection";
import { getGroupSubscriptions } from "@/services/groupAPI";
import { listShareFundsInGroup } from "@/services/shareFundAPI";

type SettingsSection =
	| "profile"
	| "invite"
	| "member"
	| "programming-languages"
	| "activity"
	| "task-overview"
	| "subscription"
	| "activity"
	| "task-overview"
	| "subscription"
	| "delete";

interface MenuItemType {
	id: SettingsSection;
	label: string;
	icon: React.ComponentType<any>;
}

interface GroupSettingProps {
	setSettingSelect: (value: boolean) => void;
	isAdmin: boolean;
	groupId: string;
}

export const GroupSetting: React.FC<GroupSettingProps> = ({
	setSettingSelect,
	isAdmin,
	groupId,
}) => {
	const [activeSection, setActiveSection] =
		useState<SettingsSection>("profile");
	const [dangerActionLocked, setDangerActionLocked] = useState(true);
	const [dangerActionCheckLoading, setDangerActionCheckLoading] =
		useState(true);
	const contentWrapperRef = useRef<HTMLDivElement | null>(null);
	const dangerCheckSeqRef = useRef(0);

	useEffect(() => {
		if (contentWrapperRef.current) contentWrapperRef.current.scrollTop = 0;
	}, [activeSection]);

	const refreshDangerActionState = useCallback(async () => {
		if (!groupId) {
			setDangerActionLocked(true);
			setDangerActionCheckLoading(false);
			return;
		}

		const seq = ++dangerCheckSeqRef.current;
		setDangerActionCheckLoading(true);
		// Safe default: hide until we confirm it's allowed.
		setDangerActionLocked(true);

		try {
			const [subscriptionsRes, shareFundsRes] = await Promise.all([
				getGroupSubscriptions(groupId),
				listShareFundsInGroup(groupId),
			]);
			if (dangerCheckSeqRef.current !== seq) return;

			const currentSubscription = subscriptionsRes?.data?.currentSubscription;

			const hasCurrentSubscription = Boolean(
				currentSubscription?.subscription?.subscriptionCode !== "FREE_00",
			);
			const hasShareFund = (shareFundsRes?.data?.length ?? 0) > 0;

			setDangerActionLocked(hasCurrentSubscription || hasShareFund);
		} catch {
			// Be conservative: if we can't validate state, hide dangerous actions.
			if (dangerCheckSeqRef.current !== seq) return;
			setDangerActionLocked(true);
		} finally {
			if (dangerCheckSeqRef.current !== seq) return;
			setDangerActionCheckLoading(false);
		}
	}, [groupId]);

	useEffect(() => {
		void refreshDangerActionState();
	}, [refreshDangerActionState]);

	const shouldHideDangerAction = dangerActionCheckLoading || dangerActionLocked;

	useEffect(() => {
		if (activeSection === "delete" && shouldHideDangerAction) {
			setActiveSection("profile");
		}
	}, [activeSection, shouldHideDangerAction]);

	const menuItems: MenuItemType[] = [
		{ id: "profile", label: "Group Profile", icon: SettingsIcon },
		{ id: "invite", label: "Invite", icon: Palette },
		{ id: "member", label: "Member", icon: Bell },
		{
			id: "programming-languages",
			label: "Programming Languages",
			icon: Code,
		},
		{ id: "subscription", label: "Subscription", icon: CreditCard },
		{ id: "task-overview", label: "Task Overview", icon: CheckSquare },
	];

	if (!shouldHideDangerAction) {
		menuItems.push({
			id: "delete",
			label: isAdmin ? "Delete Group" : "Out group",
			icon: isAdmin ? Trash : ExternalLink,
		});
	}

	const renderActiveSection = () => {
		switch (activeSection) {
			case "profile":
				return <ProfileSection canEdit={isAdmin} />;
			case "invite":
				return <InviteSection canInvite={isAdmin} />;
			case "member":
				return <MemberSection canManageMembers={isAdmin} />;
			case "programming-languages":
				return (
					<GroupProgrammingLanguageSection
						canManage={isAdmin}
						groupId={groupId}
					/>
				);
			case "subscription":
				return (
					<SubscriptionSection
						canBuy={isAdmin}
						groupId={groupId}
						onDangerStateChanged={refreshDangerActionState}
					/>
				);
			case "activity":
				return <ActivitySection />;
			case "task-overview":
				return <TaskOverviewSection />;
			case "delete":
				if (shouldHideDangerAction) return <ProfileSection canEdit={isAdmin} />;
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
					<ContentWrapper ref={contentWrapperRef}>
						<LogoSection>
							<CircleX size={35} onClick={() => setSettingSelect(false)} />
						</LogoSection>

						<Suspense fallback={<div>Loading...</div>}>
							{renderActiveSection()}
						</Suspense>
					</ContentWrapper>
				</MainContent>
			</SettingRows>
		</SettingsContainer>
	);
};

export default GroupSetting;
