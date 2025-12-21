import { AuthContext } from "@/contexts/auth.context";
import { PropsWithChildren, useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentProfile, FetchProfileError } from "@/store/user.slice";
import { AppDispatch, RootState } from "@/store";
import publicRuntimeConfig from "@/config/publicRuntime";
import cookieUtils from "@/services/cookieUtils";
import { useNavigate } from "@tanstack/react-router";

const PROFILE_POLL_INTERVAL_MS = 5000;
const AUTH_ROUTE_PREFIX = "/auth";
const LANDING_ROUTE_PATH = "/"; // adjust if landing page path changes

export default function AuthProvider({ children }: PropsWithChildren) {
	const dispatch = useDispatch<AppDispatch>();
	const profile = useSelector((s: RootState) => s.user.profile);
	const isLoading = useSelector((s: RootState) => s.user.loading);
	const redirectingRef = useRef(false);
	const navigate = useNavigate();

	const handleUnauthorized = useCallback(() => {
		if (redirectingRef.current) return;
		redirectingRef.current = true;
		cookieUtils.clear();
		cookieUtils.setToken("");
		const loginPath = publicRuntimeConfig.ELECTRON
			? "/auth/login-electron"
			: "/auth/login";

		navigate({
			to: loginPath,
			replace: true,
			search: {
				message: "Your login session is expired, please login again",
			},
		});
	}, [navigate]);

	const shouldSkipProfileFetch = useCallback(() => {
		if (typeof window === "undefined") return false;
		const path = window.location.pathname || "";
		if (path === LANDING_ROUTE_PATH || path === "") return true;
		return path.startsWith(AUTH_ROUTE_PREFIX);
	}, []);

	const fetchProfileWithHandling = useCallback(async () => {
		if (shouldSkipProfileFetch()) {
			return;
		}
		const action = await dispatch(fetchCurrentProfile());
		if (fetchCurrentProfile.rejected.match(action)) {
			const payload = action.payload as FetchProfileError | undefined;
			if (payload?.status === 401) {
				handleUnauthorized();
			}
		}
	}, [dispatch, handleUnauthorized, shouldSkipProfileFetch]);

	const refetchProfile = useCallback(async () => {
		await fetchProfileWithHandling();
	}, [fetchProfileWithHandling]);

	useEffect(() => {
		let cancelled = false;
		const run = () => {
			if (cancelled) return;
			void fetchProfileWithHandling();
		};

		run();
		const intervalId = window.setInterval(run, PROFILE_POLL_INTERVAL_MS);
		return () => {
			cancelled = true;
			clearInterval(intervalId);
		};
	}, [fetchProfileWithHandling]);

	return (
		<AuthContext.Provider
			value={{
				profile,
				refetchProfile,
				isLoading,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
