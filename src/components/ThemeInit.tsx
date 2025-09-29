import { useEffect } from "react";

// Applies initial theme based on saved preference or system preference.
// This runs once at app start so all pages get correct theme before paint.
export default function ThemeInit() {
	useEffect(() => {
		// const STORAGE_KEY = "theme";
		// const saved = (typeof localStorage !== "undefined" &&
		// 	localStorage.getItem(STORAGE_KEY)) as "light" | "dark" | null;

		// const prefersDark =
		// 	typeof window !== "undefined" &&
		// 	window.matchMedia &&
		// 	window.matchMedia("(prefers-color-scheme: dark)").matches;

		// const theme = saved ?? (prefersDark ? "dark" : "light");

		const root = document.documentElement;
		// if (theme === "dark") root.classList.add("dark");
		// else root.classList.remove("dark");

		root.classList.remove("dark");
	}, []);

	return null;
}
