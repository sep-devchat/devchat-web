/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo } from "react";
import {
	X,
	Mail,
	Calendar,
	UserMinus,
	UserPlus,
	MoreVertical,
	Edit,
	Shield,
} from "lucide-react";
import { toast } from "sonner";
import { inviteToGroup } from "@/services/userGroupAPI";
import { listGroups } from "@/services/groupAPI";
import IconButton from "@/components/custom/ActionButton/IconButton";
import { DeleteButton } from "@/components/custom/ActionButton/DeleteButton";

import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSub,
	DropdownMenuSubTrigger,
	DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import {
	Avatar,
	AvatarSection,
	HeaderActions,
	IconWrapper,
	InfoContent,
	InfoItem,
	InfoLabel,
	InfoSection,
	InfoValue,
	ModalBody,
	ModalContainer,
	ModalHeader,
	ModalOverlay,
	Username,
	UserName,
	LanguagesSection,
	LanguagesSectionTitle,
	LanguagesList,
	LanguageItem,
	RankBadge,
	LanguageIcon,
	LanguageInfo,
	LanguageName,
	LanguageProficiency,
	LanguagesEmptyState,
	StatusBadge,
} from "./FriendProfileModal.styled";
import {
	listFriends,
	sendFriendRequest,
	type FriendUser,
} from "@/services/friendAPI";
import { InfoButton } from "@/components/custom/ActionButton/InfoButton";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { SaveButton } from "@/components/custom/ActionButton/SaveButton";
import { UserLanguage } from "@/services/auth/auth.type";
import { fetchProfile } from "@/services/auth/authAPI";

interface Group {
	id: string;
	name: string;
}

interface FriendProfileModalProps {
	isOpen: boolean;
	onClose: () => void;
	friend: FriendUser | null;
	onUnfriend?: (id: string, name: string) => void;
	groupId?: string;
	hideActionButton?: boolean;
}

