import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
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
} from "../Friend.styled";
import { getMutualFriends } from "@/services/friendAPI";

interface User {
	id: string;
	name: string;
	handle: string;
	avatar: string;
	mutualFriends: number;
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
	const [mutualFriendsCount, setMutualFriendsCount] = useState<
		Record<string, number>
	>({});
	const [loadingMutual, setLoadingMutual] = useState(false);

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

	return (
		<>
			<Title>Let's find and add friends!</Title>
			<Subtitle>
				You can find and add friends with their email/username
			</Subtitle>

			<SearchContainer>
				<Search size={20} />
				<SearchInput
					type="text"
					placeholder="Search by name or username"
					value={searchAdd}
					onChange={(e) => onSearchAdd(e.target.value)}
					disabled={isLoadingUsers}
				/>
				<SendButton
					onClick={onSendRequest}
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
				<div style={{ textAlign: "center", padding: "20px", color: "#6B7280" }}>
					Loading users...
				</div>
			)}

			{searchResults.length > 0 && !isUserSelectedFromList && (
				<ResultsList>
					{searchResults.map((user) => (
						<ResultItem
							key={user.id}
							selected={selectedUser?.id === user.id}
							onClick={() => onSelectUser(user)}
						>
							<Avatar src={user.avatar} alt={user.name} />
							<UserInfo>
								<UserName>{user.name}</UserName>
								<UserHandle>{user.handle}</UserHandle>
							</UserInfo>
							<MutualFriends>
								{loadingMutual
									? "Loading..."
									: `${mutualFriendsCount[user.id] ?? 0} mutual friends`}
							</MutualFriends>
						</ResultItem>
					))}
				</ResultsList>
			)}
		</>
	);
};

export default AddFriend;
