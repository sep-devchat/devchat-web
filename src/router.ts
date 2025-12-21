import publicRuntimeConfig from "./config/publicRuntime";
import { routeTree } from "./routeTree.gen.ts";
import {
	createRouter,
	createMemoryHistory,
	RouterHistory,
} from "@tanstack/react-router";

let history: RouterHistory | undefined;
if (publicRuntimeConfig.ELECTRON) {
	history = createMemoryHistory({ initialEntries: ["/chat/friend"] });
}

export const router = createRouter({ routeTree, history });

// Enable type inference for the router across the app
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
