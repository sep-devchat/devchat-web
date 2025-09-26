# Team Guide: Architecture & Conventions

This project is React + Vite, using:

- TanStack Router (file-based routes) for navigation
- TanStack Query for server-state and caching
- shadcn/ui + Tailwind CSS for components and utilities
- styled-components for scoped styling and global theme
- Axios for API calls, cookies for auth token

The goal: keep routing, providers, data access, and UI patterns consistent and easy to extend.

## Project Structure (src/)

- `components/ui/`: shadcn UI building blocks (Button, Input, Select, etc.)
- `layouts/`: App shells (e.g., `MainLayout`)
- `pages/`: Route components (one folder per page, e.g., `Home/`)
- `routes/`: Router config (file-based routes). The generated tree is `src/routeTree.gen.ts`.
- `services/`: API callers using Axios (`apiCaller.ts`, `authAPI.ts`)
- `store/`: Redux for client-side UI state (kept minimal)
- `themes/`: Global styled-components styles and theme (`globalStyles.ts`)
- `hooks/`: Custom hooks (document title, theme, scrolling, store)
- `config/`: `publicRuntime.ts` for envs, `cookies.ts` keys, `index.ts` aggregator
- `lang/`: i18n provider and locale JSON (`en.json`, `vi.json`)
- `assets/`: Static assets

### Aliases

- Use `@/` to import from `src/` (configured in `vite.config.ts`).

## Routing (TanStack Router, file-based)

- File-based routes live under `src/routes/` using `createFileRoute`.
- The root route is defined in `src/routes/__root.tsx` using `createRootRoute` and renders an `<Outlet />`.
- Example: `src/routes/index.tsx` maps `/` to `src/pages/Home`.
- The route tree is generated automatically to `src/routeTree.gen.ts` via the Vite plugin.
- Note: Simply creating a new file in `src/routes/` (and exporting a `Route` via `createFileRoute`) is enough—the Vite plugin will auto-detect it and regenerate `src/routeTree.gen.ts`. No manual wiring is required.

Example route:

```tsx
// src/routes/index.tsx
import Home from "@/pages/Home";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: () => <Home />,
});
```

## Providers (Router, React Query, OAuth)

- Centralized in `src/providers.tsx`.
- Sets up:
  - TanStack Router with the generated `routeTree`
  - React Query (`QueryClientProvider`) with sensible defaults
  - Google OAuth (`GoogleOAuthProvider`) using `VITE_GOOGLE_CLIENT_ID`
  - Devtools (React Query + TanStack Router) when `DEV_ENABLED` is true

Usage: `main.tsx` mounts `<Providers />` and injects `GlobalStyles` + `ThemeProvider`.

## Data Fetching (TanStack Query + Axios)

- Define API calls in `src/services/`.
- `apiCaller.ts` wraps Axios and injects `Authorization: Bearer <token>` from cookies.
- Use React Query in components for fetching/caching.

Example API + Query:

```ts
// src/services/sampleAPI.ts
import { get } from "@/services/apiCaller";
export const getSample = (id: string) => get(`/api/sample/${id}`);
```

```tsx
// in a component
import { useQuery } from "@tanstack/react-query";
import { getSample } from "@/services/sampleAPI";
const { data, isLoading, error } = useQuery({
	queryKey: ["sample", id],
	queryFn: () => getSample(id).then((r) => r.data),
});
```

## Auth & Cookies

- Cookie keys are defined in `src/config/cookies.ts` (e.g., `token`).
- `cookieUtils` handles read/write/remove, plus `decodeJwt()` if needed.
- `apiCaller.ts` reads the token for the `Authorization` header.

## UI (shadcn + Tailwind + styled-components)

- Prefer shadcn UI primitives from `src/components/ui` for consistent styling.
- Tailwind v4 is configured. Entry CSS is `src/index.css` with `@import "tailwindcss";`.
- Global styles and theme come from `src/themes/globalStyles.ts` and `styled-components`.
- For scoped styles per page, add `*.styled.ts` and import where needed (see `pages/Home/Home.styled.ts`).

Example:

```tsx
import { Button } from "@/components/ui/button";
<Button variant="secondary">Click me</Button>;
```

## i18n

- Implemented in `src/lang/LanguageProvider.tsx` using locale files under `src/lang/locales/`.
- Use `useTranslation()` to read `t()` and change languages.

Example:

```tsx
import { useTranslation } from "@/lang/LanguageProvider";
const { t, locale, switchLanguage } = useTranslation();
```

## Theme toggling

- Use `useTheme()` from `src/hooks/useTheme.ts`.
- It toggles a `dark` class on `<html>` and persists preference in `localStorage`.

Example:

```tsx
import { useTheme } from "@/hooks";
const { theme, toggleTheme } = useTheme();
```

## Redux Store

- `src/store/index.ts` initializes an empty Redux store with default middleware (serializable check off).
- Use Redux for client-side UI state only. Prefer React Query for server data.

## Environment & Config

- Public runtime config lives in `src/config/publicRuntime.ts`:
  - `VITE_API_URL`: Base URL for Axios in `apiCaller.ts`
  - `VITE_GOOGLE_CLIENT_ID`, `VITE_GITHUB_CLIENT_ID`: OAuth IDs
  - `DEV_ENABLED`: auto from `import.meta.env.DEV`
- Access via `config.publicRuntime.*`.
- Create `.env` from `.env.example` (if provided). All public vars must be prefixed `VITE_`.
