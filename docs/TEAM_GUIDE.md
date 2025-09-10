# Team Guide: Architecture & Conventions

This project uses React + Vite with:
- TanStack Router for routing
- TanStack Query for server-state and caching
- Shadcn UI + Tailwind for components and styles
- styled-components for optional scoped styles

## Project Structure (src/)
- components/ ui/: Shadcn UI components
- layouts/: App shells (e.g., `MainLayout`)
- pages/: Route components (one folder per page)
- routes/: Router config (`index.ts` defines the route tree)
- services/: API callers (axios wrappers)
- store/: Redux for client-side state when needed
- themes/: Global styles, styled-components theme
- lib/: tiny utilities (`cn`)
- hooks/: custom hooks (scroll, store, etc.)

## Routing (TanStack Router)
- Edit `src/routes/index.ts`
- Use `createRoute` and attach to `rootRoute`
- Prefer route-based code splitting later if needed

Example:
```ts
import SamplePage from '@/pages/SamplePage'
import config from '@/config'
import { createRoute } from '@tanstack/react-router'
import { router } from '@/routes' // type augmentation

// In routes/index.ts:
const sampleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: config.routes.public.sample,
  component: SamplePage,
})
// Add to routeTree via rootRoute.addChildren([...])
```

## Data Fetching (TanStack Query)
- Provider lives in `src/providers.tsx`
- Default retry=1, staleTime=10s, no refetch on focus
- Put API definitions in `src/services`, then call them via `useQuery` in components

Example:
```ts
import { useQuery } from '@tanstack/react-query'
import { getSample } from '@/services/sampleAPI'

const { data, isLoading, error } = useQuery({
  queryKey: ['sample', id],
  queryFn: () => getSample(id).then(r => r.data),
})
```

## UI (Shadcn + Tailwind)
- Use components from `src/components/ui`
- Tailwind utilities in `src/index.css` and `tailwind.config.js`
- For complex scoped styles, create `*.styled.ts` with styled-components

## Conventions
- Imports: use `@/` alias
- Components: PascalCase; files co-located under `pages/<Page>/`
- Functions/variables: camelCase
- Comments: add a short header at top of new files (purpose, author)
- PRs: small, focused, include testing notes and screenshots for UI

## Branching & Commits
- Branch: `feature/<short-name>`, `fix/<short-name>`, `chore/<short-name>`
- Commits: Conventional-style is encouraged (`feat:`, `fix:`, `chore:`)

## Environment
- Copy `.env.example` to `.env`
- Expose variables via `VITE_` prefix, then access with `import.meta.env.VITE_*`

## Devtools
- React Query Devtools and TanStack Router Devtools are enabled in dev mode
- No production impact

## Gotchas
- Prefer React Query for server data; Redux for client state only
- Avoid mixing old react-router-dom APIs; this project uses TanStack Router
- Keep providers in `src/providers.tsx` to avoid provider sprawl in `main.tsx`

Happy building!
