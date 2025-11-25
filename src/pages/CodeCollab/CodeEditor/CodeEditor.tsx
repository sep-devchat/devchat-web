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
	userRevisionCount,
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
			setRunOutput(res.data.output ?? "");
			setIsResultOpen(true);
			onRun?.();
		} catch (e: any) {
			console.error("❌ Run code error:", e);
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

						{userRevisionCount !== undefined && userRevisionCount > 0 && (
							<S.RevisionCountBadge>
								You have saved {userRevisionCount} revision
								{userRevisionCount !== 1 ? "s" : ""} before.
							</S.RevisionCountBadge>
						)}

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
						options={{
							readOnly: readOnly,
							minimap: { enabled: true },
							fontSize: 14,
							lineNumbers: "on",
							scrollBeyondLastLine: false,
							automaticLayout: true,
							tabSize: 2,
							wordWrap: "on",
							theme: "vs-light",
						}}
					/>
				</div>
			</S.Container>

			<Dialog open={isResultOpen} onOpenChange={setIsResultOpen}>
				<DialogContent
					className="max-w-4xl bg-slate-900 border-slate-700 [&>button]:hidden"
					style={{ zIndex: 10000 }}
				>
					<DialogHeader className="space-y-3 pb-4 border-b border-slate-700">
						<div className="flex items-center gap-3">
							<div className="p-2 rounded-lg bg-slate-800">
								<Terminal className="h-5 w-5 text-blue-400" />
							</div>
							<div className="flex-1">
								<DialogTitle className="text-xl font-semibold text-slate-100">
									Execution Result
								</DialogTitle>
								<DialogDescription className="text-slate-400 text-sm mt-1">
									{language.toUpperCase()} •{" "}
									{executionTime > 0 ? `${executionTime.toFixed(0)}ms` : "—"}
								</DialogDescription>
							</div>
							{runError ? (
								<div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-red-950/50 border border-red-800">
									<XCircle className="h-4 w-4 text-red-400" />
									<span className="text-sm font-medium text-red-300">
										Failed
									</span>
								</div>
							) : (
								<div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-green-950/50 border border-green-800">
									<CheckCircle2 className="h-4 w-4 text-green-400" />
									<span className="text-sm font-medium text-green-300">
										Success
									</span>
								</div>
							)}
							<button
								onClick={() => setIsResultOpen(false)}
								className="p-2 rounded-lg hover:bg-slate-800 transition-colors group outline-none"
								aria-label="Close dialog"
							>
								<X className="h-5 w-5 text-slate-200 group-hover:text-white" />
							</button>
						</div>
					</DialogHeader>

					<div className="mt-4">
						{runError ? (
							<div className="rounded-lg bg-red-950/30 border border-red-800/50 p-4">
								<div className="flex items-start gap-3">
									<XCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
									<div>
										<p className="text-sm font-semibold text-red-300 mb-1">
											Error
										</p>
										<p className="text-sm text-red-200">{runError}</p>
									</div>
								</div>
							</div>
						) : (
							<div className="space-y-2">
								<div className="flex items-center justify-between px-3 py-2 bg-slate-800/50 rounded-t-lg border-b border-slate-700">
									<span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
										Output
									</span>
									<span className="text-xs text-slate-500">
										{runOutput.split("\n").length} line
										{runOutput.split("\n").length !== 1 ? "s" : ""}
									</span>
								</div>
								<pre className="max-h-[50vh] overflow-auto rounded-b-lg bg-slate-950 p-4 text-sm font-mono text-slate-200 border border-slate-800 whitespace-pre-wrap">
									{runOutput || (
										<span className="text-slate-500 italic">(No output)</span>
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
