import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { useMutation } from "@tanstack/react-query";
import z from "zod";
import { register, registerPkce } from "@/services/authAPI";
import RegisterPage from "@/pages/Register";


const registerSearchParamsSchema = z.object({
    codeChallenge: z.string().optional(),
    codeChallengeMethod: z.string().optional(),
});


export const Route = createFileRoute("/auth/register")({
    component: RouteComponent,
    validateSearch: zodValidator(registerSearchParamsSchema),
});


function RouteComponent() {
    const { codeChallenge, codeChallengeMethod } = Route.useSearch();


    const registerMutation = useMutation({
        mutationFn: register,
        onSuccess: (response) => {
            console.log("Registration successful:", response);
            window.location.href = "/auth/login";
        },
        onError: (error) => {
            console.error("Registration failed:", error);
        },
    });


    const registerPkceMutation = useMutation({
        mutationFn: registerPkce,
        onSuccess: (response) => {
            const responseData = response.data.data;
            window.location.href = `devchat://?code=${responseData.authCode}`;
        },
        onError: (error) => {
            console.error("PKCE Registration failed:", error);
        },
    });


    return (
        <RegisterPage
            codeChallenge={codeChallenge}
            codeChallengeMethod={codeChallengeMethod}
            registerMutation={registerMutation}
            registerPkceMutation={registerPkceMutation}
        />
    );
}
