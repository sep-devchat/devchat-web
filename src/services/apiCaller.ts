import axios from "axios";
import cookieUtils from "./cookieUtils.ts";
import config from "@/config/index.ts";

export interface ApiResponseDto<T = any> {
	data: T;
	message?: string;
	pagination?: any;
}

export const request = async <T = any>(
	endpoint: string,
	method: string,
	headers: object = {},
	params: object = {},
	body: object = {},
): Promise<ApiResponseDto<T>> => {
	const token = cookieUtils.getToken();

	const response = await axios<ApiResponseDto<T>>({
		url: config.publicRuntime.API_URL + endpoint,
		method: method,
		headers: Object.assign({}, headers, { Authorization: `Bearer ${token}` }),
		params: Object.assign(params),
		data: body,
	});

	return response.data;
};

export const get = <T = any>(
	endpoint: string,
	params: object = {},
	headers: object = {},
): Promise<ApiResponseDto<T>> => {
	return request<T>(endpoint, "GET", headers, params);
};

export const post = <T = any>(
	endpoint: string,
	body: object = {},
	params: object = {},
	headers: object = {},
): Promise<ApiResponseDto<T>> => {
	return request<T>(endpoint, "POST", headers, params, body);
};

export const put = <T = any>(
	endpoint: string,
	body: object = {},
	params: object = {},
	headers: object = {},
): Promise<ApiResponseDto<T>> => {
	return request<T>(endpoint, "PUT", headers, params, body);
};

export const remove = <T = any>(
	endpoint: string,
	body: object = {},
	params: object = {},
	headers: object = {},
): Promise<ApiResponseDto<T>> => {
	return request<T>(endpoint, "DELETE", headers, params, body);
};
