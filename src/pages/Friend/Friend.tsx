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
	listInvitationFriend,
	updateFriendRequestStatus,
} from "@/services/friendAPI";
import {} from "@/services/groupAPI";
import { listInvitationGr, updateInvitation } from "@/services/userGroupAPI";
import { showGlobalAlert } from "@/components/custom/AlertCustom/Alert";
import { toast } from "sonner";

const Friend: React.FC = () => {
	const search = useSearch({ from: "/chat/friend" });
	const activeTab = (search.tab as string) || "add-friend";

	// redux current user id
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

	const [allFriends, setAllFriends] = useState<any[]>([]);
	// split pending into two lists
	const [pendingFriendRequests, setPendingFriendRequests] = useState<any[]>([]);
	const [pendingGroupInvites, setPendingGroupInvites] = useState<any[]>([]);
	const [isLoadingPending, setIsLoadingPending] = useState(false);

	const extractUserIdFromInvitation = (raw: any): string | null => {
		if (!raw) return null;
		// thử nhiều tên trường phổ biến
		return (
			raw.fromId ??
			raw.requesterId ??
			raw.userId ??
			raw.senderId ??
			raw.inviterId ??
			raw.user?.id ??
			raw.requester?.id ??
			raw.from?.id ??
			raw.inviter?.id ??
			null
		);
	};

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

	// Fetch friends
	useEffect(() => {
		const fetchFriends = async () => {
			setIsLoadingUsers(true);
			try {
				const response = await listFriends(1, 100);
				if (response && response.data) {
					// normalize shape expected by AllFriends
					const normalized = response.data.map((u: any) => ({
						id: u.id,
						name: `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim(),
						handle: u.username ? `@${u.username}` : "",
						avatar: u.avatarUrl || "",
						mutualFriends: u.mutualFriends ?? 0,
					}));
					setAllFriends(normalized);
				}
			} catch (err) {
				console.error("Failed to fetch friends", err);
			} finally {
				setIsLoadingUsers(false);
			}
		};

		fetchFriends();
	}, []);

	// Fetch pending friend requests + group invites
	useEffect(() => {
		const fetchPendings = async () => {
			setIsLoadingPending(true);
			try {
				const [friendResp, groupResp] = await Promise.allSettled([
					listInvitationFriend() ?? Promise.resolve({ data: [] }),
					listInvitationGr() ?? Promise.resolve({ data: [] }),
				]);

				// normalize friend invites
				if (friendResp.status === "fulfilled" && friendResp.value?.data) {
					const normalizedFriend = friendResp.value.data.map((r: any) => {
						// try common shapes: r.from*, r.requester*, or r.user*
						const inviterName =
							(r.fromFirstName && `${r.fromFirstName} ${r.fromLastName}`) ||
							(r.requesterFirstName &&
								`${r.requesterFirstName} ${r.requesterLastName}`) ||
							r.name ||
							"";
						const inviterUsername =
							r.fromUsername || r.requesterUsername || r.username || "";
						return {
							id: r.id,
							name: inviterName.trim() || inviterUsername || r.email || "User",
							handle: inviterUsername ? `@${inviterUsername}` : "",
							avatar: r.fromAvatarUrl || r.avatarUrl || "",
							direction:
								r.type === "sent" || r.direction === "sent"
									? "sent"
									: "received", // best effort
							raw: r,
						};
					});
					setPendingFriendRequests(normalizedFriend);
				}

				// normalize group invites
				if (groupResp.status === "fulfilled" && groupResp.value?.data) {
					const normalizedGroup = groupResp.value.data.map((inv: any) => {
						const inviter =
							`${inv.addedBy.firstName ?? ""} ${inv.addedBy.lastName ?? ""}`.trim() ||
							"";
						return {
							id: inv.id,
							groupId: inv.groupId,
							groupAvatar: inv?.group?.avatar,
							groupName: inv.group.name ?? "Group",
							inviterName: inviter || "",
							inviterAvatar: inv.addedBy.avatarUrl || "",
							// direction:
							// 	inv.type === "sent" || inv.direction === "sent"
							// 		? "sent"
							// 		: "received",
							// raw: inv,
						};
					});
					setPendingGroupInvites(normalizedGroup);
				}
			} catch (err) {
				console.error("Failed to fetch pending invites", err);
			} finally {
				setIsLoadingPending(false);
			}
		};

		fetchPendings();
	}, [currentUserId]);

	// --- Actions ---
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

			// add to pendingFriendRequests as 'sent' so UI reflects change immediately
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

	// Friend pending actions
	const handleAcceptFriend = async (requestId: string) => {
		try {
			setPendingFriendRequests((prev) =>
				prev.filter((r) => r.id !== requestId),
			);

			// tìm raw object tương ứng để lấy userId
			const item = pendingFriendRequests.find((r) => r.id === requestId);
			const raw = item?.raw;
			const userId = extractUserIdFromInvitation(raw) ?? requestId;

			const acceptRequest = { status: 1 };
			const res = await updateFriendRequestStatus(userId, acceptRequest);
			showGlobalAlert({ type: "success", message: "Accepted successfully!" });
			console.log("Friend request accepted (userId):", userId, res);
		} catch (err) {
			showGlobalAlert({ type: "error", message: "Accepted fail!" });
			console.error("accept friend failed", err);
		}
	};

	const handleDeclineFriend = async (requestId: string) => {
		try {
			setPendingFriendRequests((prev) =>
				prev.filter((r) => r.id !== requestId),
			);

			const item = pendingFriendRequests.find((r) => r.id === requestId);
			const raw = item?.raw;
			const userId = extractUserIdFromInvitation(raw) ?? requestId;

			const declineRequest = { status: 0 };
			const res = await updateFriendRequestStatus(userId, declineRequest);
			showGlobalAlert({ type: "success", message: "Declined successfully!" });
			console.log("Friend request declined (userId):", userId, res);
		} catch (err) {
			showGlobalAlert({ type: "error", message: "Declined fail!" });
			console.error("decline friend failed", err);
		}
	};

	// Group invite actions
	const handleAcceptGroup = async (inviteId: string) => {
		try {
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
		} catch (err) {
			toast.error(`Accepted fail: ${err}`);
		}
	};

	const handleDeclineGroup = async (inviteId: string) => {
		try {
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
			toast.error(`Declined fail: ${err}`);
		}
	};

	// const handleCancelSentGroup = async (inviteId: string) => {
	// 	try {
	// 		setPendingGroupInvites((prev) => prev.filter((r) => r.id !== inviteId));
	// 		if (cancelGroupInvite) await cancelGroupInvite(inviteId);
	// 	} catch (err) {
	// 		console.error("cancel group invite failed", err);
	// 	}
	// };

	const handleMenuToggle = (friendId: string, e: React.MouseEvent) => {
		e.stopPropagation();
		setActiveMenu(activeMenu === friendId ? null : friendId);
	};

	const handleMenuAction = (action: string, friendName: string) => {
		console.log(`${action} - ${friendName}`);
		setActiveMenu(null);
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
				{/* pass only the bits each component needs */}
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
						// onCancelFriend={handleCancelSentFriend}
						onAcceptGroup={handleAcceptGroup}
						onDeclineGroup={handleDeclineGroup}
						// onCancelGroup={handleCancelSentGroup}
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
		</Container>
	);
};

export default Friend;
