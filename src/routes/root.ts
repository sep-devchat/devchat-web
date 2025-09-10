import MainLayout from "@/layouts/MainLayout"
import { createRootRoute } from "@tanstack/react-router"

// Root route: wraps all pages with the app layout
export const rootRoute = createRootRoute({
  component: MainLayout,
})
