import React from "react";
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
							<MutualFriends>{user.mutualFriends} mutual friends</MutualFriends>
						</ResultItem>
					))}
				</ResultsList>
			)}
		</>
	);
};

export default AddFriend;
