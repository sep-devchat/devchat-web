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
						// if (tabType === "api-keys" || tabType === "feature") {
						// 	if (isRoleColumn(column.key)) {
						// 		defaultData[column.key] = false;
						// 	} else {
						// 		defaultData[column.key] = "";
						// 	}
						// } else {
						// 	defaultData[column.key] = "";
						// }
						defaultData[column.key] = "";
					}
				});
				setFormData(defaultData);
			}
			setErrors({});
		}
	}, [isOpen, mode, initialData, columns, tabType]);

	// const isRoleColumn = (key: string): boolean => {
	// 	const rolePrefixes = ["super", "admin", "moderator", "support", "member"];
	// 	const lowerKey = key.toLowerCase();
	// 	return rolePrefixes.some((prefix) => lowerKey.includes(prefix));
	// };

	const isRequiredField = (key: string): boolean => {
		// For feature type, code and name are required
		const requiredFields = ["code", "name", "permissionname"];
		return requiredFields.includes(key.toLowerCase());
	};

	// const getResourcePresets = (key: string): string[] => {
	// 	const lowerKey = key.toLowerCase();
	// 	if (lowerKey.includes("storage")) {
	// 		return RESOURCE_LIMIT_PRESETS.storage;
	// 	}
	// 	if (lowerKey.includes("size")) {
	// 		return RESOURCE_LIMIT_PRESETS.fileSize;
	// 	}
	// 	return RESOURCE_LIMIT_PRESETS.default;
	// };

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

	// const handleToggle = (key: string) => {
	// 	setFormData((prev) => ({
	// 		...prev,
	// 		[key]: !prev[key],
	// 	}));
	// };

	// const handlePresetClick = (key: string, value: string) => {
	// 	handleChange(key, value);
	// };

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		columns.forEach((column) => {
			const value = formData[column.key];

			if (column.key === "actions" || column.key === "action") {
				return;
			}

			// Validate required fields for feature type
			if (tabType === "feature" && isRequiredField(column.key)) {
				if (!value || String(value).trim() === "") {
					newErrors[column.key] = `${column.label} là bắt buộc`;
				}
			}

			// if (isFirstColumn(column.key)) {
			// 	if (!value || String(value).trim() === "") {
			// 		newErrors[column.key] = `${column.label} là bắt buộc`;
			// 	}
			// }

			// if (tabType === "resource-limit" && isRoleColumn(column.key)) {
			// 	if (!value || String(value).trim() === "") {
			// 		newErrors[column.key] = `${column.label} là bắt buộc`;
			// 	}
			// }
		});

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (validateForm()) {
			// Format data according to API requirements for feature type
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
								// const isRole = isRoleColumn(column.key);
								const isRequired = isRequiredField(column.key);

								return (
									<S.FormGroup key={column.key}>
										<S.Label>
											{column.label}
											{isRequired && <S.Required>*</S.Required>}
										</S.Label>

										{/* {(tabType === "api-keys" || tabType === "feature") &&
										isRole ? (
											<div
												style={{
													display: "flex",
													alignItems: "center",
													gap: "12px",
												}}
											>
												<label
													style={{
														display: "flex",
														alignItems: "center",
														cursor: "pointer",
														userSelect: "none",
													}}
												>
													<div
														onClick={() => handleToggle(column.key)}
														style={{
															position: "relative",
															width: "48px",
															height: "24px",
															borderRadius: "12px",
															background: value ? "#1CCA93" : "#e5e7eb",
															transition: "background 0.3s",
															cursor: "pointer",
														}}
													>
														<div
															style={{
																position: "absolute",
																top: "2px",
																left: value ? "26px" : "2px",
																width: "20px",
																height: "20px",
																borderRadius: "50%",
																background: "white",
																transition: "left 0.3s",
																boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
															}}
														/>
													</div>
													<span
														style={{
															marginLeft: "12px",
															fontSize: "14px",
															color: value ? "#1CCA93" : "#6b7280",
															fontWeight: "500",
														}}
													>
														{value ? "✓ Có quyền" : "✕ Không có quyền"}
													</span>
												</label>
											</div>
										) : tabType === "resource-limit" && isRole ? (
											<div>
												<S.Input
													type="text"
													value={String(value || "")}
													onChange={(e) =>
														handleChange(column.key, e.target.value)
													}
													placeholder="Nhập giá trị hoặc chọn preset"
													error={!!errors[column.key]}
												/>
												<div
													style={{
														display: "flex",
														flexWrap: "wrap",
														gap: "8px",
														marginTop: "8px",
													}}
												>
													{getResourcePresets(column.key).map((preset) => (
														<button
															key={preset}
															type="button"
															onClick={() =>
																handlePresetClick(column.key, preset)
															}
															style={{
																padding: "6px 12px",
																fontSize: "12px",
																borderRadius: "6px",
																border:
																	value === preset
																		? "2px solid #133e87"
																		: "1px solid #e5e7eb",
																background:
																	value === preset ? "#eff6ff" : "white",
																color: value === preset ? "#133e87" : "#6b7280",
																cursor: "pointer",
																transition: "all 0.2s",
																fontWeight: value === preset ? "600" : "500",
															}}
															onMouseEnter={(e) => {
																if (value !== preset) {
																	e.currentTarget.style.background = "#f9fafb";
																	e.currentTarget.style.borderColor = "#d1d5db";
																}
															}}
															onMouseLeave={(e) => {
																if (value !== preset) {
																	e.currentTarget.style.background = "white";
																	e.currentTarget.style.borderColor = "#e5e7eb";
																}
															}}
														>
															{preset}
														</button>
													))}
												</div>
												{errors[column.key] && (
													<S.ErrorText>{errors[column.key]}</S.ErrorText>
												)}
											</div>
										) : ( */}
										<S.Input
											type="text"
											value={String(value || "")}
											onChange={(e) => handleChange(column.key, e.target.value)}
											placeholder={`Nhập ${column.label.toLowerCase()}`}
											error={!!errors[column.key]}
										/>
										{/* )} */}

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
