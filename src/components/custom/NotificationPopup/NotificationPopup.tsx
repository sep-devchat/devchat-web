import { useState, useRef, useEffect } from "react";
import { Bell, X } from "lucide-react";
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
	TextContent,
	NotificationTitle,
	NotificationMessage,
	NotificationTime,
	DeleteButton,
	PopupFooter,
	FooterMessage,
} from "./NotificationPopup.styled";
import dayjs from "dayjs";
import useNotification from "@/hooks/useNotification";
import { NotificationResponse } from "@/services/notification/notification.type";
import {
	bulkDeleteNotification,
	markRead,
} from "@/services/notification/notificationAPI";
import { useNavigate } from "@tanstack/react-router";

const NotificationPopup = () => {
	const navigate = useNavigate();
	const [isOpen, setIsOpen] = useState(false);
	const popupRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const listRef = useRef<HTMLDivElement>(null);
	const sentinelRef = useRef<HTMLDivElement>(null);
	const {
		notifications,
		refetchNotifications,
		loadMoreNotifications,
		hasMoreNotifications,
		isLoadingNotifications,
		isFetchingMoreNotifications,
	} = useNotification();

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

	useEffect(() => {
		if (!isOpen || !hasMoreNotifications) return;
		const listElement = listRef.current;
		const sentinelElement = sentinelRef.current;
		if (!listElement || !sentinelElement) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				if (entry?.isIntersecting) {
					loadMoreNotifications();
				}
			},
			{
				root: listElement,
				threshold: 0.75,
			},
		);

		observer.observe(sentinelElement);
		return () => {
			observer.disconnect();
		};
	}, [
		isOpen,
		hasMoreNotifications,
		loadMoreNotifications,
		notifications.length,
	]);

	const handleClickNotification = async (
		notification: NotificationResponse,
	) => {
		await markRead([notification.id]);
		refetchNotifications();
		navigate({
			to: notification.notificationSource,
		});
	};

	const handleMarkAllAsRead = async () => {
		const ids = notifications.map((item) => item.id);
		await markRead(ids);
		refetchNotifications();
	};

	const handleDeleteNotification = async (notificationId: string) => {
		await bulkDeleteNotification([notificationId]);
		refetchNotifications();
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

					<NotificationList ref={listRef}>
						{notifications.length === 0 ? (
							<EmptyState>
								<EmptyIcon>
									<Bell className="w-12 h-12" />
								</EmptyIcon>
								<p>
									{isLoadingNotifications
										? "Loading notifications…"
										: "No notifications"}
								</p>
							</EmptyState>
						) : (
							notifications.map((notification) => (
								<NotificationItem
									key={notification.id}
									$isRead={notification.isRead}
									onClick={() => handleClickNotification(notification)}
								>
									<NotificationContent>
										{/* <IconWrapper>
											{getNotificationIcon(notification.type)}
										</IconWrapper> */}

										<TextContent>
											<NotificationTitle>
												{notification.title}
											</NotificationTitle>
											<NotificationMessage>
												{notification.content}
											</NotificationMessage>
											<NotificationTime>
												{dayjs(notification.createdAt).format(
													"DD/MM/YYYY HH:mm:ss",
												)}
											</NotificationTime>

											{/* {(notification.type === "group_invite" ||
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
											)} */}

											{/* {notification.type === "report" && (
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
											)} */}
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
						<div ref={sentinelRef} aria-hidden="true" style={{ height: 1 }} />
					</NotificationList>

					{notifications.length > 0 && (
						<PopupFooter>
							<FooterMessage>
								{isFetchingMoreNotifications
									? "Loading more…"
									: hasMoreNotifications
										? "Scroll to load older notifications"
										: "You're all caught up"}
							</FooterMessage>
						</PopupFooter>
					)}
				</PopupWrapper>
			)}
		</NotificationContainer>
	);
};

export default NotificationPopup;
