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
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete message?</DialogTitle>
					<DialogDescription>
						This action cannot be undone. The message will be permanently
						removed for everyone in this conversation.
					</DialogDescription>
				</DialogHeader>
				<div className="rounded-md bg-slate-50 border p-3 text-sm text-slate-700 max-h-40 overflow-auto">
					{messageContent || "(No text content)"}
				</div>
				<DialogFooter>
					<DialogClose className="inline-flex items-center justify-center h-9 rounded-md border px-4 text-sm font-medium bg-white hover:bg-slate-50">
						Cancel
					</DialogClose>
					<button
						onClick={onConfirm}
						disabled={submitting}
						className="inline-flex items-center justify-center h-9 rounded-md px-4 text-sm font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
					>
						{submitting ? "Deleting…" : "Delete"}
					</button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
