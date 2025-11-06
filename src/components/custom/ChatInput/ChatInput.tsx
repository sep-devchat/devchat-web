/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
	Composer,
	IconButton,
	Input,
	InputContainer,
} from "./ChatInput.styled"; // adjust path
import { Plus, Send, Smile, CornerUpLeft, Code2 } from "lucide-react";
import Editor, { EditorHandle } from "../ChatInputComponent/Editor/Editor";
import {
	ChatInputProps,
	InboxType,
} from "../ChatInputComponent/ChatTypeModal/InboxType";
import {
	directUploadWithSignature,
	getUploadSignature,
} from "@/services/upload/upload.api";
import ReplyPreview from "../ChatInputComponent/ReplyPreview/ReplyPreview";
import ChatTypeDropdown from "../ChatInputComponent/ChatTypeModal/ChatTypeModal";
import Toolbar, {
	ToolbarAction,
} from "../ChatInputComponent/MarkdownToolbar/Toolbar";
import EmojiPicker from "../ChatInputComponent/EmojiPicker/EmojiPicker";
import FilePreview from "../ChatInputComponent/FilePreview/FilePreview";
import CodeEditor from "../CodeEditor";

export default function ChatInput({
	setInboxTypeSelected,
	inboxType: propInboxType = null,
	placeholder = "Write a message",
	onSend,
	disabled = false,
	initialFiles,
	onInitialFilesHandled,
	editingMessage = null,
	onCancelEdit,
	replyTo = null,
	onCancelReply,
	editingMode = false,
}: ChatInputProps) {
	const [, setHtml] = useState("");
	const [mdText, setMdText] = useState("");
	const [files, setFiles] = useState<File[]>([]);
	const [imagePreviews, setImagePreviews] = useState<string[]>([]);
	const [inboxType, setInboxType] = useState<InboxType>(propInboxType ?? null);

	const editorRef = useRef<EditorHandle | null>(null);
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const [toolbarVisible, setToolbarVisible] = useState(false);
	const [toolbarPos, setToolbarPos] = useState({ top: 0, left: 0 });
	const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);

	// Preserve caret/selection when opening code editor
	const savedRangeRef = useRef<Range | null>(null);

	// --- Code editor integration ---
	const [showCodeEditor, setShowCodeEditor] = useState(false);
	const [codeValue, setCodeValue] = useState("");
	const [codeLang, setCodeLang] = useState<string>("javascript");
	const codeLangRef = useRef<string>("javascript");
	useEffect(() => {
		codeLangRef.current = codeLang;
	}, [codeLang]);

	const textToHtml = useCallback((text: string) => {
		return text
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/\n/g, "<br/>");
	}, []);

	const buildCodeFence = useCallback((lang: string, code: string) => {
		const langId = lang ? lang : "";
		return "```" + langId + "\n" + code.replace(/\r?\n/g, "\n") + "\n```";
	}, []);

	useEffect(() => setInboxType(propInboxType ?? null), [propInboxType]);
	useEffect(
		() => setInboxTypeSelected?.(inboxType),
		[inboxType, setInboxTypeSelected],
	);

	useEffect(() => {
		const revs = files.map((f) =>
			f.type.startsWith("image/") ? URL.createObjectURL(f) : "",
		);
		setImagePreviews(revs);
		return () => revs.forEach((r) => r && URL.revokeObjectURL(r));
	}, [files]);

	useEffect(() => {
		if (initialFiles && initialFiles.length > 0) {
			setFiles((prev) => [...prev, ...initialFiles]);
			const hasImage = initialFiles.some((f) => f.type.startsWith("image/"));
			setInboxType(hasImage ? "image" : "file");
			onInitialFilesHandled?.();
		}
	}, [initialFiles?.length]);

	useEffect(() => {
		if (editingMessage) {
			const md = editingMessage.content ?? "";
			const htmlFromMd = md
				.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
				.replace(/\*(.+?)\*/g, "<em>$1</em>")
				.replace(/~~(.+?)~~/g, "<s>$1</s>")
				.replace(/\+\+(.+?)\+\+/g, "<u>$1</u>")
				.replace(/\n/g, "<br/>");
			setHtml(htmlFromMd);
			setMdText(md);
			editorRef.current?.setHtml(htmlFromMd);
			editorRef.current?.focus();
			setInboxType("normal");
		}
	}, [editingMessage]);

	useEffect(() => {
		if (replyTo) {
			setInboxType("normal");
			editorRef.current?.focus();
		}
	}, [replyTo]);

	const handleAddFiles = useCallback((selected: FileList | null) => {
		if (!selected) return;
		const arr = Array.from(selected);
		setFiles((prev) => {
			const next = [...prev, ...arr];
			return next;
		});
		const hasImage = Array.from(selected).some((f) =>
			f.type.startsWith("image/"),
		);
		setInboxType(hasImage ? "image" : "file");
	}, []);

	const handleRemoveFile = useCallback((index: number) => {
		setFiles((prev) => {
			const next = prev.filter((_, i) => i !== index);
			if (next.length === 0) setInboxType("normal");
			else
				setInboxType(
					next.some((f) => f.type.startsWith("image/")) ? "image" : "file",
				);
			return next;
		});
	}, []);

	async function uploadFileAndGetUrl(file: File): Promise<string | null> {
		try {
			const suggestedPublicId = `${file.name.replace(/\s+/g, "_")}_${Date.now()}`;
			const sig = await getUploadSignature({
				folder: "chat/uploads",
				publicId: suggestedPublicId,
			});
			const { upload: uploadRes, delivery } = await directUploadWithSignature({
				file,
				signature: sig,
				onProgress: () => {},
				generateDelivery: false,
			});
			return uploadRes?.secure_url ?? delivery?.url ?? null;
		} catch (err) {
			console.error("Upload failed", err);
			return null;
		}
	}

	const handleSubmit = useCallback(
		async (e?: React.FormEvent) => {
			e?.preventDefault();
			if (disabled) return;

			// Capture current typed markdown content first
			let typedMd = (mdText || "").trim();
			// If code editor is open and has content, append as fenced block
			if (showCodeEditor && codeValue.trim().length > 0) {
				const block = buildCodeFence(codeLangRef.current, codeValue);
				typedMd = [typedMd, block].filter(Boolean).join("\n");
				setShowCodeEditor(false);
				setCodeValue("");
			}
			// Snapshot current files and inboxType, then immediately clear UI for optimistic UX
			const snapshotFiles = files.slice();
			const snapshotInboxType = inboxType;
			// Clear input and staged files immediately
			setFiles([]);
			setImagePreviews([]);
			setHtml("");
			setMdText("");
			editorRef.current?.setHtml("");
			setInboxType("normal");

			if (
				(snapshotInboxType === "image" || snapshotInboxType === "file") &&
				snapshotFiles.length > 0
			) {
				// Create a clientTempId for preview and final message linkage
				const clientTempId = `temp-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
				// Send a preview payload immediately to show low-opacity message
				await onSend?.({
					type: "preview",
					text: typedMd,
					clientTempId,
					meta: {
						uploadingImages: snapshotFiles.filter((f) =>
							f.type.startsWith("image/"),
						).length,
					},
				});
				const mdParts: string[] = [];
				if (typedMd.length > 0) mdParts.push(typedMd);
				for (const f of snapshotFiles) {
					const url = await uploadFileAndGetUrl(f);
					if (url)
						mdParts.push(
							f.type.startsWith("image/")
								? `![](${url})`
								: `[${f.name}](${url})`,
						);
					else
						mdParts.push(
							f.type.startsWith("image/") ? `![]()` : `[${f.name}]()`,
						);
				}
				const combined = mdParts.join("\n");
				await onSend?.({ type: "text", text: combined, clientTempId });
				return;
			}

			if (typedMd.length === 0) return;
			await onSend?.({ type: "text", text: typedMd });
		},
		[
			disabled,
			files,
			inboxType,
			onSend,
			mdText,
			showCodeEditor,
			codeValue,
			codeLang,
			buildCodeFence,
		],
	);

	// selection/toolbar logic (kept simple)
	useEffect(() => {
		const onSelChange = () => {
			setTimeout(() => {
				const sel = window.getSelection();
				if (!sel || sel.rangeCount === 0) return setToolbarVisible(false);
				const range = sel.getRangeAt(0);
				const selectedText = sel.toString();
				if (!selectedText) return setToolbarVisible(false);
				const container = (editorRef as any).current?.getHtml
					? (document.querySelector("[contenteditable]") as HTMLElement)
					: null;
				if (!container) return setToolbarVisible(false);
				// ensure selection inside container
				let node: Node | null = range.commonAncestorContainer;
				let inside = false;
				while (node) {
					if (node === container) {
						inside = true;
						break;
					}
					node = (node as any).parentNode;
				}
				if (!inside) return setToolbarVisible(false);
				const rect = range.getBoundingClientRect();
				const containerRect = container.getBoundingClientRect();
				const top = rect.top - containerRect.top - 40;
				let left = rect.left - containerRect.left + rect.width / 2;
				left = Math.max(8, Math.min(left, containerRect.width - 8));
				setToolbarPos({ top, left });
				setToolbarVisible(true);
			}, 0);
		};
		document.addEventListener("selectionchange", onSelChange);
		return () => document.removeEventListener("selectionchange", onSelChange);
	}, []);

	// Markdown insertion helpers operating on current selection inside contenteditable
	const wrapSelection = (prefix: string, suffix = prefix) => {
		const sel = window.getSelection();
		const container = document.querySelector(
			"[contenteditable]",
		) as HTMLElement | null;
		if (!container) return;
		container.focus();
		if (!sel || sel.rangeCount === 0) return;
		const range = sel.getRangeAt(0);
		const text = sel.toString() || "";
		const replacement = document.createTextNode(`${prefix}${text}${suffix}`);
		range.deleteContents();
		range.insertNode(replacement);
		range.setStartAfter(replacement);
		range.collapse(true);
		sel.removeAllRanges();
		sel.addRange(range);
		container.dispatchEvent(new Event("input", { bubbles: true }));
		setHtml(editorRef.current?.getHtml?.() ?? container.innerHTML);
	};

	const insertBlock = (blockText: string, atRange?: Range | null) => {
		const container = document.querySelector(
			"[contenteditable]",
		) as HTMLElement | null;
		if (!container) return;
		container.focus();
		const sel = window.getSelection();
		if (!sel) return;
		let range: Range;
		if (atRange) {
			// Use provided range
			sel.removeAllRanges();
			sel.addRange(atRange);
			range = atRange.cloneRange();
		} else {
			if (sel.rangeCount === 0) return;
			range = sel.getRangeAt(0);
		}
		range.collapse(false);
		const node = document.createTextNode(blockText);
		range.insertNode(node);
		range.setStartAfter(node);
		range.collapse(true);
		sel.removeAllRanges();
		sel.addRange(range);
		container.dispatchEvent(new Event("input", { bubbles: true }));
		setHtml(editorRef.current?.getHtml?.() ?? container.innerHTML);
	};

	const onToolbarAction = (action: ToolbarAction) => {
		switch (action) {
			case "bold":
				wrapSelection("**");
				break;
			case "italic":
				wrapSelection("*");
				break;
			case "underline":
				wrapSelection("++");
				break;
			case "strike":
				wrapSelection("~~");
				break;
			case "code":
				wrapSelection("`");
				break;
			case "codeblock":
				insertBlock("\n```\n\n```\n");
				break;
			case "h1":
				insertBlock("\n# ");
				break;
			case "h2":
				insertBlock("\n## ");
				break;
			case "ul":
				insertBlock("\n- ");
				break;
			case "ol":
				insertBlock("\n1. ");
				break;
			case "quote":
				insertBlock("\n> ");
				break;
			case "link": {
				const url = prompt("Enter URL");
				if (!url) return;
				const text = window.getSelection()?.toString() || "link";
				insertBlock(`[${text}](${url})`);
				break;
			}
			case "image": {
				const url = prompt("Enter image URL");
				if (!url) return;
				insertBlock(`\n![](${url})\n`);
				break;
			}
		}
		setTimeout(() => setToolbarVisible(false), 80);
	};

	const insertTextAtCaret = (text: string) => {
		const sel = window.getSelection();
		const container = document.querySelector(
			"[contenteditable]",
		) as HTMLElement | null;
		if (!container) return;
		container.focus();
		if (!sel || sel.rangeCount === 0) {
			container.innerText = (container.innerText || "") + text;
			container.dispatchEvent(new Event("input", { bubbles: true }));
			return;
		}
		const range = sel.getRangeAt(0);
		range.deleteContents();
		const node = document.createTextNode(text);
		range.insertNode(node);
		range.setStartAfter(node);
		range.collapse(true);
		sel.removeAllRanges();
		sel.addRange(range);
		container.dispatchEvent(new Event("input", { bubbles: true }));
	};

	// ===== Handlers moved out of JSX =====
	const handleChatTypeChoose = useCallback(
		(type: InboxType | null, chosenFiles?: File[]) => {
			setInboxType(type || "normal");
			if (chosenFiles && chosenFiles.length) {
				setFiles((p) => [...p, ...chosenFiles]);
				setInboxType(
					chosenFiles.some((f) => f.type.startsWith("image/"))
						? "image"
						: "file",
				);
			}
			setTimeout(() => editorRef.current?.focus(), 50);
		},
		[],
	);

	const handleFileInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			handleAddFiles(e.target.files);
		},
		[handleAddFiles],
	);

	const handleEditorInput = useCallback(
		(ev: React.FormEvent<HTMLDivElement>) => {
			const el = ev.currentTarget as HTMLDivElement;
			// Keep the original user input as-is (raw markdown/plain text)
			const text = el.innerText || "";
			if (!showCodeEditor && text.endsWith("```")) {
				const trimmed = text.slice(0, -3);
				setMdText(trimmed);
				editorRef.current?.setHtml(textToHtml(trimmed));
				setShowCodeEditor(true);
				setCodeValue("");
				return;
			}
			setMdText(text);
		},
		[showCodeEditor, textToHtml],
	);

	const handleEditorKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			const isComposing = (e as any).nativeEvent?.isComposing;
			if (!isComposing && e.key === "Enter") {
				if (!e.shiftKey) {
					e.preventDefault();
					void handleSubmit();
					return;
				}
			}
			// Open code editor: Ctrl/Cmd + Shift + C
			if (
				(e.ctrlKey || e.metaKey) &&
				e.shiftKey &&
				e.key.toLowerCase() === "c"
			) {
				e.preventDefault();
				// Save selection range inside editor to insert code back later
				const sel = window.getSelection();
				const container = document.querySelector(
					"[contenteditable]",
				) as HTMLElement | null;
				if (sel && sel.rangeCount > 0 && container) {
					const r = sel.getRangeAt(0);
					if (container.contains(r.commonAncestorContainer)) {
						savedRangeRef.current = r.cloneRange();
						setCodeValue(sel.toString() || "");
						setShowCodeEditor(true);
						return;
					}
				}
				// Fallback: just open empty editor
				setCodeValue("");
				setShowCodeEditor(true);
			}
			if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
				e.preventDefault();
				onToolbarAction("bold");
			}
			if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "i") {
				e.preventDefault();
				onToolbarAction("italic");
			}
		},
		[handleSubmit, onToolbarAction],
	);

	const handleEditorPaste = useCallback(
		async (e: React.ClipboardEvent<HTMLDivElement>) => {
			const items = Array.from(e.clipboardData?.items || []);
			const imageItems = items.filter((it) => it.type.startsWith("image/"));
			if (imageItems.length === 0) return; // allow normal paste for text
			e.preventDefault();
			const filesFromClipboard: File[] = [];
			for (const it of imageItems) {
				const blob = it.getAsFile();
				if (!blob) continue;
				const fileName = `pasted_${Date.now()}.${blob.type.split("/")[1] || "png"}`;
				const file = new File([blob], fileName, { type: blob.type });
				filesFromClipboard.push(file);
			}
			if (filesFromClipboard.length === 0) return;
			// Stage files only; upload will occur on send
			setFiles((prev) => [...prev, ...filesFromClipboard]);
			setInboxType("image");
		},
		[],
	);

	const handleEmojiToggle = useCallback(
		(ev: React.MouseEvent<HTMLButtonElement>) => {
			ev.stopPropagation();
			setEmojiPickerVisible((v) => !v);
		},
		[],
	);

	const handleEmojiPick = useCallback(
		(em: string) => insertTextAtCaret(em),
		[],
	);

	const handleEmojiClose = useCallback(() => setEmojiPickerVisible(false), []);

	const handleOpenCodeEditorClick = useCallback(() => {
		// Grab current selection if inside editor
		const sel = window.getSelection();
		const container = document.querySelector(
			"[contenteditable]",
		) as HTMLElement | null;
		if (sel && sel.rangeCount > 0 && container) {
			const r = sel.getRangeAt(0);
			if (container.contains(r.commonAncestorContainer)) {
				savedRangeRef.current = r.cloneRange();
				setCodeValue(sel.toString() || "");
				setShowCodeEditor(true);
				return;
			}
		}
		setCodeValue("");
		setShowCodeEditor(true);
	}, []);

	const handleCancelEditClick = useCallback(() => {
		onCancelEdit?.();
		setHtml("");
		setMdText("");
		editorRef.current?.setHtml("");
	}, [onCancelEdit]);

	return (
		<Composer onSubmit={handleSubmit}>
			<ReplyPreview replyTo={replyTo} onCancelReply={onCancelReply} />

			<InputContainer
				style={
					editingMode
						? {
								border: "2px solid rgba(59,130,246,0.5)",
								borderRadius: 2,
								position: "relative",
							}
						: { position: "relative" }
				}
			>
				<Input
					ref={fileInputRef}
					style={{ display: "none" }}
					type="file"
					onChange={handleFileInputChange}
					multiple
					accept={inboxType === "image" ? "image/*" : undefined}
				/>

				{/* Input area and Actions: actions pinned at bottom, content grows upward and scrolls */}
				<div
					className="flex w-full flex-col gap-2"
					style={{ minWidth: 0, flex: 1 }}
				>
					{/* Scrollable content area rendered bottom-to-top */}
					<div
						className={`flex max-h-96 ${showCodeEditor ? "flex-col" : "flex-col-reverse"} gap-2 min-h-0`}
						style={{ position: "relative" }}
					>
						{/* Editor (at bottom) */}
						{showCodeEditor ? (
							<div className="w-full rounded-md border border-neutral-300 p-2 dark:border-neutral-700">
								<CodeEditor
									value={codeValue}
									onChange={setCodeValue}
									language={codeLang}
									onLanguageChange={setCodeLang}
									minLines={5}
									maxLines={10}
									onCtrlEnter={() => {
										// Send message with the current code block
										void (async () => {
											await handleSubmit();
											// Return focus to the plain editor after sending
											setTimeout(() => editorRef.current?.focus(), 60);
										})();
									}}
									onClose={() => {
										setShowCodeEditor(false);
										setTimeout(() => editorRef.current?.focus(), 50);
									}}
								/>
							</div>
						) : (
							<Editor
								ref={editorRef}
								placeholder={placeholder}
								onInput={handleEditorInput}
								onKeyDown={handleEditorKeyDown}
								onPaste={handleEditorPaste}
							/>
						)}

						{/* File previews (above editor due to flex-col-reverse) */}
						{files.length > 0 && (
							<FilePreview
								files={files}
								imagePreviews={imagePreviews}
								onRemove={handleRemoveFile}
							/>
						)}

						<Toolbar
							visible={toolbarVisible}
							pos={toolbarPos}
							onAction={onToolbarAction}
						/>
					</div>

					{/* Actions bar at the bottom, wraps on small widths */}
					<div className="flex flex-wrap items-center justify-between gap-2 pt-1">
						<div className="flex flex-wrap items-center gap-2">
							<ChatTypeDropdown
								trigger={
									<IconButton type="button" title="Attach">
										<Plus size={20} />
									</IconButton>
								}
								onChoose={handleChatTypeChoose}
							/>
							<IconButton
								type="button"
								title="Insert code block (Ctrl+Shift+C)"
								onClick={handleOpenCodeEditorClick}
							>
								<Code2 size={20} />
							</IconButton>
							<div style={{ position: "relative" }}>
								<IconButton
									type="button"
									title="Emoji"
									className="emoji-toggle"
									onClick={handleEmojiToggle}
								>
									<Smile size={20} />
								</IconButton>
								<EmojiPicker
									visible={emojiPickerVisible}
									onPick={handleEmojiPick}
									onClose={handleEmojiClose}
								/>
							</div>
							{editingMode && onCancelEdit && (
								<IconButton
									type="button"
									title="Cancel edit"
									onClick={handleCancelEditClick}
								>
									<CornerUpLeft size={18} />
								</IconButton>
							)}
						</div>
						<IconButton
							type="submit"
							disabled={
								disabled ||
								(inboxType === "image" || inboxType === "file"
									? files.length === 0 &&
										mdText.trim().length === 0 &&
										!(showCodeEditor && codeValue.trim().length > 0)
									: mdText.trim().length === 0 &&
										!(showCodeEditor && codeValue.trim().length > 0))
							}
							title={editingMode ? "Update message" : "Send message"}
							style={{ marginLeft: 8 }}
						>
							<Send size={20} />
						</IconButton>
					</div>
				</div>

				{/* Note: FilePreview is rendered above the editor when files are staged */}
			</InputContainer>
		</Composer>
	);
}
