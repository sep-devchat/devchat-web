// GroupSidebar.tsx
import React from "react";
import { useNavigate } from "@tanstack/react-router";
import {
	GroupSidebarContainer,
	GroupList,
	GroupItem,
	GroupButton,
	UnreadBadge,
	CreateGroupButton,
} from "./GroupSidebar.styled";
import { groups as initialGroups } from "../sample-data";
import AddGroupModal from "@/components/AddGroupModal/AddGroupModal";

const GroupSidebar = () => {
	// local state để có thể thêm nhóm mới tạm thời
	const [localGroups, setLocalGroups] = React.useState(initialGroups);
	const [activeId, setActiveId] = React.useState<string | null>(
		initialGroups[0]?.id ?? null,
	);
	const navigate = useNavigate();

	const handleCreate = async (payload: {
		name: string;
		description?: string;
		privacy: "public" | "private";
		members: string[];
		avatarFile?: File | null;
	}) => {
		// tạo id tạm
		const newId = `group-${Date.now()}`;
		const initials = payload.name
			.split(" ")
			.map((s) => s[0])
			.join("")
			.slice(0, 2)
			.toUpperCase();

		const newGroup = {
			id: newId,
			name: payload.name,
			initials,
			avatarColor: "#8b5cf6", // màu mặc định, bạn có thể derive từ avatarFile
			unread: 0,
		};

		// thêm vào danh sách cục bộ
		setLocalGroups((prev) => [newGroup, ...prev]);
		setActiveId(newId);

		// điều hướng tới route nhóm mới
		navigate({
			to: "/chat/group/$groupId",
			params: { groupId: newId },
		});

		// nếu cần làm request API thật sự, bọc ở đây và chờ response, xử lý lỗi...
	};

	return (
		<GroupSidebarContainer>
			<GroupList>
				{localGroups.map((g) => (
					<GroupItem key={g.id}>
						<GroupButton
							type="button"
							title={g.name}
							aria-selected={activeId === g.id}
							$color={g.avatarColor}
							onClick={() => {
								setActiveId(g.id);
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
					{/* dùng AddGroupModal với trigger tuỳ chỉnh là CreateGroupButton */}
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
						onCreate={handleCreate}
					/>
				</GroupItem>
			</GroupList>
		</GroupSidebarContainer>
	);
};

export default GroupSidebar;
