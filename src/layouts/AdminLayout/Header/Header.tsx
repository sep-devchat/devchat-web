import React from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import * as S from "./Header.styled";

interface Tab {
	id: string;
	label: string;
	path: string;
}

interface RouteInfo {
	title: string;
	path: string;
	tabs?: Tab[];
}

const Header: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const getRouteInfo = (): RouteInfo | null => {
		const pathname = location.pathname;

		if (pathname.startsWith("/admin/dashboard")) {
			return {
				title: "Dashboard",
				path: "/admin/dashboard",
			};
		}

		if (pathname.startsWith("/admin/analytics")) {
			return {
				title: "Analytics Dashboard",
				path: "/admin/analytics",
				tabs: [
					{ id: "user", label: "User", path: "/admin/analytics" },
					{ id: "language", label: "Language", path: "/admin/analytics" },
					{ id: "group", label: "Group", path: "/admin/analytics" },
					{ id: "system", label: "System", path: "/admin/analytics" },
				],
			};
		}

		if (pathname.startsWith("/admin/moderate-messages")) {
			return {
				title: "Moderate Messages",
				path: "/admin/moderate-messages",
				tabs: [
					{
						id: "pending-review",
						label: "Pending Review",
						path: "/admin/moderate-messages",
					},
					{
						id: "approved",
						label: "Approved",
						path: "/admin/moderate-messages",
					},
					{ id: "deleted", label: "Deleted", path: "/admin/moderate-messages" },
					{
						id: "user-warned",
						label: "User Warned",
						path: "/admin/moderate-messages",
					},
					{
						id: "escalated",
						label: "Escalated",
						path: "/admin/moderate-messages",
					},
				],
			};
		}

		if (pathname.startsWith("/admin/user-management")) {
			return {
				title: "User Management",
				path: "/admin/user-management",
			};
		}

		if (pathname.startsWith("/admin/permissions")) {
			return {
				title: "Permissions",
				path: "/admin/permissions",
			};
		}

		return null;
	};

	const currentRoute = getRouteInfo();
	const isTabActive = (path: string) => location.pathname === path;

	return (
		<S.HeaderContainer>
			<S.HeaderLeft>
				{currentRoute && (
					<>
						<S.PageTitle>{currentRoute.title}</S.PageTitle>
						{currentRoute.tabs && currentRoute.tabs.length > 0 && (
							<S.TabNavigation>
								{currentRoute.tabs.map((tab) => (
									<S.TabButton
										key={tab.id}
										$active={isTabActive(tab.path)}
										onClick={() => navigate({ to: tab.path })}
									>
										{tab.label}
									</S.TabButton>
								))}
							</S.TabNavigation>
						)}
					</>
				)}
			</S.HeaderLeft>
			<S.HeaderRight>
				<S.UserProfileContainer>
					<S.UserAvatar
						src="https://ui-avatars.com/api/?name=Nhu+Nguyen&background=3b82f6&color=fff"
						alt="Nhu Nguyen"
					/>
					<S.UserInfo>
						<S.UserName>Nhu Nguyen</S.UserName>
						<S.UserMail>nhunguyen@gmail.com</S.UserMail>
						<S.UserRole>Admin</S.UserRole>
					</S.UserInfo>
					<S.NotificationButton
						onClick={() => console.log("Notification clicked")}
					>
						<Bell size={20} color="#6b7280" />
						<S.NotificationDot />
					</S.NotificationButton>
				</S.UserProfileContainer>
			</S.HeaderRight>
		</S.HeaderContainer>
	);
};

export default Header;
