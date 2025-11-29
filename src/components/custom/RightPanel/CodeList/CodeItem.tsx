/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useTheme } from "styled-components";
import { Code2, Play } from "lucide-react";
import {
	CPCodeItem,
	CPCodeItemHeader,
	CPCodeItemInfo,
	CPCodeItemTitle,
	CPRunButton,
	CPCodeEditorWrapper,
} from "./CodeList.styled";

// Prism SyntaxHighlighter
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { prism as prismLight } from "react-syntax-highlighter/dist/esm/styles/prism";

/**
 * Map extension => prism language name
 */
const extToPrismLang: Record<string, string> = {
	js: "javascript",
	jsx: "jsx",
	ts: "typescript",
	tsx: "tsx",
	c: "c",
	cpp: "cpp",
	h: "c",
	java: "java",
	py: "python",
	rb: "ruby",
	php: "php",
	css: "css",
	scss: "scss",
	html: "html",
	json: "json",
	sh: "bash",
	bash: "bash",
	txt: "text",
	md: "markdown",
	vue: "vue",
};

const getLanguageFromFile = (fileName: string): string => {
	const parts = fileName.split(".");
	if (parts.length <= 1) return "text";
	const ext = parts[parts.length - 1].toLowerCase();
	return extToPrismLang[ext] ?? ext;
};

const useResponsiveSize = () => {
	const [sizes, setSizes] = React.useState({
		iconSize: 18,
		fontSize: 14,
		padding: "16px",
		borderRadius: "0 0 8px 8px",
	});

	React.useEffect(() => {
		const updateSizes = () => {
			const width = window.innerWidth;

			if (width < 1220) {
				setSizes({
					iconSize: 12.6,
					fontSize: 11,
					padding: "11.2px",
					borderRadius: "0 0 5.6px 5.6px",
				});
			} else if (width >= 1440 && width < 1920) {
				setSizes({
					iconSize: 14.4,
					fontSize: 12,
					padding: "12.8px",
					borderRadius: "0 0 6.4px 6.4px",
				});
			} else if (width >= 1920) {
				setSizes({
					iconSize: 19.8,
					fontSize: 14,
					padding: "17.6px",
					borderRadius: "0 0 8.8px 8.8px",
				});
			} else {
				setSizes({
					iconSize: 18,
					fontSize: 14,
					padding: "16px",
					borderRadius: "0 0 8px 8px",
				});
			}
		};

		updateSizes();
		window.addEventListener("resize", updateSizes);
		return () => window.removeEventListener("resize", updateSizes);
	}, []);

	return sizes;
};

interface CodeItemProps {
	fileName: string;
	code: string;
	onRun: () => void;
}

const CodeItem: React.FC<CodeItemProps> = ({ fileName, code, onRun }) => {
	const language = getLanguageFromFile(fileName);
	const sizes = useResponsiveSize();

	// Lấy theme từ styled-components (có thể là object có field 'mode' hoặc boolean)
	const theme: any = useTheme();

	// Quy ước: theme.mode === 'dark' hoặc theme.isDark === true
	const isDark =
		(theme && (theme.mode === "dark" || theme.isDark === true)) ?? false;

	const selectedStyle = isDark ? atomDark : prismLight;
	const background = isDark ? "#0f172a" : "#f4f4f5";
	const textColor = isDark ? "#e2e8f0" : "#0f172a";

	// Cast để tránh lỗi types của lib (UI only)
	const PrismSH: any = SyntaxHighlighter;

	return (
		<CPCodeItem $isDark={isDark}>
			<CPCodeItemHeader $isDark={isDark}>
				<CPCodeItemInfo>
					<Code2 size={sizes.iconSize} />
					<CPCodeItemTitle $isDark={isDark}>{fileName}</CPCodeItemTitle>
				</CPCodeItemInfo>

				<CPRunButton onClick={onRun} title="Run">
					<Play size={sizes.iconSize} />
				</CPRunButton>
			</CPCodeItemHeader>

			<CPCodeEditorWrapper $isDark={isDark}>
				<PrismSH
					language={language}
					style={selectedStyle}
					customStyle={{
						background,
						border: "none",
						padding: sizes.padding,
						margin: 0,
						borderRadius: sizes.borderRadius,
						fontSize: sizes.fontSize,
						color: textColor,
						overflowY: "auto",
						height: "100%",
					}}
					showLineNumbers
				>
					{code}
				</PrismSH>
			</CPCodeEditorWrapper>
		</CPCodeItem>
	);
};

export default CodeItem;
