import React, { useState, useEffect } from "react";
import {
	Container,
	Content,
	Title,
	Subtitle,
	SearchContainer,
	SearchInput,
	SendButton,
	ResultsList,
	ResultItem,
	Avatar,
	UserInfo,
	UserName,
	UserHandle,
	MutualFriends,
	SectionHeader,
	ActionButton,
	ActionButtons,
	Modal,
	ModalContent,
	ModalTitle,
	SendImg,
	ModalMessage,
	ModalButton,
	FriendsGrid,
	FriendCard,
	CardContent,
	CardHeader,
	MenuContainer,
	MenuButton,
	MenuDropdown,
	MenuItem,
	FriendInfo,
	FriendName,
	NoResults,
	PaginationContainer,
	PageButton,
} from "./Friend.styed";
import { MoreHorizontal, Search, Star, UserMinus } from "lucide-react";
import sendImage from "../../assets/image/sendImage.png";
import { useSearch } from "@tanstack/react-router";
import { listUsers, UserResponse } from "@/services/userAPI";
import { sendFriendRequest } from "@/services/friendAPI";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface User {
	id: string;
	name: string;
	handle: string;
	avatar: string;
	mutualFriends: number;
}

interface Friend {
	id: string;
	name: string;
	handle: string;
	avatar: string;
	mutualFriends: number;
}

