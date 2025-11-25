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
import {
	CodeBlock as CodeBlockData,
	getCodeBlockById,
} from "@/services/codeCollabAPI";

export interface CodeBlockProps
	extends HTMLAttributes<HTMLPreElement>,
		ClassAttributes<HTMLPreElement> {
	onEdit?: (code: string, language: string) => void;
	onRun?: (code: string, language: string) => void;
	showEditButton?: boolean;
	showRunButton?: boolean;
	codeBlockId?: string;
	channelId?: string;
	groupId?: string;
}

const CodeBlock = ({
	className,
	onEdit,
	onRun,
	showEditButton = true,
	showRunButton = true,
	codeBlockId,
	channelId,
	groupId,
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
	const [lastRunAt, setLastRunAt] = useState<string>("");

	const [fetchedCodeBlock, setFetchedCodeBlock] =
		useState<CodeBlockData | null>(null);
	const [isLoadingCodeBlock, setIsLoadingCodeBlock] = useState(false);

	useEffect(() => {
		if (codeBlockId && channelId && groupId) {
			setIsLoadingCodeBlock(true);

			getCodeBlockById(codeBlockId, channelId, groupId)
				.then((response) => {
					if (response?.data) {
						setFetchedCodeBlock(response.data);
					} else {
						console.warn("⚠️ No data in response (possibly 304 cached)");
					}
				})
				.catch((error) => {
					console.error("❌ Failed to fetch code block:", error);
					setFetchedCodeBlock(null);
				})
				.finally(() => {
					setIsLoadingCodeBlock(false);
				});
		}
	}, [codeBlockId, channelId, groupId]);

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
			} catch {}

			const cls = codeEl.getAttribute("class") || "";
			const m = cls.match(/(?:language|lang)-([a-zA-Z0-9_+-]+)/);
			const dataLang = codeEl.getAttribute("data-language") || "";
			const rawLang = (m && m[1]) || dataLang || "";
			setLanguage(normalizeLang(rawLang));

			const extractedCode = codeEl.textContent || "";
			setCodeText(extractedCode);
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
			setLastRunAt(new Date().toLocaleString());
			return;
		}
		if (!codeText?.trim()) return;
		setIsRunning(true);
		setRunError("");
		try {
			const res = await runCode({ code: codeText, language: enumLang });
			setRunOutput(res.data.output ?? "");
			setIsResultOpen(true);
			setLastRunAt(new Date().toLocaleString());
		} catch (e) {
			setRunError("Error running code");
			setRunOutput("");
			setIsResultOpen(true);
			setLastRunAt(new Date().toLocaleString());
		} finally {
			setIsRunning(false);
		}
	};

	const handleEditClick = () => {
		if (!codeBlockId || !channelId || !groupId) {
			console.warn("⚠️ Missing required params for edit");
			return;
		}

		onEdit?.(codeText, language || "");
		setIsEditOpen(true);
	};

	return (
		<>
			<Card className="min-w-[360px] overflow-hidden isolate z-10 mix-blend-normal border border-slate-200 bg-white shadow-lg">
				<CardHeader className="py-2 px-3 bg-slate-50 border-b border-slate-200">
					<div className="flex items-center justify-between gap-2 relative z-10">
						<CardTitle className="text-xs font-semibold uppercase tracking-wide text-slate-600">
							{fetchedCodeBlock?.language || language || "Code"}
							{isLoadingCodeBlock && " (loading...)"}
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
												onClick={handleEditClick}
												disabled={!codeBlockId || !channelId || !groupId}
											>
												<Pencil className="h-4 w-4" />
												<span className="sr-only">Edit code</span>
											</Button>
										</TooltipTrigger>
										<TooltipContent side="bottom">
											{codeBlockId && channelId && groupId
												? "Collaborate on code"
												: "Code block info not available"}
										</TooltipContent>
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
				<CardContent className="p-0 bg-slate-50 relative z-10">
					<pre
						ref={preRef}
						className={cn(
							"text-sm font-medium overflow-x-auto p-3 bg-white text-slate-900",
							"[&_code]:p-0 [&_code]:text-inherit",
							className,
						)}
						{...props}
					/>
				</CardContent>

				<Dialog open={isResultOpen} onOpenChange={setIsResultOpen}>
					<DialogContent className="w-full max-w-[min(95vw,720px)] p-0 overflow-hidden border border-slate-200 bg-white text-slate-900">
						<DialogHeader className="px-4 py-3 border-b border-slate-200 bg-slate-50">
							<DialogTitle className="text-base font-semibold tracking-tight text-slate-900">
								Execution Result
							</DialogTitle>
							<div className="text-xs text-slate-500">
								{language ? `${language} • ` : ""}
								{lastRunAt || "Just now"}
							</div>
						</DialogHeader>
						<div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto bg-white">
							{runError ? (
								<div className="rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm p-3 whitespace-pre-wrap break-words">
									{runError}
								</div>
							) : (
								<pre className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs sm:text-sm text-slate-900 whitespace-pre-wrap break-words max-h-[55vh] overflow-auto">
									{runOutput || ""}
								</pre>
							)}
						</div>
					</DialogContent>
				</Dialog>
			</Card>

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
				{codeBlockId && channelId && groupId ? (
					<CodeCollab
						key={isEditOpen ? "open" : "closed"}
						codeBlockId={codeBlockId}
						channelId={channelId}
						groupId={groupId}
					/>
				) : (
					<div className="flex items-center justify-center h-full">
						<div className="text-center">
							<p className="text-sm text-muted-foreground">
								Required information not available
							</p>
							<p className="text-xs text-muted-foreground mt-1">
								Missing: {!codeBlockId && "codeBlockId"}
								{!channelId && " channelId"}
								{!groupId && " groupId"}
							</p>
						</div>
					</div>
				)}
			</MockPage>
		</>
	);
};

export default CodeBlock;
