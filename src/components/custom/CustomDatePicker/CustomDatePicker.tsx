import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import * as S from "./CustomDatePicker.styled";

const CustomDatePicker: React.FC<{
	value: string;
	onChange: (value: string) => void;
	disabled?: boolean;
	allowClear?: boolean;
}> = ({ value, onChange, disabled = false, allowClear = false }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const dateRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isOpen]);

	const formatDisplayDate = (dateStr: string) => {
		if (!dateStr) return "Select date...";
		const date = new Date(dateStr);
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	const getDaysInMonth = (date: Date) => {
		const year = date.getFullYear();
		const month = date.getMonth();
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);
		const daysInMonth = lastDay.getDate();
		const startingDayOfWeek = firstDay.getDay();

		const days: Array<{ day: number; isCurrentMonth: boolean; date: Date }> =
			[];

		const prevMonthLastDay = new Date(year, month, 0).getDate();
		for (let i = startingDayOfWeek - 1; i >= 0; i--) {
			days.push({
				day: prevMonthLastDay - i,
				isCurrentMonth: false,
				date: new Date(year, month - 1, prevMonthLastDay - i),
			});
		}

		for (let i = 1; i <= daysInMonth; i++) {
			days.push({
				day: i,
				isCurrentMonth: true,
				date: new Date(year, month, i),
			});
		}

		const remainingDays = 42 - days.length;
		for (let i = 1; i <= remainingDays; i++) {
			days.push({
				day: i,
				isCurrentMonth: false,
				date: new Date(year, month + 1, i),
			});
		}

		return days;
	};

	const days = getDaysInMonth(currentMonth);
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const handleDateClick = (date: Date) => {
		if (disabled) return;
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		onChange(`${year}-${month}-${day}`);
		setIsOpen(false);
	};

	const handleClear = (e?: React.MouseEvent) => {
		e?.stopPropagation();
		if (disabled) return;
		onChange("");
		setIsOpen(false);
	};

	const monthYear = currentMonth.toLocaleDateString("en-US", {
		month: "long",
		year: "numeric",
	});

	const inputDisplayValue = value ? formatDisplayDate(value) : "";
	const placeholderText = "Select date...";

	return (
		<>
			<S.DatePickerWrapper ref={dateRef}>
				<S.DateInput
					type="text"
					value={inputDisplayValue}
					placeholder={placeholderText}
					readOnly
					onClick={() => !disabled && setIsOpen(!isOpen)}
					onKeyDown={(e) => {
						if (disabled) return;
						if (e.key === "Enter" || e.key === " ") {
							e.preventDefault();
							setIsOpen((prev) => !prev);
						} else if (e.key === "Escape") {
							setIsOpen(false);
						}
					}}
					$open={isOpen}
					$disabled={disabled}
				/>

				<S.CalendarButton
					onClick={() => !disabled && setIsOpen(!isOpen)}
					aria-label="Open calendar"
					disabled={disabled}
					type="button"
				>
					<Calendar className="icon-size" />
				</S.CalendarButton>
			</S.DatePickerWrapper>

			{isOpen && !disabled && (
				<>
					<S.Backdrop onClick={() => setIsOpen(false)} />
					<S.Modal>
						<S.ModalHeader>
							<S.NavButton
								aria-label="Previous month"
								onClick={() =>
									setCurrentMonth(
										new Date(
											currentMonth.getFullYear(),
											currentMonth.getMonth() - 1,
										),
									)
								}
							>
								<ChevronLeft className="nav-icon" />
							</S.NavButton>
							<S.MonthLabel>{monthYear}</S.MonthLabel>
							<S.NavButton
								aria-label="Next month"
								onClick={() =>
									setCurrentMonth(
										new Date(
											currentMonth.getFullYear(),
											currentMonth.getMonth() + 1,
										),
									)
								}
							>
								<ChevronRight className="nav-icon" />
							</S.NavButton>
						</S.ModalHeader>
						<S.Subtitle>Select due date</S.Subtitle>
						{allowClear && value && (
							<S.ModalActions>
								<S.ClearActionButton
									type="button"
									onClick={() => handleClear()}
								>
									Clear date
								</S.ClearActionButton>
							</S.ModalActions>
						)}

						<S.WeekdayGrid>
							{["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
								<S.WeekdayCell key={d}>{d}</S.WeekdayCell>
							))}
						</S.WeekdayGrid>

						<S.DayGrid>
							{days.map((dayInfo, idx) => {
								const dayDate = new Date(dayInfo.date);
								dayDate.setHours(0, 0, 0, 0);
								const isToday = dayDate.getTime() === today.getTime();
								const isSelected = Boolean(
									value &&
										dayDate.getTime() === new Date(value).setHours(0, 0, 0, 0),
								);
								const isPastDate = dayDate < today;
								const isDisabledCell = !dayInfo.isCurrentMonth || isPastDate;

								return (
									<S.DayCell
										key={`${dayInfo.date.toISOString()}-${idx}`}
										$isCurrent={dayInfo.isCurrentMonth}
										$isDisabled={isDisabledCell}
										$isSelected={isSelected}
										$isToday={isToday}
										onClick={() => {
											if (dayInfo.isCurrentMonth && !isPastDate) {
												handleDateClick(dayInfo.date);
											}
										}}
										type="button"
									>
										{dayInfo.day}
									</S.DayCell>
								);
							})}
						</S.DayGrid>
					</S.Modal>

					<style>{S.AnimationStyles}</style>
				</>
			)}
		</>
	);
};

export default CustomDatePicker;
