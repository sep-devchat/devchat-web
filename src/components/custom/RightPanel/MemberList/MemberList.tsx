/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { useParams } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import MemberItem, {
	type Member as MemberType,
} from "../../MemberItem/MemberItem";
import {
	CloseButton,
	CPHeader,
	CPHeaderIcon,
	CPHeaderLeft,
	CPHeaderRight,
	CPTitle,
	MemberContent,
	MemberCount,
	MemberSection,
	MembersList,
	PageWrapper,
	SearchButton,
	SectionHeader,
	SectionTitle,
} from "./MemberList.styled";
import { useDispatch, useSelector } from "react-redux";
import { type RootState, type AppDispatch } from "@/store";
import { fetchGroupMembers, setCurrentGroup } from "@/store/groupMembers.slice";
import { SearchContainer, SearchInput } from "../FriendList/FriendList.styled";
import FriendProfileModal from "@/pages/Friend/AllFriends/FriendProfileModal/FriendProfileModal";

const REFRESH_INTERVAL_MS = 5000;

interface MemberListProps {
	onClose?: () => void;
	isHalf?: boolean;
}

export default function MemberList({ onClose, isHalf }: MemberListProps) {
	const params = useParams({ strict: false }) as { groupId?: string };
	const groupId = params.groupId;
	const [isSearchMode, setIsSearchMode] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	const dispatch = useDispatch<AppDispatch>();
	const bucket = useSelector((s: RootState) =>
		groupId ? s.groupMembers.byGroupId[groupId] : undefined,
	);
	const currentUserId = useSelector((s: RootState) => s.user.profile?.id);
	const members = bucket?.members || [];
	const loading = bucket?.loading || false;
	const backgroundLoading = bucket?.backgroundLoading || false;
	const error = bucket?.error || null;
	const loadingRef = useRef(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedFriend, setSelectedFriend] = useState<any | null>(null);

	useEffect(() => {
		if (!groupId) return;
		dispatch(setCurrentGroup(groupId));
		dispatch(fetchGroupMembers({ groupId }));
	}, [dispatch, groupId]);

	useEffect(() => {
		loadingRef.current = loading || backgroundLoading;
	}, [loading, backgroundLoading]);

	useEffect(() => {
		if (!groupId) return;
		const intervalId = window.setInterval(() => {
			if (loadingRef.current) return;
			dispatch(fetchGroupMembers({ groupId, silent: true }));
		}, REFRESH_INTERVAL_MS);
		return () => window.clearInterval(intervalId);
	}, [dispatch, groupId]);

	const handleSearchToggle = () => {
		setIsSearchMode(!isSearchMode);
		if (isSearchMode) {
			setSearchQuery("");
		}
	};

	const toggleSearch = () => {
		setIsSearchMode(!isSearchMode);
		if (isSearchMode) {
			setSearchQuery("");
		}
	};

	const filteredMembers = members.filter((member) =>
		member.name.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const handleButtonClick = (member: any) => {
		setSelectedFriend(member);
		setIsModalOpen(true);
	};

	if (!groupId) {
		return (
			<PageWrapper>
				<CPHeader>
					<CPHeaderLeft>
						<CPTitle>{isSearchMode ? "Search messages" : ""}</CPTitle>
					</CPHeaderLeft>
					<CPHeaderRight>
						{!isSearchMode && (
							<>
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
								{isHalf && onClose && (
									<CloseButton onClick={onClose}>
										<X size={20} />
									</CloseButton>
								)}
							</>
						)}
						{isSearchMode && (
							<CloseButton onClick={handleSearchToggle}>
								<X size={20} />
							</CloseButton>
						)}
					</CPHeaderRight>
				</CPHeader>
				<MemberContent>
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
						{isSearchMode && (
							<SearchContainer>
								<SearchInput
									type="text"
									placeholder="Search members..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									autoFocus
								/>
							</SearchContainer>
						)}
					</CPHeaderLeft>
					<CPHeaderRight>
						{!isSearchMode && (
							<>
								<CPHeaderIcon onClick={toggleSearch}>
									<Search size={20} />
								</CPHeaderIcon>
								{isHalf && onClose && (
									<CloseButton onClick={onClose}>
										<X size={20} />
									</CloseButton>
								)}
							</>
						)}
						{isSearchMode && (
							<CPHeaderIcon onClick={toggleSearch}>
								<X size={20} />
							</CPHeaderIcon>
						)}
					</CPHeaderRight>
				</CPHeader>
				<MemberContent>
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
						{isSearchMode && (
							<SearchContainer>
								<SearchInput
									type="text"
									placeholder="Search members..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									autoFocus
								/>
							</SearchContainer>
						)}
					</CPHeaderLeft>
					<CPHeaderRight>
						<CPHeaderIcon onClick={toggleSearch}>
							{isSearchMode ? <X size={20} /> : <Search size={20} />}
						</CPHeaderIcon>
					</CPHeaderRight>
				</CPHeader>
				<MemberContent>
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
						<SearchContainer>
							<SearchInput
								type="text"
								placeholder="Search members..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								autoFocus
							/>
						</SearchContainer>
					)}
				</CPHeaderLeft>
				<CPHeaderRight>
					{!isSearchMode && (
						<>
							<CPHeaderIcon onClick={toggleSearch}>
								<Search size={20} />
							</CPHeaderIcon>
							{isHalf && onClose && (
								<CloseButton onClick={onClose}>
									<X size={20} />
								</CloseButton>
							)}
						</>
					)}
					{isSearchMode && (
						<CPHeaderIcon onClick={toggleSearch}>
							<X size={20} />
						</CPHeaderIcon>
					)}
				</CPHeaderRight>
			</CPHeader>

			<MemberContent>
				<MemberSection>
					<SectionHeader>
						<SectionTitle>
							{searchQuery ? "Search Results" : "All Members"}
						</SectionTitle>
						<MemberCount>{filteredMembers.length}</MemberCount>
					</SectionHeader>
					<MembersList>
						{filteredMembers.length === 0 ? (
							<div
								style={{
									padding: "20px",
									textAlign: "center",
									color: "#888",
								}}
							>
								{searchQuery ? "No members found" : "No members yet"}
							</div>
						) : (
							filteredMembers.map((member) => {
								const item: MemberType = {
									id: member.id,
									name: member.name,
									avatar: member.avatar || "",
									isOnline: member.isOnline ?? false,
									email: member.email,
									createdAt: (member as any).createdAt ?? undefined,
								};

								return (
									<MemberItem
										key={member.id}
										member={item}
										showTooltip={true}
										buttonType="more"
										onButtonClick={() => handleButtonClick(member)}
										currentUserId={currentUserId}
									/>
								);
							})
						)}
					</MembersList>
				</MemberSection>
			</MemberContent>
			<FriendProfileModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				friend={selectedFriend}
				groupId={groupId}
			/>
		</PageWrapper>
	);
}