const Friend: React.FC = () => {
	const search = useSearch({ from: "/chat/friend" });
	const activeTab = search.tab || "add-friend";

	const currentUserProfile = useSelector(
		(state: RootState) => state.user.profile,
	);
	const currentUserId = currentUserProfile?.id || "";

	useEffect(() => {
		console.log("Current User ID:", currentUserId);
	}, [currentUserId]);

	const [availableUsers, setAvailableUsers] = useState<UserResponse[]>([]);
	const [isLoadingUsers, setIsLoadingUsers] = useState(false);
	const [isSendingRequest, setIsSendingRequest] = useState(false);

	const [searchAdd, setSearchAdd] = useState("");
	const [searchAll, setSearchAll] = useState("");
	const [searchPending, setSearchPending] = useState("");

	const [searchResults, setSearchResults] = useState<User[]>([]);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);

	const [showModal, setShowModal] = useState(false);
	const [modalType, setModalType] = useState<"success" | "error">("success");
	const [modalMessage, setModalMessage] = useState("");
	const [isUserSelectedFromList, setIsUserSelectedFromList] = useState(false);

	const [activeMenu, setActiveMenu] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const friendsPerPage = 18;

	const [allFriends] = useState<Friend[]>([
		{
			id: "1",
			name: "John Doe",
			handle: "@johndoe",
			avatar:
				"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
			mutualFriends: 5,
		},
		{
			id: "2",
			name: "Jane Smith",
			handle: "@janesmith",
			avatar:
				"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
			mutualFriends: 3,
		},
	]);

	const [pendingRequests] = useState([
		{
			id: "1",
			name: "Alice Johnson",
			handle: "@alice",
			avatar:
				"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
			type: "received" as const,
		},
		{
			id: "2",
			name: "Bob Wilson",
			handle: "@bobwilson",
			avatar:
				"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
			type: "sent" as const,
		},
	]);

	useEffect(() => {
		const fetchActiveUsers = async () => {
			setIsLoadingUsers(true);
			try {
				const response = await listUsers(1, 100);
				if (response && response.data) {
					const activeUsers = response.data.filter(
						(user: UserResponse) => user.isActive === true,
					);
					setAvailableUsers(activeUsers);
				}
			} catch (error) {
				console.error("Error fetching users:", error);
			} finally {
				setIsLoadingUsers(false);
			}
		};
		fetchActiveUsers();
	}, []);

	const handleSearchAdd = (query: string) => {
		setSearchAdd(query);

		if (selectedUser && selectedUser.name !== query) {
			setSelectedUser(null);
			setIsUserSelectedFromList(false);
		}

		if (query.trim()) {
			const filtered = availableUsers
				.filter((user) => {
					if (!user || !user.id) return false;

					const userIdString = String(user.id);
					const currentIdString = String(currentUserId);

					if (currentIdString.length > 0 && userIdString === currentIdString) {
						return false;
					}

					const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
					const username = user.username.toLowerCase();
					const email = user.email?.toLowerCase() || "";
					const searchTerm = query.toLowerCase();

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

	const handleSelectUser = (user: User) => {
		setSelectedUser(user);
		setSearchAdd(user.name);
		setSearchResults([]);
		setIsUserSelectedFromList(true);
	};

	const handleSendRequest = async () => {
		if (selectedUser && !isSendingRequest) {
			if (selectedUser.id === currentUserId) {
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
				setModalMessage(
					`Your friend request to ${selectedUser.name} was sent!`,
				);
				setShowModal(true);
				setSearchAdd("");
				setSearchResults([]);
				setSelectedUser(null);
				setIsUserSelectedFromList(false);
			} catch (error: any) {
				let errorMessage = "Failed to send friend request";

				if (error.response) {
					if (error.response.status === 400) {
						errorMessage =
							error.response.data?.message ||
							"Invalid request. This user may already be your friend or have a pending request.";
					} else if (error.response.status === 404) {
						errorMessage = "User not found";
					} else if (error.response.status === 409) {
						errorMessage =
							error.response.data?.message ||
							"Already had pending request before";
					} else {
						errorMessage =
							error.response.data?.message ||
							`Server Error (${error.response.status})`;
					}
				} else if (error.request) {
					errorMessage =
						"No response from server. Please check your connection.";
				} else {
					errorMessage = error.message;
				}

				setModalType("error");
				setModalMessage(errorMessage);
				setShowModal(true);
			} finally {
				setIsSendingRequest(false);
			}
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

	const handleMenuToggle = (friendId: string, e: React.MouseEvent) => {
		e.stopPropagation();
		setActiveMenu(activeMenu === friendId ? null : friendId);
	};

	const handleMenuAction = (action: string, friendName: string) => {
		setActiveMenu(null);
		alert(`Action "${action}" for ${friendName} - UI only`);
	};

	useEffect(() => {
		const handleClickOutside = () => {
			if (activeMenu) setActiveMenu(null);
		};
		document.addEventListener("click", handleClickOutside);
		return () => document.removeEventListener("click", handleClickOutside);
	}, [activeMenu]);

	const renderAddFriendContent = () => {
		const showNoResults =
			searchAdd.trim() &&
			searchResults.length === 0 &&
			!isLoadingUsers &&
			!isUserSelectedFromList &&
			!selectedUser;

		const showResults =
			searchResults.length > 0 && !isLoadingUsers && !isUserSelectedFromList;

		return (
			<>
				<Title>Let's find and add friends!</Title>
				<Subtitle>
					You can find and add friends with their email/username
				</Subtitle>

				<SearchContainer>
					<Search size={20} color="#1A1A1A" />
					<SearchInput
						type="text"
						placeholder="Search by name or username"
						value={searchAdd}
						onChange={(e) => handleSearchAdd(e.target.value)}
						disabled={isLoadingUsers}
					/>
					<SendButton
						onClick={handleSendRequest}
						disabled={
							!isUserSelectedFromList || isLoadingUsers || isSendingRequest
						}
					>
						{isSendingRequest
							? "Sending..."
							: isLoadingUsers
								? "Loading..."
								: "Send request"}
					</SendButton>
				</SearchContainer>

				{isLoadingUsers && (
					<div
						style={{ textAlign: "center", padding: "20px", color: "#6B7280" }}
					>
						Loading users...
					</div>
				)}

				{showResults && (
					<ResultsList>
						{searchResults.map((user) => (
							<ResultItem
								key={user.id}
								selected={false}
								onClick={() => handleSelectUser(user)}
							>
								<Avatar src={user.avatar} alt={user.name} />
								<UserInfo>
									<UserName>{user.name}</UserName>
									<UserHandle>{user.handle}</UserHandle>
								</UserInfo>
								<MutualFriends>
									{user.mutualFriends} mutual friends
								</MutualFriends>
							</ResultItem>
						))}
					</ResultsList>
				)}

				{showNoResults && <NoResults>No users found</NoResults>}
			</>
		);
	};

	const renderAllContent = () => {
		const filteredFriends = allFriends.filter(
			(friend) =>
				friend.name.toLowerCase().includes(searchAll.toLowerCase()) ||
				friend.handle.toLowerCase().includes(searchAll.toLowerCase()),
		);

		const indexOfLastFriend = currentPage * friendsPerPage;
		const indexOfFirstFriend = indexOfLastFriend - friendsPerPage;
		const currentFriends = filteredFriends.slice(
			indexOfFirstFriend,
			indexOfLastFriend,
		);

		const totalPages = Math.ceil(filteredFriends.length / friendsPerPage);

		const handlePageChange = (page: number) => {
			setCurrentPage(page);
		};

		return (
			<>
				<Title>All Friend - {allFriends.length}</Title>
				<Subtitle>Here are your friends.</Subtitle>

				<SearchContainer>
					<Search size={20} color="#1A1A1A" />
					<SearchInput
						type="text"
						placeholder="Search your friends..."
						value={searchAll}
						onChange={(e) => {
							setSearchAll(e.target.value);
							setCurrentPage(1);
						}}
					/>
				</SearchContainer>

				<FriendsGrid
					className="hide-scrollbar"
					style={{ scrollbarWidth: "none" }}
				>
					{currentFriends.map((friend) => (
						<FriendCard key={friend.id}>
							<CardContent>
								<CardHeader>
									<div
										style={{
											display: "flex",
											gap: "8px",
											alignItems: "center",
										}}
									>
										<Avatar src={friend.avatar} alt={friend.name} />
										<FriendInfo>
											<FriendName>{friend.name}</FriendName>
											<MutualFriends>
												{friend.mutualFriends} mutual friends
											</MutualFriends>
										</FriendInfo>
									</div>

									<MenuContainer>
										<MenuButton onClick={(e) => handleMenuToggle(friend.id, e)}>
											<MoreHorizontal size={20} color="#6B7280" />
										</MenuButton>

										{activeMenu === friend.id && (
											<MenuDropdown>
												<MenuItem
													onClick={() =>
														handleMenuAction("Favorite", friend.name)
													}
												>
													<Star size={18} style={{ marginRight: "12px" }} />
													<span>Favorite</span>
												</MenuItem>
												<MenuItem
													onClick={() =>
														handleMenuAction("Unfriend", friend.name)
													}
												>
													<UserMinus
														size={18}
														style={{ marginRight: "12px" }}
													/>
													<span>Unfriend</span>
												</MenuItem>
											</MenuDropdown>
										)}
									</MenuContainer>
								</CardHeader>
							</CardContent>
						</FriendCard>
					))}
				</FriendsGrid>

				{filteredFriends.length > friendsPerPage && (
					<PaginationContainer>
						{Array.from({ length: totalPages }, (_, index) => (
							<PageButton
								key={index + 1}
								onClick={() => handlePageChange(index + 1)}
								$active={currentPage === index + 1}
							>
								{index + 1}
							</PageButton>
						))}
					</PaginationContainer>
				)}

				{filteredFriends.length === 0 && (
					<NoResults>No friends found</NoResults>
				)}
			</>
		);
	};

	const renderPendingContent = () => {
		const received = pendingRequests.filter((req) => req.type === "received");
		const sent = pendingRequests.filter((req) => req.type === "sent");

		const filteredReceived = received.filter(
			(req) =>
				req.name.toLowerCase().includes(searchPending.toLowerCase()) ||
				req.handle.toLowerCase().includes(searchPending.toLowerCase()),
		);
		const filteredSent = sent.filter(
			(req) =>
				req.name.toLowerCase().includes(searchPending.toLowerCase()) ||
				req.handle.toLowerCase().includes(searchPending.toLowerCase()),
		);

		return (
			<>
				<Title>Pending Page</Title>
				<Subtitle>View your sent and incoming requests</Subtitle>

				<SearchContainer>
					<Search size={20} color="#1A1A1A" />
					<SearchInput
						type="text"
						placeholder="Search pending requests..."
						value={searchPending}
						onChange={(e) => setSearchPending(e.target.value)}
					/>
				</SearchContainer>

				{filteredReceived.length > 0 && (
					<>
						<SectionHeader>Received - {filteredReceived.length}</SectionHeader>
						<ResultsList style={{ marginBottom: "24px" }}>
							{filteredReceived.map((request) => (
								<ResultItem key={request.id}>
									<Avatar src={request.avatar} alt={request.name} />
									<UserInfo>
										<UserName>{request.name}</UserName>
										<UserHandle>{request.handle}</UserHandle>
									</UserInfo>
									<ActionButtons>
										<ActionButton
											variant="accept"
											onClick={() => alert("Accept - UI only")}
										>
											✓
										</ActionButton>
										<ActionButton
											variant="decline"
											onClick={() => alert("Decline - UI only")}
										>
											✕
										</ActionButton>
									</ActionButtons>
								</ResultItem>
							))}
						</ResultsList>
					</>
				)}

				{filteredSent.length > 0 && (
					<>
						<SectionHeader>Sent - {filteredSent.length}</SectionHeader>
						<ResultsList>
							{filteredSent.map((request) => (
								<ResultItem key={request.id}>
									<Avatar src={request.avatar} alt={request.name} />
									<UserInfo>
										<UserName>{request.name}</UserName>
										<UserHandle>{request.handle}</UserHandle>
									</UserInfo>
									<ActionButton
										variant="unfriend"
										onClick={() => alert("Cancel - UI only")}
									>
										✕
									</ActionButton>
								</ResultItem>
							))}
						</ResultsList>
					</>
				)}

				{received.length === 0 && sent.length === 0 && (
					<NoResults>No pending requests</NoResults>
				)}
			</>
		);
	};

	const renderContent = () => {
		switch (activeTab) {
			case "add-friend":
				return renderAddFriendContent();
			case "all":
				return renderAllContent();
			case "pending":
				return renderPendingContent();
			default:
				return renderAddFriendContent();
		}
	};

	return (
		<Container>
			<Content>{renderContent()}</Content>

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
							style={{
								color: modalType === "error" ? "#EF4444" : "#10B981",
							}}
						>
							{modalType === "success" ? "Success!" : "Error"}
						</ModalTitle>
						{modalType === "success" && (
							<SendImg src={sendImage} alt="Send Success" />
						)}
						<ModalMessage
							style={{
								color: modalType === "error" ? "#DC2626" : "#374151",
							}}
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
