import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import {
	getActiveProgrammingLanguages,
	ProgrammingLanguageResponse,
} from "@/services/programmingLanguagesAPI";

const buildLanguageKey = (value?: string | null) =>
	(value ?? "").trim().toLowerCase();

const normalizeLanguages = (
	items: ProgrammingLanguageResponse[],
): Map<string, boolean> => {
	const map = new Map<string, boolean>();
	items.forEach((lang) => {
		const keys = [lang.languageCode, lang.languageName, lang.id]
			.map(buildLanguageKey)
			.filter(Boolean);
		keys.forEach((key) => {
			if (key && !map.has(key)) {
				map.set(key, lang.isExecutable);
			}
		});
	});
	return map;
};

export const useExecutableLanguages = () => {
	const { data, isLoading } = useQuery({
		queryKey: ["programming-languages", "active"],
		queryFn: async () => {
			const response = await getActiveProgrammingLanguages();
			return Array.isArray(response?.data) ? response.data : [];
		},
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
	});

	const executableMap = useMemo(() => {
		const list = data ?? [];
		return normalizeLanguages(list);
	}, [data]);

	const isExecutableLanguage = useCallback(
		(language?: string | null) => {
			if (!language) return true;
			const flag = executableMap.get(buildLanguageKey(language));
			return typeof flag === "boolean" ? flag : true;
		},
		[executableMap],
	);

	return { isExecutableLanguage, isLoading };
};

export default useExecutableLanguages;
