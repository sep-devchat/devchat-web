/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from "react";
import { KeyIcon, Lock, Save, Trash } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../../Setting.styled";
import AccountForm from "@/components/custom/SettingsItems/AccountForm";
import SettingItemButton from "@/components/custom/SettingsItems/SettingItemButton";
import { fetchProfile } from "@/services/auth/authAPI";
import { Profile } from "@/services/auth/auth.type";
import FloatingCard from "@/components/custom/FloatingCardSetting/FloatingCard";
import { deleteUser, updateUser } from "@/services/userAPI";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import EmailModalContent from "./ChangeEmail";
import ChangePasswordContent from "./ChangePassword";
import {
	Input,
	Label,
} from "@/components/custom/SettingsItems/SettingsItems.styled";
import { CancelButton } from "@/components/custom/ActionButton/CancelButton";
import { DeleteButton } from "@/components/custom/ActionButton/DeleteButton";

type AlertType = "success" | "warning" | "error";
const fireAlert = (type: AlertType, message: string, duration = 4000) => {
	if (typeof window === "undefined") return;
	window.dispatchEvent(
		new CustomEvent("app:alert", { detail: { type, message, duration } }),
	);
};

const AccountSettings: React.FC = () => {
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

	// fetch profile
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

	return (
		<>
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
								onClick: () => {
									if (isGoogleSSO) {
										fireAlert(
											"warning",
											"Vì bạn đăng nhập bằng Google nên không thể đổi mật khẩu",
										);
										return;
									}
									setIsPasswordModalOpen(true);
								},
								disabled: isGoogleSSO,
								title: isGoogleSSO
									? "Vì bạn đăng nhập bằng Google nên không thể đổi mật khẩu"
									: "Change password",
							},
						]}
					/>

					<SettingItemButton
						icon={<Lock />}
						title="Account Removal"
						description="Disabling your account means you can recover it at any time after taking this action."
						buttons={[
							// {
							//   text: "Disable Account",
							//   variant: "danger",
							//   onClick: () => {
							//     fireAlert("warning", "Disable account not implemented");
							//   },
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
		</>
	);
};

export default AccountSettings;
