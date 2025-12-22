import { AuthContext } from "@/contexts/auth.context";
import { PropsWithChildren, useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentProfile, FetchProfileError } from "@/store/user.slice";
import { AppDispatch, RootState } from "@/store";
import publicRuntimeConfig from "@/config/publicRuntime";
import cookieUtils from "@/services/cookieUtils";
import { toast } from "sonner";
import { router } from "@/router";

const LOGOUT_MESSAGE = "Your login session is expired, please login again";

const PROFILE_POLL_INTERVAL_MS = 5000;
const AUTH_ROUTE_PREFIX = "/auth";
const LANDING_ROUTE_PATH = "/"; // adjust if landing page path changes
const LOGIN_PATHS = new Set(["/auth/login", "/auth/login-electron"]);

const getCurrentPath = () => {
	if (typeof window === "undefined") return "";
	return window.location.pathname || "";
};

const isLoginRoutePath = (path: string) => LOGIN_PATHS.has(path);

export default function AuthProvider({ children }: PropsWithChildren) {
	const dispatch = useDispatch<AppDispatch>();
	const profile = useSelector((s: RootState) => s.user.profile);
	const isLoading = useSelector((s: RootState) => s.user.loading);
	const redirectingRef = useRef(false);
	const loginRouteFetchAttemptedRef = useRef(false);

	const handleUnauthorized = useCallback(() => {
		if (redirectingRef.current) return;
		redirectingRef.current = true;
		cookieUtils.clear();
		cookieUtils.setToken("");
		const loginPath = publicRuntimeConfig.ELECTRON
			? "/auth/login-electron"
			: "/auth/login";

		toast.warning("You have been logged out. Please log in again.");

		router.navigate({
			to: loginPath as "/auth/login" | "/auth/login-electron",
			replace: true,
			search: () => ({ message: LOGOUT_MESSAGE }),
		});
	}, []);

	const shouldSkipProfileFetch = useCallback(() => {
		const path = getCurrentPath();
		if (isLoginRoutePath(path)) {
			if (!loginRouteFetchAttemptedRef.current) {
				loginRouteFetchAttemptedRef.current = true;
				return false;
			}
			return true;
		}
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
				const currentPath = getCurrentPath();
				if (isLoginRoutePath(currentPath)) {
					cookieUtils.clear();
					cookieUtils.setToken("");
					return;
				}
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
