/* Types for AI session and ask endpoints (mirrors backend DTOs) */

// Mirrors StartSessionDto from backend
export interface StartAiSessionRequest {
	sessionType: string; // e.g. 'chat', 'code'
	channelId?: string;
	threadId?: string;
	provider?: "OPENAI" | "GEMINI"; // AIProviderEnum values
	model?: string; // model name override
}

export interface AiSessionEntity {
	id: string;
	userId?: string | null;
	channelId?: string | null;
	threadId?: string | null;
	sessionType: string;
	startedAt: string | Date; // ISO from API
	endedAt: string | Date | null;
	status: string; // 'active' | other lifecycle states
}

// Mirrors AskDto from backend
export interface AskRequest {
	messageId: string; // required: server will read content from message
	model?: string;
	sessionId?: string; // continue existing session
	context?: Record<string, any>[]; // optional context objects
}

// Mirrors AskResponseDto
export interface AskResponse {
	sessionId: string;
	interactionId: string;
	answer: string;
}

// Provider list info from backend
export interface AiProviderInfo {
	provider: "OPENAI" | "GEMINI";
	label: string;
	available: boolean;
	configuredModel?: string | null;
	fallbackModel?: string | null;
}
