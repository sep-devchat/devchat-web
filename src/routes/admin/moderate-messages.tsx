import ModerateMessages from "@/pages/ModerateMessages";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const moderateMessagesSearchSchema = z.object({
	tab: z
		.enum(["pending-review", "approved", "deleted", "user-warned", "escalated"])
		.optional(),
});

export const Route = createFileRoute("/admin/moderate-messages")({
	component: ModerateMessages,
	validateSearch: moderateMessagesSearchSchema,
});
