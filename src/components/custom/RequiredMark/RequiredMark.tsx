import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

export type RequiredMarkProps = Omit<
	HTMLAttributes<HTMLSpanElement>,
	"children"
> & {
	/** Visible mark content. Defaults to `*`. */
	mark?: ReactNode;
	/** Screen-reader text announced alongside the mark. Defaults to `required`. */
	label?: string;
};

const RequiredMark = ({
	className,
	mark = "*",
	label = "required",
	...props
}: RequiredMarkProps) => {
	return (
		<span className={cn("ml-0.5 text-destructive", className)} {...props}>
			<span aria-hidden="true">{mark}</span>
			<span className="sr-only">{label}</span>
		</span>
	);
};

export default RequiredMark;
