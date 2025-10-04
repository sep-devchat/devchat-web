import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/permission")({
	// component: AdminLayout,
});

export const routeInfo = {
	title: "Permissions",
	path: "/admin/permissions",
};
