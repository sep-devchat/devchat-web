/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import styled from "styled-components";
import { Edit2, Trash2, Check, X } from "lucide-react";
import IconButton from "../ActionButton/IconButton";
import { ProgrammingLanguageResponse } from "@/services/programmingLanguagesAPI";
import StyledSelect from "../CustomSelect/StyledSelect";
import { theme } from "@/themes";

const LanguageItemWrapper = styled.div<{ $isTopThree: boolean }>`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12px 16px;
	border-radius: 8px;

	background: "#f9fafb";
	border: 1px solid ${(props) => (props.$isTopThree ? "#667eea" : "#e5e7eb")};
	margin-bottom: 8px;
	transition: all 0.2s ease;

	&:hover {
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	@media (max-width: 1220px) {
		padding: 8.4px 11.2px;
		border-radius: 5.6px;
		margin-bottom: 5.6px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		padding: 9.6px 12.8px;
		border-radius: 6.4px;
		margin-bottom: 6.4px;
	}

	@media (min-width: 1920px) {
		padding: 13.2px 17.6px;
		border-radius: 8.8px;
		margin-bottom: 8.8px;
	}
`;

const LanguageInfo = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
	flex: 1;

	@media (max-width: 1220px) {
		gap: 8.4px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		gap: 9.6px;
	}

	@media (min-width: 1920px) {
		gap: 13.2px;
	}
`;

const LanguageIcon = styled.img`
	width: 40px;
	height: 40px;
	border-radius: 8px;
	object-fit: cover;

	@media (max-width: 1220px) {
		width: 28px;
		height: 28px;
		border-radius: 5.6px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		width: 32px;
		height: 32px;
		border-radius: 6.4px;
	}

	@media (min-width: 1920px) {
		width: 44px;
		height: 44px;
		border-radius: 8.8px;
	}
`;

const LanguageDetails = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;

	@media (max-width: 1220px) {
		gap: 2.8px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		gap: 3.2px;
	}

	@media (min-width: 1920px) {
		gap: 4.4px;
	}
`;

const LanguageName = styled.span<{ $isTopThree: boolean }>`
	font-size: 14px;
	font-weight: 600;
	// color: ${(props) => (props.$isTopThree ? "#ffffff" : "#1f2937")};

	@media (max-width: 1220px) {
		font-size: 12.5px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 13.5px;
	}

	@media (min-width: 1920px) {
		font-size: 16px;
	}
`;

const LanguageMeta = styled.span<{ $isTopThree: boolean }>`
	font-size: 12px;
	color: ${(props) => (props.$isTopThree ? theme.color.primary : "#6b7280")};

	@media (max-width: 1220px) {
		font-size: 11px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 11.5px;
	}

	@media (min-width: 1920px) {
		font-size: 13px;
	}
`;

const RankBadge = styled.div`
	background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
	color: #ffffff;
	font-size: 12px;
	font-weight: 700;
	padding: 4px 12px;
	border-radius: 12px;
	margin-right: 8px;

	@media (max-width: 1220px) {
		font-size: 11px;
		padding: 2.8px 8.4px;
		border-radius: 8.4px;
		margin-right: 5.6px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 11.5px;
		padding: 3.2px 9.6px;
		border-radius: 9.6px;
		margin-right: 6.4px;
	}

	@media (min-width: 1920px) {
		font-size: 13px;
		padding: 4.4px 13.2px;
		border-radius: 13.2px;
		margin-right: 8.8px;
	}
`;

const ActionsContainer = styled.div`
	display: flex;
	gap: 8px;
	align-items: center;

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

const EditSelectWrapper = styled.div`
	flex: 1;
`;

const EditControls = styled.div`
	display: flex;
	gap: 8px;
	align-items: center;
