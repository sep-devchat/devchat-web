import { MessageResponse } from "@/services/messageAPI";
import { getReplyPreviewText, truncatePreview } from "@/utils/replyPreview";

type Props = {
	replyTo: MessageResponse | null;
	onCancelReply?: () => void;
};

export default function ReplyPreview({ replyTo, onCancelReply }: Props) {
	if (!replyTo) return null;
	const previewText = truncatePreview(getReplyPreviewText(replyTo));
	return (
		<div
			style={{
				width: "100%",
				marginBottom: 6,
				background: "#f3f4f6",
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
					Replying to {replyTo.sender?.firstName || replyTo.sender?.username}
				</div>
				<div style={{ fontSize: 12, color: "#6b7280" }}>{previewText}</div>
			</div>
			<div style={{ display: "flex", gap: 6 }}>
				<button
					type="button"
					onClick={() => onCancelReply?.()}
					title="Cancel reply"
					style={{
						border: "none",
						background: "transparent",
						padding: 6,
						cursor: "pointer",
					}}
				>
					✕
				</button>
			</div>
		</div>
	);
}
