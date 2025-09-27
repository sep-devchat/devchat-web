/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useEffect, useState } from "react";
import { Search } from "lucide-react";
import {
	SettingRows,
	NavigatorIcon,
	LogoSection,
	LogoBox,
	IndentedSection,
	IconContainer,
	CircleIcon,
	SidebarContent,
	SearchContainer,
	SearchIcon,
	SearchInput,
	MenuNav,
	MenuItem,
	MenuIcon,
	SidebarContainer,
	Sidebar,
} from "./Sidebar.styled";

import { MessageCircle, Settings } from "lucide-react";

import {
	sampleData,
	SampleData,
	GroupSummary,
	ExpandedGroup,
} from "../../sampleData";

/**
 * NOTE:
 * - Mình chỉnh types để menu item/section là string (vì channel.name có thể bất kỳ).
 * - Props: activeSection là string, channelSelected nhận string.
 */
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

	// lấy sample data
	const data: SampleData = sampleData();

	// state chọn group hiện tại
	const [selectedGroupId, setSelectedGroupId] = useState<string | null>(
		data.expanded_group.group_id,
	);
	// khi true => hiển thị menu của Logo (không phải channels)
	const [logoMode, setLogoMode] = useState<boolean>(false);

	useEffect(() => {
		if (contentWrapperRef.current) {
			contentWrapperRef.current.scrollTop = 0;
		}
	}, [activeSection, selectedGroupId, logoMode]);

	// giả lập lấy expandedGroup từ server / sampleData
	const getExpandedGroup = (groupId: string | null): ExpandedGroup | null => {
		if (!groupId) return null;

		// nếu chọn đúng group có trong sampleData.expanded_group => trả về nó
		if (data.expanded_group && data.expanded_group.group_id === groupId) {
			return data.expanded_group;
		}

		// ngược lại: tạo expanded tạm từ group summary (channels rỗng hoặc placeholder)
		const summary = data.groups.find((g) => g.group_id === groupId);
		if (!summary) return null;

		return {
			group_id: summary.group_id,
			name: summary.name,
			description: summary.description ?? null,
			avatar: summary.avatar ?? null,
			created_by: summary.created_by,
			created_at: summary.created_at,
			updated_at: summary.updated_at ?? null,
			is_active: summary.is_active,
			members: [], // không có member chi tiết trong sample
			channels: [
				// bạn có thể đổi nội dung placeholder này nếu cần
				{
					channel_id: `${summary.group_id}-ch-1`,
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
	};

	const expanded = getExpandedGroup(selectedGroupId);

	// menu mặc định khi ở logoMode
	const logoMenuItems = [
		{ id: "settings-general", label: "General" },
		{ id: "settings-appearance", label: "Appearance" },
		{ id: "settings-notification", label: "Notifications & Activity" },
		{ id: "settings-account", label: "Account" },
		{ id: "settings-privacy", label: "Privacy" },
	];

	// khi bấm 1 channel -> gọi channelSelected với channel.name (hoặc id tuỳ bạn muốn)
	const handleMenuClick = (id: string) => {
		channelSelected(id);
	};

	// bấm vào avatar 1 group
	const handleGroupClick = (group: GroupSummary) => {
		setLogoMode(false);
		setSelectedGroupId(String(group.group_id));
		if (setGrNameSelected) {
			setGrNameSelected(group.name);
		}
		// reset active section khi đổi group (tuỳ yêu cầu bạn có thể giữ)
		channelSelected(""); // reset hoặc truyền channel mặc định
	};

	// bấm vào logo header
	const handleLogoClick = () => {
		setLogoMode(true);
		setSelectedGroupId(null);
		channelSelected("logo-menu");
	};

	return (
		<SidebarContainer>
			<SettingRows>
				<NavigatorIcon>
					{/* LogoSection - khi click hiện logo menu */}
					<LogoSection onClick={handleLogoClick} style={{ cursor: "pointer" }}>
						<LogoBox>LOGO</LogoBox>
					</LogoSection>

					{/* IndentedSection hiển thị avatars các group */}
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
											// hiển thị avatar nếu có
											// bạn có thể style img trong styled-component nếu cần
											//  sử dụng alt để accessibility
											//  nếu avatar quá lớn thì styled-component CircleIcon nên xử lý overflow
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
											// fallback: lấy chữ cái đầu làm avatar
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
						<SearchContainer>
							<SearchIcon>
								<Search size={16} />
							</SearchIcon>
							<SearchInput placeholder="Search" />
						</SearchContainer>

						<MenuNav>
							{/* Nếu đang ở logoMode -> hiển thị menu logo
                  Ngược lại -> hiển thị channel của expanded group */}
							{logoMode ? (
								logoMenuItems.map((item) => (
									<MenuItem
										key={item.id}
										$isActive={activeSection === item.id}
										onClick={() => handleMenuClick(item.id)}
									>
										<MenuIcon>
											{/* icon placeholder: bạn có thể đổi */}
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
		</SidebarContainer>
	);
};

export default SidebarMenu;
