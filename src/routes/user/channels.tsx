import { ChatChannel } from "@/pages/User/Channel";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/user/channels")({
	component: ChatChannel,
});
