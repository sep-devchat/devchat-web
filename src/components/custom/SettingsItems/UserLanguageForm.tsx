/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { X } from "lucide-react";
import { Label } from "./SettingsItems.styled";
import { ProgrammingLanguageResponse } from "@/services/programmingLanguagesAPI";
import CustomSelect from "../CustomSelect/CustomSelect";

const FormWrapper = styled.div`
	background: #f9fafb;
	border: 1px solid #e5e7eb;
	border-radius: 8px;
	padding: 16px;
	margin-bottom: 12px;
	position: relative;

	@media (max-width: 1220px) {
		border-radius: 5.6px;
		padding: 11.2px;
		margin-bottom: 8.4px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		border-radius: 6.4px;
		padding: 12.8px;
		margin-bottom: 9.6px;
	}

	@media (min-width: 1920px) {
		border-radius: 8.8px;
		padding: 17.6px;
		margin-bottom: 13.2px;
	}
`;

const CloseButton = styled.button`
	position: absolute;
	top: 12px;
	right: 12px;
	background: transparent;
	border: none;
	cursor: pointer;
	color: #6b7280;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 4px;
	border-radius: 4px;
	transition: all 0.2s ease;

	&:hover {
		background: #e5e7eb;
		color: #1f2937;
	}

	&:focus {
		outline: none;
	}

	@media (max-width: 1220px) {
		top: 8.4px;
		right: 8.4px;
		padding: 2.8px;
		border-radius: 2.8px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		top: 9.6px;
		right: 9.6px;
		padding: 3.2px;
		border-radius: 3.2px;
	}

	@media (min-width: 1920px) {
		top: 13.2px;
		right: 13.2px;
		padding: 4.4px;
		border-radius: 4.4px;
	}
`;

const FormGrid = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	gap: 16px;
	margin-top: 8px;

	@media (max-width: 1220px) {
		gap: 11.2px;
		margin-top: 5.6px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		gap: 12.8px;
		margin-top: 6.4px;
	}

	@media (min-width: 1920px) {
		gap: 17.6px;
		margin-top: 8.8px;
	}

	@media (max-width: 768px) {
		grid-template-columns: 1fr;
	}
`;

const FormGroup = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;

	@media (max-width: 1220px) {
		gap: 5.6px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		gap: 6.4px;
	}

	@media (min-width: 1920px) {
		gap: 8.8px;
	}
`;

const ErrorText = styled.span`
	color: #ef4444;
	font-size: 12px;
	margin-top: 4px;

	@media (max-width: 1220px) {
		font-size: 11px;
		margin-top: 2.8px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 11.5px;
		margin-top: 3.2px;
	}

	@media (min-width: 1920px) {
		font-size: 13px;
		margin-top: 4.4px;
	}
`;

const PROFICIENCY_LEVELS = [
	{ value: "BEGINNER", label: "Beginner" },
	{ value: "INTERMEDIATE", label: "Intermediate" },
	{ value: "ADVANCED", label: "Advanced" },
	{ value: "EXPERT", label: "Expert" },
];

interface UserLanguageFormProps {
	languageId: string;
	proficiencyLevel: string;
	orderIndex: number;
	availableLanguages: ProgrammingLanguageResponse[];
	usedOrderIndexes: number[];
	maxOrderIndex: number;
	onClose: () => void;
	onChange?: (data: {
		languageId: string;
		proficiencyLevel: string;
		orderIndex: number;
	}) => void;
}

const UserLanguageForm: React.FC<UserLanguageFormProps> = ({
	languageId,
	proficiencyLevel,
	orderIndex,
	availableLanguages,
	usedOrderIndexes,
	maxOrderIndex,
	onClose,
	onChange,
}) => {
	const [formData, setFormData] = useState({
		languageId: languageId || "",
		proficiencyLevel: proficiencyLevel || "BEGINNER",
		orderIndex: orderIndex || 1,
	});

	const [errors, setErrors] = useState({
		languageId: "",
		orderIndex: "",
	});

	// Get available order indexes (excluding current if editing)
	const getAvailableOrderIndexes = () => {
		const allIndexes = Array.from({ length: maxOrderIndex }, (_, i) => i + 1);
		return allIndexes.filter(
			(index) => !usedOrderIndexes.includes(index) || index === orderIndex,
		);
	};

	const availableOrderIndexes = getAvailableOrderIndexes();

	useEffect(() => {
		if (onChange) {
			onChange(formData);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formData]);

	return (
		<FormWrapper>
			<CloseButton onClick={onClose} aria-label="Close form">
				<X size={18} />
			</CloseButton>

			<FormGrid>
				<FormGroup>
					<Label>Programming Language *</Label>
					<CustomSelect
						value={formData.languageId}
						onChange={(value) => {
							setFormData((prev) => ({ ...prev, languageId: value }));
							if (value) {
								setErrors((prev) => ({ ...prev, languageId: "" }));
							}
						}}
						options={availableLanguages.map((lang) => ({
							value: lang.id,
							label: lang.languageName,
						}))}
						placeholder="Select a language"
					/>
					{errors.languageId && <ErrorText>{errors.languageId}</ErrorText>}
				</FormGroup>

				<FormGroup>
					<Label>Proficiency Level *</Label>
					<CustomSelect
						value={formData.proficiencyLevel}
						onChange={(value) => {
							setFormData((prev) => ({ ...prev, proficiencyLevel: value }));
						}}
						options={PROFICIENCY_LEVELS}
						placeholder="Select proficiency"
					/>
				</FormGroup>

				<FormGroup>
					<Label>Order Index *</Label>
					<CustomSelect
						value={formData.orderIndex.toString()}
						onChange={(value) => {
							const numValue = parseInt(value);
							setFormData((prev) => ({ ...prev, orderIndex: numValue }));
							if (numValue) {
								setErrors((prev) => ({ ...prev, orderIndex: "" }));
							}
						}}
						options={
							availableOrderIndexes.length === 0
								? [{ value: "0", label: "No slots available" }]
								: availableOrderIndexes.map((index) => ({
										value: index.toString(),
										label: `#${index}`,
									}))
						}
						placeholder="Select order"
					/>
					{errors.orderIndex && <ErrorText>{errors.orderIndex}</ErrorText>}
				</FormGroup>
			</FormGrid>
		</FormWrapper>
	);
};

export default UserLanguageForm;
