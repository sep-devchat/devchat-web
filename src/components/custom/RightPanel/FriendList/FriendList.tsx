import { useEffect, useState } from "react";
import MemberItem from "../../MemberItem/MemberItem";
import {
	CPHeader,
	CPHeaderLeft,
	CPTitle,
	MemberContent,
	MemberCount,
	MemberSection,
	MembersList,
	PageWrapper,
	SectionHeader,
	SectionTitle,
} from "./FriendList.styled";
import { listFriends } from "@/services/friendAPI";

interface Member {
	id: string;
	name: string;
	avatar: string;
	isOnline: boolean;
}

export default function FriendList() {
	const [friends, setFriends] = useState<Member[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchFriends = async () => {
			try {
				const response = await listFriends(1, 100);
				const friendsData = response.data || [];

				const friendsWithStatus: Member[] = friendsData.map((friend: any) => ({
					id: friend.id,
					name: `${friend.firstName} ${friend.lastName}`,
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

		fetchFriends();
	}, []);

	const handleMessageSend = (memberId: number | string, message: string) => {
		console.log(`Send message to member ${memberId}:`, message);
	};

	const handleButtonClick = (memberId: number | string) => {
		console.log(`Button clicked for member ${memberId}`);
	};

	if (loading) {
		return (
			<PageWrapper>
				<CPHeader>
					<CPHeaderLeft>
						<CPTitle>Friend List</CPTitle>
					</CPHeaderLeft>
				</CPHeader>
				<MemberContent>
					<div style={{ padding: "20px", textAlign: "center" }}>Loading...</div>
				</MemberContent>
			</PageWrapper>
		);
	}

	return (
		<PageWrapper>
			<CPHeader>
				<CPHeaderLeft>
					<CPTitle>Friend List</CPTitle>
				</CPHeaderLeft>
			</CPHeader>
			<MemberContent>
				<MemberSection>
					<SectionHeader>
						<SectionTitle>All Friends</SectionTitle>
						<MemberCount>{friends.length}</MemberCount>
					</SectionHeader>
					<MembersList>
						{friends.length === 0 ? (
							<div
								style={{ padding: "20px", textAlign: "center", color: "#888" }}
							>
								No friends yet
							</div>
						) : (
							friends.map((friend) => (
								<MemberItem
									key={friend.id}
									member={friend}
									showTooltip={true}
									buttonType="more"
									onButtonClick={handleButtonClick}
									onMessageSend={handleMessageSend}
								/>
							))
						)}
					</MembersList>
				</MemberSection>
			</MemberContent>
		</PageWrapper>
	);
}
