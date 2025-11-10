export interface LoginRequest {
	method: string;
	code: string;
}

export interface TokenResponse {
	accessToken: string;
	refreshToken: string;
}

export interface LoginPkceRequest {
	method: string;
	code: string;
	codeChallenge: string;
	codeChallengeMethod: string;
}

export interface RegisterRequest {
	username: string;
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	avatarUrl?: string;
	timezone?: string;
}

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

export interface Profile {
	id: string;
	username: string;
	email: string;
	firstName: string;
	lastName: string;
	avatarUrl?: string;
	isActive: boolean;
	emailVerified: boolean;
	createdAt: Date;
	updatedAt: Date;
	lastLogin?: Date;
	timezone?: string;
}

export interface PkceIssueTokenRequest {
	codeVerifier: string;
	codeChallengeMethod: string;
	authCode: string;
}

// Forgot / Reset password flow types
export interface ForgotPasswordRequest {
	email: string;
}

export interface SendResetCodeRequest {
	email: string;
}

export interface ConfirmResetCodeRequest {
	email: string;
	code: string; // 6-digit verification code
}

export interface ResetPasswordRequest {
	email: string;
	code: string; // 6-digit verification code
	newPassword: string; // >=8 chars (backend enforces 8 min)
}
