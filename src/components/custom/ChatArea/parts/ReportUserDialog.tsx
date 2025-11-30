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
import { Button } from "@/components/ui/button";

interface ReportUserDialogProps {
	open: boolean;
	reason: string;
	submitting: boolean;
	onOpenChange: (open: boolean) => void;
	onReasonChange: (value: string) => void;
	onSubmit: () => Promise<void> | void;
}

export const ReportUserDialog: React.FC<ReportUserDialogProps> = ({
	open,
	reason,
	submitting,
	onOpenChange,
	onReasonChange,
	onSubmit,
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
		if (windowWidth >= 1440) return { base: "17px", sm: "16px", xs: "13px" };
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
						Report user
					</DialogTitle>
					<DialogDescription style={{ fontSize: fontSizes.sm }}>
						Tell us briefly why you're reporting this user. Our team will review
						it.
					</DialogDescription>
				</DialogHeader>
				<textarea
					className="w-full border rounded-md p-2 min-h-[100px]"
					placeholder="Reason (required)"
					value={reason}
					onChange={(e) => onReasonChange(e.target.value)}
					style={{ fontSize: fontSizes.sm }}
				/>
				<DialogFooter>
					<DialogClose
						className="inline-flex items-center justify-center h-9 rounded-md border px-4 font-medium bg-white hover:bg-slate-50"
						style={{ fontSize: fontSizes.sm }}
					>
						Cancel
					</DialogClose>
					<Button
						disabled={!reason.trim() || submitting}
						onClick={() => onSubmit()}
						style={{ fontSize: fontSizes.sm }}
					>
						Submit
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
