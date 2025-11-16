/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
	useState,
	CSSProperties,
	cloneElement,
	ReactElement,
} from "react";

export type IconButtonProps = {
	icon: ReactElement<any, any> | React.ComponentType<any>;
	size?: number;
	iconSize?: number;
	color?: string;
	onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	className?: string;
	style?: CSSProperties;
	hoverBg?: string;
	circle?: boolean;
	disabled?: boolean;
	ariaLabel?: string;
	title?: string;
};

export default function IconButton({
	icon,
	size = 32,
	iconSize,
	color = "#1c1e21",
	onClick,
	className = "",
	style,
	hoverBg = "rgba(0,0,0,0.05)",
	circle = false,
	disabled = false,
	ariaLabel,
	title,
}: IconButtonProps) {
	const [isHover, setIsHover] = useState(false);

	const computedIconSize = iconSize ?? Math.round(size * 0.625); // default to 20px if size 32

	const baseStyle: CSSProperties = {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		width: `${size}px`,
		height: `${size}px`,
		border: "none",
		background: "transparent",
		cursor: disabled ? "not-allowed" : "pointer",
		borderRadius: circle ? "50%" : "8px",
		transition: "background-color 0.18s, transform 0.08s",
		outline: "none",
		padding: 0,
		...(style || {}),
		// hover background applied dynamically below
	};

	const hoverStyle: CSSProperties =
		isHover && !disabled ? { backgroundColor: hoverBg } : {};

	const mergedStyle: CSSProperties = { ...baseStyle, ...hoverStyle };

	// render passed icon: if it's a React element, clone and pass size/color props
	const renderIcon = () => {
		// If it's already a React element instance, clone and inject props
		if (React.isValidElement(icon)) {
			try {
				return cloneElement(
					icon as ReactElement<any, any>,
					{ size: computedIconSize, color } as any,
				);
			} catch {
				// Fallback: render as-is
				return icon;
			}
		}

		// If icon is a component (function or class), instantiate it
		const IconComp = icon as React.ComponentType<any>;
		return <IconComp size={computedIconSize} color={color} />;
	};

	return (
		<button
			type="button"
			aria-label={ariaLabel}
			title={title}
			onClick={disabled ? undefined : onClick}
			onMouseEnter={() => setIsHover(true)}
			onMouseLeave={() => setIsHover(false)}
			onFocus={() => setIsHover(true)}
			onBlur={() => setIsHover(false)}
			disabled={disabled}
			className={`icon-button ${className}`}
			style={mergedStyle}
		>
			{renderIcon()}
		</button>
	);
}
