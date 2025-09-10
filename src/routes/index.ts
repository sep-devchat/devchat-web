import { createRouter } from "@tanstack/react-router";
import { rootRoute } from "./root";
import { publicRoutes } from "./public";
import { userRoutes } from "./user";
import { adminRoutes } from "./admin";

// Assemble the route tree from modular route groups
const routeTree = rootRoute.addChildren([
    ...publicRoutes,
    ...userRoutes,
    ...adminRoutes,
]);

// Create the router instance
export const router = createRouter({
    routeTree,
    // Preload on intent makes navigation feel instantaneous
    defaultPreload: "intent",
    // Let the router restore scroll on navigation. For custom behavior, see hooks/useScrollToTop
    scrollRestoration: true,
});

// Augment TanStack types for strong typing across useRouter hooks
declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

export default router;