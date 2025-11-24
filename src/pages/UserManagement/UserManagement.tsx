// src/pages/UserManagement.tsx
import React from "react";
import { Container } from "./UserManagement.styled";
import UserTab from "./Tabs/UserTab";

export const UserManagement: React.FC = () => (
	<Container>
		<UserTab />
	</Container>
);
