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
	direction?: "received" | "sent";
	raw?: any;
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
	onCancelGroup: (id: string) => void;
	isLoadingPending?: boolean;
}

const safeLower = (v?: string) => (v ?? "").toLowerCase();

const badgeStyle: React.CSSProperties = {
	fontSize: 11,
	padding: "2px 8px",
	borderRadius: 12,
	background: "#F3F4F6",
	color: "#374151",
	marginLeft: 8,
	display: "inline-block",
};

const groupBadgeStyle: React.CSSProperties = {
	...badgeStyle,
	background: "#EEF2FF",
	color: "#3730A3",
};

const friendBadgeStyle: React.CSSProperties = {
	...badgeStyle,
	background: "#ECFDF5",
	color: "#065F46",
};

const smallHintStyle: React.CSSProperties = {
	fontSize: 12,
	color: "#6B7280",
	marginTop: 2,
};

const columnWrapperStyle: React.CSSProperties = {
	display: "grid",
	gridTemplateColumns: "1fr 1fr",
	gap: 24,
	alignItems: "start",
	marginTop: 12,
};

/** Responsive: on small screens switch to single column */
const responsiveStyle: React.CSSProperties = {
	width: "100%",
};

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
	onCancelGroup,
	isLoadingPending,
}) => {
	const q = searchPending.toLowerCase();

	// Friends
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

	// Groups
	const groupReceived = pendingGroupInvites.filter(
		(r) => r.direction === "received",
	);
	const groupSent = pendingGroupInvites.filter((r) => r.direction === "sent");

	const filteredGroupReceived = groupReceived.filter(
		(inv) =>
			safeLower(inv.groupName).includes(q) ||
			safeLower(inv.inviterName).includes(q),
	);
	const filteredGroupSent = groupSent.filter(
		(inv) =>
			safeLower(inv.groupName).includes(q) ||
			safeLower(inv.inviterName).includes(q),
	);

	const hasAnyResults =
		filteredFriendReceived.length > 0 ||
		filteredFriendSent.length > 0 ||
		filteredGroupReceived.length > 0 ||
		filteredGroupSent.length > 0;

	return (
		<>
			<Title>Pending Page</Title>
			<Subtitle>
				View your sent and incoming requests — friends (left) & group invites
				(right)
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

			{/* GRID: Left = Friends, Right = Groups */}
			<div
				style={{
					...columnWrapperStyle,
				}}
			>
				{/* LEFT COLUMN: FRIENDS */}
				<div style={responsiveStyle}>
					{/* FRIEND - RECEIVED */}
					{filteredFriendReceived.length > 0 && (
						<>
							<SectionHeader>
								Friend Requests — Received ({filteredFriendReceived.length})
							</SectionHeader>
							<ResultsList style={{ marginBottom: 16 }}>
								{filteredFriendReceived.map((req) => (
									<ResultItem key={req.id}>
										<Avatar src={req.avatar} alt={req.name} />
										<UserInfo>
											<div style={{ display: "flex", alignItems: "center" }}>
												<UserName>{req.name}</UserName>
												<span style={friendBadgeStyle}>Friend</span>
											</div>
											<UserHandle>{req.handle}</UserHandle>
											<div style={smallHintStyle}>Received friend request</div>
										</UserInfo>
										<ActionButtons>
											<ActionButton
												variant="accept"
												onClick={() => onAcceptFriend(req.id)}
												aria-label={`Accept friend ${req.name}`}
												title="Accept friend"
											>
												✓
											</ActionButton>
											<ActionButton
												variant="decline"
												onClick={() => onDeclineFriend(req.id)}
												aria-label={`Decline friend ${req.name}`}
												title="Decline friend"
											>
												✕
											</ActionButton>
										</ActionButtons>
									</ResultItem>
								))}
							</ResultsList>
						</>
					)}

					{/* FRIEND - SENT */}
					{filteredFriendSent.length > 0 && (
						<>
							<SectionHeader>
								Friend Requests — Sent ({filteredFriendSent.length})
							</SectionHeader>
							<ResultsList style={{ marginBottom: 16 }}>
								{filteredFriendSent.map((req) => (
									<ResultItem key={req.id}>
										<Avatar src={req.avatar} alt={req.name} />
										<UserInfo>
											<div style={{ display: "flex", alignItems: "center" }}>
												<UserName>{req.name}</UserName>
												<span style={friendBadgeStyle}>Friend</span>
											</div>
											<UserHandle>{req.handle}</UserHandle>
											<div style={smallHintStyle}>You sent this request</div>
										</UserInfo>

										{/* Cancel button: show X, tooltip via title */}
										<ActionButton
											variant="unfriend"
											onClick={() => onCancelFriend(req.id)}
											aria-label={`Cancel friend request to ${req.name}`}
											title="Cancel Request"
										>
											✕
										</ActionButton>
									</ResultItem>
								))}
							</ResultsList>
						</>
					)}
				</div>

				{/* RIGHT COLUMN: GROUPS */}
				<div style={responsiveStyle}>
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
											<div style={{ display: "flex", alignItems: "center" }}>
												<UserName>{inv.groupName}</UserName>
												<span style={groupBadgeStyle}>Group</span>
											</div>
											<UserHandle>
												{inv.inviterName
													? `Invited by ${inv.inviterName}`
													: "Group invitation"}
											</UserHandle>
											<div style={smallHintStyle}>
												Incoming group invite — join the group to participate
											</div>
										</UserInfo>
										<ActionButtons>
											<ActionButton
												variant="accept"
												onClick={() => onAcceptGroup(inv.id)}
												aria-label={`Join group ${inv.groupName}`}
												title="Join group"
											>
												✓ Join
											</ActionButton>
											<ActionButton
												variant="decline"
												onClick={() => onDeclineGroup(inv.id)}
												aria-label={`Decline group invite ${inv.groupName}`}
												title="Decline invite"
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
					{filteredGroupSent.length > 0 && (
						<>
							<SectionHeader>
								Group Invites — Sent ({filteredGroupSent.length})
							</SectionHeader>
							<ResultsList style={{ marginBottom: 16 }}>
								{filteredGroupSent.map((inv) => (
									<ResultItem key={inv.id}>
										<Avatar src={inv.inviterAvatar} alt={inv.groupName} />
										<UserInfo>
											<div style={{ display: "flex", alignItems: "center" }}>
												<UserName>{inv.groupName}</UserName>
												<span style={groupBadgeStyle}>Group</span>
											</div>
											<UserHandle>
												{inv.inviterName
													? `Invited by ${inv.inviterName}`
													: "You sent this invite"}
											</UserHandle>
											<div style={smallHintStyle}>
												Pending invite — you can cancel it
											</div>
										</UserInfo>

										{/* Cancel invite: show X, tooltip via title */}
										<ActionButton
											variant="unfriend"
											onClick={() => onCancelGroup(inv.id)}
											aria-label={`Cancel invite to ${inv.groupName}`}
											title="Cancel Invite"
										>
											✕
										</ActionButton>
									</ResultItem>
								))}
							</ResultsList>
						</>
					)}
				</div>
			</div>

			{/* Empty state */}
			{!hasAnyResults && !isLoadingPending && (
				<div style={{ marginTop: 20 }}>
					<NoResults>No invitations available.</NoResults>
				</div>
			)}
		</>
	);
};

export default Pending;
