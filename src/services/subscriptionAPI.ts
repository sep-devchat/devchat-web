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
};

export type CreateSubscriptionPayload = Omit<Subscription, "id" | "version">;
export type UpdateSubscriptionPayload = Partial<CreateSubscriptionPayload>;

export const listSubscriptions = async (): Promise<
	ApiResponseDto<Subscription[]>
> => {
	return get<Subscription[]>(`${apiUrl}`);
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
