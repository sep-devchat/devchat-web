/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Code2, Plus } from "lucide-react";
import UserLanguageItem from "@/components/custom/SettingsItems/UserLanguageItem";
import UserLanguageForm from "@/components/custom/SettingsItems/UserLanguageForm";
import {
	LanguagesContainer,
	LanguagesSectionHeader,
	LanguagesSectionIcon,
	LanguagesSectionInfo,
	LanguagesSectionTitle,
	LanguagesSectionDescription,
	LanguagesSection,
	AddButton,
	EmptyState,
} from "./AccountSettings.styled";

interface ProgrammingLanguagesSectionProps {
	userLanguages: any[];
	newLanguageForms: any[];
	availableLanguages: any[];
	editingLanguageId: string | null;
	handleAddLanguage: () => void;
	handleEditLanguage: (id: string) => void;
	handleCancelEditLanguage: () => void;
	handleUpdateLanguage: (id: string, data: any) => void;
	handleDeleteLanguage: (id: string) => void;
	handleNewLanguageChange: (id: string, data: any) => void;
	handleRemoveNewLanguageForm: (id: string) => void;
	getAvailableLanguages: () => any[];
	getUsedOrderIndexes: (excludeId?: string) => number[];
	getMaxOrderIndex: () => number;
}

export const ProgrammingLanguagesSection: React.FC<
	ProgrammingLanguagesSectionProps
> = ({
	userLanguages,
	newLanguageForms,
	availableLanguages,
	editingLanguageId,
	handleAddLanguage,
	handleEditLanguage,
	handleCancelEditLanguage,
	handleUpdateLanguage,
	handleDeleteLanguage,
	handleNewLanguageChange,
	handleRemoveNewLanguageForm,
	getAvailableLanguages,
	getUsedOrderIndexes,
	getMaxOrderIndex,
}) => {
	return (
		<LanguagesContainer>
			<LanguagesSectionHeader>
				<>
					<LanguagesSectionIcon>
						<Code2 size={20} />
					</LanguagesSectionIcon>
					<LanguagesSectionInfo>
						<LanguagesSectionTitle>Programming Languages</LanguagesSectionTitle>
						<LanguagesSectionDescription>
							Manage your programming language skills and proficiency levels
						</LanguagesSectionDescription>
					</LanguagesSectionInfo>
				</>
				<AddButton onClick={handleAddLanguage}>
					<Plus size={16} />
					Add Language
				</AddButton>
			</LanguagesSectionHeader>
			<LanguagesSection>
				{/* <LanguagesHeader>
					<LanguagesTitle>
						<Code2 size={18} />
						Your Languages
					</LanguagesTitle>
					<AddButton onClick={handleAddLanguage}>
						<Plus size={16} />
						Add Language
					</AddButton>
				</LanguagesHeader> */}

				{userLanguages.length === 0 && newLanguageForms.length === 0 ? (
					<EmptyState>
						<Code2 size={32} opacity={0.3} />
						<div>No languages added yet</div>
						<div style={{ fontSize: "0.875rem", opacity: 0.7 }}>
							Click "Add Language" to get started
						</div>
					</EmptyState>
				) : (
					<>
						{/* Existing languages */}
						{userLanguages.map((lang: any) => (
							<UserLanguageItem
								key={lang.id}
								language={{
									id: lang.id,
									languageId: lang.languageId || lang.language?.id || "",
									languageName: lang.language?.languageName || "Unknown",
									languageIcon: lang.language?.languageIcon || "",
									proficiencyLevel: lang.proficiencyLevel,
									orderIndex: lang.orderIndex,
								}}
								isTopThree={lang.orderIndex <= 3}
								availableLanguages={availableLanguages}
								usedOrderIndexes={getUsedOrderIndexes(lang.id)}
								maxOrderIndex={getMaxOrderIndex()}
								isEditing={editingLanguageId === lang.id}
								onEdit={() => handleEditLanguage(lang.id)}
								onCancelEdit={handleCancelEditLanguage}
								onUpdate={(data) => handleUpdateLanguage(lang.id, data)}
								onDelete={() => handleDeleteLanguage(lang.id)}
							/>
						))}
						{/* New language forms */}
						{newLanguageForms.map((form) => (
							<UserLanguageForm
								key={form.id}
								languageId={form.languageId}
								proficiencyLevel={form.proficiencyLevel}
								orderIndex={form.orderIndex}
								availableLanguages={getAvailableLanguages()}
								usedOrderIndexes={getUsedOrderIndexes(form.id)}
								maxOrderIndex={getMaxOrderIndex()}
								onChange={(data) => handleNewLanguageChange(form.id, data)}
								onClose={() => handleRemoveNewLanguageForm(form.id)}
							/>
						))}
					</>
				)}
			</LanguagesSection>
		</LanguagesContainer>
	);
};
