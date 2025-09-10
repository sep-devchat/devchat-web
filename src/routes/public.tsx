import { createRoute } from "@tanstack/react-router"
import { rootRoute } from "./root"
import config from "@/config"
import Home from "@/pages/Home"

// Public routes under the main layout
export const publicRoutes = [
  createRoute({
    getParentRoute: () => rootRoute,
    path: config.routes.public.home,
    component: Home,
  }),
]
