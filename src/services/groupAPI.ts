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
	// Backend returns SubscriptionResponse.
	subscription?: Partial<Subscription> | null;
};

export type GroupEntitlement = {
	id: string;
	groupId: string;
	source: string;
	subscriptionId: string | null;
	effectiveFrom: string;
	effectiveTo: string | null;
	entitlements: Record<string, any>;
	createdAt: string;
	createdBy: string;
};

export type GroupUsage = {
	id: string;
	groupId: string;
	billingCycleKey: string;
	periodStart: string;
	periodEnd: string;
	messagesSent: number;
	fileBytesUploaded: string;
	runCodeExecutions: number;
	aiTokensConsumed: string;
	createdAt: string;
	updatedAt: string;
	currentMembers?: number;
	currentProgrammingLanguagesInGroups?: number;
};

export type GroupSubscriptionsInGroupResponse = {
	currentSubscription: GroupSubscriptionInGroup | null;
	subscriptions: GroupSubscriptionInGroup[];
	currentEntitlement: GroupEntitlement | null;
	usage: GroupUsage | null;
};

export const getGroupSubscriptions = async (
	groupId: string,
): Promise<ApiResponseDto<GroupSubscriptionsInGroupResponse>> => {
	return get<GroupSubscriptionsInGroupResponse>(
		`/api/group/${groupId}/subscriptions`,
	);
};
