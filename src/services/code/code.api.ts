import { post } from "../apiCaller";
import {
	CodeExecutionResponse,
	RunCodeBlockRequest,
	RunCodeCollabRequest,
	RunCodeRequest,
} from "./code.type";

export function runCode(dto: RunCodeRequest) {
	return post<CodeExecutionResponse>("/api/code/run", dto);
}

export function runCodeBlock(dto: RunCodeBlockRequest) {
	return post<CodeExecutionResponse>("/api/code/code-block", dto);
}

export function runCodeCollab(dto: RunCodeCollabRequest) {
	return post<CodeExecutionResponse>("/api/code/code-collab", dto);
}
