/* eslint-disable @typescript-eslint/no-explicit-any */
import { get, post, remove } from "./apiCaller";
import type { ProgrammingLanguageResponse } from "./programmingLanguagesAPI";

export const listGroupSupportedProgrammingLanguages = (groupId: string) => {
	return get<ProgrammingLanguageResponse[]>(
		`/api/group/${groupId}/supported-programming-languages`,
	);
};

export const addGroupSupportedProgrammingLanguage = (
	groupId: string,
	languageId: string,
) => {
	return post(`/api/group/${groupId}/supported-programming-languages`, {
		languageId,
	});
};

export const removeGroupSupportedProgrammingLanguage = (
	groupId: string,
	languageId: string,
) => {
	return remove(
		`/api/group/${groupId}/supported-programming-languages/${languageId}`,
	);
};
