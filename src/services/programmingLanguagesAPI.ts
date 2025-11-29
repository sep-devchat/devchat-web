/* eslint-disable @typescript-eslint/no-explicit-any */
import { get, post, put, remove } from "./apiCaller";

export interface ProgrammingLanguageResponse {
	id: string;
	languageCode: string;
	languageName: string;
	languageIcon: string;
	languageVersion: string;
	syntaxHighlighting: string;
	codeExecutions: number;
	isExecutable: boolean;
	createdAt: string;
	createdBy: string;
	updatedAt: string;
	updatedBy: string;
	isActive: boolean;
}

export interface ProgrammingLanguageRequest {
	languageCode: string;
	languageName: string;
	languageIcon: string;
	languageVersion: string;
	syntaxHighlighting: string;
	isExecutable: boolean;
}

export interface ProgrammingLanguageUpdateRequest {
	languageCode?: string;
	languageName?: string;
	languageIcon?: string;
	languageVersion?: string;
	syntaxHighlighting?: string;
	isExecutable?: boolean;
}

export interface PaginationResponse<T> {
	data: T;
	pagination: {
		page: number;
		take: number;
		totalRecord: number;
		totalPage: number;
	} | null;
	message?: string;
}

export const listProgrammingLanguages = (
	page: number = 1,
	take: number = 20,
	code?: string,
	name?: string,
	version?: string,
	search?: string,
) => {
	let url = `/api/programming-language?page=${page}&take=${take}`;

	if (code) url += `&code=${encodeURIComponent(code)}`;
	if (name) url += `&name=${encodeURIComponent(name)}`;
	if (version) url += `&version=${encodeURIComponent(version)}`;
	if (search) url += `&search=${encodeURIComponent(search)}`;

	return get<PaginationResponse<ProgrammingLanguageResponse[]>>(url);
};

export const getAllProgrammingLanguages = () => {
	return get<PaginationResponse<ProgrammingLanguageResponse[]>>(
		`/api/programming-language`,
	);
};

export const detailProgrammingLanguage = (id: string) => {
	return get<PaginationResponse<ProgrammingLanguageResponse>>(
		`/api/programming-language/${id}`,
	);
};

export const createProgrammingLanguage = (data: ProgrammingLanguageRequest) => {
	return post<PaginationResponse<ProgrammingLanguageResponse>>(
		`/api/programming-language`,
		data,
	);
};

export const updateProgrammingLanguage = (
	id: string,
	data: ProgrammingLanguageUpdateRequest,
) => {
	return put<PaginationResponse<ProgrammingLanguageResponse>>(
		`/api/programming-language/${id}`,
		data,
	);
};

export const deleteProgrammingLanguage = (id: string) => {
	return remove<PaginationResponse<ProgrammingLanguageResponse>>(
		`/api/programming-language/${id}`,
	);
};
