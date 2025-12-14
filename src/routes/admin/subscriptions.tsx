import SubscriptionManagement from "@/pages/SubscriptionManagement";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/subscriptions")({
	component: SubscriptionManagement,
});

export const routeInfo = {
	title: "Subscriptions",
	path: "/admin/subscriptions",
};
