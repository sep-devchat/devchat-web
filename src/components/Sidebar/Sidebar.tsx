/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useEffect, useState } from "react";
import { MessageCircle, Settings, Plus, X } from "lucide-react";

// Import styled components
import {
	SidebarContainer,
	SettingRows,
	NavigatorIcon,
	LogoSection,
	LogoBox,
	IndentedSection,
	IconContainer,
	CircleIcon,
	Sidebar,
	SidebarContent,
	HeaderContainer,
	GroupTitle,
	HeaderButtons,
	HeaderButton,
	MenuNav,
	MenuItem,
	MenuIcon,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalTitle,
	CloseButton,
	FormSection,
	Label,
	ChannelTypeCard,
	ChannelTypeIcon,
	ChannelTypeContent,
	ChannelTypeName,
	ChannelTypeDescription,
	Input,
	PrivateSection,
	PrivateIcon,
	PrivateContent,
	PrivateTitle,
	PrivateDescription,
	Toggle,
	ToggleInput,
	ToggleSlider,
	ModalFooter,
	Button,
	Divider,
} from "./Sidebar.styled";

// Import types and data from sampleData.ts
import {
	sampleData,
	SampleData,
	GroupSummary,
	ExpandedGroup,
	Channel,
} from "../../sampleData";

interface SidebarMenuProps {
	children?: React.ReactNode;
	activeSection: string;
	channelSelected: (section: string) => void;
	setGrNameSelected?: (grName: string) => void;
}

