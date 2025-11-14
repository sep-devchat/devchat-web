import React from "react";
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
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Report user</DialogTitle>
					<DialogDescription>
						Tell us briefly why you're reporting this user. Our team will review
						it.
					</DialogDescription>
				</DialogHeader>
				<textarea
					className="w-full border rounded-md p-2 text-sm min-h-[100px]"
					placeholder="Reason (required)"
					value={reason}
					onChange={(e) => onReasonChange(e.target.value)}
				/>
				<DialogFooter>
					<DialogClose className="inline-flex items-center justify-center h-9 rounded-md border px-4 text-sm font-medium bg-white hover:bg-slate-50">
						Cancel
					</DialogClose>
					<Button
						disabled={!reason.trim() || submitting}
						onClick={() => onSubmit()}
					>
						Submit
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
