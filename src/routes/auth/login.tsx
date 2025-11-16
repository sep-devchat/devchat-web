import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { useMutation } from "@tanstack/react-query";
import z from "zod";

import { login, loginPkce } from "@/services/auth/authAPI";
import LoginPage from "@/pages/Login";
import { useAuth, useSocket } from "@/hooks";
import cookieUtils from "@/services/cookieUtils";
import publicRuntimeConfig from "@/config/publicRuntime";
import { useEffect } from "react";

const loginSearchParamsSchema = z.object({
	codeChallenge: z.string().optional(),
	codeChallengeMethod: z.string().optional(),
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
	const navigate = useNavigate();
	const { refetchProfile } = useAuth();
	const { codeChallenge, codeChallengeMethod } = Route.useSearch();
	const { socket } = useSocket();

	const loginMutation = useMutation({
		mutationFn: login,
		onSuccess: async (res) => {
			cookieUtils.setToken(res.data.accessToken);
			await refetchProfile();
			socket.connect();
			navigate({
				to: "/chat",
			});
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

	useEffect(() => {
		console.log("codeChallenge", codeChallenge);
		console.log("codeChallengeMethod", codeChallengeMethod);
		console.log("loginMutation", loginMutation);
		console.log("loginPkceMutation", loginPkceMutation);
	}, [codeChallenge, codeChallengeMethod, loginMutation, loginPkceMutation]);

	return (
		<LoginPage
			codeChallenge={codeChallenge}
			codeChallengeMethod={codeChallengeMethod}
			loginMutation={loginMutation}
			loginPkceMutation={loginPkceMutation}
		/>
	);
}
