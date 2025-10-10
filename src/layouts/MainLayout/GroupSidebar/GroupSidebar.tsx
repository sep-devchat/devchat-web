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
import AddGroupModal from "@/components/custom/AddGroupModal/AddGroupModal";
import { listGroups, GroupResponse } from "@/services/groupAPI";

type SidebarGroup = {
	id: string;
	name: string;
	initials: string;
	avatarColor: string;
	unread: number;
	avatar?: string;
	isActive?: boolean;
};

const GroupSidebar: React.FC = () => {
	// ban đầu để rỗng — sẽ được cập nhật từ API
	const [localGroups, setLocalGroups] = useState<SidebarGroup[]>([]);
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
						isActive: g.isActive ?? true, // nếu server có isActive thì dùng, nếu không mặc định true
					} as SidebarGroup;
				});

				// CHỈ LƯU NHỮNG GROUP isActive === true
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
			isActive: true, // mới tạo mặc định active
		};

		// chỉ thêm nếu isActive true (ở đây luôn true)
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
				{/* CHỈ RENDER NHỮNG GROUP isActive === true */}
				{localGroups
					.filter((g) => g.isActive === true)
					.map((g) => (
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
								aria-label={`Open group ${g.name}`}
							>
								{/* Nếu có avatar URL thì hiển thị <img>, ngược lại hiển thị initials */}
								{g.avatar ? (
									<img
										src={g.avatar}
										alt={`${g.name} avatar`}
										// style nhỏ để đảm bảo nó khớp với nút (tùy style GroupButton của bạn)
										style={{
											width: "2.25rem",
											height: "2.25rem",
											borderRadius: "9999px",
											objectFit: "cover",
											display: "block",
										}}
										// Khi load lỗi thì ẩn <img> để fallback về initials
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
