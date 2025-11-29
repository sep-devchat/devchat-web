/* eslint-disable @typescript-eslint/no-explicit-any */
import { Search, X } from "lucide-react";
import React, { useRef, KeyboardEvent } from "react";
import IconButton from "../ActionButton/IconButton";
import { theme } from "@/themes";
import styled from "styled-components";

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

const StyledInput = styled.input`
	flex: 1;
	border: none;
	background: transparent;
	font-size: 14px;
	outline: none;
	color: #1c1e21;

	&::placeholder {
		font-size: 14px;
	}

	@media (max-width: 1220px) {
		font-size: 12px;
		&::placeholder {
			font-size: 12px;
		}
	}

	@media (min-width: 1440px) {
		font-size: 13px;
		&::placeholder {
			font-size: 13px;
		}
	}

	@media (min-width: 1920px) {
		font-size: 16px;
		&::placeholder {
			font-size: 16px;
		}
	}
`;

export default function SearchInput({
	value,
	onChange,
	onClear,
	onSubmit,
	placeholder = "Search...",
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

			<StyledInput
				ref={inputRef}
				type="text"
				placeholder={placeholder}
				value={value}
				onChange={handleInputChange}
				onKeyDown={handleKeyDown}
				autoFocus={autoFocus}
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
