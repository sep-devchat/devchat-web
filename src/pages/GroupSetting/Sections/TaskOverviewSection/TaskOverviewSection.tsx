import { useEffect, useState, useRef } from "react";
import { useParams } from "@tanstack/react-router";
import { ChevronDown, X } from "lucide-react";
import { taskAPI, TaskStatisticsResponse } from "@/services/taskAPI";
import CustomDateTimePicker from "@/components/custom/CustomDateTimePicker/CustomDateTimePicker";
import {
	SectionWrapper,
	TitleSection,
	StatisticsGrid,
	StatCard,
	StatLabel,
	StatValue,
	DetailSection,
	DetailTitle,
	DetailGrid,
	DetailItem,
	DetailLabel,
	DetailValue,
	LoadingContainer,
	ErrorContainer,
	HeaderWithFilter,
	DateRangeDropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownOption,
	FilterTag,
	FilterTagClose,
	CustomRangeContainer,
	CustomRangeInputs,
	DateInputWrapper,
} from "./TaskOverviewSection.styled";

type DateFilterType = "today" | "yesterday" | "last7days" | "all" | "custom";

export default function TaskOverviewSection() {
	const params = useParams({ strict: false }) as { groupId?: string };
	const groupId = params.groupId;

	const [statistics, setStatistics] = useState<TaskStatisticsResponse | null>(
		null,
	);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [dateFilter, setDateFilter] = useState<DateFilterType>("all");
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [customStartDate, setCustomStartDate] = useState<string>("");
	const [customEndDate, setCustomEndDate] = useState<string>("");
	const [dateRangeError, setDateRangeError] = useState<string>("");
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsDropdownOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const getDateFilterLabel = () => {
		const labels: Record<string, string> = {
			today: "Today",
			yesterday: "Yesterday",
			last7days: "Last 7 days",
			all: "All",
			custom: "Custom range",
		};
		return labels[dateFilter];
	};

	const validateCustomDateRange = (start: string, end: string): string => {
		if (start && end) {
			try {
				const startDate = new Date(start).getTime();
				const endDate = new Date(end).getTime();
				if (isNaN(startDate) || isNaN(endDate)) {
					return "";
				}
				if (startDate > endDate) {
					return "End date must be greater than or equal to start date.";
				}
			} catch {
				return "";
			}
		}
		return "";
	};

	const getDateRange = () => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		let startDate: Date | null = null;
		let endDate: Date | null = null;

		switch (dateFilter) {
			case "today":
				startDate = new Date(today);
				endDate = new Date(today);
				endDate.setHours(23, 59, 59, 999);
				break;
			case "yesterday":
				startDate = new Date(today);
				startDate.setDate(startDate.getDate() - 1);
				endDate = new Date(startDate);
				endDate.setHours(23, 59, 59, 999);
				break;
			case "last7days":
				startDate = new Date(today);
				startDate.setDate(startDate.getDate() - 6);
				endDate = new Date(today);
				endDate.setHours(23, 59, 59, 999);
				break;
			case "custom":
				if (customStartDate) {
					startDate = new Date(customStartDate);
					startDate.setHours(0, 0, 0, 0);
				}
				if (customEndDate) {
					endDate = new Date(customEndDate);
					endDate.setHours(23, 59, 59, 999);
				}
				break;
			case "all":
			default:
				startDate = null;
				endDate = null;
		}

		return { startDate, endDate };
	};

	useEffect(() => {
		const fetchStatistics = async () => {
			if (!groupId) {
				setError("Group ID not found");
				setLoading(false);
				return;
			}

			try {
				setLoading(true);
				setError(null);

				const { startDate, endDate } = getDateRange();
				const response = await taskAPI.getTaskStatistics(
					groupId,
					startDate?.toISOString(),
					endDate?.toISOString(),
				);
				setStatistics(response.data);
			} catch (err) {
				console.error("Failed to fetch task statistics:", err);
				setError("Failed to load task statistics. Please try again.");
			} finally {
				setLoading(false);
			}
		};

		fetchStatistics();
	}, [groupId, dateFilter, customStartDate, customEndDate]);

	if (loading) {
		return (
			<LoadingContainer>
				<div>Loading...</div>
			</LoadingContainer>
		);
	}

	if (error) {
		return (
			<ErrorContainer>
				{error || "Failed to load task statistics"}
			</ErrorContainer>
		);
	}

	if (!statistics) {
		return <ErrorContainer>No data available</ErrorContainer>;
	}

	const completionRate =
		statistics.totalTasks > 0
			? Math.round((statistics.completedTasks / statistics.totalTasks) * 100)
			: 0;

	return (
		<SectionWrapper>
			<HeaderWithFilter>
				<TitleSection>Task Overview</TitleSection>
				<div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
					{dateFilter !== "all" && (
						<FilterTag>
							{getDateFilterLabel()}
							<FilterTagClose onClick={() => setDateFilter("all")}>
								<X size={14} />
							</FilterTagClose>
						</FilterTag>
					)}
					<DateRangeDropdown ref={dropdownRef}>
						<DropdownTrigger onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
							{getDateFilterLabel()}
							<ChevronDown size={16} />
						</DropdownTrigger>
						{isDropdownOpen && (
							<DropdownMenu>
								<DropdownOption
									$isSelected={dateFilter === "all"}
									onClick={() => {
										setDateFilter("all");
										setIsDropdownOpen(false);
									}}
								>
									All
								</DropdownOption>
								<DropdownOption
									$isSelected={dateFilter === "today"}
									onClick={() => {
										setDateFilter("today");
										setIsDropdownOpen(false);
									}}
								>
									Today
								</DropdownOption>
								<DropdownOption
									$isSelected={dateFilter === "yesterday"}
									onClick={() => {
										setDateFilter("yesterday");
										setIsDropdownOpen(false);
									}}
								>
									Yesterday
								</DropdownOption>
								<DropdownOption
									$isSelected={dateFilter === "last7days"}
									onClick={() => {
										setDateFilter("last7days");
										setIsDropdownOpen(false);
									}}
								>
									Last 7 days
								</DropdownOption>
								<DropdownOption
									$isSelected={dateFilter === "custom"}
									onClick={() => {
										setDateFilter("custom");
									}}
								>
									Custom range
								</DropdownOption>
								{dateFilter === "custom" && (
									<CustomRangeContainer>
										<CustomRangeInputs>
											<DateInputWrapper>
												<label>From</label>
												<CustomDateTimePicker
													value={customStartDate}
													onChange={(val) => {
														setCustomStartDate(val);
														const error = validateCustomDateRange(
															val,
															customEndDate,
														);
														setDateRangeError(error);
													}}
													allowClear
													showTime={false}
													isAllowedPast
												/>
											</DateInputWrapper>
											<DateInputWrapper>
												<label>To</label>
												<CustomDateTimePicker
													value={customEndDate}
													onChange={(val) => {
														setCustomEndDate(val);
														const error = validateCustomDateRange(
															customStartDate,
															val,
														);
														setDateRangeError(error);
													}}
													allowClear
													showTime={false}
													isAllowedPast
												/>
											</DateInputWrapper>
										</CustomRangeInputs>
										{dateRangeError && (
											<div
												style={{
													color: "#dc2626",
													fontSize: "0.875rem",
													marginBottom: "0.75rem",
													marginTop: "-0.25rem",
												}}
											>
												{dateRangeError}
											</div>
										)}
										<button
											onClick={() => {
												if (!dateRangeError) {
													setIsDropdownOpen(false);
												}
											}}
											disabled={!!dateRangeError}
											style={{
												padding: "0.5rem 1rem",
												background: dateRangeError ? "#d1d5db" : "#3b82f6",
												color: "white",
												border: "none",
												borderRadius: "0.375rem",
												cursor: dateRangeError ? "not-allowed" : "pointer",
												fontSize: "0.875rem",
												fontWeight: "500",
												marginTop: "0.75rem",
											}}
										>
											Apply
										</button>
									</CustomRangeContainer>
								)}
							</DropdownMenu>
						)}
					</DateRangeDropdown>
				</div>
			</HeaderWithFilter>

			<StatisticsGrid>
				<StatCard $color="rgba(59, 130, 246, 0.1)">
					<StatLabel>Total Tasks</StatLabel>
					<StatValue>{statistics.totalTasks}</StatValue>
				</StatCard>

				<StatCard $color="rgba(251, 191, 36, 0.1)">
					<StatLabel>Pending Tasks</StatLabel>
					<StatValue>{statistics.pendingTasks}</StatValue>
				</StatCard>

				<StatCard $color="rgba(34, 197, 94, 0.1)">
					<StatLabel>Completed Tasks</StatLabel>
					<StatValue>{statistics.completedTasks}</StatValue>
				</StatCard>

				<StatCard $color="rgba(168, 85, 247, 0.1)">
					<StatLabel>Completion Rate</StatLabel>
					<StatValue>{completionRate}%</StatValue>
				</StatCard>
			</StatisticsGrid>

			<DetailSection>
				<DetailTitle>Task Status Breakdown</DetailTitle>
				<DetailGrid>
					<DetailItem>
						<DetailLabel>To Do</DetailLabel>
						<DetailValue $color="#94a3b8">
							{statistics.byStatus.todo}
						</DetailValue>
					</DetailItem>
					<DetailItem>
						<DetailLabel>In Progress</DetailLabel>
						<DetailValue $color="#3b82f6">
							{statistics.byStatus.inProgress}
						</DetailValue>
					</DetailItem>
					<DetailItem>
						<DetailLabel>Done</DetailLabel>
						<DetailValue $color="#22c55e">
							{statistics.byStatus.done}
						</DetailValue>
					</DetailItem>
				</DetailGrid>
			</DetailSection>

			<DetailSection>
				<DetailTitle>Task Priority Distribution</DetailTitle>
				<DetailGrid>
					<DetailItem>
						<DetailLabel>Low Priority</DetailLabel>
						<DetailValue $color="#22c55e">
							{statistics.byPriority.low}
						</DetailValue>
					</DetailItem>
					<DetailItem>
						<DetailLabel>Medium Priority</DetailLabel>
						<DetailValue $color="#f59e0b">
							{statistics.byPriority.medium}
						</DetailValue>
					</DetailItem>
					<DetailItem>
						<DetailLabel>High Priority</DetailLabel>
						<DetailValue $color="#ef4444">
							{statistics.byPriority.high}
						</DetailValue>
					</DetailItem>
				</DetailGrid>
			</DetailSection>

			<DetailSection>
				<DetailTitle>Additional Statistics</DetailTitle>
				<DetailGrid>
					<DetailItem>
						<DetailLabel>Unassigned Tasks</DetailLabel>
						<DetailValue $color="#6b7280">
							{statistics.unassignedTasks}
						</DetailValue>
					</DetailItem>
					<DetailItem>
						<DetailLabel>Overdue Tasks</DetailLabel>
						<DetailValue $color="#dc2626">
							{statistics.overdueTasks}
						</DetailValue>
					</DetailItem>
				</DetailGrid>
			</DetailSection>
		</SectionWrapper>
	);
}
