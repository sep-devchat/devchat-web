import { createFileRoute } from "@tanstack/react-router";
import VerifyMail from "../../pages/VerifyMail";
import { verifyEmail } from "@/services/auth/authAPI";

export const Route = createFileRoute("/auth/verify")({
	// Read token from the search query: /auth/verify?token=...
	validateSearch: (search: Record<string, unknown>) => {
		return {
			token: typeof search.token === "string" ? search.token : undefined,
		};
	},
	beforeLoad: async ({ search }) => {
		const token = (search as { token?: string }).token;
		if (!token) {
			return {
				verifyStatus: "error" as const,
				verifyMessage: "Missing verification token in URL.",
			};
		}
		try {
			const res = await verifyEmail(token);
			return {
				verifyStatus: "success" as const,
				verifyMessage: res?.data?.message || "Your email has been verified.",
			};
		} catch (e: any) {
			return {
				verifyStatus: "error" as const,
				verifyMessage:
					e?.response?.data?.message ||
					"Verification failed. The link may be invalid or expired.",
			};
		}
	},
	component: () => {
		const { verifyStatus, verifyMessage } = Route.useRouteContext() as {
			verifyStatus: "success" | "error" | "loading";
			verifyMessage?: string;
		};
		return <VerifyMail status={verifyStatus} message={verifyMessage} />;
	},
});
