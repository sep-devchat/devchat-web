import React from "react";
import { Loader2 } from "lucide-react";
import { Container, IconWrapper, Message } from "./LoadingSpinner.styled";

interface LoadingSpinnerProps {
	message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
	message = "Loading...",
}) => {
	return (
		<Container>
			<IconWrapper>
				<Loader2 size={40} />
			</IconWrapper>
			<Message>{message}</Message>
		</Container>
	);
};

export default LoadingSpinner;
