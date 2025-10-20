import React from "react";
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

interface FriendType {
	id: string;
	name: string;
	handle: string;
	avatar: string;
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
	onMenuAction: (action: string, name: string) => void;
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
					<FriendCard key={friend.id}>
						<CardContent>
							<CardHeader>
								<div
									style={{ display: "flex", gap: "8px", alignItems: "center" }}
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
									<MenuButton onClick={(e) => onMenuToggle(friend.id, e)}>
										<MoreHorizontal size={20} color="#6B7280" />
									</MenuButton>

									{activeMenu === friend.id && (
										<MenuDropdown>
											<MenuItem
												onClick={() => onMenuAction("Yêu thích", friend.name)}
											>
												<Star size={18} style={{ marginRight: "12px" }} />
												<span>Yêu thích</span>
											</MenuItem>
											<MenuItem
												onClick={() => onMenuAction("Hủy kết bạn", friend.name)}
											>
												<UserMinus size={18} style={{ marginRight: "12px" }} />
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
							onClick={() => setCurrentPage(index + 1)}
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

export default AllFriends;
