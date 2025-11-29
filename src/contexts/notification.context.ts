import { NotificationResponse } from "@/services/notification/notification.type";
import { createContext } from "react";

export interface NotificationContextProps {
	notifications: NotificationResponse[];
	refetchNotifications: () => void;
	loadMoreNotifications: () => void;
	hasMoreNotifications: boolean;
	isLoadingNotifications: boolean;
	isFetchingMoreNotifications: boolean;
}

export const NotificationContext =
	createContext<NotificationContextProps | null>(null);
