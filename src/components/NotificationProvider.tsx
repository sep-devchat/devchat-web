import publicRuntimeConfig from "@/config/publicRuntime";
import useSocketEvent from "@/hooks/useSocketEvent";
import { MessageResponse } from "@/services/messageAPI";
import { SocketEvents } from "@/utils/constants";

async function handleElectronNotification(data: MessageResponse) {
	await window.nativeAPI.showMessageNotification(
		"New Message",
		data.content || "You have a new message.",
	);
}

async function handleBrowserNotification(data: MessageResponse) {
	let perm = Notification.permission;
	if (perm != "granted") {
		perm = await new Promise((resolve) => {
			Notification.requestPermission().then(resolve);
		});
	}

	if (perm != "granted") return;

	new Notification("New Message", {
		body: data.content || "You have a new message.",
	});
}

export default function NotificationProvider() {
	useSocketEvent(SocketEvents.MESSAGE_NOTIFICATION, (data: MessageResponse) => {
		if (publicRuntimeConfig.ELECTRON) {
			handleElectronNotification(data);
		} else {
			handleBrowserNotification(data);
		}
	});

	return <></>;
}
