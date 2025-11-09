/* eslint-disable @typescript-eslint/no-explicit-any */
import ConfirmBg from "@/components/custom/ConfirmBackground/ConfirmBg";
import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
	BackArrow,
	BackText,
	ContentCard,
	EmailInput,
	PageWrapper,
	ResendGr,
	ResendText,
	SubmitButton,
	Text,
	TitleCard,
	TitleGr,
} from "./ForgotPassword.styled";
import OTPInput from "@/components/custom/OTPInput/OTPInput";
import { IoCaretBackOutline } from "react-icons/io5";
import {
	forgotPassword,
	confirmResetCode,
	resetPassword,
	sendResetCode,
} from "@/services/auth/authAPI";

export const ForgotPassword: React.FC = () => {
	const [step, setStep] = useState<number>(0);

	const [email, setEmail] = useState<string>("");
	const [emailError, setEmailError] = useState<string>("");

	const [otp, setOtp] = useState<string>(""); // 4 digits
	const [otpError, setOtpError] = useState<string>("");

	const [newPassword, setNewPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const [passwordError, setPasswordError] = useState<string>("");
	const [generalError, setGeneralError] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

	// basic email regex (simple)
	const isValidEmail = (v: string) =>
		/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

	// Handlers
	const handleSendEmail = async () => {
		setEmailError("");
		setGeneralError("");
		if (!email.trim()) {
			setEmailError("Email is required.");
			return;
		}
		if (!isValidEmail(email)) {
			setEmailError("Please enter a valid email address.");
			return;
		}

		try {
			setLoading(true);
			await forgotPassword({ email });
			setStep(1);
			setOtp("");
			setOtpError("");
		} catch (err: any) {
			setGeneralError(
				err?.response?.data?.message || "Failed to send reset code",
			);
		} finally {
			setLoading(false);
		}
	};

	const handleVerifyOtp = async () => {
		setOtpError("");
		setGeneralError("");
		if (!/^\d{6}$/.test(otp)) {
			setOtpError("Please enter the 6-digit code.");
			return;
		}
		try {
			setLoading(true);
			await confirmResetCode({ email, code: otp });
			setStep(2);
			setNewPassword("");
			setConfirmPassword("");
			setPasswordError("");
		} catch (err: any) {
			setGeneralError(
				err?.response?.data?.message || "Code verification failed",
			);
		} finally {
			setLoading(false);
		}
	};

	const handleSetNewPassword = async () => {
		setPasswordError("");
		setGeneralError("");
		if (!newPassword || newPassword.length < 6) {
			setPasswordError("Password must be at least 6 characters.");
			return;
		}
		if (newPassword !== confirmPassword) {
			setPasswordError("Passwords do not match.");
			return;
		}

		try {
			setLoading(true);
			await resetPassword({ email, code: otp, newPassword });
			window.location.href = "/auth/confirm-mail"; // success redirect
		} catch (err: any) {
			setGeneralError(
				err?.response?.data?.message || "Failed to reset password",
			);
		} finally {
			setLoading(false);
		}
	};

	const goBack = () => {
		if (step > 0) setStep((s) => s - 1);
	};

	// Deprecated manual navigation kept for reference; using router Link instead.
	// const goToLogin = () => {
	// 	window.location.href = "/auth/login";
	// };

	return (
		<>
			<ConfirmBg />
			{/* Center the content in the middle of the viewport */}
			<PageWrapper
				style={{
					minHeight: "100vh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					padding: "24px",
				}}
			>
				{/* Step 0: enter email */}
				<ContentCard
					style={{
						display: step === 0 ? undefined : "none",
						maxWidth: 720,
						width: "100%",
					}}
				>
					<TitleCard>Forgot password?</TitleCard>
					{generalError && step === 0 && (
						<div style={{ color: "red", marginTop: 8 }}>{generalError}</div>
					)}

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
					{emailError && (
						<div style={{ color: "red", marginTop: 6 }}>{emailError}</div>
					)}

					<SubmitButton
						variant="default"
						onClick={handleSendEmail}
						aria-disabled={!email || !!emailError || loading}
					>
						{loading ? "Sending..." : "Send"}
					</SubmitButton>

					<BackText as={Link} to="/auth/login" style={{ cursor: "pointer" }}>
						Back to login
					</BackText>
				</ContentCard>

				{/* Step 1: verification */}
				<ContentCard
					style={{
						display: step === 1 ? undefined : "none",
						maxWidth: 720,
						width: "100%",
					}}
				>
					<BackArrow onClick={goBack} style={{ cursor: "pointer" }}>
						<IoCaretBackOutline />
					</BackArrow>

					<TitleGr>
						<TitleCard>Verification</TitleCard>
						{generalError && step === 1 && (
							<div style={{ color: "red", marginTop: 8 }}>{generalError}</div>
						)}
						<Text>Enter Verification Code</Text>
					</TitleGr>

					{/* Use local SimpleOTP for reliable behavior */}
					<OTPInput length={6} value={otp} onChange={(val) => setOtp(val)} />

					{otpError && (
						<div style={{ color: "red", marginTop: 6 }}>{otpError}</div>
					)}

					<SubmitButton
						variant="default"
						onClick={handleVerifyOtp}
						aria-disabled={!otp || loading}
					>
						{loading ? "Verifying..." : "Verify"}
					</SubmitButton>

					<ResendGr style={{ marginTop: 8 }}>
						<Text>If you didn’t receive a code,</Text>
						<ResendText
							onClick={async () => {
								if (loading) return;
								setGeneralError("");
								try {
									setLoading(true);
									await sendResetCode({ email });
									alert("A new code has been sent to your email.");
								} catch (err: any) {
									setGeneralError(
										err?.response?.data?.message || "Failed to resend code",
									);
								} finally {
									setLoading(false);
								}
							}}
							style={{
								cursor: loading ? "not-allowed" : "pointer",
								opacity: loading ? 0.6 : 1,
							}}
						>
							{loading ? "Sending..." : "Resend"}
						</ResendText>
					</ResendGr>
				</ContentCard>

				{/* Step 2: new password */}
				<ContentCard
					style={{
						display: step === 2 ? undefined : "none",
						maxWidth: 720,
						width: "100%",
					}}
				>
					<BackArrow onClick={goBack} style={{ cursor: "pointer" }}>
						<IoCaretBackOutline />
					</BackArrow>

					<TitleGr>
						<TitleCard>New password</TitleCard>
						{generalError && step === 2 && (
							<div style={{ color: "red", marginTop: 8 }}>{generalError}</div>
						)}
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

					{passwordError && (
						<div style={{ color: "red", marginTop: 6 }}>{passwordError}</div>
					)}

					<SubmitButton
						variant="default"
						onClick={handleSetNewPassword}
						aria-disabled={loading}
					>
						{loading ? "Updating..." : "Update"}
					</SubmitButton>

					<BackText as={Link} to="/auth/login" style={{ cursor: "pointer" }}>
						Back to login
					</BackText>
				</ContentCard>
			</PageWrapper>
		</>
	);
};
