/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
	Search,
	Users,
	UserPlus,
	Mail,
	Send,
	Eye,
	CheckIcon,
	X,
} from "lucide-react";
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
} from "../Friend.styled";

import { UserLanguage } from "@/services/auth/auth.type";

interface PendingFriend {
	id: string;
	name: string;
	handle: string;
	avatar?: string;
	direction: "received" | "sent";
	raw?: any;
	userLanguages?: UserLanguage[];
	userId?: string;
}

interface PendingGroup {
	id: string;
	groupId?: string;
	groupName: string;
	groupAvatar?: string;
	inviterName?: string;
	inviterAvatar?: string;
	toUserName?: string;
	direction: "received" | "sent";
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
	onViewFriendProfile?: (friend: PendingFriend) => void;
	isLoadingPending?: boolean;
}

const AVATAR_COLORS = ["#184EAB"];

const getGroupInitials = (name: string): string => {
	if (!name || name.trim() === "") return "GR";

	const initials = name
		.split(" ")
		.map((s) => s[0] ?? "")
		.join("")
		.slice(0, 2)
		.toUpperCase();

	return initials || "GR";
};

const getAvatarColorFromName = (name: string): string => {
	if (!name) return AVATAR_COLORS[0];

	let hash = 0;
	for (let i = 0; i < name.length; i++) {
		hash = name.charCodeAt(i) + ((hash << 5) - hash);
	}

	const index = Math.abs(hash) % AVATAR_COLORS.length;
	return AVATAR_COLORS[index];
};

const GroupAvatarComponent: React.FC<{
	src?: string | null;
	name: string;
}> = ({ src, name }) => {
	const [imageError, setImageError] = React.useState(false);
	const hasAvatar = src && src.trim() !== "" && !imageError;

	if (hasAvatar) {
		return <Avatar src={src} alt={name} onError={() => setImageError(true)} />;
	}

	const initials = getGroupInitials(name);
	const bgColor = getAvatarColorFromName(name);

	return (
		<div
			style={{
				width: "40px",
				height: "40px",
				borderRadius: "50%",
				backgroundColor: bgColor,
				color: "#FFFFFF",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				fontWeight: 600,
				fontSize: "14px",
				flexShrink: 0,
				marginRight: "24px",
			}}
		>
			{initials}
		</div>
	);
};

const UserLanguagesDisplay: React.FC<{ userLanguages?: UserLanguage[] }> = ({
	userLanguages,
}) => {
	React.useEffect(() => {}, [userLanguages]);

	if (!userLanguages || userLanguages.length === 0) {
		return null;
	}

	const sortedLanguages = [...userLanguages]
		.sort((a, b) => (a.orderIndex ?? 999) - (b.orderIndex ?? 999))
		.slice(0, 3);

	return (
		<div
			style={{
				display: "flex",
				gap: "6px",
				marginTop: "4px",
				flexWrap: "wrap",
			}}
		>
			{sortedLanguages.map((lang, idx) => {
				const languageName = lang.language?.languageName || "Unknown";
				const iconUrl = lang.language?.languageIcon;

				return (
					<div
						key={lang.id || `${lang.languageId}-${idx}`}
						style={{
							display: "flex",
							alignItems: "center",
							gap: "4px",
							padding: "2px 8px",
							backgroundColor: "#F3F4F6",
							borderRadius: "12px",
							fontSize: "11px",
							color: "#374151",
							fontWeight: 500,
						}}
						title={`${languageName} - ${lang.proficiencyLevel}`}
					>
						{iconUrl && (
							<img
								src={iconUrl}
								alt={languageName}
								style={{
									width: "14px",
									height: "14px",
									borderRadius: "2px",
									objectFit: "contain",
								}}
								onError={(e) => {
									const img = e.target as HTMLImageElement;
									img.style.display = "none";
								}}
							/>
						)}
						<span>{languageName}</span>
					</div>
				);
			})}
		</div>
	);
};

const safeLower = (v?: string) => (v ?? "").toLowerCase();

