import React, { useState, useRef, useEffect } from "react";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import * as S from "./FilterBar.styled";

export interface FilterValues {
	priority: string;
	category: string;
	group: string;
	dateRange: string;
}

interface FilterBarProps {
	onApply?: (filters: FilterValues) => void;
	onReset?: () => void;
	defaultFilters?: Partial<FilterValues>;
}

interface SelectOption {
	value: string;
	label: string;
}

const priorityOptions: SelectOption[] = [
	{ value: "all", label: "All Priority" },
	{ value: "high", label: "High Priority" },
	{ value: "medium", label: "Medium Priority" },
	{ value: "low", label: "Low Priority" },
];

const categoryOptions: SelectOption[] = [
	{ value: "all", label: "All Categories" },
	{ value: "spam", label: "Spam" },
	{ value: "harassment", label: "Harassment" },
	{ value: "inappropriate", label: "Inappropriate Content" },
];

const groupOptions: SelectOption[] = [
	{ value: "all", label: "All Group" },
	{ value: "admin", label: "Admin" },
	{ value: "moderator", label: "Moderator" },
];

const getTodayDateFormatted = () => {
	const today = new Date();
	const day = String(today.getDate()).padStart(2, "0");
	const month = String(today.getMonth() + 1).padStart(2, "0");
	const year = today.getFullYear();
	return `${day}/${month}/${year}`;
};

const getTodayDateISO = () => {
	const today = new Date();
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, "0");
	const day = String(today.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
};

const formatDateRange = (startDate: string, endDate: string) => {
	const [startYear, startMonth, startDay] = startDate.split("-");
	const [endYear, endMonth, endDay] = endDate.split("-");
	return `${startDay}/${startMonth}/${startYear} - ${endDay}/${endMonth}/${endYear}`;
};