export const SidebarMenu: React.FC<SidebarMenuProps> = ({
	activeSection,
	channelSelected,
	setGrNameSelected,
}) => {
	const contentWrapperRef = useRef<HTMLDivElement | null>(null);
	const data: SampleData = sampleData();

	const [selectedGroupId, setSelectedGroupId] = useState<string | null>(
		data.expanded_group.group_id,
	);
	const [logoMode, setLogoMode] = useState<boolean>(false);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [channelName, setChannelName] = useState<string>("");
	const [isPrivate, setIsPrivate] = useState<boolean>(false);
	const [allGroupsData, setAllGroupsData] = useState<{
		[key: string]: ExpandedGroup;
	}>({
		[data.expanded_group.group_id]: data.expanded_group,
	});

	useEffect(() => {
		if (contentWrapperRef.current) {
			contentWrapperRef.current.scrollTop = 0;
		}
	}, [activeSection, selectedGroupId, logoMode]);

	const getExpandedGroup = (groupId: string | null): ExpandedGroup | null => {
		if (!groupId) return null;

		// Check if we have this group's data in our state
		if (allGroupsData[groupId]) {
			return allGroupsData[groupId];
		}

		// If not, create from summary data
		const summary = data.groups.find((g) => g.group_id === groupId);
		if (!summary) return null;

		const newExpandedGroup: ExpandedGroup = {
			group_id: summary.group_id,
			name: summary.name,
			description: summary.description ?? null,
			avatar: summary.avatar ?? null,
			created_by: summary.created_by,
			created_at: summary.created_at,
			updated_at: summary.updated_at ?? null,
			is_active: summary.is_active,
			members: [],
			channels: [
				{
					channel_id: `${summary.group_id}-ch-general`,
					name: "general",
					description: `General channel of ${summary.name}`,
					permission: "public",
					created_by: summary.created_by,
					created_at: summary.created_at,
					updated_at: summary.updated_at ?? null,
					is_active: true,
				},
			],
			settings: {
				notifications: "all",
				default_channel_permission: "member_post",
				allow_guest_invite: false,
			},
		};

		// Save to state for future use
		setAllGroupsData((prev) => ({
			...prev,
			[groupId]: newExpandedGroup,
		}));

		return newExpandedGroup;
	};

	const expanded = getExpandedGroup(selectedGroupId);

	const logoMenuItems = [
		{ id: "settings-general", label: "General" },
		{ id: "settings-appearance", label: "Appearance" },
		{ id: "settings-notification", label: "Notifications & Activity" },
		{ id: "settings-account", label: "Account" },
		{ id: "settings-privacy", label: "Privacy" },
	];

	const handleMenuClick = (id: string) => {
		channelSelected(id);
	};

	const handleGroupClick = (group: GroupSummary) => {
		setLogoMode(false);
		setSelectedGroupId(String(group.group_id));
		if (setGrNameSelected) {
			setGrNameSelected(group.name);
		}
		channelSelected("");
	};

	const handleLogoClick = () => {
		setLogoMode(true);
		setSelectedGroupId(null);
		channelSelected("logo-menu");
	};

	const handleAddChannel = () => {
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setChannelName("new-channel");
		setIsPrivate(false);
	};

	const handleCreateChannel = () => {
		if (!channelName.trim() || !selectedGroupId) return;

		const newChannel: Channel = {
			channel_id: `${selectedGroupId}-ch-${Date.now()}`,
			name: channelName.trim(),
			description: `${channelName.trim()} channel`,
			permission: isPrivate ? "private" : "public",
			created_by: data.user.user_id,
			created_at: new Date().toISOString(),
			updated_at: null,
			is_active: true,
		};

		// Update the specific group's channels
		setAllGroupsData((prev) => {
			const currentGroup = prev[selectedGroupId];
			if (currentGroup) {
				return {
					...prev,
					[selectedGroupId]: {
						...currentGroup,
						channels: [...currentGroup.channels, newChannel],
					},
				};
			}
			return prev;
		});

		handleCloseModal();
		channelSelected(newChannel.name);
	};

	const currentGroupName = expanded ? expanded.name : "Settings";

	return (
		<SidebarContainer>
			<SettingRows>
				<NavigatorIcon>
					<LogoSection onClick={handleLogoClick} style={{ cursor: "pointer" }}>
						<LogoBox>LOGO</LogoBox>
					</LogoSection>

					<IndentedSection>
						<IconContainer>
							{data.groups.map((g: GroupSummary) => {
								const isSelected = g.group_id === selectedGroupId && !logoMode;
								return (
									<CircleIcon
										key={g.group_id}
										selected={isSelected}
										onClick={() => handleGroupClick(g)}
										style={{ cursor: "pointer" }}
									>
										{g.avatar ? (
											<img
												src={g.avatar}
												alt={g.name}
												style={{
													width: "100%",
													height: "100%",
													objectFit: "cover",
													borderRadius: "50%",
												}}
											/>
										) : (
											<span>{(g.name || "G").slice(0, 1).toUpperCase()}</span>
										)}
									</CircleIcon>
								);
							})}
						</IconContainer>
					</IndentedSection>
				</NavigatorIcon>

				<Sidebar>
					<SidebarContent ref={contentWrapperRef as any}>
						<HeaderContainer>
							<GroupTitle>{currentGroupName}</GroupTitle>
							<HeaderButtons>
								{!logoMode && (
									<HeaderButton onClick={handleAddChannel}>
										<Plus />
									</HeaderButton>
								)}
								<HeaderButton>
									<Settings />
								</HeaderButton>
							</HeaderButtons>
						</HeaderContainer>

						<MenuNav>
							{logoMode ? (
								logoMenuItems.map((item) => (
									<MenuItem
										key={item.id}
										$isActive={activeSection === item.id}
										onClick={() => handleMenuClick(item.id)}
									>
										<MenuIcon>
											<Settings size={16} />
										</MenuIcon>
										{item.label}
									</MenuItem>
								))
							) : expanded &&
							  expanded.channels &&
							  expanded.channels.length > 0 ? (
								expanded.channels.map((ch) => (
									<MenuItem
										key={ch.channel_id}
										$isActive={
											activeSection === ch.name ||
											activeSection === ch.channel_id
										}
										onClick={() => handleMenuClick(ch.name)}
									>
										<MenuIcon>
											<MessageCircle size={16} />
										</MenuIcon>
										{ch.name}
									</MenuItem>
								))
							) : (
								<MenuItem $isActive={false}>
									<MenuIcon>
										<MessageCircle size={16} />
									</MenuIcon>
									No channels
								</MenuItem>
							)}
						</MenuNav>
					</SidebarContent>
				</Sidebar>
			</SettingRows>

			{isModalOpen && (
				<ModalOverlay onClick={handleCloseModal}>
					<ModalContent onClick={(e) => e.stopPropagation()}>
						<ModalHeader>
							<ModalTitle>Create Channel</ModalTitle>
							<CloseButton onClick={handleCloseModal}>
								<X size={20} />
							</CloseButton>
						</ModalHeader>
						<Divider />
						<FormSection>
							<Label>Channel Type</Label>
							<ChannelTypeCard>
								<ChannelTypeIcon>
									<MessageCircle size={20} />
								</ChannelTypeIcon>
								<ChannelTypeContent>
									<ChannelTypeName>Text</ChannelTypeName>
									<ChannelTypeDescription>
										Send messages, images, GIFs, emoji, opinions and pun
									</ChannelTypeDescription>
								</ChannelTypeContent>
							</ChannelTypeCard>
						</FormSection>

						<FormSection>
							<Label>Channel Name</Label>
							<Input
								type="text"
								value={channelName}
								onChange={(e) => setChannelName(e.target.value)}
								placeholder="new-channel"
							/>
						</FormSection>

						<FormSection>
							<PrivateSection>
								<PrivateIcon>
									<Settings size={20} />
								</PrivateIcon>
								<PrivateContent>
									<PrivateTitle>Private Channel</PrivateTitle>
									<PrivateDescription>
										Only selected members and roles will be able to view this
										channel.
									</PrivateDescription>
								</PrivateContent>
								<Toggle>
									<ToggleInput
										type="checkbox"
										checked={isPrivate}
										onChange={(e) => setIsPrivate(e.target.checked)}
									/>
									<ToggleSlider checked={isPrivate} />
								</Toggle>
							</PrivateSection>
						</FormSection>
						<Divider />
						<ModalFooter>
							<Button variant="secondary" onClick={handleCloseModal}>
								Cancel
							</Button>
							<Button
								variant="primary"
								onClick={handleCreateChannel}
								disabled={!channelName.trim()}
							>
								Create Channel
							</Button>
						</ModalFooter>
					</ModalContent>
				</ModalOverlay>
			)}
		</SidebarContainer>
	);
};

export default SidebarMenu;