const EmptyState: React.FC<{
	icon: React.ReactNode;
	title: string;
	description: string;
	bgColor: string;
	iconBgColor: string;
	iconColor: string;
}> = ({ icon, title, description, bgColor, iconBgColor, iconColor }) => (
	<div
		style={{
			background: bgColor,
			borderRadius: "8px",
			display: "flex",
			alignItems: "center",
			gap: "12px",
			border: "1px solid #f0f0f0",
			paddingTop: "12px",
			paddingBottom: "12px",
			paddingLeft: "16px",
			paddingRight: "16px",
			minHeight: "37px",
			transition: "background-color 0.2s ease",
			width: "95%",
			margin: "0 auto",
		}}
	>
		<div
			style={{
				width: "40px",
				height: "40px",
				borderRadius: "50%",
				background: iconBgColor,
				color: iconColor,
				objectFit: "cover",
				marginRight: "12px",
			}}
		>
			<span
				style={{
					alignItems: "center",
					display: "flex",
					justifyContent: "center",
					height: "100%",
				}}
			>
				{icon}
			</span>
		</div>
		<UserInfo>
			<div style={{ display: "flex", alignItems: "center" }}>
				<UserName>{title}</UserName>
			</div>
			<UserHandle>{description}</UserHandle>
		</UserInfo>
	</div>
);

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
	onViewFriendProfile,
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

	return (
		<div>
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

			<div>
				<div>
					{/* FRIEND - RECEIVED */}
					<SectionHeader>
						Friend Requests — Received ({filteredFriendReceived.length})
					</SectionHeader>
					{filteredFriendReceived.length > 0 ? (
						<ResultsList style={{ marginBottom: 16 }}>
							{filteredFriendReceived.map((req) => (
								<ResultItem key={req.id}>
									<Avatar src={req.avatar} alt={req.name} />
									<UserInfo style={{ flex: 1 }}>
										<div style={{ display: "flex", alignItems: "center" }}>
											<UserName>{req.name}</UserName>
										</div>
										<UserHandle>{req.handle}</UserHandle>
										<UserLanguagesDisplay userLanguages={req.userLanguages} />
									</UserInfo>
									<ActionButtons>
										{onViewFriendProfile && (
											<ActionButton
												variant="view"
												onClick={() => onViewFriendProfile(req)}
												aria-label={`View profile of ${req.name}`}
												title="View profile"
											>
												<Eye size={16} />
											</ActionButton>
										)}
										<ActionButton
											variant="accept"
											onClick={() => onAcceptFriend(req.id)}
											aria-label={`Accept friend ${req.name}`}
											title="Accept friend"
										>
											<CheckIcon size={16} />
										</ActionButton>
										<ActionButton
											variant="decline"
											onClick={() => onDeclineFriend(req.id)}
											aria-label={`Decline friend ${req.name}`}
											title="Decline friend"
										>
											<X size={16} />
										</ActionButton>
									</ActionButtons>
								</ResultItem>
							))}
						</ResultsList>
					) : (
						<EmptyState
							icon={<UserPlus size={20} />}
							title="No incoming friend requests"
							description="Friend requests from others will appear here"
							bgColor="#FEF3C7"
							iconBgColor="#FDE68A"
							iconColor="#92400E"
						/>
					)}

					{/* FRIEND - SENT */}
					<SectionHeader style={{ marginTop: 16 }}>
						Friend Requests — Sent ({filteredFriendSent.length})
					</SectionHeader>
					{filteredFriendSent.length > 0 ? (
						<ResultsList style={{ marginBottom: 16 }}>
							{filteredFriendSent.map((req) => (
								<ResultItem key={req.id}>
									<Avatar src={req.avatar} alt={req.name} />
									<UserInfo style={{ flex: 1 }}>
										<div style={{ display: "flex", alignItems: "center" }}>
											<UserName>{req.name}</UserName>
										</div>
										<UserHandle>{req.handle}</UserHandle>
										<UserLanguagesDisplay userLanguages={req.userLanguages} />
									</UserInfo>
									<ActionButtons>
										{onViewFriendProfile && (
											<ActionButton
												variant="view"
												onClick={() => onViewFriendProfile(req)}
												aria-label={`View profile of ${req.name}`}
												title="View profile"
											>
												<Eye size={16} />
											</ActionButton>
										)}
										<ActionButton
											variant="unfriend"
											onClick={() => onCancelFriend(req.id)}
											aria-label={`Cancel friend request to ${req.name}`}
											title="Cancel Request"
										>
											✕
										</ActionButton>
									</ActionButtons>
								</ResultItem>
							))}
						</ResultsList>
					) : (
						<EmptyState
							icon={<Send size={20} />}
							title="No sent friend requests"
							description="Friend requests you send will appear here until accepted"
							bgColor="#DBEAFE"
							iconBgColor="#93C5FD"
							iconColor="#1E3A8A"
						/>
					)}
				</div>

				{/* RIGHT COLUMN: GROUPS */}
				<div>
					{/* GROUP INVITES - RECEIVED */}
					<SectionHeader style={{ marginTop: 16 }}>
						Group Invites — Received ({filteredGroupReceived.length})
					</SectionHeader>
					{filteredGroupReceived.length > 0 ? (
						<ResultsList style={{ marginBottom: 16 }}>
							{filteredGroupReceived.map((inv) => (
								<ResultItem key={inv.id}>
									<GroupAvatarComponent
										src={inv.groupAvatar}
										name={inv.groupName}
									/>
									<UserInfo>
										<div style={{ display: "flex", alignItems: "center" }}>
											<UserName>{inv.groupName}</UserName>
										</div>
										<UserHandle>
											{inv.inviterName
												? `Invited by ${inv.inviterName}`
												: "Group invitation"}
										</UserHandle>
									</UserInfo>
									<ActionButtons>
										<ActionButton
											variant="accept"
											onClick={() => onAcceptGroup(inv.id)}
											aria-label={`Join group ${inv.groupName}`}
											title="Join group"
										>
											✓
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
					) : (
						<EmptyState
							icon={<Users size={20} />}
							title="No incoming group invites"
							description="Group invitations from others will appear here"
							bgColor="#FEF3C7"
							iconBgColor="#FDE68A"
							iconColor="#92400E"
						/>
					)}

					{/* GROUP INVITES - SENT */}
					<SectionHeader style={{ marginTop: 16 }}>
						Group Invites — Sent ({filteredGroupSent.length})
					</SectionHeader>
					{filteredGroupSent.length > 0 ? (
						<ResultsList style={{ marginBottom: 16 }}>
							{filteredGroupSent.map((inv) => (
								<ResultItem key={inv.id}>
									<GroupAvatarComponent
										src={inv.groupAvatar}
										name={inv.groupName}
									/>
									<UserInfo>
										<div style={{ display: "flex", alignItems: "center" }}>
											<UserName>{inv.groupName}</UserName>
										</div>
										<UserHandle>
											{inv.toUserName
												? `You sent this invite to ${inv.toUserName}`
												: "You sent this invite"}
										</UserHandle>
									</UserInfo>

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
					) : (
						<EmptyState
							icon={<Mail size={20} />}
							title="No sent group invites"
							description="Group invites you send will appear here until accepted"
							bgColor="#DBEAFE"
							iconBgColor="#93C5FD"
							iconColor="#1E3A8A"
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default Pending;
