/* eslint-disable @typescript-eslint/no-explicit-any */
import { Search, X, Hash, SettingsIcon, UserPlus } from "lucide-react";
import {
	IconButton,
	SearchInput,
	FriendList,
	FriendItem,
	Avatar,
	FriendName,
	RemoveButton,
	ChannelIcon,
	ActionButton,
} from "./LeftSidebar.styled";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { groups } from "../sample-data";
import AddGroupMemModal from "@/components/AddGroupMemModal/AddGroupMemModal";

const LeftSidebar = () => {
	const params = useParams({ strict: false }) as { groupId?: string };
	const search = useSearch({ strict: false }) as { channel?: string };
	const navigate = useNavigate();
	const isGroupPage = Boolean(params.groupId);
	const currentGroup = isGroupPage
		? groups.find((g) => g.id === params.groupId)
		: undefined;
	const channels = isGroupPage
		? [
				{ id: "general", name: "general" },
				{ id: "random", name: "random" },
				{ id: "announcements", name: "announcements" },
			]
		: [];

	return (
		<div className="flex flex-col w-full bg-[rgba(255,255,255,0.30)] rounded-l-lg ">
			<div className="flex items-center justify-center p-2 border-b border-white">
				{isGroupPage ? (
					<div className="w-full px-1 py-1.5 flex justify-between items-center">
						<h3 className="text-base font-semibold truncate">
							{currentGroup?.name ?? "Group"}
						</h3>
						<ActionButton>
							<AddGroupMemModal
								groupId={params.groupId}
								trigger={
									<IconButton
										title="Invite members"
										aria-label="Invite members"
									>
										<UserPlus width={20} />
									</IconButton>
								}
								onAddMembers={async (userIds: string[]) => {
									// TODO: gọi API invite / cập nhật state... ví dụ demo:
									console.log(
										"Invite these user ids to group",
										params.groupId,
										userIds,
									);
									// nếu muốn, navigate hoặc show toast; gọi API rồi refresh group members
								}}
							/>
							<SettingsIcon
								width={20}
								className="hover:text-blue-500 cursor-pointer"
							/>
						</ActionButton>
					</div>
				) : (
					<div className="relative w-full">
						<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<SearchInput
							placeholder="Find or start a conversation"
							className="pl-9 shadow-none focus-visible:ring-1 focus-visible:ring-[rgba(25,82,179,0.21)]"
						/>
					</div>
				)}
			</div>

			{isGroupPage ? (
				<div className="flex p-2 justify-between items-center">
					<h3 className="text-lg font-semibold">Channels</h3>
					<IconButton title="Create channel">+</IconButton>
				</div>
			) : (
				<div className="flex p-2 justify-between items-center">
					<h3 className="text-lg font-semibold">Conversations</h3>
					<IconButton>+</IconButton>
				</div>
			)}

			{isGroupPage ? (
				<FriendList>
					{channels.map((c) => (
						<FriendItem
							key={c.id}
							onClick={() =>
								params.groupId &&
								navigate({
									to: "/chat/group/$groupId",
									params: { groupId: params.groupId },
									search: (s: any) => ({ ...s, channel: c.id }),
								})
							}
						>
							<ChannelIcon>
								<Hash className="h-4 w-4" />
							</ChannelIcon>
							<FriendName
								title={c.name}
								className={
									search.channel === c.id ? "font-semibold" : undefined
								}
							>
								{c.name}
							</FriendName>
						</FriendItem>
					))}
				</FriendList>
			) : (
				<FriendList>
					{[
						{ id: "1", name: "Alice Johnson" },
						{ id: "2", name: "Bob Smith" },
						{ id: "3", name: "Catherine Zeta" },
					].map((f) => (
						<FriendItem key={f.id}>
							<Avatar>
								{f.name
									.split(" ")
									.map((n) => n[0])
									.slice(0, 2)
									.join("")
									.toUpperCase()}
							</Avatar>
							<FriendName title={f.name}>{f.name}</FriendName>
							<RemoveButton
								size="sm"
								variant="ghost"
								aria-label={`Remove ${f.name}`}
							>
								<X className="h-4 w-4" />
							</RemoveButton>
						</FriendItem>
					))}
				</FriendList>
			)}
		</div>
	);
};

export default LeftSidebar;
