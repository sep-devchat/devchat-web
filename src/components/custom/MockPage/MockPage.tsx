import React from "react";
import { cn } from "@/lib/utils";

import bgImage from "@/assets/image/loginBackground.png";

type MaxWidth =
	| "sm"
	| "md"
	| "lg"
	| "xl"
	| "2xl"
	| "3xl"
	| "4xl"
	| "5xl"
	| "6xl"
	| "7xl";

export type MockPageProps = {
	title?: React.ReactNode;
	description?: React.ReactNode;
	actions?: React.ReactNode;
	children: React.ReactNode;
	className?: string;
	/** Tailwind max width size for the inner container (default: 7xl) */
	maxWidth?: MaxWidth;
	/** Add horizontal padding to the page container (default: true) */
	padded?: boolean;
	/** If true, header becomes sticky with subtle backdrop (default: false) */
	headerSticky?: boolean;
	/** Optional content padding inside card (default: true) */
	contentPadding?: boolean;
	/** Control visibility without unmounting parent (default: true). When false, renders nothing. */
	visible?: boolean;
	/** Animate in on mount (default: true). */
	animate?: boolean;
};

/**
 * MockPage: A general page container for displaying page content consistently.
 * - Provides an optional header (title, description, actions)
 * - Centers content with a configurable max width
 * - Wraps content in a themed card surface using shadcn/tailwind tokens
 */
export default function MockPage({
	title,
	description,
	actions,
	children,
	className,
	padded = true,
	headerSticky = false,
	contentPadding = true,
	visible = true,
	animate = true,
}: MockPageProps) {
	if (!visible) return null;

	return (
		<div
			className={cn(
				// Fullscreen overlay to appear above all app layers
				"fixed inset-0 z-[9999] overflow-auto bg-background isolate",
				animate &&
					// Respect reduced motion; animate fade+zoom overlay
					"motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-95 motion-safe:duration-200 motion-safe:ease-out",
				className,
			)}
		>
			<div
				style={{
					backgroundImage: `url(${bgImage})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
				}}
				className={cn(
					"mx-auto w-full h-screen p-6",
					padded && "px-4 sm:px-6 lg:px-8",
					"py-4 sm:py-6 lg:py-8",
					animate &&
						"motion-safe:animate-in motion-safe:slide-in-from-bottom-8 motion-safe:duration-200 motion-safe:ease-out",
				)}
			>
				{(title || description || actions) && (
					<div
						className={cn(
							"mb-4 sm:mb-6 flex items-start justify-between gap-3",
							headerSticky &&
								"sticky top-0 z-10 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-3",
						)}
					>
						<div className="min-w-0">
							{title ? (
								<h2 className="text-2xl font-semibold tracking-tight truncate text-[#27364B]">
									{title}
								</h2>
							) : null}

							{description ? (
								<p className="mt-1 text-sm text-muted-foreground line-clamp-2 text-[#666666]">
									{description}
								</p>
							) : null}
						</div>

						{actions ? (
							<div className="flex shrink-0 items-center gap-2">{actions}</div>
						) : null}
					</div>
				)}

				<div className={cn(contentPadding && "p-4 sm:p-6")}>{children}</div>
			</div>
		</div>
	);
}
