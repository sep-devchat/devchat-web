import Analytics from "@/pages/Analytics";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const analyticsSearchSchema = z.object({
	tab: z
		.enum(["user", "language", "group", "system"])
		.optional()
		.default("user"),
});

export const Route = createFileRoute("/admin/analytics")({
	component: Analytics,
	validateSearch: analyticsSearchSchema,
});

export const routeInfo = {
	title: "Analytics Dashboard",
	path: "/admin/analytics",
	tabs: [
		{ id: "user", label: "User", path: "/admin/analytics?tab=user" },
		{
			id: "language",
			label: "Language",
			path: "/admin/analytics?tab=language",
		},
		{ id: "group", label: "Group", path: "/admin/analytics?tab=group" },
		{ id: "system", label: "System", path: "/admin/analytics?tab=system" },
	],
};
