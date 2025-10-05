import React from "react";
import { Outlet } from "@tanstack/react-router";
import Sidebar from "./Sidebar";
import Header from "./Header";
import * as S from "./AdminLayout.styled";

const AdminLayout: React.FC = () => {
	return (
		<S.LayoutContainer>
			<Sidebar />
			<S.MainContent>
				<Header />
				<S.ContentArea>
					<Outlet />
				</S.ContentArea>
			</S.MainContent>
		</S.LayoutContainer>
	);
};

export default AdminLayout;
