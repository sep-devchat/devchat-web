import { IpcMainInvokeEvent } from "electron";

export interface AppSettings {
	appBaseUrl: string;
	apiBaseUrl: string;
}

export interface PaginationDto {
	page: number;
	take: number;
	totalRecord: number;
	totalPage: number;
	nextPage?: number;
	prevPage?: number;
}

export interface ApiResponseDto<T = unknown> {
	message: string;
	data: T;
	pagination?: PaginationDto;
}

export interface ApiError<T = unknown> {
	code: string;
	message: string;
	detail: T;
	status?: number;
}

export interface MakeHttpRequestParams {
	url: string;
	method: string;
	body?: unknown;
	headers?: Record<string, string | number | boolean>;
}

export interface MakeHttpRequestResult<T = unknown, E = unknown> {
	ok: boolean;
	status?: number;
	headers?: Record<string, string>;
	response?: ApiResponseDto<T>;
	error?: ApiError<E> | E;
}

export type NativeAPIHandler = (
	e: IpcMainInvokeEvent,
	...args: unknown[]
) => Promise<unknown>;

export type CodeExecutionResult = {
	output: string;
};

export interface DeepLinkPayload {
	url: string;
	code: string;
}
