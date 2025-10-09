import React from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import {
	LayoutDashboard,
	Users,
	Shield,
	BarChart3,
	Lock,
	Settings,
	LogOut,
	LucideIcon,
} from "lucide-react";
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
		{
			id: "moderate-messages",
			icon: Shield,
			label: "Moderate Messages",
			path: "/admin/moderate-messages",
		},
		{
			id: "analytics",
			icon: BarChart3,
			label: "Analytics",
			path: "/admin/analytics",
		},
		{
			id: "permissions",
			icon: Lock,
			label: "Permissions",
			path: "/admin/permissions",
		},
	];

	const bottomItems: MenuItem[] = [
		{ id: "setting", icon: Settings, label: "Setting", path: "/admin/setting" },
		{ id: "logout", icon: LogOut, label: "Log Out", path: "/auth/login" },
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
						active={isActive(item.path)}
						onClick={() => navigate({ to: item.path })}
					/>
				))}
			</S.SidebarBottom>
		</S.SidebarContainer>
	);
};

export default Sidebar;
