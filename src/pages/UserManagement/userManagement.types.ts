import { MessageItemType } from "@/types/moderateMessage.types";

export type TabId =
	| "pending-review"
	| "approved"
	| "deleted"
	| "user-warned"
	| "escalated";

export interface Tab {
	id: TabId;
	label: string;
}

export interface StatData {
	value: string | number;
	label: string;
	trend: number;
	trendDirection: "up" | "down";
	color: "blue" | "red" | "green" | "yellow";
}

export interface FilterValues {
	priority: string;
	category: string;
	group: string;
	dateRange: string;
}

export type StatsDataMap = Record<TabId, StatData[]>;
export type MessagesDataMap = Record<TabId, MessageItemType[]>;
export type TabFiltersMap = Record<TabId, FilterValues>;
