import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import config from "@/config";
import publicRuntimeConfig from "@/config/publicRuntime";
import { rootRoute } from "@/routes/root";
import { loginGoogle } from "@/services/authAPI";
import { GoogleLogin } from "@react-oauth/google";
import { createRoute } from "@tanstack/react-router";
import { useState } from "react";

const LoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: config.routes.public.login,
  component: Login,
});

function Login() {
  const [loginData, setLoginData] = useState({
    usernameOrEmail: "",
    password: "",
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
          <Button onClick={() => console.log(loginData)}>Login</Button>
        </div>
      </div>

      <Separator />

      <div>
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            console.log(credentialResponse);
            if (!credentialResponse.credential) return;
            const data = await loginGoogle(credentialResponse.credential);
            console.log(data);
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

export default LoginRoute;
