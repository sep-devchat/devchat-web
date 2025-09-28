import React, { useRef, useEffect, useState } from "react";
import { MoreHorizontalIcon, Search, Settings, UserPlus } from "lucide-react";
import {
	SettingRows,
	NavigatorIcon,
	LogoSection,
	LogoBox,
	IndentedSection,
	IconContainer,
	CircleIcon,
	SidebarContent,
	SidebarContainer,
	Sidebar,
	SearchContainer,
	SearchInput,
	SearchIcon,
	SectionHeader,
	SectionTitle,
	IconButton,
	CreateButton,
	ContactList,
	ContactItem,
	Avatar,
	ContactInfo,
	ContactName,
	MoreButton,
	DirectMessagesLabel,
	StatusIndicator,
	AvatarImage,
	DirectMessagesHeader,
	ContactMainInfo,
	ContactActions,
} from "./MenuNav.styled";

interface Group {
	group_id: string;
	name: string;
	avatar: string | null;
}

interface Contact {
	id: string;
	name: string;
	status: "online" | "offline" | "away";
	avatar: string;
	lastSeen?: string;
}

const sampleGroups: Group[] = [
	{ group_id: "1", name: "Team Alpha", avatar: null },
	{ group_id: "2", name: "Project Beta", avatar: null },
	{ group_id: "3", name: "Design Team", avatar: null },
];

const sampleContacts: Contact[] = [
	{
		id: "1",
		name: "Nguyễn Văn A",
		status: "online",
		avatar:
			"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
		lastSeen: "Active now",
	},
	{
		id: "2",
		name: "Nguyễn Văn B",
		status: "offline",
		avatar:
			"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
		lastSeen: "Active now",
	},
];

interface SidebarMenuProps {
	children?: React.ReactNode;
	activeSection: string;
	channelSelected: (section: string) => void;
	setGrNameSelected?: (grName: string) => void;
}

export const MainNav: React.FC<SidebarMenuProps> = ({
	activeSection,
	channelSelected,
	setGrNameSelected,
}) => {
	const contentWrapperRef = useRef<HTMLDivElement | null>(null);
	const [selectedGroupId, setSelectedGroupId] = useState<string | null>("1");
	const [selectedContactId, setSelectedContactId] = useState<string | null>(
		null,
	);
	const [logoMode, setLogoMode] = useState<boolean>(false);
	const [searchQuery, setSearchQuery] = useState<string>("");

	useEffect(() => {
		if (contentWrapperRef.current) {
			contentWrapperRef.current.scrollTop = 0;
		}
	}, [activeSection, selectedGroupId, logoMode]);

	const handleGroupClick = (group: Group): void => {
		setLogoMode(false);
		setSelectedGroupId(String(group.group_id));
		setSelectedContactId(null);
		if (setGrNameSelected) {
			setGrNameSelected(group.name);
		}
		channelSelected("");
	};

	const handleLogoClick = (): void => {
		setLogoMode(true);
		setSelectedGroupId(null);
		setSelectedContactId(null);
		channelSelected("logo-menu");
	};

	const handleContactClick = (contact: Contact): void => {
		setSelectedContactId(contact.id);
		channelSelected(`contact-${contact.id}`);
	};

	const getInitials = (name: string): string => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase();
	};

	const filteredContacts = sampleContacts.filter((contact) =>
		contact.name.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const handleMoreClick = (contact: any) => {
		console.log("More clicked for:", contact.name);
	};

	return (
		<SidebarContainer>
			<SettingRows>
				<NavigatorIcon>
					<LogoSection onClick={handleLogoClick} style={{ cursor: "pointer" }}>
						<LogoBox>LOGO</LogoBox>
					</LogoSection>
					<IndentedSection>
						<IconContainer>
							{sampleGroups.map((g) => {
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
											<span style={{ fontSize: "12px", fontWeight: "600" }}>
												{getInitials(g.name)}
											</span>
										)}
									</CircleIcon>
								);
							})}
						</IconContainer>
					</IndentedSection>
				</NavigatorIcon>
				<Sidebar>
					<SidebarContent ref={contentWrapperRef}>
						<SearchContainer>
							<SearchIcon>
								<Search size={16} />
							</SearchIcon>
							<SearchInput
								type="text"
								placeholder="Find or start a conversation"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</SearchContainer>

						<SectionHeader>
							<SectionTitle>
								<UserPlus size={20} />
								Friend
							</SectionTitle>
							<IconButton>
								<Settings size={16} />
							</IconButton>
						</SectionHeader>

						<DirectMessagesHeader>
							<DirectMessagesLabel>Direct messages</DirectMessagesLabel>
							<CreateButton>
								<span>+</span>
							</CreateButton>
						</DirectMessagesHeader>

						<ContactList>
							{filteredContacts.map((contact) => (
								<ContactItem
									key={contact.id}
									isSelected={selectedContactId === contact.id}
									onClick={() => handleContactClick(contact)}
								>
									<ContactMainInfo>
										<Avatar>
											<AvatarImage
												src={contact.avatar}
												alt={contact.name}
												onError={(
													e: React.SyntheticEvent<HTMLImageElement>,
												) => {
													const target = e.target as HTMLImageElement;
													target.style.display = "none";
												}}
											/>
											<StatusIndicator status={contact.status} />
										</Avatar>
										<ContactInfo>
											<ContactName>{contact.name}</ContactName>
										</ContactInfo>
									</ContactMainInfo>
									<ContactActions>
										<MoreButton
											onClick={(e) => {
												e.stopPropagation();
												handleMoreClick(contact);
											}}
										>
											<MoreHorizontalIcon />
										</MoreButton>
									</ContactActions>
								</ContactItem>
							))}
						</ContactList>
					</SidebarContent>
				</Sidebar>
			</SettingRows>
		</SidebarContainer>
	);
};

export default MainNav;
