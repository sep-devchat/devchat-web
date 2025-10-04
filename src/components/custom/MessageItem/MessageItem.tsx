import React, { useState } from "react";
import { MessageItemType } from "../../../types/moderateMessage.types.ts";
import * as S from "./MessageItem.styled";

interface MessageItemProps {
	item: MessageItemType;
	showCheckbox?: boolean;
	onSelect?: (id: string, checked: boolean) => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({
	item,
	showCheckbox,
	onSelect,
}) => {
	const [isChecked, setIsChecked] = useState(false);

	const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setIsChecked(e.target.checked);
		onSelect?.(item.id, e.target.checked);
	};

	const getAdminAnswerType = ():
		| "deleted"
		| "approved"
		| "warning"
		| "escalated"
		| undefined => {
		if (!item.adminAnswer) return undefined;
		const text = item.adminAnswer.text.toLowerCase();
		if (text.includes("deleted")) return "deleted";
		if (text.includes("approved")) return "approved";
		if (text.includes("warning")) return "warning";
		if (text.includes("escalated")) return "escalated";
		return undefined;
	};

	return (
		<S.ItemContainer>
			<S.UserInfoHeader>
				{showCheckbox && (
					<S.ItemCheckbox
						type="checkbox"
						checked={isChecked}
						onChange={handleCheckboxChange}
					/>
				)}
				<S.Avatar src={item.user.avatar} alt={item.user.username} />
				<S.UserInfoContainer>
					<S.UserInfoRow>
						<S.UserDetails>
							<S.Username>{item.user.username}</S.Username>
							<div
								style={{
									display: "flex",
									flexDirection: "row",
									gap: "10px",
									alignItems: "center",
								}}
							>
								{item.user.groupName && (
									<S.GroupName>{item.user.groupName}</S.GroupName>
								)}
								<S.Time>{item.user.time}</S.Time>
							</div>
						</S.UserDetails>
						<S.TagsContainer>
							{item.tags.map((tag, idx) => (
								<S.Tag key={idx} $color={tag.color}>
									{tag.label}
								</S.Tag>
							))}
							<S.ReportType>
								{item.reportedBy === "auto" ? "Auto-flagged" : "User reported"}
							</S.ReportType>
						</S.TagsContainer>
					</S.UserInfoRow>
				</S.UserInfoContainer>
			</S.UserInfoHeader>

			<S.ContentSection>
				<S.ContentBorder>
					{item.content.message && (
						<S.Message>{item.content.message}</S.Message>
					)}
					{item.content.code && (
						<S.CodeBlock>
							<code>{item.content.code}</code>
						</S.CodeBlock>
					)}
				</S.ContentBorder>
			</S.ContentSection>

			{item.adminAnswer && (
				<S.AdminAnswerBox $type={getAdminAnswerType()}>
					<S.AdminAnswerContent>
						<S.AdminAnswerText>
							<S.AdminTitle $type={getAdminAnswerType()}>
								{item.adminAnswer.text}
							</S.AdminTitle>
							<S.AdminDetails $type={getAdminAnswerType()}>
								• <strong>Date:</strong> {item.adminAnswer.date} •{" "}
								<strong>Reason:</strong> {item.adminAnswer.reason}
								{item.adminAnswer.reviewTime && ` • `}
								<strong>Review Time:</strong> {item.adminAnswer.reviewTime}
							</S.AdminDetails>
						</S.AdminAnswerText>
					</S.AdminAnswerContent>
					{item.reason && (
						<S.ShowFullWarningLink href="#">
							Show full warning
						</S.ShowFullWarningLink>
					)}
				</S.AdminAnswerBox>
			)}

			{item.reason && !item.adminAnswer && (
				<S.ReasonSection>
					<S.ReasonText>
						<span>Context:</span> {item.reason}
					</S.ReasonText>
				</S.ReasonSection>
			)}

			<S.ActionsRow>
				{item.actions.map((action, idx) => (
					<S.ActionButton
						key={idx}
						onClick={action.onClick}
						$variant={action.variant}
					>
						{action.icon}
						{action.label}
					</S.ActionButton>
				))}
			</S.ActionsRow>
		</S.ItemContainer>
	);
};
