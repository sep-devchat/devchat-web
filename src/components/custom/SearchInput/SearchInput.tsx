/* eslint-disable @typescript-eslint/no-explicit-any */
import { Search, X } from "lucide-react";
import React, { useRef, KeyboardEvent } from "react";
import IconButton from "../ActionButton/IconButton";
import { theme } from "@/themes";

export type SearchInputProps = {
	value: string;
	onChange: (value: any) => void;
	onClear?: () => void;
	onSubmit?: () => void;
	placeholder?: string;
	autoFocus?: boolean;
	className?: string;
	style?: React.CSSProperties;
	iconSize?: number;
	showSearchIcon?: boolean;
};

export default function SearchInput({
	value,
	onChange,
	onClear,
	onSubmit,
	placeholder = "Tìm kiếm...",
	autoFocus = false,
	className = "",
	style,
	iconSize = 18,
	showSearchIcon = true,
}: SearchInputProps) {
	const inputRef = useRef<HTMLInputElement | null>(null);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange(e.target.value);
	};

	const handleClear = () => {
		onChange("");
		onClear?.();
		inputRef.current?.focus();
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Escape") {
			handleClear();
		}
		if (e.key === "Enter") {
			onSubmit?.();
		}
	};

	return (
		<div
			className={`search-input-root ${className}`}
			style={{
				position: "relative",
				display: "flex",
				alignItems: "center",
				backgroundColor: "#f0f2f5",
				borderRadius: "8px",
				padding: "8px 16px",
				marginBottom: 8,
				...style,
			}}
		>
			{showSearchIcon && (
				<Search size={iconSize} color="#65676b" style={{ marginRight: 8 }} />
			)}

			<input
				ref={inputRef}
				type="text"
				placeholder={placeholder}
				value={value}
				onChange={handleInputChange}
				onKeyDown={handleKeyDown}
				autoFocus={autoFocus}
				style={{
					flex: 1,
					border: "none",
					background: "transparent",
					fontSize: 14,
					outline: "none",
					color: "#1c1e21",
				}}
			/>

			{value && (
				<IconButton
					icon={X}
					onClick={handleClear}
					ariaLabel="Clear search"
					title="Clear"
					size={22}
					color={`${theme.color.grey50}`}
					hoverBg="transparent"
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						border: "none",
						background: "transparent",
						cursor: "pointer",
						padding: 4,
						marginLeft: 8,
					}}
				/>
			)}
		</div>
	);
}
