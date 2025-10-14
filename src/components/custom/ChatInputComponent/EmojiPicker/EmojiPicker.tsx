type Props = {
	visible: boolean;
	onPick: (emoji: string) => void;
	onClose?: () => void;
};

const defaultEmojis = [
	"😊",
	"😂",
	"😍",
	"👍",
	"🎉",
	"😢",
	"😮",
	"👏",
	"🔥",
	"😡",
];

export default function EmojiPicker({ visible, onPick, onClose }: Props) {
	if (!visible) return null;
	return (
		<div
			className="emoji-picker"
			style={{
				position: "absolute",
				bottom: "calc(100% + 8px)",
				right: 0,
				background: "#fff",
				borderRadius: 8,
				boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
				padding: 8,
				zIndex: 80,
				display: "grid",
				gridTemplateColumns: "repeat(5, 1fr)",
				gap: 6,
				width: 220,
			}}
			onClick={(e) => e.stopPropagation()}
		>
			{defaultEmojis.map((em) => (
				<button
					key={em}
					type="button"
					onClick={() => {
						onPick(em);
						onClose?.();
					}}
					style={{
						fontSize: 20,
						padding: 6,
						background: "transparent",
						border: "none",
						cursor: "pointer",
					}}
				>
					{em}
				</button>
			))}
		</div>
	);
}
