import React from "react";
import { Wrapper } from "./FloatingCard.styled";

export type Action = {
	key?: string;
	label: string;
	onClick: (e?: React.MouseEvent<HTMLButtonElement>) => void;
	variant?: "primary" | "secondary" | "link" | "destructive";
	disabled?: boolean;
	ariaLabel?: string;
};

export interface FloatingCardProps {
	message: React.ReactNode;
	actions?: Action[];
	className?: string;
	icon?: React.ReactNode;
	visible?: boolean;
}

const FloatingCard: React.FC<FloatingCardProps> = ({
	message,
	actions = [],
	className = "",
	icon,
	visible = true,
}) => {
	if (!visible) return null;

	return (
		<Wrapper role="status" aria-live="polite" className={className}>
			{/* Left: icon + message */}
			<div className="flex items-start gap-3 min-w-0 flex-1">
				{icon ? <div className="flex-shrink-0 mt-0.5">{icon}</div> : null}
				<div className="text-sm leading-tight text-gray-700 min-w-0">
					{message}
				</div>
			</div>

			{/* Right: actions */}
			{actions.length > 0 && (
				<div className="flex items-center gap-3 shrink-0">
					{actions.map((a, idx) => {
						const key = a.key ?? `${a.label}-${idx}`;
						const base =
							"inline-flex items-center justify-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

						const variants: Record<string, string> = {
							primary:
								"bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
							secondary:
								"bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-300",
							link: "bg-transparent text-gray-600 underline hover:text-gray-800 focus:ring-transparent",
							destructive:
								"bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
						};

						const cls = `${base} ${variants[a.variant ?? "primary"]}`;

						return (
							<button
								key={key}
								type="button"
								onClick={a.onClick}
								disabled={a.disabled}
								className={
									cls + (a.disabled ? " opacity-60 cursor-not-allowed" : "")
								}
								aria-label={a.ariaLabel ?? a.label}
							>
								{a.label}
							</button>
						);
					})}
				</div>
			)}
		</Wrapper>
	);
};

export default React.memo(FloatingCard);
