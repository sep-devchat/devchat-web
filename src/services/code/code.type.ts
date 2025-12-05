import { ProgrammingLanguageEnum } from "@/utils/enum";

export interface RunCodeRequest {
	language: ProgrammingLanguageEnum;
	code: string;
}

export interface RunCodeBlockRequest {
	codeBlockId: string;
}

export interface RunCodeCollabRequest {
	codeCollabId: string;
}

export interface CodeExecutionResponse {
	output: string;
}
