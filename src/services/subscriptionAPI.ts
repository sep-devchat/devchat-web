import { get, post, put, remove, ApiResponseDto } from "./apiCaller";

const apiUrl = "/api/subscription";

export type Subscription = {
	id: string;
	subscriptionCode: string;
	subscriptionName: string;
	price: number;
	limitMembers: number;
	isAIActive: boolean;
	allowUseAI: boolean;
	runCodePerDay: number;
	programmingLanguageInGroups: number;
	levelSubscription: number;
};

export type SubscriptionPayload = Omit<Subscription, "id">;

export const listSubscriptions = async (): Promise<
	ApiResponseDto<Subscription[]>
> => {
	return get<Subscription[]>(`${apiUrl}`);
};

export const createSubscription = async (payload: SubscriptionPayload) => {
	return post<Subscription>(`${apiUrl}`, payload);
};

export const updateSubscription = async (
	id: string,
	payload: Partial<SubscriptionPayload>,
) => {
	return put<Subscription>(`${apiUrl}/${id}`, payload);
};

export const deleteSubscription = async (id: string) => {
	return remove(`${apiUrl}/${id}`);
};
