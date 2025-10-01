import AdminLayout from "@/layouts/AdminLayout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/analytics")({
	component: AdminLayout,
});

export const routeInfo = {
	title: "Analytics Dashboard",
	path: "/admin/analytics",
	tabs: [
		{ id: "user", label: "User", path: "/admin/analytics" },
		{ id: "language", label: "Language", path: "/admin/analytics" },
		{ id: "group", label: "Group", path: "/admin/analytics" },
		{ id: "system", label: "System", path: "/admin/analytics" },
	],
};
