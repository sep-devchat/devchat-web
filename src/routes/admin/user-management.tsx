import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/user-management")({
	// component: AdminLayout,
});

export const routeInfo = {
	title: "User Management",
	path: "/admin/user-management",
};
