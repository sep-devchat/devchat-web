/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import MemberItem from "../../MemberItem/MemberItem";
import {
	CPHeader,
	CPHeaderIcon,
	CPHeaderLeft,
	CPHeaderRight,
	MemberContent,
	MemberCount,
	MemberSection,
	MembersList,
	PageWrapper,
	SectionHeader,
	SectionTitle,
	SearchContainer,
	SearchInput,
} from "./FriendList.styled";
import { listFriends } from "@/services/friendAPI";
import { type RootState } from "@/store";
import { Search, X } from "lucide-react";
import FriendProfileModal from "@/pages/Friend/AllFriends/FriendProfileModal/FriendProfileModal";

interface Member {
	id: string;
	name: string;
	avatar: string;
	isOnline: boolean;

	username: string;
	email: string;
	firstName: string | null;
	lastName: string | null;
	avatarUrl: string;
	isActive: boolean;
	emailVerified: boolean;
	createdAt: string;
	lastLogin: string | null;
	isAdmin: boolean;
}

interface Props {
	onMenuAction: (action: string, name: string, id: string) => void;
}

const FriendList: React.FC<Props> = ({ onMenuAction }) => {
	const [friends, setFriends] = useState<Member[]>([]);
	const [loading, setLoading] = useState(true);
	const [showSearch, setShowSearch] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	const [selectedFriend, setSelectedFriend] = useState<Member | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const currentUserId = useSelector(
		(state: RootState) => state.user.profile?.id,
	);

	const fetchFriends = async () => {
		try {
			setLoading(true);
			const response = await listFriends(1, 100);
			const friendsData = response.data || [];
			const friendsWithStatus: Member[] = friendsData.map((friend: any) => ({
				id: friend.id,
				name: `${friend.firstName} ${friend.lastName}`,
				username: friend.username,
				email: friend.email,
				firstName: friend.firstName,
				lastName: friend.lastName,
				avatarUrl: friend.avatarUrl,
				isActive: friend.isActive,
				emailVerified: friend.emailVerified,
				createdAt: friend.createdAt,
				lastLogin: friend.lastLogin,
				isAdmin: friend.isAdmin,
				avatar:
					friend.avatarUrl ||
					"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
				isOnline: Math.random() > 0.5,
			}));
			setFriends(friendsWithStatus);
		} catch (error) {
			console.error("Error fetching friends:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		console.log("Fetching friend list...", loading);
		fetchFriends();
	}, []);

	useEffect(() => {
		const handleFriendListUpdate = () => {
			console.log("Friend list update event received, refetching...");
			fetchFriends();
		};
		window.addEventListener("friendListUpdated", handleFriendListUpdate);
		return () => {
			window.removeEventListener("friendListUpdated", handleFriendListUpdate);
		};
	}, []);

	const handleButtonClick = (member: Member) => {
		setSelectedFriend(member);
		setIsModalOpen(true);
	};

	const toggleSearch = () => {
		setShowSearch(!showSearch);
		if (showSearch) {
			setSearchQuery("");
		}
	};

	const filteredFriends = friends.filter((friend) =>
		friend.name.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const handleUnfriend = (id: string, name: string) => {
		onMenuAction("Unfriend", name, id);
	};

	return (
		<PageWrapper>
			<CPHeader>
				<CPHeaderLeft>
					{showSearch && (
						<SearchContainer>
							<SearchInput
								type="text"
								placeholder="Search friends..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								autoFocus
							/>
						</SearchContainer>
					)}
				</CPHeaderLeft>
				<CPHeaderRight>
					<CPHeaderIcon onClick={toggleSearch}>
						{showSearch ? <X size={20} /> : <Search size={20} />}
					</CPHeaderIcon>
				</CPHeaderRight>
			</CPHeader>
			<MemberContent>
				<MemberSection>
					<SectionHeader>
						<SectionTitle>
							{searchQuery ? "Search Results" : "All Friends"}
						</SectionTitle>
						<MemberCount>{filteredFriends.length}</MemberCount>
					</SectionHeader>
					<MembersList>
						{filteredFriends.length === 0 ? (
							<div
								style={{ padding: "20px", textAlign: "center", color: "#888" }}
							>
								{searchQuery ? "No friends found" : "No friends yet"}
							</div>
						) : (
							filteredFriends.map((friend) => (
								<MemberItem
									key={friend.id}
									member={friend}
									showTooltip={true}
									buttonType="more"
									onButtonClick={() => handleButtonClick(friend)}
									currentUserId={currentUserId}
								/>
							))
						)}
					</MembersList>
				</MemberSection>
			</MemberContent>
			<FriendProfileModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				friend={selectedFriend}
				onUnfriend={handleUnfriend}
			/>
		</PageWrapper>
	);
};

export default FriendList;
