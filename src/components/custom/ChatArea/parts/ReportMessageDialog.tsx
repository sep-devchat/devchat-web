import React, { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChevronsUpDown, Loader2 } from "lucide-react";
import { MessageResponse } from "@/services/messageAPI";
import {
	listReportCategoriesPublic,
	type ReportCategory,
} from "@/services/reportCategoryAPI";
import { createReport, MessageReportType } from "@/services/reportAPI";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface ReportMessageDialogProps {
	open: boolean;
	message: MessageResponse | null;
	messageType?: MessageReportType;
	onOpenChange: (open: boolean) => void;
}

export const ReportMessageDialog: React.FC<ReportMessageDialogProps> = ({
	open,
	message,
	messageType,
	onOpenChange,
}) => {
	const [notes, setNotes] = useState("");
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [formError, setFormError] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);
	const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
	const categoryPickerRef = useRef<HTMLDivElement | null>(null);

	const { data: categoriesData, isLoading: categoriesLoading } = useQuery<
		ReportCategory[]
	>({
		queryKey: ["report_categories_public"],
		queryFn: async () => {
			const resp = await listReportCategoriesPublic();
			return ((resp as any)?.data ?? resp) as ReportCategory[];
		},
		enabled: open,
		staleTime: 5 * 60 * 1000,
	});

	const categories = useMemo(() => categoriesData ?? [], [categoriesData]);
	const selectedCategoryLabels = useMemo(() => {
		if (!selectedCategories.length || !categories.length) return [];
		return selectedCategories
			.map((id) => categories.find((category) => category.id === id)?.name)
			.filter((label): label is string => !!label);
	}, [selectedCategories, categories]);

	useEffect(() => {
		if (open) {
			setNotes("");
			setSelectedCategories([]);
			setFormError(null);
			setCategoryMenuOpen(false);
		}
	}, [open, message?.id]);

	useEffect(() => {
		if (!categoryMenuOpen) return;
		const handleClickOutside = (event: MouseEvent) => {
			if (!categoryPickerRef.current) return;
			if (!categoryPickerRef.current.contains(event.target as Node)) {
				setCategoryMenuOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [categoryMenuOpen]);

	const toggleCategory = (id: string) => {
		setSelectedCategories((prev) =>
			prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id],
		);
	};

	const previewContent = useMemo(() => {
		if (!message) return "Select a message to continue";
		return message.content?.trim() || "(no text content)";
	}, [message]);

	const handleSubmit = async () => {
		if (!message) {
			toast.error("No message selected to report");
			return;
		}
		if (!messageType) {
			toast.error("Cannot determine report type for this message");
			return;
		}
		if (!selectedCategories.length) {
			setFormError("Select at least one category");
			return;
		}

		try {
			setSubmitting(true);
			setFormError(null);

			await createReport({
				messageId: message.id,
				reportCategoryIds: Array.from(new Set(selectedCategories)),
				messageType,
				content: notes.trim() ? notes.trim() : undefined,
			});

			toast.success("Report submitted");
			onOpenChange(false);
		} catch (error: any) {
			const apiMessage =
				error?.response?.data?.message ?? "Failed to submit report";
			toast.error(apiMessage);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Report message</DialogTitle>
					<DialogDescription>
						Select all categories that apply and provide any additional context.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					<div className="rounded-md border bg-muted/30 p-3 text-sm">
						<p className="text-xs font-semibold uppercase text-muted-foreground">
							Reporting message
						</p>
						<p className="mt-1 font-medium">
							{message?.sender?.username ||
								message?.sender?.email ||
								"Unknown user"}
						</p>
						<p className="mt-2 whitespace-pre-wrap text-muted-foreground">
							{previewContent}
						</p>
					</div>

					<div className="space-y-2">
						<p className="text-sm font-medium">Categories</p>
						{categoriesLoading ? (
							<div className="flex items-center gap-2 text-sm text-muted-foreground">
								<Loader2 className="h-4 w-4 animate-spin" /> Loading categories…
							</div>
						) : categories.length ? (
							<>
								<div className="relative" ref={categoryPickerRef}>
									<Button
										type="button"
										variant="outline"
										className="w-full justify-between"
										onClick={() => setCategoryMenuOpen((prev) => !prev)}
									>
										<span>
											{selectedCategoryLabels.length
												? `${selectedCategoryLabels.length} selected`
												: "Select categories"}
										</span>
										<ChevronsUpDown className="h-4 w-4 opacity-60" />
									</Button>
									{categoryMenuOpen && (
										<div className="absolute left-0 top-full z-50 mt-2 w-full rounded-md border bg-background p-2 shadow-lg">
											<div className="max-h-64 space-y-2 overflow-y-auto pr-1">
												{categories.map((category) => {
													const checked = selectedCategories.includes(
														category.id,
													);
													return (
														<button
															type="button"
															key={category.id}
															className="flex w-full items-start gap-2 rounded-md px-2 py-1 text-left transition hover:bg-muted/70"
															onClick={() => toggleCategory(category.id)}
														>
															<Checkbox
																checked={checked}
																className="pointer-events-none"
															/>
															<div>
																<p className="text-sm font-medium">
																	{category.name}
																</p>
																{category.description && (
																	<p className="text-xs text-muted-foreground">
																		{category.description}
																	</p>
																)}
															</div>
														</button>
													);
												})}
											</div>
										</div>
									)}
								</div>

								{selectedCategoryLabels.length > 0 ? (
									<div className="flex flex-wrap gap-2 rounded-md border border-dashed border-border/70 bg-muted/40 p-2 text-sm">
										{selectedCategoryLabels.map((label) => (
											<span
												key={label}
												className="rounded-full bg-background px-2 py-0.5 text-xs shadow-sm"
											>
												{label}
											</span>
										))}
									</div>
								) : (
									<p className="text-xs text-muted-foreground">
										You can select multiple categories.
									</p>
								)}
							</>
						) : (
							<p className="text-sm text-muted-foreground">
								No categories available. Please contact an administrator.
							</p>
						)}
						{formError && <p className="text-sm text-red-500">{formError}</p>}
					</div>

					<div className="space-y-2">
						<Label htmlFor="report-notes">Additional details</Label>
						<Textarea
							id="report-notes"
							placeholder="Optional context that helps moderators review faster"
							value={notes}
							onChange={(event) => setNotes(event.target.value)}
							maxLength={1000}
						/>
						<p className="text-xs text-muted-foreground">
							{notes.length}/1000 characters
						</p>
					</div>
				</div>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={submitting}
					>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						disabled={submitting || categoriesLoading}
					>
						{submitting ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting…
							</>
						) : (
							"Submit"
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
