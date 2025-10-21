import React, { forwardRef, useImperativeHandle, useRef } from "react";
// import { markdownToHtml } from "./utils/markdown";

export type EditorHandle = {
	getHtml: () => string;
	setHtml: (html: string) => void;
	focus: () => void;
};

type Props = {
	placeholder?: string;
	onInput?: (e: React.FormEvent<HTMLDivElement>) => void;
	onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
	onPaste?: (e: React.ClipboardEvent<HTMLDivElement>) => void;
	className?: string;
	style?: React.CSSProperties;
};

const Editor = forwardRef<EditorHandle, Props>(
	({ placeholder, onInput, onKeyDown, onPaste, className, style }, ref) => {
		const editableRef = useRef<HTMLDivElement | null>(null);

		useImperativeHandle(ref, () => ({
			getHtml: () => editableRef.current?.innerHTML ?? "",
			setHtml: (html: string) => {
				if (editableRef.current) editableRef.current.innerHTML = html;
			},
			focus: () => editableRef.current?.focus(),
		}));

		return (
			<div style={{ position: "relative", width: "100%" }}>
				<div
					ref={editableRef}
					contentEditable
					suppressContentEditableWarning
					onInput={onInput}
					onKeyDown={onKeyDown}
					onPaste={onPaste}
					className={className}
					style={{
						minHeight: 24,
						borderRadius: 8,
						outline: "none",
						background: "#fff",
						border: "1px solid transparent",
						width: "100%",
						wordBreak: "break-word",
						overflowWrap: "break-word",
						whiteSpace: "pre-wrap",
						...style,
					}}
				/>
				{(!editableRef.current ||
					(editableRef.current?.innerText || "").trim().length === 0) &&
					placeholder && (
						<div
							style={{
								position: "absolute",
								left: 3,
								top: 3,
								pointerEvents: "none",
								color: "#9ca3af",
								fontSize: 14,
								userSelect: "none",
							}}
						>
							{placeholder}
						</div>
					)}
			</div>
		);
	},
);

export default Editor;
