// ChatInput.tsx (modified - plus opens ChatTypeModal)
import React, {
	useCallback,
	useEffect,
	useRef,
	useState,
	Suspense,
} from "react";

const ReactQuill = React.lazy(() =>
	import("react-quill").then((m) => ({ default: m.default })),
);
import "react-quill/dist/quill.snow.css";
import {
	Composer,
	IconButton,
	ImageThumb,
	Input,
	InputContainer,
	PreviewList,
	RemoveBtn,
	TextInput,
} from "./ChatInput.styled";
import ChatTypeDropdown from "@/components/custom/ChatTypeModal/ChatTypeModal";
import { Plus, Send, Smile } from "lucide-react";

export type InboxType = null | "normal" | "quillCode" | "image" | "file";

export type ChatInputPayload =
	| { type: "text"; text: string }
	| { type: "files"; files: File[] };

export type ChatInputProps = {
	setInboxTypeSelected?: React.Dispatch<React.SetStateAction<InboxType>>;
	inboxType?: InboxType;
	placeholder?: string;
	onSend?: (payload: ChatInputPayload) => Promise<void> | void;
	disabled?: boolean;

	// NEW: files passed from external modal — when present, ChatInput will append them into files state
	initialFiles?: File[];
	// optional callback so parent can clear initialFiles after ChatInput consumed them
	onInitialFilesHandled?: () => void;
};

