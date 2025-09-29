import { get, post } from "../apiCaller";
import {
	LoginPkceRequest,
	LoginRequest,
	Profile,
	RegisterPkceRequest,
	RegisterRequest,
	TokenResponse,
} from "./auth.type";

export const login = async (dto: LoginRequest) => {
	return post<TokenResponse>("/api/auth/login", dto);
};

export const loginPkce = async (dto: LoginPkceRequest) => {
	return post("/api/auth/login-pkce", dto);
};

export const register = async (dto: RegisterRequest) => {
	return post("/api/auth/register", dto);
};

export const registerPkce = async (dto: RegisterPkceRequest) => {
	return post("/api/auth/register-pkce", dto);
};

export const fetchProfile = async () => {
	return get<Profile>("/api/auth/profile");
};
