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
import { Spinner } from "@/components/ui/spinner";
import CodeRunResultDialog from "@/components/custom/CodeRunResultDialog";
import useCodeRunner from "@/hooks/useCodeRunner";
import { useNavigate } from "@tanstack/react-router";
import {
	buildCodeBlockSubtitleFromBlock,
	buildCodeBlockTitle,
} from "@/utils/codeCollabHelpers";
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
	const [isResultOpen, setIsResultOpen] = useState<boolean>(false);
	const { isRunning, runOutput, runError, lastRunAt, runSnippet } =
		useCodeRunner();
	const navigate = useNavigate();

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

	const handleRun = async () => {
		if (!codeText?.trim()) return;
		await runSnippet({ code: codeText, language });
		setIsResultOpen(true);
	};

	const handleEditClick = () => {
		if (!codeBlockId || !channelId || !groupId) {
			console.warn("⚠️ Missing required params for edit");
			return;
		}

		onEdit?.(codeText, language || "");
		const title = buildCodeBlockTitle(fetchedCodeBlock?.language || language);
		const subtitle = buildCodeBlockSubtitleFromBlock(fetchedCodeBlock);

		navigate({
			to: "/chat/collab/$codeBlockId",
			params: { codeBlockId },
			search: {
				mode: "channel",
				groupId,
				channelId,
				title,
				subtitle,
			},
		});
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

				<CodeRunResultDialog
					open={isResultOpen}
					onOpenChange={setIsResultOpen}
					language={language}
					lastRunAt={lastRunAt}
					output={runOutput}
					error={runError}
				/>
			</Card>
		</>
	);
};

export default CodeBlock;
