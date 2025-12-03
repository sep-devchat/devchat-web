import React, { useState, useEffect, useRef } from "react";
import { X, Upload } from "lucide-react";
import {
	Column,
	RolePermission,
} from "@/components/custom/TablePermission/TablePermission";
import * as S from "./LanguageModal.styled";

export interface LanguageModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: RolePermission) => void;
	columns: Column[];
	mode: "create" | "edit";
	initialData?: RolePermission;
	title?: string;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({
	isOpen,
	onClose,
	onSubmit,
	columns,
	mode,
	initialData,
	title,
}) => {
	const [formData, setFormData] = useState<RolePermission>({});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [iconPreview, setIconPreview] = useState<string>("");
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (isOpen) {
			if (mode === "edit" && initialData) {
				setFormData({ ...initialData });
				if (
					initialData.languageIcon &&
					typeof initialData.languageIcon === "string"
				) {
					setIconPreview(initialData.languageIcon);
				}
			} else {
				const defaultData: RolePermission = {
					languageCode: "",
					languageName: "",
					languageVersion: "",
					languageIcon: "",
					preset: "",
					isExecutable: true,
				};
				setFormData(defaultData);
				setIconPreview("");
			}
			setErrors({});
		}
	}, [isOpen, mode, initialData]);

	const isRequiredField = (key: string): boolean => {
		const requiredFields = ["languagecode", "languagename"];
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

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const validTypes = [
			"image/png",
			"image/svg+xml",
			"image/jpeg",
			"image/jpg",
		];
		if (!validTypes.includes(file.type)) {
			setErrors((prev) => ({
				...prev,
				languageIcon: "Please upload a valid image file (.png, .svg, .jpg)",
			}));
			return;
		}

		if (file.size > 2 * 1024 * 1024) {
			setErrors((prev) => ({
				...prev,
				languageIcon: "File size must be less than 2MB",
			}));
			return;
		}

		const reader = new FileReader();
		reader.onloadend = () => {
			const base64String = reader.result as string;
			setIconPreview(base64String);
			handleChange("languageIcon", base64String);
		};
		reader.readAsDataURL(file);
	};

	const handleRemoveIcon = () => {
		setIconPreview("");
		handleChange("languageIcon", "");
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		columns.forEach((column) => {
			const value = formData[column.key];

			if (column.key === "actions") {
				return;
			}

			if (isRequiredField(column.key)) {
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
			const submittedData = {
				...formData,
				languageVersion: formData.languageVersion?.toString() || "",
				preset: formData.preset?.toString() || "",
				languageIcon: formData.languageIcon || "",
			};

			onSubmit(submittedData);
			onClose();
		}
	};

	if (!isOpen) return null;

	const modalTitle =
		title || (mode === "create" ? "Add Language" : "Update Language");

	const filteredColumns = columns.filter(
		(col) => col.key !== "actions" && col.key !== "isActive",
	);
	const hasPresetColumn = filteredColumns.some((col) => col.key === "preset");

	return (
		<S.Overlay>
			<S.ModalContainer onClick={(e) => e.stopPropagation()}>
				<S.ModalHeader>
					<S.ModalTitle>{modalTitle}</S.ModalTitle>
					<S.CloseButton onClick={onClose}>
						<X size={20} />
					</S.CloseButton>
				</S.ModalHeader>

				<S.ModalBody>
					<S.Form onSubmit={handleSubmit}>
						{filteredColumns.map((column) => {
							const value = formData[column.key];
							const isRequired = isRequiredField(column.key);

							if (column.key === "isExecutable") {
								return (
									<S.FormGroup key={column.key}>
										<S.CheckboxContainer>
											<S.Checkbox
												type="checkbox"
												id="isExecutable"
												checked={Boolean(value)}
												onChange={(e) =>
													handleChange(column.key, e.target.checked)
												}
											/>
											<S.CheckboxLabel htmlFor="isExecutable">
												Code execution
											</S.CheckboxLabel>
										</S.CheckboxContainer>
									</S.FormGroup>
								);
							}

							if (column.key === "languageIcon") {
								return (
									<S.FormGroup key={column.key}>
										<S.Label>
											{column.label}
											{isRequired && <S.Required>*</S.Required>}
										</S.Label>

										<S.IconUploadContainer>
											{iconPreview ? (
												<S.IconPreviewContainer>
													<S.IconPreview
														src={iconPreview}
														alt="Language icon"
													/>
													<S.RemoveIconButton
														type="button"
														onClick={handleRemoveIcon}
													>
														<X size={16} />
													</S.RemoveIconButton>
												</S.IconPreviewContainer>
											) : (
												<S.UploadButton
													type="button"
													onClick={() => fileInputRef.current?.click()}
												>
													<Upload size={20} />
													<span>Upload Icon (Optional)</span>
												</S.UploadButton>
											)}

											<S.HiddenFileInput
												ref={fileInputRef}
												type="file"
												accept=".png,.svg,.jpg,.jpeg"
												onChange={handleFileUpload}
											/>

											<S.UploadHint>
												Supported formats: PNG, SVG, JPG (max 2MB)
											</S.UploadHint>
										</S.IconUploadContainer>

										{errors[column.key] && (
											<S.ErrorText>{errors[column.key]}</S.ErrorText>
										)}
									</S.FormGroup>
								);
							}

							const getPlaceholder = (key: string, label: string) => {
								if (key === "languageVersion") {
									return "Enter version";
								}
								return `Enter ${label.toLowerCase()}`;
							};

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
										placeholder={getPlaceholder(column.key, column.label)}
										error={!!errors[column.key]}
									/>

									{errors[column.key] && (
										<S.ErrorText>{errors[column.key]}</S.ErrorText>
									)}
								</S.FormGroup>
							);
						})}

						{!hasPresetColumn && (
							<S.FormGroup key="preset">
								<S.Label>Preset</S.Label>
								<S.Textarea
									value={String(formData.preset || "")}
									onChange={(e) => handleChange("preset", e.target.value)}
									placeholder="Enter preset configuration (optional)"
									error={!!errors.preset}
								/>

								{errors.preset && <S.ErrorText>{errors.preset}</S.ErrorText>}
							</S.FormGroup>
						)}

						<S.ModalFooter>
							<S.CancelButton type="button" onClick={onClose}>
								Cancel
							</S.CancelButton>
							<S.SubmitButton type="submit">
								{mode === "create" ? "Create Language" : "Update Language"}
							</S.SubmitButton>
						</S.ModalFooter>
					</S.Form>
				</S.ModalBody>
			</S.ModalContainer>
		</S.Overlay>
	);
};
