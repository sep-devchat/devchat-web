import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import config from "./config";
import { GoogleOAuthProvider } from "@react-oauth/google";
import publicRuntimeConfig from "./config/publicRuntime";

// Import the generated route tree
import { routeTree } from "./routeTree.gen.ts";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import AuthProvider from "./components/AuthProvider.tsx";
import SocketProvider from "./components/SocketProvider.tsx";
import { io } from "socket.io-client";
import ThemeInit from "./components/ThemeInit.tsx";

// Create a new router instance
const router = createRouter({ routeTree });

// Central place to mount app-wide providers (Query, Router, etc.)
// Team note: add more providers here (auth, analytics) to keep main.tsx clean.
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1,
			staleTime: 1000 * 10, // 10s fresh window
			refetchOnWindowFocus: false,
		},
	},
});

const socket = io(config.publicRuntime.SOCKET_URL, {
	autoConnect: false,
	transports: ["websocket"],
});

export function Providers() {
	return (
		<GoogleOAuthProvider clientId={publicRuntimeConfig.GOOGLE_CLIENT_ID}>
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<SocketProvider socket={socket}>
						<ThemeInit />
						<RouterProvider router={router} />
						{config.publicRuntime.DEV_ENABLED ? (
							<ReactQueryDevtools
								initialIsOpen={false}
								buttonPosition="bottom-left"
							/>
						) : null}
						{config.publicRuntime.DEV_ENABLED ? (
							<TanStackRouterDevtools router={router} position="bottom-right" />
						) : null}
					</SocketProvider>
				</AuthProvider>
			</QueryClientProvider>
		</GoogleOAuthProvider>
	);
}

export default Providers;
