import { get, type ApiResponseDto } from "./apiCaller";
import type { GroupResponse } from "./groupAPI";
import type { Subscription } from "./subscriptionAPI";
import type { Transaction } from "./transactionAPI";

const apiUrl = "/api/order";

export type Order = {
	id: string;
	orderStatus: string;
	orderCode: string;
	groupId: string;
	subscriptionId: string;
	monthQuantity: number;
	paymentBy: string | null;
	createdAt: string;
	createdBy: string;
	group?: GroupResponse | any;
	subscription?: Partial<Subscription> | any;
	orderTransactions?: Transaction[];
};

export type OrderOverviewReport = {
	totalOrdersSold: number;
	totalSubscriptionsSold: number;
	totalRevenueVnd: string;
	bySubscription: Array<{
		subscriptionId: string;
		subscriptionCode: string;
		subscriptionName: string;
		subscriptionVersion: number;
		ordersSold: number;
		subscriptionsSold: number;
		revenueVnd: string;
	}>;
	byDay: Array<{
		date: string;
		ordersSold: number;
		subscriptionsSold: number;
		revenueVnd: string;
	}>;
};

export const listOrders = async (params?: {
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: "ASC" | "DESC";
	groupId?: string;
}): Promise<ApiResponseDto<Order[]>> => {
	return get<Order[]>(apiUrl, params ?? {});
};

export const getOrderDetail = async (
	orderId: string,
): Promise<ApiResponseDto<Order>> => {
	return get<Order>(`${apiUrl}/${orderId}`);
};

export const getOrderOverviewReport = async (params?: {
	from?: string;
	to?: string;
}): Promise<ApiResponseDto<OrderOverviewReport>> => {
	return get<OrderOverviewReport>(`${apiUrl}/report/overview`, params ?? {});
};
