/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
	Container,
	Content,
	Modal,
	ModalContent,
	ModalTitle,
	SendImg,
	ModalMessage,
	ModalButton,
} from "./Friend.styled";
import sendImage from "../../assets/image/sendImage.png";
import AddFriend from "./AddFriend/AddFriend";
import AllFriends from "./AllFriends/AllFriends";
import Pending from "./Pending/Pending";
import { useSearch } from "@tanstack/react-router";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { listUsers, UserResponse } from "@/services/userAPI";
import {
	listFriends,
	sendFriendRequest,
	listAllFriendRequests,
	acceptFriendRequest,
	declineFriendRequest,
	unfriendUser,
	FriendRequest,
	deleteFriendRequest,
	FriendUser,
} from "@/services/friendAPI";
import {
	listSentInvitationGr,
	listReceivedInvitationGr,
	acceptGroupInvitation,
	declineGroupInvitation,
	deleteGroupInvitation,
} from "@/services/userGroupAPI";
import { showGlobalAlert } from "@/components/custom/AlertCustom/Alert";
import ConfirmModal from "@/components/custom/ConfirmModal/ConfirmModal";
import { toast } from "sonner";
import FriendProfileModal from "./AllFriends/FriendProfileModal/FriendProfileModal";
import { detailUser } from "@/services/userAPI";
import { UserLanguage } from "@/services/auth/auth.type";

interface PendingFriend {
	id: string;
	name: string;
	handle: string;
	avatar?: string;
	direction: "received" | "sent";
	userLanguages?: UserLanguage[];
	userId?: string;
	raw?: FriendRequest;
}



