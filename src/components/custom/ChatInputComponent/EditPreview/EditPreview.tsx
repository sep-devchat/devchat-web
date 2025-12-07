import { MessageResponse } from "@/services/messageAPI";
import { getReplyPreviewText, truncatePreview } from "@/utils/replyPreview";

type Props = {
	editingMessage: MessageResponse | null;
	onCancelEdit?: () => void;
};

export default function EditPreview({ editingMessage, onCancelEdit }: Props) {
	if (!editingMessage) return null;
	const previewText = truncatePreview(getReplyPreviewText(editingMessage));
	const authorName =
		editingMessage.sender?.firstName ||
		editingMessage.sender?.username ||
		"your";

	return (
		<div
			style={{
				width: "100%",
				marginBottom: 6,
				background: "#eff6ff",
				padding: "6px 10px",
				borderRadius: 8,
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				gap: 8,
			}}
		>
			<div style={{ display: "flex", gap: 8, alignItems: "center" }}>
				<div style={{ fontSize: 12, fontWeight: 600 }}>
					Editing{" "}
					{authorName === "your" ? "your message" : `${authorName}'s message`}
				</div>
				<div style={{ fontSize: 12, color: "#4b5563" }}>{previewText}</div>
			</div>
			<button
				type="button"
				onClick={() => onCancelEdit?.()}
				title="Cancel editing"
				style={{
					border: "none",
					background: "transparent",
					padding: 6,
					cursor: "pointer",
					fontSize: 12,
				}}
			>
				✕
			</button>
		</div>
	);
}
