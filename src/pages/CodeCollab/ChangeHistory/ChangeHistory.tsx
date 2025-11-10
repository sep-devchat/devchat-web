import React from "react";
import { Clock, User, GitCompare } from "lucide-react";
import { Change } from "../types";
import { formatTime } from "../utils";
import * as S from "./ChangeHistory.styled";

interface ChangeHistoryItemProps {
	change: Change;
	onClick: () => void;
}

const ChangeHistoryItem: React.FC<ChangeHistoryItemProps> = ({
	change,
	onClick,
}) => {
	return (
		<S.ChangeButton onClick={onClick}>
			<S.ChangeContent>
				<S.UserIconContainer>
					<User style={{ width: "1rem", height: "1rem" }} />
				</S.UserIconContainer>
				<S.UserInfo>
					<S.UserName>{change.userName}</S.UserName>
					<S.TimeInfo>
						<Clock style={{ width: "0.75rem", height: "0.75rem" }} />
						<span>{formatTime(change.timestamp)}</span>
					</S.TimeInfo>
				</S.UserInfo>
				<S.CompareIcon>
					<GitCompare style={{ width: "1rem", height: "1rem" }} />
				</S.CompareIcon>
			</S.ChangeContent>
		</S.ChangeButton>
	);
};

interface ChangeHistoryProps {
	changes: Change[];
	onChangeClick: (change: Change) => void;
}

export const ChangeHistory: React.FC<ChangeHistoryProps> = ({
	changes,
	onChangeClick,
}) => {
	return (
		<S.Container>
			<S.Header>
				<S.HeaderTitle>Change History</S.HeaderTitle>
				<S.HeaderSubtitle>{changes.length} revision(s)</S.HeaderSubtitle>
			</S.Header>

			<S.ListContainer>
				{changes.map((change) => (
					<ChangeHistoryItem
						key={change.id}
						change={change}
						onClick={() => onChangeClick(change)}
					/>
				))}
			</S.ListContainer>
		</S.Container>
	);
};
