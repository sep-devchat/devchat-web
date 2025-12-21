import { createFileRoute, redirect } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { useMutation } from "@tanstack/react-query";
import z from "zod";

import { login, loginPkce } from "@/services/auth/authAPI";
import LoginPage from "@/pages/Login";
import { useAuth, useSocket } from "@/hooks";
import cookieUtils from "@/services/cookieUtils";
import publicRuntimeConfig from "@/config/publicRuntime";
import { store } from "@/store";

const loginSearchParamsSchema = z.object({
	codeChallenge: z.string().optional(),
	codeChallengeMethod: z.string().optional(),
	message: z.string().optional(),
});

export const Route = createFileRoute("/auth/login")({
	component: RouteComponent,
	validateSearch: zodValidator(loginSearchParamsSchema),
	beforeLoad: () => {
		if (publicRuntimeConfig.ELECTRON) {
			throw redirect({ to: "/auth/login-electron" });
		}
	},
});

function RouteComponent() {
	const { refetchProfile } = useAuth();
	const { codeChallenge, codeChallengeMethod, message } = Route.useSearch();
	const { socket } = useSocket();

	const getPostLoginRedirect = () => {
		const latestProfile = store.getState().user.profile;
		return latestProfile?.isAdmin ? "/admin" : "/chat/friend";
	};

	const loginMutation = useMutation({
		mutationFn: login,
		onSuccess: async (res) => {
			cookieUtils.setToken(res.data.accessToken);
			await refetchProfile();
			socket.connect();
			window.location.href = getPostLoginRedirect();
		},
	});

	const loginPkceMutation = useMutation({
		mutationFn: loginPkce,
		onSuccess: (response) => {
			const responseData = response.data;
			localStorage.removeItem("codeChallenge");
			localStorage.removeItem("codeChallengeMethod");
			window.location.href = `devchat://?code=${responseData.authCode}`;
		},
	});

	return (
		<LoginPage
			codeChallenge={codeChallenge}
			codeChallengeMethod={codeChallengeMethod}
			loginMutation={loginMutation}
			loginPkceMutation={loginPkceMutation}
			sessionMessage={message}
		/>
	);
}
