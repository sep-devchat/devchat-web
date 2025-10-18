import React, { useState, useEffect } from "react";
import {
	X,
	Shield,
	Briefcase,
	UserCheck,
	Users,
	Headphones,
	User,
} from "lucide-react";
import {
	ModalOverlay,
	ModalContainer,
	ModalHeader,
	ModalTitle,
	CloseButton,
	ModalBody,
	FormGroup,
	Label,
	Input,
	Textarea,
	Select,
	ColorGrid,
	ColorOption,
	IconGrid,
	IconButton,
	PermissionItem,
	PermissionText,
	RemoveButton,
	PermissionInputWrapper,
	ModalFooter,
	Button,
	DeleteModalContainer,
	DeleteMessage,
	WarningMessage,
} from "./Modal.styled";

const iconOptions = [
	{ value: "shield", label: "Shield", component: Shield },
	{ value: "briefcase", label: "Briefcase", component: Briefcase },
	{ value: "user-check", label: "User Check", component: UserCheck },
	{ value: "users", label: "Users", component: Users },
	{ value: "headphones", label: "Headphones", component: Headphones },
	{ value: "user", label: "User", component: User },
];

const colorOptions = [
	"#fed7aa",
	"#ddd6fe",
	"#bfdbfe",
	"#bbf7d0",
	"#a7f3d0",
	"#fecaca",
	"#fde68a",
	"#fbcfe8",
	"#e9d5ff",
	"#d1d5db",
];

interface Permission {
	id: string;
	label: string;
}

interface SystemRoleFormData {
	name: string;
	description: string;
	color: string;
	icon: string;
	permissions: Permission[];
}

interface SystemRoleModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (data: SystemRoleFormData) => void;
	role?: SystemRoleFormData & { id?: string };
	mode?: "add" | "edit";
}

