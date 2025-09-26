import { createFileRoute } from "@tanstack/react-router";
import { ChatChanel } from "@/pages/User/Channel";

// export const Route = createFileRoute('/channels/$groupId/$channelId')({
export const Route = createFileRoute("/user/channels")({
	component: ChatChanel,
});
