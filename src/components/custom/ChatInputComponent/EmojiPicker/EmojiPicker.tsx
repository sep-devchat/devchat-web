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
			className="emoji-picker max-[1220px]:bottom-[calc(100%+5.6px)] max-[1220px]:rounded-[5.6px] max-[1220px]:p-[5.6px] max-[1220px]:gap-[4.2px] max-[1220px]:w-[154px] min-[1440px]:bottom-[calc(100%+6.4px)] min-[1440px]:rounded-[6.4px] min-[1440px]:p-[6.4px] min-[1440px]:gap-[4.8px] min-[1440px]:w-[176px] min-[1920px]:bottom-[calc(100%+8.8px)] min-[1920px]:rounded-[8.8px] min-[1920px]:p-[8.8px] min-[1920px]:gap-[6.6px] min-[1920px]:w-[242px]"
			style={{
				position: "absolute",
				bottom: "calc(100% + 8px)",
				left: 0,
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
					className="max-[1220px]:text-[16.8px] max-[1220px]:p-[2.8px] min-[1440px]:text-[19.2px] min-[1440px]:p-[3.2px] min-[1920px]:text-[26.4px] min-[1920px]:p-[4.4px]"
					style={{
						fontSize: 18,
						padding: 4,
						background: "transparent",
						border: "none",
						cursor: "pointer",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					{em}
				</button>
			))}
		</div>
	);
}
