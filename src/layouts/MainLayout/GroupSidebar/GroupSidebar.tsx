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
import { groups } from "../sample-data";

const GroupSidebar = () => {
	const [activeId, setActiveId] = React.useState<string | null>(
		groups[0]?.id ?? null,
	);
	const navigate = useNavigate();

	return (
		<GroupSidebarContainer>
			<GroupList>
				{groups.map((g) => (
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
					<CreateGroupButton
						type="button"
						title="Create group"
						aria-label="Create group"
					>
						+
					</CreateGroupButton>
				</GroupItem>
			</GroupList>
		</GroupSidebarContainer>
	);
};

export default GroupSidebar;
