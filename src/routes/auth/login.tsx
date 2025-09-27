import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { useMutation } from "@tanstack/react-query";
import z from "zod";

import { login, loginPkce } from "@/services/authAPI";
import LoginPage from "@/pages/Login";
import { useAuth } from "@/hooks";
import cookieUtils from "@/services/cookieUtils";

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
	const { refetchProfile } = useAuth();
	const { codeChallenge, codeChallengeMethod } = Route.useSearch();

	const loginMutation = useMutation({
		mutationFn: login,
		onSuccess: async (res) => {
			cookieUtils.setToken(res.data.accessToken);
			await refetchProfile();
			navigate({
				to: "/user/channels",
			});
		},
	});

	const loginPkceMutation = useMutation({
		mutationFn: loginPkce,
		onSuccess: (response) => {
			const responseData = response.data;
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
