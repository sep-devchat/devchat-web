import ChatGroup from "@/pages/ChatGroup";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/chat/group/$groupId")({
	component: ChatGroup,
});
