import { useState } from "react";
import {
	MemberItem as StyledMemberItem,
	MemberAvatarContainer,
	MemberAvatar,
	OnlineIndicator,
	OfflineIndicator,
	MemberName,
	Tooltip,
	TooltipCard,
	TooltipHeader,
	TooltipAvatar,
	TooltipName,
	TooltipUsername,
	TooltipInput,
	TooltipContainer,
} from "./MemberItem.styled";

export interface Member {
	id: number | string;
	name: string;
	avatar: string;
	isOnline: boolean;
	email?: string;
}

interface MemberItemProps {
	member: Member;
	showTooltip?: boolean;
	buttonType?: "more" | "close" | "none";
	onButtonClick?: (memberId: number | string) => void;
	onMessageSend?: (memberId: number | string, message: string) => void;
}

export interface TooltipProps {
	show: boolean;
}

export default function MemberItem({
	member,
	showTooltip = true,
	buttonType = "none",
	onButtonClick,
	onMessageSend,
}: MemberItemProps) {
	const [hoveredMember, setHoveredMember] = useState<number | string | null>(
		null,
	);

	const getFirstName = (fullName: string) => {
		const parts = fullName.trim().split(/\s+/);
		return parts[parts.length - 1] || fullName;
	};

	const firstName = getFirstName(member.name);

	const handleMouseEnter = () => {
		if (showTooltip) {
			setHoveredMember(member.id);
		}
	};

	const handleMouseLeave = () => {
		setHoveredMember(null);
	};

	const handleMessageKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			const value = (e.target as HTMLInputElement).value;
			if (onMessageSend) {
				onMessageSend(member.id, value);
			}
			(e.target as HTMLInputElement).value = "";
		}
	};

	const renderButton = () => {
		if (buttonType === "none") return null;

		const handleClick = (e: React.MouseEvent) => {
			e.stopPropagation();
			if (onButtonClick) {
				onButtonClick(member.id);
			}
		};

		if (buttonType === "more") {
			return (
				<button
					onClick={handleClick}
					style={{
						background: "none",
						border: "none",
						cursor: "pointer",
						padding: "4px 8px",
						fontSize: "16px",
						color: "#888",
						marginLeft: "auto",
					}}
					title="More options"
				>
					⋯
				</button>
			);
		}

		if (buttonType === "close") {
			return (
				<button
					onClick={handleClick}
					style={{
						background: "none",
						border: "none",
						cursor: "pointer",
						padding: "4px 8px",
						fontSize: "16px",
						color: "#888",
						marginLeft: "auto",
					}}
					title="Remove"
				>
					✕
				</button>
			);
		}

		return null;
	};

	const itemContent = (
		<StyledMemberItem>
			<MemberAvatarContainer>
				<MemberAvatar src={member.avatar} alt={member.name} />
				{member.isOnline ? <OnlineIndicator /> : <OfflineIndicator />}
			</MemberAvatarContainer>
			<MemberName>{member.name}</MemberName>
			{renderButton()}
		</StyledMemberItem>
	);

	if (!showTooltip) {
		return itemContent;
	}

	return (
		<TooltipContainer
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			{itemContent}

			<Tooltip show={hoveredMember === member.id}>
				<TooltipCard>
					<TooltipHeader>
						<TooltipAvatar src={member.avatar} alt={member.name} />
						<div
							style={{
								minWidth: 0,
								flex: 1,
								overflow: "hidden",
							}}
						>
							<TooltipName>{member.name}</TooltipName>
							<TooltipUsername>
								{member.email ||
									`@${member.name.toLowerCase().replace(/\s+/g, "")}`}
							</TooltipUsername>
						</div>
					</TooltipHeader>

					<TooltipInput
						type="text"
						placeholder={`Message @${firstName}`}
						onKeyDown={handleMessageKeyDown}
					/>
				</TooltipCard>
			</Tooltip>
		</TooltipContainer>
	);
}
