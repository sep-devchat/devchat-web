import { useState, useRef, useEffect } from "react";
import {
	Bell,
	UserPlus,
	Users,
	CheckCircle,
	AlertCircle,
	X,
} from "lucide-react";
import {
	NotificationContainer,
	BellButton,
	BellIcon,
	UnreadBadge,
	PopupWrapper,
	PopupHeader,
	PopupTitle,
	MarkAllButton,
	NotificationList,
	EmptyState,
	EmptyIcon,
	NotificationItem,
	NotificationContent,
	IconWrapper,
	TextContent,
	NotificationTitle,
	NotificationMessage,
	NotificationTime,
	ActionButtons,
	AcceptButton,
	DeclineButton,
	ViewDetailsButton,
	DeleteButton,
	PopupFooter,
	ViewAllButton,
} from "./NotificationPopup.styled";

interface Notification {
	id: string;
	type: "group_invite" | "friend_request" | "friend_accepted" | "report";
	title: string;
	message: string;
	timestamp: string;
	isRead: boolean;
	avatar?: string | null;
	groupName?: string;
	userName?: string;
}

const mockNotifications: Notification[] = [
	{
		id: "1",
		type: "group_invite",
		title: "Group Invitation",
		message: 'Nguyen Van A invited you to join "React Developers" group',
		timestamp: "5 minutes ago",
		isRead: false,
		avatar: null,
		groupName: "React Developers",
	},
	{
		id: "2",
		type: "friend_request",
		title: "Friend Request",
		message: "Tran Thi B wants to be your friend",
		timestamp: "10 minutes ago",
		isRead: false,
		avatar: null,
		userName: "Tran Thi B",
	},
	{
		id: "3",
		type: "friend_accepted",
		title: "Friend Request Accepted",
		message: "Le Van C accepted your friend request",
		timestamp: "1 hour ago",
		isRead: true,
		avatar: null,
		userName: "Le Van C",
	},
	{
		id: "4",
		type: "report",
		title: "Violation Warning",
		message:
			"You have been reported for violating group rules. Please see details.",
		timestamp: "2 hours ago",
		isRead: false,
		avatar: null,
	},
	{
		id: "5",
		type: "friend_request",
		title: "Friend Request",
		message: "Pham Minh D wants to be your friend",
		timestamp: "3 hours ago",
		isRead: true,
		avatar: null,
		userName: "Pham Minh D",
	},
];

const NotificationPopup = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [notifications, setNotifications] =
		useState<Notification[]>(mockNotifications);
	const popupRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);

	const unreadCount = notifications.filter((n) => !n.isRead).length;

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				popupRef.current &&
				!popupRef.current.contains(event.target as Node) &&
				buttonRef.current &&
				!buttonRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	const getNotificationIcon = (type: Notification["type"]) => {
		switch (type) {
			case "group_invite":
				return <Users size={20} color="#608BC1" />;
			case "friend_request":
				return <UserPlus size={20} color="#EFB008" />;
			case "friend_accepted":
				return <CheckCircle size={20} color="#1CCA93" />;
			case "report":
				return <AlertCircle size={20} color="#D83232" />;
			default:
				return <Bell size={20} color="#374151" />;
		}
	};

	const handleAccept = (id: string, type: Notification["type"]) => {
		console.log("Accept notification:", id, type);
		setNotifications(notifications.filter((n) => n.id !== id));
	};

	const handleReject = (id: string, type: Notification["type"]) => {
		console.log("Reject notification:", id, type);
		setNotifications(notifications.filter((n) => n.id !== id));
	};

	const handleMarkAsRead = (id: string) => {
		setNotifications(
			notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
		);
	};

	const handleMarkAllAsRead = () => {
		setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
	};

	const handleDeleteNotification = (id: string) => {
		setNotifications(notifications.filter((n) => n.id !== id));
	};

	return (
		<NotificationContainer>
			<BellButton
				ref={buttonRef}
				onClick={() => setIsOpen(!isOpen)}
				aria-label="Notifications"
			>
				<BellIcon>
					<Bell className="w-6 h-6" />
				</BellIcon>
				{unreadCount > 0 && (
					<UnreadBadge>{unreadCount > 9 ? "9+" : unreadCount}</UnreadBadge>
				)}
			</BellButton>

			{isOpen && (
				<PopupWrapper ref={popupRef}>
					<PopupHeader>
						<PopupTitle>Notifications</PopupTitle>
						{unreadCount > 0 && (
							<MarkAllButton onClick={handleMarkAllAsRead}>
								Mark all as read
							</MarkAllButton>
						)}
					</PopupHeader>

					<NotificationList>
						{notifications.length === 0 ? (
							<EmptyState>
								<EmptyIcon>
									<Bell className="w-12 h-12" />
								</EmptyIcon>
								<p>No notifications</p>
							</EmptyState>
						) : (
							notifications.map((notification) => (
								<NotificationItem
									key={notification.id}
									$isRead={notification.isRead}
									onClick={() => handleMarkAsRead(notification.id)}
								>
									<NotificationContent>
										<IconWrapper>
											{getNotificationIcon(notification.type)}
										</IconWrapper>

										<TextContent>
											<NotificationTitle>
												{notification.title}
											</NotificationTitle>
											<NotificationMessage>
												{notification.message}
											</NotificationMessage>
											<NotificationTime>
												{notification.timestamp}
											</NotificationTime>

											{(notification.type === "group_invite" ||
												notification.type === "friend_request") && (
												<ActionButtons>
													<AcceptButton
														onClick={(e) => {
															e.stopPropagation();
															handleAccept(notification.id, notification.type);
														}}
													>
														Accept
													</AcceptButton>
													<DeclineButton
														onClick={(e) => {
															e.stopPropagation();
															handleReject(notification.id, notification.type);
														}}
													>
														Decline
													</DeclineButton>
												</ActionButtons>
											)}

											{notification.type === "report" && (
												<ViewDetailsButton
													onClick={(e) => {
														e.stopPropagation();
														console.log(
															"View report details:",
															notification.id,
														);
													}}
												>
													View Details
												</ViewDetailsButton>
											)}
										</TextContent>

										<DeleteButton
											onClick={(e) => {
												e.stopPropagation();
												handleDeleteNotification(notification.id);
											}}
										>
											<X className="w-4 h-4 text-gray-500" />
										</DeleteButton>
									</NotificationContent>
								</NotificationItem>
							))
						)}
					</NotificationList>

					{notifications.length > 0 && (
						<PopupFooter>
							<ViewAllButton>View all notifications</ViewAllButton>
						</PopupFooter>
					)}
				</PopupWrapper>
			)}
		</NotificationContainer>
	);
};

export default NotificationPopup;
