import React from "react";
import { MessageResponse } from "@/services/messageAPI";
import { MessageReportType } from "@/services/reportAPI";
import { DeleteMessageDialog } from "./DeleteMessageDialog";
import { ReportMessageDialog } from "./ReportMessageDialog";

export interface ChatDialogsProps {
	deleteDialogOpen: boolean;
	deleteSubmitting: boolean;
	messagePendingDelete: MessageResponse | null;
	onDeleteDialogOpenChange: (open: boolean) => void;
	onConfirmDelete: () => void;

	reportMessageDialogOpen: boolean;
	messagePendingReport: MessageResponse | null;
	reportMessageType: MessageReportType | null;
	onReportMessageDialogOpenChange: (open: boolean) => void;
}

const ChatDialogs: React.FC<ChatDialogsProps> = ({
	deleteDialogOpen,
	deleteSubmitting,
	messagePendingDelete,
	onDeleteDialogOpenChange,
	onConfirmDelete,
	reportMessageDialogOpen,
	messagePendingReport,
	reportMessageType,
	onReportMessageDialogOpenChange,
}) => {
	return (
		<>
			<DeleteMessageDialog
				open={deleteDialogOpen}
				messageContent={messagePendingDelete?.content || null}
				submitting={deleteSubmitting}
				onOpenChange={onDeleteDialogOpenChange}
				onConfirm={onConfirmDelete}
			/>
			<ReportMessageDialog
				open={reportMessageDialogOpen}
				message={messagePendingReport}
				messageType={reportMessageType ?? null}
				onOpenChange={onReportMessageDialogOpenChange}
			/>
		</>
	);
};

export default ChatDialogs;
