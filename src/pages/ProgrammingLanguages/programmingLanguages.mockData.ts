import { Column } from "@/components/custom/TablePermission/TablePermission";

export interface ProgrammingLanguages {
	id: string;
	languageCode: string;
	languageName: string;
	languageVersion?: string | null;
	languageIcon?: string | null;
	isExecutable: boolean;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export const PROGRAMMING_LANGUAGES_COLUMNS: Column[] = [
	{ key: "languageIcon", label: "Icon", width: "150px", align: "center" },
	{
		key: "languageName",
		label: "Language Name",
		width: "350px",
		align: "center",
	},
	{ key: "languageCode", label: "Code", width: "250px", align: "center" },
	{ key: "languageVersion", label: "Version", width: "250px", align: "center" },
	{
		key: "isExecutable",
		label: "Code Execution",
		width: "250px",
		align: "center",
	},
	{
		key: "useAiCheck",
		label: "AI Code Check",
		width: "250px",
		align: "center",
	},
	{ key: "isActive", label: "Is Active", width: "250px", align: "center" },
];
