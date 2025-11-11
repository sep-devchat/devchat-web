import React from "react";
import { Clock, User, GitCompare, Trash2 } from "lucide-react";
import { Change } from "../types";
import { formatTime } from "../utils";
import * as S from "./ChangeHistory.styled";

interface ChangeHistoryItemProps {
	change: Change;
	onClick: () => void;
	onDelete?: () => void;
	canDelete: boolean;
}

const ChangeHistoryItem: React.FC<ChangeHistoryItemProps> = ({
	change,
	onClick,
	onDelete,
	canDelete,
}) => {
	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (onDelete) {
			onDelete();
		}
	};

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
				{canDelete ? (
					<S.DeleteButton onClick={handleDelete}>
						<Trash2 style={{ width: "1rem", height: "1rem" }} />
					</S.DeleteButton>
				) : (
					<S.CompareIcon>
						<GitCompare style={{ width: "1rem", height: "1rem" }} />
					</S.CompareIcon>
				)}
			</S.ChangeContent>
		</S.ChangeButton>
	);
};

interface ChangeHistoryProps {
	changes: Change[];
	onChangeClick: (change: Change) => void;
	onDeleteChange?: (changeId: string) => void;
	currentUserName?: string;
}

export const ChangeHistory: React.FC<ChangeHistoryProps> = ({
	changes,
	onChangeClick,
	onDeleteChange,
	currentUserName,
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
						onDelete={
							onDeleteChange &&
							currentUserName &&
							change.userName === currentUserName
								? () => onDeleteChange(change.id)
								: undefined
						}
						canDelete={
							currentUserName !== undefined &&
							change.userName === currentUserName
						}
					/>
				))}
			</S.ListContainer>
		</S.Container>
	);
};
