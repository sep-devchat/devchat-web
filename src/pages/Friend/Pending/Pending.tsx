/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Search } from "lucide-react";
import {
	Title,
	Subtitle,
	SearchContainer,
	SearchInput,
	ResultsList,
	ResultItem,
	Avatar,
	UserInfo,
	UserName,
	UserHandle,
	ActionButtons,
	ActionButton,
	SectionHeader,
	NoResults,
} from "../Friend.styled";

interface PendingFriend {
	id: string;
	name: string;
	handle: string;
	avatar?: string;
	direction?: "received" | "sent";
	raw?: any;
}

interface PendingGroup {
	id: string;
	groupId?: string;
	groupName: string;
	inviterName?: string;
	inviterAvatar?: string;
}

interface Props {
	pendingFriendRequests: PendingFriend[];
	pendingGroupInvites: PendingGroup[];
	searchPending: string;
	setSearchPending: (s: string) => void;
	onAcceptFriend: (id: string) => void;
	onDeclineFriend: (id: string) => void;
	onCancelFriend: (id: string) => void;
	onAcceptGroup: (id: string) => void;
	onDeclineGroup: (id: string) => void;
	isLoadingPending?: boolean;
}

const safeLower = (v?: string) => (v ?? "").toLowerCase();

const Pending: React.FC<Props> = ({
	pendingFriendRequests,
	pendingGroupInvites,
	searchPending,
	setSearchPending,
	onAcceptFriend,
	onDeclineFriend,
	onCancelFriend,
	onAcceptGroup,
	onDeclineGroup,
	isLoadingPending,
}) => {
	const q = searchPending.toLowerCase();

	const friendReceived = pendingFriendRequests.filter(
		(r) => r.direction === "received",
	);
	const friendSent = pendingFriendRequests.filter(
		(r) => r.direction === "sent",
	);

	const filteredFriendReceived = friendReceived.filter(
		(req) =>
			safeLower(req.name).includes(q) || safeLower(req.handle).includes(q),
	);
	const filteredFriendSent = friendSent.filter(
		(req) =>
			safeLower(req.name).includes(q) || safeLower(req.handle).includes(q),
	);

	// Group invites
	// const groupReceived = pendingGroupInvites.filter(
	// 	(r) => r.direction === "received",
	// );
	// const groupSent = pendingGroupInvites.filter((r) => r.direction === "sent");

	const filteredGroupReceived = pendingGroupInvites.filter(
		(inv) =>
			safeLower(inv.groupName).includes(q) ||
			safeLower(inv.inviterName).includes(q),
	);
	// const filteredGroupSent = groupSent.filter(
	// 	(inv) =>
	// 		safeLower(inv.groupName).includes(q) ||
	// 		safeLower(inv.inviterName).includes(q),
	// );

	const hasAnyResults =
		filteredFriendReceived.length > 0 ||
		filteredFriendSent.length > 0 ||
		filteredGroupReceived.length > 0;
		// filteredGroupSent.length > 0;

	return (
		<>
			<Title>Pending Page</Title>
			<Subtitle>
				View your sent and incoming requests (friends & group invites)
			</Subtitle>

			<SearchContainer>
				<Search size={20} />
				<SearchInput
					type="text"
					placeholder="Search pending requests... (name / username / group)"
					value={searchPending}
					onChange={(e) => setSearchPending(e.target.value)}
				/>
			</SearchContainer>

			{isLoadingPending && (
				<div style={{ padding: 12, color: "#6B7280" }}>
					Loading pending invites...
				</div>
			)}

			{filteredFriendReceived.length > 0 && (
				<>
					<SectionHeader>
						Received - {filteredFriendReceived.length}
					</SectionHeader>
					<ResultsList style={{ marginBottom: 16 }}>
						{filteredFriendReceived.map((req) => (
							<ResultItem key={req.id}>
								<Avatar src={req.avatar} alt={req.name} />
								<UserInfo>
									<UserName>{req.name}</UserName>
									<UserHandle>{req.handle}</UserHandle>
								</UserInfo>
								<ActionButtons>
									<ActionButton
										variant="accept"
										onClick={() => onAcceptFriend(req.id)}
									>
										✓
									</ActionButton>
									<ActionButton
										variant="decline"
										onClick={() => onDeclineFriend(req.id)}
									>
										✕
									</ActionButton>
								</ActionButtons>
							</ResultItem>
						))}
					</ResultsList>
				</>
			)}

			{filteredFriendSent.length > 0 && (
				<>
					<SectionHeader>Sent - {filteredFriendSent.length}</SectionHeader>
					<ResultsList style={{ marginBottom: 16 }}>
						{filteredFriendSent.map((req) => (
							<ResultItem key={req.id}>
								<Avatar src={req.avatar} alt={req.name} />
								<UserInfo>
									<UserName>{req.name}</UserName>
									<UserHandle>{req.handle}</UserHandle>
								</UserInfo>
								<ActionButton
									variant="unfriend"
									onClick={() => onCancelFriend(req.id)}
								>
									✕
								</ActionButton>
							</ResultItem>
						))}
					</ResultsList>
				</>
			)}

			{/* GROUP INVITES - RECEIVED */}
			{filteredGroupReceived.length > 0 && (
				<>
					<SectionHeader>
						Group Invites — Received ({filteredGroupReceived.length})
					</SectionHeader>
					<ResultsList style={{ marginBottom: 16 }}>
						{filteredGroupReceived.map((inv) => (
							<ResultItem key={inv.id}>
								<Avatar src={inv.inviterAvatar} alt={inv.groupName} />
								<UserInfo>
									<UserName>{inv.groupName}</UserName>
									<UserHandle>
										{inv.inviterName ? `Invited by ${inv.inviterName}` : ""}
									</UserHandle>
								</UserInfo>
								<ActionButtons>
									<ActionButton
										variant="accept"
										onClick={() => onAcceptGroup(inv.id)}
									>
										✓
									</ActionButton>
									<ActionButton
										variant="decline"
										onClick={() => onDeclineGroup(inv.id)}
									>
										✕
									</ActionButton>
								</ActionButtons>
							</ResultItem>
						))}
					</ResultsList>
				</>
			)}

			{/* GROUP INVITES - SENT */}
			{/* {filteredGroupSent.length > 0 && (
				<>
					<SectionHeader>
						Group Invites — Sent ({filteredGroupSent.length})
					</SectionHeader>
					<ResultsList style={{ marginBottom: 16 }}>
						{filteredGroupSent.map((inv) => (
							<ResultItem key={inv.id}>
								<Avatar src={inv.inviterAvatar} alt={inv.groupName} />
								<UserInfo>
									<UserName>{inv.groupName}</UserName>
									<UserHandle>
										{inv.inviterName ? `Invited by ${inv.inviterName}` : ""}
									</UserHandle>
								</UserInfo>
								<ActionButton
									variant="unfriend"
									onClick={() => console.log("Cancel group invite:", inv.id)}
								>
									✕
								</ActionButton>
							</ResultItem>
						))}
					</ResultsList>
				</>
			)} */}

			{/* Empty state */}
			{!hasAnyResults && !isLoadingPending && (
				<NoResults>No invitations available.</NoResults>
			)}
		</>
	);
};

export default Pending;
