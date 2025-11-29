/* eslint-disable @typescript-eslint/no-explicit-any */
import { X, MessageCircle, Settings, PlusIcon } from "lucide-react";
import {
	SearchInput,
	FriendList,
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
	HeaderContainer,
	GroupHeader,
	GroupTitle,
	IconButtonGroup,
	IconButton,
	SettingsIconStyled,
	SearchContainer,
	SearchIcon,
	SectionHeader,
	SectionTitle,
	ProfileWrapper,
	TooltipWrapper,
	Tooltip,
} from "./LeftSidebar.styled";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import MemberItem from "@/components/custom/MemberItem/MemberItem";
import React from "react";
import { GroupResponse, listGroups } from "@/services/groupAPI";
import {
	ChannelResponse,
	listChannels,
	createChannel,
	ChannelPostRequest,
} from "@/services/channelAPI";
import { ChannelItem } from "@/components/custom/ChannelItem/ChannelItem";
import { listDirectMessagePeers } from "@/services/messageAPI";
import { Profile } from "@/services/auth/auth.type";
import ProfileSection from "../Profile";
interface LeftSidebarProps {
	setSettingSelect: (value: boolean) => void;
}

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

const saveLastChannelForGroup = (groupId: string, channelId: string): void => {
	try {
		const history = localStorage.getItem(CHANNEL_HISTORY_KEY);
		const parsed = history ? JSON.parse(history) : {};
		parsed[groupId] = channelId;
		localStorage.setItem(CHANNEL_HISTORY_KEY, JSON.stringify(parsed));
	} catch (err) {
		console.error("Failed to save channel history:", err);
	}
};

