import config from "@/config";
import { rootRoute } from "@/routes/root";
import { loginGitHub } from "@/services/authAPI";
import { useMutation } from "@tanstack/react-query";
import { createRoute } from "@tanstack/react-router";
import { useEffect } from "react";

const LoginGitHubRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: config.routes.public.loginGitHub,
  component: LoginGitHub,
});

function LoginGitHub() {
  const searchParams: any = LoginGitHubRoute.useSearch();
  const loginGitHubMutation = useMutation({
    mutationFn: loginGitHub,
    onSuccess: (data) => {
      console.log("GitHub login successful:", data);
      window.location.href = "/";
    },
  });

  useEffect(() => {
    if (searchParams.code) {
      loginGitHubMutation.mutate(searchParams.code);
    }
  }, [searchParams]);

  return (
    <div>
      {loginGitHubMutation.isSuccess ? (
        <div>Login successful!</div>
      ) : loginGitHubMutation.isPending ? (
        <div>Logging in...</div>
      ) : loginGitHubMutation.isError ? (
        <div>Error during login. Please try again.</div>
      ) : (
        <div>Redirecting to GitHub for authentication...</div>
      )}
    </div>
  );
}

export default LoginGitHubRoute;
