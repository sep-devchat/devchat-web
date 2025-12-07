import React, { useState, useEffect } from "react";
import { Trash2, RefreshCw } from "lucide-react";
import * as S from "./ProgrammingLanguages.styled";
import {
	TablePermission,
	RolePermission,
	Column,
} from "@/components/custom/TablePermission/TablePermission";
import { LanguageModal } from "./LanguageModal/LanguageModal";
import { PROGRAMMING_LANGUAGES_COLUMNS } from "./programmingLanguages.mockData";
import {
	listProgrammingLanguages,
	createProgrammingLanguage,
	updateProgrammingLanguage,
	toggleProgrammingLanguageIsActive,
	ProgrammingLanguageResponse,
	ProgrammingLanguageRequest,
	ProgrammingLanguageUpdateRequest,
} from "@/services/programmingLanguagesAPI";
import { toast } from "sonner";

export const ProgrammingLanguages: React.FC = () => {
	const [languages, setLanguages] = useState<ProgrammingLanguageResponse[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalMode, setModalMode] = useState<"create" | "edit">("create");
	const [selectedLanguage, setSelectedLanguage] =
		useState<ProgrammingLanguageResponse | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [currentPage] = useState(1);
	const [pageSize] = useState(20);
	const [pagination, setPagination] = useState<{
		page: number;
		take: number;
		totalRecord: number;
		totalPage: number;
		nextPage?: number;
		prevPage?: number;
	} | null>(null);

	const fetchLanguages = async () => {
		setIsLoading(true);
		try {
			const response = await listProgrammingLanguages(currentPage, pageSize);

			if (response && response.data) {
				const languagesData = Array.isArray(response.data) ? response.data : [];

				setLanguages(languagesData);
				setPagination(response.pagination ?? null);
			} else {
				setLanguages([]);
				setPagination(null);
			}
		} catch (error) {
			console.error("Error fetching languages:", error);
			setLanguages([]);
			setPagination(null);
			toast.error("Failed to load programming languages");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchLanguages();
	}, [currentPage, pageSize]);

	const tableData: RolePermission[] = (languages || []).map((lang) => ({
		id: lang.id,
		languageIcon: lang.languageIcon,
		languageName: lang.languageName,
		languageCode: lang.languageCode,
		languageVersion: lang.languageVersion ?? "",
		isExecutable: lang.isExecutable,
		useAiCheck: lang.useAiCheck,
		isActive: lang.isActive,
	}));

	const handleAddLanguage = () => {
		setModalMode("create");
		setSelectedLanguage(null);
		setIsModalOpen(true);
	};

	const handleEditLanguage = (index: number) => {
		setModalMode("edit");
		setSelectedLanguage(languages[index]);
		setIsModalOpen(true);
	};

	const handleToggleLanguage = async (index: number) => {
		const language = languages[index];
		if (!language) return;
		const actionLabel = language.isActive ? "deactivate" : "activate";

		setIsLoading(true);
		try {
			await toggleProgrammingLanguageIsActive(language.id);
			await fetchLanguages();
			toast.success(`Language ${actionLabel}d successfully`);
		} catch (error) {
			console.error("Error toggling language:", error);
			toast.error(`Failed to ${actionLabel} language`);
		} finally {
			setIsLoading(false);
		}
	};

	const handleModalSubmit = async (data: RolePermission) => {
		if (!data.languageCode || !data.languageName) {
			toast.warning("Language Code and Language Name are required fields!");
			return;
		}

		setIsLoading(true);
		try {
			if (modalMode === "create") {
				const requestData: ProgrammingLanguageRequest = {
					languageCode: String(data.languageCode),
					languageName: String(data.languageName),
					languageVersion: data.languageVersion
						? String(data.languageVersion)
						: undefined,
					languageIcon:
						typeof data.languageIcon === "string"
							? data.languageIcon
							: undefined,
					preset: typeof data.preset === "string" ? data.preset : undefined,
					isExecutable:
						data.isExecutable === true || data.isExecutable === "Enabled",
					useAiCheck: data.useAiCheck === true || data.useAiCheck === "Enabled",
				};

				await createProgrammingLanguage(requestData);
				toast.success("Language created successfully");
			} else if (modalMode === "edit" && selectedLanguage) {
				const requestData: ProgrammingLanguageUpdateRequest = {
					languageCode: String(data.languageCode),
					languageName: String(data.languageName),
					languageVersion: data.languageVersion
						? String(data.languageVersion)
						: undefined,
					languageIcon:
						typeof data.languageIcon === "string"
							? data.languageIcon
							: undefined,
					preset: typeof data.preset === "string" ? data.preset : undefined,
					isExecutable:
						data.isExecutable === true || data.isExecutable === "Enabled",
					useAiCheck: data.useAiCheck === true || data.useAiCheck === "Enabled",
				};

				await updateProgrammingLanguage(selectedLanguage.id, requestData);
				toast.success("Language updated successfully");
			}

			await fetchLanguages();
			setIsModalOpen(false);
		} catch (error) {
			console.error("Error saving language:", error);
			toast.error(
				`Failed to ${modalMode === "create" ? "create" : "update"} language`,
			);
		} finally {
			setIsLoading(false);
		}
	};

	const renderCell = (value: any, column: Column): React.ReactNode => {
		if (column.key === "languageIcon") {
			if (
				value &&
				typeof value === "string" &&
				value.startsWith("data:image")
			) {
				return (
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							width: "100%",
							height: "100%",
						}}
					>
						<img
							src={value}
							alt="Language icon"
							style={{
								width: "32px",
								height: "32px",
								objectFit: "contain",
								borderRadius: "4px",
							}}
						/>
					</div>
				);
			}
			if (value && typeof value === "string" && value.trim() !== "") {
				return <S.IconCell>{value}</S.IconCell>;
			}
			return <span style={{ color: "#999", fontSize: "12px" }}>No icon</span>;
		}

		if (column.key === "languageCode") {
			return <S.CodeText>{value || "N/A"}</S.CodeText>;
		}

		if (column.key === "languageVersion") {
			return value && <S.VersionText>{value}</S.VersionText>;
		}

		if (column.key === "isExecutable") {
			const isEnabled =
				value === true ||
				value === "Enabled" ||
				value === "true" ||
				value === 1;
			const label = isEnabled ? "Enabled" : "Disabled";
			return <S.StatusBadge $isEnabled={isEnabled}>{label}</S.StatusBadge>;
		}

		if (column.key === "useAiCheck") {
			const isEnabled =
				value === true ||
				value === "Enabled" ||
				value === "true" ||
				value === 1;
			return (
				<S.StatusBadge $isEnabled={isEnabled}>
					{isEnabled ? "Enabled" : "Disabled"}
				</S.StatusBadge>
			);
		}

		if (column.key === "isActive") {
			const active =
				value === true || value === "Active" || value === "true" || value === 1;
			return (
				<S.StatusBadge $isEnabled={active}>
					{active ? "Active" : "Inactive"}
				</S.StatusBadge>
			);
		}

		return undefined;
	};

	const getInitialDataForEdit = (): RolePermission | undefined => {
		if (!selectedLanguage) return undefined;

		return {
			id: selectedLanguage.id,
			languageCode: selectedLanguage.languageCode,
			languageName: selectedLanguage.languageName,
			languageVersion: selectedLanguage.languageVersion,
			languageIcon: selectedLanguage.languageIcon,
			preset: selectedLanguage.preset ?? "",
			isExecutable: selectedLanguage.isExecutable,
			useAiCheck: selectedLanguage.useAiCheck,
		};
	};

	const baseSubtitle =
		"Manage supported programming languages and their configurations";
	const tableSubtitle = pagination?.totalRecord
		? `${baseSubtitle} • Total: ${pagination.totalRecord}`
		: baseSubtitle;

	return (
		<S.Container>
			<TablePermission
				title="Programming Languages"
				subtitle={tableSubtitle}
				columns={PROGRAMMING_LANGUAGES_COLUMNS}
				data={tableData}
				actionButtonText="Add Language"
				onActionButtonClick={handleAddLanguage}
				onEdit={handleEditLanguage}
				onDelete={handleToggleLanguage}
				renderCell={renderCell}
				pageSize={6}
				showSearch={true}
				showPagination={true}
				showCellBackground={false}
				deleteConfirmTitle="Toggle Active Status"
				deleteConfirmMessage={(rowData) => {
					const currentlyActive =
						rowData?.isActive === true ||
						rowData?.isActive === "Active" ||
						rowData?.isActive === "true";
					return `Are you sure you want to ${currentlyActive ? "deactivate" : "activate"} ${rowData.languageName}?`;
				}}
				deleteConfirmText="Confirm"
				deleteCancelText="Cancel"
				isLoading={isLoading}
				deleteActionConfig={(rowData) => {
					const currentlyActive =
						rowData?.isActive === true ||
						rowData?.isActive === "Active" ||
						rowData?.isActive === "true";
					return {
						icon: currentlyActive ? (
							<Trash2 size={16} />
						) : (
							<RefreshCw size={16} />
						),
						variant: currentlyActive ? "danger" : "default",
						title: currentlyActive
							? "Deactivate language"
							: "Activate language",
					};
				}}
			/>

			<LanguageModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSubmit={handleModalSubmit}
				columns={PROGRAMMING_LANGUAGES_COLUMNS}
				mode={modalMode}
				initialData={getInitialDataForEdit()}
				title={modalMode === "create" ? "Add New Language" : "Edit Language"}
			/>
		</S.Container>
	);
};

export default ProgrammingLanguages;
