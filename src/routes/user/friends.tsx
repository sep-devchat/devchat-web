import { createFileRoute } from "@tanstack/react-router";
import { ChatChanel } from "@/pages/User/Friend";

export const Route = createFileRoute("/user/friends")({
	component: ChatChanel,
});
