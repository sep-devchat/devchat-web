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
} from "./GroupSidebar.styled";
import AddGroupModal from "@/components/AddGroupModal/AddGroupModal";
import { listGroups, GroupResponse } from "@/services/groupAPI";

const GroupSidebar: React.FC = () => {
	// ban đầu để rỗng — sẽ được cập nhật từ API
	const [localGroups, setLocalGroups] = useState<any[]>([]);
	const [activeId, setActiveId] = useState<string | null>(null);
	const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
	const navigate = useNavigate();
	const contentWrapperRef = useRef<HTMLUListElement | null>(null);
	const [logoMode, setLogoMode] = useState<boolean>(false);

	// scroll về đầu khi selectedGroupId hoặc logoMode thay đổi
	useEffect(() => {
		if (contentWrapperRef.current) {
			contentWrapperRef.current.scrollTop = 0;
		}
	}, [selectedGroupId, logoMode]);

	// fetch groups từ API khi mount
	useEffect(() => {
		let mounted = true;
		const fetch = async () => {
			try {
				const res = await listGroups();
				const payload = (res && (res.data ?? res)) as GroupResponse[];
				if (!mounted) return;

				// map server GroupResponse -> shape sidebar dùng
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
						avatarColor: "#8b5cf6", // giữ mặc định như trước; đổi nếu có logic color khác
						unread: 0,
						avatar: g.avatar ?? undefined,
					};
				});

				setLocalGroups(mapped);
				if (mapped.length > 0) {
					setActiveId(mapped[0].id);
					setSelectedGroupId(mapped[0].id);
					setLogoMode(false);
				} else {
					setActiveId(null);
					setSelectedGroupId(null);
				}
			} catch (err) {
				console.error("Failed to load groups:", err);
				// Giữ localGroups như hiện tại nếu lỗi
			}
		};

		fetch();
		return () => {
			mounted = false;
		};
	}, []);

	// onCreate từ modal sẽ truyền object { id, name } (server trả về)
	const handleCreatedNavigate = (
		created: GroupResponse | { id: string; name: string },
	) => {
		const initials = created.name
			.split(" ")
			.map((s) => s[0] ?? "")
			.join("")
			.slice(0, 2)
			.toUpperCase();
		const newGroup = {
			id: created.id,
			name: created.name,
			initials,
			avatarColor: "#8b5cf6",
			unread: 0,
			avatar: (created as GroupResponse).avatar ?? undefined,
		};

		setLocalGroups((prev) => [newGroup, ...prev]);
		setActiveId(created.id);
		setSelectedGroupId(created.id);
		setLogoMode(false);
		navigate({ to: "/chat/group/$groupId", params: { groupId: created.id } });
	};

	const handleLogoClick = () => {
		setLogoMode(true);
		setSelectedGroupId(null);
		setActiveId(null);
		navigate({ to: "/chat/friend" });
		// channelSelected("logo-menu");
	};

	return (
		<GroupSidebarContainer>
			<LogoSection onClick={handleLogoClick} style={{ cursor: "pointer" }}>
				<LogoBox>LOGO</LogoBox>
			</LogoSection>

			{/* gán ref để control scroll */}
			<GroupList ref={contentWrapperRef}>
				{localGroups.map((g) => (
					<GroupItem key={g.id}>
						<GroupButton
							type="button"
							title={g.name}
							aria-selected={activeId === g.id}
							$color={g.avatarColor}
							onClick={() => {
								setActiveId(g.id);
								setSelectedGroupId(g.id);
								setLogoMode(false);
								navigate({
									to: "/chat/group/$groupId",
									params: { groupId: g.id },
								});
							}}
						>
							{g.initials}
							{g.unread ? (
								<UnreadBadge>{g.unread > 99 ? "99+" : g.unread}</UnreadBadge>
							) : null}
						</GroupButton>
					</GroupItem>
				))}

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
						onCreate={handleCreatedNavigate}
					/>
				</GroupItem>
			</GroupList>
		</GroupSidebarContainer>
	);
};

export default GroupSidebar;
