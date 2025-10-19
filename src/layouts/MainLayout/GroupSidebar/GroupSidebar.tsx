/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
	GroupSidebarContainer,
	GroupList,
	GroupItem,
	GroupButton,
	UnreadBadge,
	CreateGroupButton,
	LogoSection,
	LogoBox,
	Triangle,
	GroupListOnly,
} from "./GroupSidebar.styled";
import AddGroupModal from "@/components/custom/AddGroupModal/AddGroupModal";
import { listGroups, GroupResponse } from "@/services/groupAPI";
import { theme } from "@/themes";
import { listChannels } from "@/services/channelAPI";
import devchatLogo from "@/assets/devchat-logo.png";

type SidebarGroup = {
	id: string;
	name: string;
	initials: string;
	avatarColor: string;
	unread: number;
	avatar?: string;
	isActive?: boolean;
};

const CHANNEL_HISTORY_KEY = "group_channel_history";

const getLastChannelForGroup = (groupId: string): string | null => {
	try {
		const history = localStorage.getItem(CHANNEL_HISTORY_KEY);
		if (!history) return null;
		const parsed = JSON.parse(history);
		return parsed[groupId] || null;
	} catch (err) {
		console.error("Failed to get channel history:", err);
		return null;
	}
};

const GroupSidebar: React.FC = () => {
	const [localGroups, setLocalGroups] = useState<SidebarGroup[]>([]);
	const [activeId, setActiveId] = useState<string | null>(null);
	const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
	const navigate = useNavigate();
	const contentWrapperRef = useRef<HTMLUListElement | null>(null);
	const [logoMode, setLogoMode] = useState<boolean>(false);

	useEffect(() => {
		if (contentWrapperRef.current) {
			contentWrapperRef.current.scrollTop = 0;
		}
	}, [selectedGroupId, logoMode]);

	useEffect(() => {
		let mounted = true;
		const fetch = async () => {
			try {
				const res = await listGroups();
				const payload = (res && (res.data ?? res)) as GroupResponse[];
				if (!mounted) return;

				const mapped = (payload || []).map((g) => {
					const initials = (g.name || "")
						.split(" ")
						.map((s) => s[0] ?? "")
						.join("")
						.slice(0, 2)
						.toUpperCase();
					return {
						id: g.id,
						name: g.name,
						initials,
						avatarColor: `${theme.color.primary}`, // giữ mặc định như trước; đổi nếu có logic color khác
						unread: 0,
						avatar: g.avatar ?? undefined,
						isActive: g.isActive ?? true,
					} as SidebarGroup;
				});

				const onlyActive = mapped.filter((mg) => mg.isActive === true);

				setLocalGroups(onlyActive);
				if (onlyActive.length > 0) {
					setActiveId(onlyActive[0].id);
					setSelectedGroupId(onlyActive[0].id);
					setLogoMode(false);
				} else {
					setActiveId(null);
					setSelectedGroupId(null);
				}
			} catch (err) {
				console.error("Failed to load groups:", err);
			}
		};

		fetch();
		return () => {
			mounted = false;
		};
	}, []);

	const onCreate = (
		created: GroupResponse | { id: string; name: string; avatar?: string },
	) => {
		const initials = created.name
			.split(" ")
			.map((s) => s[0] ?? "")
			.join("")
			.slice(0, 2)
			.toUpperCase();
		const newGroup: SidebarGroup = {
			id: created.id,
			name: created.name,
			initials,
			avatarColor: "#8b5cf6",
			unread: 0,
			avatar: created.avatar ?? undefined,
			isActive: true,
		};

		setLocalGroups((prev) => [newGroup, ...prev]);
		setActiveId(created.id);
		setSelectedGroupId(created.id);
		setLogoMode(false);

		navigate({ to: "/chat/group/$groupId", params: { groupId: created.id } });
	};

	const handleGroupClick = async (groupId: string) => {
		setActiveId(groupId);
		setSelectedGroupId(groupId);
		setLogoMode(false);

		try {
			const res = await listChannels(groupId);
			const channelData = res?.data?.data || res?.data || [];

			if (!channelData || channelData.length === 0) {
				navigate({
					to: "/chat/group/$groupId",
					params: { groupId },
				});
				return;
			}

			const lastChannelId = getLastChannelForGroup(groupId);
			const lastChannelExists =
				lastChannelId && channelData.some((ch: any) => ch.id === lastChannelId);

			const targetChannelId = lastChannelExists
				? lastChannelId
				: channelData[0].id;

			navigate({
				to: "/chat/group/$groupId",
				params: { groupId },
				search: { channel: targetChannelId },
			});
		} catch (err) {
			console.error("Failed to fetch channels for group:", err);
			navigate({
				to: "/chat/group/$groupId",
				params: { groupId },
			});
		}
	};

	const handleLogoClick = () => {
		setLogoMode(true);
		setSelectedGroupId(null);
		setActiveId(null);
		navigate({ to: "/chat/friend" });
	};

	return (
		<GroupSidebarContainer>
			<LogoSection onClick={handleLogoClick} style={{ cursor: "pointer" }}>
				<LogoBox>
					<img src={devchatLogo} className="rounded-full" />
				</LogoBox>
			</LogoSection>

			<GroupList ref={contentWrapperRef}>
				<GroupListOnly>
					{localGroups
						.filter((g) => g.isActive === true)
						.map((g) => (
							<GroupItem key={g.id}>
								<GroupButton
									type="button"
									title={g.name}
									aria-selected={activeId === g.id}
									$color={g.avatarColor}
									onClick={() => handleGroupClick(g.id)}
									aria-label={`Open group ${g.name}`}
								>
									<Triangle
										className="left-triangle"
										viewBox="0 0 200 420"
										role="presentation"
										aria-hidden="true"
									>
										<defs>
											<linearGradient id="triGradient" x1="0" x2="1">
												<stop offset="0" stopColor="#D4D491" />
												<stop offset="1" stopColor="#4D85E6" />
											</linearGradient>
										</defs>

										{/* Path với bo góc (A = arc) — bạn có thể chỉnh rx/ry để thay đổi bán kính */}
										<path
											d="
											M 40 30
											A 20 20 0 0 0 20 50
											V 370
											A 20 20 0 0 0 40 390
											H 100
											L 170 210
											L 100 30
											Z
										"
											fill="url(#triGradient)"
										/>
									</Triangle>
									{g.avatar ? (
										<img
											src={g.avatar}
											alt={`${g.name} avatar`}
											style={{
												width: "40px",
												height: "40px",
												borderRadius: "9999px",
												objectFit: "cover",
												display: "block",
											}}
											onError={(e) => {
												const img = e.currentTarget as HTMLImageElement;
												img.onerror = null;
												img.style.display = "none";
											}}
										/>
									) : (
										<span>{g.initials}</span>
									)}

									{g.unread ? (
										<UnreadBadge>
											{g.unread > 99 ? "99+" : g.unread}
										</UnreadBadge>
									) : null}
								</GroupButton>
							</GroupItem>
						))}
				</GroupListOnly>
				<GroupItem>
					<AddGroupModal
						trigger={
							<CreateGroupButton
								type="button"
								title="Create group"
								aria-label="Create group"
							>
								+
							</CreateGroupButton>
						}
						onCreate={onCreate}
					/>
				</GroupItem>
			</GroupList>
		</GroupSidebarContainer>
	);
};

export default GroupSidebar;
