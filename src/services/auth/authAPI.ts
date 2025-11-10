import { get, post } from "../apiCaller";
import {
	LoginPkceRequest,
	LoginRequest,
	PkceIssueTokenRequest,
	Profile,
	RegisterPkceRequest,
	RegisterRequest,
	TokenResponse,
	ForgotPasswordRequest,
	SendResetCodeRequest,
	ConfirmResetCodeRequest,
	ResetPasswordRequest,
} from "./auth.type";

export const login = async (dto: LoginRequest) => {
	return post<TokenResponse>("/api/auth/login", dto);
};

export const loginPkce = async (dto: LoginPkceRequest) => {
	return post("/api/auth/login-pkce", dto);
};

export const register = async (dto: RegisterRequest) => {
	return post("/api/user", dto);
};

export const registerPkce = async (dto: RegisterPkceRequest) => {
	return post("/api/auth/register-pkce", dto);
};

export const fetchProfile = async () => {
	return get<Profile>("/api/auth/profile");
};

export async function pkceIssueToken(dto: PkceIssueTokenRequest) {
	return await post<TokenResponse>("/api/auth/pkce-issue-token", dto);
}

export const verifyEmail = async (code: string) => {
	return get<{ message?: string }>(`/api/auth/verify-email`, { token: code });
};

export const logout = async () => {
	return get("/api/auth/logout");
};

// Forgot / reset password flow
export const forgotPassword = async (dto: ForgotPasswordRequest) => {
	return post<{ message?: string }>("/api/auth/forgot-password", dto);
};

export const sendResetCode = async (dto: SendResetCodeRequest) => {
	return post<{ message?: string }>("/api/auth/send-reset-code", dto);
};

export const confirmResetCode = async (dto: ConfirmResetCodeRequest) => {
	return post<{ message?: string }>("/api/auth/confirm-reset-code", dto);
};

export const resetPassword = async (dto: ResetPasswordRequest) => {
	return post<{ message?: string }>("/api/auth/reset-password", dto);
};
