import { get, post, remove, put } from "./apiCaller";

export interface CodeBlock {
	id: string;
	userId: string;
	language: string;
	content: string;
	createdAt: string;
	updatedAt: string;
	user?: {
		id: string;
		username: string;
		email: string;
		firstName: string;
		lastName: string;
		avatarUrl: string;
		isActive: boolean;
		emailVerified: boolean;
		createdAt: string;
		updatedAt: string;
		lastLogin: string | null;
		timezone: string | null;
	};
}

export interface GetCodeBlocksParams {
	page?: number;
	limit?: number;
	channelId: string;
	groupId: string;
}

export interface CodeBlocksResponse {
	data: CodeBlock[];
	pagination: {
		page: number;
		take: number;
		totalRecord: number;
		totalPage: number;
	};
	message: string;
}

export interface CodeBlockResponse {
	data: CodeBlock;
	message: string;
}

export interface CodeCollaborationItem {
	id: string;
	content: string;
	createdBy: {
		id: string;
		username: string;
		email: string;
		firstName: string;
		lastName: string;
		avatarUrl: string;
		isActive: boolean;
		emailVerified: boolean;
		createdAt: string;
		updatedAt: string;
		isAdmin: boolean;
	};
	createdAt: string;
	updatedAt: string;
}

export interface CodeCollaborationHistoryResponse {
	data: CodeCollaborationItem[];
	pagination: null;
	message: string;
}

export interface SaveCollaborationRequest {
	codeBlockId: string;
	content: string;
}

export interface SaveCollaborationResponse {
	data: CodeCollaborationItem | null;
	pagination: null;
	message: string;
}

export interface DeleteCollaborationResponse {
	data: null;
	pagination: null;
	message: string;
}

export interface UpdateCollaborationRequest {
	content: string;
}

export interface UpdateCollaborationResponse {
	data: CodeCollaborationItem | null;
	pagination: null;
	message: string;
}

export const getCodeBlocks = async (
	params: GetCodeBlocksParams,
): Promise<CodeBlocksResponse> => {
	const { page = 1, limit = 100, channelId, groupId } = params;

	const response = await get<{
		data: CodeBlock[];
		pagination: {
			page: number;
			take: number;
			totalRecord: number;
			totalPage: number;
		};
	}>(`/api/group/${groupId}/channel/${channelId}/code-block`, { page, limit });

	return response as unknown as CodeBlocksResponse;
};

export const getCodeBlockById = async (
	id: string,
	channelId: string,
	groupId: string,
): Promise<CodeBlockResponse> => {
	const response = await get<CodeBlock>(
		`/api/group/${groupId}/channel/${channelId}/code-block/${id}`,
	);

	return response as unknown as CodeBlockResponse;
};

export const getCodeCollaborationHistory = async (
	codeBlockId: string,
): Promise<CodeCollaborationHistoryResponse> => {
	const response = await get<{
		data: CodeCollaborationItem[];
		pagination: null;
	}>("/api/code-collaboration", { codeBlockId });

	return response as unknown as CodeCollaborationHistoryResponse;
};

export const saveCodeCollaboration = async (
	codeBlockId: string,
	content: string,
): Promise<SaveCollaborationResponse> => {
	const body: SaveCollaborationRequest = {
		codeBlockId,
		content,
	};

	const response = await post<{
		data: CodeCollaborationItem | null;
		pagination: null;
	}>("/api/code-collaboration", body);

	return response as unknown as SaveCollaborationResponse;
};

export const deleteCodeCollaboration = async (
	collaborationId: string,
): Promise<DeleteCollaborationResponse> => {
	const response = await remove<{
		data: null;
		pagination: null;
	}>(`/api/code-collaboration/${collaborationId}`);

	return response as unknown as DeleteCollaborationResponse;
};

export const updateCodeCollaboration = async (
	collaborationId: string,
	content: string,
): Promise<UpdateCollaborationResponse> => {
	const body: UpdateCollaborationRequest = {
		content,
	};

	const response = await put<{
		data: CodeCollaborationItem | null;
		pagination: null;
	}>(`/api/code-collaboration/${collaborationId}`, body);

	return response as unknown as UpdateCollaborationResponse;
};
