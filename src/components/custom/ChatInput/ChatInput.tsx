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
import { htmlToMarkdown } from "../ChatInputComponent/Markdown/Markdown";
import ReplyPreview from "../ChatInputComponent/ReplyPreview/ReplyPreview";
import ChatTypeDropdown from "../ChatInputComponent/ChatTypeModal/ChatTypeModal";
import Toolbar from "../ChatInputComponent/MarkdownToolbar/Toolbar";
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
	const [html, setHtml] = useState("");
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

			console.warn(
				"uploadFileAndGetUrl: please replace placeholder with your real upload flow.",
			);
			return null;
		} catch (err) {
			console.error("Upload failed", err);
			return null;
		}
	}

	const handleSubmit = useCallback(
		async (e?: React.FormEvent) => {
			e?.preventDefault();
			if (disabled) return;

			if ((inboxType === "image" || inboxType === "file") && files.length > 0) {
				const mdParts: string[] = [];
				for (const f of files) {
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
				if (combined.trim().length > 0)
					await onSend?.({ type: "text", text: combined });
				else await onSend?.({ type: "files", files });
				setFiles([]);
				setImagePreviews([]);
				setHtml("");
				editorRef.current?.setHtml("");
				setInboxType("normal");
				return;
			}

			const currentHtml = editorRef.current?.getHtml() ?? html;
			const md = htmlToMarkdown(currentHtml || "");
			const trimmed = md.trim();
			if (trimmed.length === 0) return;
			await onSend?.({ type: "text", text: trimmed });

			setHtml("");
			editorRef.current?.setHtml("");
			setInboxType("normal");
		},
		[disabled, files, inboxType, onSend, html],
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

	const execFormat = (cmd: string) => {
		try {
			editorRef.current?.focus?.();
		} catch (e) {
			console.log("Editor focus error:", e);
		}
		// một số browser cần focus thực sự vào element contenteditable
		const container = document.querySelector(
			"[contenteditable]",
		) as HTMLElement | null;
		if (container) container.focus();

		// map cmd nếu cần (strikeThrough spelled properly)
		const actual = cmd === "strikeThrough" ? "strikeThrough" : cmd;
		document.execCommand(actual);
		// cập nhật html state từ editor
		setHtml(editorRef.current?.getHtml?.() ?? container?.innerHTML ?? "");
		// ẩn toolbar nhẹ sau khi format
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
					onChoose={(type, chosenFiles) => {
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
					}}
				/>

				<Input
					ref={fileInputRef}
					style={{ display: "none" }}
					type="file"
					onChange={(e) => handleAddFiles(e.target.files)}
					multiple
					accept={inboxType === "image" ? "image/*" : undefined}
				/>

				{/* Editor */}
				<Editor
					ref={editorRef}
					placeholder={placeholder}
					onInput={(ev) => {
						// convert simple markdown to html as user types
						const el = ev.currentTarget as HTMLDivElement;
						setHtml(el.innerHTML);
						// const text = el.innerText || "";
						// const converted = text ? markdownToHtml(text) : el.innerHTML;
						// if (converted !== el.innerHTML) el.innerHTML = converted;
						// setHtml(el.innerHTML);
					}}
					onKeyDown={(e) => {
						if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
							e.preventDefault();
							execFormat("bold");
						}
						if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "i") {
							e.preventDefault();
							execFormat("italic");
						}
					}}
				/>

				<Toolbar
					visible={toolbarVisible}
					pos={toolbarPos}
					onFormat={execFormat}
				/>

				<div style={{ position: "relative" }}>
					<IconButton
						type="button"
						title="Emoji"
						className="emoji-toggle"
						onClick={(ev) => {
							ev.stopPropagation();
							setEmojiPickerVisible((v) => !v);
						}}
					>
						<Smile size={20} />
					</IconButton>
					<EmojiPicker
						visible={emojiPickerVisible}
						onPick={(em) => insertTextAtCaret(em)}
						onClose={() => setEmojiPickerVisible(false)}
					/>
				</div>

				{editingMode && onCancelEdit && (
					<IconButton
						type="button"
						title="Cancel edit"
						onClick={() => {
							onCancelEdit();
							setHtml("");
							editorRef.current?.setHtml("");
						}}
					>
						<CornerUpLeft size={18} />
					</IconButton>
				)}

				<IconButton
					type="submit"
					disabled={
						disabled ||
						(inboxType === "image" || inboxType === "file"
							? files.length === 0
							: editorRef.current
								? (
										(document.querySelector("[contenteditable]") as HTMLElement)
											?.innerText || ""
									).trim().length === 0
								: true)
					}
					title={editingMode ? "Update message" : "Send message"}
					style={{ marginLeft: 8 }}
				>
					<Send size={20} />
				</IconButton>

				<FilePreview
					files={files}
					imagePreviews={imagePreviews}
					onRemove={handleRemoveFile}
				/>
			</InputContainer>
		</Composer>
	);
}
