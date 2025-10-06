import MemberItem from "../../MemberItem/MemberItem";
import {
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

const mockMembers = {
	status: [
		{
			id: 1,
			name: "Nguyen Van A",
			avatar:
				"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
			isOnline: true,
		},
		{
			id: 2,
			name: "Nguyen Van B",
			avatar:
				"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
			isOnline: false,
		},
		{
			id: 3,
			name: "Nguyen Van C",
			avatar:
				"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
			isOnline: true,
		},
		{
			id: 4,
			name: "Nguyen Van D",
			avatar:
				"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
			isOnline: false,
		},
	],
};

export default function MemberList() {
	const onlineMembers = mockMembers.status.filter(
		(member) => member.isOnline === true,
	);
	const offlineMembers = mockMembers.status.filter(
		(member) => member.isOnline === false,
	);

	const handleMessageSend = (memberId: number | string, message: string) => {
		console.log(`Send message to member ${memberId}:`, message);
	};

	const handleButtonClick = (memberId: number | string) => {
		console.log(`Button clicked for member ${memberId}`);
	};

	return (
		<PageWrapper>
			<CPHeader>
				<CPHeaderLeft>
					<CPTitle>Member List</CPTitle>
				</CPHeaderLeft>
			</CPHeader>
			<MemberContent>
				<MemberSection>
					<SectionHeader>
						<SectionTitle>Online</SectionTitle>
						<MemberCount>{onlineMembers.length}</MemberCount>
					</SectionHeader>
					<MembersList>
						{onlineMembers.map((member) => (
							<MemberItem
								key={member.id}
								member={member}
								showTooltip={true}
								buttonType="more"
								onButtonClick={handleButtonClick}
								onMessageSend={handleMessageSend}
							/>
						))}
					</MembersList>
				</MemberSection>
				<MemberSection>
					<SectionHeader>
						<SectionTitle>Offline</SectionTitle>
						<MemberCount>{offlineMembers.length}</MemberCount>
					</SectionHeader>
					<MembersList>
						{offlineMembers.map((member) => (
							<MemberItem
								key={member.id}
								member={member}
								showTooltip={true}
								buttonType="close"
								onButtonClick={handleButtonClick}
								onMessageSend={handleMessageSend}
							/>
						))}
					</MembersList>
				</MemberSection>
			</MemberContent>
		</PageWrapper>
	);
}
