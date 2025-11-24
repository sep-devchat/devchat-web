/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
	X,
	Mail,
	Calendar,
	Shield,
	AlertTriangle,
	Ban,
	UserMinus,
	UserPlus,
	MoreVertical,
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
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
	Avatar,
	AvatarSection,
	Button,
	ButtonGroup,
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
	RadioInput,
	ReasonDesc,
	ReasonOption,
	ReasonSection,
	ReasonText,
	ReasonTitle,
	ReportDescription,
	ReportHeader,
	ReportIcon,
	ReportModalContent,
	ReportTitle,
	SectionLabel,
	StatusBadge,
	TextArea,
	Username,
	UserName,
} from "./FriendProfileModal.styled";
import { listFriends, sendFriendRequest } from "@/services/friendAPI";
import { InfoButton } from "@/components/custom/ActionButton/InfoButton";

interface Group {
	id: string;
	name: string;
}

interface FriendProfileModalProps {
	isOpen: boolean;
	onClose: () => void;
	friend: {
		id: string;
		username: string;
		email: string;
		firstName: string | null;
		lastName: string | null;
		name: string;
		avatar: string;
		avatarUrl: string | null;
		isActive: boolean;
		emailVerified: boolean;
		createdAt: string;
		lastLogin: string | null;
		isAdmin: boolean;
	} | null;
	onUnfriend?: (id: string, name: string) => void;
	onBlock?: (id: string, name: string) => void;
	groupId?: string;
}

