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

interface User {
	id: string;
	name: string;
	handle: string;
	avatar: string;
	mutualFriends: number;
}

interface PendingRequest {
	id: string;
	name: string;
	handle: string;
	avatar: string;
	type: "received" | "sent";
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

	const [searchAdd, setSearchAdd] = useState("");
	const [searchAll, setSearchAll] = useState("");
	const [searchPending, setSearchPending] = useState("");

	const [searchResults, setSearchResults] = useState<User[]>([]);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [showModal, setShowModal] = useState(false);
	const [activeMenu, setActiveMenu] = useState<string | null>(null);

	const [currentPage, setCurrentPage] = useState(1);
	const friendsPerPage = 18;

	const [allFriends, setAllFriends] = useState<Friend[]>([
		{
			id: "1",
			name: "Nhu Phien",
			handle: "@nhunguyen1",
			avatar:
				"https://images.unsplash.com/photo-1494790108755-2616b332c-c3?w=100&h=100&fit=crop&crop=face",
			mutualFriends: 5,
		},
		{
			id: "2",
			name: "Nhu Nguyen",
			handle: "@nhunguyen2",
			avatar:
				"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
			mutualFriends: 3,
		},
		{
			id: "3",
			name: "Nhu Phien",
			handle: "@nhunguyen1",
			avatar:
				"https://images.unsplash.com/photo-1494790108755-2616b332c-c3?w=100&h=100&fit=crop&crop=face",
			mutualFriends: 5,
		},
		{
			id: "3",
			name: "Nhu Phien",
			handle: "@nhunguyen1",
			avatar:
				"https://images.unsplash.com/photo-1494790108755-2616b332c-c3?w=100&h=100&fit=crop&crop=face",
			mutualFriends: 5,
		},
		{
			id: "4",
			name: "Nhu Nguyen",
			handle: "@nhunguyen2",
			avatar:
				"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
			mutualFriends: 3,
		},
		{
			id: "5",
			name: "Nhu Phien",
			handle: "@nhunguyen1",
			avatar:
				"https://images.unsplash.com/photo-1494790108755-2616b332c-c3?w=100&h=100&fit=crop&crop=face",
			mutualFriends: 5,
		},
		{
			id: "6",
			name: "Nhu Nguyen",
			handle: "@nhunguyen2",
			avatar:
				"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
			mutualFriends: 3,
		},
		{
			id: "7",
			name: "Nhu Phien",
			handle: "@nhunguyen1",
			avatar:
				"https://images.unsplash.com/photo-1494790108755-2616b332c-c3?w=100&h=100&fit=crop&crop=face",
			mutualFriends: 5,
		},
		{
			id: "8",
			name: "Nhu Nguyen",
			handle: "@nhunguyen2",
			avatar:
				"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
			mutualFriends: 3,
		},
		{
			id: "9",
			name: "Nhu Phien",
			handle: "@nhunguyen1",
			avatar:
				"https://images.unsplash.com/photo-1494790108755-2616b332c-c3?w=100&h=100&fit=crop&crop=face",
			mutualFriends: 5,
		},
		{
			id: "10",
			name: "Nhu Nguyen",
			handle: "@nhunguyen2",
			avatar:
				"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
			mutualFriends: 3,
		},
		{
			id: "11",
			name: "Nhu Phien",
			handle: "@nhunguyen1",
			avatar:
				"https://images.unsplash.com/photo-1494790108755-2616b332c-c3?w=100&h=100&fit=crop&crop=face",
			mutualFriends: 5,
		},
		{
			id: "12",
			name: "Nhu Nguyen",
			handle: "@nhunguyen2",
			avatar:
				"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
			mutualFriends: 3,
		},
		{
			id: "13",
			name: "Nhu Phien",
			handle: "@nhunguyen1",
			avatar:
				"https://images.unsplash.com/photo-1494790108755-2616b332c-c3?w=100&h=100&fit=crop&crop=face",
			mutualFriends: 5,
		},
		{
			id: "14",
			name: "Nhu Nguyen",
			handle: "@nhunguyen2",
			avatar:
				"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
			mutualFriends: 3,
		},
		{
			id: "15",
			name: "Nhu Phien",
			handle: "@nhunguyen1",
			avatar:
				"https://images.unsplash.com/photo-1494790108755-2616b332c-c3?w=100&h=100&fit=crop&crop=face",
			mutualFriends: 5,
		},
		{
			id: "16",
			name: "Nhu Nguyen",
			handle: "@nhunguyen2",
			avatar:
				"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
			mutualFriends: 3,
		},
		{
			id: "17",
			name: "Nhu Phien",
			handle: "@nhunguyen1",
			avatar:
				"https://images.unsplash.com/photo-1494790108755-2616b332c-c3?w=100&h=100&fit=crop&crop=face",
			mutualFriends: 5,
		},
		{
			id: "18",
			name: "Nhu Nguyen",
			handle: "@nhunguyen2",
			avatar:
				"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
			mutualFriends: 3,
		},
		{
			id: "19",
			name: "Nhu Phien",
			handle: "@nhunguyen1",
			avatar:
				"https://images.unsplash.com/photo-1494790108755-2616b332c-c3?w=100&h=100&fit=crop&crop=face",
			mutualFriends: 5,
		},
		{
			id: "20",
			name: "Nhu Nguyen",
			handle: "@nhunguyen2",
			avatar:
				"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
			mutualFriends: 3,
		},
		{
			id: "21",
			name: "Nhu Phien",
			handle: "@nhunguyen1",
			avatar:
				"https://images.unsplash.com/photo-1494790108755-2616b332c-c3?w=100&h=100&fit=crop&crop=face",
			mutualFriends: 5,
		},
		{
			id: "22",
			name: "Nhu Nguyen",
			handle: "@nhunguyen2",
			avatar:
				"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
			mutualFriends: 3,
		},
	]);

