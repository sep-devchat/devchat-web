import { get, post, put } from "../apiCaller";
import { NotificationQuery, NotificationResponse } from "./notification.type";

export async function listNotifications(query?: NotificationQuery) {
	const url = `/api/notification`;
	return await get<NotificationResponse[]>(url, query ?? {});
}

export async function markRead(ids: string[]) {
	const url = `/api/notification/mark-read`;
	return await put<void>(url, { ids });
}

export async function bulkDeleteNotification(ids: string[]) {
	const url = `/api/notification/bulk-delete`;
	return await post<void>(url, { ids });
}
