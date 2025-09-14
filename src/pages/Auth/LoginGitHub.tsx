import { login } from "@/services/authAPI";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";

function LoginGitHub(route: any) {
  const searchParams: any = route.useSearch();
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

export default LoginGitHub;
