import { UserManagement } from "@/pages/UserManagement";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/user-management")({
	component: UserManagement,
});
