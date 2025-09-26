import { login, loginPkce } from "@/services/authAPI";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { useEffect } from "react";
import z from "zod";

const loginGitHubSearchParamsSchema = z.object({
  code: z.string(),
});

export const Route = createFileRoute("/auth/login-github")({
  component: RouteComponent,
  validateSearch: zodValidator(loginGitHubSearchParamsSchema),
});

function RouteComponent() {
  const { code } = Route.useSearch();
  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      console.log("GitHub login successful:", data);
    },
    onError: (error) => {
      console.error("GitHub login failed:", error);
    },
  });

  const loginPkceMutation = useMutation({
    mutationFn: loginPkce,
    onSuccess: (response) => {
      const responseData = response.data.data;
      window.location.href = `devchat://?code=${responseData.authCode}`;
    },
    onError: (error) => {
      console.error("GitHub PKCE login failed:", error);
    },
  });

  const isLoading = loginMutation.isPending || loginPkceMutation.isPending;
  const isError = loginMutation.isError || loginPkceMutation.isError;
  const isSuccess = loginMutation.isSuccess || loginPkceMutation.isSuccess;

  useEffect(() => {
    const codeChallenge = localStorage.getItem("codeChallenge");
    const codeChallengeMethod = localStorage.getItem("codeChallengeMethod");

    if (codeChallenge && codeChallengeMethod) {
      loginPkceMutation.mutate({
        method: "github",
        code,
        codeChallenge,
        codeChallengeMethod,
      });
      localStorage.removeItem("codeChallenge");
      localStorage.removeItem("codeChallengeMethod");
    } else {
      loginMutation.mutate({ method: "github", code });
    }
  }, []);

  return (
    <div>
      {isSuccess ? (
        <div>Login successful!</div>
      ) : isLoading ? (
        <div>Logging in...</div>
      ) : isError ? (
        <div>Error during login. Please try again.</div>
      ) : (
        <div>Redirecting to GitHub for authentication...</div>
      )}
    </div>
  );
}
