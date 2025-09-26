import { get, post } from "./apiCaller";

export interface LoginRequest {
	method: string;
	code: string;
}

export interface TokenResponse {
	accessToken: string;
	refreshToken: string;
}

export const login = async (dto: LoginRequest) => {
	return post<TokenResponse>("/api/auth/login", dto);
};

export interface LoginPkceRequest {
	method: string;
	code: string;
	codeChallenge: string;
	codeChallengeMethod: string;
}

export const loginPkce = async (dto: LoginPkceRequest) => {
	return post("/api/auth/login-pkce", dto);
};

export interface RegisterRequest {
	method: string;
	data?: {
		username: string;
		email: string;
		password: string;
		displayName?: string;
	};
	code?: string; // For Google/GitHub registration
}

export const register = async (dto: RegisterRequest) => {
	return post("/api/auth/register", dto);
};

export interface RegisterPkceRequest {
	method: string;
	data?: {
		username: string;
		email: string;
		password: string;
		displayName?: string;
	};
	code?: string; // For Google/GitHub registration
	codeChallenge: string;
	codeChallengeMethod: string;
}

export const registerPkce = async (dto: RegisterPkceRequest) => {
	return post("/api/auth/register-pkce", dto);
};

export const fetchProfile = async () => {
	return get("/api/auth/profile");
};
