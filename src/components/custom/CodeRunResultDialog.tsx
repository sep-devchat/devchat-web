import React from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

interface CodeRunResultDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	language?: string;
	lastRunAt?: string;
	output: string;
	error: string;
	title?: string;
}

const CodeRunResultDialog: React.FC<CodeRunResultDialogProps> = ({
	open,
	onOpenChange,
	language,
	lastRunAt,
	output,
	error,
	title = "Execution Result",
}) => {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="w-full max-w-[min(95vw,720px)] p-0 overflow-hidden border border-slate-200 bg-white text-slate-900">
				<DialogHeader className="px-4 py-3 border-b border-slate-200 bg-slate-50">
					<DialogTitle className="text-base font-semibold tracking-tight text-slate-900">
						{title}
					</DialogTitle>
					<div className="text-xs text-slate-500">
						{language ? `${language} • ` : ""}
						{lastRunAt || "Just now"}
					</div>
				</DialogHeader>
				<div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto bg-white">
					{error ? (
						<div className="rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm p-3 whitespace-pre-wrap break-words">
							{error}
						</div>
					) : (
						<pre className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs sm:text-sm text-slate-900 whitespace-pre-wrap break-words max-h-[55vh] overflow-auto">
							{output || ""}
						</pre>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default CodeRunResultDialog;
