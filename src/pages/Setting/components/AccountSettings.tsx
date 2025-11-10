import React, { useEffect, useRef, useState } from "react";
import { KeyIcon, Lock } from "lucide-react";
import AccountForm from "@/components/custom/SettingsItems/AccountForm";
import SettingItemButton from "@/components/custom/SettingsItems/SettingItemButton";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../Setting.styled";
import OTPInput from "@/components/custom/OTPInput/OTPInput";
import {
	confirmResetCode,
	resetPassword,
	sendResetCode,
} from "@/services/auth/authAPI";
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
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { z, type ZodIssue } from "zod";

export const AccountSettings: React.FC = () => {
	// Inline reset password flow state
	const [showReset, setShowReset] = useState(false);
	const [step, setStep] = useState<1 | 2>(1); // code step, then new password
	const [email, setEmail] = useState("");
	const [code, setCode] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string>("");
	const [success, setSuccess] = useState<string>("");
	const [cooldown, setCooldown] = useState<number>(0); // seconds remaining
	const [codeSent, setCodeSent] = useState<boolean>(false);
	const cooldownTimerRef = useRef<number | null>(null);

	// Email validation no longer needed (email sourced from profile)

	const profile = useSelector((state: RootState) => state.user.profile);

	const startFlow = async () => {
		setShowReset(true);
		setCode("");
		setNewPassword("");
		setConfirmPassword("");
		setLoading(false);
		setError("");
		setSuccess("");
		setCooldown(0);
		setCodeSent(false);
		// Auto use current user email
		const userEmail = profile?.email || "";
		setEmail(userEmail);
		if (!userEmail) {
			setError("No email found on your profile.");
			return;
		}
		setStep(1);
	};

	// onSendCode removed; code is auto-sent when dialog opens

	// Zod password schema: 8+ chars with at least 1 number, 1 uppercase, and 1 special character
	const passwordSchema = z
		.string()
		.min(8, "Password must be at least 8 characters.")
		.regex(/[A-Z]/, "Password must include at least one uppercase letter.")
		.regex(/\d/, "Password must include at least one number.")
		.regex(
			/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/,
			"Password must include at least one special character.",
		);

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
			// Start countdown
			if (cooldownTimerRef.current) {
				window.clearInterval(cooldownTimerRef.current);
			}
			cooldownTimerRef.current = window.setInterval(() => {
				setCooldown((prev) => {
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

	// Cleanup cooldown timer when dialog closes or on unmount
	useEffect(() => {
		if (!showReset && cooldownTimerRef.current) {
			window.clearInterval(cooldownTimerRef.current);
			cooldownTimerRef.current = null;
			setCooldown(0);
		}
		return () => {
			if (cooldownTimerRef.current) {
				window.clearInterval(cooldownTimerRef.current);
				cooldownTimerRef.current = null;
			}
		};
	}, [showReset]);

	const onUpdatePassword = async () => {
		setError("");
		setSuccess("");
		// Validate password via Zod schema
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
		<Card>
			<CardHeader>
				<CardTitle>Welcome, Amanda</CardTitle>
				<CardDescription>Wed, 27 August 2025</CardDescription>
			</CardHeader>
			<CardContent>
				<AccountForm />
				<SettingItemButton
					icon={<KeyIcon />}
					title="Password and Authentication"
					description="You must verify your account before you can enable two-factor authentication."
					buttons={[
						{ text: "Change password", variant: "primary", onClick: startFlow },
					]}
				/>

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
							{/* Initial send handled automatically; no step 0 button now */}
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
				<SettingItemButton
					icon={<Lock />}
					title="Account Removal"
					description="Disabling your account means you can recover it at any time after taking this action."
					buttons={[
						{
							text: "Disable Account",
							variant: "danger",
							onClick: () => console.log("Disable account clicked"),
						},
						{
							text: "Delete Account",
							variant: "outline-danger",
							onClick: () => console.log("Delete account clicked"),
						},
					]}
				/>
			</CardContent>
		</Card>
	);
};

export default AccountSettings;
