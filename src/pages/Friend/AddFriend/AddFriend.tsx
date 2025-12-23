import React, { useEffect, useState } from "react";
import { Search, Eye } from "lucide-react";
import {
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
	Title,
	Subtitle,
	UserInfoDetails,
	Dot,
} from "../Friend.styled";
import { getMutualFriends } from "@/services/friendAPI";
import type { FriendUser } from "@/services/friendAPI";
import { detailUser } from "@/services/userAPI";
import type { UserResponse } from "@/services/userAPI";
import FriendProfileModal from "../AllFriends/FriendProfileModal/FriendProfileModal";

interface User {
	id: string;
	name: string;
	handle: string;
	avatar: string;
	mutualFriends: number;
	email: string;
	createdAt?: string;
}

interface Props {
	searchAdd: string;
	onSearchAdd: (q: string) => void;
	searchResults: User[];
	onSelectUser: (u: User) => void;
	selectedUser: User | null;
	onSendRequest: () => void;
	isLoadingUsers: boolean;
	isSendingRequest: boolean;
	isUserSelectedFromList: boolean;
}

const AddFriend: React.FC<Props> = ({
	searchAdd,
	onSearchAdd,
	searchResults,
	onSelectUser,
	selectedUser,
	onSendRequest,
	isLoadingUsers,
	isSendingRequest,
	isUserSelectedFromList,
}) => {
	const [localSearchValue, setLocalSearchValue] = useState(searchAdd);
	const [mutualFriendsCount, setMutualFriendsCount] = useState<
		Record<string, number>
	>({});
	const [loadingMutual, setLoadingMutual] = useState(false);
	const [selectedUserForProfile, setSelectedUserForProfile] =
		useState<FriendUser | null>(null);
	const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
	const [loadingProfile, setLoadingProfile] = useState(false);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			onSearchAdd(localSearchValue);
		}, 700);
		return () => clearTimeout(timeoutId);
	}, [localSearchValue, onSearchAdd]);

	useEffect(() => {
		setLocalSearchValue(searchAdd);
	}, [searchAdd]);

	useEffect(() => {
		const fetchMutualFriends = async () => {
			if (searchResults.length === 0) return;

			setLoadingMutual(true);
			const counts: Record<string, number> = {};

			try {
				await Promise.all(
					searchResults.map(async (user) => {
						try {
							const response = await getMutualFriends(user.id);
							const count = response.data.count || 0;
							counts[user.id] = count;
						} catch (error) {
							console.error(
								`Error fetching mutual friends for ${user.id}:`,
								error,
							);
							counts[user.id] = 0;
						}
					}),
				);
				setMutualFriendsCount(counts);
			} catch (error) {
				console.error("Error fetching mutual friends:", error);
			} finally {
				setLoadingMutual(false);
			}
		};

		fetchMutualFriends();
	}, [searchResults]);

	const handleViewProfile = async (user: User, e: React.MouseEvent) => {
		e.stopPropagation();
		setLoadingProfile(true);

		try {
			const response = await detailUser(user.id);
			const userData: UserResponse = response.data || response;

			const friendUser: FriendUser = {
				id: userData.id,
				name:
					`${userData.firstName || ""} ${userData.lastName || ""}`.trim() ||
					userData.username,
				username: userData.username,
				avatar: userData.avatarUrl || user.avatar || "",
				email: userData.email,
				avatarUrl: userData.avatarUrl || user.avatar || "",
				firstName: userData.firstName || "",
				lastName: userData.lastName || "",
				createdAt: userData.createdAt
					? new Date(userData.createdAt).toISOString()
					: new Date().toISOString(),
				emailVerified: userData.emailVerified || false,
				isAdmin: userData.isAdmin || false,
				isActive: userData.isActive || true,
				userLanguages: userData.userLanguages ?? [],
			};

			setSelectedUserForProfile(friendUser);
			setIsProfileModalOpen(true);
		} catch (error) {
			console.error("Error fetching user profile:", error);

			const friendUser: FriendUser = {
				id: user.id,
				name: user.name,
				username: user.handle.replace("@", ""),
				avatar: user.avatar,
				email: user.email,
				avatarUrl: user.avatar,
				firstName: user.name.split(" ")[0] || "",
				lastName: user.name.split(" ").slice(1).join(" ") || "",
				createdAt: user.createdAt || new Date().toISOString(),
				emailVerified: false,
				isAdmin: false,
				isActive: true,
				userLanguages: [],
			};

			setSelectedUserForProfile(friendUser);
			setIsProfileModalOpen(true);
		} finally {
			setLoadingProfile(false);
		}
	};

	const handleCloseProfileModal = () => {
		setIsProfileModalOpen(false);
		setSelectedUserForProfile(null);
	};

	return (
		<>
			<Title>Add Friend</Title>
			<Subtitle>
				You can find and add friends with their email/username
			</Subtitle>

			<SearchContainer>
				<Search size={20} />
				<SearchInput
					type="text"
					placeholder="Search by name or username"
					value={localSearchValue}
					onChange={(e) => setLocalSearchValue(e.target.value)}
					disabled={isLoadingUsers}
				/>
				<SendButton
					onClick={onSendRequest}
					disabled={!selectedUser || isSendingRequest}
				>
					{isSendingRequest
						? "Sending..."
						: isLoadingUsers
							? "Loading..."
							: "Send request"}
				</SendButton>
			</SearchContainer>

			{isLoadingUsers && (
				<div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
					Loading users...
				</div>
			)}

			{searchResults.length > 0 && !isUserSelectedFromList && (
				<ResultsList>
					{searchResults.map((user) => (
						<ResultItem
							key={user.id}
							onClick={() => onSelectUser(user)}
							style={{ position: "relative" }}
						>
							<Avatar src={user.avatar} alt={user.name} />
							<UserInfo>
								<UserInfoDetails>
									<UserName>{user.name}</UserName>
									<Dot>•</Dot>
									<UserHandle>{user.handle}</UserHandle>
								</UserInfoDetails>
								<MutualFriends>
									{loadingMutual
										? "Loading..."
										: `${mutualFriendsCount[user.id] ?? 0} mutual friends`}
								</MutualFriends>
							</UserInfo>
							<button
								onClick={(e) => handleViewProfile(user, e)}
								title="View profile"
								disabled={loadingProfile}
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									width: "36px",
									height: "36px",
									borderRadius: "6px",
									background: loadingProfile ? "#F3F4F6" : "#EFF6FF",
									color: loadingProfile ? "#9CA3AF" : "#133E87",
									cursor: loadingProfile ? "not-allowed" : "pointer",
									border: "none",
									transition: "all 0.2s",
									marginLeft: "8px",
								}}
								onMouseOver={(e) =>
									!loadingProfile &&
									(e.currentTarget.style.background = "#DBEAFE")
								}
								onMouseOut={(e) =>
									!loadingProfile &&
									(e.currentTarget.style.background = "#EFF6FF")
								}
							>
								<Eye size={18} />
							</button>
						</ResultItem>
					))}
				</ResultsList>
			)}

			<FriendProfileModal
				isOpen={isProfileModalOpen}
				onClose={handleCloseProfileModal}
				friend={selectedUserForProfile}
				hideActionButton={true}
			/>
		</>
	);
};

export default AddFriend;
