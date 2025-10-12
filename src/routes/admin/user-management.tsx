import { UserManagement } from "@/pages/UserManagement";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const userManagementSearchSchema = z.object({
	tab: z.enum(["user", "group"]).optional(),
});

export const Route = createFileRoute("/admin/user-management")({
	component: UserManagement,
	validateSearch: userManagementSearchSchema,
});
