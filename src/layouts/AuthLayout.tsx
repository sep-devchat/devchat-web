import { useAuth } from "@/hooks";
import { setProfile } from "@/store/user.slice";
import { useNavigate } from "@tanstack/react-router";
import { PropsWithChildren, useEffect } from "react";
import { useDispatch } from "react-redux";

export interface AuthLayoutProps extends PropsWithChildren {}

export default function AuthLayout({ children }: AuthLayoutProps) {
	const { profile, isLoading } = useAuth();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		if (!profile && !isLoading) {
			navigate({ to: "/auth/login" });
		}

		dispatch(setProfile(profile));
	}, [profile, isLoading]);

	return <>{children}</>;
}
