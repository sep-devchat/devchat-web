import React, { useState } from "react";
import * as S from "./TaskGroup.styled";
import { Filter, Search as SearchIcon } from "lucide-react";
import { TaskPriority, TaskStatus } from "@/types/task";
import {
	FILTER_STATUS_OPTIONS,
	FILTER_PRIORITY_OPTIONS,
} from "./filterOptions";
import CustomSelect from "../../CustomSelect/CustomSelect";
import CustomDateTimePicker from "../../CustomDateTimePicker/CustomDateTimePicker";
import SearchInput from "../../SearchInput/SearchInput";
import IconButton from "../../ActionButton/IconButton";
import { Checkbox } from "@/components/ui/checkbox";
import { TaskFilters } from "./TaskGroup.types";

type GroupMember = { id: string; username: string };

type Props = {
	appliedFilters: TaskFilters;
	setAppliedFilters: (
		f: TaskFilters | ((prev: TaskFilters) => TaskFilters),
	) => void;
	groupMembers: GroupMember[];
	searchTerm: string;
	setSearchTerm: (s: string) => void;
	setDebouncedSearch: (s: string) => void;
};

const STATUS_ORDER = FILTER_STATUS_OPTIONS.map(
	(option) => Number(option.value) as TaskStatus,
);
const PRIORITY_ORDER = FILTER_PRIORITY_OPTIONS.map(
	(option) => Number(option.value) as TaskPriority,
);

const STATUS_LABEL_MAP = FILTER_STATUS_OPTIONS.reduce(
	(acc, option) => {
		acc[Number(option.value) as TaskStatus] = option.label;
		return acc;
	},
	{} as Record<TaskStatus, string>,
);

const PRIORITY_LABEL_MAP = FILTER_PRIORITY_OPTIONS.reduce(
	(acc, option) => {
		acc[Number(option.value) as TaskPriority] = option.label;
		return acc;
	},
	{} as Record<TaskPriority, string>,
);

const toggleWithOrder = <T extends number>(
	list: T[] | undefined,
	value: T,
	order: T[],
): T[] => {
	const next = new Set(list ?? []);
	if (next.has(value)) {
		next.delete(value);
	} else {
		next.add(value);
	}
	return order.filter((entry) => next.has(entry));
};

const formatSelection = <T extends number>(
	values: T[] | undefined,
	labels: Record<T, string>,
) => {
	if (!values?.length) return "";
	return values.map((value) => labels[value] ?? String(value)).join(", ");
};

