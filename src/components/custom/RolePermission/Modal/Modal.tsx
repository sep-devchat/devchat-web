import React, { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";

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
	ColorGrid,
	ColorOption,
	PermissionItem,
	PermissionText,
	RemoveButton,
	PermissionInputWrapper,
	ModalFooter,
	Button,
	SelectWrapper,
	CustomSelect,
	SelectIcon,
	OptionsDropdown,
	Option,
	DeleteModalContainer,
	DeleteMessage,
	WarningMessage,
} from "./Modal.styled";

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

const availablePermissions: Permission[] = [
	{ id: "p1", label: "Manage Users" },
	{ id: "p2", label: "Edit Content" },
	{ id: "p3", label: "View Reports" },
	{ id: "p4", label: "System Configuration" },
	{ id: "p5", label: "Moderator Tools" },
];

const levelOptions = [1, 2, 3, 4];

interface SystemRoleFormData {
	id: string;
	role: string;
	name: string;
	level: number;
	color: string;
	permissions: Permission[];
}

interface SystemRoleModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (data: SystemRoleFormData) => void;
	role?: any;
	mode?: "add" | "edit";
}

const getEmptyFormData = (): SystemRoleFormData => ({
	id: "",
	role: "",
	name: "",
	level: 1,
	color: "#fed7aa",
	permissions: [],
});