export const FilterBar: React.FC<FilterBarProps> = ({
	onApply,
	onReset,
	defaultFilters = {},
}) => {
	const todayISO = getTodayDateISO();
	const todayFormatted = getTodayDateFormatted();

	const [filters, setFilters] = useState<FilterValues>({
		priority: defaultFilters.priority || "all",
		category: defaultFilters.category || "all",
		group: defaultFilters.group || "all",
		dateRange: defaultFilters.dateRange || todayFormatted,
	});

	const [openDropdown, setOpenDropdown] = useState<string | null>(null);
	const [showCalendar, setShowCalendar] = useState(false);
	const [startDate, setStartDate] = useState(todayISO);
	const [endDate, setEndDate] = useState(todayISO);
	const [selectingStart, setSelectingStart] = useState(true);
	const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
	const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

	const calendarRef = useRef<HTMLDivElement>(null);
	const priorityRef = useRef<HTMLDivElement>(null);
	const categoryRef = useRef<HTMLDivElement>(null);
	const groupRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				calendarRef.current &&
				!calendarRef.current.contains(event.target as Node)
			) {
				setShowCalendar(false);
			}
			if (
				priorityRef.current &&
				!priorityRef.current.contains(event.target as Node)
			) {
				if (openDropdown === "priority") setOpenDropdown(null);
			}
			if (
				categoryRef.current &&
				!categoryRef.current.contains(event.target as Node)
			) {
				if (openDropdown === "category") setOpenDropdown(null);
			}
			if (
				groupRef.current &&
				!groupRef.current.contains(event.target as Node)
			) {
				if (openDropdown === "group") setOpenDropdown(null);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [openDropdown]);

	const handleApply = () => {
		onApply?.(filters);
	};

	const handleReset = () => {
		const resetFilters = {
			priority: "all",
			category: "all",
			group: "all",
			dateRange: todayFormatted,
		};
		setFilters(resetFilters);
		setStartDate(todayISO);
		setEndDate(todayISO);
		setSelectingStart(true);
		setCurrentMonth(new Date().getMonth());
		setCurrentYear(new Date().getFullYear());
		onReset?.();
	};

	const handleCalendarClick = () => {
		setShowCalendar(!showCalendar);
		setSelectingStart(true);
		if (!showCalendar) {
			setCurrentMonth(new Date().getMonth());
			setCurrentYear(new Date().getFullYear());
		}
	};

	const handleDateSelect = (date: string) => {
		if (selectingStart) {
			setStartDate(date);
			setEndDate(date);
			setSelectingStart(false);
		} else {
			if (date < startDate) {
				setStartDate(date);
				setEndDate(startDate);
			} else {
				setEndDate(date);
			}

			const formattedRange = formatDateRange(
				date < startDate ? date : startDate,
				date < startDate ? startDate : date,
			);
			setFilters({ ...filters, dateRange: formattedRange });
			setShowCalendar(false);
			setSelectingStart(true);
		}
	};

	const generateCalendar = () => {
		const firstDay = new Date(currentYear, currentMonth, 1);
		const lastDay = new Date(currentYear, currentMonth + 1, 0);
		const prevLastDay = new Date(currentYear, currentMonth, 0);

		const firstDayWeek = firstDay.getDay();
		const lastDateNum = lastDay.getDate();
		const prevLastDateNum = prevLastDay.getDate();

		const days = [];

		for (let i = firstDayWeek - 1; i >= 0; i--) {
			const day = prevLastDateNum - i;
			const year = currentMonth === 0 ? currentYear - 1 : currentYear;
			const month = currentMonth === 0 ? 11 : currentMonth - 1;
			days.push({
				date: day,
				isCurrentMonth: false,
				fullDate: `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
			});
		}

		for (let i = 1; i <= lastDateNum; i++) {
			days.push({
				date: i,
				isCurrentMonth: true,
				fullDate: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`,
			});
		}

		const remainingDays = 42 - days.length;
		for (let i = 1; i <= remainingDays; i++) {
			const year = currentMonth === 11 ? currentYear + 1 : currentYear;
			const month = currentMonth === 11 ? 0 : currentMonth + 1;
			days.push({
				date: i,
				isCurrentMonth: false,
				fullDate: `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`,
			});
		}

		return days;
	};

	const isDateInRange = (date: string) => {
		return date >= startDate && date <= endDate;
	};

	const isFutureDate = (date: string) => {
		return date > todayISO;
	};

	const handlePrevMonth = () => {
		if (currentMonth === 0) {
			setCurrentMonth(11);
			setCurrentYear(currentYear - 1);
		} else {
			setCurrentMonth(currentMonth - 1);
		}
	};

	const handleNextMonth = () => {
		const today = new Date();
		const isCurrentMonthAndYear =
			currentMonth === today.getMonth() && currentYear === today.getFullYear();

		if (!isCurrentMonthAndYear) {
			if (currentMonth === 11) {
				setCurrentMonth(0);
				setCurrentYear(currentYear + 1);
			} else {
				setCurrentMonth(currentMonth + 1);
			}
		}
	};

	const canGoNext = () => {
		const today = new Date();
		return !(
			currentMonth === today.getMonth() && currentYear === today.getFullYear()
		);
	};

	const monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	const handleSelectOption = (filterKey: keyof FilterValues, value: string) => {
		setFilters({ ...filters, [filterKey]: value });
		setOpenDropdown(null);
	};

	const getSelectedLabel = (options: SelectOption[], value: string) => {
		return options.find((opt) => opt.value === value)?.label || "";
	};

	return (
		<S.FilterContainer>
			<S.FilterGrid>
				<S.SelectWrapper ref={priorityRef}>
					<S.CustomSelect
						$isOpen={openDropdown === "priority"}
						onClick={() =>
							setOpenDropdown(openDropdown === "priority" ? null : "priority")
						}
					>
						{getSelectedLabel(priorityOptions, filters.priority)}
					</S.CustomSelect>
					<S.SelectIcon $isOpen={openDropdown === "priority"}>
						<ChevronDown size={18} />
					</S.SelectIcon>
					{openDropdown === "priority" && (
						<S.OptionsDropdown>
							{priorityOptions.map((option, index) => (
								<S.Option
									key={option.value}
									$isSelected={filters.priority === option.value}
									$isFirst={index === 0}
									onClick={() => handleSelectOption("priority", option.value)}
								>
									{option.label}
								</S.Option>
							))}
						</S.OptionsDropdown>
					)}
				</S.SelectWrapper>

				<S.SelectWrapper ref={categoryRef}>
					<S.CustomSelect
						$isOpen={openDropdown === "category"}
						onClick={() =>
							setOpenDropdown(openDropdown === "category" ? null : "category")
						}
					>
						{getSelectedLabel(categoryOptions, filters.category)}
					</S.CustomSelect>
					<S.SelectIcon $isOpen={openDropdown === "category"}>
						<ChevronDown size={18} />
					</S.SelectIcon>
					{openDropdown === "category" && (
						<S.OptionsDropdown>
							{categoryOptions.map((option, index) => (
								<S.Option
									key={option.value}
									$isSelected={filters.category === option.value}
									$isFirst={index === 0}
									onClick={() => handleSelectOption("category", option.value)}
								>
									{option.label}
								</S.Option>
							))}
						</S.OptionsDropdown>
					)}
				</S.SelectWrapper>

				<S.SelectWrapper ref={groupRef}>
					<S.CustomSelect
						$isOpen={openDropdown === "group"}
						onClick={() =>
							setOpenDropdown(openDropdown === "group" ? null : "group")
						}
					>
						{getSelectedLabel(groupOptions, filters.group)}
					</S.CustomSelect>
					<S.SelectIcon $isOpen={openDropdown === "group"}>
						<ChevronDown size={18} />
					</S.SelectIcon>
					{openDropdown === "group" && (
						<S.OptionsDropdown>
							{groupOptions.map((option, index) => (
								<S.Option
									key={option.value}
									$isSelected={filters.group === option.value}
									$isFirst={index === 0}
									onClick={() => handleSelectOption("group", option.value)}
								>
									{option.label}
								</S.Option>
							))}
						</S.OptionsDropdown>
					)}
				</S.SelectWrapper>

				<S.DateInputWrapper ref={calendarRef}>
					<S.DateInput
						type="text"
						value={filters.dateRange}
						readOnly
						placeholder="Select date range"
					/>
					<S.CalendarIcon onClick={handleCalendarClick}>
						<Calendar size={18} />
					</S.CalendarIcon>

					{showCalendar && (
						<S.CalendarDropdown>
							<S.CalendarHeader>
								<S.MonthYearNav>
									<S.NavButton onClick={handlePrevMonth}>
										<ChevronLeft size={20} />
									</S.NavButton>
									<S.MonthYear>
										{monthNames[currentMonth]} {currentYear}
									</S.MonthYear>
									<S.NavButton
										onClick={handleNextMonth}
										disabled={!canGoNext()}
									>
										<ChevronRight size={20} />
									</S.NavButton>
								</S.MonthYearNav>
								<S.CalendarInstruction>
									{selectingStart ? "Select start date" : "Select end date"}
								</S.CalendarInstruction>
							</S.CalendarHeader>

							<S.WeekDays>
								<S.WeekDay>Su</S.WeekDay>
								<S.WeekDay>Mo</S.WeekDay>
								<S.WeekDay>Tu</S.WeekDay>
								<S.WeekDay>We</S.WeekDay>
								<S.WeekDay>Th</S.WeekDay>
								<S.WeekDay>Fr</S.WeekDay>
								<S.WeekDay>Sa</S.WeekDay>
							</S.WeekDays>

							<S.DaysGrid>
								{generateCalendar().map((day, index) => {
									const isFuture = isFutureDate(day.fullDate);
									return (
										<S.DayCell
											key={index}
											$isCurrentMonth={day.isCurrentMonth}
											$isToday={day.fullDate === todayISO}
											$isSelected={
												day.fullDate === startDate || day.fullDate === endDate
											}
											$isInRange={
												isDateInRange(day.fullDate) && startDate !== endDate
											}
											$isFuture={isFuture}
											onClick={() =>
												day.isCurrentMonth &&
												!isFuture &&
												handleDateSelect(day.fullDate)
											}
										>
											{day.date}
										</S.DayCell>
									);
								})}
							</S.DaysGrid>
						</S.CalendarDropdown>
					)}
				</S.DateInputWrapper>
			</S.FilterGrid>

			<S.ButtonGroup>
				<S.ApplyButton onClick={handleApply}>Apply</S.ApplyButton>
				<S.ResetButton onClick={handleReset}>Reset</S.ResetButton>
			</S.ButtonGroup>
		</S.FilterContainer>
	);
};
