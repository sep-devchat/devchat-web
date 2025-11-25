import React, { useRef, useState } from "react";
import {
	Play,
	Code2,
	RotateCcw,
	CheckCircle2,
	XCircle,
	Terminal,
	X,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import Editor from "@monaco-editor/react";
import { editor } from "monaco-editor";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { runCode } from "@/services/code/code.api";
import { ProgrammingLanguageEnum } from "@/utils/enum";
import * as S from "./CodeEditor.styled";

interface CodeEditorProps {
	code: string;
	onChange?: (value: string) => void;
	readOnly?: boolean;
	title: string;
	showSave?: boolean;
	onSave?: () => void;
	hasChanges?: boolean;
	isSaving?: boolean;
	onReset?: () => void;
	userRevisionCount?: number;
	language?: string;
	onRun?: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
	code,
	onChange,
	readOnly = false,
	title,
	showSave = false,
	onSave,
	hasChanges = false,
	isSaving = false,
	onReset,
	language = "",
	onRun,
}) => {
	const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
	const [isRunning, setIsRunning] = useState(false);
	const [isResultOpen, setIsResultOpen] = useState(false);
	const [runOutput, setRunOutput] = useState("");
	const [runError, setRunError] = useState("");
	const [executionTime, setExecutionTime] = useState<number>(0);

	const handleEditorMount = (editor: editor.IStandaloneCodeEditor) => {
		editorRef.current = editor;
	};

	const handleEditorChange = (value: string | undefined) => {
		if (onChange && value !== undefined) {
			onChange(value);
		}
	};

	const toEnumLanguage = (lang: string): ProgrammingLanguageEnum | null => {
		const val = (lang || "").toLowerCase();
		if (["javascript", "js"].includes(val))
			return ProgrammingLanguageEnum.JAVASCRIPT;
		if (["python", "py"].includes(val)) return ProgrammingLanguageEnum.PYTHON;
		if (["java"].includes(val)) return ProgrammingLanguageEnum.JAVA;
		return null;
	};

	const handleRun = async () => {
		const enumLang = toEnumLanguage(language);

		if (!enumLang) {
			setRunError(
				`Running not supported for language: ${language || "Unknown"}`,
			);
			setRunOutput("");
			setExecutionTime(0);
			setIsResultOpen(true);
			return;
		}
		if (!code?.trim()) {
			setRunError("No code to run");
			setRunOutput("");
			setExecutionTime(0);
			setIsResultOpen(true);
			return;
		}

		setIsRunning(true);
		setRunError("");
		const startTime = performance.now();

		try {
			const res = await runCode({ code, language: enumLang });

			const endTime = performance.now();
			setExecutionTime(endTime - startTime);

			const output = res.data.output ?? "";

			// Detect error patterns
			const isError =
				output.includes("error:") ||
				output.includes("Error:") ||
				output.includes("Exception") ||
				output.includes("SyntaxError") ||
				output.includes("Traceback") ||
				(output.includes("Main.java:") && output.includes("error:"));

			if (isError) {
				setRunError(output);
				setRunOutput("");
			} else {
				setRunOutput(output);
				setRunError("");
			}

			setIsResultOpen(true);
			onRun?.();
		} catch (e: any) {
			// Network errors
			const endTime = performance.now();
			setExecutionTime(endTime - startTime);
			const errorMsg =
				e?.response?.data?.message || e?.message || "Error running code";
			setRunError(errorMsg);
			setRunOutput("");
			setIsResultOpen(true);
		} finally {
			setIsRunning(false);
		}
	};

	return (
		<>
			<S.Container>
				<S.Header>
					<S.HeaderLeft>
						<S.CodeIcon>
							<Code2 style={{ width: "100%", height: "100%" }} />
						</S.CodeIcon>
						<S.Title>{title}</S.Title>

						{showSave && hasChanges && !isSaving && (
							<S.UnsavedBadge>Unsaved changes</S.UnsavedBadge>
						)}
						{isSaving && (
							<S.SavingBadge>
								<Spinner className="h-3 w-3 mr-1" />
								Saving...
							</S.SavingBadge>
						)}
					</S.HeaderLeft>

					<S.HeaderRight>
						{showSave && onReset && (
							<S.ResetButton
								onClick={onReset}
								disabled={!hasChanges || isSaving}
								title="Reset to original code"
							>
								<RotateCcw style={{ width: "1rem", height: "1rem" }} />
								Reset
							</S.ResetButton>
						)}

						{showSave && (
							<S.SaveButton
								onClick={onSave}
								disabled={!hasChanges || isSaving}
								$disabled={!hasChanges || isSaving}
							>
								{isSaving ? (
									<>
										<Spinner className="h-4 w-4 mr-2" />
										Saving...
									</>
								) : (
									"Save"
								)}
							</S.SaveButton>
						)}

						<S.RunButton
							onClick={handleRun}
							disabled={isRunning || !code.trim()}
						>
							<S.PlayIcon>
								<Play style={{ width: "100%", height: "100%" }} />
							</S.PlayIcon>
							{isRunning ? (
								<>
									Running... <Spinner className="h-4 w-4 ml-2" />
								</>
							) : (
								"Run Code"
							)}
						</S.RunButton>
					</S.HeaderRight>
				</S.Header>

				<div style={{ flex: 1, minHeight: 0 }}>
					<Editor
						height="100%"
						language={language}
						value={code}
						onChange={handleEditorChange}
						onMount={handleEditorMount}
						theme="vs-light"
						options={{
							readOnly: readOnly,
							minimap: { enabled: true },
							fontSize: 14,
							lineNumbers: "on",
							scrollBeyondLastLine: false,
							automaticLayout: true,
							tabSize: 2,
							wordWrap: "on",
						}}
					/>
				</div>
			</S.Container>

			<Dialog
				open={isResultOpen}
				onOpenChange={(open) => {
					if (!open) return;
				}}
			>
				<DialogContent
					className="max-w-4xl bg-white border border-slate-200 shadow-xl [&>button]:hidden"
					style={{ zIndex: 10000 }}
					onPointerDownOutside={(e) => e.preventDefault()}
					onEscapeKeyDown={(e) => e.preventDefault()}
				>
					<DialogHeader className="space-y-3 pb-4 border-b border-slate-200">
						<div className="flex items-center gap-3">
							<div className="p-2 rounded-lg bg-blue-50">
								<Terminal className="h-5 w-5 text-blue-500" />
							</div>
							<div className="flex-1">
								<DialogTitle className="text-xl font-semibold text-slate-900">
									Execution Result
								</DialogTitle>
								<DialogDescription className="text-slate-500 text-sm mt-1">
									{language?.toUpperCase() || "UNKNOWN"} •{" "}
									{executionTime > 0 ? `${executionTime.toFixed(0)}ms` : "—"}
								</DialogDescription>
							</div>
							{runError ? (
								<div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-red-50 border border-red-200">
									<XCircle className="h-4 w-4 text-red-600" />
									<span className="text-sm font-medium text-red-700">
										Failed
									</span>
								</div>
							) : (
								<div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-green-50 border border-green-200">
									<CheckCircle2 className="h-4 w-4 text-green-600" />
									<span className="text-sm font-medium text-green-700">
										Success
									</span>
								</div>
							)}
							<button
								onClick={() => setIsResultOpen(false)}
								className="p-2 rounded-lg hover:bg-slate-100 transition-colors group outline-none"
								aria-label="Close dialog"
							>
								<X className="h-5 w-5 text-slate-600 group-hover:text-slate-900" />
							</button>
						</div>
					</DialogHeader>

					<div className="mt-4">
						{runError ? (
							<div className="rounded-lg bg-red-50 border border-red-200 p-4">
								<div className="flex items-start gap-3">
									<XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
									<div>
										<p className="text-sm font-semibold text-red-700 mb-1">
											Error
										</p>
										<p className="text-sm text-red-700 whitespace-pre-wrap">
											{runError}
										</p>
									</div>
								</div>
							</div>
						) : (
							<div className="space-y-2">
								<div className="flex items-center justify-between px-3 py-2 bg-slate-100 rounded-t-lg border-b border-slate-200">
									<span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
										Output
									</span>
									<span className="text-xs text-slate-500"></span>
								</div>
								<pre className="max-h-[50vh] overflow-auto rounded-b-lg bg-slate-50 p-4 text-sm font-mono text-slate-800 border border-slate-200 whitespace-pre-wrap">
									{runOutput || (
										<span className="text-slate-400 italic">(No output)</span>
									)}
								</pre>
							</div>
						)}
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};
