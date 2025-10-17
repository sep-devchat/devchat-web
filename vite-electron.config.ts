import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		tanstackRouter({
			target: "react",
			generatedRouteTree: path.resolve(__dirname, "./src/routeTree.gen.ts"),
			routesDirectory: path.resolve(__dirname, "./src/routes"),
		}),
		react(),
		tailwindcss(),
	],
	// Ensure relative paths suitable for loading inside Electron renderer
	base: "./",
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	server: {
		host: "0.0.0.0",
	},
	build: {
		// Place build output under dist/src to match desired structure
		outDir: path.resolve(__dirname, "../src/front"),
		emptyOutDir: true,
		// Keep assets in place without hashing for easier Electron file referencing
		assetsInlineLimit: 0,
		rollupOptions: {
			output: {
				// Put JS bundles under renderer/ directory
				entryFileNames: "renderer/[name].js",
				chunkFileNames: "renderer/[name].js",
				assetFileNames: "assets/[name][extname]",
			},
		},
	},
});
