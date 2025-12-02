/* eslint-disable @typescript-eslint/no-explicit-any */
import { CancelButton } from "@/components/custom/ActionButton/CancelButton";
import { SaveButton } from "@/components/custom/ActionButton/SaveButton";
import {
	Input,
	Label,
} from "@/components/custom/SettingsItems/SettingsItems.styled";
import { DialogFooter } from "@/components/ui/dialog";
import { useEffect, useState } from "react";

function EmailModalContent({
	initialEmail,
	onCancel,
	onConfirm,
	loading,
}: any) {
	const [email, setEmail] = useState(initialEmail || "");
	const [error, setError] = useState("");

	useEffect(() => setEmail(initialEmail || ""), [initialEmail]);

	const handleSubmit = () => {
		if (!email || !email.includes("@")) {
			setError("Enter a valid email");
			return;
		}
		onConfirm(email);
	};

	return (
		<>
			<div style={{ marginTop: 8 }}>
				<Label>New Email</Label>
				<Input value={email} onChange={(e: any) => setEmail(e.target.value)} />
				{error && (
					<div style={{ color: "var(--danger, #dc2626)", marginTop: 6 }}>
						{error}
					</div>
				)}
			</div>

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
					{loading ? "Saving..." : "Save"}
				</SaveButton>
			</DialogFooter>
		</>
	);
}
export default EmailModalContent;
