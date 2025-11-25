import React, { useEffect } from "react";
import { Outlet, useNavigate } from "@tanstack/react-router";
import Sidebar from "./Sidebar";
import Header from "./Header";
import * as S from "./AdminLayout.styled";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

// Admin guard centralized: checks redux profile for isAdmin
// Redirects non-admin users away from /admin while showing minimal fallback.

const AdminLayout: React.FC = () => {
	const navigate = useNavigate();
	const profile = useSelector((s: RootState) => s.user.profile);
	const loading = useSelector((s: RootState) => s.user.loading);

	useEffect(() => {
		if (!loading && profile && profile.isAdmin === false) {
			navigate({ to: "/" });
		}

		if (!loading && !profile) {
			navigate({ to: "/auth/login" });
		}
	}, [loading, profile, navigate]);

	if (loading) {
		return (
			<S.LayoutContainer>
				<S.MainContent>
					<div style={{ padding: "2rem" }}>Loading admin area...</div>
				</S.MainContent>
			</S.LayoutContainer>
		);
	}

	if (profile && profile.isAdmin === false) {
		return (
			<S.LayoutContainer>
				<S.MainContent>
					<div style={{ padding: "2rem" }}>Unauthorized</div>
				</S.MainContent>
			</S.LayoutContainer>
		);
	}

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
