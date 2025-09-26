import Home from "@/pages/Home";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: RouteComponent,
	beforeLoad: () => {
		throw redirect({ to: "/user/channels" });
	},
});

function RouteComponent() {
	return <Home />;
}
