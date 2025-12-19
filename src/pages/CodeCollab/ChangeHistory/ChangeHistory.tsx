import React from "react";
import { Clock, User, Share2, Trash2 } from "lucide-react";
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
					{change.avatarUrl ? (
						<img
							src={change.avatarUrl}
							alt={change.userName}
							style={{ borderRadius: "50%" }}
						/>
					) : (
						<User style={{ width: "1.5rem", height: "1.5rem" }} />
					)}
				</S.UserIconContainer>
				<S.UserInfo>
					<S.UserName>{change.userName}</S.UserName>
					<S.TimeInfo>
						<Clock style={{ width: "0.75rem", height: "0.75rem" }} />
						<span>{formatTime(change.timestamp)}</span>
					</S.TimeInfo>
				</S.UserInfo>

				<div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
					{canDelete && onDelete ? (
						<S.DeleteButton onClick={handleDelete}>
							<Trash2 style={{ width: "1rem", height: "1rem" }} />
						</S.DeleteButton>
					) : (
						<S.CompareIcon>
							<Share2 style={{ width: "1rem", height: "1rem" }} />
						</S.CompareIcon>
					)}
				</div>
			</S.ChangeContent>
		</S.ChangeButton>
	);
};

interface ChangeHistoryProps {
	changes: Change[];
	onChangeClick: (change: Change) => void;
	onDeleteChange?: (changeId: string) => void;
	currentUserId?: string;
}

export const ChangeHistory: React.FC<ChangeHistoryProps> = ({
	changes,
	onChangeClick,
	onDeleteChange,
	currentUserId,
}) => {
	return (
		<S.Container>
			<S.Header>
				<S.HeaderTitle>Collaboration</S.HeaderTitle>
			</S.Header>
			<S.ListContainer>
				{changes.map((change) => {
					const isOwner =
						currentUserId !== undefined && change.userId === currentUserId;
					const canDelete = isOwner;

					return (
						<ChangeHistoryItem
							key={change.id}
							change={change}
							onClick={() => onChangeClick(change)}
							onDelete={
								onDeleteChange && canDelete
									? () => onDeleteChange(change.id)
									: undefined
							}
							canDelete={canDelete}
						/>
					);
				})}
			</S.ListContainer>
		</S.Container>
	);
};
