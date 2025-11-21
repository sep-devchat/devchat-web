/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";
import { ArrowLeft, Search, X } from "lucide-react";
import MemberItem from "../../MemberItem/MemberItem";
import {
	CloseButton,
	CPHeader,
	CPHeaderLeft,
	CPHeaderRight,
	CPTitle,
	MemberContent,
	MemberCount,
	MemberSection,
	MembersList,
	MesContentHeader,
	MesContentItem,
	MesResultItem,
	Message,
	NoneResult,
	PageWrapper,
	SearchButton,
	SearchHeader,
	SearchResultTotal,
	SectionHeader,
	SectionTitle,
	SenderAvatar,
	SenderName,
	Timestamp,
} from "./MemberList.styled";
import { useDispatch, useSelector } from "react-redux";
import { type RootState, type AppDispatch } from "@/store";
import { fetchGroupMembers, setCurrentGroup } from "@/store/groupMembers.slice";
import IconButton from "../../ActionButton/IconButton";
import { theme } from "@/themes";
import SearchInput from "../../SearchInput/SearchInput";

interface MemberListProps {
	onClose?: () => void;
}

const mockMessages = [
	{
		id: 1,
		senderId: 1,
		senderName: "Trần Nguyễn Như Nguyên",
		senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
		message: "Chờ search bên add friend hả",
		timestamp: "2 giờ",
	},
	{
		id: 2,
		senderId: 2,
		senderName: "Hà Trang",
		senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
		message: "Cái add mail nè, t tính bỏ đi",
		timestamp: "5 ngày",
	},
	{
		id: 3,
		senderId: 1,
		senderName: "Trần Nguyễn Như Nguyên",
		senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
		message: "Cái đó là t add lại cho",
		timestamp: "2 tuần",
	},
	{
		id: 4,
		senderId: 1,
		senderName: "Trần Nguyễn Như Nguyên",
		senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
		message: "...ais nay la moi add do dung hong",
		timestamp: "3 tuần",
	},
	{
		id: 5,
		senderId: 3,
		senderName: "Bùi Phan Long",
		senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
		message: "Từ review tụi add cmt luôn đi",
		timestamp: "7 tuần",
	},
	{
		id: 6,
		senderId: 4,
		senderName: "Lê Thành Long",
		senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
		message: "Có gì cứ add cmt vào",
		timestamp: "7 tuần",
	},
];

