import React, {
	useCallback,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from "react";
import Editor, { type Monaco, type OnMount } from "@monaco-editor/react";
import type { editor as MonacoEditorNS } from "monaco-editor";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from "@/components/ui/select";
import { ProgrammingLanguageEnum } from "@/utils/enum";
import { getActiveProgrammingLanguages } from "@/services/programmingLanguagesAPI";

export type CodeEditorRef = {
	/** Get current editor text value */
	getValue: () => string;
	/** Set editor text value programmatically */
	setValue: (val: string) => void;
	/** Focus the editor */
	focus: () => void;
	/** Try to format the document using Monaco's formatter */
	formatDocument: () => void;
};

export type LanguageOption = {
	label: string;
	value: string;
	icon?: string;
	preset: string;
};

export type CodeEditorProps = {
	/** Controlled value (preferred). Use with onChange */
	value?: string;
	/** Change handler for controlled usage */
	onChange?: (value: string) => void;
	/** Initial value when uncontrolled */
	defaultValue?: string;
	/** Monaco language id (e.g., 'typescript', 'javascript', 'python') */
	language?: string;
	/** Called when language changes via selector */
	onLanguageChange?: (lang: string) => void;
	/** Custom language options for selector */
	languages?: LanguageOption[];
	/** Show the language selector header */
	showLanguageSelector?: boolean;
	/** Editor dimensions */
	height?: number | string;
	width?: number | string;
	/** Read-only mode */
	readOnly?: boolean;
	/** Extra Monaco options */
	options?: Parameters<typeof Editor>[0]["options"];
	/** Force theme, otherwise auto-detects prefers-color-scheme */
	theme?: "light" | "dark";
	/** Container className for layout customizations */
	className?: string;
	/** Show a small close button when the editor is focused; requires onClose */
	closeButtonWhenFocused?: boolean;
	/** Called when the close button is clicked (optional) */
	onClose?: () => void;
	/** Fit the editor to the parent's height (header remains fixed) */
	fitParent?: boolean;
	/** Auto-size editor height between min/max lines (ignored when fitParent=true) */
	minLines?: number;
	maxLines?: number;
	/** If true, pressing Backspace on an empty editor triggers onClose (when provided). */
	closeOnEmptyBackspace?: boolean;
	/** Called when user presses Ctrl/Cmd + Enter inside the editor (e.g., to send). */
	onCtrlEnter?: () => void;
};

const DEFAULT_LANGUAGES: LanguageOption[] = [
	{
		label: "JavaScript",
		value: ProgrammingLanguageEnum.JAVASCRIPT,
		preset: `console.log("Hello, World!");`,
	},
	{
		label: "Python",
		value: ProgrammingLanguageEnum.PYTHON,
		preset: `print("Hello, World!")`,
	},
	{
		label: "Java",
		value: ProgrammingLanguageEnum.JAVA,
		preset: `// Please do not remove the Main class\npublic class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello, World!");\n\t}\n}`,
	},
	{
		label: "C",
		value: ProgrammingLanguageEnum.C,
		preset: `#include <stdio.h>\n\nint main() {\n\tprintf("Hello, World!\\n");\n\treturn 0;\n}`,
	},
	{
		label: "C++",
		value: ProgrammingLanguageEnum.CPP,
		preset: `#include <iostream>\n\nint main() {\n\tstd::cout << "Hello, World!" << std::endl;\n\treturn 0;\n}`,
	},
];

const CodeEditor = React.forwardRef<CodeEditorRef, CodeEditorProps>(
	(
		{
			value,
			onChange,
			defaultValue,
			language,
			onLanguageChange,
			languages,
			showLanguageSelector = true,
			height = 400,
			width = "100%",
			readOnly = false,
			options,
			theme,
			className,
			closeButtonWhenFocused = false,
			onClose,
			fitParent = false,
			minLines = 3,
			maxLines,
			closeOnEmptyBackspace = true,
			onCtrlEnter,
		},
		ref,
	) => {
		const editorRef = useRef<MonacoEditorNS.IStandaloneCodeEditor | null>(null);
		const disposablesRef = useRef<Array<{ dispose: () => void }>>([]);
		const [isFocused, setIsFocused] = useState(false);
		const [dynHeight, setDynHeight] = useState<number | string>(height);
		const hasAppliedInitialPresetRef = useRef(false);
		const [dynamicLanguages, setDynamicLanguages] = useState<LanguageOption[]>(
			[],
		);

		useEffect(() => {
			if (languages && languages.length > 0) return;
			let isMounted = true;
			const fetchLanguages = async () => {
				try {
					const response = await getActiveProgrammingLanguages();
					const data = Array.isArray(response?.data) ? response.data : [];
					const executableLanguages = data.map<LanguageOption>((lang) => ({
						label: lang.languageName,
						value: lang.languageCode || lang.id,
						icon: lang.languageIcon ?? undefined,
						preset: lang.preset ?? "",
					}));
					if (isMounted) {
						setDynamicLanguages(executableLanguages);
					}
				} catch (error) {
					console.error("Failed to load programming languages", error);
					if (isMounted) {
						setDynamicLanguages([]);
					}
				}
			};

			void fetchLanguages();

			return () => {
				isMounted = false;
			};
		}, [languages]);

		const fallbackLanguages = useMemo<LanguageOption[]>(() => {
			if (languages && languages.length > 0) {
				return languages;
			}
			if (dynamicLanguages.length > 0) {
				return dynamicLanguages;
			}
			return DEFAULT_LANGUAGES;
		}, [languages, dynamicLanguages]);

		const availableLanguages = fallbackLanguages;

		const initialLang =
			language ||
			availableLanguages[0]?.value ||
			DEFAULT_LANGUAGES[0]?.value ||
			"javascript";
		const [internalLang, setInternalLang] = useState<string>(initialLang);
		const selectedLanguage = useMemo(
			() => availableLanguages.find((item) => item.value === internalLang),
			[availableLanguages, internalLang],
		);

		useEffect(() => {
			if (!language && availableLanguages.length > 0) {
				const exists = availableLanguages.some(
					(langOption) => langOption.value === internalLang,
				);
				if (!exists) {
					setInternalLang(availableLanguages[0].value);
				}
			}
		}, [language, availableLanguages, internalLang]);

		useEffect(() => {
			if (language && language !== internalLang) setInternalLang(language);
		}, [language, internalLang]);

		const monacoTheme = theme === "dark" ? "vs-dark" : "vs";

		const handleBeforeMount = useCallback((m: Monaco) => {
			try {
				m.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
					noSemanticValidation: true,
					noSyntaxValidation: true,
				});
				m.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
					noSemanticValidation: true,
					noSyntaxValidation: true,
				});
				try {
					(m.languages as any).json?.jsonDefaults?.setDiagnosticsOptions?.({
						validate: false,
					});
				} catch {
					/* noop */
				}
				try {
					(m.languages as any).css?.cssDefaults?.setDiagnosticsOptions?.({
						validate: false,
					});
				} catch {
					/* noop */
				}
				try {
					(m.languages as any).html?.htmlDefaults?.setOptions?.({
						validate: false,
					});
				} catch {
					/* noop */
				}
			} catch {
				/* noop */
			}
		}, []);

		const applyPresetForLanguage = useCallback(
			(langValue: string) => {
				const presetText =
					availableLanguages.find((item) => item.value === langValue)?.preset ??
					"";
				const isControlled = typeof value !== "undefined";
				if (!isControlled && editorRef.current) {
					editorRef.current.setValue(presetText);
				}
				onChange?.(presetText);
			},
			[availableLanguages, onChange, value],
		);

		const handleLangChange = useCallback(
			(next: string) => {
				setInternalLang(next);
				if (onLanguageChange) onLanguageChange(next);
				applyPresetForLanguage(next);
			},
			[applyPresetForLanguage, onLanguageChange],
		);

		const handleMount: OnMount = useCallback(
			(ed, m: Monaco) => {
				editorRef.current = ed;
				if (!hasAppliedInitialPresetRef.current) {
					applyPresetForLanguage(internalLang);
					hasAppliedInitialPresetRef.current = true;
				}
				if (defaultValue && ed.getValue() === defaultValue && m) {
					try {
						ed.getAction("editor.action.formatDocument")?.run();
					} catch {
						/* noop */
					}
				}

				const d1 = ed.onDidFocusEditorText?.(() => setIsFocused(true));
				const d2 = ed.onDidBlurEditorText?.(() => setIsFocused(false));
				if (d1)
					disposablesRef.current.push(d1 as unknown as { dispose: () => void });
				if (d2)
					disposablesRef.current.push(d2 as unknown as { dispose: () => void });

				const recompute = () => {
					if (fitParent) return;
					try {
						const contentHeight = ed.getContentHeight();
						const model = ed.getModel();
						const lineCount = Math.max(1, model?.getLineCount() ?? 1);
						const approxLineHeight = Math.max(
							16,
							Math.round(contentHeight / lineCount),
						);
						const minH = approxLineHeight * Math.max(1, minLines) + 8;
						const maxH = maxLines
							? approxLineHeight * Math.max(minLines, maxLines) + 8
							: Number.MAX_SAFE_INTEGER;
						const clamped = Math.max(minH, Math.min(contentHeight, maxH));
						setDynHeight(clamped);
					} catch {
						/* noop */
					}
				};
				recompute();
				const d3 = ed.onDidContentSizeChange?.(() => recompute());
				if (d3)
					disposablesRef.current.push(d3 as unknown as { dispose: () => void });

				if (closeOnEmptyBackspace && onClose) {
					const dBackspace = ed.onKeyDown?.((ev) => {
						try {
							const KeyCode = (m as any).KeyCode;
							const isBackspace =
								(KeyCode && ev.keyCode === KeyCode.Backspace) ||
								ev.browserEvent?.key === "Backspace";
							if (isBackspace) {
								const current = (ed.getValue() || "").trim();
								if (current.length === 0) {
									ev.preventDefault();
									ev.stopPropagation?.();
									onClose();
								}
							}
						} catch {
							/* noop */
						}
					});
					if (dBackspace)
						disposablesRef.current.push(
							dBackspace as unknown as { dispose: () => void },
						);
				}

				if (onCtrlEnter) {
					try {
						const KeyMod = (m as any).KeyMod;
						const KeyCode = (m as any).KeyCode;
						if (KeyMod && KeyCode && typeof ed.addCommand === "function") {
							ed.addCommand(KeyMod.CtrlCmd | KeyCode.Enter, () => {
								try {
									onCtrlEnter();
								} catch {
									/* noop */
								}
							});
						}
					} catch {
						/* noop */
					}

					const dCtrlEnter = ed.onKeyDown?.((ev) => {
						try {
							const hasCmdCtrl = ev.ctrlKey || ev.metaKey;
							const isEnterKey = ev.browserEvent?.key === "Enter";
							const isNumpadEnter = ev.browserEvent?.code === "NumpadEnter";
							const KeyCode = (m as any).KeyCode;
							const isMonacoEnter = KeyCode && ev.keyCode === KeyCode.Enter;
							if (
								hasCmdCtrl &&
								(isEnterKey || isNumpadEnter || isMonacoEnter)
							) {
								ev.preventDefault();
								ev.stopPropagation?.();
								onCtrlEnter();
							}
						} catch {
							/* noop */
						}
					});
					if (dCtrlEnter)
						disposablesRef.current.push(
							dCtrlEnter as unknown as { dispose: () => void },
						);
				}
			},
			[
				defaultValue,
				fitParent,
				minLines,
				maxLines,
				closeOnEmptyBackspace,
				onClose,
				onCtrlEnter,
				applyPresetForLanguage,
				internalLang,
			],
		);

		const handleChange = useCallback(
			(val?: string) => {
				if (onChange) onChange(val ?? "");
			},
			[onChange],
		);

		useImperativeHandle(
			ref,
			(): CodeEditorRef => ({
				getValue: () => editorRef.current?.getValue() ?? "",
				setValue: (val: string) => editorRef.current?.setValue(val),
				focus: () => editorRef.current?.focus(),
				formatDocument: () => {
					const instance = editorRef.current;
					if (!instance) return;
					try {
						instance.getAction("editor.action.formatDocument")?.run();
					} catch {
						/* noop */
					}
				},
			}),
			[],
		);

		const mergedOptions = useMemo(
			() => ({
				readOnly,
				fontSize: 14,
				minimap: { enabled: false },
				automaticLayout: true,
				lineNumbers: "on" as const,
				scrollBeyondLastLine: false,
				wordWrap: "on" as const,
				tabSize: 2,
				insertSpaces: true,
				renderValidationDecorations: "off" as const,
				overviewRulerLanes: 0,
				quickSuggestions: false,
				...options,
			}),
			[readOnly, options],
		);

		useEffect(() => {
			return () => {
				disposablesRef.current.forEach((d) => {
					try {
						d.dispose();
					} catch {
						/* noop */
					}
				});
				disposablesRef.current = [];
			};
		}, []);

		const containerStyle: React.CSSProperties | undefined = fitParent
			? { display: "flex", flexDirection: "column" as const, height: "100%" }
			: undefined;

		const wrapperClassName = cn(
			"rounded-xl border border-slate-200 bg-white shadow-sm p-3 space-y-3",
			"max-[1220px]:rounded-[8.4px] max-[1220px]:p-[8.4px] max-[1220px]:space-y-[8.4px]",
			"min-[1440px]:rounded-[9.6px] min-[1440px]:p-[9.6px] min-[1440px]:space-y-[9.6px]",
			"min-[1920px]:rounded-[13.2px] min-[1920px]:p-[13.2px] min-[1920px]:space-y-[13.2px]",
			className,
		);

		return (
			<div className={wrapperClassName} style={containerStyle}>
				{showLanguageSelector ? (
					<div
						className={cn(
							// Base
							"flex items-center justify-between pb-2",
							"max-[1220px]:pb-[5.6px]",
							"min-[1440px]:pb-[6.4px]",
							"min-[1920px]:pb-[8.8px]",
						)}
					>
						<label
							className={cn(
								"text-[14px] font-semibold text-slate-900",
								"max-[1220px]:text-[12px]",
								"min-[1440px]:text-[13px]",
								"min-[1920px]:text-[16px]",
							)}
						>
							Code editor
						</label>
						<div
							className={cn(
								// Base
								"flex items-center gap-2",
								"max-[1220px]:gap-[5.6px]",
								"min-[1440px]:gap-[6.4px]",
								"min-[1920px]:gap-[8.8px]",
							)}
						>
							<Select value={internalLang} onValueChange={handleLangChange}>
								<SelectTrigger
									className={cn(
										"min-w-[180px] border-slate-300 bg-white text-[14px] font-medium text-slate-700 focus:ring-slate-400/60",
										"max-[1220px]:rounded-[5.6px] max-[1220px]:px-[5.6px] max-[1220px]:py-[2.8px] max-[1220px]:text-[11px]",
										"min-[1440px]:rounded-[6.4px] min-[1440px]:px-[6.4px] min-[1440px]:py-[3.2px] min-[1440px]:text-[12px]",
										"min-[1920px]:rounded-[8.8px] min-[1920px]:px-[8.8px] min-[1920px]:py-[4.4px] min-[1920px]:text-[14px]",
									)}
									aria-label="Select a programming language"
								>
									<span className="truncate">
										{selectedLanguage?.label ?? "Select language"}
									</span>
								</SelectTrigger>
								<SelectContent align="end" className="min-w-[220px]">
									{availableLanguages.map((langOption) => (
										<SelectItem key={langOption.value} value={langOption.value}>
											{langOption.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{onClose ? (
								<button
									type="button"
									aria-label="Close code editor"
									title="Close code editor"
									className={cn(
										"rounded-md border border-slate-300 bg-white px-2 py-1 text-[12px] font-medium text-slate-600 shadow-sm transition-opacity hover:bg-slate-100",
										"max-[1220px]:rounded-[5.6px] max-[1220px]:px-[5.6px] max-[1220px]:py-[2.8px] max-[1220px]:text-[11px]",
										"min-[1440px]:rounded-[6.4px] min-[1440px]:px-[6.4px] min-[1440px]:py-[3.2px] min-[1440px]:text-[12px]",
										"min-[1920px]:rounded-[8.8px] min-[1920px]:px-[8.8px] min-[1920px]:py-[4.4px] min-[1920px]:text-[14px]",
										closeButtonWhenFocused && !isFocused
											? "opacity-0 pointer-events-none"
											: "opacity-100",
									)}
									onMouseDown={(e) => {
										e.preventDefault();
										e.stopPropagation();
										onClose?.();
									}}
								>
									<X
										size={20}
										className={cn(
											"text-slate-500",
											"max-[1220px]:w-[14px] max-[1220px]:h-[14px]",
											"min-[1440px]:w-[16px] min-[1440px]:h-[16px]",
											"min-[1920px]:w-[22px] min-[1920px]:h-[22px]",
										)}
									/>
								</button>
							) : null}
						</div>
					</div>
				) : null}
				{fitParent ? (
					<div className="min-h-0 flex-1">
						<Editor
							height={"100%"}
							width={width}
							language={internalLang}
							theme={monacoTheme}
							value={value}
							defaultValue={defaultValue}
							onChange={handleChange}
							options={mergedOptions}
							beforeMount={handleBeforeMount}
							onMount={handleMount}
						/>
					</div>
				) : (
					<Editor
						height={dynHeight}
						width={width}
						language={internalLang}
						theme={monacoTheme}
						value={value}
						defaultValue={defaultValue}
						onChange={handleChange}
						options={mergedOptions}
						beforeMount={handleBeforeMount}
						onMount={handleMount}
					/>
				)}
			</div>
		);
	},
);

CodeEditor.displayName = "CodeEditor";

export default CodeEditor;
