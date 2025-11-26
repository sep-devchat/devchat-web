import AdminReports from "@/pages/AdminReports";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/reports")({
	component: AdminReports,
});
