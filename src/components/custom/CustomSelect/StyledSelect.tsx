/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import styled from "styled-components";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const SelectWrapper = styled.div<{ $isTopThree?: boolean }>`
	[data-radix-select-trigger] {
		width: 100%;
		padding: 10px 12px !important;
		border: 1.5px solid
			${(props) => (props.$isTopThree ? "rgba(255,255,255,0.3)" : "#e5e7eb")} !important;
		border-radius: 10px !important;
		font-size: 14px !important;
		font-weight: 500 !important;
		color: ${(props) => (props.$isTopThree ? "#ffffff" : "#1f2937")} !important;
		background-color: ${(props) =>
			props.$isTopThree ? "rgba(255,255,255,0.1)" : "white"} !important;
		transition: all 0.3s ease !important;
		height: auto !important;
		min-height: 40px !important;
		box-shadow: none !important;
		ring-offset-background: none !important;

		&:hover {
			border-color: ${(props) =>
				props.$isTopThree ? "rgba(255,255,255,0.5)" : "#9ca3af"} !important;
		}

		&:focus {
			outline: none !important;
			border-color: ${(props) =>
				props.$isTopThree ? "#ffffff" : "#133e87"} !important;
			box-shadow: none !important;
			ring: 0 !important;
		}

		&[data-state="open"] {
			border-color: ${(props) =>
				props.$isTopThree ? "#ffffff" : "#133e87"} !important;
		}

		@media (max-width: 1220px) {
			padding: 7px 8.4px !important;
			border-radius: 7px !important;
			font-size: 12.5px !important;
			min-height: 34px !important;
		}

		@media (min-width: 1440px) and (max-width: 1919px) {
			padding: 8px 9.6px !important;
			border-radius: 8px !important;
			font-size: 13.5px !important;
			min-height: 37px !important;
		}

		@media (min-width: 1920px) {
			padding: 11px 13.2px !important;
			border-radius: 11px !important;
			font-size: 16px !important;
			min-height: 44px !important;
		}
	}
`;

interface StyledSelectProps {
	value: string;
	onValueChange: (value: string) => void;
	options: { value: string; label: string }[];
	placeholder?: string;
	isTopThree?: boolean;
	disabled?: boolean;
}

const StyledSelect: React.FC<StyledSelectProps> = ({
	value,
	onValueChange,
	options,
	placeholder = "Select...",
	isTopThree = false,
	disabled = false,
}) => {
	// Only pass value if it's not empty and exists in options
	const validValue =
		value && options.some((opt) => opt.value === value) ? value : undefined;

	return (
		<SelectWrapper $isTopThree={isTopThree}>
			<Select
				value={validValue}
				onValueChange={onValueChange}
				disabled={disabled}
			>
				<SelectTrigger>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					{options.map((option) => (
						<SelectItem
							key={option.value}
							value={option.value}
							disabled={option.value === "0"}
						>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</SelectWrapper>
	);
};

export default StyledSelect;
