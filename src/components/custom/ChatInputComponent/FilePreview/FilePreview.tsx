type Props = {
	files: File[];
	imagePreviews: string[];
	onRemove: (index: number) => void;
};

export default function FilePreview({ files, imagePreviews, onRemove }: Props) {
	if (!files || files.length === 0) return null;
	return (
		<div
			className="max-[1220px]:mt-[5.6px] min-[1440px]:mt-[6.4px] min-[1920px]:mt-[8.8px]"
			style={{ marginTop: 8 }}
		>
			{files.map((f, i) => (
				<div
					key={i}
					className="max-[1220px]:mb-[5.6px] min-[1440px]:mb-[6.4px] min-[1920px]:mb-[8.8px]"
					style={{ marginBottom: 8 }}
				>
					{f.type.startsWith("image/") ? (
						<div
							className="max-[1220px]:w-[44.8px] max-[1220px]:h-[44.8px] max-[1220px]:rounded-[4.2px] min-[1440px]:w-[51.2px] min-[1440px]:h-[51.2px] min-[1440px]:rounded-[4.8px] min-[1920px]:w-[70.4px] min-[1920px]:h-[70.4px] min-[1920px]:rounded-[6.6px]"
							style={{
								width: 64,
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
								className="max-[1220px]:top-[2.8px] max-[1220px]:right-[2.8px] max-[1220px]:rounded-[2.8px] max-[1220px]:py-[1.4px] max-[1220px]:px-[4.2px] min-[1440px]:top-[3.2px] min-[1440px]:right-[3.2px] min-[1440px]:rounded-[3.2px] min-[1440px]:py-[1.6px] min-[1440px]:px-[4.8px] min-[1920px]:top-[4.4px] min-[1920px]:right-[4.4px] min-[1920px]:rounded-[4.4px] min-[1920px]:py-[2.2px] min-[1920px]:px-[6.6px]"
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
							className="max-[1220px]:gap-[5.6px] max-[1220px]:p-[4.2px] max-[1220px]:rounded-[5.6px] min-[1440px]:gap-[6.4px] min-[1440px]:p-[4.8px] min-[1440px]:rounded-[6.4px] min-[1920px]:gap-[8.8px] min-[1920px]:p-[6.6px] min-[1920px]:rounded-[8.8px]"
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
								className="max-[1220px]:text-[8.4px] max-[1220px]:max-w-[140px] min-[1440px]:text-[9.6px] min-[1440px]:max-w-[160px] min-[1920px]:text-[13.2px] min-[1920px]:max-w-[220px]"
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
							<div
								className="max-[1220px]:text-[7.7px] min-[1440px]:text-[8.8px] min-[1920px]:text-[12.1px]"
								style={{ fontSize: 11, color: "#6b7280" }}
							>
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
