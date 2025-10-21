/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
	Composer,
	IconButton,
	Input,
	InputContainer,
} from "./ChatInput.styled"; // adjust path
import { Plus, Send, Smile, CornerUpLeft } from "lucide-react";
import Editor, { EditorHandle } from "../ChatInputComponent/Editor/Editor";
import {
	ChatInputProps,
	InboxType,
} from "../ChatInputComponent/ChatTypeModal/InboxType";
import {
	directUploadWithSignature,
	getUploadSignature,
} from "@/services/upload/upload.api";
import { markdownToHtml } from "../ChatInputComponent/Markdown/Markdown";
import ReplyPreview from "../ChatInputComponent/ReplyPreview/ReplyPreview";
import ChatTypeDropdown from "../ChatInputComponent/ChatTypeModal/ChatTypeModal";
import Toolbar, {
	ToolbarAction,
} from "../ChatInputComponent/MarkdownToolbar/Toolbar";
import EmojiPicker from "../ChatInputComponent/EmojiPicker/EmojiPicker";
import FilePreview from "../ChatInputComponent/FilePreview/FilePreview";

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
			const typedMd = (mdText || "").trim();
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
		[disabled, files, inboxType, onSend, mdText],
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

	const insertBlock = (blockText: string) => {
		const container = document.querySelector(
			"[contenteditable]",
		) as HTMLElement | null;
		if (!container) return;
		container.focus();
		const sel = window.getSelection();
		if (!sel || sel.rangeCount === 0) return;
		const range = sel.getRangeAt(0);
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
			// Keep raw markdown text, and also render HTML preview
			const text = el.innerText || "";
			setMdText(text);
			const converted = markdownToHtml(text);
			if (converted !== el.innerHTML) {
				// Replace content and place caret at end (simple, reliable)
				el.innerHTML = converted;
				// place caret at end
				const range = document.createRange();
				range.selectNodeContents(el);
				range.collapse(false);
				const sel = window.getSelection();
				sel?.removeAllRanges();
				sel?.addRange(range);
			}
			setHtml(el.innerHTML);
		},
		[],
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
			if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
				e.preventDefault();
				onToolbarAction("bold");
			}
			if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "i") {
				e.preventDefault();
				onToolbarAction("italic");
			}
		},
		[handleSubmit],
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
								borderRadius: 8,
								position: "relative",
							}
						: { position: "relative" }
				}
			>
				<ChatTypeDropdown
					trigger={
						<IconButton type="button" title="Attach">
							<Plus size={20} />
						</IconButton>
					}
					onChoose={handleChatTypeChoose}
				/>

				<Input
					ref={fileInputRef}
					style={{ display: "none" }}
					type="file"
					onChange={handleFileInputChange}
					multiple
					accept={inboxType === "image" ? "image/*" : undefined}
				/>

				{/* Group: uploaded images + chat input, stacked in a column */}
				<div
					className="flex flex-col gap-2 w-full"
					style={{ position: "relative", minWidth: 0, flex: 1 }}
				>
					{/* Staged file previews (above editor) */}
					{files.length > 0 && (
						<FilePreview
							files={files}
							imagePreviews={imagePreviews}
							onRemove={handleRemoveFile}
						/>
					)}

					{/* Editor */}
					<Editor
						ref={editorRef}
						placeholder={placeholder}
						onInput={handleEditorInput}
						onKeyDown={handleEditorKeyDown}
						onPaste={handleEditorPaste}
					/>

					<Toolbar
						visible={toolbarVisible}
						pos={toolbarPos}
						onAction={onToolbarAction}
					/>
				</div>

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

				<IconButton
					type="submit"
					disabled={
						disabled ||
						(inboxType === "image" || inboxType === "file"
							? files.length === 0 && mdText.trim().length === 0
							: mdText.trim().length === 0)
					}
					title={editingMode ? "Update message" : "Send message"}
					style={{ marginLeft: 8 }}
				>
					<Send size={20} />
				</IconButton>

				{/* Note: FilePreview is rendered above the editor when files are staged */}
			</InputContainer>
		</Composer>
	);
}
