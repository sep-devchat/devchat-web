/* API client for AI endpoints */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { post, get } from "../apiCaller";
import {
	StartAiSessionRequest,
	AiSessionEntity,
	AskRequest,
	AskResponse,
	AiProviderInfo,
} from "./ai.type";

export const startAiSession = (body: StartAiSessionRequest) => {
	return post<AiSessionEntity>("/api/ai/session", body);
};

export const askAi = (body: AskRequest) => {
	return post<AskResponse>("/api/ai/ask", body);
};

export const aiAPI = {
	startAiSession,
	askAi,
	listProviders: () => get<AiProviderInfo[]>("/api/ai/providers"),
};

export default aiAPI;
