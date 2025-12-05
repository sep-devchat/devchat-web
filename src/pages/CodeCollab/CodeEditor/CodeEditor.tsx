import React, { useEffect, useRef, useState } from "react";
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
import { runCode, runCodeBlock, runCodeCollab } from "@/services/code/code.api";
import { mapLanguageToEnum } from "@/utils/code-runner";
import * as S from "./CodeEditor.styled";
import { cn } from "@/lib/utils";

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
	codeBlockId?: string;
	codeCollabId?: string;
	allowRun?: boolean;
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
	codeBlockId,
	codeCollabId,
	allowRun = true,
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

	useEffect(() => {
		const updateFontSize = () => {
			if (!editorRef.current) return;

			const width = window.innerWidth;
			let fontSize = 12;

			if (width < 1220) fontSize = 14;
			else if (width >= 1440 && width < 1920) fontSize = 12;
			else if (width >= 1920) fontSize = 15;

			editorRef.current.updateOptions({ fontSize });
		};

		updateFontSize();
		window.addEventListener("resize", updateFontSize);

		return () => window.removeEventListener("resize", updateFontSize);
	}, []);

	const handleEditorChange = (value: string | undefined) => {
		if (onChange && value !== undefined) {
			onChange(value);
		}
	};

	const handleRun = async () => {
		if (!allowRun) {
			setRunError("Save this revision before running the code.");
			setRunOutput("");
			setExecutionTime(0);
			setIsResultOpen(true);
			return;
		}

		const requiresManualRun = !codeCollabId && !codeBlockId;
		let enumLang: ReturnType<typeof mapLanguageToEnum> = null;
		let safeCode = code;

		if (requiresManualRun) {
			enumLang = mapLanguageToEnum(language);

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
			safeCode = code;
		}

		setIsRunning(true);
		setRunError("");
		const startTime = performance.now();

		try {
			let res;
			if (codeCollabId) {
				res = await runCodeCollab({ codeCollabId });
			} else if (codeBlockId) {
				res = await runCodeBlock({ codeBlockId });
			} else if (enumLang && safeCode) {
				res = await runCode({ code: safeCode, language: enumLang });
			} else {
				throw new Error("Unable to determine run mode");
			}

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
							fontSize: 12,
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
					className={cn(
						"max-w-4xl bg-white border border-slate-200 shadow-xl [&>button]:hidden",
						"max-[1220px]:max-w-[56rem]",
						"min-[1440px]:max-w-[51.2rem]",
						"min-[1920px]:max-w-[70.4rem]",
					)}
					style={{ zIndex: 10000 }}
					onPointerDownOutside={(e) => e.preventDefault()}
					onEscapeKeyDown={(e) => e.preventDefault()}
				>
					<DialogHeader
						className={cn(
							"space-y-3 pb-4 border-b border-slate-200",
							"max-[1220px]:space-y-[8.4px] max-[1220px]:pb-[11.2px]",
							"min-[1440px]:space-y-[9.6px] min-[1440px]:pb-[12.8px]",
							"min-[1920px]:space-y-[13.2px] min-[1920px]:pb-[17.6px]",
						)}
					>
						<div
							className={cn(
								"flex items-center gap-3",
								"max-[1220px]:gap-[8.4px]",
								"min-[1440px]:gap-[9.6px]",
								"min-[1920px]:gap-[13.2px]",
							)}
						>
							<div
								className={cn(
									"p-2 rounded-lg bg-blue-50",
									"max-[1220px]:p-[5.6px]",
									"min-[1440px]:p-[6.4px]",
									"min-[1920px]:p-[8.8px]",
								)}
							>
								<Terminal
									className={cn(
										"h-5 w-5 text-blue-500",
										"max-[1220px]:h-[14px] max-[1220px]:w-[14px]",
										"min-[1440px]:h-4 min-[1440px]:w-4",
										"min-[1920px]:h-[22px] min-[1920px]:w-[22px]",
									)}
								/>
							</div>
							<div className="flex-1">
								<DialogTitle
									className={cn(
										"text-xl font-semibold text-slate-900",
										"max-[1220px]:text-[16px]",
										"min-[1440px]:text-[18px]",
										"min-[1920px]:text-[20px]",
									)}
								>
									Execution Result
								</DialogTitle>
								<DialogDescription
									className={cn(
										"text-slate-500 text-sm mt-1",
										"max-[1220px]:text-[9.8px] max-[1220px]:mt-[2.8px]",
										"min-[1440px]:text-[11.2px] min-[1440px]:mt-[3.2px]",
										"min-[1920px]:text-[15.4px] min-[1920px]:mt-[4.4px]",
									)}
								>
									{language?.toUpperCase() || "UNKNOWN"} •{" "}
									{executionTime > 0 ? `${executionTime.toFixed(0)}ms` : "—"}
								</DialogDescription>
							</div>
							{runError ? (
								<div
									className={cn(
										"flex items-center gap-2 px-3 py-1.5 rounded-md bg-red-50 border border-red-200",
										"max-[1220px]:gap-[5.6px] max-[1220px]:px-[8.4px] max-[1220px]:py-[4.2px]",
										"min-[1440px]:gap-[6.4px] min-[1440px]:px-[9.6px] min-[1440px]:py-[4.8px]",
										"min-[1920px]:gap-[8.8px] min-[1920px]:px-[13.2px] min-[1920px]:py-[6.6px]",
									)}
								>
									<XCircle
										className={cn(
											"h-4 w-4 text-red-600",
											"max-[1220px]:h-[11.2px] max-[1220px]:w-[11.2px]",
											"min-[1440px]:h-[12.8px] min-[1440px]:w-[12.8px]",
											"min-[1920px]:h-[17.6px] min-[1920px]:w-[17.6px]",
										)}
									/>
									<span
										className={cn(
											"text-sm font-medium text-red-700",
											"max-[1220px]:text-[9.8px]",
											"min-[1440px]:text-[11.2px]",
											"min-[1920px]:text-[15.4px]",
										)}
									>
										Failed
									</span>
								</div>
							) : (
								<div
									className={cn(
										"flex items-center gap-2 px-3 py-1.5 rounded-md bg-green-50 border border-green-200",
										"max-[1220px]:gap-[5.6px] max-[1220px]:px-[8.4px] max-[1220px]:py-[4.2px]",
										"min-[1440px]:gap-[6.4px] min-[1440px]:px-[9.6px] min-[1440px]:py-[4.8px]",
										"min-[1920px]:gap-[8.8px] min-[1920px]:px-[13.2px] min-[1920px]:py-[6.6px]",
									)}
								>
									<CheckCircle2
										className={cn(
											"h-4 w-4 text-green-600",
											"max-[1220px]:h-[11.2px] max-[1220px]:w-[11.2px]",
											"min-[1440px]:h-[12.8px] min-[1440px]:w-[12.8px]",
											"min-[1920px]:h-[17.6px] min-[1920px]:w-[17.6px]",
										)}
									/>
									<span
										className={cn(
											"text-sm font-medium text-green-700",
											"max-[1220px]:text-[9.8px]",
											"min-[1440px]:text-[11.2px]",
											"min-[1920px]:text-[15.4px]",
										)}
									>
										Success
									</span>
								</div>
							)}
							<button
								onClick={() => setIsResultOpen(false)}
								className={cn(
									"p-2 rounded-lg hover:bg-slate-100 transition-colors group outline-none",
									"max-[1220px]:p-[5.6px]",
									"min-[1440px]:p-[6.4px]",
									"min-[1920px]:p-[8.8px]",
								)}
								aria-label="Close dialog"
							>
								<X
									className={cn(
										"h-5 w-5 text-slate-600 group-hover:text-slate-900",
										"max-[1220px]:h-[14px] max-[1220px]:w-[14px]",
										"min-[1440px]:h-4 min-[1440px]:w-4",
										"min-[1920px]:h-[22px] min-[1920px]:w-[22px]",
									)}
								/>
							</button>
						</div>
					</DialogHeader>

					<div
						className={cn(
							"mt-4",
							"max-[1220px]:mt-[11.2px]",
							"min-[1440px]:mt-[12.8px]",
							"min-[1920px]:mt-[17.6px]",
						)}
					>
						{runError ? (
							<div
								className={cn(
									"rounded-lg bg-red-50 border border-red-200 p-4",
									"max-[1220px]:p-[11.2px]",
									"min-[1440px]:p-[12.8px]",
									"min-[1920px]:p-[17.6px]",
								)}
							>
								<div
									className={cn(
										"flex items-start gap-3",
										"max-[1220px]:gap-[8.4px]",
										"min-[1440px]:gap-[9.6px]",
										"min-[1920px]:gap-[13.2px]",
									)}
								>
									<XCircle
										className={cn(
											"h-5 w-5 text-red-600 flex-shrink-0 mt-0.5",
											"max-[1220px]:h-[14px] max-[1220px]:w-[14px] max-[1220px]:mt-[1.4px]",
											"min-[1440px]:h-4 min-[1440px]:w-4 min-[1440px]:mt-[1.6px]",
											"min-[1920px]:h-[22px] min-[1920px]:w-[22px] min-[1920px]:mt-[2.2px]",
										)}
									/>
									<div>
										<p
											className={cn(
												"text-sm font-semibold text-red-700 mb-1",
												"max-[1220px]:text-[9.8px] max-[1220px]:mb-[2.8px]",
												"min-[1440px]:text-[11.2px] min-[1440px]:mb-[3.2px]",
												"min-[1920px]:text-[15.4px] min-[1920px]:mb-[4.4px]",
											)}
										>
											Error
										</p>
										<p
											className={cn(
												"text-sm text-red-700 whitespace-pre-wrap",
												"max-[1220px]:text-[9.8px]",
												"min-[1440px]:text-[11.2px]",
												"min-[1920px]:text-[15.4px]",
											)}
										>
											{runError}
										</p>
									</div>
								</div>
							</div>
						) : (
							<div
								className={cn(
									"space-y-2",
									"max-[1220px]:space-y-[5.6px]",
									"min-[1440px]:space-y-[6.4px]",
									"min-[1920px]:space-y-[8.8px]",
								)}
							>
								<div
									className={cn(
										"flex items-center justify-between px-3 py-2 bg-slate-100 rounded-t-lg border-b border-slate-200",
										"max-[1220px]:px-[8.4px] max-[1220px]:py-[5.6px]",
										"min-[1440px]:px-[9.6px] min-[1440px]:py-[6.4px]",
										"min-[1920px]:px-[13.2px] min-[1920px]:py-[8.8px]",
									)}
								>
									<span
										className={cn(
											"text-xs font-medium text-slate-500 uppercase tracking-wider",
											"max-[1220px]:text-[8.4px]",
											"min-[1440px]:text-[9.6px]",
											"min-[1920px]:text-[13.2px]",
										)}
									>
										Output
									</span>
									<span
										className={cn(
											"text-xs text-slate-500",
											"max-[1220px]:text-[8.4px]",
											"min-[1440px]:text-[9.6px]",
											"min-[1920px]:text-[13.2px]",
										)}
									></span>
								</div>
								<pre
									className={cn(
										"max-h-[50vh] overflow-auto rounded-b-lg bg-slate-50 p-4 text-sm font-mono text-slate-800 border border-slate-200 whitespace-pre-wrap",
										"max-[1220px]:p-[11.2px] max-[1220px]:text-[9.8px]",
										"min-[1440px]:p-[12.8px] min-[1440px]:text-[11.2px]",
										"min-[1920px]:p-[17.6px] min-[1920px]:text-[15.4px]",
									)}
								>
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
