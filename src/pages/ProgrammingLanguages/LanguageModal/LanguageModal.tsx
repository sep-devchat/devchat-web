import React, { useState, useEffect, useRef } from "react";
import { X, Upload } from "lucide-react";
import {
	Column,
	RolePermission,
} from "@/components/custom/TablePermission/TablePermission";
import * as S from "./LanguageModal.styled";

const blankFormData: RolePermission = {
	languageCode: "",
	languageName: "",
	languageVersion: "",
	languageIcon: "",
	preset: "",
	isExecutable: true,
	useAiCheck: true,
	languageIconFile: null,
	languageIconRemoved: false,
};

export interface LanguageModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: RolePermission) => void;
	columns: Column[];
	mode: "create" | "edit";
	initialData?: RolePermission;
	title?: string;
	isSubmitting?: boolean;
	uploadProgress?: number | null;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({
	isOpen,
	onClose,
	onSubmit,
	columns,
	mode,
	initialData,
	title,
	isSubmitting = false,
	uploadProgress = null,
}) => {
	const [formData, setFormData] = useState<RolePermission>(blankFormData);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [iconPreview, setIconPreview] = useState<string>("");
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (!isOpen) return;
		const nextData =
			mode === "edit" && initialData
				? {
						...blankFormData,
						...initialData,
						languageIconFile: null,
						languageIconRemoved: false,
					}
				: { ...blankFormData };
		setFormData(nextData);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
		if (
			mode === "edit" &&
			initialData?.languageIcon &&
			typeof initialData.languageIcon === "string"
		) {
			setIconPreview(initialData.languageIcon);
		} else {
			setIconPreview("");
		}
		setErrors({});
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
		if (isSubmitting) return;
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

		handleChange("languageIconFile", file);
		handleChange("languageIconRemoved", false);
		const reader = new FileReader();
		reader.onloadend = () => {
			const base64String = reader.result as string;
			setIconPreview(base64String);
			handleChange("languageIcon", base64String);
		};
		reader.readAsDataURL(file);
	};

	const handleRemoveIcon = () => {
		if (isSubmitting) return;
		setIconPreview("");
		handleChange("languageIcon", "");
		handleChange("languageIconFile", null);
		handleChange("languageIconRemoved", true);
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
		if (isSubmitting) return;

		if (validateForm()) {
			const submittedData = {
				...formData,
				languageVersion: formData.languageVersion?.toString() || "",
				preset: formData.preset?.toString() || "",
				languageIcon: formData.languageIcon || "",
			};

			onSubmit(submittedData);
		}
	};

	if (!isOpen) return null;

	const modalTitle =
		title || (mode === "create" ? "Add Language" : "Update Language");

	const filteredColumns = columns.filter(
		(col) => col.key !== "actions" && col.key !== "isActive",
	);
	const hasPresetColumn = filteredColumns.some((col) => col.key === "preset");
	const showUploadProgress =
		isSubmitting && typeof uploadProgress === "number" && uploadProgress >= 0;

	return (
		<S.Overlay>
			<S.ModalContainer onClick={(e) => e.stopPropagation()}>
				<S.ModalHeader>
					<S.ModalTitle>{modalTitle}</S.ModalTitle>
					<S.CloseButton onClick={onClose} disabled={isSubmitting}>
						<X size={20} />
					</S.CloseButton>
				</S.ModalHeader>

				<S.ModalBody>
					<S.Form onSubmit={handleSubmit}>
						{filteredColumns.map((column) => {
							const value = formData[column.key];
							const isRequired = isRequiredField(column.key);

							if (
								column.key === "isExecutable" ||
								column.key === "useAiCheck"
							) {
								const checkboxId = column.key;
								const checkboxLabel =
									column.key === "useAiCheck"
										? "Enable AI code check"
										: "Enable code execution";
								return (
									<S.FormGroup key={column.key}>
										<S.CheckboxContainer>
											<S.Checkbox
												type="checkbox"
												id={checkboxId}
												checked={Boolean(value)}
												onChange={(e) =>
													handleChange(column.key, e.target.checked)
												}
											/>
											<S.CheckboxLabel htmlFor={checkboxId}>
												{checkboxLabel}
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
														disabled={isSubmitting}
													>
														<X size={16} />
													</S.RemoveIconButton>
												</S.IconPreviewContainer>
											) : (
												<S.UploadButton
													type="button"
													onClick={() => fileInputRef.current?.click()}
													disabled={isSubmitting}
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
												disabled={isSubmitting}
											/>

											<S.UploadHint>
												Supported formats: PNG, SVG, JPG (max 2MB)
											</S.UploadHint>

											{showUploadProgress && (
												<S.UploadProgressWrapper>
													<S.UploadProgressLabel>
														Uploading icon… {Math.min(uploadProgress ?? 0, 100)}
														%
													</S.UploadProgressLabel>
													<S.UploadProgressTrack>
														<S.UploadProgressFill
															style={{
																width: `${Math.min(uploadProgress ?? 0, 100)}%`,
															}}
														/>
													</S.UploadProgressTrack>
												</S.UploadProgressWrapper>
											)}
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
							<S.CancelButton
								type="button"
								onClick={onClose}
								disabled={isSubmitting}
							>
								Cancel
							</S.CancelButton>
							<S.SubmitButton type="submit" disabled={isSubmitting}>
								{isSubmitting
									? "Saving..."
									: mode === "create"
										? "Create Language"
										: "Update Language"}
							</S.SubmitButton>
						</S.ModalFooter>
					</S.Form>
				</S.ModalBody>
			</S.ModalContainer>
		</S.Overlay>
	);
};
