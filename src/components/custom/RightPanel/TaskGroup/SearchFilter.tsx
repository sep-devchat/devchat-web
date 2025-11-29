import React, { useState } from "react";
import * as S from "./TaskGroup.styled";
import { Filter, Search as SearchIcon } from "lucide-react";
import { TaskStatus } from "@/types/task";
import {
	FILTER_STATUS_OPTIONS,
	FILTER_PRIORITY_OPTIONS,
} from "./filterOptions";
import CustomSelect from "../../CustomSelect/CustomSelect";
import CustomDatePicker from "../../CustomDatePicker/CustomDatePicker";
import SearchInput from "../../SearchInput/SearchInput";
import IconButton from "../../ActionButton/IconButton";
import { Checkbox } from "@/components/ui/checkbox";

type AppliedFilters = {
	status?: TaskStatus | undefined;
	assigneeId?: string | undefined;
	unassigned?: boolean | undefined;
	priority?: number | undefined;
	dueDate?: string | undefined;
	overdue?: boolean | undefined;
};

type GroupMember = { id: string; username: string };

type Props = {
	appliedFilters: AppliedFilters;
	setAppliedFilters: (
		f: AppliedFilters | ((prev: AppliedFilters) => AppliedFilters),
	) => void;
	groupMembers: GroupMember[];

	// search-related (moved here from TaskGroup's FilterArea)
	searchTerm: string;
	setSearchTerm: (s: string) => void;
	// on Enter need to immediately apply search:
	setDebouncedSearch: (s: string) => void;
	debounceRef: React.MutableRefObject<number | null>;
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
	const [tempFilters, setTempFilters] = useState<AppliedFilters>({});

	const openModal = () => {
		setTempFilters({
			status: appliedFilters.status,
			// nếu appliedFilters.unassigned = true thì không giữ assigneeId (làm rỗng)
			assigneeId: appliedFilters.unassigned
				? ""
				: (appliedFilters.assigneeId ?? ""),
			unassigned: !!appliedFilters.unassigned,
			priority: appliedFilters.priority,
			// nếu appliedFilters.overdue = true thì không giữ dueDate
			dueDate: appliedFilters.overdue ? "" : (appliedFilters.dueDate ?? ""),
			overdue: !!appliedFilters.overdue,
		});
		setIsOpen(true);
	};

	const removeFilter = (key: keyof AppliedFilters) => {
		setAppliedFilters((prev: AppliedFilters) => {
			const next = { ...prev };
			delete next[key];
			return next;
		});
	};

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
				{/* Filter tags shown under search input */}
				<S.FilterTags>
					{appliedFilters.status !== undefined && (
						<S.FilterChip bg="#eef2ff" color="#4338ca">
							<span>
								<strong>Status:</strong>{" "}
								{appliedFilters.status === 0
									? "To Do"
									: appliedFilters.status === 1
										? "In Progress"
										: appliedFilters.status === 2
											? "Done"
											: String(appliedFilters.status)}
							</span>
							<S.ChipClose onClick={() => removeFilter("status")}>
								×
							</S.ChipClose>
						</S.FilterChip>
					)}
					{appliedFilters.priority !== undefined && (
						<S.FilterChip bg="#eef2ff" color="#4338ca">
							<span>
								<strong>Priority:</strong>{" "}
								{appliedFilters.priority === 0
									? "Low"
									: appliedFilters.priority === 1
										? "Medium"
										: appliedFilters.priority === 2
											? "High"
											: String(appliedFilters.priority)}
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
									const m = groupMembers.find(
										(g) => g.id === appliedFilters.assigneeId,
									);
									return m ? m.username : appliedFilters.assigneeId;
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
					{appliedFilters.overdue && (
						<S.FilterChip bg="#eef2ff" color="#4338ca">
							<span>
								<strong>Overdue</strong>
							</span>
							<S.ChipClose onClick={() => removeFilter("overdue")}>
								×
							</S.ChipClose>
						</S.FilterChip>
					)}
					{appliedFilters.dueDate && (
						<S.FilterChip bg="#eef2ff" color="#4338ca">
							<span>
								<strong>Due to:</strong> {appliedFilters.dueDate}
							</span>
							<S.ChipClose onClick={() => removeFilter("dueDate")}>
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
										<CustomSelect
											value={
												tempFilters.status !== undefined
													? String(tempFilters.status)
													: ""
											}
											onChange={(val: string) =>
												setTempFilters((t) => ({
													...t,
													status:
														val === ""
															? undefined
															: (Number(val) as TaskStatus),
												}))
											}
											options={FILTER_STATUS_OPTIONS}
											allowClear
										/>
									</S.FormGroup>
								</S.FormColumn>

								<S.FormColumn>
									<S.FormGroup>
										<S.Label>Assignee</S.Label>
										{/* DISABLED nếu tick Unassigned only */}
										<CustomSelect
											value={tempFilters.assigneeId ?? ""}
											onChange={(val: string) =>
												setTempFilters((t) => ({ ...t, assigneeId: val }))
											}
											disabled={!!tempFilters.unassigned}
											options={[
												{ value: "", label: "Any" },
												...groupMembers.map((m) => ({
													value: m.id,
													label: m.username,
												})),
											]}
										/>
										<S.FormGroup style={{ marginTop: 8 }}>
											<S.CheckboxLabel>
												<Checkbox
													id="unassigned-only"
													checked={!!tempFilters.unassigned}
													onCheckedChange={(checked) => {
														const isChecked = checked === true; // handle boolean | "indeterminate"
														setTempFilters((t) => ({
															...t,
															unassigned: isChecked,
															// nếu checked thì clear assigneeId, nếu unchecked giữ nguyên
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
										<CustomSelect
											value={
												tempFilters.priority !== undefined
													? String(tempFilters.priority)
													: ""
											}
											onChange={(val: string) =>
												setTempFilters((t) => ({
													...t,
													priority: val === "" ? undefined : Number(val),
												}))
											}
											options={[
												{ value: "", label: "Any" },
												...FILTER_PRIORITY_OPTIONS,
											]}
										/>
									</S.FormGroup>
								</S.FormColumn>

								<S.FormColumn>
									<S.FormGroup>
										<S.Label>Due to</S.Label>
										{/* DISABLED nếu tick Only overdue */}
										<CustomDatePicker
											value={tempFilters.dueDate ?? ""}
											onChange={(val: string) =>
												setTempFilters((t) => ({ ...t, dueDate: val }))
											}
											disabled={!!tempFilters.overdue}
											allowClear
										/>
										<S.FormGroup style={{ marginTop: 8 }}>
											<S.CheckboxLabel>
												<Checkbox
													id="only-overdue"
													type="button"
													checked={!!tempFilters.overdue}
													onCheckedChange={(checked) => {
														const isChecked = checked === true;
														setTempFilters((t) => ({
															...t,
															overdue: isChecked,
															// nếu checked thì clear dueDate
															dueDate: isChecked ? "" : t.dueDate,
														}));
													}}
													aria-label="only-overdue"
												/>
												<S.Tag>Only overdue</S.Tag>
											</S.CheckboxLabel>
										</S.FormGroup>
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
										// Khi apply: nếu unassigned = true thì không gửi assigneeId
										// nếu overdue = true thì không gửi dueDate
										setAppliedFilters({
											status: tempFilters.status,
											assigneeId: tempFilters.unassigned
												? undefined
												: tempFilters.assigneeId || undefined,
											unassigned: !!tempFilters.unassigned,
											priority: tempFilters.priority,
											dueDate: tempFilters.overdue
												? undefined
												: tempFilters.dueDate || undefined,
											overdue: !!tempFilters.overdue,
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
