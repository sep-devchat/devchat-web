import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/dashboard")({
	// component: AdminLayout,
});

export const routeInfo = {
	title: "Dashboard",
	path: "/admin/dashboard",
};
