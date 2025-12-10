/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { MoreHorizontal, Search, Star, UserMinus } from "lucide-react";
import Empty from "@/components/custom/Empty";
import empty_box from "@/assets/emoji/empty_box.png";
import {
	Title,
	Subtitle,
	SearchContainer,
	SearchInput,
	FriendsGrid,
	FriendCard,
	CardContent,
	CardHeader,
	Avatar,
	FriendInfo,
	FriendName,
	MutualFriends,
	MenuContainer,
	MenuButton,
	MenuDropdown,
	MenuItem,
	PaginationContainer,
	PageButton,
	NoResults,
} from "../Friend.styled";
import { getMutualFriends, type FriendUser } from "@/services/friendAPI";
import FriendProfileModal from "./FriendProfileModal/FriendProfileModal";

interface Props {
	allFriends: FriendUser[];
	searchAll: string;
	setSearchAll: (s: string) => void;
	currentPage: number;
	setCurrentPage: (p: number) => void;
	friendsPerPage: number;
	activeMenu: string | null;
	onMenuToggle: (id: string, e: React.MouseEvent) => void;
	onMenuAction: (action: string, name: string, id: string) => void;
}

const AllFriends: React.FC<Props> = ({
	allFriends,
	searchAll,
	setSearchAll,
	currentPage,
	setCurrentPage,
	friendsPerPage,
	activeMenu,
	onMenuToggle,
	onMenuAction,
}) => {
	const navigate = useNavigate();
	const [mutualFriendsCount, setMutualFriendsCount] = useState<
		Record<string, number>
	>({});
	const [loading, setLoading] = useState(false);
	const [selectedFriend, setSelectedFriend] = useState<FriendUser | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		const fetchMutualFriends = async () => {
			setLoading(true);
			const counts: Record<string, number> = {};
			try {
				await Promise.all(
					allFriends.map(async (friend) => {
						try {
							const response = await getMutualFriends(friend.id);
							const mutualCount = response.data.count || 0;
							counts[friend.id] = mutualCount;
						} catch (error) {
							console.error(
								`Error fetching mutual friends for ${friend.id}:`,
								error,
							);
							counts[friend.id] = 0;
						}
					}),
				);
				setMutualFriendsCount(counts);
			} catch (error) {
				console.error("Error fetching mutual friends:", error);
			} finally {
				setLoading(false);
			}
		};
		if (allFriends.length > 0) {
			fetchMutualFriends();
		} else {
			setLoading(false);
		}
	}, [allFriends]);

	const getFriendName = useCallback((friend: FriendUser) => {
		return (
			`${friend.firstName ?? ""} ${friend.lastName ?? ""}`.trim() ||
			friend.username ||
			friend.email ||
			"User"
		);
	}, []);

	const filteredFriends = useMemo(() => {
		const query = searchAll.toLowerCase();
		return allFriends.filter((friend) => {
			const name = getFriendName(friend).toLowerCase();
			const handle = (friend.username ? `@${friend.username}` : "")
				.toString()
				.toLowerCase();
			return name.includes(query) || handle.includes(query);
		});
	}, [allFriends, getFriendName, searchAll]);

	const indexOfLastFriend = currentPage * friendsPerPage;
	const indexOfFirstFriend = indexOfLastFriend - friendsPerPage;
	const currentFriends = filteredFriends.slice(
		indexOfFirstFriend,
		indexOfLastFriend,
	);
	const totalPages = Math.ceil(filteredFriends.length / friendsPerPage);

	const handleMenuAction = (action: string, name: string, id: string) => {
		if (action === "Profile") {
			const friend = allFriends.find((f) => f.id === id);
			if (friend) {
				setSelectedFriend(friend);
				setIsModalOpen(true);
			}
		} else {
			onMenuAction(action, name, id);
		}
	};

	const handleUnfriend = (id: string, name: string) => {
		onMenuAction("Unfriend", name, id);
	};

	return (
		<>
			<Title>All Friend - {allFriends.length}</Title>
			<Subtitle>Here are your friends.</Subtitle>
			<SearchContainer>
				<Search size={20} />
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
				{currentFriends.map((friend) => {
					const friendName = getFriendName(friend);
					const avatarSrc =
						friend.avatar ??
						friend.avatarUrl ??
						"https://images.unsplash.com/photo-1494790108755-2616b332c-c3?w=100&h=100&fit=crop&crop=face";

					return (
						<FriendCard
							key={friend.id}
							onClick={() =>
								navigate({
									to: "/chat/user/$userId",
									params: { userId: friend.id },
								})
							}
							style={{ cursor: "pointer" }}
						>
							<CardContent>
								<CardHeader>
									<div
										style={{
											display: "flex",
											gap: "8px",
											alignItems: "center",
										}}
									>
										<Avatar src={avatarSrc} alt={friendName} />
										<FriendInfo>
											<FriendName>{friendName}</FriendName>
											<MutualFriends>
												{loading
													? "Loading..."
													: `${mutualFriendsCount[friend.id] ?? 0} mutual friends`}
											</MutualFriends>
										</FriendInfo>
									</div>
									<MenuContainer>
										<MenuButton
											onClick={(e) => {
												e.stopPropagation();
												onMenuToggle(friend.id, e);
											}}
										>
											<MoreHorizontal size={20} color="#6B7280" />
										</MenuButton>
										{activeMenu === friend.id && (
											<MenuDropdown>
												<MenuItem
													onClick={(e) => {
														e.stopPropagation();
														handleMenuAction("Profile", friendName, friend.id);
														onMenuToggle("", e);
													}}
												>
													<Star size={18} style={{ marginRight: "12px" }} />
													<span>Profile</span>
												</MenuItem>
												<MenuItem
													onClick={(e) => {
														e.stopPropagation();
														handleMenuAction("Unfriend", friendName, friend.id);
														onMenuToggle("", e);
													}}
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
					);
				})}
			</FriendsGrid>
			{filteredFriends.length > friendsPerPage && (
				<PaginationContainer>
					{Array.from({ length: totalPages }, (_, index) => (
						<PageButton
							key={index + 1}
							onClick={() => setCurrentPage(index + 1)}
							$active={currentPage === index + 1}
						>
							{index + 1}
						</PageButton>
					))}
				</PaginationContainer>
			)}
			{filteredFriends.length === 0 && (
				<NoResults>
					<Empty
						image={
							<img
								src={empty_box}
								alt="No friends"
								className="h-50 w-50 object-cover"
							/>
						}
						icon={null}
						heading="No friends found"
						description="Looks like you haven’t connected with anyone yet. Try searching with a different name or invite more teammates."
					/>
				</NoResults>
			)}
			<FriendProfileModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				friend={selectedFriend}
				onUnfriend={handleUnfriend}
			/>
		</>
	);
};

export default AllFriends;
