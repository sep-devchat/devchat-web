import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import * as S from "./CustomSelect.styled";

type Option = { value: string; label: string };

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
		<S.SelectWrapper ref={selectRef} $disabled={disabled}>
			<S.SelectControl
				$open={isOpen}
				$disabled={disabled}
				type="button"
				onClick={() => !disabled && setIsOpen((s) => !s)}
				aria-haspopup="listbox"
				aria-expanded={isOpen}
				onKeyDown={(e) => {
					if (disabled) return;
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						setIsOpen((s) => !s);
					} else if (e.key === "Escape") {
						setIsOpen(false);
					}
				}}
				disabled={disabled}
			>
				<S.ValueText $isPlaceholder={!selectedOption}>
					{selectedOption ? selectedOption.label : placeholder || "Select..."}
				</S.ValueText>
				<S.ActionArea>
					{allowClear && !disabled && value && (
						<S.ClearButton
							onClick={handleClear}
							aria-label="Clear selection"
							type="button"
						>
							<X className="icon-size" />
						</S.ClearButton>
					)}
				</S.ActionArea>
				<S.Chevron $open={isOpen} $disabled={disabled}>
					<ChevronDown className="icon-size" />
				</S.Chevron>
			</S.SelectControl>

			{isOpen && !disabled && (
				<S.Dropdown role="listbox">
					{placeholder && (
						<S.PlaceholderOption
							$selected={!value}
							role="option"
							aria-selected={!value}
							onClick={(e) => {
								e.stopPropagation();
								handleSelect("");
							}}
						>
							{placeholder}
						</S.PlaceholderOption>
					)}

					{options.map((option) => {
						const isSelected = option.value === value;
						return (
							<S.Option
								key={option.value}
								$selected={isSelected}
								onClick={(e) => {
									e.stopPropagation();
									handleSelect(option.value);
								}}
								role="option"
								aria-selected={isSelected}
							>
								{option.label}
							</S.Option>
						);
					})}
				</S.Dropdown>
			)}
		</S.SelectWrapper>
	);
};

export default CustomSelect;
