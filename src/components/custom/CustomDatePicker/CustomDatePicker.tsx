import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DISABLED_BG = "#f3f4f6";
const DISABLED_OPACITY = 0.6;

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
		const handleClickOutside = (event: MouseEvent) => {
			if (dateRef.current && !dateRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

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

	const handleClear = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (disabled) return;
		onChange("");
		setIsOpen(false);
	};

	const monthYear = currentMonth.toLocaleDateString("en-US", {
		month: "long",
		year: "numeric",
	});

	return (
		<div
			style={{
				position: "relative",
				width: "100%",
			}}
			ref={dateRef}
		>
			<Input
				type="text"
				value={formatDisplayDate(value)}
				onClick={() => !disabled && setIsOpen(!isOpen)}
				readOnly
				style={{
					width: "100%",
					height: "43px",
					padding: "12px 40px 12px 16px",
					border: `1.5px solid ${isOpen ? "#133e87" : "#e5e7eb"}`,
					borderRadius: "10px",
					fontSize: "14px",
					color: "#1f2937",
					background: disabled
						? DISABLED_BG
						: isOpen
							? "white"
							: "linear-gradient(to bottom, #ffffff, #f9fafb)",
					cursor: disabled ? "not-allowed" : "pointer",
					transition: "all 0.3s ease",
					boxShadow: isOpen
						? "0 0 0 4px rgba(59, 130, 246, 0.12), 0 4px 6px rgba(0, 0, 0, 0.07)"
						: "0 1px 3px rgba(0, 0, 0, 0.05)",
					outline: "none",
					opacity: disabled ? DISABLED_OPACITY : 1,
				}}
			/>

			{/* Clear button */}
			{allowClear && !disabled && value && (
				<button
					onClick={handleClear}
					aria-label="Clear date"
					title="Clear date"
					style={{
						position: "absolute",
						right: "44px",
						top: "50%",
						transform: "translateY(-50%)",
						border: "none",
						background: "transparent",
						padding: 4,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						cursor: "pointer",
						color: "#6b7280",
						zIndex: 1,
					}}
				>
					<X size={16} />
				</button>
			)}

			{/* Calendar icon */}
			<div
				onClick={() => !disabled && setIsOpen(!isOpen)}
				style={{
					position: "absolute",
					right: "12px",
					top: "50%",
					transform: "translateY(-50%)",
					cursor: disabled ? "not-allowed" : "pointer",
					opacity: disabled ? DISABLED_OPACITY : 1,
					color: "#6b7280",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					padding: 4,
				}}
			>
				<Calendar size={18} />
			</div>

			{isOpen && !disabled && (
				<div
					style={{
						position: "absolute",
						top: "calc(100% + 8px)",
						left: 0,
						right: 0,
						background: "white",
						border: "1.5px solid #e5e7eb",
						borderRadius: "12px",
						boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
						zIndex: 1000,
						padding: "16px",
						minWidth: "320px",
					}}
				>
					{/* Calendar Header */}
					<div style={{ marginBottom: "16px" }}>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								marginBottom: "8px",
							}}
						>
							<Button
								onClick={() =>
									setCurrentMonth(
										new Date(
											currentMonth.getFullYear(),
											currentMonth.getMonth() - 1,
										),
									)
								}
								style={{
									border: "none",
									background: "transparent",
									cursor: "pointer",
									padding: "4px",
									display: "flex",
									alignItems: "center",
									color: "#374151",
								}}
							>
								<ChevronLeft size={20} />
							</Button>
							<div
								style={{ fontSize: "16px", fontWeight: 600, color: "#1f2937" }}
							>
								{monthYear}
							</div>
							<Button
								onClick={() =>
									setCurrentMonth(
										new Date(
											currentMonth.getFullYear(),
											currentMonth.getMonth() + 1,
										),
									)
								}
								style={{
									border: "none",
									background: "transparent",
									cursor: "pointer",
									padding: "4px",
									display: "flex",
									alignItems: "center",
									color: "#374151",
								}}
							>
								<ChevronRight size={20} />
							</Button>
						</div>
						<div
							style={{
								fontSize: "12px",
								color: "#6b7280",
								textAlign: "center",
							}}
						>
							Select due date
						</div>
					</div>

					{/* Week Days */}
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "repeat(7, 1fr)",
							gap: "4px",
							marginBottom: "8px",
						}}
					>
						{["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
							<div
								key={d}
								style={{
									fontSize: "12px",
									fontWeight: 600,
									color: "#6b7280",
									textAlign: "center",
									padding: "8px 0",
								}}
							>
								{d}
							</div>
						))}
					</div>

					{/* Days Grid */}
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "repeat(7, 1fr)",
							gap: "4px",
						}}
					>
						{days.map((dayInfo, idx) => {
							const dayDate = new Date(dayInfo.date);
							dayDate.setHours(0, 0, 0, 0);
							const isToday = dayDate.getTime() === today.getTime();
							const isSelected = Boolean(
								value &&
									dayDate.getTime() === new Date(value).setHours(0, 0, 0, 0),
							);
							const isFuture = dayDate < today;

							return (
								<div
									key={idx}
									onClick={() => {
										if (dayInfo.isCurrentMonth && !isFuture) {
											handleDateClick(dayInfo.date);
										}
									}}
									style={{
										padding: "8px",
										fontSize: "14px",
										textAlign: "center",
										borderRadius: "8px",
										cursor:
											dayInfo.isCurrentMonth && !isFuture
												? "pointer"
												: "not-allowed",
										color: !dayInfo.isCurrentMonth
											? "#d1d5db"
											: isFuture
												? "#9ca3af"
												: isSelected
													? "white"
													: "#1f2937",
										background: isSelected
											? "#133e87"
											: isToday
												? "#e0e7ff"
												: "transparent",
										fontWeight: isSelected || isToday ? 600 : 400,
										transition: "all 0.2s ease",
										opacity: isFuture ? 0.5 : 1,
									}}
									onMouseEnter={(e) => {
										if (dayInfo.isCurrentMonth && !isFuture && !isSelected) {
											e.currentTarget.style.background = "#f3f4f6";
										}
									}}
									onMouseLeave={(e) => {
										if (!isSelected && !isToday) {
											e.currentTarget.style.background = "transparent";
										} else if (isToday && !isSelected) {
											e.currentTarget.style.background = "#e0e7ff";
										}
									}}
								>
									{dayInfo.day}
								</div>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
};

export default CustomDatePicker;
