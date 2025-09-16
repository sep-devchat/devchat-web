import { login } from "@/services/authAPI";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/auth/login-github")({
  component: RouteComponent,
});

function RouteComponent() {
  const searchParams: any = Route.useSearch();
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
