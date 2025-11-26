import React from "react";
import { MessageResponse } from "@/services/messageAPI";
import { MessageReportType } from "@/services/reportAPI";
import { DeleteMessageDialog } from "./DeleteMessageDialog";
import { ReportUserDialog } from "./ReportUserDialog";
import { ReportMessageDialog } from "./ReportMessageDialog";

export interface ChatDialogsProps {
	deleteDialogOpen: boolean;
	deleteSubmitting: boolean;
	messagePendingDelete: MessageResponse | null;
	onDeleteDialogOpenChange: (open: boolean) => void;
	onConfirmDelete: () => void;

	reportDialogOpen: boolean;
	reportReason: string;
	reportSubmitting: boolean;
	onReportDialogOpenChange: (open: boolean) => void;
	onReportReasonChange: (value: string) => void;
	onReportSubmit: () => Promise<void> | void;

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
	reportDialogOpen,
	reportReason,
	reportSubmitting,
	onReportDialogOpenChange,
	onReportReasonChange,
	onReportSubmit,
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
			<ReportUserDialog
				open={reportDialogOpen}
				reason={reportReason}
				submitting={reportSubmitting}
				onOpenChange={onReportDialogOpenChange}
				onReasonChange={onReportReasonChange}
				onSubmit={onReportSubmit}
			/>
			<ReportMessageDialog
				open={reportMessageDialogOpen}
				message={messagePendingReport}
				messageType={reportMessageType ?? undefined}
				onOpenChange={onReportMessageDialogOpenChange}
			/>
		</>
	);
};

export default ChatDialogs;
