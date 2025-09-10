/// <reference types="vite/client" />

// Ensure ImportMeta has env in TS context for conditional devtools rendering
interface ImportMetaEnv {
	readonly MODE: string
	readonly DEV: boolean
	readonly PROD: boolean
	readonly BASE_URL: string
	// Add your custom env vars here, all must start with VITE_
	// readonly VITE_API_URL: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
