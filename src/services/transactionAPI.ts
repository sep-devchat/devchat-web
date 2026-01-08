import { get, ApiResponseDto } from "./apiCaller";
import type { GroupResponse } from "./groupAPI";
import type { Subscription } from "./subscriptionAPI";
import { UserResponse } from "./userAPI";

const apiUrl = "/api/transaction";

export type Pagination = {
	page: number;
	take: number;
	totalRecord: number;
	totalPage: number;
	nextPage?: number;
	prevPage?: number;
};

export type Transaction = {
	id: string;
	vndAmount: string;
	transactionMessage: string | null;
	paymentMethod: string;
	transactionStatus: string;
	transactionType: string;
	transactionCode: string;
	userId: string;
	groupId: string | null;
	shareFundId: string | null;
	subscriptionId?: string | null;
	// The API currently returns entity objects; relations may be present depending on backend config.
	user?: UserResponse | any;
	group?: GroupResponse | any;
	shareFund?: any;
	subscription?: Partial<Subscription> | any;
};

export const listTransactions = async (params?: {
	page?: number;
	take?: number;
	groupId?: string;
}): Promise<ApiResponseDto<Transaction[]>> => {
	return get<Transaction[]>(apiUrl, params ?? {});
};
