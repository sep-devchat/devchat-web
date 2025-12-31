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
