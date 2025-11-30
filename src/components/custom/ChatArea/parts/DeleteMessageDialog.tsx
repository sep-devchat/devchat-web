import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

interface DeleteMessageDialogProps {
	open: boolean;
	messageContent: string | null;
	submitting: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
}

export const DeleteMessageDialog: React.FC<DeleteMessageDialogProps> = ({
	open,
	messageContent,
	submitting,
	onOpenChange,
	onConfirm,
}) => {
	const [windowWidth, setWindowWidth] = useState(
		typeof window !== "undefined" ? window.innerWidth : 1440,
	);

	useEffect(() => {
		const handleResize = () => setWindowWidth(window.innerWidth);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const getResponsiveScale = () => {
		if (windowWidth <= 1220) return 0.7;
		if (windowWidth >= 1920) return 1.1;
		if (windowWidth >= 1440) return 0.8;
		return 1;
	};

	const getFontSizes = () => {
		if (windowWidth <= 1220) return { base: "20px", sm: "18px", xs: "16px" };
		if (windowWidth >= 1920) return { base: "16px", sm: "14px", xs: "13px" };
		if (windowWidth >= 1440) return { base: "20px", sm: "16px", xs: "13px" };
		return { base: "18px", sm: "17px", xs: "14px" };
	};

	const fontSizes = getFontSizes();
	const scale = getResponsiveScale();

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				style={{ transform: `scale(${scale})`, transformOrigin: "center" }}
			>
				<DialogHeader>
					<DialogTitle style={{ fontSize: fontSizes.base }}>
						Delete message?
					</DialogTitle>
					<DialogDescription style={{ fontSize: fontSizes.sm }}>
						This action cannot be undone. The message will be permanently
						removed for everyone in this conversation.
					</DialogDescription>
				</DialogHeader>
				<div
					className="rounded-md bg-slate-50 border p-3 text-slate-700 max-h-40 overflow-auto"
					style={{ fontSize: fontSizes.sm }}
				>
					{messageContent || "(No text content)"}
				</div>
				<DialogFooter>
					<DialogClose
						className="inline-flex items-center justify-center h-9 rounded-md border px-4 font-medium bg-white hover:bg-slate-50"
						style={{ fontSize: fontSizes.sm }}
					>
						Cancel
					</DialogClose>
					<button
						onClick={onConfirm}
						disabled={submitting}
						className="inline-flex items-center justify-center h-9 rounded-md px-4 font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
						style={{ fontSize: fontSizes.sm }}
					>
						{submitting ? "Deleting…" : "Delete"}
					</button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