const SearchFilter: React.FC<Props> = ({
	appliedFilters,
	setAppliedFilters,
	groupMembers,
	searchTerm,
	setSearchTerm,
	setDebouncedSearch,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [tempFilters, setTempFilters] = useState<TaskFilters>({});
	const [dateErrors, setDateErrors] = useState<{
		startDate?: string;
		dueDate?: string;
	}>({});

	const openModal = () => {
		setTempFilters({
			status: appliedFilters.status ? [...appliedFilters.status] : [],
			assigneeId: appliedFilters.unassigned
				? ""
				: (appliedFilters.assigneeId ?? ""),
			unassigned: !!appliedFilters.unassigned,
			priority: appliedFilters.priority ? [...appliedFilters.priority] : [],
			startDateFrom: appliedFilters.startDateFrom || "",
			startDateTo: appliedFilters.startDateTo || "",
			dueDateFrom: appliedFilters.dueDateFrom || "",
			dueDateTo: appliedFilters.dueDateTo || "",
		});
		setDateErrors({});
		setIsOpen(true);
	};

	const formatDateRange = (from?: string, to?: string) => {
		if (!from && !to) return "";
		const formatDate = (dateStr: string) => {
			const date = new Date(dateStr);
			return date.toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric",
			});
		};
		if (from && to) return `${formatDate(from)} - ${formatDate(to)}`;
		if (from) return `From ${formatDate(from)}`;
		if (to) return `Until ${formatDate(to)}`;
		return "";
	};

	const removeFilter = (key: keyof TaskFilters) => {
		setAppliedFilters((prev: TaskFilters) => {
			const next = { ...prev };
			delete next[key];
			return next;
		});
	};

	const validateDateRanges = (filters: TaskFilters) => {
		const errors: { startDate?: string; dueDate?: string } = {};

		// Helper function to parse date string properly, handling various formats
		const parseDate = (dateStr: string): Date | null => {
			if (!dateStr || typeof dateStr !== "string") return null;
			try {
				// Trim whitespace
				const trimmed = dateStr.trim();
				if (!trimmed) return null;

				// Parse the date
				const date = new Date(trimmed);

				// Check if date is valid
				if (isNaN(date.getTime())) return null;

				return date;
			} catch {
				return null;
			}
		};

		// Validate start date range
		if (filters.startDateFrom && filters.startDateTo) {
			const startFrom = parseDate(filters.startDateFrom);
			const startTo = parseDate(filters.startDateTo);
			if (startFrom && startTo) {
				const fromTime = startFrom.getTime();
				const toTime = startTo.getTime();
				if (fromTime > toTime) {
					errors.startDate = "Start date 'From' cannot be later than 'To'.";
				}
			}
		}

		// Validate due date range
		if (filters.dueDateFrom && filters.dueDateTo) {
			const dueFrom = parseDate(filters.dueDateFrom);
			const dueTo = parseDate(filters.dueDateTo);
			if (dueFrom && dueTo) {
				const fromTime = dueFrom.getTime();
				const toTime = dueTo.getTime();
				if (fromTime > toTime) {
					errors.dueDate = "Due date 'From' cannot be later than 'To'.";
				}
			}
		}

		// Validate due date >= start date (due date start must be >= start date end)
		if (filters.startDateTo && filters.dueDateFrom) {
			const startTo = parseDate(filters.startDateTo);
			const dueFrom = parseDate(filters.dueDateFrom);
			if (startTo && dueFrom) {
				if (dueFrom.getTime() < startTo.getTime()) {
					errors.dueDate =
						"Due date must be greater than or equal to start date.";
				}
			}
		}

		setDateErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const statusSummary = formatSelection(
		appliedFilters.status,
		STATUS_LABEL_MAP,
	);
	const prioritySummary = formatSelection(
		appliedFilters.priority,
		PRIORITY_LABEL_MAP,
	);

	const handleStatusToggle = (value: TaskStatus) => {
		setTempFilters((prev) => ({
			...prev,
			status: toggleWithOrder(prev.status, value, STATUS_ORDER),
		}));
	};

	const handlePriorityToggle = (value: TaskPriority) => {
		setTempFilters((prev) => ({
			...prev,
			priority: toggleWithOrder(prev.priority, value, PRIORITY_ORDER),
		}));
	};

	const modalStatusSelection = tempFilters.status ?? [];
	const modalPrioritySelection = tempFilters.priority ?? [];

	return (
		<S.FilterArea>
			<S.FilterRow>
				<S.SearchContainer>
					<S.SearchIconWrapper aria-hidden>
						<SearchIcon size={16} />
					</S.SearchIconWrapper>
					<SearchInput
						value={searchTerm}
						onChange={(e) => setSearchTerm(e)}
						onClear={() => {
							setSearchTerm("");
							setDebouncedSearch("");
						}}
						placeholder="Search tasks by name, description, assignee..."
						style={{ width: "100%" }}
					/>
				</S.SearchContainer>

				<IconButton
					icon={Filter}
					size={37}
					onClick={openModal}
					ariaLabel="Filter"
				/>
			</S.FilterRow>

			<S.FilterRow>
				<S.FilterTags>
					{statusSummary && (
						<S.FilterChip bg="#eef2ff" color="#4338ca">
							<span>
								<strong>Status:</strong> {statusSummary}
							</span>
							<S.ChipClose onClick={() => removeFilter("status")}>
								×
							</S.ChipClose>
						</S.FilterChip>
					)}
					{prioritySummary && (
						<S.FilterChip bg="#eef2ff" color="#4338ca">
							<span>
								<strong>Priority:</strong> {prioritySummary}
							</span>
							<S.ChipClose onClick={() => removeFilter("priority")}>
								×
							</S.ChipClose>
						</S.FilterChip>
					)}
					{appliedFilters.assigneeId && (
						<S.FilterChip bg="#eef2ff" color="#4338ca">
							<span>
								<strong>Assignee:</strong>{" "}
								{(() => {
									const match = groupMembers.find(
										(member) => member.id === appliedFilters.assigneeId,
									);
									return match ? match.username : appliedFilters.assigneeId;
								})()}
							</span>
							<S.ChipClose onClick={() => removeFilter("assigneeId")}>
								×
							</S.ChipClose>
						</S.FilterChip>
					)}
					{appliedFilters.unassigned && (
						<S.FilterChip bg="#eef2ff" color="#4338ca">
							<span>
								<strong>Unassigned</strong>
							</span>
							<S.ChipClose onClick={() => removeFilter("unassigned")}>
								×
							</S.ChipClose>
						</S.FilterChip>
					)}
					{formatDateRange(
						appliedFilters.startDateFrom,
						appliedFilters.startDateTo,
					) && (
						<S.FilterChip bg="#eef2ff" color="#4338ca">
							<span>
								<strong>Start:</strong>{" "}
								{formatDateRange(
									appliedFilters.startDateFrom,
									appliedFilters.startDateTo,
								)}
							</span>
							<S.ChipClose
								onClick={() => {
									removeFilter("startDateFrom");
									removeFilter("startDateTo");
								}}
							>
								×
							</S.ChipClose>
						</S.FilterChip>
					)}
					{formatDateRange(
						appliedFilters.dueDateFrom,
						appliedFilters.dueDateTo,
					) && (
						<S.FilterChip bg="#eef2ff" color="#4338ca">
							<span>
								<strong>Due:</strong>{" "}
								{formatDateRange(
									appliedFilters.dueDateFrom,
									appliedFilters.dueDateTo,
								)}
							</span>
							<S.ChipClose
								onClick={() => {
									removeFilter("dueDateFrom");
									removeFilter("dueDateTo");
								}}
							>
								×
							</S.ChipClose>
						</S.FilterChip>
					)}
				</S.FilterTags>
			</S.FilterRow>

			{isOpen && (
				<S.DialogOverlay open={isOpen} onClick={() => setIsOpen(false)}>
					<div onClick={(e) => e.stopPropagation()}>
						<S.DialogContent maxWidth="36rem">
							<S.DialogHeader>
								<S.DialogTitle>Filter Tasks</S.DialogTitle>
							</S.DialogHeader>

							<S.DialogBody>
								<S.FormColumn>
									<S.FormGroup>
										<S.Label>Status</S.Label>
										<div
											style={{
												display: "flex",
												flexDirection: "column",
												gap: 8,
											}}
										>
											{FILTER_STATUS_OPTIONS.map((option) => {
												const value = Number(option.value) as TaskStatus;
												const checked = modalStatusSelection.includes(value);
												return (
													<S.CheckboxLabel key={option.value}>
														<Checkbox
															checked={checked}
															onCheckedChange={() => handleStatusToggle(value)}
															aria-label={`status-${option.value}`}
														/>
														<span>{option.label}</span>
													</S.CheckboxLabel>
												);
											})}
										</div>
									</S.FormGroup>
								</S.FormColumn>

								<S.FormColumn>
									<S.FormGroup>
										<S.Label>Assignee</S.Label>
										<CustomSelect
											value={tempFilters.assigneeId ?? ""}
											onChange={(val: string) =>
												setTempFilters((t) => ({ ...t, assigneeId: val }))
											}
											disabled={!!tempFilters.unassigned}
											options={[
												{ value: "", label: "Any" },
												...groupMembers.map((member) => ({
													value: member.id,
													label: member.username,
												})),
											]}
										/>
										<S.FormGroup style={{ marginTop: 8 }}>
											<S.CheckboxLabel>
												<Checkbox
													id="unassigned-only"
													checked={!!tempFilters.unassigned}
													onCheckedChange={(checked) => {
														const isChecked = checked === true;
														setTempFilters((t) => ({
															...t,
															unassigned: isChecked,
															assigneeId: isChecked ? "" : t.assigneeId,
														}));
													}}
													aria-label="unassigned-only"
												/>
												<S.Tag>Unassigned only</S.Tag>
											</S.CheckboxLabel>
										</S.FormGroup>
									</S.FormGroup>
								</S.FormColumn>

								<S.FormColumn>
									<S.FormGroup>
										<S.Label>Priority</S.Label>
										<div
											style={{
												display: "flex",
												flexDirection: "column",
												gap: 8,
											}}
										>
											{FILTER_PRIORITY_OPTIONS.map((option) => {
												const value = Number(option.value) as TaskPriority;
												const checked = modalPrioritySelection.includes(value);
												return (
													<S.CheckboxLabel key={option.value}>
														<Checkbox
															checked={checked}
															onCheckedChange={() =>
																handlePriorityToggle(value)
															}
															aria-label={`priority-${option.value}`}
														/>
														<span>{option.label}</span>
													</S.CheckboxLabel>
												);
											})}
										</div>
									</S.FormGroup>
								</S.FormColumn>

								<S.FormColumn>
									<S.FormGroup>
										<S.Label>Start Date Range</S.Label>
										<S.FormGroup>
											<S.Label
												style={{ fontSize: "0.875rem", color: "#6b7280" }}
											>
												From
											</S.Label>
											<CustomDateTimePicker
												value={tempFilters.startDateFrom || ""}
												onChange={(val) => {
													setTempFilters((t) => ({ ...t, startDateFrom: val }));
													validateDateRanges({
														...tempFilters,
														startDateFrom: val,
													});
												}}
												allowClear
												showTime
												isAllowedPast
											/>
										</S.FormGroup>
										<S.FormGroup>
											<S.Label
												style={{ fontSize: "0.875rem", color: "#6b7280" }}
											>
												To
											</S.Label>
											<CustomDateTimePicker
												value={tempFilters.startDateTo || ""}
												onChange={(val) => {
													setTempFilters((t) => ({ ...t, startDateTo: val }));
													validateDateRanges({
														...tempFilters,
														startDateTo: val,
													});
												}}
												allowClear
												showTime
												isAllowedPast
											/>
										</S.FormGroup>
										{dateErrors.startDate && (
											<S.FieldError role="alert">
												{dateErrors.startDate}
											</S.FieldError>
										)}
									</S.FormGroup>
								</S.FormColumn>

								<S.FormColumn>
									<S.FormGroup>
										<S.Label>Due Date Range</S.Label>
										<S.FormGroup>
											<S.Label
												style={{ fontSize: "0.875rem", color: "#6b7280" }}
											>
												From
											</S.Label>
											<CustomDateTimePicker
												value={tempFilters.dueDateFrom || ""}
												onChange={(val) => {
													setTempFilters((t) => ({ ...t, dueDateFrom: val }));
													validateDateRanges({
														...tempFilters,
														dueDateFrom: val,
													});
												}}
												allowClear
												showTime
												isAllowedPast
											/>
										</S.FormGroup>
										<S.FormGroup>
											<S.Label
												style={{ fontSize: "0.875rem", color: "#6b7280" }}
											>
												To
											</S.Label>
											<CustomDateTimePicker
												value={tempFilters.dueDateTo || ""}
												onChange={(val) => {
													setTempFilters((t) => ({ ...t, dueDateTo: val }));
													validateDateRanges({
														...tempFilters,
														dueDateTo: val,
													});
												}}
												allowClear
												showTime
												isAllowedPast
											/>
										</S.FormGroup>
										{dateErrors.dueDate && (
											<S.FieldError role="alert">
												{dateErrors.dueDate}
											</S.FieldError>
										)}
									</S.FormGroup>
								</S.FormColumn>
							</S.DialogBody>

							<S.DialogFooter>
								<S.Button variant="ghost" onClick={() => setIsOpen(false)}>
									Cancel
								</S.Button>
								<S.Button
									variant="primary"
									onClick={() => {
										if (!validateDateRanges(tempFilters)) {
											return;
										}
										const unassignedOnly = tempFilters.unassigned
											? true
											: undefined;
										setAppliedFilters({
											status:
												tempFilters.status && tempFilters.status.length
													? [...tempFilters.status]
													: undefined,
											assigneeId: unassignedOnly
												? undefined
												: tempFilters.assigneeId || undefined,
											unassigned: unassignedOnly,
											priority:
												tempFilters.priority && tempFilters.priority.length
													? [...tempFilters.priority]
													: undefined,
											startDateFrom: tempFilters.startDateFrom || undefined,
											startDateTo: tempFilters.startDateTo || undefined,
											dueDateFrom: tempFilters.dueDateFrom || undefined,
											dueDateTo: tempFilters.dueDateTo || undefined,
										});
										setIsOpen(false);
									}}
								>
									Filter
								</S.Button>
							</S.DialogFooter>
						</S.DialogContent>
					</div>
				</S.DialogOverlay>
			)}
		</S.FilterArea>
	);
};

export default SearchFilter;
