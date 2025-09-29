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
	method: string;
	data?: {
		username: string;
		email: string;
		password: string;
		displayName?: string;
	};
	code?: string; // For Google/GitHub registration
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
