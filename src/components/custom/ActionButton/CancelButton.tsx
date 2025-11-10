import React from "react";
import { StyledButton } from "./ActionButton.styled";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	fullWidth?: boolean;
	leftIcon?: React.ReactNode;
};

export const CancelButton: React.FC<ButtonProps> = ({
	children = "Hủy",
	fullWidth,
	leftIcon,
	...rest
}) => {
	return (
		<StyledButton
			$variant="cancel"
			$fullWidth={fullWidth}
			{...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
		>
			{leftIcon}
			{children}
		</StyledButton>
	);
};