const GroupTitleWithTooltip = ({ title }: { title: string }) => {
	const [showTooltip, setShowTooltip] = useState(false);
	const [isOverflowing, setIsOverflowing] = useState(false);
	const titleRef = useRef<HTMLHeadingElement>(null);

	useEffect(() => {
		const checkOverflow = () => {
			if (titleRef.current) {
				setIsOverflowing(
					titleRef.current.scrollWidth > titleRef.current.clientWidth,
				);
			}
		};

		checkOverflow();
		window.addEventListener("resize", checkOverflow);
		return () => window.removeEventListener("resize", checkOverflow);
	}, [title]);

	return (
		<TooltipWrapper
			onMouseEnter={() => isOverflowing && setShowTooltip(true)}
			onMouseLeave={() => setShowTooltip(false)}
		>
			<GroupTitle ref={titleRef}>{title}</GroupTitle>
			{showTooltip && isOverflowing && <Tooltip>{title}</Tooltip>}
		</TooltipWrapper>
	);
};

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
	setSettingSelect,
}) => {
	const params = useParams({ strict: false }) as {
		groupId?: string;
		userId?: string;
	};
	const search = useSearch({ strict: false }) as { channel?: string };
	const [localGroups, setLocalGroups] = React.useState<any[]>([]);
	const navigate = useNavigate();
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [channelName, setChannelName] = useState<string>("");
	const [channelDescription, setChannelDescription] = useState<string>("");
	const [isPrivate, setIsPrivate] = useState<boolean>(false);
	const [isCreating, setIsCreating] = useState<boolean>(false);

	const isGroupPage = Boolean(params.groupId);
	const currentGroup = isGroupPage
		? localGroups.find((g) => g.id === params.groupId)
		: undefined;
	const [channels, setChannels] = useState<ChannelResponse[]>([]);
	const [dmPeers, setDmPeers] = useState<Profile[]>([]);
	const [dmLoading, setDmLoading] = useState<boolean>(false);

	React.useEffect(() => {
		if (params.groupId && search.channel) {
			saveLastChannelForGroup(params.groupId, search.channel);
		}
	}, [params.groupId, search.channel]);

	const isFirstFetch = React.useRef(true);
	const prevGroupId = React.useRef<string | undefined>(undefined);

	React.useEffect(() => {
		if (!params.groupId) {
			setChannels([]);
			isFirstFetch.current = true;
			prevGroupId.current = undefined;
			// load DM peers when not on group page
			(async () => {
				try {
					setDmLoading(true);
					const res = await listDirectMessagePeers();
					const payload = (res as any)?.data ?? (res as any);
					setDmPeers(Array.isArray(payload) ? payload : []);
				} catch (err) {
					console.error("Failed to fetch DM peers:", err);
					setDmPeers([]);
				} finally {
					setDmLoading(false);
				}
			})();
			return;
		}

		if (prevGroupId.current !== params.groupId) {
			isFirstFetch.current = true;
			prevGroupId.current = params.groupId;
		}

		fetchChannelsList();
	}, [params.groupId]);

	const fetchChannelsList = async () => {
		if (!params.groupId) return;

		try {
			const res = await listChannels(params.groupId);
			const channelData = res?.data?.data || res?.data || [];
			setChannels(channelData);

			if (!channelData || channelData.length === 0) {
				isFirstFetch.current = false;
				return;
			}

			const currentChannelExists =
				!!search.channel &&
				channelData.some((ch: any) => ch.id === search.channel);

			if (currentChannelExists) {
				isFirstFetch.current = false;
				return;
			}

			const lastChannelId = getLastChannelForGroup(params.groupId);
			const lastChannelExists =
				lastChannelId && channelData.some((ch: any) => ch.id === lastChannelId);

			const targetChannelId = lastChannelExists
				? lastChannelId
				: channelData[0].id;

			navigate({
				to: "/chat/group/$groupId",
				params: { groupId: params.groupId! },
				search: (s: any) => ({ ...s, channel: targetChannelId }),
			});

			isFirstFetch.current = false;
		} catch (err) {
			console.error("Failed to fetch channels:", err);
			setChannels([]);
			isFirstFetch.current = false;
		}
	};

	const handleAddChannel = () => {
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setChannelName("");
		setChannelDescription("");
		setIsPrivate(false);
	};

	const handleCreateChannel = async () => {
		if (!channelName.trim() || !params.groupId) return;

		setIsCreating(true);
		try {
			const payload: ChannelPostRequest = {
				name: channelName.trim(),
				description: channelDescription.trim() || null,
				isPrivate: isPrivate,
			};

			const res = await createChannel(params.groupId, payload);

			console.log("Create channel response:", res);

			if (res && (res.message === "Created successfully" || res.data)) {
				await fetchChannelsList();
				handleCloseModal();
			}
		} catch (err) {
			console.error("Failed to create channel:", err);
			alert("Failed to create channel. Please try again.");
		} finally {
			setIsCreating(false);
		}
	};

	React.useEffect(() => {
		const handler = (ev: Event) => {
			try {
				const created = (ev as CustomEvent).detail as
					| GroupResponse
					| { id: string; name: string; avatar?: string };
				if (!created || !created.id) return;

				setLocalGroups((prev) => {
					if (prev.some((p) => p.id === created.id)) return prev;
					const initials = (created.name || "")
						.split(" ")
						.map((s) => s[0] ?? "")
						.join("")
						.slice(0, 2)
						.toUpperCase();
					const newGroup = {
						id: created.id,
						name: created.name,
						initials,
						avatarColor: created.avatar ?? "#8b5cf6",
						unread: 0,
						avatar: created.avatar ?? undefined,
					};
					return [newGroup, ...prev];
				});
			} catch (err) {
				console.error("groupCreated handler error:", err);
			}
		};

		window.addEventListener("app:groupCreated", handler as EventListener);
		return () =>
			window.removeEventListener("app:groupCreated", handler as EventListener);
	}, []);

	React.useEffect(() => {
		if (!params.groupId) return;

		const exists = localGroups.some((g) => g.id === params.groupId);
		if (exists) return;

		let mounted = true;
		(async () => {
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
						avatarColor: "#8b5cf6",
						unread: 0,
						avatar: g.avatar ?? undefined,
					};
				});

				setLocalGroups(mapped);
			} catch (err) {
				console.error("Failed to re-fetch groups for missing groupId:", err);
			}
		})();

		return () => {
			mounted = false;
		};
	}, [params.groupId]);

	return (
		<LeftSidebarContainer>
			<HeaderContainer>
				{isGroupPage ? (
					<GroupHeader>
						<GroupTitleWithTooltip title={currentGroup?.name ?? "Group"} />
						<IconButtonGroup>
							<IconButton onClick={handleAddChannel}>
								<PlusIcon />
							</IconButton>
							<IconButton onClick={() => setSettingSelect(true)}>
								<SettingsIconStyled />
							</IconButton>
						</IconButtonGroup>
					</GroupHeader>
				) : (
					<SearchContainer>
						<SearchIcon />
						<SearchInput placeholder="Find conversation" />
					</SearchContainer>
				)}
			</HeaderContainer>

			{isGroupPage ? (
				<SectionHeader>
					<SectionTitle>Channels</SectionTitle>
				</SectionHeader>
			) : (
				<SectionHeader>
					<SectionTitle>Conversations</SectionTitle>
				</SectionHeader>
			)}

			{isGroupPage ? (
				<FriendList>
					{channels.map((c: any) => (
						<ChannelItem
							key={c.id}
							channel={c}
							groupId={params.groupId!}
							isActive={search.channel === c.id}
							onClick={() =>
								navigate({
									to: "/chat/group/$groupId",
									params: { groupId: params.groupId },
									search: (s: any) => ({ ...s, channel: c.id }),
								})
							}
							onChannelUpdated={fetchChannelsList}
							onChannelDeleted={() => {
								fetchChannelsList();
								if (search.channel === c.id) {
									navigate({
										to: "/chat/group/$groupId",
										params: { groupId: params.groupId },
										search: {},
									});
								}
							}}
						/>
					))}
				</FriendList>
			) : (
				<FriendList>
					{dmLoading ? (
						<div style={{ padding: "8px", fontSize: 12, color: "#666" }}>
							Loading conversations…
						</div>
					) : dmPeers.length === 0 ? (
						<div style={{ padding: "8px", fontSize: 12, color: "#666" }}>
							No direct conversations yet
						</div>
					) : (
						dmPeers.map((p) => {
							const name =
								[p.firstName, p.lastName].filter(Boolean).join(" ") ||
								p.username ||
								"Unknown";
							const member = {
								id: p.id,
								name,
								avatar: p.avatarUrl || "",
								isOnline: false,
								email: p.email,
							} as any;
							const isActive = params.userId === p.id;
							return (
								<div
									key={p.id}
									onClick={() =>
										navigate({
											to: "/chat/user/$userId",
											params: { userId: p.id },
										})
									}
									style={{
										cursor: "pointer",
										background: isActive ? "#f5f5f5" : undefined,
										borderRadius: "8px",
									}}
								>
									<MemberItem
										showTooltip={false}
										member={member}
										// buttonType="more"
									/>
								</div>
							);
						})
					)}
				</FriendList>
			)}

			<ProfileWrapper>
				<ProfileSection />
			</ProfileWrapper>

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
							<Label>Channel Description (Optional)</Label>
							<InputModal
								type="text"
								value={channelDescription}
								onChange={(e) => setChannelDescription(e.target.value)}
								placeholder="What is this channel about?"
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
								disabled={!channelName.trim() || isCreating}
							>
								{isCreating ? "Creating..." : "Create Channel"}
							</ButtonModal>
						</ModalFooter>
					</ModalContent>
				</ModalOverlay>
			)}
		</LeftSidebarContainer>
	);
};
