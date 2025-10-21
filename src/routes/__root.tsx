import NotificationProvider from "@/components/NotificationProvider";
import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
	component: RootComponent,
});

function RootComponent() {
	return (
		<>
			<NotificationProvider />
			<Outlet />
		</>
	);
}
