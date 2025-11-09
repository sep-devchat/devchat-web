import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchAiProviders } from "@/store/ai.slice";

/**
 * AppInit runs once on app mount to prefetch global data that
 * improves UX across the app (e.g., AI providers).
 */
export default function AppInit() {
	const dispatch = useDispatch();
	useEffect(() => {
		// Fire and forget; errors are stored in slice for optional UI
		// enhancements (e.g., settings page)
		// Avoid duplicate fetch if already fetched recently could be added later
		// via TTL check in slice/selectors.
		// For now, always fetch on first mount.
		// @ts-ignore allow unresolved store typing on generic dispatch
		dispatch(fetchAiProviders());
	}, [dispatch]);
	return null;
}
