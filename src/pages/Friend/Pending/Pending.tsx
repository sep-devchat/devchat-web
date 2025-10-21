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
} from "../Friend.styled";

interface PendingRequest {
	id: string;
	name: string;
	handle: string;
	avatar: string;
	type: "received" | "sent";
}

interface Props {
	pendingRequests: PendingRequest[];
	searchPending: string;
	setSearchPending: (s: string) => void;
	onAccept: (id: string) => void;
	onDecline: (id: string) => void;
	onCancelSent: (id: string) => void;
}

const Pending: React.FC<Props> = ({
	pendingRequests,
	searchPending,
	setSearchPending,
	onAccept,
	onDecline,
	onCancelSent,
}) => {
	const received = pendingRequests.filter((req) => req.type === "received");
	const sent = pendingRequests.filter((req) => req.type === "sent");

	const filteredReceived = received.filter(
		(req) =>
			req.name.toLowerCase().includes(searchPending.toLowerCase()) ||
			req.handle.toLowerCase().includes(searchPending.toLowerCase()),
	);
	const filteredSent = sent.filter(
		(req) =>
			req.name.toLowerCase().includes(searchPending.toLowerCase()) ||
			req.handle.toLowerCase().includes(searchPending.toLowerCase()),
	);

	return (
		<>
			<Title>Pending Page</Title>
			<Subtitle>View your sent and incoming requests</Subtitle>

			<SearchContainer>
				<Search size={20} />
				<SearchInput
					type="text"
					placeholder="Search pending requests..."
					value={searchPending}
					onChange={(e) => setSearchPending(e.target.value)}
				/>
			</SearchContainer>

			{filteredReceived.length > 0 && (
				<>
					<SectionHeader>Received - {filteredReceived.length}</SectionHeader>
					<ResultsList style={{ marginBottom: "24px" }}>
						{filteredReceived.map((request) => (
							<ResultItem key={request.id}>
								<Avatar src={request.avatar} alt={request.name} />
								<UserInfo>
									<UserName>{request.name}</UserName>
									<UserHandle>{request.handle}</UserHandle>
								</UserInfo>
								<ActionButtons>
									<ActionButton
										variant="accept"
										onClick={() => onAccept(request.id)}
									>
										✓
									</ActionButton>
									<ActionButton
										variant="decline"
										onClick={() => onDecline(request.id)}
									>
										✕
									</ActionButton>
								</ActionButtons>
							</ResultItem>
						))}
					</ResultsList>
				</>
			)}

			{filteredSent.length > 0 && (
				<>
					<SectionHeader>Sent - {filteredSent.length}</SectionHeader>
					<ResultsList>
						{filteredSent.map((request) => (
							<ResultItem key={request.id}>
								<Avatar src={request.avatar} alt={request.name} />
								<UserInfo>
									<UserName>{request.name}</UserName>
									<UserHandle>{request.handle}</UserHandle>
								</UserInfo>
								<ActionButton
									variant="unfriend"
									onClick={() => onCancelSent(request.id)}
								>
									✕
								</ActionButton>
							</ResultItem>
						))}
					</ResultsList>
				</>
			)}
		</>
	);
};

export default Pending;
