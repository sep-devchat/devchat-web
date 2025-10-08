/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	Search,
	X,
	Hash,
	SettingsIcon,
	Plus,
	MessageCircle,
	Settings,
} from "lucide-react";
import {
	IconButton,
	SearchInput,
	FriendList,
	FriendItem,
	FriendName,
	ChannelIcon,
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
	InputModal,
	PrivateSection,
	PrivateIcon,
	PrivateContent,
	PrivateTitle,
	PrivateDescription,
	Toggle,
	ToggleInput,
	ToggleSlider,
	ModalFooter,
	ButtonModal,
	Divider,
	LeftSidebarContainer,
} from "./LeftSidebar.styled";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import MemberItem from "@/components/custom/MemberItem/MemberItem";
import React from "react";
import { GroupResponse, listGroups } from "@/services/groupAPI";

interface LeftSidebarProps {
	setSettingSelect: (value: boolean) => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
	setSettingSelect,
}) => {
	const params = useParams({ strict: false }) as { groupId?: string };
	const search = useSearch({ strict: false }) as { channel?: string };
	const [localGroups, setLocalGroups] = React.useState<any[]>([]);
	const navigate = useNavigate();
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [channelName, setChannelName] = useState<string>("");
	const [isPrivate, setIsPrivate] = useState<boolean>(false);

	const isGroupPage = Boolean(params.groupId);
	const currentGroup = isGroupPage
		? localGroups.find((g) => g.id === params.groupId)
		: undefined;
	const [channels, setChannels] = useState(
		isGroupPage
			? [
					{ id: "general", name: "general" },
					{ id: "random", name: "random" },
					{ id: "announcements", name: "announcements" },
				]
			: [],
	);

	const handleAddChannel = () => {
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setChannelName("");
		setIsPrivate(false);
	};

	const handleCreateChannel = () => {
		if (!channelName.trim()) return;

		const newChannel = {
			id: channelName.toLowerCase().replace(/\s+/g, "-"),
			name: channelName.trim(),
		};

		setChannels([...channels, newChannel]);
		handleCloseModal();
	};

	// fetch groups từ API khi mount
	React.useEffect(() => {
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

	return (
		<LeftSidebarContainer className="flex flex-col w-full bg-[rgba(255,255,255,0.30)] rounded-l-lg">
			<div className="flex items-center justify-center p-2 pr-4 border-b border-white">
				{isGroupPage ? (
					<div className="w-full px-1 py-1.5 flex justify-between items-center">
						<h3 className="text-base font-semibold truncate">
							{currentGroup?.name ?? "Group"}
						</h3>
						<div className="flex gap-2">
							<Plus
								width={20}
								className="ml-3 hover:text-blue-500 cursor-pointer"
								onClick={handleAddChannel}
							/>
							<SettingsIcon
								width={20}
								className="hover:text-blue-500 cursor-pointer"
								onClick={() => setSettingSelect(true)}
							/>
						</div>
					</div>
				) : (
					<div className="relative w-full">
						<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
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
					<IconButton onClick={handleAddChannel} title="Create channel">
						+
					</IconButton>
				</div>
			) : (
				<div className="flex p-2 justify-between items-center">
					<h3 className="text-lg font-semibold">Conversations</h3>
					<button className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 cursor-pointer">
						+
					</button>
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
						{
							id: "1",
							name: "Alice Johnson",
							avatar:
								"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
							isOnline: false,
						},
						{
							id: "2",
							name: "Bob Smith",
							avatar:
								"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
							isOnline: true,
						},
						{
							id: "3",
							name: "Catherine Zeta",
							avatar:
								"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
							isOnline: true,
						},
					].map((f) => (
						<MemberItem
							key={f.id}
							showTooltip={false}
							member={f}
							buttonType="more"
						/>
					))}
				</FriendList>
			)}

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
							<InputModal
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
							<ButtonModal variant="secondary" onClick={handleCloseModal}>
								Cancel
							</ButtonModal>
							<ButtonModal
								variant="primary"
								onClick={handleCreateChannel}
								disabled={!channelName.trim()}
							>
								Create Channel
							</ButtonModal>
						</ModalFooter>
					</ModalContent>
				</ModalOverlay>
			)}
		</LeftSidebarContainer>
	);
};
