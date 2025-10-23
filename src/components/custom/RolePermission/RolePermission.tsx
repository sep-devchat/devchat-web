import React, { useState, useEffect } from "react";
import {
	Wrapper,
	Container,
	HeaderWrapper,
	Header,
	Title,
	Subtitle,
	AddButton,
	ScrollArea,
	RoleSection,
	RoleCard,
	RoleHeader,
	RoleContent,
	RoleNameRow,
	Arrow,
	RoleDescription,
	ActionButtons,
	EditButton,
	PermissionsContainer,
	PermissionsTitle,
	PermissionsList,
	PermissionItem,
	PermissionDot,
	PermissionText,
	RoleNameText,
	DeleteButton,
} from "./RolePermission.styled";
import { DeleteConfirmModal } from "./Modal/Modal";

import { EditIcon, Trash } from "lucide-react";

interface Permission {
	id: string;
	label: string;
}

interface RolePermissionRole {
	id: string;
	role: string;
	name: string;
	level: number;
	color: string;
	permissions: Permission[];
	metadata?: {
		users?: number;
		status?: string;
		lastModified?: string;
		members?: number;
		access?: string;
		lastActivity?: string;
	};
}

interface RolePermissionsProps {
	roles: RolePermissionRole[];
	title: string;
	subtitle: string;
	type: "system-roles" | "project";
	onAdd?: () => void;
	onEdit?: (index: number) => void;
	onDelete?: (index: number) => void;
}

const RolePermissions: React.FC<RolePermissionsProps> = ({
	roles,
	title,
	subtitle,
	type,
	onAdd,
	onEdit,
	onDelete,
}) => {
	const [expandedRoles, setExpandedRoles] = useState<Set<string>>(
		new Set(roles.map((role) => role.id)),
	);

	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [selectedRoleIndex, setSelectedRoleIndex] = useState<number | null>(
		null,
	);

	useEffect(() => {
		setExpandedRoles(new Set(roles.map((role) => role.id)));
	}, [roles]);

	const toggleRole = (roleId: string) => {
		setExpandedRoles((prev) => {
			const newSet = new Set(prev);
			newSet.has(roleId) ? newSet.delete(roleId) : newSet.add(roleId);
			return newSet;
		});
	};

	const getAddButtonText = () =>
		type === "system-roles" ? "Add Role" : "Add Project";

	const handleAddClick = () => {
		if (onAdd) {
			onAdd();
		}
	};

	const handleEditClick = (index: number) => {
		if (onEdit) {
			onEdit(index);
		}
	};

	const handleDeleteClick = (index: number) => {
		setSelectedRoleIndex(index);
		setIsDeleteModalOpen(true);
	};

	const handleDeleteConfirm = () => {
		if (selectedRoleIndex !== null && onDelete) {
			onDelete(selectedRoleIndex);
			setIsDeleteModalOpen(false);
			setSelectedRoleIndex(null);
		}
	};

	const selectedRole =
		selectedRoleIndex !== null ? roles[selectedRoleIndex] : null;

	return (
		<Wrapper>
			<Container>
				<HeaderWrapper>
					<Header>
						<div>
							<Title>{title}</Title>
							<Subtitle>{subtitle}</Subtitle>
						</div>
						<AddButton onClick={handleAddClick}>
							+ {getAddButtonText()}
						</AddButton>
					</Header>
				</HeaderWrapper>

				<ScrollArea>
					{roles.map((role, index) => {
						const isExpanded = expandedRoles.has(role.id);
						return (
							<RoleSection key={role.id}>
								<RoleCard backgroundColor={role.color}>
									<RoleHeader>
										<RoleContent onClick={() => toggleRole(role.id)}>
											<RoleNameRow>
												<div
													style={{
														display: "flex",
														alignItems: "center",
														gap: "14px",
													}}
												>
													<div>
														<RoleNameText>
															{role.name} - {role.role}
														</RoleNameText>
														<RoleDescription>
															Level: {role.level}
														</RoleDescription>
													</div>
												</div>
												<Arrow expanded={isExpanded}>▶</Arrow>
											</RoleNameRow>
										</RoleContent>
										<ActionButtons>
											<EditButton
												onClick={(e) => {
													e.stopPropagation();
													handleEditClick(index);
												}}
											>
												<EditIcon />
											</EditButton>
											<DeleteButton
												onClick={(e) => {
													e.stopPropagation();
													handleDeleteClick(index);
												}}
											>
												<Trash />
											</DeleteButton>
										</ActionButtons>
									</RoleHeader>
								</RoleCard>

								{isExpanded && role.permissions.length > 0 && (
									<PermissionsContainer>
										<PermissionsTitle>
											{type === "system-roles" ? "Permissions:" : "Details:"}
										</PermissionsTitle>
										<PermissionsList>
											{role.permissions.map((permission) => (
												<PermissionItem key={permission.id}>
													<PermissionDot>•</PermissionDot>
													<PermissionText>{permission.label}</PermissionText>
												</PermissionItem>
											))}
										</PermissionsList>
									</PermissionsContainer>
								)}
							</RoleSection>
						);
					})}
				</ScrollArea>
			</Container>

			<DeleteConfirmModal
				isOpen={isDeleteModalOpen}
				onClose={() => {
					setIsDeleteModalOpen(false);
					setSelectedRoleIndex(null);
				}}
				onConfirm={handleDeleteConfirm}
				itemName={selectedRole?.name || ""}
				itemType={type === "system-roles" ? "role" : "project"}
			/>
		</Wrapper>
	);
};

export default RolePermissions;
