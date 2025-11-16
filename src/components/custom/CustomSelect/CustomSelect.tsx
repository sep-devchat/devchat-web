import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";

type Option = { value: string; label: string };

const DISABLED_BG = "#f3f4f6";
const DISABLED_OPACITY = 0.6;

const CustomSelect: React.FC<{
	value: string;
	disabled?: boolean;
	onChange: (value: string) => void;
	options: Option[];
	placeholder?: string;
	allowClear?: boolean;
}> = ({
	value,
	onChange,
	options,
	placeholder,
	disabled = false,
	allowClear = false,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const selectRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				selectRef.current &&
				!selectRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const selectedOption = options.find((opt) => opt.value === value);

	const handleSelect = (val: string) => {
		if (disabled) return;
		onChange(val);
		setIsOpen(false);
	};

	const handleClear = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (disabled) return;
		onChange("");
		setIsOpen(false);
	};

	return (
		<div
			style={{
				position: "relative",
				opacity: disabled ? DISABLED_OPACITY : 1,
				width: "100%",
			}}
			ref={selectRef}
			onClick={() => !disabled && setIsOpen((s) => !s)}
			role="button"
			aria-expanded={isOpen}
			tabIndex={0}
			onKeyDown={(e) => {
				if (disabled) return;
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					setIsOpen((s) => !s);
				} else if (e.key === "Escape") {
					setIsOpen(false);
				}
			}}
		>
			<div
				style={{
					width: "100%",
					padding: "12px 40px 12px 16px",
					height: "43px",
					border: `1.5px solid ${isOpen ? "#133e87" : "#e5e7eb"}`,
					borderRadius: "10px",
					fontSize: "14px",
					color: "#1f2937",
					background: disabled
						? DISABLED_BG
						: isOpen
							? "white"
							: "linear-gradient(to bottom, #ffffff, #f9fafb)",
					cursor: disabled ? "not-allowed" : "pointer",
					transition: "all 0.3s ease",
					boxShadow: isOpen
						? "0 0 0 4px rgba(59, 130, 246, 0.12), 0 4px 6px rgba(0, 0, 0, 0.07)"
						: "0 1px 3px rgba(0, 0, 0, 0.05)",
					userSelect: "none" as const,
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					gap: 8,
				}}
			>
				<div
					style={{
						flex: 1,
						overflow: "hidden",
						textOverflow: "ellipsis",
						whiteSpace: "nowrap",
					}}
				>
					{selectedOption ? selectedOption.label : placeholder || "Select..."}
				</div>

				<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
					{allowClear && !disabled && value && (
						<button
							onClick={handleClear}
							aria-label="Clear selection"
							title="Clear selection"
							style={{
								border: "none",
								background: "transparent",
								padding: 4,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								cursor: "pointer",
								color: "#6b7280",
							}}
						>
							<X size={16} />
						</button>
					)}

					<div
						style={{
							position: "absolute",
							right: "12px",
							top: "50%",
							transform: `translateY(-50%) rotate(${isOpen ? "180deg" : "0deg"})`,
							color: "#6b7280",
							pointerEvents: "none",
							transition: "transform 0.3s ease",
							opacity: disabled ? DISABLED_OPACITY : 1,
						}}
					>
						<ChevronDown size={18} />
					</div>
				</div>
			</div>

			{isOpen && !disabled && (
				<div
					style={{
						position: "absolute",
						top: "calc(100% + 8px)",
						left: 0,
						right: 0,
						background: "white",
						border: "1.5px solid #e5e7eb",
						borderRadius: "12px",
						boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
						zIndex: 1000,
						overflow: "hidden",
						animation: "slideDown 0.2s ease-out",
						padding: 6,
					}}
				>
					{placeholder && (
						<div
							style={{
								padding: "12px 16px",
								fontSize: "14px",
								color: "#6b7280",
								fontWeight: 500,
								fontStyle: "italic",
								cursor: "pointer",
								transition: "all 0.2s ease",
								margin: "6px 8px",
								borderRadius: "8px",
								minHeight: "42px",
								display: "flex",
								alignItems: "center",
							}}
							onClick={() => handleSelect("")}
						>
							{placeholder}
						</div>
					)}

					{options.map((option) => {
						const isSelected = option.value === value;
						return (
							<div
								key={option.value}
								style={{
									padding: "12px 16px",
									fontSize: "14px",
									color: isSelected ? "white" : "#1f2937",
									fontWeight: isSelected ? 600 : 500,
									background: isSelected ? "#133e87" : "white",
									cursor: "pointer",
									transition: "all 0.2s ease",
									margin: "6px 8px",
									borderRadius: "8px",
									minHeight: "42px",
									display: "flex",
									alignItems: "center",
								}}
								onClick={() => handleSelect(option.value)}
								role="option"
								aria-selected={isSelected}
							>
								{option.label}
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default CustomSelect;