export const SystemRoleModal: React.FC<SystemRoleModalProps> = ({
	isOpen,
	onClose,
	onSave,
	role,
	mode = "add",
}) => {
	const [formData, setFormData] = useState<SystemRoleFormData>({
		name: "",
		description: "",
		color: "#fed7aa",
		icon: "shield",
		permissions: [],
	});

	const [newPermission, setNewPermission] = useState("");

	useEffect(() => {
		if (role && mode === "edit") {
			setFormData({
				name: role.name,
				description: role.description || "",
				color: role.color,
				icon: role.icon || "shield",
				permissions: role.permissions || [],
			});
		} else {
			setFormData({
				name: "",
				description: "",
				color: "#fed7aa",
				icon: "shield",
				permissions: [],
			});
		}
	}, [role, mode, isOpen]);

	const handleSubmit = () => {
		if (formData.name.trim()) {
			onSave(formData);
			onClose();
		}
	};

	const addPermission = () => {
		if (newPermission.trim()) {
			setFormData({
				...formData,
				permissions: [
					...formData.permissions,
					{ id: Date.now().toString(), label: newPermission.trim() },
				],
			});
			setNewPermission("");
		}
	};

	const removePermission = (id: string) => {
		setFormData({
			...formData,
			permissions: formData.permissions.filter((p) => p.id !== id),
		});
	};

	if (!isOpen) return null;

	return (
		<ModalOverlay onClick={onClose}>
			<ModalContainer onClick={(e) => e.stopPropagation()}>
				<ModalHeader>
					<ModalTitle>
						{mode === "add" ? "Add New Role" : "Edit Role"}
					</ModalTitle>
					<CloseButton onClick={onClose}>
						<X size={20} />
					</CloseButton>
				</ModalHeader>

				<ModalBody>
					<FormGroup>
						<Label>
							Role Name <span style={{ color: "#D83232" }}>*</span>
						</Label>
						<Input
							type="text"
							value={formData.name}
							onChange={(e) =>
								setFormData({ ...formData, name: e.target.value })
							}
							placeholder="e.g., Super Admin"
						/>
					</FormGroup>

					<FormGroup>
						<Label>Description</Label>
						<Textarea
							value={formData.description}
							onChange={(e) =>
								setFormData({ ...formData, description: e.target.value })
							}
							placeholder="Brief description of this role"
						/>
					</FormGroup>

					<FormGroup>
						<Label>Icon</Label>
						<IconGrid>
							{iconOptions.map((icon) => {
								const IconComponent = icon.component;
								return (
									<IconButton
										key={icon.value}
										type="button"
										onClick={() =>
											setFormData({ ...formData, icon: icon.value })
										}
										isSelected={formData.icon === icon.value}
									>
										<IconComponent size={18} />
									</IconButton>
								);
							})}
						</IconGrid>
					</FormGroup>

					<FormGroup>
						<Label>Color Theme</Label>
						<ColorGrid>
							{colorOptions.map((color) => (
								<ColorOption
									key={color}
									type="button"
									color={color}
									isSelected={formData.color === color}
									onClick={() => setFormData({ ...formData, color })}
								/>
							))}
						</ColorGrid>
					</FormGroup>

					<FormGroup>
						<Label>Permissions</Label>
						<div>
							{formData.permissions.map((permission) => (
								<PermissionItem key={permission.id}>
									<PermissionText>{permission.label}</PermissionText>
									<RemoveButton
										type="button"
										onClick={() => removePermission(permission.id)}
									>
										Remove
									</RemoveButton>
								</PermissionItem>
							))}
						</div>
						<PermissionInputWrapper>
							<Input
								type="text"
								value={newPermission}
								onChange={(e) => setNewPermission(e.target.value)}
								placeholder="Enter permission name"
								onKeyPress={(e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										addPermission();
									}
								}}
							/>
							<Button type="button" onClick={addPermission} variant="primary">
								Add
							</Button>
						</PermissionInputWrapper>
					</FormGroup>
				</ModalBody>

				<ModalFooter>
					<Button type="button" variant="secondary" onClick={onClose}>
						Cancel
					</Button>
					<Button type="button" onClick={handleSubmit} variant="primary">
						{mode === "add" ? "Create Role" : "Save Changes"}
					</Button>
				</ModalFooter>
			</ModalContainer>
		</ModalOverlay>
	);
};

interface ProjectFormData {
	name: string;
	owner: string;
	color: string;
	members: string;
	access: string;
	lastActivity: string;
}

