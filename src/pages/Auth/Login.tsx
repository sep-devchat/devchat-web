import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import publicRuntimeConfig from "@/config/publicRuntime";
import { login } from "@/services/authAPI";
import { GoogleLogin } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

const Login = () => {
  const [loginData, setLoginData] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const loginMutation = useMutation({
    mutationFn: login,
  })

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
          <Button onClick={() => {
            loginMutation.mutate({ method: "basic", code: btoa(`${loginData.usernameOrEmail}:${loginData.password}`) })
          }}>Login</Button>
        </div>
      </div>

      <Separator />

      <div>
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            console.log(credentialResponse);
            if (!credentialResponse.credential) return;
            loginMutation.mutate({ method: "google", code: credentialResponse.credential });
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

export default Login;
