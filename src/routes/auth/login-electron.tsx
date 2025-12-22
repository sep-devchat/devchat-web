import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useAuth, useSocket } from "@/hooks";
import { DeepLinkPayload } from "@/native/types";
import { pkceIssueToken } from "@/services/auth/authAPI";
import cookieUtils from "@/services/cookieUtils";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ExternalLinkIcon, LogInIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/login-electron")({
	component: RouteComponent,
	validateSearch: (search: Record<string, unknown>) => ({
		message: typeof search.message === "string" ? search.message : undefined,
	}),
});

function RouteComponent() {
	const { message } = Route.useSearch();
	const { refetchProfile, profile } = useAuth();
	const [codeVerifier, setCodeVerifier] = useState<string>("");
	const [isOpening, setIsOpening] = useState<boolean>(false);
	const { socket } = useSocket();
	const navigate = useNavigate();

	useEffect(() => {
		if (profile) {
			if (profile.isAdmin) {
				navigate({ to: "/admin", replace: true });
			} else {
				navigate({ to: "/chat", replace: true });
			}
		}
	}, [profile]);

	const loginPkceMutation = useMutation({
		mutationFn: pkceIssueToken,
		onSuccess: async (response) => {
			cookieUtils.setToken(response.data.accessToken);
			await refetchProfile();
			socket.connect();
			toast.success("Login successfully!");
			navigate({ to: "/chat", replace: true });
		},
		onError: (error) => {
			toast.error(`Login failed: ${error.message}`);
		},
	});

	useEffect(() => {
		if (message) {
			toast.message(message);
		}
	}, [message]);

	useEffect(() => {
		const dispose = window.nativeAPI.nativeAPICallback(
			"deep-link",
			(_e, payload: DeepLinkPayload) => {
				console.log("Received deep link payload:", payload);

				loginPkceMutation.mutate({
					authCode: payload.code,
					codeChallengeMethod: "plain",
					codeVerifier: codeVerifier,
				});
			},
		);

		return () => {
			dispose();
		};
	}, [codeVerifier, loginPkceMutation]);

	return (
		<div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/40 p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-2xl">Welcome to DevChat</CardTitle>
					<CardDescription>
						Sign in to continue. We’ll open a secure browser window to
						authenticate.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{message ? (
						<div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
							{message}
						</div>
					) : null}
					<div className="text-sm text-muted-foreground">
						Use your account to log in. After authorizing in the browser, return
						to the app to finish.
					</div>
				</CardContent>
				<CardFooter className="flex gap-2 justify-end">
					{/* <Button
						variant="outline"
						onClick={() => {
							window.location.href = "https://devchat.online/auth/register";
						}}
					>
						<UserPlus className="size-4" /> Sign Up
					</Button> */}
					<Button
						onClick={async () => {
							try {
								setIsOpening(true);
								const codeVerifier =
									await window.nativeAPI.openBrowserForLogin();
								setCodeVerifier(codeVerifier);
							} finally {
								setIsOpening(false);
							}
						}}
						disabled={isOpening}
					>
						{isOpening ? (
							<>
								{/* Simple spinner via Tailwind animate-spin */}
								<span className="mr-2 inline-block size-4 rounded-full border-2 border-transparent border-t-current animate-spin" />
								Opening…
							</>
						) : (
							<>
								<LogInIcon className="size-4" /> Sign In{" "}
								<ExternalLinkIcon className="size-4" />
							</>
						)}
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
