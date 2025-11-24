import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/analytics")({
	beforeLoad: ({ search }) => {
		throw redirect({ to: "/admin/dashboard", search });
	},
});
