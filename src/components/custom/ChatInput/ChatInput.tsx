/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
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
	saveDirectUpload,
} from "@/services/upload/upload.api";
import ReplyPreview from "../ChatInputComponent/ReplyPreview/ReplyPreview";
import ChatTypeDropdown from "../ChatInputComponent/ChatTypeModal/ChatTypeModal";
import Toolbar, {
	ToolbarAction,
} from "../ChatInputComponent/MarkdownToolbar/Toolbar";
import EmojiPicker from "../ChatInputComponent/EmojiPicker/EmojiPicker";
import FilePreview from "../ChatInputComponent/FilePreview/FilePreview";
import CodeEditor from "../CodeEditor";
import { useSelector } from "react-redux";
import { type RootState } from "@/store";
import aiAPI from "@/services/ai/ai.api";
import { CreateCodeBlockRequest } from "@/services/code-block/code-block.type";

type MentionCandidate = {
	id: string;
	name: string;
	username?: string;
	avatar?: string;
	typeKind: "member" | "ai";
	providerKey?: string; // for AI items, lowercase key e.g. 'openai', 'gemini'
};

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

	// --- Mentions state ---
	const [mentionVisible, setMentionVisible] = useState(false);
	const [mentionQuery, setMentionQuery] = useState("");
	const [mentionPos, setMentionPos] = useState<{ top: number; left: number }>({
		top: 0,
		left: 0,
	});
	const [mentionActiveIndex, setMentionActiveIndex] = useState(0);

	const currentGroupId = useSelector(
		(s: RootState) => s.groupMembers.currentGroupId,
	);
	const groupMembers = useSelector((s: RootState) =>
		currentGroupId
			? s.groupMembers.byGroupId[currentGroupId]?.members || []
			: [],
	);
	const aiProviders = useSelector((s: RootState) => s.ai?.providers || []);

	// --- Request type picker state (for AI mentions) ---
	const [reqTypeVisible, setReqTypeVisible] = useState(false);
	const [reqTypeProvider, setReqTypeProvider] = useState<string | null>(null); // 'openai' | 'gemini'
	const [reqTypeQuery, setReqTypeQuery] = useState("");
	const [reqTypeActiveIndex, setReqTypeActiveIndex] = useState(0);
	const requestTypes = useMemo(
		() => ["chat", "suggest", "explain", "refactor"],
		[],
	);
	const mentionOptions: MentionCandidate[] = useMemo(() => {
		if (!mentionVisible) return [];
		const q = mentionQuery.trim().toLowerCase();
		const memberList = (groupMembers || []) as Array<{
			id: string;
			name: string;
			username?: string;
			avatar?: string;
		}>;

		// Map members to candidates
		const memberCandidates: MentionCandidate[] = memberList.map((m) => ({
			id: String(m.id),
			name: m.name,
			username: m.username,
			avatar: m.avatar,
			typeKind: "member",
		}));

		// Map AI providers to candidates (available ones)
		const providerCandidates: MentionCandidate[] = (aiProviders || [])
			.filter((p: any) => p?.available)
			.map((p: any) => {
				const key = String(p.provider || "").toLowerCase(); // OPENAI|GEMINI -> openai|gemini
				const label = p.label || key;
				return {
					id: `ai:${key}`,
					name: label,
					username: key, // for filtering/rendering
					typeKind: "ai" as const,
					providerKey: key,
				} as MentionCandidate;
			});

		const merged = [...providerCandidates, ...memberCandidates];

		const filtered = q
			? merged.filter((m) => {
					const uname = (m.username || "").toLowerCase();
					return (
						m.name?.toLowerCase().includes(q) ||
						uname.includes(q) ||
						String(m.id).toLowerCase().includes(q)
					);
				})
			: merged;
		// Limit results: 5 for initial (empty query), 8 while searching
		return q ? filtered.slice(0, 8) : filtered.slice(0, 5);
	}, [groupMembers, aiProviders, mentionQuery, mentionVisible]);

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

	async function uploadFileAndGetUrl(
		file: File,
	): Promise<{ url: string; attachmentId: string } | null> {
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
			const result = await saveDirectUpload(uploadRes);
			return {
				url: uploadRes?.secure_url ?? delivery?.url ?? null,
				attachmentId: result.data.id,
			};
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
			let codeBlock: CreateCodeBlockRequest | undefined;
			// If code editor is open and has content, append as fenced block
			if (showCodeEditor && codeValue.trim().length > 0) {
				codeBlock = {
					content: codeValue,
					language: codeLangRef.current,
				};
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
				const attachmentIds: string[] = [];
				for (const f of snapshotFiles) {
					const uploadResult = await uploadFileAndGetUrl(f);
					if (!uploadResult) continue;
					attachmentIds.push(uploadResult.attachmentId);
					if (uploadResult.url)
						mdParts.push(
							f.type.startsWith("image/")
								? `![](${uploadResult.url})`
								: `[${f.name}](${uploadResult.url})`,
						);
					else
						mdParts.push(
							f.type.startsWith("image/") ? `![]()` : `[${f.name}]()`,
						);
				}
				const combined = mdParts.join("\n");
				const sent = await onSend?.({
					type: "text",
					text: combined,
					clientTempId,
					attachmentIds,
					codeBlock,
				});
				// If message begins with @provider/requestType, trigger AI ask using created message id
				try {
					const aiCmd = combined.trim();
					if (/^@([a-zA-Z0-9_-]+)\/(\w+)(?:\s|$)/.test(aiCmd)) {
						const msgId =
							(sent as any)?.data?.id ||
							(sent as any)?.id ||
							(sent as any)?.data?.messageId ||
							(sent as any)?.messageId;
						if (msgId) {
							console.debug(
								"[ChatInput] AI directive detected, calling askAi for messageId",
								msgId,
							);
							void aiAPI.askAi({ messageId: msgId });
						} else {
							console.warn(
								"[ChatInput] AI directive detected but no messageId returned from onSend; askAi skipped. Ensure onSend resolves with created message id.",
							);
						}
					}
				} catch {}
				return;
			}

			if (typedMd.length === 0) return;
			const sent = await onSend?.({ type: "text", text: typedMd, codeBlock });
			// Trigger AI ask if command prefix detected at start
			try {
				const aiCmd = typedMd.trim();
				if (/^@([a-zA-Z0-9_-]+)\/(\w+)(?:\s|$)/.test(aiCmd)) {
					const msgId =
						(sent as any)?.data?.id ||
						(sent as any)?.id ||
						(sent as any)?.data?.messageId ||
						(sent as any)?.messageId;
					if (msgId) {
						console.debug(
							"[ChatInput] AI directive detected, calling askAi for messageId",
							msgId,
						);
						void aiAPI.askAi({ messageId: msgId });
					} else {
						console.warn(
							"[ChatInput] AI directive detected but no messageId returned from onSend; askAi skipped. Ensure onSend resolves with created message id.",
						);
					}
				}
			} catch {}
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

	const updateMentionStateFromSelection = useCallback(() => {
		// Detect if caret is after an @mention token and update dropdown state/position
		// Note: Even when the code editor is visible, we still allow mentions in the main editor.
		const container = document.querySelector(
			"[contenteditable]",
		) as HTMLElement | null;
		if (!container) {
			setMentionVisible(false);
			setReqTypeVisible(false);
			return;
		}
		const sel = window.getSelection();
		if (!sel || sel.rangeCount === 0) {
			setMentionVisible(false);
			setReqTypeVisible(false);
			return;
		}
		const range = sel.getRangeAt(0);
		// Ensure selection is within our editor container
		let node: Node | null = range.commonAncestorContainer;
		let inside = false;
		while (node) {
			if (node === container) {
				inside = true;
				break;
			}
			node = (node as any).parentNode;
		}
		if (!inside) {
			setMentionVisible(false);
			setReqTypeVisible(false);
			return;
		}
		// Only care about caret positions
		if (!range.collapsed) {
			setMentionVisible(false);
			setReqTypeVisible(false);
			return;
		}
		// Try to examine text content just before caret
		let textNode = range.startContainer as Text;
		if (textNode.nodeType !== Node.TEXT_NODE) {
			const candidate = textNode.childNodes[range.startOffset - 1] as
				| Node
				| undefined;
			if (candidate && candidate.nodeType === Node.TEXT_NODE) {
				textNode = candidate as Text;
			} else {
				setMentionVisible(false);
				setReqTypeVisible(false);
				return;
			}
		}
		const caretOffset = range.startOffset;
		const before = textNode.data.slice(0, caretOffset);

		// First, detect provider/type pattern: @provider/<typeQuery>
		const providerTypeMatch = /@([a-zA-Z0-9_]{1,30})\/([a-zA-Z0-9_]*)$/.exec(
			before,
		);
		if (providerTypeMatch) {
			const prov = (providerTypeMatch[1] || "").toLowerCase();
			setReqTypeProvider(prov);
			setReqTypeQuery((providerTypeMatch[2] || "").toLowerCase());
			setReqTypeVisible(true);
			setReqTypeActiveIndex(0);
			// Hide member/provider dropdown while choosing type
			setMentionVisible(false);
			return;
		}

		// Otherwise, detect basic @query mention
		const match = /(^|\s)@([a-zA-Z0-9_]{0,30})$/.exec(before);
		if (!match) {
			setMentionVisible(false);
			setReqTypeVisible(false);
			return;
		}
		const query = match[2] || "";
		setReqTypeVisible(false);
		// Position dropdown from the top-left of the editor container
		setMentionQuery(query);
		setMentionPos({ top: 0, left: 0 });
		setMentionVisible(true);
		setMentionActiveIndex(0);
	}, []);

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

	const applyMention = useCallback(
		(candidate: MentionCandidate) => {
			const container = document.querySelector(
				"[contenteditable]",
			) as HTMLElement | null;
			if (!container) return;
			const sel = window.getSelection();
			if (!sel || sel.rangeCount === 0) return;
			const range = sel.getRangeAt(0);
			let textNode = range.startContainer as Text;
			if (textNode.nodeType !== Node.TEXT_NODE) {
				const candidateNode = textNode.childNodes[range.startOffset - 1] as
					| Node
					| undefined;
				if (candidateNode && candidateNode.nodeType === Node.TEXT_NODE) {
					textNode = candidateNode as Text;
				} else {
					// Fallback: just insert at caret
					if (candidate.typeKind === "ai" && candidate.providerKey) {
						insertTextAtCaret(`@${candidate.providerKey}/`);
						setReqTypeProvider(candidate.providerKey);
						setReqTypeQuery("");
						setReqTypeVisible(true);
						setMentionVisible(false);
						return;
					}
					const uname = (candidate.username || candidate.name || "").replace(
						/\s+/g,
						"_",
					);
					insertTextAtCaret(`@${uname} `);
					setMentionVisible(false);
					return;
				}
			}
			const caretOffset = range.startOffset;
			const before = textNode.data.slice(0, caretOffset);
			const after = textNode.data.slice(caretOffset);
			const m = /(^|\s)@([a-zA-Z0-9_]{0,30})$/.exec(before);
			if (m) {
				const startPos = m.index + m[1].length; // index of '@'
				const newBefore = before.slice(0, startPos);
				if (candidate.typeKind === "ai" && candidate.providerKey) {
					const token = `@${candidate.providerKey}/`;
					textNode.data = newBefore + token + after;
					const newCaret = newBefore.length + token.length;
					const newRange = document.createRange();
					newRange.setStart(textNode, newCaret);
					newRange.collapse(true);
					sel.removeAllRanges();
					sel.addRange(newRange);
					container.dispatchEvent(new Event("input", { bubbles: true }));
					setMdText(container.innerText || "");
					setHtml(editorRef.current?.getHtml?.() ?? container.innerHTML);
					setMentionVisible(false);
					setReqTypeProvider(candidate.providerKey);
					setReqTypeQuery("");
					setReqTypeVisible(true);
					return;
				}
				const uname = (candidate.username || candidate.name || "").replace(
					/\s+/g,
					"_",
				);
				const mentionText = `@${uname}`;
				textNode.data = newBefore + mentionText + " " + after;
				const newCaret = newBefore.length + mentionText.length + 1;
				const newRange = document.createRange();
				newRange.setStart(textNode, newCaret);
				newRange.collapse(true);
				sel.removeAllRanges();
				sel.addRange(newRange);
				container.dispatchEvent(new Event("input", { bubbles: true }));
				setMdText(container.innerText || "");
				setHtml(editorRef.current?.getHtml?.() ?? container.innerHTML);
			} else {
				if (candidate.typeKind === "ai" && candidate.providerKey) {
					insertTextAtCaret(`@${candidate.providerKey}/`);
					setReqTypeProvider(candidate.providerKey);
					setReqTypeQuery("");
					setReqTypeVisible(true);
					setMentionVisible(false);
				} else {
					const uname = (candidate.username || candidate.name || "").replace(
						/\s+/g,
						"_",
					);
					insertTextAtCaret(`@${uname} `);
				}
			}
			setMentionVisible(false);
		},
		[insertTextAtCaret],
	);

	// Apply a request type after '@provider/'
	const applyRequestType = useCallback(
		(type: string) => {
			const container = document.querySelector(
				"[contenteditable]",
			) as HTMLElement | null;
			if (!container) return;
			const sel = window.getSelection();
			if (!sel || sel.rangeCount === 0) return;
			const range = sel.getRangeAt(0);
			let textNode = range.startContainer as Text;
			if (textNode.nodeType !== Node.TEXT_NODE) {
				const candidateNode = textNode.childNodes[range.startOffset - 1] as
					| Node
					| undefined;
				if (candidateNode && candidateNode.nodeType === Node.TEXT_NODE) {
					textNode = candidateNode as Text;
				} else {
					insertTextAtCaret(`${type} `);
					setReqTypeVisible(false);
					return;
				}
			}
			const caretOffset = range.startOffset;
			const before = textNode.data.slice(0, caretOffset);
			const after = textNode.data.slice(caretOffset);
			const m = /(@[a-zA-Z0-9_]{1,30})\/([a-zA-Z0-9_]*)$/.exec(before);
			if (m) {
				const start = m.index;
				const prefix = before.slice(0, start);
				const fullToken = `${m[1]}/${type}`; // @provider/type
				textNode.data = prefix + fullToken + " " + after;
				const newCaret = (prefix + fullToken + " ").length;
				const newRange = document.createRange();
				newRange.setStart(textNode, newCaret);
				newRange.collapse(true);
				sel.removeAllRanges();
				sel.addRange(newRange);
				container.dispatchEvent(new Event("input", { bubbles: true }));
				setMdText(container.innerText || "");
				setHtml(editorRef.current?.getHtml?.() ?? container.innerHTML);
			} else {
				insertTextAtCaret(`${type} `);
			}
			setReqTypeVisible(false);
			setReqTypeProvider(null);
			setReqTypeQuery("");
			setReqTypeActiveIndex(0);
		},
		[insertTextAtCaret],
	);

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
			updateMentionStateFromSelection();
		},
		[showCodeEditor, textToHtml, updateMentionStateFromSelection],
	);

	const handleEditorKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			const isComposing = (e as any).nativeEvent?.isComposing;
			if (!isComposing && e.key === "Enter") {
				if (mentionVisible && mentionOptions.length > 0) {
					e.preventDefault();
					const cand = mentionOptions[mentionActiveIndex] || mentionOptions[0];
					if (cand) applyMention(cand);
					return;
				}
				if (!e.shiftKey) {
					e.preventDefault();
					void handleSubmit();
					return;
				}
			}
			if (reqTypeVisible) {
				if (e.key === "ArrowDown") {
					e.preventDefault();
					setReqTypeActiveIndex((i) => {
						const opts = requestTypes.filter((t) => t.startsWith(reqTypeQuery));
						return opts.length ? (i + 1) % opts.length : 0;
					});
					return;
				}
				if (e.key === "ArrowUp") {
					e.preventDefault();
					setReqTypeActiveIndex((i) => {
						const opts = requestTypes.filter((t) => t.startsWith(reqTypeQuery));
						return opts.length ? (i - 1 + opts.length) % opts.length : 0;
					});
					return;
				}
				if (e.key === "Enter" || e.key === "Tab") {
					e.preventDefault();
					const opts = requestTypes.filter((t) => t.startsWith(reqTypeQuery));
					const pick = opts[reqTypeActiveIndex] || opts[0] || requestTypes[0];
					if (pick) applyRequestType(pick);
					return;
				}
				if (e.key === "Escape") {
					setReqTypeVisible(false);
					return;
				}
				// update query on normal character keys
				if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
					// Allow default insertion, will be processed by onInput -> updateMentionStateFromSelection
					setTimeout(() => {
						const sel = window.getSelection();
						if (sel && sel.rangeCount > 0) updateMentionStateFromSelection();
					}, 0);
				}
			}
			if (mentionVisible) {
				if (e.key === "ArrowDown") {
					e.preventDefault();
					setMentionActiveIndex((i) =>
						mentionOptions.length ? (i + 1) % mentionOptions.length : 0,
					);
					return;
				}
				if (e.key === "ArrowUp") {
					e.preventDefault();
					setMentionActiveIndex((i) =>
						mentionOptions.length
							? (i - 1 + mentionOptions.length) % mentionOptions.length
							: 0,
					);
					return;
				}
				if (e.key === "Tab") {
					e.preventDefault();
					const cand = mentionOptions[mentionActiveIndex] || mentionOptions[0];
					if (cand) applyMention(cand);
					return;
				}
				if (e.key === "Escape") {
					setMentionVisible(false);
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
		[
			handleSubmit,
			onToolbarAction,
			mentionVisible,
			mentionOptions,
			mentionActiveIndex,
			applyMention,
		],
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
					{/* Scrollable content area */}
					<div
						className={`flex max-h-96 flex-col gap-2 min-h-0`}
						style={{ position: "relative" }}
					>
						{/* File previews above the input */}
						{files.length > 0 && (
							<FilePreview
								files={files}
								imagePreviews={imagePreviews}
								onRemove={handleRemoveFile}
							/>
						)}

						{/* Main plain text/markdown editor (always visible) */}
						<Editor
							ref={editorRef}
							placeholder={placeholder}
							onInput={handleEditorInput}
							onKeyDown={handleEditorKeyDown}
							onPaste={handleEditorPaste}
						/>

						{/* Optional code editor appears below the input when triggered */}
						{showCodeEditor && (
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
						)}

						{/* Mentions dropdown */}
						{mentionVisible && mentionOptions.length > 0 && (
							<div
								className="absolute z-[10000] w-72 max-w-full overflow-hidden rounded-md border border-neutral-300 bg-white shadow-md"
								style={{ bottom: 25, left: mentionPos.left }}
							>
								<div className="max-h-64 overflow-auto py-1 flex flex-col">
									{mentionOptions.map((m, idx) => (
										<button
											key={m.id}
											type="button"
											className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm ${idx === mentionActiveIndex ? "bg-neutral-100" : ""}`}
											onMouseDown={(ev) => {
												// prevent editor blur
												ev.preventDefault();
												applyMention(m);
											}}
										>
											{m.typeKind === "ai" ? (
												<span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-white text-xs font-semibold">
													AI
												</span>
											) : m.avatar ? (
												<img
													src={m.avatar}
													alt={m.name}
													className="h-6 w-6 rounded-full object-cover"
												/>
											) : (
												<div className="h-6 w-6 rounded-full bg-neutral-300 dark:bg-neutral-700" />
											)}
											<span className="truncate">
												{m.typeKind === "ai" ? `@${m.providerKey}` : m.name}
											</span>
											{m.typeKind === "ai" && (
												<span className="ml-auto text-[10px] uppercase tracking-wide text-neutral-500">
													provider
												</span>
											)}
										</button>
									))}
								</div>
							</div>
						)}

						{reqTypeVisible && reqTypeProvider && (
							<div
								className="absolute z-[10001] w-64 max-w-full overflow-hidden rounded-md border border-neutral-300 bg-white shadow-md"
								style={{ bottom: 25, left: mentionPos.left + 8 }}
							>
								<div className="border-b px-3 py-2 text-xs font-medium text-neutral-600">
									@{reqTypeProvider}/
									<span className="text-neutral-400">
										{reqTypeQuery || "<type>"}
									</span>
								</div>
								<div className="max-h-56 overflow-auto py-1 flex flex-col">
									{requestTypes
										.filter((t) => t.startsWith(reqTypeQuery))
										.map((t, idx) => (
											<button
												key={t}
												type="button"
												className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm ${idx === reqTypeActiveIndex ? "bg-neutral-100" : ""}`}
												onMouseDown={(ev) => {
													ev.preventDefault();
													applyRequestType(t);
												}}
											>
												<span className="truncate">{t}</span>
											</button>
										))}
								</div>
							</div>
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