export default function MemberList({ onClose }: MemberListProps) {
	const params = useParams({ strict: false }) as { groupId?: string };
	const groupId = params.groupId;
	const [isSearchMode, setIsSearchMode] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	const dispatch = useDispatch<AppDispatch>();
	const bucket = useSelector((s: RootState) =>
		groupId ? s.groupMembers.byGroupId[groupId] : undefined,
	);
	const members = bucket?.members || [];
	const loading = bucket?.loading || false;
	const error = bucket?.error || null;

	useEffect(() => {
		if (!groupId) return;
		dispatch(setCurrentGroup(groupId));
		// Always fetch on group change; could add cache TTL if desired
		dispatch(fetchGroupMembers({ groupId }));
	}, [dispatch, groupId]);

	const handleMessageSend = (memberId: number | string, message: string) => {
		console.log(`Send message to member ${memberId}:`, message);
	};

	const handleButtonClick = (memberId: number | string) => {
		console.log(`Button clicked for member ${memberId}`);
	};

	const handleSearchToggle = () => {
		setIsSearchMode(!isSearchMode);
		if (isSearchMode) {
			setSearchQuery("");
		}
	};

	const filteredMessages = mockMessages.filter(
		(msg: any) =>
			msg.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
			msg.senderName.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	if (!groupId) {
		return (
			<PageWrapper>
				<CPHeader>
					<CPHeaderLeft>
						<CPTitle>{isSearchMode ? "Search messages" : ""}</CPTitle>
					</CPHeaderLeft>
					<CPHeaderRight>
						{!isSearchMode && (
							<SearchButton
								onClick={handleSearchToggle}
								style={{}}
								onMouseEnter={(e) =>
									(e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.05)")
								}
								onMouseLeave={(e) =>
									(e.currentTarget.style.backgroundColor = "transparent")
								}
							>
								<Search size={20} color="#1c1e21" />
							</SearchButton>
						)}
						{onClose && (
							<CloseButton onClick={onClose}>
								<X size={20} />
							</CloseButton>
						)}
					</CPHeaderRight>
				</CPHeader>
				<MemberContent isSearchMode={isSearchMode}>
					<div style={{ padding: "20px", textAlign: "center", color: "#888" }}>
						Please select a group to view members
					</div>
				</MemberContent>
			</PageWrapper>
		);
	}

	if (loading) {
		return (
			<PageWrapper>
				<CPHeader>
					<CPHeaderLeft>
						<CPTitle>{isSearchMode ? "Search messages" : ""}</CPTitle>
					</CPHeaderLeft>
					<CPHeaderRight>
						{!isSearchMode && (
							<SearchButton
								onClick={handleSearchToggle}
								style={{}}
								onMouseEnter={(e) =>
									(e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.05)")
								}
								onMouseLeave={(e) =>
									(e.currentTarget.style.backgroundColor = "transparent")
								}
							>
								<Search size={20} color="#1c1e21" />
							</SearchButton>
						)}
						{onClose && (
							<CloseButton onClick={onClose}>
								<X size={20} />
							</CloseButton>
						)}
					</CPHeaderRight>
				</CPHeader>
				<MemberContent isSearchMode={isSearchMode}>
					<div style={{ padding: "20px", textAlign: "center", color: "#888" }}>
						Loading members...
					</div>
				</MemberContent>
			</PageWrapper>
		);
	}

	if (error) {
		return (
			<PageWrapper>
				<CPHeader>
					<CPHeaderLeft>
						<CPTitle>{isSearchMode ? "Search messages" : ""}</CPTitle>
					</CPHeaderLeft>
					<CPHeaderRight>
						{!isSearchMode && (
							<SearchButton
								onClick={handleSearchToggle}
								style={{}}
								onMouseEnter={(e) =>
									(e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.05)")
								}
								onMouseLeave={(e) =>
									(e.currentTarget.style.backgroundColor = "transparent")
								}
							>
								<Search size={20} color="#1c1e21" />
							</SearchButton>
						)}
						{onClose && (
							<CloseButton onClick={onClose}>
								<X size={20} />
							</CloseButton>
						)}
					</CPHeaderRight>
				</CPHeader>
				<MemberContent isSearchMode={isSearchMode}>
					<div
						style={{ padding: "20px", textAlign: "center", color: "#f44336" }}
					>
						{error}
					</div>
				</MemberContent>
			</PageWrapper>
		);
	}

	return (
		<PageWrapper>
			<CPHeader>
				<CPHeaderLeft>
					{isSearchMode && (
						<IconButton
							icon={ArrowLeft}
							size={32}
							onClick={handleSearchToggle}
							ariaLabel="Back"
						/>
					)}
					<CPTitle>{isSearchMode ? "Search messages" : ""}</CPTitle>
				</CPHeaderLeft>
				<CPHeaderRight>
					{!isSearchMode && (
						<IconButton
							icon={Search}
							size={32}
							onClick={handleSearchToggle}
							ariaLabel="Search"
						/>
					)}
					{onClose && (
						<IconButton
							icon={X}
							size={32}
							color={`${theme.color.grey50}`}
							onClick={onClose}
							ariaLabel="Close"
						/>
					)}
				</CPHeaderRight>
			</CPHeader>

			<MemberContent isSearchMode={isSearchMode}>
				{isSearchMode ? (
					<>
						<SearchHeader>
							<SearchInput
								value={searchQuery}
								onChange={(v: any) => setSearchQuery(v)}
								onClear={() => setSearchQuery("")}
								placeholder="Search messages..."
							/>
							<SearchResultTotal>
								{searchQuery
									? `${filteredMessages.length} results`
									: "Type to search messages"}
							</SearchResultTotal>
						</SearchHeader>

						{/* Search Results */}
						{searchQuery === "" ? (
							<NoneResult>
								<Search
									size={48}
									style={{ opacity: 0.3, marginBottom: "12px" }}
								/>
								<p style={{ fontSize: "14px", margin: 0 }}>
									Type to search messages
								</p>
							</NoneResult>
						) : filteredMessages.length === 0 ? (
							<NoneResult>
								<Search
									size={48}
									style={{ opacity: 0.3, marginBottom: "12px" }}
								/>
								<p style={{ fontSize: "14px", margin: 0 }}>
									Không tìm thấy kết quả
								</p>
							</NoneResult>
						) : (
							<div>
								{filteredMessages.map((msg) => (
									<MesResultItem key={msg.id}>
										<SenderAvatar src={msg.senderAvatar} alt={msg.senderName} />
										<MesContentItem>
											<MesContentHeader>
												<SenderName>{msg.senderName}</SenderName>
												<Timestamp>{msg.timestamp}</Timestamp>
											</MesContentHeader>
											<Message>{msg.message}</Message>
										</MesContentItem>
									</MesResultItem>
								))}
							</div>
						)}
					</>
				) : (
					<MemberSection>
						<SectionHeader>
							<SectionTitle>All Members</SectionTitle>
							<MemberCount>{members.length}</MemberCount>
						</SectionHeader>
						<MembersList>
							{members.length === 0 ? (
								<div
									style={{
										padding: "20px",
										textAlign: "center",
										color: "#888",
									}}
								>
									No members found in this group
								</div>
							) : (
								members.map((member) => (
									<MemberItem
										key={member.id}
										member={{
											id: member.id,
											name: member.name,
											avatar: member.avatar || "",
											isOnline: member.isOnline || false,
											email: member.email,
										}}
										showTooltip={true}
										buttonType="more"
										onButtonClick={handleButtonClick}
										onMessageSend={handleMessageSend}
									/>
								))
							)}
						</MembersList>
					</MemberSection>
				)}
			</MemberContent>
		</PageWrapper>
	);
}
