import Analytics from "@/pages/Analytics";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const dashboardSearchSchema = z.object({
	tab: z.enum(["user", "report"]).optional().default("user"),
});

export const Route = createFileRoute("/admin/dashboard")({
	component: Analytics,
	validateSearch: dashboardSearchSchema,
});

export const routeInfo = {
	title: "Dashboard",
	path: "/admin/dashboard",
	tabs: [
		{ id: "user", label: "User", path: "/admin/dashboard?tab=user" },
		{ id: "report", label: "Report", path: "/admin/dashboard?tab=report" },
	],
};
