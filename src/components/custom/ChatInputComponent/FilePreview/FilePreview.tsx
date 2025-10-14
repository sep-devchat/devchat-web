type Props = {
	files: File[];
	imagePreviews: string[];
	onRemove: (index: number) => void;
};

export default function FilePreview({ files, imagePreviews, onRemove }: Props) {
	if (!files || files.length === 0) return null;
	return (
		<div style={{ marginTop: 8 }}>
			{files.map((f, i) => (
				<div key={i} style={{ marginBottom: 8 }}>
					{f.type.startsWith("image/") ? (
						<div
							style={{
								width: 96,
								height: 64,
								position: "relative",
								borderRadius: 6,
								overflow: "hidden",
							}}
						>
							<img
								src={imagePreviews[i]}
								alt={f.name}
								style={{ width: "100%", height: "100%", objectFit: "cover" }}
							/>
							<button
								type="button"
								onClick={() => onRemove(i)}
								style={{
									position: "absolute",
									top: 4,
									right: 4,
									border: "none",
									background: "rgba(0,0,0,0.4)",
									color: "#fff",
									borderRadius: 4,
									padding: "2px 6px",
									cursor: "pointer",
								}}
							>
								✕
							</button>
						</div>
					) : (
						<div
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
									wordBreak: "break-all",
								}}
							>
								{f.name}
							</div>
							<div style={{ fontSize: 11, color: "#6b7280" }}>
								{Math.round(f.size / 1024)} KB
							</div>
							<button
								type="button"
								onClick={() => onRemove(i)}
								style={{
									border: "none",
									background: "transparent",
									cursor: "pointer",
								}}
							>
								✕
							</button>
						</div>
					)}
				</div>
			))}
		</div>
	);
}
