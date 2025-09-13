import config from "@/config";
import { rootRoute } from "@/routes/root";
import { login } from "@/services/authAPI";
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
  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      console.log("GitHub login successful:", data);
      window.location.href = "/";
    },
  });

  useEffect(() => {
    if (searchParams.code) {
      loginMutation.mutate({ method: "github", code: searchParams.code });
    }
  }, [searchParams]);

  return (
    <div>
      {loginMutation.isSuccess ? (
        <div>Login successful!</div>
      ) : loginMutation.isPending ? (
        <div>Logging in...</div>
      ) : loginMutation.isError ? (
        <div>Error during login. Please try again.</div>
      ) : (
        <div>Redirecting to GitHub for authentication...</div>
      )}
    </div>
  );
}

export default LoginGitHubRoute;
