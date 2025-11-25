import { StyledButton } from "./ActionButton.styled";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	fullWidth?: boolean;
	leftIcon?: React.ReactNode;
};

export const SaveButton: React.FC<ButtonProps> = ({
	children,
	fullWidth,
	leftIcon,
	...rest
}) => {
	return (
		<StyledButton
			$variant="save"
			$fullWidth={fullWidth}
			{...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
		>
			{leftIcon}
			{children || "Save"}
		</StyledButton>
	);
};
