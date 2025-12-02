/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { Check, Edit2, Trash2 } from "lucide-react";
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

const EditSelectGrid = styled.div`
	display: grid;
	grid-template-columns: 1.3fr 1fr 1fr;
	gap: 8px;
	margin-top: 4px;

	@media (max-width: 768px) {
		grid-template-columns: 1fr;
	}
`;

const EditSelectWrapper = styled.div`
	width: 100%;
`;

const EditControls = styled.div`
	display: flex;
	gap: 8px;
	align-items: center;
`;

const EditActionButton = styled.button<{ $variant?: "primary" | "ghost" }>`
	padding: 8px 14px;
	border-radius: 6px;
	font-size: 13px;
	font-weight: 600;
	border: 1px solid
		${(props) => (props.$variant === "primary" ? "#133e87" : "#d1d5db")};
	background: ${(props) =>
		props.$variant === "primary" ? "#133e87" : "transparent"};
	color: ${(props) => (props.$variant === "primary" ? "#ffffff" : "#4b5563")};
	transition: all 0.2s ease;
	cursor: pointer;

	&:hover {
		background: ${(props) =>
			props.$variant === "primary" ? "#0f3071" : "#f3f4f6"};
	}
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
	onChange?: (data: {
		languageId: string;
		proficiencyLevel: string;
		orderIndex: number;
	}) => void;
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

type LanguageEditData = {
	languageId: string;
	proficiencyLevel: string;
	orderIndex: number;
};

const UserLanguageItem: React.FC<UserLanguageItemProps> = ({
	language,
	isTopThree,
	availableLanguages = [],
	usedOrderIndexes = [],
	maxOrderIndex = 10,
	isEditing = false,
	onEdit,
	onCancelEdit,
	onChange,
	onDelete,
}) => {
	const normalizedLanguageId = language.languageId || language.id || "";
	const getBaseData = (): LanguageEditData => ({
		languageId: normalizedLanguageId,
		proficiencyLevel: language.proficiencyLevel,
		orderIndex: language.orderIndex,
	});
	const [editData, setEditData] = useState<LanguageEditData>(getBaseData());
	const [initialEditData, setInitialEditData] =
		useState<LanguageEditData>(getBaseData());
	const wasEditingRef = useRef(false);

	useEffect(() => {
		const snapshot = getBaseData();
		if (isEditing && !wasEditingRef.current) {
			setEditData(snapshot);
			setInitialEditData(snapshot);
		}
		if (!isEditing) {
			setEditData(snapshot);
		}
		wasEditingRef.current = isEditing;
	}, [
		isEditing,
		normalizedLanguageId,
		language.proficiencyLevel,
		language.orderIndex,
	]);

	const resolveLanguageName = () => {
		if (language.languageName && language.languageName !== "string") {
			return language.languageName;
		}
		const fallback = availableLanguages.find((lang) => {
			return lang.id === (language.languageId || language.id);
		});
		return fallback?.languageName || "Unknown";
	};

	const getAvailableOrderIndexes = () => {
		const allIndexes = Array.from({ length: maxOrderIndex }, (_, i) => i + 1);
		return allIndexes.filter(
			(index) =>
				!usedOrderIndexes.includes(index) || index === language.orderIndex,
		);
	};

	const resolvedLanguageName = resolveLanguageName();

	const languageOptions = useMemo(() => {
		if (!normalizedLanguageId) return availableLanguages;
		const exists = availableLanguages.some(
			(langOption) => langOption.id === normalizedLanguageId,
		);
		if (exists) return availableLanguages;
		return [
			...availableLanguages,
			{
				id: normalizedLanguageId,
				languageName: resolvedLanguageName,
				languageCode: "",
				languageIcon: language.languageIcon,
				languageVersion: "",
				syntaxHighlighting: "",
				codeExecutions: 0,
				isExecutable: false,
				isActive: true,
				createdAt: "",
				createdBy: "",
				updatedAt: "",
				updatedBy: "",
			} as ProgrammingLanguageResponse,
		];
	}, [
		availableLanguages,
		normalizedLanguageId,
		language.languageIcon,
		resolvedLanguageName,
	]);

	const editingLanguageDetails = useMemo(() => {
		const selectedId = isEditing ? editData.languageId : normalizedLanguageId;
		if (!selectedId) {
			return {
				name: resolvedLanguageName,
				icon: language.languageIcon,
			};
		}
		const selected = languageOptions.find(
			(langOption) => langOption.id === selectedId,
		);
		if (selected) {
			return { name: selected.languageName, icon: selected.languageIcon };
		}
		return {
			name: resolvedLanguageName,
			icon: language.languageIcon,
		};
	}, [
		isEditing,
		editData.languageId,
		normalizedLanguageId,
		language.languageIcon,
		languageOptions,
		resolvedLanguageName,
	]);

	const handleFieldChange = (patch: Partial<LanguageEditData>) => {
		setEditData((prev) => {
			const next = { ...prev, ...patch } as LanguageEditData;
			onChange?.(next);
			return next;
		});
	};

	const handleDone = () => {
		if (onCancelEdit) {
			onCancelEdit();
		}
	};

	const handleCancel = () => {
		setEditData(initialEditData);
		onChange?.(initialEditData);
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
						src={editingLanguageDetails.icon}
						alt={editingLanguageDetails.name}
						onError={(e: any) => {
							e.target.src =
								"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect fill='%23ddd' width='40' height='40'/%3E%3C/svg%3E";
						}}
					/>
					<LanguageDetails style={{ flex: 1 }}>
						<LanguageName $isTopThree={isTopThree}>
							{editingLanguageDetails.name}
						</LanguageName>
						<EditSelectGrid>
							<EditSelectWrapper>
								<StyledSelect
									value={editData.languageId}
									onValueChange={(value) =>
										handleFieldChange({ languageId: value })
									}
									options={languageOptions.map((langOption) => ({
										value: langOption.id,
										label: langOption.languageName,
									}))}
									placeholder="Programming language"
									isTopThree={isTopThree}
								/>
							</EditSelectWrapper>
							<EditSelectWrapper>
								<StyledSelect
									value={editData.proficiencyLevel}
									onValueChange={(value) =>
										handleFieldChange({ proficiencyLevel: value })
									}
									options={PROFICIENCY_LEVELS}
									placeholder="Proficiency"
									isTopThree={isTopThree}
								/>
							</EditSelectWrapper>
							<EditSelectWrapper>
								<StyledSelect
									value={editData.orderIndex.toString()}
									onValueChange={(value) =>
										handleFieldChange({
											orderIndex: parseInt(value, 10),
										})
									}
									options={getAvailableOrderIndexes().map((index) => ({
										value: index.toString(),
										label: `#${index}`,
									}))}
									placeholder="Order"
									isTopThree={isTopThree}
								/>
							</EditSelectWrapper>
						</EditSelectGrid>
					</LanguageDetails>
				</LanguageInfo>
				<EditControls>
					<IconButton
						icon={Check}
						size={32}
						iconSize={16}
						color={isTopThree ? "#1f2937" : "#10b981"}
						onClick={handleDone}
						hoverBg={
							isTopThree ? "rgba(19,62,135,0.12)" : "rgba(16,185,129,0.1)"
						}
						ariaLabel="Update language"
						title="Update"
					/>
					<IconButton
						icon={Trash2}
						size={32}
						iconSize={16}
						color="#ef4444"
						onClick={onDelete}
						hoverBg={
							isTopThree ? "rgba(239,68,68,0.15)" : "rgba(239,68,68,0.1)"
						}
						ariaLabel="Delete language"
						title="Delete"
					/>
					<EditActionButton $variant="ghost" onClick={handleCancel}>
						Cancel
					</EditActionButton>
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
					alt={resolvedLanguageName}
					onError={(e: any) => {
						e.target.src =
							"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect fill='%23ddd' width='40' height='40'/%3E%3C/svg%3E";
					}}
				/>
				<LanguageDetails>
					<LanguageName $isTopThree={isTopThree}>
						{resolvedLanguageName}
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
					color="#1f2937"
					onClick={onEdit}
					hoverBg={isTopThree ? "rgba(19,62,135,0.12)" : "rgba(0,0,0,0.05)"}
					ariaLabel="Edit language"
					title="Edit"
				/>
				<IconButton
					icon={Trash2}
					size={32}
					iconSize={16}
					color="#ef4444"
					onClick={onDelete}
					hoverBg={isTopThree ? "rgba(239,68,68,0.12)" : "rgba(239,68,68,0.1)"}
					ariaLabel="Delete language"
					title="Delete"
				/>
			</ActionsContainer>
		</LanguageItemWrapper>
	);
};

export default UserLanguageItem;