const Friend: React.FC = () => {
	const search = useSearch({ from: "/chat/friend" });
	const activeTab = (search.tab as string) || "add-friend";

	const currentUserProfile = useSelector(
		(state: RootState) => state.user.profile,
	);
	const currentUserId = currentUserProfile?.id || "";

	const [searchAdd, setSearchAdd] = useState("");
	const [searchAll, setSearchAll] = useState("");
	const [searchPending, setSearchPending] = useState("");

	const [isLoadingUsers, setIsLoadingUsers] = useState(false);
	const [isSendingRequest, setIsSendingRequest] = useState(false);
	const [isUserSelectedFromList, setIsUserSelectedFromList] = useState(false);

	const [searchResults, setSearchResults] = useState<any[]>([]);
	const [selectedUser, setSelectedUser] = useState<any | null>(null);
	const [showModal, setShowModal] = useState(false);
	const [modalType, setModalType] = useState<"success" | "error">("success");
	const [modalMessage, setModalMessage] = useState("");
	const [activeMenu, setActiveMenu] = useState<string | null>(null);

	const [currentPage, setCurrentPage] = useState(1);
	const friendsPerPage = 18;
	const SEARCH_DEBOUNCE_MS = 400;
	const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
	const [selectedUserForProfile, setSelectedUserForProfile] = useState<FriendUser | null>(null);

	const [isUnfriendModalOpen, setIsUnfriendModalOpen] = useState(false);
	const [unfriendTarget, setUnfriendTarget] = useState<{
		id: string;
		name: string;
	} | null>(null);
	const [isUnfriendLoading, setIsUnfriendLoading] = useState(false);

	const [allFriends, setAllFriends] = useState<FriendUser[]>([]);
	const [pendingFriendRequests, setPendingFriendRequests] = useState<
		PendingFriend[]
	>([]);
	const [pendingGroupInvites, setPendingGroupInvites] = useState<any[]>([]);
	const [isLoadingPending, setIsLoadingPending] = useState(false);

	const handleViewFriendProfile = async (pendingFriend: PendingFriend) => {
		// Try to get userId from pendingFriend first, then from raw data
		let userId = pendingFriend.userId;

		if (!userId && pendingFriend.raw) {
			const isReceived = pendingFriend.direction === "received";
			const targetUser = isReceived ? pendingFriend.raw.fromUser : pendingFriend.raw.toUser;
			userId = targetUser?.id;
		}

		if (!userId) {
			console.error('Cannot find user ID');
			return;
		}

		try {
			// Use detailUser from userAPI instead of raw get call
			const profileResponse = await detailUser(userId);
			const fullProfile = profileResponse?.data || profileResponse;

			const friendUser: FriendUser = {
				id: fullProfile.id || userId,
				name: `${fullProfile.firstName ?? ""} ${fullProfile.lastName ?? ""}`.trim() ||
					fullProfile.username ||
					pendingFriend.name,
				username: fullProfile.username || pendingFriend.handle.replace('@', ''),
				email: fullProfile.email || '',
				avatar: fullProfile.avatarUrl || pendingFriend.avatar,
				avatarUrl: fullProfile.avatarUrl || null,
				firstName: fullProfile.firstName || '',
				lastName: fullProfile.lastName || '',
				createdAt: fullProfile.createdAt ? new Date(fullProfile.createdAt).toISOString() : new Date().toISOString(),
				emailVerified: fullProfile.emailVerified || false,
				isAdmin: fullProfile.isAdmin || false,
				userLanguages: fullProfile.userLanguages || [],
				isActive: fullProfile.isActive || false,
			};

			console.log('🔍 Full Friend Profile with languages:', friendUser);
			setSelectedUserForProfile(friendUser);
			setIsProfileModalOpen(true);
		} catch (error) {
			console.error('Failed to fetch user profile:', error);

			// Fallback: try to use userLanguages from pendingFriend if available
			const friendUser: FriendUser = {
				id: userId,
				name: pendingFriend.name,
				username: pendingFriend.handle.replace('@', ''),
				email: '',
				avatar: pendingFriend.avatar,
				avatarUrl: pendingFriend.avatar || null,
				firstName: '',
				lastName: '',
				createdAt: new Date().toISOString(),
				emailVerified: false,
				isActive: false,
				userLanguages: pendingFriend.userLanguages || [], // Use languages from pendingFriend if available
			};

			console.log('⚠️ Fallback profile (with languages from pending):', friendUser);
			setSelectedUserForProfile(friendUser);
			setIsProfileModalOpen(true);
		}
	};
	const handleCloseProfileModal = () => {
		setIsProfileModalOpen(false);
		setSelectedUserForProfile(null);
	};

	useEffect(() => {
		const refetchCurrentTab = async () => {
			if (activeTab === "all") {
				await fetchFriendsData();
			} else if (activeTab === "pending") {
				setIsLoadingPending(true);
				try {
					const [friendRequestsResp, sentGroupResp, receivedGroupResp] =
						await Promise.allSettled([
							listAllFriendRequests(1, 100),
							listSentInvitationGr(),
							listReceivedInvitationGr(),
						]);

					// Friend requests
					const allFriendRequests: PendingFriend[] = [];

					if (
						friendRequestsResp.status === "fulfilled" &&
						friendRequestsResp.value?.data
					) {
						const requestsData = Array.isArray(friendRequestsResp.value.data)
							? friendRequestsResp.value.data
							: [];

						requestsData.forEach((r: FriendRequest) => {
							const isReceived = r.toUserId === currentUserId;
							const isSent = r.fromUserId === currentUserId;

							if (isReceived) {
								const senderUser = r.fromUser;
								allFriendRequests.push({
									id: r.id,
									name:
										`${senderUser?.firstName ?? ""} ${senderUser?.lastName ?? ""}`.trim() ||
										senderUser?.username ||
										"User",
									handle: senderUser?.username ? `@${senderUser.username}` : "",
									avatar: senderUser?.avatarUrl || "",
									direction: "received",
									raw: r,
								});
							} else if (isSent) {
								const targetUser = r.toUser;
								allFriendRequests.push({
									id: r.id,
									name:
										`${targetUser?.firstName ?? ""} ${targetUser?.lastName ?? ""}`.trim() ||
										targetUser?.username ||
										"User",
									handle: targetUser?.username ? `@${targetUser.username}` : "",
									avatar: targetUser?.avatarUrl || "",
									direction: "sent",
									raw: r,
								});
							}
						});
					}

					setPendingFriendRequests(allFriendRequests);

					// Group invites
					const allGroupInvites: any[] = [];

					if (
						sentGroupResp.status === "fulfilled" &&
						sentGroupResp.value?.data
					) {
						const sentGroupData = Array.isArray(sentGroupResp.value.data)
							? sentGroupResp.value.data
							: [];

						const sentInvites = sentGroupData.map((inv: any) => {
							let recipientName = "";

							if (inv.toUser) {
								const firstName = inv.toUser.firstName?.trim() || "";
								const lastName = inv.toUser.lastName?.trim() || "";
								recipientName = `${firstName} ${lastName}`.trim();

								if (!recipientName) {
									recipientName =
										inv.toUser.username || inv.toUser.email || "Unknown User";
								}
							}

							return {
								id: inv.id,
								groupId: inv.groupId,
								groupAvatar: inv?.group?.avatar,
								groupName: inv?.group?.name ?? "Group",
								toUserName: recipientName,
								direction: "sent" as const,
								raw: inv,
							};
						});
						allGroupInvites.push(...sentInvites);
					}

					if (
						receivedGroupResp.status === "fulfilled" &&
						receivedGroupResp.value?.data
					) {
						const receivedGroupData = Array.isArray(
							receivedGroupResp.value.data,
						)
							? receivedGroupResp.value.data
							: [];

						const receivedInvites = receivedGroupData.map((inv: any) => {
							const inviter =
								`${inv.fromUser?.firstName ?? ""} ${inv.fromUser?.lastName ?? ""}`.trim() ||
								"";
							return {
								id: inv.id,
								groupId: inv.groupId ?? inv.roomId ?? inv.targetId,
								groupAvatar: inv?.group?.avatar ?? inv?.groupAvatar,
								groupName: inv?.group?.name ?? inv?.groupName ?? "Group",
								inviterName:
									inviter ||
									(inv.addedBy?.username ? `@${inv.addedBy.username}` : ""),
								inviterAvatar: inv.addedBy?.avatarUrl || "",
								direction: "received" as const,
								raw: inv,
							};
						});
						allGroupInvites.push(...receivedInvites);
					}

					setPendingGroupInvites(allGroupInvites);
				} catch (err) {
					console.error("Failed to fetch pending invites", err);
				} finally {
					setIsLoadingPending(false);
				}
			}
		};

		refetchCurrentTab();
	}, [activeTab]);

	const fetchFriendsData = async () => {
		setIsLoadingUsers(true);
		try {
			const response = await listFriends(1, 100);
			const friends = response?.data ?? [];
			console.log("Friends API Response:", friends);
			setAllFriends(friends);
		} catch (err) {
			console.error("Failed to fetch friends", err);
			showGlobalAlert({
				type: "error",
				message: "Failed to load friends list",
			});
		} finally {
			setIsLoadingUsers(false);
		}
	};

	useEffect(() => {
		fetchFriendsData();
	}, []);

	useEffect(() => {
		const fetchPendings = async () => {
			setIsLoadingPending(true);
			try {
				const [friendRequestsResp, sentGroupResp, receivedGroupResp] =
					await Promise.allSettled([
						listAllFriendRequests(1, 100),
						listSentInvitationGr(),
						listReceivedInvitationGr(),
					]);

				const allFriendRequests: PendingFriend[] = [];

				if (
					friendRequestsResp.status === "fulfilled" &&
					friendRequestsResp.value?.data
				) {
					const requestsData = Array.isArray(friendRequestsResp.value.data)
						? friendRequestsResp.value.data
						: [];

					requestsData.forEach((r: FriendRequest) => {
						const isReceived = r.toUserId === currentUserId;
						const isSent = r.fromUserId === currentUserId;

						if (isReceived) {
							const senderUser = r.fromUser;
							allFriendRequests.push({
								id: r.id,
								name:
									`${senderUser?.firstName ?? ""} ${senderUser?.lastName ?? ""}`.trim() ||
									senderUser?.username ||
									"User",
								handle: senderUser?.username ? `@${senderUser.username}` : "",
								avatar: senderUser?.avatarUrl || "",
								direction: "received",
								raw: r,
							});
						} else if (isSent) {
							const targetUser = r.toUser;
							allFriendRequests.push({
								id: r.id,
								name:
									`${targetUser?.firstName ?? ""} ${targetUser?.lastName ?? ""}`.trim() ||
									targetUser?.username ||
									"User",
								handle: targetUser?.username ? `@${targetUser.username}` : "",
								avatar: targetUser?.avatarUrl || "",
								direction: "sent",
								raw: r,
							});
						}
					});
				}

				setPendingFriendRequests(allFriendRequests);
				console.log("Pending friend requests:", allFriendRequests);

				const allGroupInvites: any[] = [];

				if (sentGroupResp.status === "fulfilled" && sentGroupResp.value?.data) {
					const sentGroupData = Array.isArray(sentGroupResp.value.data)
						? sentGroupResp.value.data
						: [];

					const sentInvites = sentGroupData.map((inv: any) => {
						let recipientName = "";

						if (inv.toUser) {
							const firstName = inv.toUser.firstName?.trim() || "";
							const lastName = inv.toUser.lastName?.trim() || "";
							recipientName = `${firstName} ${lastName}`.trim();

							if (!recipientName) {
								recipientName =
									inv.toUser.username || inv.toUser.email || "Unknown User";
							}
						}

						return {
							id: inv.id,
							groupId: inv.groupId,
							groupAvatar: inv?.group?.avatar,
							groupName: inv?.group?.name ?? "Group",
							toUserName: recipientName,
							direction: "sent" as const,
							raw: inv,
						};
					});
					allGroupInvites.push(...sentInvites);
				}

				if (
					receivedGroupResp.status === "fulfilled" &&
					receivedGroupResp.value?.data
				) {
					const receivedGroupData = Array.isArray(receivedGroupResp.value.data)
						? receivedGroupResp.value.data
						: [];

					const receivedInvites = receivedGroupData.map((inv: any) => {
						const inviter =
							`${inv.fromUser?.firstName ?? ""} ${inv.fromUser?.lastName ?? ""}`.trim() ||
							"";
						return {
							id: inv.id,
							groupId: inv.groupId ?? inv.roomId ?? inv.targetId,
							groupAvatar: inv?.group?.avatar ?? inv?.groupAvatar,
							groupName: inv?.group?.name ?? inv?.groupName ?? "Group",
							inviterName:
								inviter ||
								(inv.addedBy?.username ? `@${inv.addedBy.username}` : ""),
							inviterAvatar: inv.addedBy?.avatarUrl || "",
							direction: "received" as const,
							raw: inv,
						};
					});
					allGroupInvites.push(...receivedInvites);
				}

				setPendingGroupInvites(allGroupInvites);
				console.log("Pending group invites:", allGroupInvites);
			} catch (err) {
				console.error("Failed to fetch pending invites", err);
			} finally {
				setIsLoadingPending(false);
			}
		};

		fetchPendings();
	}, [currentUserId]);

	const handleSearchAdd = (query: string) => {
		setSearchAdd(query);
		if (selectedUser && selectedUser.name !== query) {
			setSelectedUser(null);
			setIsUserSelectedFromList(false);
		}
		if (!query.trim()) {
			setSearchResults([]);
		}
	};

	useEffect(() => {
		// Only perform debounced search in add-friend tab
		if (activeTab !== "add-friend") return;
		const trimmed = searchAdd.trim();
		if (!trimmed) return; // nothing to search

		const timer = setTimeout(() => {
			setIsLoadingUsers(true);
			listUsers(1, 50, trimmed)
				.then((response) => {
					const usersArray = Array.isArray(response?.data) ? response.data : [];
					const mapped = usersArray
						.filter((user: UserResponse) => {
							if (!user) return false;
							if (String(user.id) === String(currentUserId)) return false; // exclude self
							return true;
						})
						.map((user: UserResponse) => ({
							id: user.id,
							name:
								`${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
								user.username ||
								"User",
							handle: user.username ? `@${user.username}` : "",
							avatar:
								user.avatarUrl ||
								"https://images.unsplash.com/photo-1494790108755-2616b332c-c3?w=100&h=100&fit=crop&crop=face",
							mutualFriends: 0,
							raw: user,
						}));
					setSearchResults(mapped);
				})
				.catch((err) => {
					console.error("User search failed", err);
					setSearchResults([]);
				})
				.finally(() => setIsLoadingUsers(false));
		}, SEARCH_DEBOUNCE_MS);

		return () => clearTimeout(timer);
	}, [searchAdd, activeTab, currentUserId]);

	const handleSelectUser = (user: any) => {
		setSelectedUser(user);
		setSearchAdd(user.name);
		setSearchResults([]);
		setIsUserSelectedFromList(true);
	};

	const handleSendRequest = async () => {
		if (!selectedUser || isSendingRequest) return;

		if (String(selectedUser.id) === String(currentUserId)) {
			setModalType("error");
			setModalMessage("You cannot send a friend request to yourself!");
			setShowModal(true);
			return;
		}

		setIsSendingRequest(true);
		try {
			const response = await sendFriendRequest({
				toUserId: selectedUser.id,
				message: "Hi! I'd like to be friends.",
			});

			console.log("Send request response:", response);

			setModalType("success");
			setModalMessage(
				response?.message ||
				`Your friend request to ${selectedUser.name} was sent!`,
			);
			setShowModal(true);

			const friendRequest = response.data;

			if (friendRequest.data?.id) {
				const newRequest: PendingFriend = {
					id: friendRequest.data.id,
					name: selectedUser.name,
					handle: selectedUser.handle,
					avatar: selectedUser.avatar,
					direction: "sent",
					raw: friendRequest.data,
				};

				setPendingFriendRequests((prev) => [...prev, newRequest]);
			}

			setSearchAdd("");
			setSearchResults([]);
			setSelectedUser(null);
			setIsUserSelectedFromList(false);
		} catch (error: any) {
			console.error("Send friend request error:", error);

			let errorMessage = "Failed to send friend request";

			if (error?.response) {
				const status = error.response.status;
				if (status === 400) {
					errorMessage =
						error.response.data?.message ||
						"This user may already be your friend or have a pending request.";
				} else if (status === 404) {
					errorMessage = "User not found";
				} else if (status === 409) {
					errorMessage =
						error.response.data?.message ||
						"Already had pending request before";
				} else {
					errorMessage =
						error.response.data?.message || `Server Error (${status})`;
				}
			} else if (error?.request) {
				errorMessage = "No response from server. Please check your connection.";
			} else {
				errorMessage = error.message || errorMessage;
			}

			setModalType("error");
			setModalMessage(errorMessage);
			setShowModal(true);
		} finally {
			setIsSendingRequest(false);
		}
	};

	const handleCloseModal = () => {
		setShowModal(false);
		if (modalType === "success") {
			setSelectedUser(null);
			setIsUserSelectedFromList(false);
			setSearchAdd("");
		}
	};

	const handleAcceptFriend = async (requestId: string) => {
		try {
			await acceptFriendRequest(requestId);

			setPendingFriendRequests((prev) =>
				prev.filter((r) => r.id !== requestId),
			);

			showGlobalAlert({ type: "success", message: "Friend request accepted!" });

			window.dispatchEvent(new CustomEvent("friendListUpdated"));

			await fetchFriendsData();
		} catch (err) {
			showGlobalAlert({ type: "error", message: "Failed to accept request!" });
			console.error("accept friend failed", err);
		}
	};

	const handleDeclineFriend = async (requestId: string) => {
		try {
			await declineFriendRequest(requestId);

			setPendingFriendRequests((prev) =>
				prev.filter((r) => r.id !== requestId),
			);

			showGlobalAlert({ type: "success", message: "Friend request declined!" });
		} catch (err) {
			showGlobalAlert({ type: "error", message: "Failed to decline request!" });
			console.error("decline friend failed", err);
		}
	};

	const handleCancelFriend = async (requestId: string) => {
		try {
			await deleteFriendRequest(requestId);

			setPendingFriendRequests((prev) =>
				prev.filter((r) => r.id !== requestId),
			);

			showGlobalAlert({
				type: "success",
				message: "Friend request cancelled successfully!",
			});
		} catch (err: any) {
			console.error("Cancel friend request failed", err);

			let errorMessage = "Failed to cancel request!";
			if (err?.response?.data?.message) {
				errorMessage = err.response.data.message;
			}

			showGlobalAlert({
				type: "error",
				message: errorMessage,
			});
		}
	};

	const handleAcceptGroup = async (inviteId: string) => {
		try {
			console.log("Accepting group invitation with ID:", inviteId);

			await acceptGroupInvitation(inviteId);
			setPendingGroupInvites((prev) => prev.filter((r) => r.id !== inviteId));

			window.dispatchEvent(new Event("refreshGroups"));

			toast.success("Group invitation accepted successfully!");
		} catch (err: any) {
			console.error("Accept group invite failed", err);

			const errorMessage =
				err?.response?.data?.message || "Failed to accept group invitation";

			toast.error(errorMessage);
		}
	};

	const handleDeclineGroup = async (inviteId: string) => {
		try {
			console.log("Declining group invitation with ID:", inviteId);
			await declineGroupInvitation(inviteId);
			setPendingGroupInvites((prev) => prev.filter((r) => r.id !== inviteId));
			toast.success("Group invitation declined successfully!");
		} catch (err: any) {
			console.error("Decline group invite failed", err);

			const errorMessage =
				err?.response?.data?.message || "Failed to decline group invitation";

			toast.error(errorMessage);
		}
	};

	const handleCancelGroup = async (inviteId: string) => {
		try {
			console.log("Deleting sent group invitation with ID:", inviteId);

			await deleteGroupInvitation(inviteId);
			setPendingGroupInvites((prev) => prev.filter((r) => r.id !== inviteId));
			toast.success("Group invitation cancelled successfully!");
		} catch (err: any) {
			console.error("Cancel group invite failed", err);

			const errorMessage =
				err?.response?.data?.message || "Failed to cancel group invitation";

			toast.error(errorMessage);
		}
	};

	const handleMenuToggle = (friendId: string, e: React.MouseEvent) => {
		e.stopPropagation();
		setActiveMenu(activeMenu === friendId ? null : friendId);
	};

	const handleMenuAction = (
		action: string,
		friendName: string,
		friendId: string,
	) => {
		setActiveMenu(null);

		if (action === "Unfriend") {
			setUnfriendTarget({ id: friendId, name: friendName });
			setIsUnfriendModalOpen(true);
		} else if (action === "Yêu thích") {
			console.log(`${friendName} has been added to favorites`);
			showGlobalAlert({
				type: "success",
				message: `${friendName} has been added to favorites`,
			});
		}
	};

	const confirmUnfriendAction = async () => {
		if (!unfriendTarget || isUnfriendLoading) return;

		setIsUnfriendLoading(true);
		try {
			await unfriendUser(unfriendTarget.id);

			setAllFriends((prev) => prev.filter((f) => f.id !== unfriendTarget.id));

			showGlobalAlert({
				type: "success",
				message: `You have unfriended ${unfriendTarget.name}`,
			});

			window.dispatchEvent(new CustomEvent("friendListUpdated"));

			handleCloseUnfriendModal();
		} catch (err) {
			console.error("Unfriend failed", err);
			showGlobalAlert({
				type: "error",
				message: "Unable to unfriend. Please try again!",
			});
		} finally {
			setIsUnfriendLoading(false);
		}
	};

	const handleCloseUnfriendModal = () => {
		setIsUnfriendModalOpen(false);
		setUnfriendTarget(null);
	};

	useEffect(() => {
		const handleClickOutside = () => {
			if (activeMenu) setActiveMenu(null);
		};
		document.addEventListener("click", handleClickOutside);
		return () => document.removeEventListener("click", handleClickOutside);
	}, [activeMenu]);

	return (
		<Container>
			<Content>
				{activeTab === "add-friend" && (
					<AddFriend
						searchAdd={searchAdd}
						onSearchAdd={handleSearchAdd}
						searchResults={searchResults}
						onSelectUser={handleSelectUser}
						selectedUser={selectedUser}
						onSendRequest={handleSendRequest}
						isLoadingUsers={isLoadingUsers}
						isSendingRequest={isSendingRequest}
						isUserSelectedFromList={isUserSelectedFromList}
					/>
				)}

				{activeTab === "all" && (
					<AllFriends
						allFriends={allFriends}
						searchAll={searchAll}
						setSearchAll={setSearchAll}
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
						friendsPerPage={friendsPerPage}
						activeMenu={activeMenu}
						onMenuToggle={handleMenuToggle}
						onMenuAction={handleMenuAction}
					/>
				)}

				{activeTab === "pending" && (
					<Pending
						pendingFriendRequests={pendingFriendRequests}
						pendingGroupInvites={pendingGroupInvites}
						searchPending={searchPending}
						setSearchPending={setSearchPending}
						onAcceptFriend={handleAcceptFriend}
						onDeclineFriend={handleDeclineFriend}
						onCancelFriend={handleCancelFriend}
						onAcceptGroup={handleAcceptGroup}
						onDeclineGroup={handleDeclineGroup}
						onCancelGroup={handleCancelGroup}
						onViewFriendProfile={handleViewFriendProfile}
						isLoadingPending={isLoadingPending}
					/>
				)}
			</Content>

			{showModal && (
				<Modal>
					<ModalContent
						style={{
							borderTop:
								modalType === "error"
									? "4px solid #EF4444"
									: "4px solid #10B981",
						}}
					>
						<ModalTitle
							style={{ color: modalType === "error" ? "#EF4444" : "#10B981" }}
						>
							{modalType === "success" ? "Success!" : "Error"}
						</ModalTitle>
						{modalType === "success" && (
							<SendImg src={sendImage} alt="Send Success" />
						)}
						<ModalMessage
							style={{ color: modalType === "error" ? "#DC2626" : "#374151" }}
						>
							{modalMessage}
						</ModalMessage>
						<ModalButton
							onClick={handleCloseModal}
							style={{
								backgroundColor: modalType === "error" ? "#EF4444" : "#10B981",
								borderColor: modalType === "error" ? "#DC2626" : "#10B981",
							}}
						>
							OK
						</ModalButton>
					</ModalContent>
				</Modal>
			)}

			{isUnfriendModalOpen && unfriendTarget && (
				<ConfirmModal
					isOpen={isUnfriendModalOpen}
					title={`Confirm Unfriend ${unfriendTarget.name}`}
					message={`Are you sure you want to unfriend ${unfriendTarget.name}? This action cannot be undone.`}
					confirmText="Unfriend"
					cancelText="Cancel"
					onConfirm={confirmUnfriendAction}
					onCancel={handleCloseUnfriendModal}
					isLoading={isUnfriendLoading}
				/>
			)}
			{isProfileModalOpen && selectedUserForProfile && (
				<FriendProfileModal
					isOpen={isProfileModalOpen}
					onClose={handleCloseProfileModal}
					friend={selectedUserForProfile}
					hideActionButton={true}
				/>
			)}
		</Container>
	);
};

export default Friend;
