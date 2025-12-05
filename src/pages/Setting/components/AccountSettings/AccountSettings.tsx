/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
	KeyIcon,
	// Lock,
	Save,
	Trash,
} from "lucide-react";
import AccountForm from "@/components/custom/SettingsItems/AccountForm";
import SettingItemButton from "@/components/custom/SettingsItems/SettingItemButton";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../../Setting.styled";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { DeleteButton } from "@/components/custom/ActionButton/DeleteButton";
import { CancelButton } from "@/components/custom/ActionButton/CancelButton";
import {
	Input,
	Label,
} from "@/components/custom/SettingsItems/SettingsItems.styled";
import FloatingCard from "@/components/custom/FloatingCardSetting/FloatingCard";
import EmailModalContent from "@/components/custom/SettingsItems/ChangeEmail";
import ChangePasswordContent from "@/components/custom/SettingsItems/ChangePassword";
import { useAccountSettings } from "./useAccountSettings";
import { ProgrammingLanguagesSection } from "./ProgrammingLanguagesSection";
import { ResetPasswordDialog } from "./ResetPasswordDialog";

export const AccountSettings: React.FC = () => {
	const {
		// Reset password flow state
		showReset,
		setShowReset,
		step,
		setStep,
		email,
		setEmail,
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
		// Form state
		original,
		form,
		isDirty,
		isSubmitting,
		resetKey,
		// Modal state
		isEmailModalOpen,
		setIsEmailModalOpen,
		isPasswordModalOpen,
		setIsPasswordModalOpen,
		isDeleteOpen,
		setIsDeleteOpen,
		deleteConfirmText,
		setDeleteConfirmText,
		isDeleting,
		// Languages state
		userLanguages,
		newLanguageForms,
		editingLanguageId,
		// Handlers
		handleFormChange,
		handleSave,
		handleChangeEmail,
		handleChangePassword,
		handleDeleteAccount,
		startFlow,
		isGoogleSSO,
		// Language handlers
		handleAddLanguage,
		handleRemoveNewLanguageForm,
		handleNewLanguageChange,
		handleEditLanguage,
		handleCancelEditLanguage,
		handleLanguageDraftChange,
		handleDeleteLanguage,
		getAvailableLanguages,
		getUsedOrderIndexes,
		getMaxOrderIndex,
		handleCancelFloatingCard,
		handleAvatarChange,
		avatarUploadProgress,
	} = useAccountSettings();

	if (!form) {
		return <div style={{ padding: 16 }}>Loading account...</div>;
	}

	const actions = [
		{
			key: "reset",
			label: "Reset",
			variant: "link" as const,
			onClick: handleCancelFloatingCard,
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
						onAvatarChange={handleAvatarChange}
					/>

					{avatarUploadProgress !== null && (
						<div style={{ padding: "0 24px 16px", width: "100%" }}>
							<div style={{ fontSize: 12, marginBottom: 6 }}>
								Uploading avatar: {avatarUploadProgress}%
							</div>
							<div
								style={{
									width: "100%",
									background: "#e5e7eb",
									height: 8,
									borderRadius: 4,
									overflow: "hidden",
								}}
							>
								<div
									style={{
										height: "100%",
										width: `${avatarUploadProgress}%`,
										transition: "width 200ms linear",
										background: "#3b82f6",
									}}
								/>
							</div>
						</div>
					)}

					<SettingItemButton
						icon={<KeyIcon />}
						title="Password and Authentication"
						description="You must verify your account before you can enable two-factor authentication."
						buttons={[
							{
								text: "Change password",
								variant: "primary",
								onClick: startFlow,
							},
						]}
					/>

					<ResetPasswordDialog
						showReset={showReset}
						setShowReset={setShowReset}
						step={step}
						setStep={setStep}
						email={email}
						setEmail={setEmail}
						code={code}
						setCode={setCode}
						newPassword={newPassword}
						setNewPassword={setNewPassword}
						confirmPassword={confirmPassword}
						setConfirmPassword={setConfirmPassword}
						loading={loading}
						setLoading={setLoading}
						error={error}
						setError={setError}
						success={success}
						setSuccess={setSuccess}
						cooldown={cooldown}
						setCooldown={setCooldown}
						codeSent={codeSent}
						setCodeSent={setCodeSent}
						cooldownTimerRef={cooldownTimerRef}
					/>

					<ProgrammingLanguagesSection
						userLanguages={userLanguages}
						newLanguageForms={newLanguageForms}
						editingLanguageId={editingLanguageId}
						handleAddLanguage={handleAddLanguage}
						handleEditLanguage={handleEditLanguage}
						handleCancelEditLanguage={handleCancelEditLanguage}
						handleLanguageDraftChange={handleLanguageDraftChange}
						handleDeleteLanguage={handleDeleteLanguage}
						handleNewLanguageChange={handleNewLanguageChange}
						handleRemoveNewLanguageForm={handleRemoveNewLanguageForm}
						getAvailableLanguages={getAvailableLanguages}
						getUsedOrderIndexes={getUsedOrderIndexes}
						getMaxOrderIndex={getMaxOrderIndex}
					/>

					{/* <SettingItemButton
						icon={<Lock />}
						title="Account Removal"
						description="Disable your account."
						buttons={[
							{
								text: "Delete Account",
								variant: "danger",
								onClick: () => setIsDeleteOpen(true),
							},
						]}
					/> */}
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
