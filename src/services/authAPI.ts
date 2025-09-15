import { post } from "./apiCaller"

export interface LoginRequest {
    method: string;
    code: string;
}

export const login = async (dto: LoginRequest) => {
    return post("/api/auth/login", dto);
}

export interface LoginPkceRequest {
    method: string;
    code: string;
    codeChallenge: string;
    codeChallengeMethod: string;
}

export const loginPkce = async (dto: LoginPkceRequest) => {
    return post("/api/auth/login-pkce", dto);
}
