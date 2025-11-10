import { StyledButton } from "./ActionButton.styled";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	fullWidth?: boolean;
	leftIcon?: React.ReactNode;
};

export const DeleteButton: React.FC<ButtonProps> = ({
	children = "Xóa",
	fullWidth,
	leftIcon,
	...rest
}) => {
	return (
		<StyledButton
			$variant="delete"
			$fullWidth={fullWidth}
			{...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
		>
			{leftIcon}
			{children}
		</StyledButton>
	);
};
