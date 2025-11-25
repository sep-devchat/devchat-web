import { Column } from "@/components/custom/TablePermission/TablePermission";

export interface ProgrammingLanguages {
	id: string;
	languageCode: string;
	languageName: string;
	languageVersion: string;
	languageIcon: string;
	syntaxHighlighting: string;
	codeExecutions: number;
	isExecutable: boolean;
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
	// { key: "syntaxHighlighting", label: "Syntax", width: "150px" },
	// { key: "codeExecutions", label: "Executions", width: "200px", align: "center" },
	{ key: "isExecutable", label: "Status", width: "250px", align: "center" },
];
