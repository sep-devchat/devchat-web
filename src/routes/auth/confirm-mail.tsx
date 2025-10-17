import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import z from "zod";
import { ConfirmMail } from "@/pages/ConfirmMail";
const searchParamsSchema = z.object({
	email: z.string().email().optional(),
});

export const Route = createFileRoute("/auth/confirm-mail")({
	validateSearch: zodValidator(searchParamsSchema),
	component: () => {
		return <ConfirmMail />;
	},
});
