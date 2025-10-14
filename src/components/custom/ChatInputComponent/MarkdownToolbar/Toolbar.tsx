type Props = {
	visible: boolean;
	pos: { top: number; left: number };
	onFormat: (cmd: string) => void;
};

export default function Toolbar({ visible, pos, onFormat }: Props) {
	if (!visible) return null;
	return (
		<div
			className="chat-toolbar"
			style={{
				position: "absolute",
				top: pos.top,
				left: pos.left,
				transform: "translate(-50%, 0)",
				zIndex: 60,
				background: "#111827",
				color: "#fff",
				padding: "6px 8px",
				borderRadius: 8,
				display: "flex",
				gap: 8,
				boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
			}}
		>
			<button
				type="button"
				onMouseDown={(e) => {
					e.preventDefault(); // giữ selection
					onFormat("bold");
				}}
				title="Bold"
				style={{
					background: "transparent",
					border: "none",
					color: "#fff",
					cursor: "pointer",
				}}
			>
				<strong>B</strong>
			</button>

			<button
				type="button"
				onMouseDown={(e) => {
					e.preventDefault();
					onFormat("italic");
				}}
				title="Italic"
				style={{
					background: "transparent",
					border: "none",
					color: "#fff",
					cursor: "pointer",
				}}
			>
				<em>I</em>
			</button>

			<button
				type="button"
				onMouseDown={(e) => {
					e.preventDefault();
					onFormat("underline");
				}}
				title="Underline"
				style={{
					background: "transparent",
					border: "none",
					color: "#fff",
					cursor: "pointer",
				}}
			>
				<u>U</u>
			</button>

			<button
				type="button"
				onMouseDown={(e) => {
					e.preventDefault();
					onFormat("strikeThrough");
				}}
				title="Strikethrough"
				style={{
					background: "transparent",
					border: "none",
					color: "#fff",
					cursor: "pointer",
				}}
			>
				<s>S</s>
			</button>
		</div>
	);
}
