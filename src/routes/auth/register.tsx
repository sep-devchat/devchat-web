import { createFileRoute, useRouter } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { useMutation } from "@tanstack/react-query";
import z from "zod";
import { register, registerPkce } from "@/services/auth/authAPI";
import RegisterPage from "@/pages/Register";
import { useDispatch } from "react-redux";
import { setPendingEmail } from "@/store/user.slice";

const registerSearchParamsSchema = z.object({
	codeChallenge: z.string().optional(),
	codeChallengeMethod: z.string().optional(),
});

export const Route = createFileRoute("/auth/register")({
	component: RouteComponent,
	validateSearch: zodValidator(registerSearchParamsSchema),
});

function RouteComponent() {
	const { codeChallenge, codeChallengeMethod } = Route.useSearch();
	const dispatch = useDispatch();
	const router = useRouter();

	const registerMutation = useMutation({
		mutationFn: register,
		onSuccess: (_response, variables) => {
			console.log("Registration successful:", _response);
			console.log("Registered email:", (variables as any)?.email);
			// Store email in redux, then navigate to confirm mail page
			const email = (variables as any)?.email ?? "";
			if (email) dispatch(setPendingEmail(email));
			router.navigate({ to: "/auth/confirm-mail" });
		},
		onError: (error) => {
			console.error("Registration failed:", error);
		},
	});

	const registerPkceMutation = useMutation({
		mutationFn: registerPkce,
		onSuccess: (response) => {
			const responseData = response.data.data;
			window.location.href = `devchat://?code=${responseData.authCode}`;
		},
		onError: (error) => {
			console.error("PKCE Registration failed:", error);
		},
	});

	return (
		<RegisterPage
			codeChallenge={codeChallenge}
			codeChallengeMethod={codeChallengeMethod}
			registerMutation={registerMutation}
			registerPkceMutation={registerPkceMutation}
		/>
	);
}
