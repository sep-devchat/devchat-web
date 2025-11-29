import ChatGroup from "@/pages/ChatGroup";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const groupChatSearchSchema = z.object({
	channel: z.string().optional(),
	tab: z.enum(["tasks", "thread", "code", "users", "info"]).optional(),
	thread: z.string().optional(),
});

export type GroupChatSearch = z.infer<typeof groupChatSearchSchema>;

export const Route = createFileRoute("/chat/group/$groupId")({
	component: ChatGroup,
	validateSearch: groupChatSearchSchema,
});
