import { post } from "./apiCaller"

export interface LoginRequest {
    method: string;
    code: string;
}

export const login = async (dto: LoginRequest) => {
    return post("/api/auth/login", dto);
}
