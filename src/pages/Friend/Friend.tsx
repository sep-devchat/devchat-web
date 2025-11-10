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
	listSentFriendRequests,
	listReceivedFriendRequests,
	updateFriendRequestStatus,
	cancelFriendRequest,
	unfriendUser,
} from "@/services/friendAPI";
import {
	listSentInvitationGr,
	listReceivedInvitationGr,
	updateInvitation,
} from "@/services/userGroupAPI";
import { showGlobalAlert } from "@/components/custom/AlertCustom/Alert";
import ConfirmModal from "@/components/custom/ConfirmModal/ConfirmModal";
import { toast } from "sonner";

const Friend: React.FC = () => {
	const search = useSearch({ from: "/chat/friend" });
	const activeTab = (search.tab as string) || "add-friend";

	// Redux current user id
	const currentUserProfile = useSelector(
		(state: RootState) => state.user.profile,
	);
	const currentUserId = currentUserProfile?.id || "";

	// --- Shared state ---
	const [searchAdd, setSearchAdd] = useState("");
	const [searchAll, setSearchAll] = useState("");
	const [searchPending, setSearchPending] = useState("");

	const [availableUsers, setAvailableUsers] = useState<UserResponse[]>([]);
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

	// --- Unfriend modal ---
	const [isUnfriendModalOpen, setIsUnfriendModalOpen] = useState(false);
	const [unfriendTarget, setUnfriendTarget] = useState<{
		id: string;
		name: string;
	} | null>(null);
	const [isUnfriendLoading, setIsUnfriendLoading] = useState(false);

	const [allFriends, setAllFriends] = useState<any[]>([]);
	const [pendingFriendRequests, setPendingFriendRequests] = useState<any[]>([]);
	const [pendingGroupInvites, setPendingGroupInvites] = useState<any[]>([]);
	const [isLoadingPending, setIsLoadingPending] = useState(false);

	// Fetch active users on mount
	useEffect(() => {
		const fetchActiveUsers = async () => {
			setIsLoadingUsers(true);
			try {
				const response = await listUsers(1, 100);
				const payload = response?.data;
				const usersArray = Array.isArray(payload) ? payload : [];

				const active = (usersArray || []).filter(
					(user: UserResponse) =>
						user?.isActive === true &&
						String(user?.id) !== String(currentUserId),
				);
				setAvailableUsers(active);
			} catch (err) {
				console.error("Failed to fetch users", err);
			} finally {
				setIsLoadingUsers(false);
			}
		};

		fetchActiveUsers();
	}, [currentUserId]);

	// Fetch friends (single unified function)
	const fetchFriendsData = async () => {
		setIsLoadingUsers(true);
		try {
			const response = await listFriends(1, 100);
			console.log("Friends API Response:", response);

			if (response && response.data) {
				const normalized = response.data.map((u: any) => ({
					id: u.id,
					name:
						`${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() ||
						u.username ||
						"User",
					firstName: u.firstName,
					lastName: u.lastName,
					handle: u.username ? `@${u.username}` : "",
					avatarUrl:
						u.avatarUrl ||
						"https://images.unsplash.com/photo-1494790108755-2616b332c-c3?w=100&h=100&fit=crop&crop=face",
					mutualFriends: 0,
				}));

				console.log("Normalized friends:", normalized);
				setAllFriends(normalized);
			}
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

	// Fetch pending friend requests + group invites
	useEffect(() => {
		const fetchPendings = async () => {
			setIsLoadingPending(true);
			try {
				const [
					sentFriendResp,
					receivedFriendResp,
					sentGroupResp,
					receivedGroupResp,
				] = await Promise.allSettled([
					listSentFriendRequests(0), // pending status = 0
					listReceivedFriendRequests(0),
					listSentInvitationGr(0),
					listReceivedInvitationGr(0),
				]);

				// --- Friend requests ---
				const allFriendRequests: any[] = [];

				if (
					sentFriendResp.status === "fulfilled" &&
					sentFriendResp.value?.data
				) {
					const sentData = Array.isArray(sentFriendResp.value.data)
						? sentFriendResp.value.data
						: [];

					const sentRequests = sentData.map((r: any) => ({
						id: r.id,
						name:
							`${r.receiver?.firstName ?? ""} ${r.receiver?.lastName ?? ""}`.trim() ||
							r.receiver?.username ||
							"User",
						handle: r.receiver?.username ? `@${r.receiver.username}` : "",
						avatar: r.receiver?.avatarUrl || "",
						direction: "sent" as const,
						raw: r,
					}));
					allFriendRequests.push(...sentRequests);
				}

				if (
					receivedFriendResp.status === "fulfilled" &&
					receivedFriendResp.value?.data
				) {
					const receivedData = Array.isArray(receivedFriendResp.value.data)
						? receivedFriendResp.value.data
						: [];

					const receivedRequests = receivedData.map((r: any) => ({
						id: r.id,
						name:
							`${r.sender?.firstName ?? ""} ${r.sender?.lastName ?? ""}`.trim() ||
							r.sender?.username ||
							"User",
						handle: r.sender?.username ? `@${r.sender.username}` : "",
						avatar: r.sender?.avatarUrl || "",
						direction: "received" as const,
						raw: r,
					}));
					allFriendRequests.push(...receivedRequests);
				}

				setPendingFriendRequests(allFriendRequests);
				console.log("Pending friend requests:", allFriendRequests);

				// --- Group invites ---
				const allGroupInvites: any[] = [];

				if (sentGroupResp.status === "fulfilled" && sentGroupResp.value?.data) {
					const sentGroupData = Array.isArray(sentGroupResp.value.data)
						? sentGroupResp.value.data
						: [];

					// for sent invites show target group info (you sent)
					const sentInvites = sentGroupData.map((inv: any) => {
						const inviter =
							`${inv.addedBy?.firstName ?? ""} ${inv.addedBy?.lastName ?? ""}`.trim() ||
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

					// for received invites show inviter info (someone invited you)
					const receivedInvites = receivedGroupData.map((inv: any) => {
						const inviter =
							`${inv.addedBy?.firstName ?? ""} ${inv.addedBy?.lastName ?? ""}`.trim() ||
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

		if (query.trim()) {
			const searchTerm = query.toLowerCase();

			const filtered = (availableUsers || [])
				.filter((user) => {
					if (!user) return false;

					const first = (user.firstName ?? "").toString();
					const last = (user.lastName ?? "").toString();
					const fullName = `${first} ${last}`.trim().toLowerCase();

					const username = (user.username ?? "").toString().toLowerCase();
					const email = (user.email ?? "").toString().toLowerCase();

					return (
						fullName.includes(searchTerm) ||
						username.includes(searchTerm) ||
						email.includes(searchTerm)
					);
				})
				.map((user) => ({
					id: user.id,
					name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
					handle: user.username ? `@${user.username}` : "",
					avatar:
						user.avatarUrl ||
						"https://images.unsplash.com/photo-1494790108755-2616b332c-c3?w=100&h=100&fit=crop&crop=face",
					mutualFriends: 0,
					raw: user,
				}));

			setSearchResults(filtered);
		} else {
			setSearchResults([]);
		}
	};

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
			await sendFriendRequest({
				receiverId: selectedUser.id,
				message: "Hi! I'd like to be friends.",
			});

			setModalType("success");
			setModalMessage(`Your friend request to ${selectedUser.name} was sent!`);
			setShowModal(true);

			setPendingFriendRequests((prev) => [
				...prev,
				{
					id: String(selectedUser.id),
					name: selectedUser.name,
					handle: selectedUser.handle,
					avatar: selectedUser.avatar,
					direction: "sent",
				},
			]);

			setSearchAdd("");
			setSearchResults([]);
			setSelectedUser(null);
			setIsUserSelectedFromList(false);
		} catch (error: any) {
			let errorMessage = "Failed to send friend request";

			if (error?.response) {
				const status = error.response.status;
				if (status === 400) {
					errorMessage =
						error.response.data?.message ||
						"Invalid request. This user may already be your friend or have a pending request.";
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
			await updateFriendRequestStatus(requestId, { status: 1 });

			setPendingFriendRequests((prev) =>
				prev.filter((r) => r.id !== requestId),
			);

			showGlobalAlert({ type: "success", message: "Friend request accepted!" });

			window.dispatchEvent(new CustomEvent("friendListUpdated"));

			// refresh friends
			await fetchFriendsData();
		} catch (err) {
			showGlobalAlert({ type: "error", message: "Failed to accept request!" });
			console.error("accept friend failed", err);
		}
	};

	const handleDeclineFriend = async (requestId: string) => {
		try {
			await updateFriendRequestStatus(requestId, { status: 2 });

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
			await cancelFriendRequest(requestId);

			setPendingFriendRequests((prev) =>
				prev.filter((r) => r.id !== requestId),
			);

			showGlobalAlert({
				type: "success",
				message: "Friend request cancelled!",
			});
		} catch (err) {
			showGlobalAlert({ type: "error", message: "Failed to cancel request!" });
			console.error("cancel friend request failed", err);
		}
	};

	// Group invite actions
	const handleAcceptGroup = async (inviteId: string) => {
		try {
			// Remove locally first for snappy UI
			setPendingGroupInvites((prev) => prev.filter((r) => r.id !== inviteId));

			// tìm item để lấy groupId
			const item = pendingGroupInvites.find((r) => r.id === inviteId);
			const raw = item?.raw;
			const groupId =
				item?.groupId ??
				raw?.groupId ??
				raw?.roomId ??
				raw?.targetId ??
				inviteId;

			const acceptRequest = { userIdOrEmail: currentUserId, status: 1 };
			await updateInvitation(groupId, acceptRequest);

			toast.success("Accepted successfully!");

			// optional: refresh friends / groups if needed
		} catch (err) {
			toast.error(`Accept failed: ${err}`);
			console.error("Accept group invite failed", err);
		}
	};

	const handleDeclineGroup = async (inviteId: string) => {
		try {
			// Remove locally first
			setPendingGroupInvites((prev) => prev.filter((r) => r.id !== inviteId));

			const item = pendingGroupInvites.find((r) => r.id === inviteId);
			const raw = item?.raw;
			const groupId =
				item?.groupId ??
				raw?.groupId ??
				raw?.roomId ??
				raw?.targetId ??
				inviteId;

			const declineRequest = { userIdOrEmail: currentUserId, status: 2 };
			await updateInvitation(groupId, declineRequest);
			toast.success("Declined successfully!");
		} catch (err) {
			toast.error(`Decline failed: ${err}`);
			console.error("Decline group invite failed", err);
		}
	};

	// Cancel a group invite that the current user SENT
	const handleCancelGroup = async (inviteId: string) => {
		try {
			// find invite
			const item = pendingGroupInvites.find((r) => r.id === inviteId);
			const raw = item?.raw;
			const groupId =
				item?.groupId ??
				raw?.groupId ??
				raw?.roomId ??
				raw?.targetId ??
				inviteId;

			// Implementation detail: depends on API; here we try to set a 'cancel' status = 3
			// If your API provides dedicated cancel endpoint, replace with that.
			const cancelRequest = { userIdOrEmail: currentUserId, status: 3 };
			await updateInvitation(groupId, cancelRequest);

			// remove locally
			setPendingGroupInvites((prev) => prev.filter((r) => r.id !== inviteId));
			toast.success("Cancelled invite successfully!");
		} catch (err) {
			toast.error(`Cancel failed: ${err}`);
			console.error("Cancel group invite failed", err);
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
		</Container>
	);
};

export default Friend;
