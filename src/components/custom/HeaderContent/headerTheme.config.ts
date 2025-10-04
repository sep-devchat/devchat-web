export interface TabTheme {
	titleColor: string;
	backgroundColor: string;
	tabTextColor: string;
	tabActiveColor: string;
}

export const TAB_THEMES: Record<string, TabTheme> = {
	"pending-review": {
		titleColor: "#608BC1",
		backgroundColor: "#608BC133",
		tabTextColor: "#608BC1",
		tabActiveColor: "#1e40af",
	},
	approved: {
		titleColor: "#1CCA93",
		backgroundColor: "#1CCA9333",
		tabTextColor: "#1CCA93",
		tabActiveColor: "#15803d",
	},
	deleted: {
		titleColor: "#D83232",
		backgroundColor: "#D8323233",
		tabTextColor: "#D83232",
		tabActiveColor: "#b91c1c",
	},
	"user-warned": {
		titleColor: "#EFB008",
		backgroundColor: "#EFB00833",
		tabTextColor: "#EFB008",
		tabActiveColor: "#ca8a04",
	},
	escalated: {
		titleColor: "#B54BB3",
		backgroundColor: "#B54BB333",
		tabTextColor: "#B54BB3",
		tabActiveColor: "#7e22ce",
	},
	default: {
		titleColor: "#27364b",
		backgroundColor: "transparent",
		tabTextColor: "#133e87",
		tabActiveColor: "#3b82f6",
	},
};

export const getTabTheme = (tabId?: string | null): TabTheme => {
	if (!tabId) return TAB_THEMES.default;
	return TAB_THEMES[tabId] || TAB_THEMES.default;
};
