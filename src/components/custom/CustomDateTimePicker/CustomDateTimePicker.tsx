import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Calendar, Clock } from "lucide-react";
import * as S from "./CustomDateTimePicker.styled";

const CustomDateTimePicker: React.FC<{
	value: string;
	onChange: (value: string) => void;
	disabled?: boolean;
	allowClear?: boolean;
	showTime?: boolean;
	minDate?: string;
	maxDate?: string;
}> = ({
	value,
	onChange,
	disabled = false,
	allowClear = false,
	showTime = true,
	minDate,
	maxDate,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const [selectedTime, setSelectedTime] = useState({
		hour: "00",
		minute: "00",
	});
	const dateRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (value && showTime) {
			const date = new Date(value);
			setSelectedTime({
				hour: String(date.getHours()).padStart(2, "0"),
				minute: String(date.getMinutes()).padStart(2, "0"),
			});
		}
	}, [value, showTime]);

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
		if (showTime) {
			return date.toLocaleString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric",
				hour: "2-digit",
				minute: "2-digit",
			});
		}
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

	const isDateDisabled = (date: Date): boolean => {
		const dateToCheck = new Date(date);
		dateToCheck.setHours(0, 0, 0, 0);

		// Check if date is in the past (before today)
		if (dateToCheck < today) {
			return true;
		}

		// Check if date is before minDate
		if (minDate) {
			const min = new Date(minDate);
			min.setHours(0, 0, 0, 0);
			if (dateToCheck < min) {
				return true;
			}
		}

		// Check if date is after maxDate
		if (maxDate) {
			const max = new Date(maxDate);
			max.setHours(0, 0, 0, 0);
			if (dateToCheck > max) {
				return true;
			}
		}

		return false;
	};

	const handleDateClick = (date: Date) => {
		if (disabled || isDateDisabled(date)) return;
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");

		if (showTime) {
			const dateTimeString = `${year}-${month}-${day}T${selectedTime.hour}:${selectedTime.minute}:00`;
			onChange(new Date(dateTimeString).toISOString());
		} else {
			onChange(`${year}-${month}-${day}`);
			setIsOpen(false);
		}
	};

	const handleTimeChange = (type: "hour" | "minute", timeValue: string) => {
		const newTime = { ...selectedTime, [type]: timeValue };
		setSelectedTime(newTime);

		// Use the existing value to get the date part
		if (value) {
			const currentDate = new Date(value);
			const year = currentDate.getFullYear();
			const month = String(currentDate.getMonth() + 1).padStart(2, "0");
			const day = String(currentDate.getDate()).padStart(2, "0");
			const dateTimeString = `${year}-${month}-${day}T${newTime.hour}:${newTime.minute}:00`;
			onChange(new Date(dateTimeString).toISOString());
		}
	};

	const handleApply = () => {
		if (value && showTime) {
			const currentDate = new Date(value);
			const year = currentDate.getFullYear();
			const month = String(currentDate.getMonth() + 1).padStart(2, "0");
			const day = String(currentDate.getDate()).padStart(2, "0");
			const dateTimeString = `${year}-${month}-${day}T${selectedTime.hour}:${selectedTime.minute}:00`;
			onChange(new Date(dateTimeString).toISOString());
		}
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

	const handlePrevMonth = () => {
		setCurrentMonth(
			new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
		);
	};

	const handleNextMonth = () => {
		setCurrentMonth(
			new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
		);
	};

	const isSelectedDate = (date: Date) => {
		if (!value) return false;
		const selected = new Date(value);
		return (
			date.getDate() === selected.getDate() &&
			date.getMonth() === selected.getMonth() &&
			date.getFullYear() === selected.getFullYear()
		);
	};

	const isToday = (date: Date) => {
		return (
			date.getDate() === today.getDate() &&
			date.getMonth() === today.getMonth() &&
			date.getFullYear() === today.getFullYear()
		);
	};

	return (
		<S.Container ref={dateRef}>
			<S.DateButton
				onClick={() => !disabled && setIsOpen(true)}
				disabled={disabled}
				hasValue={Boolean(value)}
			>
				<Calendar size={16} />
				<span>{formatDisplayDate(value)}</span>
				{allowClear && value && !disabled && (
					<S.ClearButton
						onClick={handleClear}
						aria-label="Clear date"
						type="button"
					>
						×
					</S.ClearButton>
				)}
			</S.DateButton>

			{isOpen && (
				<S.Overlay onClick={() => setIsOpen(false)}>
					<S.PickerContainer
						onClick={(e: React.MouseEvent) => e.stopPropagation()}
					>
						<S.Header>
							<S.NavButton
								onClick={handlePrevMonth}
								aria-label="Previous month"
							>
								<ChevronLeft size={18} />
							</S.NavButton>
							<S.MonthYear>{monthYear}</S.MonthYear>
							<S.NavButton onClick={handleNextMonth} aria-label="Next month">
								<ChevronRight size={18} />
							</S.NavButton>
						</S.Header>

						<S.DaysGrid>
							<S.WeekdayHeader>Sun</S.WeekdayHeader>
							<S.WeekdayHeader>Mon</S.WeekdayHeader>
							<S.WeekdayHeader>Tue</S.WeekdayHeader>
							<S.WeekdayHeader>Wed</S.WeekdayHeader>
							<S.WeekdayHeader>Thu</S.WeekdayHeader>
							<S.WeekdayHeader>Fri</S.WeekdayHeader>
							<S.WeekdayHeader>Sat</S.WeekdayHeader>

							{days.map((item, idx) => (
								<S.DayCell
									key={idx}
									onClick={() => handleDateClick(item.date)}
									isCurrentMonth={item.isCurrentMonth}
									isSelected={isSelectedDate(item.date)}
									isToday={isToday(item.date)}
									isDisabled={isDateDisabled(item.date)}
									style={{
										cursor: isDateDisabled(item.date)
											? "not-allowed"
											: "pointer",
										opacity: isDateDisabled(item.date) ? 0.4 : 1,
									}}
								>
									{item.day}
								</S.DayCell>
							))}
						</S.DaysGrid>

						{showTime && (
							<S.TimePickerSection>
								<S.TimeLabel>
									<Clock size={16} />
									Time
								</S.TimeLabel>
								<S.TimeInputs>
									<S.TimeInput
										type="number"
										min="0"
										max="23"
										value={selectedTime.hour}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
											const val = Math.max(
												0,
												Math.min(23, Number(e.target.value)),
											);
											handleTimeChange("hour", String(val).padStart(2, "0"));
										}}
										placeholder="HH"
									/>
									<S.TimeSeparator>:</S.TimeSeparator>
									<S.TimeInput
										type="number"
										min="0"
										max="59"
										value={selectedTime.minute}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
											const val = Math.max(
												0,
												Math.min(59, Number(e.target.value)),
											);
											handleTimeChange("minute", String(val).padStart(2, "0"));
										}}
										placeholder="MM"
									/>
								</S.TimeInputs>
							</S.TimePickerSection>
						)}

						<S.Footer>
							<S.FooterButton onClick={handleApply}>Done</S.FooterButton>
						</S.Footer>
					</S.PickerContainer>
				</S.Overlay>
			)}
		</S.Container>
	);
};

export default CustomDateTimePicker;
