import AdminLayout from "@/layouts/AdminLayout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
	component: AdminLayout,
});
