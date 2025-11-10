import CodeCollab from "@/pages/CodeCollab";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/chat/group/$groupId/code-collab")({
	component: CodeCollab,
	validateSearch: (search: Record<string, unknown>) => ({
		channel: (search.channel as string) || undefined,
	}),
});