export default function ChatInput({
	setInboxTypeSelected,
	inboxType: propInboxType = null,
	placeholder = "Write a message",
	onSend,
	disabled = false,
	initialFiles,
	onInitialFilesHandled,
}: ChatInputProps) {
	const [text, setText] = useState("");
	const [files, setFiles] = useState<File[]>([]);
	const [imagePreviews, setImagePreviews] = useState<string[]>([]);
	// allow either controlled via prop or internal state - prefer prop when provided
	const [inboxType, setInboxType] = useState<InboxType>(propInboxType ?? null);

	const fileInputRef = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		// if parent changed propInboxType, sync
		setInboxType(propInboxType ?? null);
	}, [propInboxType]);

	useEffect(() => {
		setInboxTypeSelected?.(inboxType);
	}, [inboxType]);

	useEffect(() => {
		// create image preview URLs for images
		const revs = files.map((f) =>
			f.type.startsWith("image/") ? URL.createObjectURL(f) : "",
		);
		setImagePreviews(revs);

		return () => {
			revs.forEach((r) => r && URL.revokeObjectURL(r));
		};
	}, [files]);

	// when parent passes initialFiles (from modal or other), append them to files state
	useEffect(() => {
		if (initialFiles && initialFiles.length > 0) {
			setFiles((prev) => [...prev, ...initialFiles]);
			onInitialFilesHandled?.();
		}
		// only watch length to avoid repeated triggers from same array ref
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initialFiles?.length]);

	const handleAddFiles = useCallback((selected: FileList | null) => {
		if (!selected) return;
		const arr = Array.from(selected);
		setFiles((prev) => [...prev, ...arr]);
	}, []);

	const handleRemoveFile = useCallback((index: number) => {
		setFiles((prev) => prev.filter((_, i) => i !== index));
	}, []);

	const handleSubmit = useCallback(
		async (e?: React.FormEvent) => {
			e?.preventDefault();
			if (disabled) return;

			if ((inboxType === "image" || inboxType === "file") && files.length > 0) {
				await onSend?.({ type: "files", files });
				setFiles([]);
				setText("");
				// optionally reset inbox type after send
				setInboxType(null);
				return;
			}

			const trimmed = text.trim();
			if (trimmed.length === 0) return;

			await onSend?.({ type: "text", text: trimmed });
			setText("");
			setInboxType(null);
		},
		[disabled, files, inboxType, onSend, text],
	);

	// Called by ChatTypeModal when user chooses option
	function handleAttachChoose(type: InboxType, chosenFiles?: File[]) {
		setInboxType(type ?? "normal");

		if (chosenFiles && chosenFiles.length > 0) {
			// append files from modal directly into files state
			setFiles((prev) => [...prev, ...chosenFiles]);
		}
		// For quillCode we just set inboxType and the editor will render
	}

	// const triggerFilePicker = useCallback(() => {
	//   fileInputRef.current?.click();
	// }, []);

	return (
		<Composer onSubmit={handleSubmit}>
			<InputContainer>
				{/* ChatTypeModal wraps the trigger. Make trigger element passive (no onClick) so DialogTrigger controls open. */}
				<ChatTypeDropdown
					trigger={
						<IconButton type="button" title="Attach">
							<Plus size={20} />
						</IconButton>
					}
					onChoose={handleAttachChoose}
				/>

				{/* Hidden file input to add images/files (can still be used by other UI flows) */}
				<Input
					ref={fileInputRef}
					style={{ display: "none" }}
					type="file"
					onChange={(e) => handleAddFiles(e.target.files)}
					multiple
					accept={inboxType === "image" ? "image/*" : undefined}
				/>

				{inboxType === "quillCode" ? (
					<div style={{ width: "100%" }}>
						<Suspense
							fallback={
								<TextInput
									value={text}
									placeholder={placeholder}
									onChange={(e) => setText(e.target.value)}
								/>
							}
						>
							<ReactQuill
								theme="snow"
								value={text}
								onChange={(val) => setText(val)}
								modules={{
									toolbar: [
										["bold", "italic", "underline"],
										["code-block"],
										[{ list: "ordered" }, { list: "bullet" }],
										["clean"],
									],
								}}
								formats={[
									"bold",
									"italic",
									"underline",
									"code-block",
									"list",
									"bullet",
								]}
							/>
						</Suspense>
					</div>
				) : inboxType === "image" ? (
					<div style={{ width: "100%" }}>
						<TextInput
							value={text}
							onChange={(e) => setText(e.target.value)}
							placeholder={placeholder}
							readOnly={false}
						/>

						{files.length > 0 && (
							<PreviewList>
								{files.map((f, i) => (
									<ImageThumb key={i}>
										{f.type.startsWith("image/") ? (
											<img
												src={imagePreviews[i]}
												alt={f.name}
												style={{
													width: "100%",
													height: "100%",
													objectFit: "cover",
												}}
											/>
										) : (
											<div style={{ padding: 8, textAlign: "center" }}>
												<div style={{ fontSize: 12 }}>{f.name}</div>
												<div style={{ fontSize: 11 }}>
													{Math.round(f.size / 1024)} KB
												</div>
											</div>
										)}
										<RemoveBtn
											type="button"
											onClick={() => handleRemoveFile(i)}
										>
											✕
										</RemoveBtn>
									</ImageThumb>
								))}
							</PreviewList>
						)}
					</div>
				) : inboxType === "file" ? (
					<div style={{ width: "100%" }}>
						<TextInput
							value={text}
							onChange={(e) => setText(e.target.value)}
							placeholder={placeholder}
						/>
						{files.length > 0 && (
							<PreviewList>
								{files.map((f, i) => (
									<div
										key={i}
										style={{
											display: "flex",
											alignItems: "center",
											gap: 8,
											padding: 6,
											background: "#fff",
											borderRadius: 8,
										}}
									>
										<div
											style={{
												fontSize: 12,
												maxWidth: 200,
												overflow: "hidden",
												textOverflow: "ellipsis",
											}}
										>
											{f.name}
										</div>
										<div style={{ fontSize: 11, color: "#6b7280" }}>
											{Math.round(f.size / 1024)} KB
										</div>
										<RemoveBtn
											type="button"
											onClick={() => handleRemoveFile(i)}
										>
											✕
										</RemoveBtn>
									</div>
								))}
							</PreviewList>
						)}
					</div>
				) : (
					<TextInput
						value={text}
						onChange={(e) => setText(e.target.value)}
						placeholder={placeholder}
					/>
				)}
				<IconButton>
					<Smile size={20} />
				</IconButton>
				<IconButton
					type="submit"
					disabled={
						disabled ||
						(inboxType === "image" || inboxType === "file"
							? files.length === 0
							: text.trim().length === 0)
					}
				>
					<Send size={20} />
				</IconButton>
			</InputContainer>
		</Composer>
	);
}
