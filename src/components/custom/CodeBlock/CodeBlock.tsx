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
	const [windowWidth, setWindowWidth] = useState(
		typeof window !== "undefined" ? window.innerWidth : 1440,
	);

	useEffect(() => {
		const handleResize = () => setWindowWidth(window.innerWidth);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const getResponsiveSize = (base: number) => {
		if (windowWidth <= 1220) return base * 0.7;
		if (windowWidth >= 1920) return base * 1.1;
		if (windowWidth >= 1440) return base * 0.8;
		return base;
	};

	const getResponsiveFontSize = () => {
		if (windowWidth <= 1220) return "11px";
		if (windowWidth >= 1920) return "14px";
		if (windowWidth >= 1440) return "12px";
		return "14px";
	};

	const getHeaderFontSize = () => {
		if (windowWidth <= 1220) return "12px";
		if (windowWidth >= 1920) return "16px";
		if (windowWidth >= 1440) return "13px";
		return "14px";
	};

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
			<Card
				className="overflow-hidden isolate z-10 mix-blend-normal border border-slate-200 bg-white shadow-lg"
				style={{
					minWidth: `${getResponsiveSize(360)}px`,
				}}
			>
				<CardHeader
					className="bg-slate-50 border-b border-slate-200"
					style={{
						padding: `${getResponsiveSize(8)}px ${getResponsiveSize(12)}px`,
					}}
				>
					<div
						className="flex items-center justify-between relative z-10"
						style={{
							gap: `${getResponsiveSize(8)}px`,
						}}
					>
						<CardTitle
							className="font-semibold uppercase tracking-wide text-slate-600"
							style={{
								fontSize: getResponsiveFontSize(),
							}}
						>
							{fetchedCodeBlock?.language || language || "Code"}
							{isLoadingCodeBlock && " (loading...)"}
						</CardTitle>
						<div
							className="flex items-center"
							style={{
								gap: `${getResponsiveSize(8)}px`,
							}}
						>
							<TooltipProvider delayDuration={200}>
								{showEditButton && (
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												variant="outline"
												size="sm"
												className="p-0 grid place-items-center"
												style={{
													width: `${getResponsiveSize(28)}px`,
													height: `${getResponsiveSize(28)}px`,
												}}
												aria-label="Edit code"
												onClick={handleEditClick}
												disabled={!codeBlockId || !channelId || !groupId}
											>
												<Pencil
													style={{
														width: `${getResponsiveSize(16)}px`,
														height: `${getResponsiveSize(16)}px`,
													}}
												/>
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
												className="p-0 grid place-items-center"
												style={{
													width: `${getResponsiveSize(28)}px`,
													height: `${getResponsiveSize(28)}px`,
												}}
												aria-label="Run code"
												disabled={isRunning || !codeText.trim()}
												onClick={async () => {
													if (onRun) onRun(codeText, language || "");
													await handleRun();
												}}
											>
												{isRunning ? (
													<Spinner
														style={{
															width: `${getResponsiveSize(16)}px`,
															height: `${getResponsiveSize(16)}px`,
														}}
													/>
												) : (
													<Play
														style={{
															width: `${getResponsiveSize(16)}px`,
															height: `${getResponsiveSize(16)}px`,
														}}
													/>
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
							"font-medium overflow-x-auto bg-white text-slate-900",
							"[&_code]:p-0 [&_code]:text-inherit",
							className,
						)}
						style={{
							fontSize: getResponsiveFontSize(),
							padding: `${getResponsiveSize(12)}px`,
						}}
						{...props}
					/>
				</CardContent>

				<Dialog open={isResultOpen} onOpenChange={setIsResultOpen}>
					<DialogContent
						className="w-full overflow-hidden border border-slate-200 bg-white text-slate-900"
						style={{
							maxWidth: `min(95vw, ${getResponsiveSize(720)}px)`,
							padding: 0,
						}}
					>
						<DialogHeader
							className="border-b border-slate-200 bg-slate-50"
							style={{
								padding: `${getResponsiveSize(12)}px ${getResponsiveSize(16)}px`,
							}}
						>
							<DialogTitle
								className="font-semibold tracking-tight text-slate-900"
								style={{
									fontSize: getHeaderFontSize(),
								}}
							>
								Execution Result
							</DialogTitle>
							<div
								style={{
									fontSize: getResponsiveFontSize(),
								}}
								className="text-slate-500"
							>
								{language ? `${language} • ` : ""}
								{lastRunAt || "Just now"}
							</div>
						</DialogHeader>
						<div
							className="space-y-3 max-h-[70vh] overflow-y-auto bg-white"
							style={{
								padding: `${getResponsiveSize(16)}px`,
								gap: `${getResponsiveSize(12)}px`,
							}}
						>
							{runError ? (
								<div
									className="rounded-lg border border-red-200 bg-red-50 text-red-700 whitespace-pre-wrap break-words"
									style={{
										fontSize: getResponsiveFontSize(),
										padding: `${getResponsiveSize(12)}px`,
									}}
								>
									{runError}
								</div>
							) : (
								<pre
									className="rounded-lg border border-slate-200 bg-slate-50 text-slate-900 whitespace-pre-wrap break-words max-h-[55vh] overflow-auto"
									style={{
										fontSize: getResponsiveFontSize(),
										padding: `${getResponsiveSize(12)}px`,
									}}
								>
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
						style={{
							fontSize: getResponsiveFontSize(),
							padding: `${getResponsiveSize(8)}px ${getResponsiveSize(16)}px`,
						}}
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
							<p
								className="text-muted-foreground"
								style={{
									fontSize: getResponsiveFontSize(),
								}}
							>
								Required information not available
							</p>
							<p
								className="text-muted-foreground"
								style={{
									fontSize: getResponsiveFontSize(),
									marginTop: `${getResponsiveSize(4)}px`,
								}}
							>
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
