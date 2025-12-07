import { useCallback, useState } from "react";
import { runCode, runCodeBlock } from "@/services/code/code.api";
import { mapLanguageToEnum } from "@/utils/code-runner";

interface RunSnippetPayload {
	code?: string;
	language?: string;
	codeBlockId?: string;
}

const getTimestamp = () => new Date().toLocaleString();

const useCodeRunner = () => {
	const [isRunning, setIsRunning] = useState(false);
	const [runOutput, setRunOutput] = useState("");
	const [runError, setRunError] = useState("");
	const [lastRunAt, setLastRunAt] = useState<string>("");

	const reset = useCallback(() => {
		setRunOutput("");
		setRunError("");
		setLastRunAt("");
	}, []);

	const runSnippet = useCallback(
		async ({ code, language, codeBlockId }: RunSnippetPayload) => {
			if (codeBlockId) {
				setIsRunning(true);
				setRunError("");
				setRunOutput("");
				try {
					const response = await runCodeBlock({ codeBlockId });
					setRunOutput(response?.data?.output ?? "");
					setLastRunAt(getTimestamp());
					return true;
				} catch (error: any) {
					const message =
						error?.response?.data?.message ||
						error?.message ||
						"Error running code block.";
					setRunError(message);
					setRunOutput("");
					setLastRunAt(getTimestamp());
					return false;
				} finally {
					setIsRunning(false);
				}
			}

			const enumLanguage = mapLanguageToEnum(language);
			if (!enumLanguage) {
				setRunError(
					`Running not supported for language: ${language || "Unknown"}.`,
				);
				setRunOutput("");
				setLastRunAt(getTimestamp());
				return false;
			}

			if (!code?.trim()) {
				setRunError("No code to run.");
				setRunOutput("");
				setLastRunAt("");
				return false;
			}

			setIsRunning(true);
			setRunError("");
			setRunOutput("");

			try {
				const response = await runCode({ code, language: enumLanguage });
				setRunOutput(response?.data?.output ?? "");
				setLastRunAt(getTimestamp());
				return true;
			} catch (error: any) {
				const message =
					error?.response?.data?.message ||
					error?.message ||
					"Error running code.";
				setRunError(message);
				setRunOutput("");
				setLastRunAt(getTimestamp());
				return false;
			} finally {
				setIsRunning(false);
			}
		},
		[],
	);

	return {
		isRunning,
		runOutput,
		runError,
		lastRunAt,
		runSnippet,
		reset,
	};
};

export default useCodeRunner;
