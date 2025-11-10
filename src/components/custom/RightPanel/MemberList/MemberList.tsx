import { useEffect } from "react";
import { useParams } from "@tanstack/react-router";
import { X } from "lucide-react";
import MemberItem from "../../MemberItem/MemberItem";
import {
	CloseButton,
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
} from "./MemberList.styled";
import { useDispatch, useSelector } from "react-redux";
import { type RootState, type AppDispatch } from "@/store";
import { fetchGroupMembers, setCurrentGroup } from "@/store/groupMembers.slice";

interface MemberListProps {
	onClose?: () => void;
}

export default function MemberList({ onClose }: MemberListProps) {
	const params = useParams({ strict: false }) as { groupId?: string };
	const groupId = params.groupId;

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

	if (!groupId) {
		return (
			<PageWrapper>
				<CPHeader>
					<CPHeaderLeft>
						<CPTitle>Member List</CPTitle>
					</CPHeaderLeft>
					{onClose && (
						<CloseButton onClick={onClose}>
							<X size={20} />
						</CloseButton>
					)}
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
						<CPTitle>Member List</CPTitle>
					</CPHeaderLeft>
					{onClose && (
						<CloseButton onClick={onClose}>
							<X size={20} />
						</CloseButton>
					)}
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
						<CPTitle>Member List</CPTitle>
					</CPHeaderLeft>
					{onClose && (
						<CloseButton onClick={onClose}>
							<X size={20} />
						</CloseButton>
					)}
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
					<CPTitle>Member List</CPTitle>
				</CPHeaderLeft>
				{onClose && (
					<CloseButton onClick={onClose}>
						<X size={20} />
					</CloseButton>
				)}
			</CPHeader>

			<MemberContent>
				<MemberSection>
					<SectionHeader>
						<SectionTitle>All Members</SectionTitle>
						<MemberCount>{members.length}</MemberCount>
					</SectionHeader>
					<MembersList>
						{members.length === 0 ? (
							<div
								style={{ padding: "20px", textAlign: "center", color: "#888" }}
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
			</MemberContent>
		</PageWrapper>
	);
}
