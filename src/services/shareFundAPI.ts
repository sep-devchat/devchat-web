import { get, post, remove, ApiResponseDto } from "./apiCaller";

const apiUrl = "/api/group";

export type ShareFundGroup = {
	id: string;
	name: string;
	description: string | null;
	avatar: string;
	createdBy: string;
	createdAt: string;
	updatedAt: string;
	isActive: boolean;
};

export type ShareFundSubscription = {
	id: string;
	subscriptionCode: string;
	subscriptionName: string;
	price: number;
	limitMembers: number;
	isAIActive: boolean;
	runCodePerDay: number;
	programmingLanguageInGroups: number;
	levelSubscription: number;
	isActive: boolean;
};

export type ShareFund = {
	id: string;
	groupId: string;
	subscriptionId: string;
	monthQuantity?: number;
	fundName: string | null;
	contributeTime?: number | null;
	currentVndAmount: string;
	createdAt: string;
	updatedAt: string;
	group?: ShareFundGroup | null;
	subscription?: ShareFundSubscription | null;
};

export type CreateShareFundPayload = {
	subscriptionId: string;
	monthQuantity?: number;
	fundName?: string | null;
	contributeTime?: number | null;
};

export const createShareFund = async (
	groupId: string,
	payload: CreateShareFundPayload,
): Promise<ApiResponseDto<ShareFund>> => {
	return post<ShareFund>(`${apiUrl}/${groupId}/share-fund`, payload);
};

export const listShareFundsInGroup = async (
	groupId: string,
): Promise<ApiResponseDto<ShareFund[]>> => {
	return get<ShareFund[]>(`${apiUrl}/${groupId}/share-fund`);
};

export type DonateShareFundPayload = {
	amount: number;
	message?: string | null;
};

export const donateShareFund = async (
	groupId: string,
	shareFundId: string,
	payload: DonateShareFundPayload,
): Promise<ApiResponseDto<ShareFund>> => {
	return post<ShareFund>(
		`${apiUrl}/${groupId}/share-fund/${shareFundId}/donate`,
		payload,
	);
};

export const deleteShareFund = async (
	groupId: string,
	shareFundId: string,
): Promise<ApiResponseDto<ShareFund>> => {
	return remove<ShareFund>(`${apiUrl}/${groupId}/share-fund/${shareFundId}`);
};
