/* eslint-disable @typescript-eslint/no-explicit-any */
import { CancelButton } from "@/components/custom/ActionButton/CancelButton";
import { SaveButton } from "@/components/custom/ActionButton/SaveButton";
import {
	Input,
	Label,
} from "@/components/custom/SettingsItems/SettingsItems.styled";
import { DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";

function ChangePasswordContent({ onCancel, onConfirm, loading }: any) {
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirm, setConfirm] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = () => {
		if (!newPassword || newPassword.length < 8) {
			setError("Password must be at least 8 characters");
			return;
		}
		if (newPassword !== confirm) {
			setError("New passwords do not match");
			return;
		}
		onConfirm(currentPassword, newPassword);
	};

	return (
		<>
			<div style={{ marginTop: 8 }}>
				<Label>Current password</Label>
				<Input
					value={currentPassword}
					onChange={(e: any) => setCurrentPassword(e.target.value)}
					type="password"
				/>
			</div>
			<div style={{ marginTop: 8 }}>
				<Label>New password</Label>
				<Input
					value={newPassword}
					onChange={(e: any) => setNewPassword(e.target.value)}
					type="password"
				/>
			</div>
			<div style={{ marginTop: 8 }}>
				<Label>Confirm new password</Label>
				<Input
					value={confirm}
					onChange={(e: any) => setConfirm(e.target.value)}
					type="password"
				/>
			</div>
			{error && (
				<div style={{ color: "var(--danger, #dc2626)", marginTop: 8 }}>
					{error}
				</div>
			)}

			<DialogFooter
				style={{
					display: "flex",
					justifyContent: "flex-end",
					gap: 8,
					marginTop: 18,
				}}
			>
				<CancelButton onClick={onCancel}>Cancel</CancelButton>
				<SaveButton onClick={handleSubmit} disabled={loading}>
					{loading ? "Saving..." : "Change Password"}
				</SaveButton>
			</DialogFooter>
		</>
	);
}
export default ChangePasswordContent;
