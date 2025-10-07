import { post } from "../apiCaller";
import { CodeExecutionResponse, RunCodeRequest } from "./code.type";

export function runCode(dto: RunCodeRequest) {
	return post<CodeExecutionResponse>("/api/code/run", dto);
}
