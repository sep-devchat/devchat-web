import { Granularity, PeriodPresetMap, RangeState } from "./Analytics.types";

const formatDateInput = (date: Date) => date.toISOString().split("T")[0];

const formatMonthInput = (date: Date) =>
	`${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}`;

const addDays = (date: Date, amount: number) => {
	const next = new Date(date);
	next.setDate(next.getDate() + amount);
	return next;
};

const addMonths = (date: Date, amount: number) =>
	new Date(date.getFullYear(), date.getMonth() + amount, 1);

const getDailyPresetRange = (preset: string): RangeState => {
	const today = new Date();
	switch (preset) {
		case "today":
			return { start: formatDateInput(today), end: formatDateInput(today) };
		case "yesterday": {
			const y = addDays(today, -1);
			return { start: formatDateInput(y), end: formatDateInput(y) };
		}
		case "last_7_days":
		default:
			return {
				start: formatDateInput(addDays(today, -6)),
				end: formatDateInput(today),
			};
	}
};

const getMonthlyPresetRange = (preset: string): RangeState => {
	const currentMonth = new Date(
		new Date().getFullYear(),
		new Date().getMonth(),
		1,
	);
	switch (preset) {
		case "last_month": {
			const last = addMonths(currentMonth, -1);
			return {
				start: formatMonthInput(last),
				end: formatMonthInput(last),
			};
		}
		case "last_6_months":
			return {
				start: formatMonthInput(addMonths(currentMonth, -5)),
				end: formatMonthInput(currentMonth),
			};
		case "last_12_months":
			return {
				start: formatMonthInput(addMonths(currentMonth, -11)),
				end: formatMonthInput(currentMonth),
			};
		case "this_month":
		default:
			return {
				start: formatMonthInput(currentMonth),
				end: formatMonthInput(currentMonth),
			};
	}
};

const parseMonthInput = (value: string) => {
	const [yearStr, monthStr] = value.split("-");
	const year = Number(yearStr);
	const monthIndex = Number(monthStr) - 1;
	if (Number.isNaN(year) || Number.isNaN(monthIndex)) {
		return null;
	}
	return new Date(year, monthIndex, 1);
};

export const periodPresets: PeriodPresetMap = {
	daily: [
		{ label: "Today", value: "today" },
		{ label: "Yesterday", value: "yesterday" },
		{ label: "Last 7 days", value: "last_7_days" },
	],
	monthly: [
		{ label: "This month", value: "this_month" },
		{ label: "Last month", value: "last_month" },
		{ label: "Last 6 months", value: "last_6_months" },
		{ label: "Last 12 months", value: "last_12_months" },
	],
} as const;

export const defaultPresetByGranularity: Record<Granularity, string> = {
	daily: periodPresets.daily[0].value,
	monthly: periodPresets.monthly[0].value,
};

export const getPresetRange = (
	mode: Granularity,
	preset: string,
): RangeState =>
	mode === "daily"
		? getDailyPresetRange(preset)
		: getMonthlyPresetRange(preset);

export const compareRangeValues = (
	mode: Granularity,
	left: string,
	right: string,
) => {
	if (!left || !right) {
		return 0;
	}
	if (mode === "daily") {
		const a = new Date(left);
		const b = new Date(right);
		if (Number.isNaN(a.valueOf()) || Number.isNaN(b.valueOf())) {
			return 0;
		}
		return a.getTime() - b.getTime();
	}
	const a = parseMonthInput(left);
	const b = parseMonthInput(right);
	if (!a || !b) {
		return 0;
	}
	return a.getTime() - b.getTime();
};

export const getRangeInputType = (mode: Granularity) =>
	mode === "daily" ? "date" : "month";
