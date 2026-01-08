import OrderHistory from "@/pages/OrderHistory";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/orders")({
	component: OrderHistory,
});

export const routeInfo = {
	title: "Orders",
	path: "/admin/orders",
};
