/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

type Reporter = {
	id: string | number;
	name: string;
	avatar?: string;
	contact?: string;
};

type Report = {
	id: string | number;
	reporter: Reporter;
	message: string;
	originalMessage?: string;
	messageLink?: string;
	attachments?: { id: string | number; name: string; url?: string }[];
	type?: string;
	severity?: "low" | "medium" | "high";
	createdAt: string;
	read?: boolean;
	status?: "open" | "resolved" | "dismissed";
	adminNotes?: string;
};

type Row = {
	id: string | number;
	avatar?: string;
	userName: string;
	reports?: Report[];
	[k: string]: any;
};

type Props = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	row: Row | null;
	activeReportId: string | number | null;
	setActiveReportId: (id: string | number | null) => void;
	updateReport: (
		rowId: string | number,
		reportId: string | number,
		patch: Partial<Report>,
	) => void;
	toggleSingleReportRead: (
		rowId: string | number,
		reportId: string | number,
	) => void;
	deleteSingleReport: (
		rowId: string | number,
		reportId: string | number,
	) => void;
	markAllReportsRead: (rowId: string | number) => void;
};

export default function ReportDetailModal({
	open,
	onOpenChange,
	row,
	activeReportId,
	setActiveReportId,
	updateReport,
	toggleSingleReportRead,
	deleteSingleReport,
	markAllReportsRead,
}: Props) {
	const activeReport =
		row?.reports?.find((r) => r.id === activeReportId) ?? null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-5xl w-full mx-4 p-4">
				<DialogHeader>
					<DialogTitle>
						Reports — {row?.userName ?? ""} ({row?.reports?.length ?? 0})
					</DialogTitle>
				</DialogHeader>

				<div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
					{/* left list */}
					<div className="col-span-1 md:col-span-1 space-y-2 max-h-[60vh] overflow-auto">
						{row?.reports && row.reports.length > 0 ? (
							row.reports.map((rep) => (
								<button
									key={rep.id}
									onClick={() => setActiveReportId(rep.id)}
									className={`w-full text-left p-3 rounded border flex items-start gap-3 ${
										rep.id === activeReportId
											? "bg-white border-blue-300 shadow"
											: "bg-gray-50 border-transparent"
									}`}
								>
									<div className="flex-1">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-3">
												<img
													src={rep.reporter.avatar}
													alt={rep.reporter.name}
													className="w-8 h-8 rounded-full"
												/>
												<div>
													<div className="text-sm font-semibold">
														{rep.reporter.name}
													</div>
													<div className="text-xs text-gray-400">
														{rep.type} • {rep.severity}
													</div>
												</div>
											</div>
											<div className="text-xs text-gray-400">
												{new Date(rep.createdAt).toLocaleString()}
											</div>
										</div>

										<div className="mt-2 text-sm text-gray-700 line-clamp-3">
											{rep.message}
										</div>

										<div className="mt-2 flex items-center gap-2">
											{!rep.read && (
												<span
													className="inline-block w-2 h-2 rounded-full"
													style={{ backgroundColor: "red" }}
												/>
											)}
											<span className="text-xs text-gray-500">
												{rep.status}
											</span>
										</div>
									</div>
								</button>
							))
						) : (
							<div className="text-sm text-gray-500">Không có report.</div>
						)}
					</div>

					{/* right detail */}
					<div className="col-span-2 md:col-span-2">
						{activeReport ? (
							<div className="p-4 border rounded bg-white max-h-[60vh] overflow-auto">
								<div className="flex items-start gap-4">
									<img
										src={activeReport.reporter.avatar}
										alt={activeReport.reporter.name}
										className="w-12 h-12 rounded-full"
									/>
									<div className="flex-1">
										<div className="flex items-center justify-between">
											<div>
												<div className="text-lg font-semibold">
													{activeReport.reporter.name}
												</div>
												<div className="text-xs text-gray-400">
													{activeReport.reporter.contact}
												</div>
											</div>

											<div className="text-right">
												<div className="text-sm text-gray-500">
													{new Date(activeReport.createdAt).toLocaleString()}
												</div>
												<div className="text-xs mt-1">
													<span className="px-2 py-1 text-xs rounded bg-gray-100">
														{activeReport.type}
													</span>
													<span className="ml-2 px-2 py-1 text-xs rounded bg-gray-100">
														{activeReport.severity}
													</span>
												</div>
											</div>
										</div>

										<div className="mt-4 text-sm text-gray-800 whitespace-pre-wrap">
											{activeReport.message}
										</div>

										{activeReport.originalMessage ? (
											<div className="mt-4">
												<div className="text-xs text-gray-500">
													Original message / excerpt:
												</div>
												<div className="mt-1 p-3 bg-gray-50 rounded text-sm">
													{activeReport.originalMessage}
												</div>
												{activeReport.messageLink ? (
													<a
														href={activeReport.messageLink}
														className="text-sm text-blue-600 underline mt-2 inline-block"
													>
														Open message
													</a>
												) : null}
											</div>
										) : null}

										{activeReport.attachments &&
										activeReport.attachments.length > 0 ? (
											<div className="mt-4">
												<div className="text-xs text-gray-500">Attachments</div>
												<ul className="mt-2 space-y-1">
													{activeReport.attachments.map((a) => (
														<li key={a.id}>
															<a
																href={a.url ?? "#"}
																className="text-sm text-blue-600 underline"
															>
																{a.name}
															</a>
														</li>
													))}
												</ul>
											</div>
										) : null}

										<div className="mt-4">
											<label className="text-xs text-gray-500">
												Admin notes
											</label>
											<Textarea
												value={activeReport.adminNotes ?? ""}
												onChange={(e) =>
													updateReport(row!.id, activeReport.id, {
														adminNotes: e.target.value,
													})
												}
												className="w-full mt-2 p-2 border rounded min-h-[80px] text-sm"
											/>
										</div>

										<div className="mt-4 flex items-center gap-2">
											<button
												onClick={() =>
													toggleSingleReportRead(row!.id, activeReport.id)
												}
												className={`px-3 py-1 text-sm rounded ${activeReport.read ? "bg-gray-100" : "bg-blue-600 text-white"}`}
											>
												{activeReport.read ? "Mark unread" : "Mark read"}
											</button>

											<button
												onClick={() =>
													updateReport(row!.id, activeReport.id, {
														status:
															activeReport.status === "resolved"
																? "open"
																: "resolved",
													})
												}
												className={`px-3 py-1 text-sm rounded ${activeReport.status === "resolved" ? "bg-gray-100" : "bg-green-600 text-white"}`}
											>
												{activeReport.status === "resolved"
													? "Reopen"
													: "Resolve"}
											</button>

											<button
												onClick={() =>
													deleteSingleReport(row!.id, activeReport.id)
												}
												className="px-3 py-1 text-sm rounded bg-red-100 text-red-600"
											>
												Delete
											</button>
										</div>
									</div>
								</div>
							</div>
						) : (
							<div className="p-4 border rounded bg-gray-50 text-sm text-gray-500">
								Chọn một report để xem chi tiết.
							</div>
						)}
					</div>
				</div>

				<DialogFooter className="flex justify-end mt-4">
					<button
						onClick={() => onOpenChange(false)}
						className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
					>
						Close
					</button>
					<button
						onClick={() => {
							if (row) markAllReportsRead(row.id);
						}}
						className="ml-2 px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
					>
						Mark all read
					</button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
