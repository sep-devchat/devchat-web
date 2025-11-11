import { NotificationContext } from "@/contexts/notification.context";
import { useContext } from "react";

const useNotification = () => {
	const ctx = useContext(NotificationContext);
	if (!ctx)
		throw new Error(
			"useNotification must be used within a NotificationProvider",
		);
	return ctx;
};

export default useNotification;
