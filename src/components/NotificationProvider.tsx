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
import { useInfiniteQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { PropsWithChildren, useCallback, useEffect, useMemo } from "react";

function navigateToGroupChannel(
	navigate: ReturnType<typeof useNavigate>,
	groupId?: string,
	channelId?: string,
) {
	if (!groupId) return;
	navigate({
		to: "/chat/group/$groupId",
		params: { groupId },
		replace: true,
		search: channelId ? { channel: channelId } : {},
	});
}

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
		navigateToGroupChannel(navigate, data.channel?.groupId, data.channel?.id);
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
	const pageSize = 20;
	const listNotificationsQuery = useInfiniteQuery({
		queryKey: ["listNotifications"],
		initialPageParam: undefined as string | undefined,
		queryFn: async ({
			pageParam,
		}): Promise<{
			items: NotificationResponse[];
			nextCursor?: string;
		}> => {
			const response = await listNotifications({
				cursorCreatedAt: pageParam,
				limit: pageSize,
			});
			const items = response.data ?? [];
			const nextCursor =
				items.length === pageSize
					? items[items.length - 1]?.createdAt
					: undefined;
			return { items, nextCursor };
		},
		getNextPageParam: (lastPage) => lastPage.nextCursor,
	});

	const {
		data,
		refetch,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		status,
	} = listNotificationsQuery;

	const notifications = useMemo(
		() => data?.pages.flatMap((page) => page.items) ?? [],
		[data],
	);

	const loadMoreNotifications = useCallback(() => {
		if (!hasNextPage || isFetchingNextPage) {
			return;
		}
		fetchNextPage();
	}, [fetchNextPage, hasNextPage, isFetchingNextPage]);

	const hasMoreNotifications = Boolean(hasNextPage);
	const isLoadingNotifications =
		status === "pending" && notifications.length === 0;
	const isFetchingMoreNotifications = isFetchingNextPage;

	if (publicRuntimeConfig.ELECTRON) {
		useEffect(() => {
			const dispose = window.nativeAPI.nativeAPICallback(
				"notification-clicked",
				(_, message: MessageResponse) => {
					navigateToGroupChannel(
						navigate,
						message.channel?.groupId,
						message.channel?.id,
					);
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
		handleNotification(data, navigate, refetch);
		refetch();
	});

	useEffect(() => {
		refetch();
	}, []);

	return (
		<NotificationContext.Provider
			value={{
				notifications,
				refetchNotifications: refetch,
				loadMoreNotifications,
				hasMoreNotifications,
				isLoadingNotifications,
				isFetchingMoreNotifications,
			}}
		>
			{children}
		</NotificationContext.Provider>
	);
}
