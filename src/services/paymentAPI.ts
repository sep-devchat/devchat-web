import { post, ApiResponseDto } from "./apiCaller";

const apiUrl = "/api/payment";

export type PaymentResponse = {
	paymentUrl: string;
};

export type CreateDepositPayload = {
	amount: number;
	ipAddr?: string;
	// NOTE: backend currently uses `userId` field as VNPay order info
	userId: string;
};

export const createDepositUrl = async (
	payload: CreateDepositPayload,
): Promise<ApiResponseDto<PaymentResponse>> => {
	return post<PaymentResponse>(`${apiUrl}/deposit`, payload);
};
