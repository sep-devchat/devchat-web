import React from "react";
import { AlertCircle } from "lucide-react";
import {
	ErrorContainer,
	IconContainer,
	TextWrapper,
	Title,
	ErrorMessageText,
	RetryButton,
} from "./ErrorMessage.styled";

interface ErrorMessageProps {
	message?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
	message = "An error occurred",
}) => {
	const handleReload = () => {
		window.location.reload();
	};

	return (
		<ErrorContainer>
			<IconContainer>
				<AlertCircle size={28} />
			</IconContainer>
			<TextWrapper>
				<Title>Unable to Load Data</Title>
				<ErrorMessageText>{message}</ErrorMessageText>
			</TextWrapper>
			<RetryButton onClick={handleReload}>Try Again</RetryButton>
		</ErrorContainer>
	);
};

export default ErrorMessage;
