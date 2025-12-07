import React from "react";
import {
	ButtonActionGr,
	ConfirmImage,
	ContentCard,
	LoginButton,
	PageWrapper,
	Text,
	TitleCard,
	TitleGr,
} from "@/pages/ConfirmMail/ConfirmMail.styled";
import MainBg from "@/components/custom/MainBackground/MainBg";
import ConfirmMailImage from "@/assets/image/confirm-mail.png";
import { useNavigate } from "@tanstack/react-router";

type Props = { status?: "success" | "error" | "loading"; message?: string };
export const VerifyMail: React.FC<Props> = ({
	status: initialStatus,
	message: initialMessage,
}) => {
	const navigate = useNavigate();

	const goToLogin = () => {
		navigate({ to: "/auth/login" });
	};

	return (
		<>
			<MainBg />
			<PageWrapper>
				<ContentCard>
					<ConfirmImage src={ConfirmMailImage} alt="Verify" />
					<TitleCard>
						{initialStatus === "success"
							? "Email verified successfully"
							: initialStatus === "error"
								? "Email verification failed"
								: "Verifying your email"}
					</TitleCard>
					<TitleGr>
						{initialStatus === "loading" && (
							<Text>Please wait while we verify your email...</Text>
						)}
						{initialStatus !== "loading" && <Text>{initialMessage}</Text>}
					</TitleGr>
					<ButtonActionGr>
						<LoginButton onClick={goToLogin}>Back to Login</LoginButton>
						{/* <SubmitButton variant="default">Resend</SubmitButton> */}
					</ButtonActionGr>
				</ContentCard>
			</PageWrapper>
		</>
	);
};

export default VerifyMail;
