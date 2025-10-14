import React, { useEffect, useState, useCallback } from "react";

type Props = {
	src: string;
	alt?: string;
	maxWidthPx?: number; // ex: 420
	maxHeightPx?: number; // ex: 520
	clickable?: boolean;
	className?: string;
};

export const ImageWithModal: React.FC<Props> = ({
	src,
	alt = "image",
	maxWidthPx = 420,
	maxHeightPx = 520,
	clickable = true,
	className = "",
}) => {
	const [open, setOpen] = useState(false);
	const [failed, setFailed] = useState(false);

	const onOpen = useCallback(() => {
		if (!clickable) return;
		setOpen(true);
	}, [clickable]);

	const onClose = useCallback(() => {
		setOpen(false);
	}, []);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		if (open) window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, onClose]);

	// STYLE: maxWidth uses CSS min() so it will be the lesser of maxWidthPx and 100% of container
	const inlineStyle: React.CSSProperties = {
		width: "auto",
		height: "auto",
		// `min()` / `max()` work in modern browsers; min(maxPx, 100%) => don't overflow container
		maxWidth: `min(${maxWidthPx}px, 100%)`,
		maxHeight: `${maxHeightPx}px`,
		cursor: clickable ? "pointer" : "default",
		display: "block",
	};

	return (
		<>
			<img
				src={src}
				alt={alt}
				loading="lazy"
				onError={() => setFailed(true)}
				onClick={onOpen}
				style={inlineStyle}
				className={`rounded-md object-contain ${className}`}
			/>

			{failed && (
				<div className="text-xs text-muted-foreground mt-1">
					Failed to load image
				</div>
			)}

			{open && (
				<div
					role="dialog"
					aria-modal="true"
					className="fixed inset-0 z-50 flex items-center justify-center p-4"
					onClick={onClose}
					style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
				>
					<div
						onClick={(e) => e.stopPropagation()}
						className="rounded shadow-2xl"
						style={{
							maxWidth: "90vw",
							maxHeight: "90vh",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<img
							src={src}
							alt={alt}
							loading="eager"
							style={{
								width: "auto",
								height: "auto",
								maxWidth: "90vw",
								maxHeight: "90vh",
								display: "block",
								borderRadius: 8,
							}}
						/>
					</div>
				</div>
			)}
		</>
	);
};
