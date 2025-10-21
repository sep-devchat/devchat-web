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
import { sendFriendRequest } from "@/services/friendAPI";

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

	const [allFriends, setAllFriends] = useState<any[]>([
		// keep previous mock or start empty; you can seed with server data later
	]);
	const [pendingRequests, setPendingRequests] = useState<any[]>([
		// keep previous mock or start empty; you can seed with server data later
	]);

	// Fetch active users on mount
	useEffect(() => {
		const fetchActiveUsers = async () => {
			setIsLoadingUsers(true);
			try {
				const response = await listUsers(1, 200);
				if (response && response.data) {
					// keep only active and exclude current user
					const active = response.data.filter(
						(user: UserResponse) =>
							user.isActive === true &&
							String(user.id) !== String(currentUserId),
					);
					setAvailableUsers(active);
				}
			} catch (err) {
				console.error("Failed to fetch users", err);
			} finally {
				setIsLoadingUsers(false);
			}
		};

		fetchActiveUsers();
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
			const filtered = availableUsers
				.filter((user) => {
					// build comparable strings
					const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
					const username = (user.username || "").toLowerCase();
					const email = (user.email || "").toLowerCase();
					return (
						fullName.includes(searchTerm) ||
						username.includes(searchTerm) ||
						email.includes(searchTerm)
					);
				})
				.map((user) => ({
					id: user.id,
					name: `${user.firstName} ${user.lastName}`,
					handle: `@${user.username}`,
					avatar:
						user.avatarUrl ||
						"https://images.unsplash.com/photo-1494790108755-2616b332c-c3?w=100&h=100&fit=crop&crop=face",
					mutualFriends: 0,
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

			// add to pendingRequests as 'sent' so UI reflects change immediately
			setPendingRequests((prev) => [
				...prev,
				{
					id: String(selectedUser.id),
					name: selectedUser.name,
					handle: selectedUser.handle,
					avatar: selectedUser.avatar,
					type: "sent",
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

	const handleAcceptRequest = (requestId: string) => {
		const request = pendingRequests.find((req) => req.id === requestId);
		if (request) {
			const newFriend = {
				id: request.id,
				name: request.name,
				handle: request.handle,
				avatar: request.avatar,
				mutualFriends: Math.floor(Math.random() * 10) + 1,
			};
			setAllFriends((prev) => [...prev, newFriend]);
			setPendingRequests((prev) => prev.filter((req) => req.id !== requestId));
		}
	};

	const handleDeclineRequest = (requestId: string) => {
		setPendingRequests((prev) => prev.filter((req) => req.id !== requestId));
	};

	const handleCancelSentRequest = (requestId: string) => {
		setPendingRequests((prev) => prev.filter((req) => req.id !== requestId));
	};

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
						pendingRequests={pendingRequests}
						searchPending={searchPending}
						setSearchPending={setSearchPending}
						onAccept={handleAcceptRequest}
						onDecline={handleDeclineRequest}
						onCancelSent={handleCancelSentRequest}
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
