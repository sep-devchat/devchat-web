import TransactionHistory from "@/pages/TransactionHistory";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/transactions")({
	component: TransactionHistory,
});

export const routeInfo = {
	title: "Transactions",
	path: "/admin/transactions",
};
