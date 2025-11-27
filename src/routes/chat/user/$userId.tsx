import DirectMessage from "@/pages/DirectMessage";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const directChatSearchSchema = z.object({
	tab: z.enum(["code", "info"]).optional(),
});

export type DirectChatSearch = z.infer<typeof directChatSearchSchema>;

export const Route = createFileRoute("/chat/user/$userId")({
	component: DirectMessage,
	validateSearch: directChatSearchSchema,
});
