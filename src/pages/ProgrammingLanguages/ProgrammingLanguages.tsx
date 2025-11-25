import React, { useState, useEffect } from "react";
import * as S from "./ProgrammingLanguages.styled";
import { StatCard } from "@/components/custom/StatCard/StatCard";
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
	deleteProgrammingLanguage,
	ProgrammingLanguageResponse,
	ProgrammingLanguageRequest,
} from "@/services/programmingLanguagesAPI";
import { toast } from "sonner";

export const ProgrammingLanguages: React.FC = () => {
	const [languages, setLanguages] = useState<ProgrammingLanguageResponse[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalMode, setModalMode] = useState<"create" | "edit">("create");
	const [selectedLanguage, setSelectedLanguage] =
		useState<ProgrammingLanguageResponse | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize] = useState(20);
	const [totalRecords, setTotalRecords] = useState(0);

	const fetchLanguages = async () => {
		console.log(totalRecords);
		setCurrentPage;
		setIsLoading(true);
		try {
			const response = await listProgrammingLanguages(currentPage, pageSize);
			console.log("API Response:", response);

			if (response && response.data) {
				const languagesData = Array.isArray(response.data) ? response.data : [];

				const activeLanguages = languagesData.filter(
					(lang) => lang.isActive === true,
				);

				setLanguages(activeLanguages);
				setTotalRecords(
					response.pagination?.totalRecord || activeLanguages.length,
				);
			} else {
				setLanguages([]);
				setTotalRecords(0);
			}
		} catch (error) {
			console.error("Error fetching languages:", error);
			setLanguages([]);
			setTotalRecords(0);
			toast.error("Failed to load programming languages");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchLanguages();
	}, [currentPage, pageSize]);

	const totalLanguages = languages?.length || 0;
	const executableCount =
		languages?.filter((lang) => lang.isExecutable).length || 0;

	const tableData: RolePermission[] = (languages || []).map((lang) => ({
		id: lang.id,
		languageIcon: lang.languageIcon,
		languageName: lang.languageName,
		languageCode: lang.languageCode,
		languageVersion: lang.languageVersion,
		syntaxHighlighting: lang.syntaxHighlighting,
		isExecutable: lang.isExecutable ? "Enabled" : "Disabled",
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

	const handleDeleteLanguage = async (index: number) => {
		const languageToDelete = languages[index];

		setIsLoading(true);
		try {
			await deleteProgrammingLanguage(languageToDelete.id);
			await fetchLanguages();
			toast.success("Language deleted successfully");
		} catch (error) {
			console.error("Error deleting language:", error);
			toast.error("Failed to delete language");
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
					languageVersion: String(data.languageVersion || ""),
					languageIcon: String(data.languageIcon || ""),
					syntaxHighlighting: String(data.syntaxHighlighting || ""),
					isExecutable:
						data.isExecutable === true || data.isExecutable === "Enabled",
				};

				await createProgrammingLanguage(requestData);
				toast.success("Language created successfully");
			} else if (modalMode === "edit" && selectedLanguage) {
				const requestData = {
					languageCode: String(data.languageCode),
					languageName: String(data.languageName),
					languageVersion: String(data.languageVersion || ""),
					languageIcon: String(data.languageIcon || ""),
					syntaxHighlighting: String(data.syntaxHighlighting || ""),
					isExecutable:
						data.isExecutable === true || data.isExecutable === "Enabled",
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
			return <S.VersionText>{value || "1.0.0"}</S.VersionText>;
		}

		if (column.key === "syntaxHighlighting") {
			return <span>{value || "none"}</span>;
		}

		if (column.key === "isExecutable") {
			const status = String(value);
			return (
				<S.StatusBadge $isEnabled={status === "Enabled"}>{value}</S.StatusBadge>
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
			syntaxHighlighting: selectedLanguage.syntaxHighlighting,
			isExecutable: selectedLanguage.isExecutable,
		};
	};

	return (
		<S.Container>
			<S.StatsGrid>
				<StatCard
					value={totalLanguages}
					label="Total Languages"
					trend={76.8}
					trendDirection="up"
					color="blue"
				/>
				<StatCard
					value={executableCount}
					label="Executable"
					trend={12.5}
					trendDirection="up"
					color="green"
				/>
				{/* <StatCard
                    value={totalExecutions.toLocaleString()}
                    label="Total Executions"
                    trend={18.3}
                    trendDirection="up"
                    color="yellow"
                />
                <StatCard
                    value={avgExecutions.toLocaleString()}
                    label="Avg Executions"
                    trend={5.2}
                    trendDirection="down"
                    color="red"
                /> */}
			</S.StatsGrid>

			<TablePermission
				title="Programming Languages"
				subtitle="Manage supported programming languages and their configurations"
				columns={PROGRAMMING_LANGUAGES_COLUMNS}
				data={tableData}
				actionButtonText="Add Language"
				onActionButtonClick={handleAddLanguage}
				onEdit={handleEditLanguage}
				onDelete={handleDeleteLanguage}
				renderCell={renderCell}
				pageSize={6}
				showSearch={true}
				showPagination={true}
				showCellBackground={false}
				deleteConfirmTitle="Delete Language"
				deleteConfirmMessage={(rowData) =>
					`Are you sure you want to delete ${rowData.languageName}? This action cannot be undone.`
				}
				deleteConfirmText="Delete"
				deleteCancelText="Cancel"
				isLoading={isLoading}
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
