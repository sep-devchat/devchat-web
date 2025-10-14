/* eslint-disable @typescript-eslint/no-explicit-any */

type Props = {
	replyTo: any | null;
	onCancelReply?: () => void;
};

export default function ReplyPreview({ replyTo, onCancelReply }: Props) {
	if (!replyTo) return null;
	const truncate = (s?: string, n = 160) =>
		!s ? "" : s.length > n ? s.slice(0, n - 1) + "…" : s;
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
				<div style={{ fontSize: 12, color: "#6b7280" }}>
					{truncate(replyTo.content)}
				</div>
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
