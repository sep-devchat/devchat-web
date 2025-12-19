import { get, post, ApiResponseDto } from "./apiCaller";

const apiUrl = "/api/payment";

export type PaymentResponse = {
	paymentUrl: string;
};

export type CreateDepositPayload = {
	amount: number;
	monthQuantity: number;
	ipAddr?: string;
	groupId: string;
	subscriptionId: string;
	shareFundId?: string;
	transactionType?: string;
};

export type PaymentCallbackResult = {
	isSuccess: boolean;
	isVerified: boolean;
	message?: string | null;
	amount?: string | number | null;
	orderInfo?: string | null;
	txnRef?: string | null;
	bankCode?: string | null;
	payDate?: string | null;
	transactionNo?: string | null;
	responseCode?: string | null;
	groupId?: string | null;
	subscriptionId?: string | null;
	groupSubscriptionId?: string | null;
	shareFundId?: string | null;
	transactionType?: string | null;
};

export const createDepositUrl = async (
	payload: CreateDepositPayload,
): Promise<ApiResponseDto<PaymentResponse>> => {
	return post<PaymentResponse>(`${apiUrl}/deposit/vnpay`, payload);
};

export const verifyPaymentCallback = async (
	params: Record<string, string>,
): Promise<ApiResponseDto<PaymentCallbackResult>> => {
	return get<PaymentCallbackResult>(`${apiUrl}/callback`, params);
};
