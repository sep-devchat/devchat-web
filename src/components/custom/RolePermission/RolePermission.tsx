import React, { useState } from "react";
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
	IconWrapper,
	RoleNameText,
	DeleteButton,
} from "./RolePermission.styled";
import { EditIcon, Shield, Trash } from "lucide-react";
import {
	SystemRoleModal,
	ProjectModal,
	DeleteConfirmModal,
} from "./Modal/Modal";

interface Permission {
	id: string;
	label: string;
}

interface RolePermissionRole {
	id: string;
	name: string;
	description?: string;
	color: string;
	icon?: React.ReactNode;
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
	onAdd?: (data: any) => void;
	onEdit?: (index: number, data: any) => void;
	onDelete?: (index: number) => void;
}

const RolePermissions: React.FC<RolePermissionsProps> = ({
	roles: initialRoles,
	title,
	subtitle,
	type,
	onAdd,
	onEdit,
	onDelete,
}) => {
	const [roles, setRoles] = useState<RolePermissionRole[]>(initialRoles);
	const [expandedRoles, setExpandedRoles] = useState<Set<string>>(
		new Set(roles.map((role) => role.id)),
	);

	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [selectedRoleIndex, setSelectedRoleIndex] = useState<number | null>(
		null,
	);

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
		setIsAddModalOpen(true);
	};

	const handleEditClick = (index: number) => {
		setSelectedRoleIndex(index);
		setIsEditModalOpen(true);
	};

	const handleDeleteClick = (index: number) => {
		setSelectedRoleIndex(index);
		setIsDeleteModalOpen(true);
	};

	const handleAddSave = (data: any) => {
		const newRole: RolePermissionRole = {
			id: Date.now().toString(),
			name: data.name,
			description: data.description || data.owner,
			color: data.color,
			icon: data.icon,
			permissions: data.permissions,
		};

		const updatedRoles = [...roles, newRole];
		setRoles(updatedRoles);

		if (onAdd) {
			onAdd(data);
		}

		setIsAddModalOpen(false);
	};

	const handleEditSave = (data: any) => {
		if (selectedRoleIndex !== null) {
			const updatedRoles = [...roles];
			updatedRoles[selectedRoleIndex] = {
				...updatedRoles[selectedRoleIndex],
				name: data.name,
				description: data.description || data.owner,
				color: data.color,
				icon: data.icon,
				permissions: data.permissions,
			};

			setRoles(updatedRoles);

			if (onEdit) {
				onEdit(selectedRoleIndex, data);
			}

			setIsEditModalOpen(false);
			setSelectedRoleIndex(null);
		}
	};

	const handleDeleteConfirm = () => {
		if (selectedRoleIndex !== null) {
			const updatedRoles = roles.filter(
				(_, index) => index !== selectedRoleIndex,
			);
			setRoles(updatedRoles);

			if (onDelete) {
				onDelete(selectedRoleIndex);
			}

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
													<IconWrapper color={role.color}>
														{role.icon ? role.icon : <Shield size={18} />}
													</IconWrapper>
													<div>
														<RoleNameText>{role.name}</RoleNameText>
														{role.description && (
															<RoleDescription>
																{role.description}
															</RoleDescription>
														)}
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

			{type === "system-roles" ? (
				<>
					<SystemRoleModal
						isOpen={isAddModalOpen}
						onClose={() => setIsAddModalOpen(false)}
						onSave={handleAddSave}
						mode="add"
					/>
					<SystemRoleModal
						isOpen={isEditModalOpen}
						onClose={() => {
							setIsEditModalOpen(false);
							setSelectedRoleIndex(null);
						}}
						onSave={handleEditSave}
						mode="edit"
					/>
				</>
			) : (
				<>
					<ProjectModal
						isOpen={isAddModalOpen}
						onClose={() => setIsAddModalOpen(false)}
						onSave={handleAddSave}
						mode="add"
					/>
					<ProjectModal
						isOpen={isEditModalOpen}
						onClose={() => {
							setIsEditModalOpen(false);
							setSelectedRoleIndex(null);
						}}
						onSave={handleEditSave}
						project={selectedRole || undefined}
						mode="edit"
					/>
				</>
			)}

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
