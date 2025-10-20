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

const Friend: React.FC = () => {
	const search = useSearch({ from: "/chat/friend" });
	const activeTab = (search.tab as string) || "add-friend";

	// --- Shared state ---
	const [searchAdd, setSearchAdd] = useState("");
	const [searchAll, setSearchAll] = useState("");
	const [searchPending, setSearchPending] = useState("");

	const [searchResults, setSearchResults] = useState<any[]>([]);
	const [selectedUser, setSelectedUser] = useState<any | null>(null);
	const [showModal, setShowModal] = useState(false);
	const [activeMenu, setActiveMenu] = useState<string | null>(null);

	const [currentPage, setCurrentPage] = useState(1);
	const friendsPerPage = 18;

	const [allFriends, setAllFriends] = useState<any[]>([
		/* initial mock data (same as before) */
	]);
	const [pendingRequests, setPendingRequests] = useState<any[]>([
		/* initial mock data (same as before) */
	]);

	// NOTE: For brevity I omitted the long arrays; keep your original mock arrays here.

	// --- Actions ---
	const handleSearchAdd = (query: string) => {
		setSearchAdd(query);
		// Example client-side filtering against mockUsers in AddFriend component
		// We'll store filtered results here for AddFriend to consume
		if (query.trim()) {
			// mock data inside AddFriend - mimic a small search
			const mockUsers = [
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

	const handleSelectUser = (user: any) => {
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
					<ModalContent>
						<ModalTitle>Success!</ModalTitle>
						<SendImg src={sendImage} alt="Send Success" />
						<ModalMessage>Your friend request was sent!</ModalMessage>
						<ModalButton onClick={handleCloseModal}>OK</ModalButton>
					</ModalContent>
				</Modal>
			)}
		</Container>
	);
};

export default Friend;
