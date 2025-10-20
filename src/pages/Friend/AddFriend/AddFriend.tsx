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
}

const AddFriend: React.FC<Props> = ({
	searchAdd,
	onSearchAdd,
	searchResults,
	onSelectUser,
	selectedUser,
	onSendRequest,
}) => {
	return (
		<>
			<Title>Let's find and add friends!</Title>
			<Subtitle>
				You can find and add friends with their email/username
			</Subtitle>

			<SearchContainer>
				<Search size={20} color="#1A1A1A" />
				<SearchInput
					type="text"
					placeholder="Search by name or username"
					value={searchAdd}
					onChange={(e) => onSearchAdd(e.target.value)}
				/>
				<SendButton
					onClick={onSendRequest}
					disabled={!selectedUser || !searchAdd.trim()}
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
