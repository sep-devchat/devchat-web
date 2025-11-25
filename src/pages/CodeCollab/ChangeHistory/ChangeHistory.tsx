import React from "react";
import { Clock, User, GitCompare, Trash2, Edit2 } from "lucide-react";
import { Change } from "../types";
import { formatTime } from "../utils";
import * as S from "./ChangeHistory.styled";

interface ChangeHistoryItemProps {
	change: Change;
	onClick: () => void;
	onDelete?: () => void;
	onEdit?: () => void;
	canDelete: boolean;
	canEdit: boolean;
}

const ChangeHistoryItem: React.FC<ChangeHistoryItemProps> = ({
	change,
	onClick,
	onDelete,
	onEdit,
	canDelete,
	canEdit,
}) => {
	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (onDelete) {
			onDelete();
		}
	};

	const handleEdit = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (onEdit) {
			onEdit();
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
					{canEdit && onEdit && (
						<S.EditButton onClick={handleEdit}>
							<Edit2 style={{ width: "1rem", height: "1rem" }} />
						</S.EditButton>
					)}
					{canDelete && onDelete ? (
						<S.DeleteButton onClick={handleDelete}>
							<Trash2 style={{ width: "1rem", height: "1rem" }} />
						</S.DeleteButton>
					) : (
						!canEdit && (
							<S.CompareIcon>
								<GitCompare style={{ width: "1rem", height: "1rem" }} />
							</S.CompareIcon>
						)
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
	onEditChange?: (changeId: string) => void;
	currentUserId?: string;
}

export const ChangeHistory: React.FC<ChangeHistoryProps> = ({
	changes,
	onChangeClick,
	onDeleteChange,
	onEditChange,
	currentUserId,
}) => {
	return (
		<S.Container>
			<S.Header>
				<S.HeaderTitle>Change History</S.HeaderTitle>
				<S.HeaderSubtitle>{changes.length} revision(s)</S.HeaderSubtitle>
			</S.Header>
			<S.ListContainer>
				{changes.map((change) => {
					const isOwner =
						currentUserId !== undefined && change.userId === currentUserId;
					const canDelete = isOwner;
					const canEdit = isOwner;

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
							onEdit={
								onEditChange && canEdit
									? () => onEditChange(change.id)
									: undefined
							}
							canDelete={canDelete}
							canEdit={canEdit}
						/>
					);
				})}
			</S.ListContainer>
		</S.Container>
	);
};
