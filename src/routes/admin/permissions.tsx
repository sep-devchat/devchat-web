import AdminLayout from "@/layouts/AdminLayout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/permissions")({
	component: AdminLayout,
});

export const routeInfo = {
	title: "Permissions",
	path: "/admin/permissions",
};
