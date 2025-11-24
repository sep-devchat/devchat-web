import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import React, { Suspense, useEffect, useMemo, useState } from "react";
const Markdown = React.lazy(() => import("react-markdown"));
import CodeBlock from "../CodeBlock";
import InlineCode from "../InlineCode";

export interface MarkdownPreviewProps {
	content?: string;
	className?: string;
	codeBlockId?: string;
	channelId?: string;
	groupId?: string;
}

const MarkdownPreview = ({
	content = "",
	className,
	codeBlockId,
	channelId,
	groupId,
}: MarkdownPreviewProps) => {
	const [remarkPlugins, setRemarkPlugins] = useState<any[]>([]);

	const mentionClasses = useMemo(
		() => [
			"mention",
			"bg-blue-300",
			"text-primary",
			"rounded",
			"px-1",
			"py-0.5",
			"font-medium",
			"whitespace-nowrap",
		],
		[],
	);

	const rehypeMentions = useMemo(() => {
		const isElement = (n: any) => n && n.type === "element";
		const isText = (n: any) => n && n.type === "text";

		const makeMentionSpan = (text: string) => ({
			type: "element",
			tagName: "span",
			properties: { className: mentionClasses },
			children: [{ type: "text", value: text }],
		});

		const transformChildren = (parent: any) => {
			if (!parent || !Array.isArray(parent.children)) return;
			const out: any[] = [];
			for (let i = 0; i < parent.children.length; i++) {
				const child = parent.children[i];

				if (
					isElement(parent) &&
					(parent.tagName === "pre" || parent.tagName === "code")
				) {
					out.push(child);
					continue;
				}

				if (isText(child)) {
					const next = parent.children[i + 1];

					if (
						typeof child.value === "string" &&
						child.value.endsWith("@") &&
						isElement(next) &&
						next.tagName === "code"
					) {
						const before = child.value.slice(0, -1);
						if (before) out.push({ type: "text", value: before });
						out.push({
							type: "element",
							tagName: "span",
							properties: { className: mentionClasses },
							children: [{ type: "text", value: "@" }, next],
						});
						i++;
						continue;
					}

					const text: string = child.value ?? "";
					const regex = /(^|\s)@([a-zA-Z0-9_]{1,30})/g;
					let pos = 0;
					let m: RegExpExecArray | null;
					let matched = false;
					while ((m = regex.exec(text)) !== null) {
						matched = true;
						const start = m.index;
						const leading = m[1] ?? "";
						const handle = "@" + m[2];

						if (start > pos)
							out.push({ type: "text", value: text.slice(pos, start) });
						if (leading) out.push({ type: "text", value: leading });
						out.push(makeMentionSpan(handle));

						pos = start + leading.length + handle.length;
					}
					if (matched) {
						if (pos < text.length)
							out.push({ type: "text", value: text.slice(pos) });
					} else {
						out.push(child);
					}
				} else if (isElement(child)) {
					transformChildren(child);
					out.push(child);
				} else {
					out.push(child);
				}
			}
			parent.children = out;
		};

		return function rehypeMentionsPlugin() {
			return (tree: any) => {
				if (!tree || !Array.isArray((tree as any).children)) return;
				transformChildren(tree);
			};
		};
	}, [mentionClasses]);

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const mod = await import("remark-gfm");
				if (mounted) {
					setRemarkPlugins([mod.default]);
				}
			} catch (error) {
				console.warn("Failed to load remark-gfm plugin:", error);
			}
		})();
		return () => {
			mounted = false;
		};
	}, []);

	const extractedId = React.useMemo(() => {
		if (codeBlockId) return codeBlockId;

		const match = content.match(
			/```[\w]*\s*<!--\s*data-code-block-id:\s*([a-f0-9-]+)\s*-->/,
		);
		return match?.[1];
	}, [content, codeBlockId]);

	const preComponent = useMemo(() => {
		return (props: any) => {
			return (
				<CodeBlock
					{...props}
					codeBlockId={extractedId}
					channelId={channelId}
					groupId={groupId}
				/>
			);
		};
	}, [extractedId]);

	return (
		<div
			className={cn(
				"prose prose-neutral dark:prose-invert max-w-none prose-pre:p-0",
				"prose-headings:scroll-m-20",
				"prose-blockquote:border-l-2 prose-blockquote:pl-4 prose-blockquote:not-italic",
				"prose-img:rounded-md",
				"prose-hr:my-4",
				className,
			)}
		>
			<Suspense
				fallback={
					<span className="text-muted-foreground">Loading preview...</span>
				}
			>
				<Markdown
					key={content}
					remarkPlugins={remarkPlugins}
					rehypePlugins={[rehypeMentions]}
					components={{
						h1: ({ children, ...p }) => (
							<h1
								id={children?.toString().toLowerCase()}
								className={cn(
									"group scroll-m-20 text-3xl font-semibold tracking-tight mb-2 mt-2",
									p.className,
								)}
								{...p}
							>
								{children}
							</h1>
						),
						h2: ({ children, ...p }) => (
							<h2
								id={children?.toString().toLowerCase()}
								className={cn(
									"group scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0 mb-2",
									p.className,
								)}
								{...p}
							>
								{children}
							</h2>
						),
						h3: ({ children, ...p }) => (
							<h3
								id={children?.toString().toLowerCase()}
								className={cn(
									"group scroll-m-20 text-xl font-semibold tracking-tight mb-2",
									p.className,
								)}
								{...p}
							>
								{children}
							</h3>
						),
						h4: ({ children, ...p }) => (
							<h4
								id={children?.toString().toLowerCase()}
								className={cn(
									"group scroll-m-20 text-lg font-semibold tracking-tight mb-2",
									p.className,
								)}
								{...p}
							>
								{children}
							</h4>
						),
						h5: ({ children, ...p }) => (
							<h5
								id={children?.toString().toLowerCase()}
								className={cn(
									"group scroll-m-20 text-base font-semibold tracking-tight mb-1",
									p.className,
								)}
								{...p}
							>
								{children}
							</h5>
						),
						p: ({ children, ...p }) => (
							<p
								className={cn(
									"leading-6 [&:not(:first-child)]:mt-3",
									(p as any).className,
								)}
								{...p}
							>
								{children}
							</p>
						),
						span: ({ children, ...p }) => <span {...p}>{children}</span>,
						a: ({ children, ...p }) => (
							<a
								className={cn(
									"font-medium underline underline-offset-4 text-primary hover:text-primary/80",
									p.className,
								)}
								{...p}
							>
								{children}
							</a>
						),
						ul: ({ children, ...p }) => (
							<ul className={cn("ml-5 list-disc", p.className)} {...p}>
								{children}
							</ul>
						),
						ol: ({ children, ...p }) => (
							<ol className={cn("ml-5 list-decimal", p.className)} {...p}>
								{children}
							</ol>
						),
						li: ({ children, ...p }) => (
							<li
								className={cn("marker:text-muted-foreground", p.className)}
								{...p}
							>
								{children}
							</li>
						),
						code: (props) => <InlineCode {...props} />,
						pre: preComponent,
						blockquote: ({ children, ...p }) => (
							<blockquote
								className={cn(
									"border-l-4 pl-4 py-1 my-2 italic bg-muted/30 rounded-r-md text-muted-foreground [&>*:last-child]:mb-0",
									p.className,
								)}
								{...p}
							>
								{children}
							</blockquote>
						),
						table: ({ children, ...p }) => <Table {...p}>{children}</Table>,
						thead: ({ children, ...p }) => (
							<TableHeader {...p}>{children}</TableHeader>
						),
						tbody: ({ children, ...p }) => (
							<TableBody {...p}>{children}</TableBody>
						),
						tfoot: ({ children, ...p }) => (
							<TableFooter {...p}>{children}</TableFooter>
						),
						tr: ({ children, ...p }) => <TableRow {...p}>{children}</TableRow>,
						th: ({ children, ...p }) => (
							<TableHead {...p}>{children}</TableHead>
						),
						td: ({ children, ...p }) => (
							<TableCell {...p}>{children}</TableCell>
						),
						caption: ({ children, ref: _ref, ...p }) => (
							<TableCaption {...p}>{children}</TableCaption>
						),
					}}
				>
					{content}
				</Markdown>
			</Suspense>
		</div>
	);
};

export default MarkdownPreview;
