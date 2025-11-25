import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import * as S from "./Header.styled";
import { fetchProfile } from "@/services/auth/authAPI";
import type { Profile } from "@/services/auth/auth.type";
import { toast } from "sonner";

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
	const [profile, setProfile] = useState<Profile | null>(null);
	const [loadingProfile, setLoadingProfile] = useState<boolean>(false);
	const [errorProfile, setErrorProfile] = useState<string | null>(null);
	const navigate = useNavigate();
	const location = useLocation();

	const getRouteInfo = (): RouteInfo | null => {
		const pathname = location.pathname;

		if (pathname.startsWith("/admin/dashboard")) {
			return {
				title: "Dashboard",
				path: "/admin/dashboard",
				tabs: [
					{ id: "user", label: "User", path: "/admin/dashboard?tab=user" },
					{
						id: "language",
						label: "Language",
						path: "/admin/dashboard?tab=language",
					},
					{ id: "group", label: "Group", path: "/admin/dashboard?tab=group" },
					{
						id: "system",
						label: "System",
						path: "/admin/dashboard?tab=system",
					},
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
						path: "/admin/moderate-messages?tab=pending-review",
					},
					{
						id: "approved",
						label: "Approved",
						path: "/admin/moderate-messages?tab=approved",
					},
					{
						id: "deleted",
						label: "Deleted",
						path: "/admin/moderate-messages?tab=deleted",
					},
					{
						id: "user-warned",
						label: "User Warned",
						path: "/admin/moderate-messages?tab=user-warned",
					},
					{
						id: "escalated",
						label: "Escalated",
						path: "/admin/moderate-messages?tab=escalated",
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

		if (pathname.startsWith("/admin/permission")) {
			return {
				title: "Permissions",
				path: "/admin/permission",
				tabs: [
					{
						id: "system-roles",
						label: "System Roles",
						path: "/admin/permission?tab=system-roles",
					},
					{
						id: "feature",
						label: "Permissions",
						path: "/admin/permission?tab=feature",
					},
					// {
					// 	id: "project",
					// 	label: "Project Permissions",
					// 	path: "/admin/permission?tab=project",
					// },
					// {
					// 	id: "resource-limit",
					// 	label: "Resource Limit",
					// 	path: "/admin/permission?tab=resource-limit",
					// },
					// {
					// 	id: "api-keys",
					// 	label: "API Keys",
					// 	path: "/admin/permission?tab=api-keys",
					// },
					// {
					// 	id: "code-execution",
					// 	label: "Code Execution",
					// 	path: "/admin/permission?tab=code-execution",
					// },
					// {
					// 	id: "security",
					// 	label: "Advanced Security",
					// 	path: "/admin/permission?tab=security",
					// },
					{
						id: "change-history",
						label: "Change History",
						path: "/admin/permission?tab=change-history",
					},
				],
			};
		}

		if (pathname.startsWith("/admin/report-category")) {
			return {
				title: "Report Categories",
				path: "/admin/report-category",
			};
		}

		return null;
	};

	const currentRoute = getRouteInfo();

	useEffect(() => {
		let isMounted = true;
		setLoadingProfile(true);
		fetchProfile()
			.then((res: any) => {
				if (!isMounted) return;
				// If wrapped, prefer res.data; else assume direct profile
				setProfile(res?.data ?? res);
			})
			.catch((err: any) => {
				console.error("Failed to load current user", err);
				if (!isMounted) return;
				setErrorProfile("Failed to load profile");
				toast.error("Failed to load profile");
			})
			.finally(() => {
				if (!isMounted) return;
				setLoadingProfile(false);
			});
		return () => {
			isMounted = false;
		};
	}, []);

	const fullName = (() => {
		if (!profile) return "";
		const parts = [profile.firstName, profile.lastName]
			.filter(Boolean)
			.join(" ")
			.trim();
		return parts || profile.username;
	})();

	const avatarSrc = profile?.avatarUrl
		? profile.avatarUrl
		: fullName
			? `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=3b82f6&color=fff`
			: `https://ui-avatars.com/api/?name=User&background=3b82f6&color=fff`;

	const isTabActive = (tabId: string) => {
		const searchParams = new URLSearchParams(location.search);
		const currentTab = searchParams.get("tab");

		if (!currentTab && currentRoute?.tabs?.[0]?.id === tabId) {
			return true;
		}

		return currentTab === tabId;
	};

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
										$active={isTabActive(tab.id)}
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
					{loadingProfile ? (
						<S.UserInfo>
							<S.UserName>Loading...</S.UserName>
							<S.UserMail>---</S.UserMail>
							<S.UserRole>...</S.UserRole>
						</S.UserInfo>
					) : errorProfile ? (
						<S.UserInfo>
							<S.UserName>Error</S.UserName>
							<S.UserMail>-</S.UserMail>
							<S.UserRole>-</S.UserRole>
						</S.UserInfo>
					) : (
						<>
							<S.UserAvatar
								src={avatarSrc}
								alt={profile?.firstName || "User"}
							/>
							<S.UserInfo>
								<S.UserName>{profile?.firstName}</S.UserName>
								<S.UserMail>{profile?.email}</S.UserMail>
							</S.UserInfo>
						</>
					)}
				</S.UserProfileContainer>
			</S.HeaderRight>
		</S.HeaderContainer>
	);
};

export default Header;