const FriendProfileModal: React.FC<FriendProfileModalProps> = ({
	isOpen,
	onClose,
	friend,
	onUnfriend,
	onBlock,
	groupId,
}) => {
	const [groups, setGroups] = useState<Group[]>([]);
	const [loadingGroups, setLoadingGroups] = useState(false);
	const [showReportModal, setShowReportModal] = useState(false);
	const [selectedReason, setSelectedReason] = useState("");
	const [reportDetails, setReportDetails] = useState("");
	const [menuOpen, setMenuOpen] = useState(false);

	// New: isFriend state (true if friend is in my friend list)
	const [isFriend, setIsFriend] = useState(false);
	const [addingFriend, setAddingFriend] = useState(false);

	useEffect(() => {
		if (!isOpen) {
			setMenuOpen(false);
			setShowReportModal(false);
			setSelectedReason("");
			setReportDetails("");
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

	// NEW: fetch friend list and check if `friend.id` exists
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
			// default to false on error
			setIsFriend(false);
		}
	};

	useEffect(() => {
		if (isOpen && friend) {
			if (groupId) {
				checkIsFriend().catch((e) => console.error(e));
			} else {
				checkIsFriend().catch((e) => console.error(e));
			}
		}

		console.log("friend", friend);
	}, [isOpen, friend?.id, groupId]);

	useEffect(() => {
		if (menuOpen && groups.length === 0) {
			fetchGroups().catch((e) => console.error(e));
		}
	}, [menuOpen, groups.length]);

	const handleInviteToGroup = async (groupId: string, groupName: string) => {
		if (!friend) return;

		try {
			await inviteToGroup({
				toUserId: friend.id,
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

	const handleBlock = () => {
		if (friend && onBlock) {
			onBlock(friend.id, fullName);
			setMenuOpen(false);
		}
	};

	const handleReport = () => {
		setShowReportModal(true);
		setMenuOpen(false);
	};

	const handleSubmitReport = () => {
		if (!selectedReason) {
			toast.error("Please select a reason for reporting");
			return;
		}

		// TODO: Call API to submit report
		toast.success(`Report submitted successfully for ${fullName}`);
		setShowReportModal(false);
		setSelectedReason("");
		setReportDetails("");
		onClose();
	};

	const handleBackToProfile = () => {
		setShowReportModal(false);
		setSelectedReason("");
		setReportDetails("");
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

	const fullName =
		`${friend.firstName || ""} ${friend.lastName || ""}`.trim() ||
		friend.username;

	const reportReasons = [
		{
			value: "spam",
			title: "Spam or Scam",
			description: "Sending unwanted messages or suspicious links",
		},
		{
			value: "harassment",
			title: "Harassment or Bullying",
			description: "Threatening, intimidating, or abusive behavior",
		},
		{
			value: "inappropriate",
			title: "Inappropriate Content",
			description: "Sharing offensive or explicit material",
		},
		{
			value: "impersonation",
			title: "Impersonation",
			description: "Pretending to be someone else",
		},
		{
			value: "security",
			title: "Security Concern",
			description: "Hacking attempts or suspicious activity",
		},
		{
			value: "other",
			title: "Other",
			description: "Something else that violates our guidelines",
		},
	];

	// New: Add friend flow with feedback + state update
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

	return (
		<ModalOverlay onClick={onClose}>
			<ModalContainer onClick={(e) => e.stopPropagation()}>
				{!showReportModal ? (
					<>
						<ModalHeader>
							<HeaderActions>
								{isFriend ? (
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

											<DropdownMenuSeparator />

											<DropdownMenuItem
												onClick={(e) => {
													e.stopPropagation();
													handleBlock();
												}}
											>
												<Ban size={16} />
												<span style={{ marginLeft: 8 }}>Block</span>
											</DropdownMenuItem>

											<DropdownMenuItem
												onClick={(e) => {
													e.stopPropagation();
													handleReport();
												}}
											>
												<AlertTriangle size={16} />
												<span style={{ marginLeft: 8 }}>Report</span>
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								) : null}

								<IconButton onClick={onClose} icon={X} iconSize={20} />
							</HeaderActions>
						</ModalHeader>

						<ModalBody>
							<AvatarSection style={{ marginTop: "24px" }}>
								<Avatar
									src={
										(friend.avatar ?? friend.avatarUrl ?? undefined) as
											| string
											| undefined
									}
									alt={friend.name}
								/>
								<UserName>{friend.name}</UserName>
								<Username>@{friend.username}</Username>

								{/* StatusBadge now shows Friend / Not Friend based on isFriend (no longer uses active) */}
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
							</AvatarSection>

							<InfoSection>
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
								)}
							</InfoSection>

							{/* Show Unfriend if isFriend, otherwise Add Friend - with feedback */}
							{isFriend ? (
								<DeleteButton
									onClick={handleUnfriend}
									leftIcon={<UserMinus size={18} />}
									children={"Unfriend"}
									style={{ marginTop: "12px", width: "100%" }}
								/>
							) : (
								<InfoButton
									onClick={handleAddFriend}
									leftIcon={<UserPlus size={18} />}
									children={addingFriend ? "Sending..." : "Add Friend"}
									style={{ marginTop: "12px", width: "100%" }}
									disabled={addingFriend}
								/>
							)}
						</ModalBody>
					</>
				) : (
					<>
						<ModalHeader>
							<HeaderActions>
								<IconButton onClick={onClose} icon={X} iconSize={20} />
							</HeaderActions>
						</ModalHeader>

						<ReportModalContent>
							<ReportHeader>
								<ReportIcon>
									<AlertTriangle size={24} />
								</ReportIcon>
								<div>
									<ReportTitle>Report User</ReportTitle>
								</div>
							</ReportHeader>
							<ReportDescription>
								Help us understand what's happening with{" "}
								<strong>{fullName}</strong>. Your report is anonymous and will
								be reviewed by our team.
							</ReportDescription>

							<ReasonSection>
								<SectionLabel>What's the issue?</SectionLabel>
								{reportReasons.map((reason) => (
									<ReasonOption key={reason.value}>
										<RadioInput
											type="radio"
											name="reason"
											value={reason.value}
											checked={selectedReason === reason.value}
											onChange={(e) => setSelectedReason(e.target.value)}
										/>
										<ReasonText>
											<ReasonTitle>{reason.title}</ReasonTitle>
											<ReasonDesc>{reason.description}</ReasonDesc>
										</ReasonText>
									</ReasonOption>
								))}
							</ReasonSection>

							<ReasonSection>
								<SectionLabel>Additional details (optional)</SectionLabel>
								<TextArea
									placeholder="Provide more context about this issue to help us review it faster..."
									value={reportDetails}
									onChange={(e) => setReportDetails(e.target.value)}
								/>
							</ReasonSection>

							<ButtonGroup>
								<Button $variant="secondary" onClick={handleBackToProfile}>
									Back
								</Button>
								<Button $variant="primary" onClick={handleSubmitReport}>
									Submit Report
								</Button>
							</ButtonGroup>
						</ReportModalContent>
					</>
				)}
			</ModalContainer>
		</ModalOverlay>
	);
};

export default FriendProfileModal;
