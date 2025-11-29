import React, { useEffect, useRef, useState } from "react";
import {
	X,
	Play,
	GitCompare,
	CheckCircle2,
	XCircle,
	Terminal,
} from "lucide-react";
import { DiffEditor } from "@monaco-editor/react";
import Editor from "@monaco-editor/react";
import { editor } from "monaco-editor";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { runCode } from "@/services/code/code.api";
import { ProgrammingLanguageEnum } from "@/utils/enum";
import * as S from "./DiffViewer.styled";
import { cn } from "@/lib/utils";

interface DiffViewerProps {
	original: string;
	modified: string;
	onClose: () => void;
	userName: string;
	onLoadVersion?: () => void;
	language?: string;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({
	original,
	modified,
	onClose,
	userName,
	language,
}) => {
	const diffEditorRef = useRef<editor.IStandaloneDiffEditor | null>(null);
	const [isHalf, setIsHalf] = useState(window.innerWidth <= 1220);

	// Run states
	const [isRunningOriginal, setIsRunningOriginal] = useState(false);
	const [isRunningModified, setIsRunningModified] = useState(false);
	const [isResultOpen, setIsResultOpen] = useState(false);
	const [activeRunType, setActiveRunType] = useState<"original" | "modified">(
		"original",
	);
	const [runOutput, setRunOutput] = useState("");
	const [runError, setRunError] = useState("");
	const [executionTime, setExecutionTime] = useState<number>(0);

	useEffect(() => {
		document.body.style.overflow = "hidden";

		const handleResize = () => {
			setIsHalf(window.innerWidth <= 1220);
		};

		window.addEventListener("resize", handleResize);

		return () => {
			document.body.style.overflow = "unset";
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	const editorRef = useRef<any>(null);

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

	const handleDiffEditorMount = (diffEditor: editor.IStandaloneDiffEditor) => {
		diffEditorRef.current = diffEditor;

		const originalEditor = diffEditor.getOriginalEditor();
		const modifiedEditor = diffEditor.getModifiedEditor();

		originalEditor.updateOptions({
			readOnly: true,
		});

		modifiedEditor.updateOptions({
			readOnly: true,
		});
	};

	const toEnumLanguage = (lang: string): ProgrammingLanguageEnum | null => {
		const val = (lang || "").toLowerCase();
		if (["javascript", "js"].includes(val))
			return ProgrammingLanguageEnum.JAVASCRIPT;
		if (["python", "py"].includes(val)) return ProgrammingLanguageEnum.PYTHON;
		if (["java"].includes(val)) return ProgrammingLanguageEnum.JAVA;
		return null;
	};

	const handleRunCode = async (code: string, type: "original" | "modified") => {
		const enumLang = toEnumLanguage(language || "");

		if (!enumLang) {
			setRunError(
				`Running not supported for language: ${language || "Unknown"}`,
			);
			setRunOutput("");
			setActiveRunType(type);
			setExecutionTime(0);
			setIsResultOpen(true);
			return;
		}
		if (!code?.trim()) {
			setRunError("No code to run");
			setRunOutput("");
			setActiveRunType(type);
			setExecutionTime(0);
			setIsResultOpen(true);
			return;
		}

		const setRunning =
			type === "original" ? setIsRunningOriginal : setIsRunningModified;

		setRunning(true);
		setRunError("");
		setActiveRunType(type);
		const startTime = performance.now();

		try {
			const res = await runCode({ code, language: enumLang });

			const endTime = performance.now();
			setExecutionTime(endTime - startTime);

			const output = res.data.output ?? "";

			const isError =
				output.includes("error:") ||
				output.includes("Error:") ||
				output.includes("Exception") ||
				output.includes("SyntaxError") ||
				output.includes("Traceback") ||
				output.includes("TypeError") ||
				output.includes("ReferenceError") ||
				output.includes("RuntimeError") ||
				(output.includes(".java:") && output.includes("error:")) ||
				output.includes("Caused by:");

			if (isError) {
				setRunError(output);
				setRunOutput("");
			} else {
				setRunOutput(output);
				setRunError("");
			}

			setIsResultOpen(true);
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
			setRunning(false);
		}
	};

	return (
		<>
			<S.ModalOverlay>
				<S.ModalBackdrop onClick={onClose} />

				<S.ModalContent>
					<S.Header>
						<S.HeaderLeft>
							<S.CompareIcon>
								<GitCompare style={{ width: "100%", height: "100%" }} />
							</S.CompareIcon>
							<S.HeaderInfo>
								<S.HeaderTitle>Code Comparison</S.HeaderTitle>
								<S.HeaderSubtitle>{userName}</S.HeaderSubtitle>
							</S.HeaderInfo>
						</S.HeaderLeft>
						<S.CloseButton onClick={onClose}>
							<X style={{ width: "1.25rem", height: "1.25rem" }} />
						</S.CloseButton>
					</S.Header>

					<div className="flex-1 overflow-hidden">
						{isHalf ? (
							<ResizablePanelGroup direction="vertical">
								<ResizablePanel defaultSize={50} minSize={30}>
									<div className="h-full flex flex-col bg-white">
										<div className="flex items-center justify-between px-4 py-3 border-b border-red-200 bg-red-50 flex-shrink-0">
											<span className="text-sm font-semibold text-red-600">
												Original Code
											</span>
											<S.RunButton
												onClick={() => handleRunCode(original, "original")}
												disabled={isRunningOriginal}
											>
												{isRunningOriginal ? (
													<Spinner className="h-3.5 w-3.5" />
												) : (
													<Play
														style={{ width: "0.875rem", height: "0.875rem" }}
													/>
												)}
												{isRunningOriginal ? "Running..." : "Run"}
											</S.RunButton>
										</div>
										<div className="flex-1">
											<Editor
												height="100%"
												language={language}
												value={original}
												theme="vs"
												options={{
													readOnly: true,
													minimap: { enabled: false },
													fontSize: 13,
													lineNumbers: "on",
													scrollBeyondLastLine: false,
													automaticLayout: true,
													wordWrap: "off",
												}}
											/>
										</div>
									</div>
								</ResizablePanel>

								<ResizableHandle />

								<ResizablePanel defaultSize={50} minSize={30}>
									<div className="h-full flex flex-col bg-white">
										<div className="flex items-center justify-between px-4 py-3 border-b border-green-200 bg-green-50 flex-shrink-0">
											<span className="text-sm font-semibold text-green-600">
												Modified Code
											</span>
											<S.RunButton
												onClick={() => handleRunCode(modified, "modified")}
												disabled={isRunningModified}
											>
												{isRunningModified ? (
													<Spinner className="h-3.5 w-3.5" />
												) : (
													<Play
														style={{ width: "0.875rem", height: "0.875rem" }}
													/>
												)}
												{isRunningModified ? "Running..." : "Run"}
											</S.RunButton>
										</div>
										<div className="flex-1">
											<Editor
												height="100%"
												language={language}
												value={modified}
												theme="vs"
												options={{
													readOnly: true,
													minimap: { enabled: false },
													fontSize: 13,
													lineNumbers: "on",
													scrollBeyondLastLine: false,
													automaticLayout: true,
													wordWrap: "off",
													theme: "vs-dark",
												}}
											/>
										</div>
									</div>
								</ResizablePanel>
							</ResizablePanelGroup>
						) : (
							<div className="h-full relative">
								<div className="absolute top-0 left-0 right-0 z-10 flex pointer-events-none">
									<div className="flex-1 flex items-center justify-between px-4 py-2.5 border-b border-red-200 bg-red-50/95 backdrop-blur-sm pointer-events-auto">
										<span className="text-sm font-semibold text-red-600">
											Original Code
										</span>
										<S.RunButton
											onClick={() => handleRunCode(original, "original")}
											disabled={isRunningOriginal}
										>
											{isRunningOriginal ? (
												<Spinner className="h-3.5 w-3.5" />
											) : (
												<Play
													style={{ width: "0.875rem", height: "0.875rem" }}
												/>
											)}
											{isRunningOriginal ? "Running..." : "Run"}
										</S.RunButton>
									</div>
									<div className="flex-1 flex items-center justify-between px-4 py-2.5 border-b border-green-200 bg-green-50/95 backdrop-blur-sm pointer-events-auto">
										<span className="text-sm font-semibold text-green-600">
											Modified Code
										</span>
										<S.RunButton
											onClick={() => handleRunCode(modified, "modified")}
											disabled={isRunningModified}
										>
											{isRunningModified ? (
												<Spinner className="h-3.5 w-3.5" />
											) : (
												<Play
													style={{ width: "0.875rem", height: "0.875rem" }}
												/>
											)}
											{isRunningModified ? "Running..." : "Run"}
										</S.RunButton>
									</div>
								</div>

								<div className="h-full pt-14 bg-white">
									<DiffEditor
										height="100%"
										language={language}
										original={original}
										modified={modified}
										onMount={handleDiffEditorMount}
										theme="vs"
										options={{
											readOnly: true,
											renderSideBySide: true,
											enableSplitViewResizing: true,
											renderOverviewRuler: true,
											scrollBeyondLastLine: false,
											minimap: { enabled: false },
											fontSize: 13,
											lineNumbers: "on",
											automaticLayout: true,
											wordWrap: "off",
											renderIndicators: true,
											ignoreTrimWhitespace: false,
											diffWordWrap: "off",
										}}
									/>
								</div>
							</div>
						)}
					</div>

					<S.Footer>
						<S.FooterContent>
							<S.DiffInfo>Comparing code changes</S.DiffInfo>
						</S.FooterContent>
					</S.Footer>
				</S.ModalContent>
			</S.ModalOverlay>

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
									{activeRunType === "original" ? (
										<span className="text-red-400 font-medium">
											Original Code
										</span>
									) : (
										<span className="text-green-400 font-medium">
											Modified Code
										</span>
									)}{" "}
									• {language?.toUpperCase() || "UNKNOWN"} •{" "}
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
											"h-4 w-4 text-red-500",
											"max-[1220px]:h-[11.2px] max-[1220px]:w-[11.2px]",
											"min-[1440px]:h-[12.8px] min-[1440px]:w-[12.8px]",
											"min-[1920px]:h-[17.6px] min-[1920px]:w-[17.6px]",
										)}
									/>
									<span
										className={cn(
											"text-sm font-medium text-red-600",
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
									"p-2 rounded-lg hover:bg-slate-100 transition-colors group outline-none ring-0 focus:ring-0",
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
											"h-5 w-5 text-red-400 flex-shrink-0 mt-0.5",
											"max-[1220px]:h-[14px] max-[1220px]:w-[14px] max-[1220px]:mt-[1.4px]",
											"min-[1440px]:h-4 min-[1440px]:w-4 min-[1440px]:mt-[1.6px]",
											"min-[1920px]:h-[22px] min-[1920px]:w-[22px] min-[1920px]:mt-[2.2px]",
										)}
									/>
									<div>
										<p
											className={cn(
												"text-sm font-semibold text-red-600 mb-1",
												"max-[1220px]:text-[9.8px] max-[1220px]:mb-[2.8px]",
												"min-[1440px]:text-[11.2px] min-[1440px]:mb-[3.2px]",
												"min-[1920px]:text-[15.4px] min-[1920px]:mb-[4.4px]",
											)}
										>
											Error
										</p>
										<p
											className={cn(
												"text-sm text-red-600 whitespace-pre-wrap",
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
