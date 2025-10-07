import { ProgrammingLanguageEnum } from "@/utils/enum";

export interface RunCodeRequest {
	language: ProgrammingLanguageEnum;
	code: string;
}

export interface CodeExecutionResponse {
	output: string;
}
