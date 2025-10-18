import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import {
	BoldText,
	ButtonActionGr,
	ConfirmImage,
	ContentCard,
	LoginButton,
	PageWrapper,
	SubmitButton,
	Text,
	TitleCard,
	TitleGr,
} from "./ConfirmMail.styled";
import MainBg from "@/components/custom/MainBackground/MainBg";
import ConfirmMailImage from "@/assets/image/confirm-mail.png";

export const ConfirmMail = () => {
	const pendingEmail = useSelector(
		(state: RootState) => state.user.pendingEmail,
	);
	const displayEmail = pendingEmail || "your email";

	const goToLogin = () => {
		window.location.href = "/auth/login";
	};

	return (
		<>
			<MainBg />
			<PageWrapper>
				<ContentCard>
					<ConfirmImage src={ConfirmMailImage} alt="Languages" />
					<TitleCard>Confirm your email address</TitleCard>
					<TitleGr>
						<Text>We sent a confirmation email to:</Text>
						<BoldText>{displayEmail}</BoldText>
						<Text>
							Check your email and click on the confirmation link to continue.
						</Text>
					</TitleGr>
					<ButtonActionGr>
						<LoginButton onClick={goToLogin}>Back to Login</LoginButton>
						<SubmitButton variant="default">Send</SubmitButton>
					</ButtonActionGr>
				</ContentCard>
			</PageWrapper>
		</>
	);
};