export const SystemRoleModal: React.FC<SystemRoleModalProps> = ({
	isOpen,
	onClose,
	onSave,
	role,
	mode = "add",
}) => {
	const [formData, setFormData] =
		useState<SystemRoleFormData>(getEmptyFormData());
	const [originalData, setOriginalData] =
		useState<SystemRoleFormData>(getEmptyFormData());
	const [newPermissionId, setNewPermissionId] = useState("");
	const [openDropdown, setOpenDropdown] = useState<
		"level" | "permissions" | null
	>(null);

	const levelRef = React.useRef<HTMLDivElement>(null);
	const permissionsRef = React.useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (isOpen) {
			if (mode === "edit" && role) {
				const initialData = {
					id: role.id || "",
					role: role.role || "",
					name: role.name || "",
					level: role.level || 1,
					color: role.color || "#fed7aa",
					permissions: role.permissions ? [...role.permissions] : [],
				};
				setFormData(initialData);
				setOriginalData(initialData);
			} else {
				const emptyData = getEmptyFormData();
				setFormData(emptyData);
				setOriginalData(emptyData);
			}
			setNewPermissionId("");
			setOpenDropdown(null);
		}
	}, [isOpen, role, mode]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				levelRef.current &&
				!levelRef.current.contains(event.target as Node) &&
				openDropdown === "level"
			) {
				setOpenDropdown(null);
			}
			if (
				permissionsRef.current &&
				!permissionsRef.current.contains(event.target as Node) &&
				openDropdown === "permissions"
			) {
				setOpenDropdown(null);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [openDropdown]);

	const isFormValid = () => {
		const hasRequiredFields =
			formData.name.trim() !== "" && formData.role.trim() !== "";

		if (mode === "add") {
			return hasRequiredFields && formData.permissions.length > 0;
		}

		return hasRequiredFields;
	};

	const hasChanges = () => {
		if (mode === "add") {
			return isFormValid();
		}

		const roleChanged = formData.role !== originalData.role;
		const nameChanged = formData.name !== originalData.name;
		const levelChanged = formData.level !== originalData.level;
		const colorChanged = formData.color !== originalData.color;

		const currentPermissionIds = [...formData.permissions]
			.map((p) => p.id)
			.sort()
			.join(",");
		const originalPermissionIds = [...originalData.permissions]
			.map((p) => p.id)
			.sort()
			.join(",");
		const permissionsChanged = currentPermissionIds !== originalPermissionIds;

		const hasAnyChanges =
			roleChanged ||
			nameChanged ||
			levelChanged ||
			colorChanged ||
			permissionsChanged;

		return hasAnyChanges && isFormValid();
	};

	const handleSubmit = () => {
		if (hasChanges()) {
			onSave(formData);
		}
	};

	const addPermission = () => {
		if (newPermissionId) {
			const selectedPermission = availablePermissions.find(
				(p) => p.id === newPermissionId,
			);

			if (
				selectedPermission &&
				!formData.permissions?.some((fp) => fp.id === selectedPermission.id)
			) {
				setFormData((prev) => ({
					...prev,
					permissions: [...(prev.permissions || []), selectedPermission],
				}));
				setNewPermissionId("");
				setOpenDropdown(null);
			}
		}
	};

	const removePermission = (id: string) => {
		setFormData((prev) => ({
			...prev,
			permissions: (prev.permissions || []).filter((p) => p.id !== id),
		}));
	};

	const getPermissionLabel = (id: string) => {
		return (
			availablePermissions.find((p) => p.id === id)?.label ||
			"Select permission to add"
		);
	};

	if (!isOpen) return null;

	const permissionsToAdd = availablePermissions.filter(
		(p) => !formData.permissions?.some((fp) => fp.id === p.id),
	);

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
							Role <span style={{ color: "#D83232" }}>*</span>
						</Label>
						<Input
							type="text"
							value={formData.role}
							onChange={(e) =>
								setFormData({ ...formData, role: e.target.value })
							}
							placeholder="e.g., ADMIN"
						/>
					</FormGroup>

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
						<Label>Level</Label>
						<SelectWrapper ref={levelRef}>
							<CustomSelect
								$isOpen={openDropdown === "level"}
								onClick={() =>
									setOpenDropdown(openDropdown === "level" ? null : "level")
								}
							>
								Level {formData.level}
							</CustomSelect>
							<SelectIcon $isOpen={openDropdown === "level"}>
								<ChevronDown size={18} />
							</SelectIcon>

							{openDropdown === "level" && (
								<OptionsDropdown>
									{levelOptions.map((level) => (
										<Option
											key={level}
											$isSelected={formData.level === level}
											onClick={() => {
												setFormData({ ...formData, level: level });
												setOpenDropdown(null);
											}}
										>
											Level {level}
										</Option>
									))}
								</OptionsDropdown>
							)}
						</SelectWrapper>
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
						<Label>
							Permissions <span style={{ color: "#D83232" }}>*</span>
						</Label>
						<div>
							{formData.permissions?.map((permission) => (
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
						{/* {mode === "add" && formData.permissions.length === 0 && (
							<div style={{ color: "#D83232", fontSize: "12px", marginTop: "8px" }}>
								At least one permission is required
							</div>
						)} */}

						<PermissionInputWrapper>
							<SelectWrapper ref={permissionsRef}>
								<CustomSelect
									$isOpen={openDropdown === "permissions"}
									onClick={() =>
										permissionsToAdd.length > 0 &&
										setOpenDropdown(
											openDropdown === "permissions" ? null : "permissions",
										)
									}
								>
									{newPermissionId
										? getPermissionLabel(newPermissionId)
										: permissionsToAdd.length > 0
											? "Select permission to add"
											: "All permissions added"}
								</CustomSelect>
								<SelectIcon $isOpen={openDropdown === "permissions"}>
									<ChevronDown size={18} />
								</SelectIcon>

								{openDropdown === "permissions" &&
									permissionsToAdd.length > 0 && (
										<OptionsDropdown>
											{permissionsToAdd.map((permission) => (
												<Option
													key={permission.id}
													$isSelected={newPermissionId === permission.id}
													onClick={() => {
														setNewPermissionId(permission.id);
														setOpenDropdown(null);
													}}
												>
													{permission.label}
												</Option>
											))}
										</OptionsDropdown>
									)}
							</SelectWrapper>

							<Button
								type="button"
								onClick={addPermission}
								variant="primary"
								disabled={!newPermissionId || permissionsToAdd.length === 0}
							>
								Add
							</Button>
						</PermissionInputWrapper>
					</FormGroup>
				</ModalBody>

				<ModalFooter>
					<Button type="button" variant="secondary" onClick={onClose}>
						Cancel
					</Button>
					<Button
						type="button"
						onClick={handleSubmit}
						variant="primary"
						disabled={!hasChanges()}
					>
						{mode === "add" ? "Create Role" : "Save Changes"}
					</Button>
				</ModalFooter>
			</ModalContainer>
		</ModalOverlay>
	);
};

// --------------------------------------------------------------------
// DeleteConfirmModal
// --------------------------------------------------------------------

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
