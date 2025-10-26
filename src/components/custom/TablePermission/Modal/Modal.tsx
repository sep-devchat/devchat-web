import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Column, RolePermission } from "./../TablePermission";
import * as S from "./Modal.styled";

export interface PermissionModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: RolePermission) => void;
	columns: Column[];
	mode: "create" | "edit";
	initialData?: RolePermission;
	title?: string;
	tabType?: "api-keys" | "resource-limit" | "feature" | "other";
}

export const PermissionModal: React.FC<PermissionModalProps> = ({
	isOpen,
	onClose,
	onSubmit,
	columns,
	mode,
	initialData,
	title,
	tabType = "other",
}) => {
	const [formData, setFormData] = useState<RolePermission>({});
	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		if (isOpen) {
			if (mode === "edit" && initialData) {
				setFormData({ ...initialData });
			} else {
				const defaultData: RolePermission = {};
				columns.forEach((column) => {
					if (column.key !== "actions" && column.key !== "action") {
						defaultData[column.key] = "";
					}
				});
				setFormData(defaultData);
			}
			setErrors({});
		}
	}, [isOpen, mode, initialData, columns, tabType]);

	const isRequiredField = (key: string): boolean => {
		const requiredFields = ["code", "name", "permissionname"];
		return requiredFields.includes(key.toLowerCase());
	};

	const handleChange = (key: string, value: any) => {
		setFormData((prev) => ({ ...prev, [key]: value }));
		if (errors[key]) {
			setErrors((prev) => {
				const newErrors = { ...prev };
				delete newErrors[key];
				return newErrors;
			});
		}
	};

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		columns.forEach((column) => {
			const value = formData[column.key];

			if (column.key === "actions" || column.key === "action") {
				return;
			}

			if (tabType === "feature" && isRequiredField(column.key)) {
				if (!value || String(value).trim() === "") {
					newErrors[column.key] = `${column.label} is required!`;
				}
			}
		});

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (validateForm()) {
			const submittedData: RolePermission = {
				code: formData.code || "",
				name: formData.name || "",
				description: formData.description || "",
			};

			onSubmit(submittedData);
			onClose();
		}
	};

	const handleBackdropClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	if (!isOpen) return null;

	const modalTitle = title || (mode === "create" ? "Add" : "Update");

	return (
		<S.Overlay onClick={handleBackdropClick}>
			<S.ModalContainer onClick={(e) => e.stopPropagation()}>
				<S.ModalHeader>
					<S.ModalTitle>{modalTitle}</S.ModalTitle>
					<S.CloseButton onClick={onClose}>
						<X size={20} />
					</S.CloseButton>
				</S.ModalHeader>

				<S.ModalBody>
					<S.Form onSubmit={handleSubmit}>
						{columns
							.filter((col) => col.key !== "actions" && col.key !== "action")
							.map((column) => {
								const value = formData[column.key];
								const isRequired = isRequiredField(column.key);

								return (
									<S.FormGroup key={column.key}>
										<S.Label>
											{column.label}
											{isRequired && <S.Required>*</S.Required>}
										</S.Label>
										<S.Input
											type="text"
											value={String(value || "")}
											onChange={(e) => handleChange(column.key, e.target.value)}
											placeholder={`Nhập ${column.label.toLowerCase()}`}
											error={!!errors[column.key]}
										/>

										{errors[column.key] && (
											<S.ErrorText>{errors[column.key]}</S.ErrorText>
										)}
									</S.FormGroup>
								);
							})}

						<S.ModalFooter>
							<S.CancelButton type="button" onClick={onClose}>
								Cancel
							</S.CancelButton>
							<S.SubmitButton type="submit">
								{mode === "create" ? "Add" : "Update"}
							</S.SubmitButton>
						</S.ModalFooter>
					</S.Form>
				</S.ModalBody>
			</S.ModalContainer>
		</S.Overlay>
	);
};
