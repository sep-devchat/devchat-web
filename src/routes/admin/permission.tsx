import Permission from "@/pages/Permission";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const permissionSchema = z.object({
	tab: z
		.enum([
			"system-roles",
			"feature",
			"project",
			"resource-limit",
			"api-keys",
			"code-execution",
			"security",
			"change-history",
		])
		.optional(),
});

export const Route = createFileRoute("/admin/permission")({
	component: Permission,
	validateSearch: permissionSchema,
});
