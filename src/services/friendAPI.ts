/* eslint-disable @typescript-eslint/no-explicit-any */
import { get } from "./apiCaller";

export const listFriends = (page: number, limit: number) => {
	return get(`/api/user-friend?page=${page}&limit=${limit}`);
};
