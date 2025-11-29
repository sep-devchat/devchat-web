import { ProgrammingLanguageEnum } from "./enum";

const LANGUAGE_ALIASES: Record<ProgrammingLanguageEnum, string[]> = {
	[ProgrammingLanguageEnum.JAVASCRIPT]: ["javascript", "js", "node", "nodejs"],
	[ProgrammingLanguageEnum.PYTHON]: ["python", "py"],
	[ProgrammingLanguageEnum.JAVA]: ["java"],
};

export const mapLanguageToEnum = (
	language?: string,
): ProgrammingLanguageEnum | null => {
	const normalized = (language || "").trim().toLowerCase();
	if (!normalized) return null;

	for (const [enumValue, aliases] of Object.entries(LANGUAGE_ALIASES)) {
		if ((aliases as string[]).includes(normalized)) {
			return enumValue as ProgrammingLanguageEnum;
		}
	}

	return null;
};
