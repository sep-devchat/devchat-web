import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

import {
	Empty as BaseEmpty,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
	EmptyDescription,
	EmptyContent,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";

interface CustomEmptyProps extends React.ComponentProps<typeof BaseEmpty> {
	icon?: ReactNode;
	image?: ReactNode;
	heading?: ReactNode;
	description?: ReactNode;
	helperText?: ReactNode;
	action?: ReactNode;
}

/**
 * Opinionated empty-state component built on top of the shadcn/ui primitive.
 * Use it anywhere you need to let users know there is no content to show yet.
 */
function Empty({
	icon = <Inbox className="size-6" aria-hidden="true" />,
	image,
	heading = "Nothing to see here",
	description = "We couldn’t find any data for this section yet.",
	helperText,
	action,
	children,
	className,
	...props
}: CustomEmptyProps) {
	return (
		<BaseEmpty
			className={cn(
				"border border-dashed border-muted/60 bg-muted/30 text-muted-foreground",
				className,
			)}
			{...props}
		>
			<EmptyHeader>
				{image}
				{icon ? <EmptyMedia variant="icon">{icon}</EmptyMedia> : null}
				{heading ? <EmptyTitle>{heading}</EmptyTitle> : null}
				{description ? (
					<EmptyDescription>{description}</EmptyDescription>
				) : null}
			</EmptyHeader>

			{(action || helperText || children) && (
				<EmptyContent>
					{action}
					{helperText}
					{children}
				</EmptyContent>
			)}
		</BaseEmpty>
	);
}

export default Empty;
export type { CustomEmptyProps };
