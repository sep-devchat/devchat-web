import AdminLayout from "@/layouts/AdminLayout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/moderate-messages")({
	component: AdminLayout,
});

export const routeInfo = {
	title: "Moderate Messages",
	path: "/admin/moderate-messages",
	tabs: [
		{
			id: "pending-review",
			label: "Pending Review",
			path: "/admin/moderate-messages",
		},
		{ id: "approved", label: "Approved", path: "/admin/moderate-messages" },
		{ id: "deleted", label: "Deleted", path: "/admin/moderate-messages" },
		{
			id: "user-warned",
			label: "User Warned",
			path: "/admin/moderate-messages",
		},
		{ id: "escalated", label: "Escalated", path: "/admin/moderate-messages" },
	],
};
