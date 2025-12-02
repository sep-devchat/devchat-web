import React, { useState } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import {
	LayoutDashboard,
	Users,
	// Settings,
	LogOut,
	LucideIcon,
	Flag,
	FileWarning,
	// Code,
} from "lucide-react";
import { logout } from "@/services/auth/authAPI";
import cookieUtils from "@/services/cookieUtils";
import { useDispatch } from "react-redux";
import { setProfile } from "@/store/user.slice";
import { toast } from "sonner";
import * as S from "./Sidebar.styled";

interface MenuItem {
	id: string;
	icon: LucideIcon;
	label: string;
	path: string;
}

interface SidebarItemProps {
	icon: LucideIcon;
	label: string;
	active: boolean;
	onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
	icon: Icon,
	label,
	active,
	onClick,
}) => (
	<S.SidebarItemButton $active={active} onClick={onClick}>
		<Icon size={18} />
		<span>{label}</span>
	</S.SidebarItemButton>
);

const Sidebar: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useDispatch();
	const [loggingOut, setLoggingOut] = useState(false);

	const handleLogout = async () => {
		if (loggingOut) return;
		setLoggingOut(true);
		try {
			await logout(); // server side token invalidation (if implemented)
		} catch (err) {
			// Even if API fails, proceed with local cleanup
			console.error("Logout API failed", err);
		}
		// Clear local auth artifacts
		cookieUtils.clear();
		window.localStorage.removeItem("accessToken");
		dispatch(setProfile(null));
		toast.success("Logged out successfully");
		navigate({ to: "/auth/login" });
		setLoggingOut(false);
	};

	const menuItems: MenuItem[] = [
		{
			id: "dashboard",
			icon: LayoutDashboard,
			label: "Dashboard",
			path: "/admin/dashboard",
		},
		{
			id: "user-management",
			icon: Users,
			label: "User Management",
			path: "/admin/user-management",
		},
		// {
		// 	id: "programming-languages",
		// 	icon: Code,
		// 	label: "Programming Languages",
		// 	path: "/admin/programming-languages",
		// },
		{
			id: "report-category",
			icon: Flag,
			label: "Report Categories",
			path: "/admin/report-category",
		},
		{
			id: "reports",
			icon: FileWarning,
			label: "Reports",
			path: "/admin/reports",
		},
	];

	const bottomItems: MenuItem[] = [
		// { id: "setting", icon: Settings, label: "Setting", path: "/admin/setting" },
		{
			id: "logout",
			icon: LogOut,
			label: loggingOut ? "Logging out..." : "Log Out",
			path: "__logout__",
		},
	];

	const isActive = (path: string) => location.pathname === path;

	return (
		<S.SidebarContainer>
			<S.SidebarNav>
				{menuItems.map((item) => (
					<SidebarItem
						key={item.id}
						icon={item.icon}
						label={item.label}
						active={isActive(item.path)}
						onClick={() => navigate({ to: item.path })}
					/>
				))}
			</S.SidebarNav>
			<S.SidebarBottom>
				{bottomItems.map((item) => (
					<SidebarItem
						key={item.id}
						icon={item.icon}
						label={item.label}
						active={item.path !== "__logout__" && isActive(item.path)}
						onClick={() => {
							if (item.id === "logout") {
								handleLogout();
								return;
							}
							navigate({ to: item.path });
						}}
					/>
				))}
			</S.SidebarBottom>
		</S.SidebarContainer>
	);
};

export default Sidebar;
