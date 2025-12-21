/* eslint-disable @typescript-eslint/no-explicit-any */
import { get, post, put, remove, ApiResponseDto } from "./apiCaller";
import type { Subscription } from "./subscriptionAPI";

export interface GroupResponse {
	id: string;
	name: string;
	description: string | null;
	avatar: string | null;
	createdBy: string;
	createdAt: Date;
	updatedAt: Date;
	isActive: boolean;
}

export interface GroupPostRequest {
	id?: string;
	name?: string;
	description?: string | null;
	avatar?: string | null;
	isActive?: boolean;
}

export const listGroups = () => {
	return get("/api/group");
};

export const detailGroup = (id: string) => {
	return get<GroupResponse>(`/api/group/${id}`);
};

export const createGroup = (data: GroupPostRequest) => {
	return post<GroupResponse>("/api/group", data);
};

export const updateGroup = (id: string, data: GroupPostRequest) => {
	return put<GroupResponse>(`/api/group/${id}`, data);
};

export const deleteGroup = (id: string) => {
	return remove<GroupResponse>(`/api/group/${id}`);
};

export type GroupSubscriptionInGroup = {
	id: string;
	groupId: string;
	subscriptionId: string;
	groupSubscriptionStatus: string;
	monthQuantity: number;
	paymentBy: string | null;
	isPaid: boolean;
	startedAt: string | null;
	endedAt: string | null;
	// Backend returns SubscriptionResponse; allowUseAI may be missing depending on backend version.
	subscription?: Partial<Subscription> | null;
};

export type GroupSubscriptionsInGroupResponse = {
	currentSubscription: GroupSubscriptionInGroup | null;
	subscriptions: GroupSubscriptionInGroup[];
};

export const getGroupSubscriptions = async (
	groupId: string,
): Promise<ApiResponseDto<GroupSubscriptionsInGroupResponse>> => {
	return get<GroupSubscriptionsInGroupResponse>(
		`/api/group/${groupId}/subscriptions`,
	);
};
