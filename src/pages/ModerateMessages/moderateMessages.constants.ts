import { Tab, TabId } from "./moderateMessages.types";

export const TABS: Tab[] = [
	{ id: "pending-review", label: "Flagged Messages" },
	{ id: "approved", label: "Approved" },
	{ id: "deleted", label: "Deleted" },
	{ id: "user-warned", label: "Warned" },
	{ id: "escalated", label: "Escalated Messages" },
];

export const DEFAULT_TAB: TabId = "pending-review";

export const getTodayDateFormatted = (): string => {
	const today = new Date();
	const day = String(today.getDate()).padStart(2, "0");
	const month = String(today.getMonth() + 1).padStart(2, "0");
	const year = today.getFullYear();
	return `${day}/${month}/${year}`;
};
