import React, { useState } from "react";
import {
	Container,
	// Header,
	// NavTabs,
	// NavTab,
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
	// UnfriendButton,
	Modal,
	ModalContent,
	ModalTitle,
	SendImg,
	ModalMessage,
	ModalButton,
	// NavTabTitle,
} from "./Friend.styed";
import { Search } from "lucide-react";
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
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState<User[]>([]);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [showModal, setShowModal] = useState(false);
	const [allFriends, setAllFriends] = useState<Friend[]>([
		{
			id: "1",
			name: "Nhu Nguyen",
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
			name: "Nhu Nguyen",
			handle: "@nhunguyen3",
			avatar:
				"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
			mutualFriends: 8,
		},
		{
			id: "4",
			name: "Nhu Nguyen",
			handle: "@nhunguyen4",
			avatar:
				"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
			mutualFriends: 2,
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
			handle: "@nhunguyen_req2",
			avatar:
				"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
			type: "received",
		},
		{
			id: "3",
			name: "Nhu Nguyen",
			handle: "@nhunguyen_sent1",
			avatar:
				"https://images.unsplash.com/photo-1506794778202-cad84cf45f-ad?w=100&h=100&fit=crop&crop=face",
			type: "sent",
		},
		{
			id: "4",
			name: "Nhu Nguyen",
			handle: "@nhunguyen_sent2",
			avatar:
				"https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=100&h=100&fit=crop&crop=face",
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
		{
			id: "3",
			name: "Nhu Nguyen",
			handle: "@nhunguyen3",
			avatar:
				"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
			mutualFriends: 3,
		},
		{
			id: "4",
			name: "Nhu Nguyen",
			handle: "@nhunguyen4",
			avatar:
				"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
			mutualFriends: 1,
		},
		{
			id: "5",
			name: "Nhu Nguyen",
			handle: "@nhunguyen5",
			avatar:
				"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
			mutualFriends: 7,
		},
		{
			id: "6",
			name: "Nhu Nguyen",
			handle: "@nhunguyen6",
			avatar:
				"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
			mutualFriends: 4,
		},
		{
			id: "7",
			name: "Nhu Nguyen",
			handle: "@nhunguyen7",
			avatar:
				"https://images.unsplash.com/photo-1506794778202-cad84cf45f-ad?w=100&h=100&fit=crop&crop=face",
			mutualFriends: 6,
		},
	];

	const handleSearch = (query: string) => {
		setSearchQuery(query);
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
		setSearchQuery(user.name);
		setSearchResults([]);
	};

	const handleSendRequest = () => {
		if (selectedUser) {
			setShowModal(true);
			setSearchQuery("");
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

	// const handleUnfriend = (friendId: string) => {
	//     setAllFriends(prev => prev.filter(friend => friend.id !== friendId));
	// };

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
					placeholder="You can find and add friends with their email/username"
					value={searchQuery}
					onChange={(e) => handleSearch(e.target.value)}
				/>
				<SendButton
					onClick={handleSendRequest}
					disabled={!selectedUser || !searchQuery.trim()}
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

	const renderAllContent = () => (
		<>
			<Title>All Friend - {allFriends.length}</Title>
			<Subtitle>Here are view list Friends here.</Subtitle>

			<SearchContainer>
				<Search size={20} color="#1A1A1A" />
				<SearchInput
					type="text"
					placeholder="You can find and add friends with their email/username"
					value={searchQuery}
					onChange={(e) => handleSearch(e.target.value)}
				/>
				<SendButton
					onClick={handleSendRequest}
					disabled={!selectedUser || !searchQuery.trim()}
				>
					Send request
				</SendButton>
			</SearchContainer>

			{allFriends.length > 0 && (
				<ResultsList>
					{allFriends
						.filter(
							(friend) =>
								!searchQuery ||
								friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
								friend.handle.toLowerCase().includes(searchQuery.toLowerCase()),
						)
						.map((friend) => (
							<ResultItem key={friend.id}>
								<Avatar src={friend.avatar} alt={friend.name} />
								<UserInfo>
									<UserName>{friend.name}</UserName>
									<UserHandle>{friend.handle}</UserHandle>
								</UserInfo>
								<MutualFriends>
									{friend.mutualFriends} mutual friends
								</MutualFriends>
							</ResultItem>
						))}
				</ResultsList>
			)}
		</>
	);

	const renderPendingContent = () => (
		<>
			<Title>Pending Page</Title>
			<Subtitle>View your sent requests and incoming friend requests</Subtitle>

			<SearchContainer>
				<Search size={20} color="#1A1A1A" />
				<SearchInput
					type="text"
					placeholder="You can find and add friends with their email/username"
					value={searchQuery}
					onChange={(e) => handleSearch(e.target.value)}
				/>
				<SendButton
					onClick={handleSendRequest}
					disabled={!selectedUser || !searchQuery.trim()}
				>
					Send request
				</SendButton>
			</SearchContainer>

			{pendingRequests.filter((req) => req.type === "received").length > 0 && (
				<>
					<SectionHeader>
						Received -{" "}
						{pendingRequests.filter((req) => req.type === "received").length}
					</SectionHeader>
					<ResultsList style={{ marginBottom: "24px" }}>
						{pendingRequests
							.filter((req) => req.type === "received")
							.filter(
								(req) =>
									!searchQuery ||
									req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
									req.handle.toLowerCase().includes(searchQuery.toLowerCase()),
							)
							.map((request) => (
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

			{pendingRequests.filter((req) => req.type === "sent").length > 0 && (
				<>
					<SectionHeader>
						Sent - {pendingRequests.filter((req) => req.type === "sent").length}
					</SectionHeader>
					<ResultsList>
						{pendingRequests
							.filter((req) => req.type === "sent")
							.filter(
								(req) =>
									!searchQuery ||
									req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
									req.handle.toLowerCase().includes(searchQuery.toLowerCase()),
							)
							.map((request) => (
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
