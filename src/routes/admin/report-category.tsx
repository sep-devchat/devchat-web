import ReportCategory from "@/pages/ReportCategory";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/report-category")({
	component: ReportCategory,
});
