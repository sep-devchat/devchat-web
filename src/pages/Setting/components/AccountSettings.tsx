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

	const [original, setOriginal] = useState<Profile | null>(null);
	const [form, setForm] = useState<any>(null);
	const [isDirty, setIsDirty] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [resetKey, setResetKey] = useState(0); // explicit reset trigger

	// Change email/password modals
	const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
	const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

	// Delete account modal
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [deleteConfirmText, setDeleteConfirmText] = useState("");
	const [isDeleting, setIsDeleting] = useState(false);

	// Email validation no longer needed (email sourced from profile)
	const profile = useSelector((state: RootState) => state.user.profile);

	useEffect(() => {
		const init = async () => {
			try {
				const res = await fetchProfile();
				const data = res?.data ?? res;
				setOriginal(data);
				setForm(data ? { ...data } : {});
			} catch (err) {
				console.error("fetch profile failed", err);
				fireAlert("error", "Failed to load profile");
			}
		};
		init();
	}, []);

	const handleFormChange = useCallback(
		(newForm: any) => {
			setForm((prev: any) => {
				if (!prev) return newForm;
				const keys = [
					"firstName",
					"lastName",
					"username",
					"timezone",
					"email",
					"avatarUrl",
				];
				for (const k of keys) {
					if (String(prev[k] ?? "") !== String(newForm[k] ?? "")) {
						return newForm;
					}
				}
				return prev;
			});

			if (!original) {
				setIsDirty(true);
				return;
			}
			const keysToCompare = [
				"firstName",
				"lastName",
				"username",
				"timezone",
				"email",
				"avatarUrl",
			];
			const dirty = keysToCompare.some(
				(k) =>
					String((original as any)[k] ?? "") !== String(newForm?.[k] ?? ""),
			);
			setIsDirty(dirty);
		},
		[original],
	);

	const handleReset = () => {
		setResetKey((v) => v + 1);
		setForm(original ? { ...original } : {});
		setIsDirty(false);
		fireAlert("warning", "Changes reverted");
	};

	const computeDiff = (orig: any = {}, cur: any = {}) => {
		const diff: any = {};
		Object.keys(cur).forEach((k) => {
			const o = orig[k];
			const c = cur[k];
			if (String(o ?? "") !== String(c ?? "")) diff[k] = c;
		});
		return diff;
	};

	const handleSave = async () => {
		if (!original || !form) return;
		setIsSubmitting(true);
		const payload = computeDiff(original, form);
		if (Object.keys(payload).length === 0) {
			fireAlert("warning", "No changes to save");
			setIsSubmitting(false);
			return;
		}

		try {
			await updateUser(String(original.id), payload);
			const updated = { ...original, ...payload };
			setOriginal(updated as Profile);
			setForm(updated);
			setIsDirty(false);
			fireAlert("success", "Saved changes");
			setResetKey((k) => k + 1);
		} catch (err: any) {
			console.error("save failed", err);
			const message =
				err?.response?.data?.message ?? err?.message ?? "Save failed";
			fireAlert("error", String(message));
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleChangeEmail = async (newEmail: string) => {
		if (!original) return;
		try {
			setIsSubmitting(true);
			await updateUser(String(original.id), { email: newEmail });
			const updated = { ...original, email: newEmail };
			setOriginal(updated as Profile);
			setForm(updated);
			setIsDirty(false);
			setIsEmailModalOpen(false);
			fireAlert("success", "Email updated");
			setResetKey((k) => k + 1);
		} catch (err: any) {
			console.error("change email failed", err);
			fireAlert("error", "Failed to change email");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleChangePassword = async (
		// currentPassword: string,
		newPassword: string,
	) => {
		if (!original) return;
		try {
			setIsSubmitting(true);
			await updateUser(String(original.id), { password: newPassword });
			setIsPasswordModalOpen(false);
			fireAlert("success", "Password changed");
		} catch (err: any) {
			console.error("change password failed", err);
			fireAlert("error", "Failed to change password");
		} finally {
			setIsSubmitting(false);
		}
	};

	// Delete account
	const handleDeleteAccount = async () => {
		if (!original) return;
		if (deleteConfirmText !== (original.username ?? "")) return;
		setIsDeleting(true);
		try {
			await deleteUser(String(original.id));
			fireAlert("success", "Account deleted");
			setIsDeleteOpen(false);
			window.location.href = "/"; // or logout route
		} catch (err: any) {
			console.error("delete account failed", err);
			fireAlert("error", "Failed to delete account");
		} finally {
			setIsDeleting(false);
			setDeleteConfirmText("");
		}
	};

	const isGoogleSSO = React.useMemo(() => {
		if (!original) return false;
		const val = (original as any).method ?? "";
		return String(val).toLowerCase() === "google";
	}, [original]);

	if (!form) {
		return <div style={{ padding: 16 }}>Loading account...</div>;
	}

	const actions = [
		{
			key: "reset",
			label: "Reset",
			variant: "link" as const,
			onClick: handleReset,
			ariaLabel: "Reset changes",
		},
		{
			key: "save",
			label: isSubmitting ? "Saving..." : "Save Changes",
			variant: "primary" as const,
			onClick: handleSave,
			disabled: !isDirty || isSubmitting,
		},
	];


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
		<Card isDirty={isDirty}>
			<CardHeader>
				<CardTitle>
						Welcome, {original?.firstName ?? ""} {original?.lastName ?? ""}
					</CardTitle>
					<CardDescription>
						{original?.createdAt
							? new Date(original.createdAt).toLocaleString()
							: ""}
					</CardDescription>
			</CardHeader>
			<CardContent>
				<AccountForm
						initialData={form}
						resetKey={resetKey}
						onChange={handleFormChange}
						// onEditEmail={() => setIsEmailModalOpen(true)}
					/>
				
				<SettingItemButton
					icon={<KeyIcon />}
					title="Password and Authentication"
					description="You must verify your account before you can enable two-factor authentication."
					buttons={[
						{ 
							text: "Change password", 
							variant: "primary", 
							onClick: startFlow,
							// onClick: () => {
								// 	if (isGoogleSSO) {
								// 		fireAlert(
								// 			"warning",
								// 			"Vì bạn đăng nhập bằng Google nên không thể đổi mật khẩu",
								// 		);
								// 		return;
								// 	}
								// 	setIsPasswordModalOpen(true);
								// },
						},
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
						// {
						// 	text: "Disable Account",
						// 	variant: "danger",
						// 	onClick: () => console.log("Disable account clicked"),
						// },
						{
							text: "Delete Account",
							variant: "danger",
							onClick: () => setIsDeleteOpen(true),
						},
					]}
				/>
			</CardContent>
		</Card>

		{isDirty && (
				<FloatingCard
					message={
						<div>
							<strong>Unsaved changes</strong> — You have unsaved profile
							changes
						</div>
					}
					actions={actions}
					icon={<Save size={18} />}
				/>
			)}

			<Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Change Email</DialogTitle>
						<DialogDescription>
							Enter a new email to update your account.
						</DialogDescription>
					</DialogHeader>

					<EmailModalContent
						initialEmail={original?.email ?? ""}
						onCancel={() => setIsEmailModalOpen(false)}
						onConfirm={handleChangeEmail}
						loading={isSubmitting}
					/>
				</DialogContent>
			</Dialog>

			<Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Change Password</DialogTitle>
						<DialogDescription>
							Enter your current password and a new password.
						</DialogDescription>
					</DialogHeader>

					<ChangePasswordContent
						onCancel={() => setIsPasswordModalOpen(false)}
						onConfirm={handleChangePassword}
						loading={isSubmitting}
						isSso={isGoogleSSO}
						storedPassword={(original as any)?.password ?? undefined}
					/>
				</DialogContent>
			</Dialog>

			<Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Delete Account</DialogTitle>
						<DialogDescription>
							This action is irreversible. Type your <strong>username</strong>{" "}
							to confirm.
						</DialogDescription>
					</DialogHeader>

					<div style={{ marginTop: 12 }}>
						<Label>Enter username</Label>
						<Input
							value={deleteConfirmText}
							onChange={(e: any) => setDeleteConfirmText(e.target.value)}
							placeholder={original?.username ?? "Username"}
							style={{ marginTop: 8 }}
						/>
					</div>

					<DialogFooter
						style={{
							display: "flex",
							justifyContent: "flex-end",
							gap: 8,
							marginTop: 18,
						}}
					>
						<DialogClose asChild>
							<CancelButton onClick={() => setIsDeleteOpen(false)}>
								Cancel
							</CancelButton>
						</DialogClose>

						<DeleteButton
							onClick={handleDeleteAccount}
							disabled={
								isDeleting || deleteConfirmText !== (original?.username ?? "")
							}
						>
							{isDeleting ? (
								"Deleting..."
							) : (
								<span
									style={{
										display: "inline-flex",
										alignItems: "center",
										gap: 8,
									}}
								>
									<Trash size={16} /> Delete Account
								</span>
							)}
						</DeleteButton>
					</DialogFooter>
				</DialogContent>
			</Dialog>
	);
};

export default AccountSettings;
