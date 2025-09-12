import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import router from "@/routes";
import config from "./config";
import { GoogleOAuthProvider } from "@react-oauth/google";
import publicRuntimeConfig from "./config/publicRuntime";

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

export function Providers() {
  return (
    <GoogleOAuthProvider clientId={publicRuntimeConfig.GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export default Providers;
