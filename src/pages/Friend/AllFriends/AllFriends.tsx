import React, { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { MoreHorizontal, Star, UserMinus } from "lucide-react";
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
import { getMutualFriends } from "@/services/friendAPI";

interface FriendType {
	id: string;
	name: string;
	firstName: string | null;
	lastName: string | null;
	handle: string;
	avatarUrl: string;
	mutualFriends: number;
}

interface Props {
	allFriends: FriendType[];
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

	const filteredFriends = allFriends.filter((friend) => {
		const name = (friend.name ?? "").toString().toLowerCase();
		const handle = (friend.handle ?? "").toString().toLowerCase();
		const q = searchAll.toLowerCase();
		return name.includes(q) || handle.includes(q);
	});

	const indexOfLastFriend = currentPage * friendsPerPage;
	const indexOfFirstFriend = indexOfLastFriend - friendsPerPage;
	const currentFriends = filteredFriends.slice(
		indexOfFirstFriend,
		indexOfLastFriend,
	);
	const totalPages = Math.ceil(filteredFriends.length / friendsPerPage);

	return (
		<>
			<Title>All Friend - {allFriends.length}</Title>
			<Subtitle>Here are your friends.</Subtitle>

			<SearchContainer>
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
									style={{ display: "flex", gap: "8px", alignItems: "center" }}
								>
									<Avatar src={friend.avatarUrl} alt={friend.name} />
									<FriendInfo>
										<FriendName>
											{friend.name ??
												`${friend.firstName ?? ""} ${friend.lastName ?? ""}`}
										</FriendName>
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
													onMenuAction("Profile", friend.name, friend.id);
												}}
											>
												<Star size={18} style={{ marginRight: "12px" }} />
												<span>Profile</span>
											</MenuItem>
											<MenuItem
												onClick={(e) => {
													e.stopPropagation();
													onMenuAction("Unfriend", friend.name, friend.id);
												}}
											>
												<UserMinus size={18} style={{ marginRight: "12px" }} />
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
							onClick={() => setCurrentPage(index + 1)}
							$active={currentPage === index + 1}
						>
							{index + 1}
						</PageButton>
					))}
				</PaginationContainer>
			)}

			{filteredFriends.length === 0 && <NoResults>No friends found.</NoResults>}
		</>
	);
};

export default AllFriends;
