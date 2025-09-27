import { useEffect, useState, useCallback } from "react";

// Theme management hook: toggles `dark` class on <html> and persists to localStorage
// Usage: const { theme, toggleTheme, setTheme } = useTheme()
type Theme = "light" | "dark";
const STORAGE_KEY = "theme";

export default function useTheme() {
	const getInitial = (): Theme => {
		const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
		if (saved === "light" || saved === "dark") return saved;
		// Fallback to system preference
		const prefersDark =
			window.matchMedia &&
			window.matchMedia("(prefers-color-scheme: dark)").matches;
		return prefersDark ? "dark" : "light";
	};

	const [theme, setThemeState] = useState<Theme>(getInitial);

	const applyTheme = useCallback((next: Theme) => {
		const root = document.documentElement;
		if (next === "dark") root.classList.add("dark");
		else root.classList.remove("dark");
	}, []);

	const setTheme = useCallback(
		(next: Theme | ((prev: Theme) => Theme)) => {
			setThemeState((prev) => {
				const resolved =
					typeof next === "function"
						? (next as (p: Theme) => Theme)(prev)
						: next;
				localStorage.setItem(STORAGE_KEY, resolved);
				applyTheme(resolved);
				return resolved;
			});
		},
		[applyTheme],
	);

	const toggleTheme = useCallback(() => {
		setTheme((prev: Theme) => (prev === "dark" ? "light" : "dark"));
	}, [setTheme]);

	useEffect(() => {
		applyTheme(theme);
		// Sync with OS changes if no explicit preference stored
		const media = window.matchMedia("(prefers-color-scheme: dark)");
		const onChange = (e: MediaQueryListEvent) => {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (!saved) setTheme(e.matches ? "dark" : "light");
		};
		media.addEventListener?.("change", onChange);
		return () => media.removeEventListener?.("change", onChange);
	}, [theme, setTheme, applyTheme]);

	return { theme, setTheme, toggleTheme };
}
