import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { theme } from "@/themes"; // import theme để lấy màu

const Checkbox = React.forwardRef<
	React.ElementRef<typeof CheckboxPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, style, checked, ...props }, ref) => {
	// checked có thể là boolean | "indeterminate"
	const isChecked = checked === true || checked === "indeterminate";

	// style inline nhỏ để override background/border khi checked
	const bgStyle: React.CSSProperties = isChecked
		? {
				backgroundColor: `${theme.color.primary}`,
				borderColor: `${theme.color.primary}`,
			}
		: {};

	return (
		<CheckboxPrimitive.Root
			ref={ref}
			// dùng rounded-none để vuông; giữ các class khác cho focus/disabled
			className={cn(
				"grid place-content-center peer h-4 w-4 shrink-0 rounded-none border-b-gray-400 shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
				// không dùng data-[state=checked]:... ở đây cho màu vì ta xử lý màu bằng inline style (theme dynamic)
				className,
			)}
			style={{ ...(style || {}), ...bgStyle }}
			checked={checked}
			{...props}
		>
			<CheckboxPrimitive.Indicator
				className={cn("grid place-content-center text-current")}
			>
				{/* Khi checked, biến icon thành trắng để tương phản */}
				<Check className={isChecked ? "h-3 w-3 text-white" : "h-3 w-3"} />
			</CheckboxPrimitive.Indicator>
		</CheckboxPrimitive.Root>
	);
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
