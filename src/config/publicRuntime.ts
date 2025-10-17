const publicRuntimeConfig = {
	NODE_ENV: import.meta.env.NODE_ENV || "production",
	API_URL: import.meta.env.VITE_API_URL,
	SOCKET_URL: import.meta.env.VITE_SOCKET_URL || "",
	DEV_ENABLED: import.meta.env.VITE_DEV_ENABLED || false,
	GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",
	GITHUB_CLIENT_ID: import.meta.env.VITE_GITHUB_CLIENT_ID || "",
	ELECTRON: import.meta.env.VITE_ELECTRON || false,
};

export default publicRuntimeConfig;