`;

const PROFICIENCY_LEVELS = [
	{ value: "BEGINNER", label: "Beginner" },
	{ value: "INTERMEDIATE", label: "Intermediate" },
	{ value: "ADVANCED", label: "Advanced" },
	{ value: "EXPERT", label: "Expert" },
];

interface UserLanguageItemProps {
	language: {
		id: string;
		languageId?: string;
		languageName: string;
		languageIcon: string;
		proficiencyLevel: string;
		orderIndex: number;
	};
	isTopThree: boolean;
	availableLanguages?: ProgrammingLanguageResponse[];
	usedOrderIndexes?: number[];
	maxOrderIndex?: number;
	isEditing?: boolean;
	onEdit: () => void;
	onCancelEdit?: () => void;
	onUpdate?: (data: { proficiencyLevel: string; orderIndex: number }) => void;
	onDelete: () => void;
}

const getProficiencyLabel = (level: string): string => {
	const labels: Record<string, string> = {
		BEGINNER: "Beginner",
		INTERMEDIATE: "Intermediate",
		ADVANCED: "Advanced",
		EXPERT: "Expert",
	};
	return labels[level] || level;
};

const UserLanguageItem: React.FC<UserLanguageItemProps> = ({
	language,
	isTopThree,
	// availableLanguages,
	usedOrderIndexes = [],
	maxOrderIndex = 10,
	isEditing = false,
	onEdit,
	onCancelEdit,
	onUpdate,
	onDelete,
}) => {
	const [editData, setEditData] = useState({
		proficiencyLevel: language.proficiencyLevel,
		orderIndex: language.orderIndex,
	});

	const getAvailableOrderIndexes = () => {
		const allIndexes = Array.from({ length: maxOrderIndex }, (_, i) => i + 1);
		return allIndexes.filter(
			(index) =>
				!usedOrderIndexes.includes(index) || index === language.orderIndex,
		);
	};

	const handleSave = () => {
		if (onUpdate) {
			onUpdate(editData);
		}
		if (onCancelEdit) {
			onCancelEdit();
		}
	};

	const handleCancel = () => {
		setEditData({
			proficiencyLevel: language.proficiencyLevel,
			orderIndex: language.orderIndex,
		});
		if (onCancelEdit) {
			onCancelEdit();
		}
	};

	if (isEditing) {
		return (
			<LanguageItemWrapper $isTopThree={isTopThree}>
				<LanguageInfo>
					{isTopThree && <RankBadge>#{language.orderIndex}</RankBadge>}
					<LanguageIcon
						src={language.languageIcon}
						alt={language.languageName}
						onError={(e: any) => {
							e.target.src =
								"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect fill='%23ddd' width='40' height='40'/%3E%3C/svg%3E";
						}}
					/>
					<LanguageDetails style={{ flex: 1 }}>
						<LanguageName $isTopThree={isTopThree}>
							{language.languageName}
						</LanguageName>
						<div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
							<EditSelectWrapper>
								<StyledSelect
									value={editData.proficiencyLevel}
									onValueChange={(value) => {
										setEditData((prev) => ({
											...prev,
											proficiencyLevel: value,
										}));
									}}
									options={PROFICIENCY_LEVELS}
									placeholder="Proficiency"
									isTopThree={isTopThree}
								/>
							</EditSelectWrapper>
							<EditSelectWrapper>
								<StyledSelect
									value={editData.orderIndex.toString()}
									onValueChange={(value) => {
										setEditData((prev) => ({
											...prev,
											orderIndex: parseInt(value),
										}));
									}}
									options={getAvailableOrderIndexes().map((index) => ({
										value: index.toString(),
										label: `#${index}`,
									}))}
									placeholder="Order"
									isTopThree={isTopThree}
								/>
							</EditSelectWrapper>
						</div>
					</LanguageDetails>
				</LanguageInfo>
				<EditControls>
					<IconButton
						icon={Check}
						size={32}
						iconSize={16}
						color={isTopThree ? "#ffffff" : "#10b981"}
						onClick={handleSave}
						hoverBg={
							isTopThree ? "rgba(255,255,255,0.2)" : "rgba(16,185,129,0.1)"
						}
						ariaLabel="Save changes"
						title="Save"
					/>
					<IconButton
						icon={X}
						size={32}
						iconSize={16}
						color={isTopThree ? "#ffffff" : "#6b7280"}
						onClick={handleCancel}
						hoverBg={isTopThree ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.05)"}
						ariaLabel="Cancel"
						title="Cancel"
					/>
				</EditControls>
			</LanguageItemWrapper>
		);
	}

	return (
		<LanguageItemWrapper $isTopThree={isTopThree}>
			<LanguageInfo>
				{isTopThree && <RankBadge>#{language.orderIndex}</RankBadge>}
				<LanguageIcon
					src={language.languageIcon}
					alt={language.languageName}
					onError={(e: any) => {
						e.target.src =
							"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect fill='%23ddd' width='40' height='40'/%3E%3C/svg%3E";
					}}
				/>
				<LanguageDetails>
					<LanguageName $isTopThree={isTopThree}>
						{language.languageName}
					</LanguageName>
					<LanguageMeta $isTopThree={isTopThree}>
						{getProficiencyLabel(language.proficiencyLevel)}
						{!isTopThree && ` • #${language.orderIndex}`}
					</LanguageMeta>
				</LanguageDetails>
			</LanguageInfo>
			<ActionsContainer>
				<IconButton
					icon={Edit2}
					size={32}
					iconSize={16}
					color={isTopThree ? "#ffffff" : "#6b7280"}
					onClick={onEdit}
					hoverBg={isTopThree ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.05)"}
					ariaLabel="Edit language"
					title="Edit"
				/>
				<IconButton
					icon={Trash2}
					size={32}
					iconSize={16}
					color={isTopThree ? "#ffffff" : "#ef4444"}
					onClick={onDelete}
					hoverBg={isTopThree ? "rgba(255,255,255,0.2)" : "rgba(239,68,68,0.1)"}
					ariaLabel="Delete language"
					title="Delete"
				/>
			</ActionsContainer>
		</LanguageItemWrapper>
	);
};

export default UserLanguageItem;
