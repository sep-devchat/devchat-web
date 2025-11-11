import { get, post, put } from "../apiCaller";
import { NotificationResponse } from "./notification.type";

export async function listNotifications() {
	const url = `/api/notification`;
	return await get<NotificationResponse[]>(url);
}

export async function markRead(ids: string[]) {
	const url = `/api/notification/mark-read`;
	return await put<void>(url, { ids });
}

export async function bulkDeleteNotification(ids: string[]) {
	const url = `/api/notification/bulk-delete`;
	return await post<void>(url, { ids });
}
