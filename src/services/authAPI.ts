import { post } from "./apiCaller"

export const loginGoogle = async (credential: string) => {
    return post("/api/auth/login-google", { credential })
}

export const loginGitHub = async (code: string) => {
    return post("/api/auth/login-github", { code });
}