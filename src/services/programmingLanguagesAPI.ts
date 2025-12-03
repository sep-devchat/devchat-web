/* eslint-disable @typescript-eslint/no-explicit-any */
import { get, post, put, remove } from "./apiCaller";

export interface ProgrammingLanguageResponse {
	id: string;
	languageCode: string;
	languageName: string;
	languageIcon?: string | null;
	languageVersion?: string | null;
	preset?: string | null;
	isExecutable: boolean;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface ProgrammingLanguageRequest {
	languageCode: string;
	languageName: string;
	languageIcon?: string | null;
	languageVersion?: string | null;
	preset?: string | null;
	isExecutable?: boolean;
}

export interface ProgrammingLanguageUpdateRequest {
	languageCode?: string;
	languageName?: string;
	languageIcon?: string | null;
	languageVersion?: string | null;
	preset?: string | null;
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
	limit: number = 20,
	code?: string,
	name?: string,
	version?: string,
	search?: string,
	isActive?: boolean,
) => {
	let url = `/api/programming-language?page=${page}&limit=${limit}`;

	if (code) url += `&code=${encodeURIComponent(code)}`;
	if (name) url += `&name=${encodeURIComponent(name)}`;
	if (version) url += `&version=${encodeURIComponent(version)}`;
	if (search) url += `&search=${encodeURIComponent(search)}`;
	if (typeof isActive === "boolean") url += `&isActive=${isActive}`;

	return get<PaginationResponse<ProgrammingLanguageResponse[]>>(url);
};

export const getAllProgrammingLanguages = (params?: {
	isActive?: boolean;
	limit?: number;
	page?: number;
}) => {
	const searchParams = new URLSearchParams();
	searchParams.append("page", String(params?.page ?? 1));
	searchParams.append("limit", String(params?.limit ?? 100));
	if (typeof params?.isActive === "boolean") {
		searchParams.append("isActive", String(params.isActive));
	}
	const url = `/api/programming-language?${searchParams.toString()}`;
	return get<PaginationResponse<ProgrammingLanguageResponse[]>>(url);
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

export const toggleProgrammingLanguageIsActive = (id: string) => {
	return get<PaginationResponse<ProgrammingLanguageResponse>>(
		`/api/programming-language/toggle-is-active/${id}`,
	);
};
