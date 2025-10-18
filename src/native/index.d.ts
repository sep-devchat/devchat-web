import {
	MakeHttpRequestParams,
	MakeHttpRequestResult,
	CodeExecutionResult,
} from "./types";

interface nativeAPI {
	nativeAPICallback(
		channel: string,
		cb: (event: Electron.IpcRendererEvent, ...args: any[]) => void,
	): () => void;
	makeHttpRequest<T = unknown>(
		params: MakeHttpRequestParams,
	): Promise<MakeHttpRequestResult<T>>;
	openBrowserForLogin(): Promise<string>;
	storeRefreshToken(token: string): Promise<void>;
	getRefreshToken(): Promise<string>;
	createAssetUrl(relPath: string): Promise<string>;
	// registerSocketCallback(eventName: string, cb: (...args: any[]) => void): Promise<() => void>;
	// sendSocketEvent: (eventName: string, ...args: any[]) => Promise<void>;
	selectFileOrFolder(folder?: boolean): Promise<string[]>;
	readFileContent(filePath: string): Promise<string>;
	runCodeByFilePath(filePath: string): Promise<string>;
	runCodeByContent(
		language: string,
		content: string,
	): Promise<CodeExecutionResult>;
}

declare global {
	interface Window {
		nativeAPI: nativeAPI;
	}
}
