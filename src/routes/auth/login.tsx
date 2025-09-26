import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { useMutation } from "@tanstack/react-query";
import z from "zod";

import { login, loginPkce } from "@/services/authAPI";
import LoginPage from "@/pages/Login";

const loginSearchParamsSchema = z.object({
	codeChallenge: z.string().optional(),
	codeChallengeMethod: z.string().optional(),
});

export const Route = createFileRoute("/auth/login")({
	component: RouteComponent,
	validateSearch: zodValidator(loginSearchParamsSchema),
});

function RouteComponent() {
	const navigate = useNavigate();
	const { codeChallenge, codeChallengeMethod } = Route.useSearch();

	const loginMutation = useMutation({
		mutationFn: login,
		onSuccess: (data) => {
			console.log("Login successful:", data);
			navigate({
				to: "/user/channels",
			});
		},
	});

	const loginPkceMutation = useMutation({
		mutationFn: loginPkce,
		onSuccess: (response) => {
			const responseData = response.data.data;
			window.location.href = `devchat://?code=${responseData.authCode}`;
		},
	});

	return (
		<LoginPage
			codeChallenge={codeChallenge}
			codeChallengeMethod={codeChallengeMethod}
			loginMutation={loginMutation}
			loginPkceMutation={loginPkceMutation}
		/>
	);
}