	const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([
		{
			id: "1",
			name: "Nhu Nguyen",
			handle: "@nhunguyen_req1",
			avatar:
				"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
			type: "received",
		},
		{
			id: "2",
			name: "Nhu Nguyen",
			handle: "@nhunguyen_sent1",
			avatar:
				"https://images.unsplash.com/photo-1506794778202-cad84cf45f-ad?w=100&h=100&fit=crop&crop=face",
			type: "sent",
		},
	]);

	const mockUsers: User[] = [
		{
			id: "1",
			name: "Nhu Nguyen",
			handle: "@nhunguyen",
			avatar:
				"https://images.unsplash.com/photo-1494790108755-2616b332c-c3?w=100&h=100&fit=crop&crop=face",
			mutualFriends: 2,
		},
		{
			id: "2",
			name: "Nhu Nguyen",
			handle: "@nhunguyen2",
			avatar:
				"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
			mutualFriends: 5,
		},
	];

	const handleSearchAdd = (query: string) => {
		setSearchAdd(query);
		if (query.trim()) {
			const filtered = mockUsers.filter(
				(user) =>
					user.name.toLowerCase().includes(query.toLowerCase()) ||
					user.handle.toLowerCase().includes(query.toLowerCase()),
			);
			setSearchResults(filtered);
		} else {
			setSearchResults([]);
		}
	};

	const handleSelectUser = (user: User) => {
		setSelectedUser(user);
		setSearchAdd(user.name);
		setSearchResults([]);
	};

	const handleSendRequest = () => {
		if (selectedUser) {
			setShowModal(true);
			setSearchAdd("");
			setSearchResults([]);
			setSelectedUser(null);
		}
	};

	const handleCloseModal = () => {
		setShowModal(false);
		setSelectedUser(null);
	};

	const handleAcceptRequest = (requestId: string) => {
		const request = pendingRequests.find((req) => req.id === requestId);
		if (request) {
			const newFriend: Friend = {
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

	const renderAddFriendContent = () => (
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
				/>
				<SendButton
					onClick={handleSendRequest}
					disabled={!selectedUser || !searchAdd.trim()}
				>
					Send request
				</SendButton>
			</SearchContainer>

			{searchResults.length > 0 && (
				<ResultsList>
					{searchResults.map((user) => (
						<ResultItem
							key={user.id}
							selected={selectedUser?.id === user.id}
							onClick={() => handleSelectUser(user)}
						>
							<Avatar src={user.avatar} alt={user.name} />
							<UserInfo>
								<UserName>{user.name}</UserName>
								<UserHandle>{user.handle}</UserHandle>
							</UserInfo>
							<MutualFriends>{user.mutualFriends} mutual friends</MutualFriends>
						</ResultItem>
					))}
				</ResultsList>
			)}
		</>
	);

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
												{friend.mutualFriends} bạn chung
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
														handleMenuAction("Yêu thích", friend.name)
													}
												>
													<Star size={18} style={{ marginRight: "12px" }} />
													<span>Yêu thích</span>
												</MenuItem>
												<MenuItem
													onClick={() =>
														handleMenuAction("Hủy kết bạn", friend.name)
													}
												>
													<UserMinus
														size={18}
														style={{ marginRight: "12px" }}
													/>
													<span>Hủy kết bạn</span>
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
					<NoResults>Không tìm thấy bạn bè nào</NoResults>
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
											onClick={() => handleAcceptRequest(request.id)}
										>
											✓
										</ActionButton>
										<ActionButton
											variant="decline"
											onClick={() => handleDeclineRequest(request.id)}
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
										onClick={() => handleCancelSentRequest(request.id)}
									>
										✕
									</ActionButton>
								</ResultItem>
							))}
						</ResultsList>
					</>
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
					<ModalContent>
						<ModalTitle>Success!</ModalTitle>
						<SendImg src={sendImage} alt="Send Success" />
						<ModalMessage>
							Your friend request to {selectedUser?.name || "user"} was sent!
						</ModalMessage>
						<ModalButton onClick={handleCloseModal}>OK</ModalButton>
					</ModalContent>
				</Modal>
			)}
		</Container>
	);
};

export default Friend;
