import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";
import { ExternalLinkIcon, LogInIcon } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/auth/login-electron")({
	component: RouteComponent,
});

function RouteComponent() {
	const [isOpening, setIsOpening] = useState(false);

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
								// const codeVerifier =
								// 	await window.nativeAPI.openBrowserForLogin();
								// setCodeVerifier(codeVerifier);
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
