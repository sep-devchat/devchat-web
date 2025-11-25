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

export type LanguageOption = { label: string; value: string };

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
	// { label: "TypeScript", value: "typescript" },
	{ label: "JavaScript", value: "javascript" },
	{ label: "Python", value: "python" },
	{ label: "Java", value: "java" },
	// { label: "C#", value: "csharp" },
	// { label: "C++", value: "cpp" },
	// { label: "Go", value: "go" },
	// { label: "Rust", value: "rust" },
	// { label: "PHP", value: "php" },
	// { label: "SQL", value: "sql" },
	// { label: "JSON", value: "json" },
	// { label: "YAML", value: "yaml" },
	// { label: "Markdown", value: "markdown" },
	// { label: "HTML", value: "html" },
	// { label: "CSS", value: "css" },
	// { label: "Shell", value: "shell" },
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

		const availableLanguages = useMemo<LanguageOption[]>(
			() => (languages && languages.length > 0 ? languages : DEFAULT_LANGUAGES),
			[languages],
		);

		const initialLang =
			language || availableLanguages[0]?.value || "typescript";
		const [internalLang, setInternalLang] = useState<string>(initialLang);
		// keep internal language in sync with controlled prop
		useEffect(() => {
			if (language && language !== internalLang) setInternalLang(language);
		}, [language, internalLang]);

		const monacoTheme = theme === "dark" ? "vs-dark" : "vs";

		// Configure Monaco prior to mount to suppress validation squiggles/markers.
		const handleBeforeMount = useCallback((m: Monaco) => {
			try {
				// Disable diagnostics for TS/JS
				// (prevents red squiggles when composing snippets in chat).
				m.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
					noSemanticValidation: true,
					noSyntaxValidation: true,
				});
				m.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
					noSemanticValidation: true,
					noSyntaxValidation: true,
				});
				// Also turn off validation for common web langs
				// These APIs exist in Monaco distributions that include these languages.
				// Guard with try/catch so missing languages don't throw.
				try {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					(m.languages as any).json?.jsonDefaults?.setDiagnosticsOptions?.({
						validate: false,
					});
				} catch {
					/* noop */
				}
				try {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					(m.languages as any).css?.cssDefaults?.setDiagnosticsOptions?.({
						validate: false,
					});
				} catch {
					/* noop */
				}
				try {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					(m.languages as any).html?.htmlDefaults?.setOptions?.({
						validate: false,
					});
				} catch {
					/* noop */
				}
			} catch {
				// ignore if monaco bundle doesn't expose these defaults
			}
		}, []);

		const handleMount: OnMount = useCallback(
			(ed, m: Monaco) => {
				editorRef.current = ed;
				// optional: try to format on mount for default value
				if (defaultValue && ed.getValue() === defaultValue && m) {
					// best-effort format
					try {
						ed.getAction("editor.action.formatDocument")?.run();
					} catch {
						// ignore if formatter not available
					}
				}
				// Focus listeners control the optional close button visibility
				const d1 = ed.onDidFocusEditorText?.(() => setIsFocused(true));
				const d2 = ed.onDidBlurEditorText?.(() => setIsFocused(false));
				if (d1)
					disposablesRef.current.push(d1 as unknown as { dispose: () => void });
				if (d2)
					disposablesRef.current.push(d2 as unknown as { dispose: () => void });

				// Auto-size height between min/max lines (only when not fitParent)
				const recompute = () => {
					if (fitParent) return; // handled by container
					try {
						const contentHeight = ed.getContentHeight();
						const model = ed.getModel();
						const lineCount = Math.max(1, model?.getLineCount() ?? 1);
						const approxLineHeight = Math.max(
							16,
							Math.round(contentHeight / lineCount),
						);
						const minH = approxLineHeight * Math.max(1, minLines) + 8; // small padding
						const maxH = maxLines
							? approxLineHeight * Math.max(minLines, maxLines) + 8
							: Number.MAX_SAFE_INTEGER;
						const clamped = Math.max(minH, Math.min(contentHeight, maxH));
						setDynHeight(clamped);
					} catch {
						// noop
					}
				};
				recompute();
				const d3 = ed.onDidContentSizeChange?.(() => recompute());
				if (d3)
					disposablesRef.current.push(d3 as unknown as { dispose: () => void });

				// Close editor on Backspace when empty (conditional)
				if (closeOnEmptyBackspace && onClose) {
					const dBackspace = ed.onKeyDown?.((ev) => {
						try {
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

				// Ctrl/Cmd + Enter to submit (always bind when provided)
				if (onCtrlEnter) {
					// Robust keybinding via Monaco command API
					try {
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						const KeyMod = (m as any).KeyMod;
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
					// Also handle NumpadEnter + Ctrl as a fallback via keydown listener
					const dCtrlEnter = ed.onKeyDown?.((ev) => {
						try {
							const hasCmdCtrl = ev.ctrlKey || ev.metaKey;
							const isEnterKey = ev.browserEvent?.key === "Enter";
							const isNumpadEnter = ev.browserEvent?.code === "NumpadEnter";
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
			],
		);

		const handleChange = useCallback(
			(val?: string) => {
				if (onChange) onChange(val ?? "");
			},
			[onChange],
		);

		const handleLangChange = useCallback(
			(e: React.ChangeEvent<HTMLSelectElement>) => {
				const next = e.target.value;
				setInternalLang(next);
				if (onLanguageChange) onLanguageChange(next);
			},
			[onLanguageChange],
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
						// ignore if unavailable
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
				// Hide validation decorations/overview ruler markers for a distraction-free composer.
				renderValidationDecorations: "off" as const,
				overviewRulerLanes: 0,
				// Reduce hinting noise while composing
				quickSuggestions: false,
				...options,
			}),
			[readOnly, options],
		);

		// cleanup listeners on unmount
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
			className,
		);
		return (
			<div className={wrapperClassName} style={containerStyle}>
				{showLanguageSelector ? (
					<div className="flex items-center justify-between pb-2">
						<label className="text-sm font-semibold text-slate-900">
							Code editor
						</label>
						<div className="flex items-center gap-2">
							<select
								className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400/60"
								value={internalLang}
								onChange={handleLangChange}
							>
								{availableLanguages.map((l) => (
									<option key={l.value} value={l.value}>
										{l.label}
									</option>
								))}
							</select>
							{onClose ? (
								<button
									type="button"
									aria-label="Close code editor"
									title="Close code editor"
									className={
										"rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-600 shadow-sm transition-opacity hover:bg-slate-100 " +
										(closeButtonWhenFocused && !isFocused
											? "opacity-0 pointer-events-none"
											: "opacity-100")
									}
									onMouseDown={(e) => {
										// Trigger close early to avoid focus/blur race conditions
										e.preventDefault();
										e.stopPropagation();
										onClose?.();
									}}
								>
									<X size={20} className="text-slate-500" />
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
