/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useRef, useState } from "react";
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

const extractGroupIdFromPath = (path: string): string | null => {
	// path ví dụ: "/chat/group/abc123", hoặc "/chat/group/abc123/"
	if (!path) return null;
	const parts = path.split("/"); // ["", "chat", "group", "abc123"]
	if (parts[1] === "chat" && parts[2] === "group" && parts[3]) {
		try {
			return decodeURIComponent(parts[3]);
		} catch {
			return parts[3];
		}
	}
	return null;
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

	const mapGroups = (payload: GroupResponse[] = []) =>
		(payload || []).map((g) => {
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
				avatarColor: `${theme.color.primary}`,
				unread: 0,
				avatar: g.avatar ?? undefined,
				isActive: g.isActive ?? true,
			} as SidebarGroup;
		});

	// fetch groups and determine whether to auto-select a group based on current path
	const fetchGroups = useCallback(async () => {
		try {
			const res = await listGroups();
			const payload = (res && (res.data ?? res)) as GroupResponse[];
			const mapped = mapGroups(payload);
			const onlyActive = mapped.filter((mg) => mg.isActive === true);

			setLocalGroups(onlyActive);

			// decide auto-selection based on current pathname
			const path = window.location.pathname || "";
			const groupIdInPath = extractGroupIdFromPath(path);

			// If the URL is /chat/group/<id> and that id exists in groups => select it
			if (groupIdInPath && onlyActive.some((g) => g.id === groupIdInPath)) {
				setActiveId(groupIdInPath);
				setSelectedGroupId(groupIdInPath);
				setLogoMode(false);
				return;
			}

			// If current path is not a group route (e.g., /chat, /chat/friend, etc.), do NOT auto-select first group.
			// instead, treat as "logo/home" mode so triangle won't show.
			const isGroupRoute = path.startsWith("/chat/group/");
			if (!isGroupRoute) {
				setActiveId(null);
				setSelectedGroupId(null);
				setLogoMode(true);
				return;
			}

			// If we reach here: we're on a /chat/group/... path but groupId not found in list,
			// fallback to selecting the first group only if nothing is selected yet.
			if (onlyActive.length > 0 && !activeId) {
				setActiveId(onlyActive[0].id);
				setSelectedGroupId(onlyActive[0].id);
				setLogoMode(false);
			} else if (onlyActive.length === 0) {
				setActiveId(null);
				setSelectedGroupId(null);
			}
		} catch (err) {
			console.error("Failed to load groups:", err);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeId]);

	useEffect(() => {
		fetchGroups();
	}, [fetchGroups]);

	useEffect(() => {
		const handleRefresh = () => {
			fetchGroups();
		};

		window.addEventListener("refreshGroups", handleRefresh);

		return () => {
			window.removeEventListener("refreshGroups", handleRefresh);
		};
	}, [fetchGroups]);

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
				<LogoBox
					data-focused={logoMode}
					aria-pressed={logoMode}
					aria-label="Go to home"
				>
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
											<linearGradient id={`triGradient-${g.id}`} x1="0" x2="1">
												<stop offset="0" stopColor="#D4D491" />
												<stop offset="1" stopColor="#4D85E6" />
											</linearGradient>
										</defs>

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
											fill={`url(#triGradient-${g.id})`}
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
