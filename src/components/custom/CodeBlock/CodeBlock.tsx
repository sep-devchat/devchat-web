import { ClassAttributes, HTMLAttributes, useEffect, useRef } from "react";
import hljs from "highlight.js";
import { cn } from "@/lib/utils";
// import 'highlight.js/styles/github.css';

export interface CodeBlockProps
	extends HTMLAttributes<HTMLPreElement>,
		ClassAttributes<HTMLPreElement> {}

const CodeBlock = ({ className, ...props }: CodeBlockProps) => {
	const preRef = useRef<HTMLPreElement>(null);

	useEffect(() => {
		const codeEl = preRef.current?.querySelector("code");
		if (codeEl) {
			try {
				hljs.highlightElement(codeEl as HTMLElement);
			} catch (e) {
				// silent fail; highlighting is non-critical
			}
		}
	}, [props.children]);

	return (
		<pre
			ref={preRef}
			className={cn(
				// Keep minimal structural styling; defer colors/background to hljs theme CSS
				"rounded-md text-sm font-medium overflow-x-auto",
				// Remove any Tailwind prose code background overrides inside <pre>
				"[&_code]:bg-transparent [&_code]:p-0 [&_code]:text-inherit",
				className,
			)}
			{...props}
		/>
	);
};

export default CodeBlock;