const FriendProfileModal: React.FC<FriendProfileModalProps> = ({
	isOpen,
	onClose,
	friend,
	onUnfriend,
	groupId,
	hideActionButton = false,
}) => {
	const [groups, setGroups] = useState<Group[]>([]);
	const [loadingGroups, setLoadingGroups] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);

	const [isFriend, setIsFriend] = useState(false);
	const [addingFriend, setAddingFriend] = useState(false);
	const currentUserProfile = useSelector(
		(state: RootState) => (state as any).user?.profile,
	);
	const currentUserId = currentUserProfile?.id || "";
	const [isYou, setIsYou] = useState(false);
	const [selfProfile, setSelfProfile] = useState<any | null>(null);

	const resolvedLanguages = useMemo(() => {

		if (isYou) {
			const langs =
				selfProfile?.userLanguages ?? currentUserProfile?.userLanguages;
			if (langs) {
				return [...langs].sort(
					(a, b) =>
						(a.orderIndex ?? Number.MAX_SAFE_INTEGER) -
						(b.orderIndex ?? Number.MAX_SAFE_INTEGER),
				);
			}
		}
		if (friend?.userLanguages) {
			return [...friend.userLanguages].sort(
				(a, b) =>
					(a.orderIndex ?? Number.MAX_SAFE_INTEGER) -
					(b.orderIndex ?? Number.MAX_SAFE_INTEGER),
			);
		}
		return [] as UserLanguage[];
	}, [friend, isYou, currentUserProfile, selfProfile]);

	const topLanguages = resolvedLanguages.slice(0, 4);

	const friendDisplayName = useMemo(() => {
		if (!friend) return "";
		return (
			friend.name ||
			`${friend.firstName ?? ""} ${friend.lastName ?? ""}`.trim() ||
			friend.username ||
			friend.email ||
			"Friend"
		);
	}, [friend]);

	useEffect(() => {
		if (!isOpen) {
			setMenuOpen(false);
		}
	}, [isOpen, groupId]);

	const fetchGroups = async () => {
		setLoadingGroups(true);
		try {
			const response = await listGroups();
			setGroups(response.data || []);
		} catch (error) {
			console.error("Error fetching groups:", error);
			toast.error("Failed to load groups");
		} finally {
			setLoadingGroups(false);
		}
	};

	const checkIsFriend = async () => {
		if (!friend) {
			setIsFriend(false);
			return;
		}
		try {
			const resp = await listFriends();
			const friends = resp?.data || [];
			const found =
				Array.isArray(friends) && friends.some((f: any) => f.id === friend.id);
			setIsFriend(Boolean(found));
		} catch (err) {
			console.error("Failed to fetch friends for checking:", err);
			setIsFriend(false);
		}
	};

	const checkIsYou = async () => {
		if (!friend) {
			setIsYou(false);
			setSelfProfile(null);
			return;
		}
		try {
			if (friend.id === currentUserId) {
				setIsYou(true);
				try {
					const resp = await fetchProfile();
					const data = resp?.data ?? resp;
					setSelfProfile(data);
				} catch (err) {
					console.error("Failed to fetch self profile:", err);
					setSelfProfile(null);
				}
				return;
			}
			setIsYou(false);
			setSelfProfile(null);
		} catch (err) {
			console.error("Failed to check isYou:", err);
			setIsYou(false);
		}
	};

	useEffect(() => {
		if (isOpen && friend) {
			checkIsYou().catch((e) => console.error(e));
			checkIsFriend().catch((e) => console.error(e));
		} else {
			setIsYou(false);
			setIsFriend(false);
		}

	}, [isOpen, friend?.id, groupId, currentUserId]);

	useEffect(() => {
		if (menuOpen && groups.length === 0) {
			fetchGroups().catch((e) => console.error(e));
		}
	}, [menuOpen, groups.length]);

	const handleInviteToGroup = async (groupId: string, groupName: string) => {
		if (!friend) return;

		try {
			await inviteToGroup({
				toUserIdOrEmail: friend.id,
				groupId: groupId,
				message: `Invitation to join ${groupName}`,
			});

			toast.success(
				`Successfully sent invitation to ${friend.firstName || friend.username} to join ${groupName}`,
			);
			setMenuOpen(false);
		} catch (error) {
			console.error("Error inviting to group:", error);
			toast.error("Failed to send invitation");
		}
	};

	const handleUnfriend = () => {
		if (friend && onUnfriend) {
			onUnfriend(friend.id, fullName);
			onClose();
		}
	};

	if (!isOpen || !friend) return null;

	const formatDate = (dateString: string | null) => {
		if (!dateString) return "N/A";
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const fullName = friendDisplayName || friend?.username || "";

	const handleAddFriend = async () => {
		if (!friend) return;
		setAddingFriend(true);
		try {
			await sendFriendRequest({
				toUserId: friend.id,
				message: "Hi! I'd like to be friends.",
			});
			toast.success("Friend request sent");
			setIsFriend(true);
		} catch (err) {
			console.error("Add friend failed", err);
			toast.error("Unable to send friend request. Please try again.");
		} finally {
			setAddingFriend(false);
		}
	};

	const handleEditProfile = () => {
		window.location.href = "/settings";
	};

	return (
		<ModalOverlay onClick={onClose}>
			<ModalContainer onClick={(e) => e.stopPropagation()}>
				<>
					<ModalHeader>
						<HeaderActions>
							{!isYou && (
								<DropdownMenu
									open={menuOpen}
									onOpenChange={(open) => {
										setMenuOpen(open);
										if (open && groups.length === 0)
											fetchGroups().catch((err) => console.error(err));
									}}
								>
									<DropdownMenuTrigger asChild>
										<div>
											<IconButton
												onClick={() => {
													/* trigger handled by DropdownMenuTrigger */
												}}
												icon={MoreVertical}
											/>
										</div>
									</DropdownMenuTrigger>

									<DropdownMenuContent align="end">
										<DropdownMenuSub>
											<DropdownMenuSubTrigger>
												Invite to Group
											</DropdownMenuSubTrigger>
											<DropdownMenuSubContent>
												{loadingGroups ? (
													<DropdownMenuItem disabled>
														Loading groups...
													</DropdownMenuItem>
												) : groups.length === 0 ? (
													<DropdownMenuItem disabled>
														No groups available
													</DropdownMenuItem>
												) : (
													groups.map((g) => (
														<DropdownMenuItem
															key={g.id}
															onClick={(e) => {
																e.stopPropagation();
																handleInviteToGroup(g.id, g.name);
															}}
														>
															{g.name}
														</DropdownMenuItem>
													))
												)}
											</DropdownMenuSubContent>
										</DropdownMenuSub>
									</DropdownMenuContent>
								</DropdownMenu>
							)}

							<IconButton onClick={onClose} icon={X} iconSize={20} />
						</HeaderActions>
					</ModalHeader>

					<ModalBody>
						{/* Two-column layout */}
						<div style={{ display: "flex", gap: "24px", marginTop: "24px" }}>
							{/* Left Column - Info Section */}
							<div style={{ flex: 1 }}>
								<InfoSection>
									<AvatarSection style={{ marginTop: "24px" }}>
										<Avatar
											src={
												(friend?.avatar ?? friend?.avatarUrl ?? undefined) as
												| string
												| undefined
											}
											alt={friendDisplayName}
										/>
										<UserName>{friendDisplayName}</UserName>
										<Username>@{friend.username}</Username>
										{isYou ?? (
											<StatusBadge $isActive={isFriend}>
												<span
													style={{
														width: "6px",
														height: "6px",
														borderRadius: "50%",
														background: isFriend ? "#16a34a" : "#6b7280",
													}}
												/>
												{isFriend ? "Friend" : "Not Friend"}
											</StatusBadge>
										)}									</AvatarSection>

									<InfoItem>
										<IconWrapper>
											<Mail size={18} />
										</IconWrapper>
										<InfoContent>
											<InfoLabel>Email</InfoLabel>
											<InfoValue>{friend.email}</InfoValue>
										</InfoContent>
									</InfoItem>

									<InfoItem>
										<IconWrapper>
											<Calendar size={18} />
										</IconWrapper>
										<InfoContent>
											<InfoLabel>Created Since</InfoLabel>
											<InfoValue>{formatDate(friend.createdAt)}</InfoValue>
										</InfoContent>
									</InfoItem>
									{isFriend ?? (
										<InfoItem>
											<IconWrapper>
												<Shield size={18} />
											</IconWrapper>
											<InfoContent>
												<InfoLabel>Account Status</InfoLabel>
												<InfoValue>
													{friend.emailVerified
														? "✓ - Email Verified"
														: "X - Email Not Verified"}
													{friend.isAdmin && " • Admin"}
												</InfoValue>
											</InfoContent>
										</InfoItem>
									)}								</InfoSection>
							</div>

							{/* Right Column - Top Programming Languages */}
							<div style={{ flex: 1 }}>
								<LanguagesSection>
									<LanguagesSectionTitle>
										🏆 Top Programming Languages
									</LanguagesSectionTitle>
									{topLanguages.length > 0 ? (
										<LanguagesList>
											{topLanguages.map((lang, index) => {
												const rank = index + 1;
												const languageName =
													lang.language?.languageName || "Unknown language";
												const iconFallbackText =
													languageName.charAt(0).toUpperCase() || "?";
												const iconSrc =
													lang.language?.languageIcon ||
													`https://via.placeholder.com/40?text=${encodeURIComponent(iconFallbackText)}`;
												const level = lang.proficiencyLevel || "UNKNOWN";

												return (
													<LanguageItem
														key={lang.id ?? `${lang.languageId}-${rank}`}
														$rank={rank}
													>
														{rank <= 3 ? (
															<RankBadge $rank={rank}>
																{rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"}
															</RankBadge>
														) : (
															<div
																style={{
																	width: "24px",
																	height: "24px",
																	display: "flex",
																	alignItems: "center",
																	justifyContent: "center",
																	fontSize: "14px",
																	fontWeight: 600,
																	color: "#6b7280",
																}}
															>
																{rank}
															</div>
														)}
														<LanguageIcon
															src={iconSrc}
															alt={languageName}
															loading="lazy"
															decoding="async"
															onError={(e) => {
																const img = e.target as HTMLImageElement;
																if (img.dataset.fallback === "1") return;
																img.dataset.fallback = "1";
																img.onerror = null;
																img.src = `https://via.placeholder.com/40?text=${encodeURIComponent(
																	iconFallbackText,
																)}`;
															}}
														/>
														<LanguageInfo>
															<LanguageName>{languageName}</LanguageName>
															<LanguageProficiency $level={level}>
																{level}
															</LanguageProficiency>
														</LanguageInfo>
													</LanguageItem>
												);
											})}
										</LanguagesList>
									) : (
										<LanguagesEmptyState>
											{isYou
												? "You haven't added any programming languages yet. Add them from Settings → Account to showcase your stack."
												: `${fullName} hasn't shared any programming languages yet.`}
										</LanguagesEmptyState>
									)}
								</LanguagesSection>
							</div>
						</div>

						{/* Action Buttons */}
						{!hideActionButton && (
							<>
								{isYou ? (
									<InfoButton
										leftIcon={<Edit size={18} />}
										onClick={handleEditProfile}
										children={"Edit Profile"}
										style={{ marginTop: "12px", width: "100%" }}
									/>
								) : isFriend ? (
									<DeleteButton
										onClick={handleUnfriend}
										leftIcon={<UserMinus size={18} />}
										children={"Unfriend"}
										style={{ marginTop: "12px", width: "100%" }}
									/>
								) : (
									<SaveButton
										onClick={handleAddFriend}
										leftIcon={<UserPlus size={18} />}
										children={addingFriend ? "Sending..." : "Add Friend"}
										style={{ marginTop: "12px", width: "100%" }}
										disabled={addingFriend}
									/>
								)}
							</>
						)}
					</ModalBody>
				</>
			</ModalContainer>
		</ModalOverlay>
	);
};

export default FriendProfileModal;