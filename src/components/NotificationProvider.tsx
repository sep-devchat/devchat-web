import publicRuntimeConfig from "@/config/publicRuntime";
import useSocketEvent from "@/hooks/useSocketEvent";
import { MessageResponse } from "@/services/messageAPI";
import { SocketEvents } from "@/utils/constants";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

async function handleElectronNotification(data: MessageResponse) {
	await window.nativeAPI.showMessageNotification(data);
}

async function handleBrowserNotification(
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

export default function NotificationProvider() {
	const navigate = useNavigate();

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
			handleElectronNotification(data);
		} else {
			handleBrowserNotification(data, navigate);
		}
	});

	return <></>;
}
