import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import publicRuntimeConfig from "@/config/publicRuntime";
import { login, loginPkce } from "@/services/authAPI";
import { GoogleLogin } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { useState } from "react";
import z from "zod";

const loginSearchParamsSchema = z.object({
  codeChallenge: z.string().optional(),
  codeChallengeMethod: z.string().optional(),
});

export const Route = createFileRoute("/auth/login")({
  component: RouteComponent,
  validateSearch: zodValidator(loginSearchParamsSchema),
});

function RouteComponent() {
  const { codeChallenge, codeChallengeMethod } = Route.useSearch();

  const [loginData, setLoginData] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const loginMutation = useMutation({
    mutationFn: login,
  });

  const loginPkceMutation = useMutation({
    mutationFn: loginPkce,
    onSuccess: (response) => {
      const responseData = response.data.data;
      window.location.href = `devchat://?code=${responseData.authCode}`;
    },
  });

  return (
    <div>
      <h1>Login</h1>
      <div>
        <div>
          <Label htmlFor="usernameOrEmailInput">Username or Email</Label>
          <Input
            type="text"
            id="usernameOrEmailInput"
            value={loginData.usernameOrEmail}
            onChange={(e) =>
              setLoginData({ ...loginData, usernameOrEmail: e.target.value })
            }
          />
        </div>

        <div>
          <Label htmlFor="passwordInput">Password</Label>
          <Input
            type="password"
            id="passwordInput"
            value={loginData.password}
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
          />
        </div>

        <div>
          <Button
            onClick={() => {
              const code = btoa(
                `${loginData.usernameOrEmail}:${loginData.password}`
              );
              if (codeChallenge && codeChallengeMethod) {
                loginPkceMutation.mutate({
                  method: "basic",
                  code: code,
                  codeChallenge: codeChallenge,
                  codeChallengeMethod: codeChallengeMethod,
                });
              } else {
                loginMutation.mutate({
                  method: "basic",
                  code: code,
                });
              }
            }}
          >
            Login
          </Button>
        </div>
      </div>

      <Separator />

      <div>
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            console.log(credentialResponse);
            if (!credentialResponse.credential) return;

            if (codeChallenge && codeChallengeMethod) {
              loginPkceMutation.mutate({
                method: "google",
                code: credentialResponse.credential,
                codeChallenge: codeChallenge,
                codeChallengeMethod: codeChallengeMethod,
              });
            } else {
              loginMutation.mutate({
                method: "google",
                code: credentialResponse.credential,
              });
            }
          }}
          onError={() => {
            console.log("Login Failed");
          }}
        />

        <Button
          onClick={() => {
            const githubAuthUrl = `https://github.com/login/oauth/authorize?scope=user:email&client_id=${publicRuntimeConfig.GITHUB_CLIENT_ID}`;
            window.location.href = githubAuthUrl;
          }}
        >
          Login GitHub
        </Button>
      </div>
    </div>
  );
}
