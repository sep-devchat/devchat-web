import { useEffect, useState } from "react";
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
import { membersGroup } from "@/services/userGroupAPI";

interface MemberData {
	id: string;
	name: string;
	avatar?: string;
	isOnline?: boolean;
	email?: string;
	role?: {
		name: string;
		level: number;
	};
}

interface MemberListProps {
	onClose?: () => void;
}

export default function MemberList({ onClose }: MemberListProps) {
	const params = useParams({ strict: false }) as { groupId?: string };
	const groupId = params.groupId;

	const [members, setMembers] = useState<MemberData[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [page] = useState(1);
	const [limit] = useState(50);

	useEffect(() => {
		if (!groupId) {
			setError("No group selected");
			return;
		}

		let mounted = true;

		const fetchMembers = async () => {
			setLoading(true);
			setError(null);
			try {
				const response = await membersGroup(groupId, page, limit);

				if (!mounted) return;

				const data = response?.data || response;
				const membersList = Array.isArray(data) ? data : data?.members || [];

				const mappedMembers = membersList.map((member: any) => {
					const fullName =
						`${member.lastName || ""} ${member.firstName || ""}`.trim() ||
						member.username ||
						"Unknown User";

					return {
						id: member.id || member.userId || member._id,
						name: fullName,
						avatar:
							member.avatarUrl ||
							`https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`,
						isOnline: member.isActive ?? false,
						email: member.email,
						role: member.role,
					};
				});

				setMembers(mappedMembers);
			} catch (err: any) {
				console.error("Failed to fetch members:", err);
				if (mounted) {
					setError(err?.message || "Failed to load members");
				}
			} finally {
				if (mounted) {
					setLoading(false);
				}
			}
		};

		fetchMembers();

		return () => {
			mounted = false;
		};
	}, [groupId, page, limit]);

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
