import React from "react";
import { cn } from "@/lib/utils";

// Placeholder background image
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
 * - Responsive scaling: 0.7x at ≤1220px, 0.8x at ≥1440px, 1x (base) at ≥1920px
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
					"mx-auto w-full h-screen",
					"p-6",
					"max-[1220px]:p-[16.8px]",
					"min-[1440px]:max-[1919px]:p-[19.2px]",
					"min-[1920px]:p-6",
					padded && [
						"px-4 sm:px-6 lg:px-8",
						"max-[1220px]:px-[11.2px] max-[1220px]:sm:px-[16.8px] max-[1220px]:lg:px-[22.4px]",
						"min-[1440px]:max-[1919px]:px-[12.8px] min-[1440px]:max-[1919px]:sm:px-[19.2px] min-[1440px]:max-[1919px]:lg:px-[25.6px]",
						"min-[1920px]:px-4 min-[1920px]:sm:px-6 min-[1920px]:lg:px-8",
					],
					"py-4 sm:py-6 lg:py-8",
					"max-[1220px]:py-[11.2px] max-[1220px]:sm:py-[16.8px] max-[1220px]:lg:py-[22.4px]",
					"min-[1440px]:max-[1919px]:py-[12.8px] min-[1440px]:max-[1919px]:sm:py-[19.2px] min-[1440px]:max-[1919px]:lg:py-[25.6px]",
					"min-[1920px]:py-4 min-[1920px]:sm:py-6 min-[1920px]:lg:py-8",
					animate &&
						"motion-safe:animate-in motion-safe:slide-in-from-bottom-8 motion-safe:duration-200 motion-safe:ease-out",
				)}
			>
				{(title || description || actions) && (
					<div
						className={cn(
							"mb-4 sm:mb-6 flex items-start justify-between gap-3",
							"max-[1220px]:mb-[11.2px] max-[1220px]:sm:mb-[16.8px] max-[1220px]:gap-[8.4px]",
							"min-[1440px]:max-[1919px]:mb-[12.8px] min-[1440px]:max-[1919px]:sm:mb-[19.2px] min-[1440px]:max-[1919px]:gap-[9.6px]",
							"min-[1920px]:mb-4 min-[1920px]:sm:mb-6 min-[1920px]:gap-3",
							headerSticky && [
								"sticky top-0 z-10",
								"-mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 py-3",
								"max-[1220px]:-mx-[11.2px] max-[1220px]:px-[11.2px] max-[1220px]:sm:-mx-[16.8px] max-[1220px]:sm:px-[16.8px] max-[1220px]:lg:-mx-[22.4px] max-[1220px]:lg:px-[22.4px] max-[1220px]:py-[8.4px]",
								"min-[1440px]:max-[1919px]:-mx-[12.8px] min-[1440px]:max-[1919px]:px-[12.8px] min-[1440px]:max-[1919px]:sm:-mx-[19.2px] min-[1440px]:max-[1919px]:sm:px-[19.2px] min-[1440px]:max-[1919px]:lg:-mx-[25.6px] min-[1440px]:max-[1919px]:lg:px-[25.6px] min-[1440px]:max-[1919px]:py-[9.6px]",
								"min-[1920px]:-mx-4 min-[1920px]:px-4 min-[1920px]:sm:-mx-6 min-[1920px]:sm:px-6 min-[1920px]:lg:-mx-8 min-[1920px]:lg:px-8 min-[1920px]:py-3",
								"border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60",
							],
						)}
					>
						<div className="min-w-0">
							{title ? (
								<h2
									className={cn(
										"text-2xl font-semibold tracking-tight truncate text-[#27364B]",
										"max-[1220px]:text-[16.8px]",
										"min-[1440px]:max-[1919px]:text-[19.2px]",
										"min-[1920px]:text-2xl",
									)}
								>
									{title}
								</h2>
							) : null}

							{description ? (
								<p
									className={cn(
										"mt-1 text-sm text-muted-foreground line-clamp-2 text-[#666666]",
										"max-[1220px]:mt-[2.8px] max-[1220px]:text-[9.8px]",
										"min-[1440px]:max-[1919px]:mt-[3.2px] min-[1440px]:max-[1919px]:text-[11.2px]",
										"min-[1920px]:mt-1 min-[1920px]:text-sm",
									)}
								>
									{description}
								</p>
							) : null}
						</div>

						{actions ? (
							<div
								className={cn(
									"flex shrink-0 items-center gap-2",
									"max-[1220px]:gap-[5.6px]",
									"min-[1440px]:max-[1919px]:gap-[6.4px]",
									"min-[1920px]:gap-2",
								)}
							>
								{actions}
							</div>
						) : null}
					</div>
				)}

				<div
					className={cn(
						contentPadding && [
							"p-4 sm:p-6",
							"max-[1220px]:p-[11.2px] max-[1220px]:sm:p-[16.8px]",
							"min-[1440px]:max-[1919px]:p-[12.8px] min-[1440px]:max-[1919px]:sm:p-[19.2px]",
							"min-[1920px]:p-4 min-[1920px]:sm:p-6",
						],
					)}
				>
					{children}
				</div>
			</div>
		</div>
	);
}
