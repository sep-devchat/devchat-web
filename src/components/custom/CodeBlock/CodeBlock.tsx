import {
	ClassAttributes,
	HTMLAttributes,
	useEffect,
	useRef,
	useState,
} from "react";
import hljs from "highlight.js";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Pencil, Play } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { runCode } from "@/services/code/code.api";
import { ProgrammingLanguageEnum } from "@/utils/enum";
import { MockPage } from "@/components/custom/MockPage";
import CodeCollab from "@/pages/CodeCollab/CodeCollab";
// import 'highlight.js/styles/github.css';

export interface CodeBlockProps
	extends HTMLAttributes<HTMLPreElement>,
		ClassAttributes<HTMLPreElement> {
	onEdit?: (code: string, language: string) => void;
	onRun?: (code: string, language: string) => void;
	showEditButton?: boolean;
	showRunButton?: boolean;
}

const CodeBlock = ({
	className,
	onEdit,
	onRun,
	showEditButton = true,
	showRunButton = true,
	...props
}: CodeBlockProps) => {
	const preRef = useRef<HTMLPreElement>(null);
	const [language, setLanguage] = useState<string>("");
	const [codeText, setCodeText] = useState<string>("");
	const [isRunning, setIsRunning] = useState<boolean>(false);
	const [isResultOpen, setIsResultOpen] = useState<boolean>(false);
	const [runOutput, setRunOutput] = useState<string>("");
	const [runError, setRunError] = useState<string>("");
	const [isEditOpen, setIsEditOpen] = useState<boolean>(false);

	const normalizeLang = (raw?: string) => {
		const v = (raw || "").toLowerCase();
		switch (v) {
			case "js":
			case "javascript":
				return "JavaScript";
			case "ts":
			case "typescript":
				return "TypeScript";
			case "py":
			case "python":
				return "Python";
			case "java":
				return "Java";
			case "csharp":
			case "cs":
				return "C#";
			case "cpp":
			case "c++":
				return "C++";
			case "go":
				return "Go";
			case "rs":
			case "rust":
				return "Rust";
			case "php":
				return "PHP";
			case "sql":
				return "SQL";
			case "json":
				return "JSON";
			case "yaml":
			case "yml":
				return "YAML";
			case "md":
			case "markdown":
				return "Markdown";
			case "html":
				return "HTML";
			case "css":
				return "CSS";
			case "shell":
			case "bash":
			case "sh":
				return "Shell";
			default:
				return raw ? raw.charAt(0).toUpperCase() + raw.slice(1) : "Code";
		}
	};

	useEffect(() => {
		const codeEl = preRef.current?.querySelector("code");
		if (codeEl) {
			try {
				hljs.highlightElement(codeEl as HTMLElement);
			} catch {
				// silent fail; highlighting is non-critical
			}

			// Extract language from code class e.g. language-ts, lang-ts, or data-language
			const cls = codeEl.getAttribute("class") || "";
			const m = cls.match(/(?:language|lang)-([a-zA-Z0-9_+-]+)/);
			const dataLang = codeEl.getAttribute("data-language") || "";
			const rawLang = (m && m[1]) || dataLang || "";
			setLanguage(normalizeLang(rawLang));

			// Extract raw text content
			setCodeText(codeEl.textContent || "");
		}
	}, [props.children]);

	const toEnumLanguage = (lang: string): ProgrammingLanguageEnum | null => {
		const val = (lang || "").toLowerCase();
		if (["javascript", "js", "node", "nodejs"].includes(val))
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
			setIsResultOpen(true);
			return;
		}
		if (!codeText?.trim()) return;
		setIsRunning(true);
		setRunError("");
		try {
			const res = await runCode({ code: codeText, language: enumLang });
			setRunOutput(res.data.output ?? "");
			setIsResultOpen(true);
		} catch (e) {
			setRunError("Error running code");
			setRunOutput("");
			setIsResultOpen(true);
		} finally {
			setIsRunning(false);
		}
	};

	return (
		<>
			<Card className="min-w-[360px] overflow-hidden isolate z-10 mix-blend-normal">
				<CardHeader className="py-2 px-3 bg-card border-b border-border">
					<div className="flex items-center justify-between gap-2 relative z-10">
						<CardTitle className="text-xs font-semibold uppercase tracking-wide text-card-foreground/80">
							{language || "Code"}
						</CardTitle>
						<div className="flex items-center gap-2">
							<TooltipProvider delayDuration={200}>
								{showEditButton && (
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												variant="outline"
												size="sm"
												className="h-7 w-7 p-0 grid place-items-center"
												aria-label="Edit code"
												onClick={() => {
													onEdit?.(codeText, language || "");
													setIsEditOpen(true);
												}}
											>
												<Pencil className="h-4 w-4" />
												<span className="sr-only">Edit code</span>
											</Button>
										</TooltipTrigger>
										<TooltipContent side="bottom">Edit code</TooltipContent>
									</Tooltip>
								)}
								{showRunButton && (
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												variant="outline"
												size="sm"
												className="h-7 w-7 p-0 grid place-items-center"
												aria-label="Run code"
												disabled={isRunning || !codeText.trim()}
												onClick={async () => {
													if (onRun) onRun(codeText, language || "");
													await handleRun();
												}}
											>
												{isRunning ? (
													<Spinner className="h-4 w-4" />
												) : (
													<Play className="h-4 w-4" />
												)}
												<span className="sr-only">Run code</span>
											</Button>
										</TooltipTrigger>
										<TooltipContent side="bottom">Run code</TooltipContent>
									</Tooltip>
								)}
							</TooltipProvider>
						</div>
					</div>
				</CardHeader>
				<CardContent className="p-0 bg-card relative z-10">
					<pre
						ref={preRef}
						className={cn(
							// Keep minimal structural styling; defer colors/background to hljs theme CSS
							"text-sm font-medium overflow-x-auto p-3",
							// Remove any Tailwind prose code background overrides inside <pre>
							"[&_code]:p-0 [&_code]:text-inherit",
							className,
						)}
						{...props}
					/>
				</CardContent>

				{/* Run Result Dialog */}
				<Dialog open={isResultOpen} onOpenChange={setIsResultOpen}>
					<DialogContent className="bg-card text-card-foreground">
						<DialogHeader>
							<DialogTitle>Execution Result</DialogTitle>
						</DialogHeader>
						<div className="mt-2">
							{runError ? (
								<p className="text-destructive text-sm">{runError}</p>
							) : (
								<pre className="max-h-[60vh] overflow-auto rounded bg-muted p-3 text-sm">
									{runOutput || ""}
								</pre>
							)}
						</div>
					</DialogContent>
				</Dialog>
			</Card>

			{/* Inline MockPage controlled by visible prop (no dialog overlay) */}
			<MockPage
				visible={isEditOpen}
				title="Code Collaboration"
				description={language ? `Editing ${language} snippet` : undefined}
				actions={
					<Button
						variant="outline"
						size="sm"
						onClick={() => setIsEditOpen(false)}
					>
						Close
					</Button>
				}
				contentPadding={false}
				padded={false}
			>
				<CodeCollab />
			</MockPage>
		</>
	);
};

export default CodeBlock;
