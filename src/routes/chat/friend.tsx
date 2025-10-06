import Friend from "@/pages/Friend";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const friendSearchSchema = z.object({
	tab: z.enum(["all", "pending", "add-friend"]).optional().default("all"),
});

export type FriendSearch = z.infer<typeof friendSearchSchema>;

export const Route = createFileRoute("/chat/friend")({
	component: Friend,
	validateSearch: friendSearchSchema,
});
