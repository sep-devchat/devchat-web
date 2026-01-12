import { get, post, put, remove, ApiResponseDto } from "./apiCaller";

const apiUrl = "/api/subscription";

export type Subscription = {
	id: string;
	subscriptionCode: string;
	subscriptionName: string;
	price: number;
	limitMembers: number;
	isAIActive: boolean;
	runCodePerDay: number;
	programmingLanguageInGroups: number;
	levelSubscription: number;
	version: number;
	isActive: boolean;
	isAllowDelete: boolean;
};

export type CreateSubscriptionPayload = Omit<
	Subscription,
	"id" | "version" | "isAllowDelete"
>;
export type UpdateSubscriptionPayload = Partial<CreateSubscriptionPayload>;

export type ListSubscriptionsParams = {
	isActive?: boolean;
	isAIActive?: boolean;
	sortBy?: "limitMembers" | "runCodePerDay" | "programmingLanguageInGroups";
	sortOrder?: "ASC" | "DESC";
};

export const listSubscriptions = async (
	params: ListSubscriptionsParams = {},
): Promise<ApiResponseDto<Subscription[]>> => {
	return get<Subscription[]>(`${apiUrl}`, params);
};

export const createSubscription = async (
	payload: CreateSubscriptionPayload,
) => {
	return post<Subscription>(`${apiUrl}`, payload);
};

export const updateSubscription = async (
	id: string,
	payload: UpdateSubscriptionPayload,
) => {
	return put<Subscription>(`${apiUrl}/${id}`, payload);
};

export const deleteSubscription = async (id: string) => {
	return remove(`${apiUrl}/${id}`);
};

export const duplicateSubscription = async (id: string) => {
	return post<Subscription>(`${apiUrl}/${id}/duplicate`);
};
