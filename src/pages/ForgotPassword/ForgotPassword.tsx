/* eslint-disable @typescript-eslint/no-explicit-any */
import ConfirmBg from '@/components/ConfirmBackground/ConfirmBg'
import React, { useState } from 'react'
import { BackArrow, BackText, ContentCard, EmailInput, PageWrapper, ResendGr, ResendText, SubmitButton, Text, TitleCard, TitleGr } from './ForgotPassword.styled'
import OTPInput from '@/components/ui/OTPInput/OTPInput'
import { IoCaretBackOutline } from "react-icons/io5";

export const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<number>(0);

  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");

  const [otp, setOtp] = useState<string>(""); // 4 digits
  const [otpError, setOtpError] = useState<string>("");

  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  // basic email regex (simple)
  const isValidEmail = (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  // Handlers
  const handleSendEmail = () => {
    setEmailError("");
    if (!email.trim()) {
      setEmailError("Email is required.");
      return;
    }
    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    // TODO: call API to request OTP/send mail here
    // assume success -> go to verification
    setStep(1);
    setOtp("");
    setOtpError("");
  };

  const handleVerifyOtp = () => {
    setOtpError("");
    if (!/^\d{4}$/.test(otp)) {
      setOtpError("Please enter the 4-digit code.");
      return;
    }

    // TODO: call API to verify OTP. On success:
    setStep(2);
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
  };

  const handleSetNewPassword = () => {
    setPasswordError("");
    if (!newPassword || newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    // TODO: call API to set password. On success redirect to /auth/confirm-mail
    window.location.href = "/auth/confirm-mail";
  };

  const goBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const goToLogin = () => {
    window.location.href = "/auth/login";
  };

  return (
    <>
      <ConfirmBg />
      <PageWrapper>
        {/* Step 0: enter email */}
        <ContentCard style={{ display: step === 0 ? undefined : "none" }}>
          <TitleCard>Forgot password?</TitleCard>

          {/* Assume EmailInput accepts value/onChange. 
              If not, replace with <input ... /> or adapt to your component API */}
          <EmailInput
            label="Your email"
            placeholder="Example@email.com"
            value={email}
            onChange={(e: any) => {
              // if EmailInput returns event
              if (e && e.target) setEmail(e.target.value);
              else setEmail(String(e ?? ""));
            }}
          />
          {emailError && <div style={{ color: "red", marginTop: 6 }}>{emailError}</div>}

          <SubmitButton
            variant="default"
            onClick={handleSendEmail}
            aria-disabled={!email || !!emailError}
          >
            Send
          </SubmitButton>

          <BackText onClick={goToLogin} style={{ cursor: "pointer" }}>
            Back to login
          </BackText>
        </ContentCard>

        {/* Step 1: verification */}
        <ContentCard style={{ display: step === 1 ? undefined : "none" }}>
          <BackArrow onClick={goBack} style={{ cursor: "pointer" }}>
            <IoCaretBackOutline />
          </BackArrow>

          <TitleGr>
            <TitleCard>Verification</TitleCard>
            <Text>Enter Verification Code</Text>
          </TitleGr>

          {/* Use local SimpleOTP for reliable behavior */}
          <OTPInput value={otp} onChange={(val) => setOtp(val)} />

          {otpError && <div style={{ color: "red", marginTop: 6 }}>{otpError}</div>}

          <SubmitButton variant="default" onClick={handleVerifyOtp} aria-disabled={!otp}>
            Send
          </SubmitButton>

          <ResendGr style={{ marginTop: 8 }}>
            <Text>If you didn’t receive a code,</Text>
            <ResendText
              onClick={() => {
                // TODO: call resend API
                // show small feedback (simple alert for now)
                alert("A new code has been sent to your email.");
              }}
              style={{ cursor: "pointer" }}
            >
              Resend
            </ResendText>
          </ResendGr>
        </ContentCard>

        {/* Step 2: new password */}
        <ContentCard style={{ display: step === 2 ? undefined : "none" }}>
          <BackArrow onClick={goBack} style={{ cursor: "pointer" }}>
            <IoCaretBackOutline />
          </BackArrow>

          <TitleGr>
            <TitleCard>New password</TitleCard>
          </TitleGr>

          {/* Re-using EmailInput for password fields only if it supports type prop.
              Otherwise replace with native <input type="password" /> */}
          <EmailInput
            label="New password"
            placeholder="Enter your new password"
            value={newPassword}
            onChange={(e: any) => {
              if (e && e.target) setNewPassword(e.target.value);
              else setNewPassword(String(e ?? ""));
            }}
          />
          <EmailInput
            label="Confirm password"
            placeholder="Enter your confirm password"
            value={confirmPassword}
            onChange={(e: any) => {
              if (e && e.target) setConfirmPassword(e.target.value);
              else setConfirmPassword(String(e ?? ""));
            }}
          />

          {passwordError && <div style={{ color: "red", marginTop: 6 }}>{passwordError}</div>}

          <SubmitButton variant="default" onClick={handleSetNewPassword}>
            Send
          </SubmitButton>

          <BackText onClick={goToLogin} style={{ cursor: "pointer" }}>
            Back to login
          </BackText>
        </ContentCard>
      </PageWrapper>
    </>
  );
}