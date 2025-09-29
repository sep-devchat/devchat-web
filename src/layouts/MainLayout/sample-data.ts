export type Group = {
	id: string;
	name: string;
	initials: string;
	avatarColor?: string;
	unread?: number;
};

export const groups: Group[] = [
	{
		id: "g-1",
		name: "General",
		initials: "GN",
		avatarColor: "#6366F1",
		unread: 3,
	},
	{
		id: "g-2",
		name: "Development",
		initials: "DV",
		avatarColor: "#22C55E",
		unread: 1,
	},
	{ id: "g-3", name: "Design", initials: "DS", avatarColor: "#EAB308" },
	{
		id: "g-4",
		name: "Marketing",
		initials: "MK",
		avatarColor: "#EF4444",
		unread: 8,
	},
	{ id: "g-5", name: "Support", initials: "SP", avatarColor: "#06B6D4" },
	{ id: "g-6", name: "QA", initials: "QA", avatarColor: "#8B5CF6", unread: 2 },
	{ id: "g-7", name: "HR", initials: "HR", avatarColor: "#F472B6" },
	{
		id: "g-8",
		name: "Partners",
		initials: "PR",
		avatarColor: "#10B981",
		unread: 5,
	},
	{ id: "g-9", name: "Infra", initials: "IF", avatarColor: "#3B82F6" },
	{ id: "g-10", name: "Mobile", initials: "MB", avatarColor: "#F97316" },
	{
		id: "g-11",
		name: "Web",
		initials: "WB",
		avatarColor: "#14B8A6",
		unread: 4,
	},
	{ id: "g-12", name: "Research", initials: "RS", avatarColor: "#A855F7" },
];
