// src/pages/UserManagement.tsx
import React from "react";
import { Container } from "./UserManagement.styled";
import { useSearch } from "@tanstack/react-router";
import UserTab from "./Tabs/UserTab";
import GroupTab from "./Tabs/GroupTab";

export const UserManagement: React.FC = () => {
	const search = useSearch({ from: "/admin/user-management" });

	const activeTab = search.tab || "user";

	const renderContent = () => {
		switch (activeTab) {
			case "user":
				return <UserTab />;
			case "group":
				return <GroupTab />;
			default:
				return <UserTab />;
		}
	};

	return <Container>{renderContent()}</Container>;
};
