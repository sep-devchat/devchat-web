import ConfirmBg from '@/components/ui/ConfirmBackground/ConfirmBg'
import React from 'react'
import { BoldText, ButtonActionGr, ConfirmImage, ContentCard, LoginButton, PageWrapper, SubmitButton, Text, TitleCard, TitleGr } from './ConfirmMail.styled';

export const ConfirmMail: React.FC = () => {
  const goToLogin = () => {
    window.location.href = "/auth/login";
  };

  return (
    <>
      <ConfirmBg />
      <PageWrapper>
        <ContentCard>
          <ConfirmImage src="/src/assets/confirm-mail.png" alt="Languages" />
          <TitleCard>Confirm your email address</TitleCard>
          <TitleGr>
            <Text>We sent a confirmation email to:</Text>
            <BoldText>nguyenvana@gmail.com</BoldText>
            <Text>Check your email and click on the confirmation link to continue.</Text>
          </TitleGr>
          <ButtonActionGr>
            <LoginButton onClick={goToLogin}>Login</LoginButton>
            <SubmitButton variant="default" >Send</SubmitButton>
          </ButtonActionGr>
        </ContentCard>
      </PageWrapper>
    </>
  )
}