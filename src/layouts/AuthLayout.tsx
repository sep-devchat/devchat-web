import { useAuth } from "@/hooks";
import { useNavigate } from "@tanstack/react-router";
import { PropsWithChildren, useEffect } from "react";

export interface AuthLayoutProps extends PropsWithChildren {}

export default function AuthLayout({ children }: AuthLayoutProps) {
	const { profile, isLoading } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!profile && !isLoading) {
			navigate({ to: "/auth/login" });
		}

		console.log(profile);
	}, [profile, isLoading]);

	return <>{children}</>;
}