interface ProjectModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (data: any) => void;
	project?: any;
	mode?: "add" | "edit";
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
	isOpen,
	onClose,
	onSave,
	project,
	mode = "add",
}) => {
	const [formData, setFormData] = useState<ProjectFormData>({
		name: "",
		owner: "",
		color: "#ddd6fe",
		members: "",
		access: "",
		lastActivity: new Date().toISOString().split("T")[0],
	});

	useEffect(() => {
		if (project && mode === "edit") {
			const membersPermission = project.permissions?.find((p: Permission) =>
				p.label.includes("members"),
			);
			const accessPermission = project.permissions?.find((p: Permission) =>
				p.label.includes("with"),
			);

			setFormData({
				name: project.name,
				owner: project.description?.replace("Owner: ", "") || "",
				color: project.color,
				members: membersPermission ? membersPermission.label.split(" ")[0] : "",
				access: accessPermission
					? accessPermission.label.split("with ")[1]
					: "",
				lastActivity:
					project.permissions
						?.find((p: Permission) => p.label.includes("Last activity"))
						?.label.split(": ")[1] || new Date().toISOString().split("T")[0],
			});
		} else {
			setFormData({
				name: "",
				owner: "",
				color: "#ddd6fe",
				members: "",
				access: "",
				lastActivity: new Date().toISOString().split("T")[0],
			});
		}
	}, [project, mode, isOpen]);

	const handleSubmit = () => {
		if (formData.name.trim() && formData.owner.trim()) {
			const projectData = {
				name: formData.name,
				description: `Owner: ${formData.owner}`,
				color: formData.color,
				permissions: [
					{
						id: "1",
						label: `${formData.members} members with ${formData.access}`,
					},
					{ id: "2", label: `Last activity: ${formData.lastActivity}` },
				],
			};

			onSave(projectData);
			onClose();
		}
	};

	if (!isOpen) return null;

	return (
		<ModalOverlay onClick={onClose}>
			<ModalContainer onClick={(e) => e.stopPropagation()}>
				<ModalHeader>
					<ModalTitle>
						{mode === "add" ? "Add New Project" : "Edit Project"}
					</ModalTitle>
					<CloseButton onClick={onClose}>
						<X size={20} />
					</CloseButton>
				</ModalHeader>

				<ModalBody>
					<FormGroup>
						<Label>Project Name *</Label>
						<Input
							type="text"
							value={formData.name}
							onChange={(e) =>
								setFormData({ ...formData, name: e.target.value })
							}
							placeholder="e.g., DevChat Platform"
						/>
					</FormGroup>

					<FormGroup>
						<Label>Owner Email *</Label>
						<Input
							type="email"
							value={formData.owner}
							onChange={(e) =>
								setFormData({ ...formData, owner: e.target.value })
							}
							placeholder="e.g., admin@devchat.com"
						/>
					</FormGroup>

					<FormGroup>
						<Label>Number of Members *</Label>
						<Input
							type="number"
							value={formData.members}
							onChange={(e) =>
								setFormData({ ...formData, members: e.target.value })
							}
							placeholder="e.g., 45"
							min="0"
						/>
					</FormGroup>

					<FormGroup>
						<Label>Access Level *</Label>
						<Select
							value={formData.access}
							onChange={(e) =>
								setFormData({ ...formData, access: e.target.value })
							}
						>
							<option value="">Select access level</option>
							<option value="Full Access">Full Access</option>
							<option value="Read/Write">Read/Write</option>
							<option value="Read Only">Read Only</option>
						</Select>
					</FormGroup>

					<FormGroup>
						<Label>Color Theme</Label>
						<ColorGrid>
							{colorOptions.map((color) => (
								<ColorOption
									key={color}
									type="button"
									color={color}
									isSelected={formData.color === color}
									onClick={() => setFormData({ ...formData, color })}
								/>
							))}
						</ColorGrid>
					</FormGroup>
				</ModalBody>

				<ModalFooter>
					<Button type="button" variant="secondary" onClick={onClose}>
						Cancel
					</Button>
					<Button type="button" onClick={handleSubmit} variant="primary">
						{mode === "add" ? "Create Project" : "Save Changes"}
					</Button>
				</ModalFooter>
			</ModalContainer>
		</ModalOverlay>
	);
};

interface DeleteConfirmModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	itemName: string;
	itemType: "role" | "project";
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
	itemName,
	itemType,
}) => {
	if (!isOpen) return null;

	return (
		<ModalOverlay onClick={onClose}>
			<DeleteModalContainer onClick={(e) => e.stopPropagation()}>
				<ModalHeader>
					<ModalTitle>Confirm Delete</ModalTitle>
					<CloseButton onClick={onClose}>
						<X size={20} />
					</CloseButton>
				</ModalHeader>

				<ModalBody>
					<DeleteMessage>
						Are you sure you want to delete <strong>{itemName}</strong>?
						{itemType === "role"
							? " All users with this role will lose their associated permissions."
							: " All project data and member access will be removed."}
					</DeleteMessage>
					<WarningMessage>This action cannot be undone.</WarningMessage>
				</ModalBody>

				<ModalFooter>
					<Button variant="secondary" onClick={onClose}>
						Cancel
					</Button>
					<Button variant="danger" onClick={onConfirm}>
						Delete {itemType === "role" ? "Role" : "Project"}
					</Button>
				</ModalFooter>
			</DeleteModalContainer>
		</ModalOverlay>
	);
};
