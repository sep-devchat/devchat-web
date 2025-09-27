const publicRuntimeConfig = {
	NODE_ENV: import.meta.env.NODE_ENV || "production",
	API_URL: import.meta.env.VITE_API_URL,
	DEV_ENABLED: import.meta.env.DEV,
	GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",
	GITHUB_CLIENT_ID: import.meta.env.VITE_GITHUB_CLIENT_ID || "",
};

export default publicRuntimeConfig;
