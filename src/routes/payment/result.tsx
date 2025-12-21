import { createFileRoute } from "@tanstack/react-router";
import PaymentResult from "@/pages/PaymentResult";

export const Route = createFileRoute("/payment/result")({
	component: PaymentResult,
});
