import { StyledButton } from "./ActionButton.styled";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	fullWidth?: boolean;
	leftIcon?: React.ReactNode;
};

export const InfoButton: React.FC<ButtonProps> = ({
	children = "Info",
	fullWidth,
	leftIcon,
	...rest
}) => {
	return (
		<StyledButton
			$variant="info"
			$fullWidth={fullWidth}
			{...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
		>
			{leftIcon}
			{children}
		</StyledButton>
	);
};
