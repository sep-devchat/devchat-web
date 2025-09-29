/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

import { Input } from "../ui/input"; // bạn có thể dùng input của UI lib
import { Attachment as SD_Attachment } from "@/sampleData";

/* --- ReactQuill import --- */
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // theme CSS

type Props = {
	onSend: (payload: { text: string; attachments?: SD_Attachment[] }) => void;
};

/**
 * LocalAttachment: internal preview / staging attachment type.
 * We will map LocalAttachment -> SD_Attachment when calling onSend.
 */
type LocalAttachment =
	| {
			localId: string;
			kind: "file" | "image";
			file: File;
			filename: string;
			mimeType?: string;
			fileSize?: number;
	  }
	| {
			localId: string;
			kind: "code";
			filename: string;
			language: string;
			codeText: string;
	  };

export default function ComposerWithAdd({ onSend }: Props) {
	// Note: with ReactQuill we store HTML string in `input`.
	const [input, setInput] = useState<string>("");
	const [showFormatPanel, setShowFormatPanel] = useState(false);
	const [attachments, setAttachments] = useState<LocalAttachment[]>([]);
	const [codeFilename, setCodeFilename] = useState("");
	const [codeLang, setCodeLang] = useState("javascript");
	const [codeText, setCodeText] = useState("");
	const SH = SyntaxHighlighter as unknown as React.FC<any>;

	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const imageInputRef = useRef<HTMLInputElement | null>(null);

	function addLocalAttachment(att: LocalAttachment) {
		setAttachments((s) => [...s, att]);
	}

	function handleFileChoose(files: FileList | null) {
		if (!files || files.length === 0) return;
		for (let i = 0; i < files.length; i++) {
			const f = files[i];
			addLocalAttachment({
				localId: `local-file-${Date.now()}-${i}`,
				kind: "file",
				file: f,
				filename: f.name,
				mimeType: f.type || undefined,
				fileSize: f.size || undefined,
			});
		}
	}

	function handleImageChoose(files: FileList | null) {
		if (!files || files.length === 0) return;
		for (let i = 0; i < files.length; i++) {
			const f = files[i];
			addLocalAttachment({
				localId: `local-img-${Date.now()}-${i}`,
				kind: "image",
				file: f,
				filename: f.name,
				mimeType: f.type || undefined,
				fileSize: f.size || undefined,
			});
		}
	}

	function handleAddCodeAsAttachment() {
		if (!codeText.trim()) {
			alert("Nhập code trước khi thêm.");
			return;
		}
		addLocalAttachment({
			localId: `local-code-${Date.now()}`,
			kind: "code",
			filename: codeFilename || `snippet.${codeLang}`,
			language: codeLang,
			codeText,
		});
		setCodeFilename("");
		setCodeText("");
		setShowFormatPanel(false);
	}

	function handleRemoveAttachment(localId: string) {
		setAttachments((s) => s.filter((a) => a.localId !== localId));
	}

	function mapToSDAttachments(local: LocalAttachment[]): SD_Attachment[] {
		return local.map((l) => {
			if (l.kind === "code") {
				return {
					attachmentId: `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
					messageId: "", // parent will fill
					filename: l.filename,
					originalFilename: l.filename,
					filePath: null,
					fileSize: l.codeText.length,
					mimeType: `text/${l.language}`,
					uploadedAt: new Date().toISOString(),
				} as SD_Attachment;
			} else {
				return {
					attachmentId: `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
					messageId: "",
					filename: l.filename,
					originalFilename: l.filename,
					filePath: null,
					fileSize: l.fileSize ?? (l.file ? l.file.size : null),
					mimeType: l.mimeType ?? (l.file ? l.file.type : null),
					uploadedAt: new Date().toISOString(),
				} as SD_Attachment;
			}
		});
	}

	function handleSend() {
		// if input is HTML, you may want to strip tags for empty-check:
		const plain = input.replace(/<(.|\n)*?>/g, "").trim();
		if (!plain && attachments.length === 0) return;

		const sdAtts = mapToSDAttachments(attachments);
		onSend({ text: input, attachments: sdAtts });

		// reset composer
		setInput("");
		setAttachments([]);
		setShowFormatPanel(false);
	}

	/* --- ReactQuill toolbar/modules --- */
	const quillModules = {
		toolbar: [
			[{ header: [1, 2, 3, false] }],
			["bold", "italic", "underline", "strike"],
			[
				{ list: "ordered" },
				{ list: "bullet" },
				{ indent: "-1" },
				{ indent: "+1" },
			],
			["link", "image"],
			["code-block"], // code block button
			["clean"],
		],
		clipboard: {
			// toggles pasting behavior
			matchVisual: false,
		},
	};

	const quillFormats = [
		"header",
		"bold",
		"italic",
		"underline",
		"strike",
		"list",
		"bullet",
		"indent",
		"link",
		"image",
		"code-block",
	];

	return (
		<div style={{ position: "relative", padding: 8 }}>
			{/* Composer root */}
			<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
				<button
					aria-label="add"
					title="Thêm"
					onClick={() => {
						setShowFormatPanel((s) => !s);
					}}
					style={{
						background: "transparent",
						border: "none",
						cursor: "pointer",
						display: "inline-flex",
						alignItems: "center",
						justifyContent: "center",
						width: 36,
						height: 36,
						borderRadius: 8,
					}}
				>
					<svg width="20" height="20" viewBox="0 0 24 24">
						<path
							fill="currentColor"
							d="M12 5v14M5 12h14"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</button>

				{/* NOTE: main single-line input left as before; you can replace it with ReactQuill too if you want rich composer always */}
				<input
					placeholder="Enter messages"
					value={""} // keep empty to force using Quill only in panel; or you can sync with input state if you want Quill always visible
					onChange={() => {}}
					style={{
						flex: 1,
						padding: "10px 12px",
						borderRadius: 8,
						border: "1px solid #e6eef6",
						background: "#fff",
					}}
					readOnly
					onFocus={() => setShowFormatPanel(true)}
				/>

				<div style={{ display: "flex", gap: 8 }}>
					<button
						onClick={() => fileInputRef.current?.click()}
						title="Đính kèm file"
						style={{ padding: "8px", borderRadius: 8 }}
					>
						📎
					</button>
					<button
						onClick={handleSend}
						title="Gửi"
						style={{ padding: "8px 10px", borderRadius: 8 }}
					>
						➤
					</button>
				</div>
			</div>

			{/* attachments preview */}
			{attachments.length > 0 && (
				<div
					style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}
				>
					{attachments.map((a) => (
						<div
							key={a.localId}
							style={{
								border: "1px solid #eee",
								padding: 8,
								borderRadius: 8,
								minWidth: 140,
							}}
						>
							<div style={{ fontSize: 13, fontWeight: 600 }}>
								{a.filename ?? a.localId}
							</div>
							<div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
								{a.kind === "code"
									? `${a.language} (code)`
									: (a.mimeType ?? (a.file ? a.file.type : ""))}
							</div>
							<div style={{ marginTop: 8 }}>
								<button
									onClick={() => handleRemoveAttachment(a.localId)}
									style={{ fontSize: 12 }}
								>
									Xóa
								</button>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Inline Format Panel (ReactQuill replaces the textarea here) */}
			{showFormatPanel && (
				<div
					style={{
						marginTop: 12,
						border: "1px solid #e4edf6",
						borderRadius: 10,
						padding: 12,
						background: "#fff",
						boxShadow: "0 4px 14px rgba(20,40,60,0.04)",
					}}
				>
					<div
						style={{
							display: "flex",
							gap: 12,
							marginBottom: 8,
							alignItems: "center",
						}}
					>
						<div style={{ fontSize: 13, fontWeight: 600 }}>Normal text</div>
						<div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
							<button
								onClick={() => fileInputRef.current?.click()}
								style={{ padding: "6px 8px", borderRadius: 6 }}
							>
								Đính kèm file
							</button>
							<button
								onClick={() => imageInputRef.current?.click()}
								style={{ padding: "6px 8px", borderRadius: 6 }}
							>
								Đính kèm ảnh
							</button>
						</div>
					</div>

					{/* REACT-QUILL - rich text editor (used for message body) */}
					<div style={{ marginBottom: 8 }}>
						<ReactQuill
							value={input}
							onChange={(html) => setInput(html)}
							modules={quillModules}
							formats={quillFormats}
							placeholder="Enter messages"
							theme="snow"
							style={{ borderRadius: 8 }}
						/>
					</div>

					{/* Code snippet editor (unchanged) */}
					<div style={{ borderTop: "1px solid #f0f6fb", paddingTop: 12 }}>
						<div
							style={{
								display: "flex",
								gap: 8,
								alignItems: "center",
								marginBottom: 8,
							}}
						>
							<div style={{ fontSize: 13, fontWeight: 600 }}>Code snippet</div>
							<input
								value={codeFilename}
								onChange={(e) => setCodeFilename(e.target.value)}
								placeholder="Tên file (tùy chọn)"
								style={{
									padding: 6,
									borderRadius: 6,
									border: "1px solid #ddd",
									marginLeft: 8,
								}}
							/>
							<select
								value={codeLang}
								onChange={(e) => setCodeLang(e.target.value)}
								style={{ padding: 6, borderRadius: 6 }}
							>
								<option value="c">C</option>
								<option value="cpp">C++</option>
								<option value="javascript">JavaScript</option>
								<option value="typescript">TypeScript</option>
								<option value="python">Python</option>
								<option value="java">Java</option>
								<option value="go">Go</option>
								<option value="ruby">Ruby</option>
								<option value="php">PHP</option>
								<option value="css">CSS</option>
								<option value="html">HTML</option>
							</select>
						</div>

						<textarea
							rows={6}
							value={codeText}
							onChange={(e) => setCodeText(e.target.value)}
							placeholder="// Viết code ở đây"
							style={{
								width: "100%",
								padding: 10,
								borderRadius: 8,
								border: "1px solid #eef6fd",
								fontFamily: "monospace",
							}}
						/>

						<div style={{ marginTop: 10 }}>
							<div style={{ fontSize: 13, marginBottom: 6 }}>Preview</div>
							<div
								style={{
									border: "1px solid #f0f6fb",
									borderRadius: 8,
									overflow: "auto",
									maxHeight: 220,
								}}
							>
								<SH language={codeLang} style={tomorrow}>
									{codeText || "// preview..."}
								</SH>
							</div>
						</div>

						<div
							style={{
								display: "flex",
								gap: 8,
								justifyContent: "flex-end",
								marginTop: 10,
							}}
						>
							<button
								onClick={handleAddCodeAsAttachment}
								style={{ padding: "8px 12px", borderRadius: 8 }}
							>
								Thêm code
							</button>
							<button
								onClick={() => setShowFormatPanel(false)}
								style={{ padding: "8px 12px", borderRadius: 8 }}
							>
								Đóng
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Hidden file inputs */}
			<Input
				ref={fileInputRef}
				type="file"
				style={{ display: "none" }}
				multiple
				onChange={(e) => handleFileChoose(e.target.files)}
			/>
			<Input
				ref={imageInputRef}
				type="file"
				style={{ display: "none" }}
				accept="image/*"
				multiple
				onChange={(e) => handleImageChoose(e.target.files)}
			/>
		</div>
	);
}
