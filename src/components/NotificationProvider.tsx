import publicRuntimeConfig from "@/config/publicRuntime";
import { NotificationContext } from "@/contexts/notification.context";
import useSocketEvent from "@/hooks/useSocketEvent";
import { MessageResponse } from "@/services/messageAPI";
import { NotificationResponse } from "@/services/notification/notification.type";
import {
	listNotifications,
	markRead,
} from "@/services/notification/notificationAPI";
import { SocketEvents } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { PropsWithChildren, useEffect } from "react";

async function handleElectronMessageNotification(data: MessageResponse) {
	await window.nativeAPI.showMessageNotification(data);
}

async function handleBrowserMessageNotification(
	data: MessageResponse,
	navigate: ReturnType<typeof useNavigate>,
) {
	let perm = Notification.permission;
	if (perm != "granted") {
		perm = await new Promise((resolve) => {
			Notification.requestPermission().then(resolve);
		});
	}

	if (perm != "granted") return;

	const notification = new Notification(
		data.sender.firstName + " " + data.sender.lastName,
		{
			body: data.content || "You have a new message.",
			icon: data.sender.avatarUrl,
		},
	);

	notification.onclick = () => {
		window.focus();
		navigate({
			to: "/chat/group/$groupId",
			params: { groupId: data.channel?.groupId },
			replace: true,
			search: {
				channel: data.channel?.id,
			},
		});
	};
}

async function handleNotification(
	data: NotificationResponse,
	navigate: ReturnType<typeof useNavigate>,
	refetchNotifications: () => void,
) {
	let perm = Notification.permission;
	if (perm != "granted") {
		perm = await new Promise((resolve) => {
			Notification.requestPermission().then(resolve);
		});
	}

	if (perm != "granted") return;

	const notification = new Notification(data.title, {
		body: data.content,
	});

	notification.onclick = async () => {
		if (publicRuntimeConfig.ELECTRON) {
			window.nativeAPI.showElectronApp();
		}
		window.focus();
		await markRead([data.id]);
		refetchNotifications();
		navigate({
			to: data.notificationSource,
			replace: true,
		});
	};
}

export interface NotificationProviderProps {}

export default function NotificationProvider({
	children,
}: PropsWithChildren<NotificationProviderProps>) {
	const navigate = useNavigate();
	const listNotificationsQuery = useQuery({
		queryKey: ["listNotifications"],
		queryFn: async () => {
			const response = await listNotifications();
			return response.data;
		},
		initialData: [],
	});

	if (publicRuntimeConfig.ELECTRON) {
		useEffect(() => {
			const dispose = window.nativeAPI.nativeAPICallback(
				"notification-clicked",
				(_, message: MessageResponse) => {
					navigate({
						to: "/chat/group/$groupId",
						params: { groupId: message.channel?.groupId },
						replace: true,
						search: {
							channel: message.channel?.id,
						},
					});
				},
			);

			return () => {
				dispose();
			};
		}, []);
	}

	useSocketEvent(SocketEvents.MESSAGE_NOTIFICATION, (data: MessageResponse) => {
		if (publicRuntimeConfig.ELECTRON) {
			handleElectronMessageNotification(data);
		} else {
			handleBrowserMessageNotification(data, navigate);
		}
	});

	useSocketEvent(SocketEvents.NOTIFICATION, (data: NotificationResponse) => {
		handleNotification(data, navigate, listNotificationsQuery.refetch);
		listNotificationsQuery.refetch();
	});

	useEffect(() => {
		listNotificationsQuery.refetch();
	}, []);

	return (
		<NotificationContext.Provider
			value={{
				notifications: listNotificationsQuery.data,
				refetchNotifications: listNotificationsQuery.refetch,
			}}
		>
			{children}
		</NotificationContext.Provider>
	);
}
