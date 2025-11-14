import DirectMessage from "@/pages/DirectMessage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/chat/user/$userId")({
	component: DirectMessage,
});
