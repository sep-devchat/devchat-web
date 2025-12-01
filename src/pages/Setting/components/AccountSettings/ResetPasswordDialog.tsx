/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { z, type ZodIssue } from "zod";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import OTPInput from "@/components/custom/OTPInput/OTPInput";
import {
	confirmResetCode,
	resetPassword,
	sendResetCode,
} from "@/services/auth/authAPI";

interface ResetPasswordDialogProps {
	showReset: boolean;
	setShowReset: (show: boolean) => void;
	step: 1 | 2;
	setStep: (step: 1 | 2) => void;
	email: string;
	setEmail: (email: string) => void;
	code: string;
	setCode: (code: string) => void;
	newPassword: string;
	setNewPassword: (password: string) => void;
	confirmPassword: string;
	setConfirmPassword: (password: string) => void;
	loading: boolean;
	setLoading: (loading: boolean) => void;
	error: string;
	setError: (error: string) => void;
	success: string;
	setSuccess: (success: string) => void;
	cooldown: number;
	setCooldown: React.Dispatch<React.SetStateAction<number>>;
	codeSent: boolean;
	setCodeSent: (sent: boolean) => void;
	cooldownTimerRef: React.MutableRefObject<number | null>;
}

const passwordSchema = z
	.string()
	.min(8, "Password must be at least 8 characters.")
	.regex(/[A-Z]/, "Password must include at least one uppercase letter.")
	.regex(/\d/, "Password must include at least one number.")
	.regex(
		/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/,
		"Password must include at least one special character.",
	);

export const ResetPasswordDialog: React.FC<ResetPasswordDialogProps> = ({
	showReset,
	setShowReset,
	step,
	setStep,
	email,
	code,
	setCode,
	newPassword,
	setNewPassword,
	confirmPassword,
	setConfirmPassword,
	loading,
	setLoading,
	error,
	setError,
	success,
	setSuccess,
	cooldown,
	setCooldown,
	codeSent,
	setCodeSent,
	cooldownTimerRef,
}) => {
	const onVerifyCode = async () => {
		setError("");
		setSuccess("");
		if (!codeSent) {
			setError("Please send the verification code first.");
			return;
		}
		if (!/^\d{6}$/.test(code)) {
			setError("Please enter the 6-digit code.");
			return;
		}
		try {
			setLoading(true);
			await confirmResetCode({ email, code });
			setStep(2);
		} catch (e: any) {
			setError(e?.response?.data?.message || "Code verification failed");
		} finally {
			setLoading(false);
		}
	};

	const onSendOrResend = async () => {
		if (loading || cooldown > 0) return;
		setError("");
		try {
			setLoading(true);
			await sendResetCode({ email });
			setCodeSent(true);
			setCooldown(60);
			if (cooldownTimerRef.current) {
				window.clearInterval(cooldownTimerRef.current);
			}
			cooldownTimerRef.current = window.setInterval(() => {
				setCooldown((prev: any) => {
					if (prev <= 1) {
						if (cooldownTimerRef.current) {
							window.clearInterval(cooldownTimerRef.current);
							cooldownTimerRef.current = null;
						}
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
		} catch (e: any) {
			setError(e?.response?.data?.message || "Failed to send code");
		} finally {
			setLoading(false);
		}
	};

	const onUpdatePassword = async () => {
		setError("");
		setSuccess("");
		const parsed = passwordSchema.safeParse(newPassword);
		if (!parsed.success) {
			const message = parsed.error.issues
				.map((e: ZodIssue) => e.message)
				.join(" ");
			setError(message);
			return;
		}
		if (newPassword !== confirmPassword) {
			setError("Passwords do not match.");
			return;
		}
		try {
			setLoading(true);
			await resetPassword({ email, code, newPassword });
			setSuccess("Password updated successfully.");
			setShowReset(false);
		} catch (e: any) {
			setError(e?.response?.data?.message || "Failed to reset password");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={showReset} onOpenChange={(open) => setShowReset(open)}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Reset your password</DialogTitle>
					<DialogDescription>
						{step === 1 && `Enter the 6-digit code sent to ${email}.`}
						{step === 2 && "Choose a strong new password (8+ characters)."}
					</DialogDescription>
				</DialogHeader>

				{error && <div className="text-red-500 text-sm">{error}</div>}
				{success && <div className="text-green-500 text-sm">{success}</div>}

				{step === 1 && (
					<div className="grid gap-3">
						<OTPInput length={6} value={code} onChange={setCode} />
						<div className="flex gap-2 justify-center items-center">
							<Button
								variant="outline"
								onClick={onSendOrResend}
								disabled={loading || cooldown > 0}
							>
								{cooldown > 0
									? `Resend in ${cooldown}s`
									: codeSent
										? "Resend code"
										: "Send code"}
							</Button>
						</div>
					</div>
				)}

				{step === 2 && (
					<div className="grid gap-2">
						<label className="text-sm">New password</label>
						<input
							type="password"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							placeholder="••••••••"
							className="h-10 rounded-md border px-3 bg-transparent"
						/>
						<label className="text-sm">Confirm password</label>
						<input
							type="password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							placeholder="••••••••"
							className="h-10 rounded-md border px-3 bg-transparent"
						/>
					</div>
				)}

				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">Cancel</Button>
					</DialogClose>
					{step === 1 && (
						<Button onClick={onVerifyCode} disabled={loading || !codeSent}>
							{loading ? "Verifying..." : "Verify"}
						</Button>
					)}
					{step === 2 && (
						<Button onClick={onUpdatePassword} disabled={loading}>
							{loading ? "Updating..." : "Update password"}
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
