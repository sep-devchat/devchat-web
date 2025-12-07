/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import {
	Avatar,
	AvatarOverlay,
	AvatarUploadInput,
	FormContainer,
	FormContent,
	FormGroup,
	FormRow,
	Input,
	Label,
	ProfileDetails,
	ProfileEmail,
	ProfileHeader,
	ProfileInfo,
	ProfileName,
	SelectAccount,
} from "./SettingsItems.styled";
import { Profile } from "@/services/auth/auth.type";
import { resendVerifyEmail } from "@/services/auth/authAPI";
import { AvatarImg, NoAvatar } from "@/pages/Setting/Setting.styled";
import { InfoButton } from "../ActionButton/InfoButton";
import { toast } from "sonner";
import { Upload } from "lucide-react";

interface AccountFormProps {
	initialData?: Profile | any;
	resetKey?: number;
	onChange?: (data: any) => void;
	onEditEmail?: () => void;
	onEditPassword?: () => void;
	onAvatarChange?: (file: File) => void;
	errors?: { firstName?: string; lastName?: string };
}

const AccountForm: React.FC<AccountFormProps> = ({
	initialData = {},
	resetKey = 0,
	onChange,
	onAvatarChange,
	errors = {},
}) => {
	const [local, setLocal] = useState<any>({ ...initialData });
	const [isSendingVerify, setIsSendingVerify] = useState(false);
	const mountedRef = useRef(false);
	const skipOnChangeRef = useRef(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		setLocal({ ...initialData });
		mountedRef.current = true;
	}, []);

	useEffect(() => {
		skipOnChangeRef.current = true;
		setLocal({ ...initialData });
	}, [resetKey]);

	useEffect(() => {
		if (!mountedRef.current) return;
		if (skipOnChangeRef.current) {
			skipOnChangeRef.current = false;
			return;
		}
		if (onChange) onChange(local);
	}, [local, onChange]);

	const handleInputChange = (field: string, value: string) => {
		setLocal((prev: any) => ({ ...prev, [field]: value }));
	};

	const handleAvatarClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (!file.type.startsWith("image/")) {
			toast.error("Only image files are accepted");
			return;
		}
		if (file.size > 5 * 1024 * 1024) {
			toast.error("Maximum file size is 5MB");
			return;
		}

		// Preview locally
		const reader = new FileReader();
		reader.onload = () => {
			setLocal((prev: any) => ({
				...prev,
				avatarUrl: reader.result as string,
			}));
		};
		reader.readAsDataURL(file);

		// Notify parent
		if (onAvatarChange) {
			onAvatarChange(file);
		}
	};

	//   const handleEditEmailClick = () => {
	//     if (onEditEmail) onEditEmail();
	//   };

	//   const handleEditPasswordClick = () => {
	//     if (onEditPassword) onEditPassword();
	//   };

	return (
		<FormContainer>
			<ProfileHeader>
				<ProfileInfo>
					<Avatar onClick={handleAvatarClick}>
						{local?.avatarUrl ? (
							<AvatarImg src={local.avatarUrl} alt="avatar preview" />
						) : (
							<NoAvatar>
								{(local?.firstName ?? "")?.charAt(0)}
								{(local?.lastName ?? "")?.charAt(0)}
							</NoAvatar>
						)}
						<AvatarOverlay>
							<Upload size={16} />
							<span>Upload</span>
						</AvatarOverlay>
					</Avatar>
					<AvatarUploadInput
						ref={fileInputRef}
						type="file"
						accept="image/*"
						onChange={handleFileChange}
					/>
					<ProfileDetails>
						<ProfileName>{local?.username}</ProfileName>
						<ProfileEmail>{local?.email}</ProfileEmail>
					</ProfileDetails>
				</ProfileInfo>
				{!local.emailVerified ? (
					<InfoButton
						onClick={async () => {
							if (!local?.email) {
								window.dispatchEvent(
									new CustomEvent("app:alert", {
										detail: {
											type: "warning",
											message: "No email available to verify",
											duration: 4000,
										},
									}),
								);
								return;
							}

							try {
								setIsSendingVerify(true);
								const res = await resendVerifyEmail({
									email: String(local.email),
								});

								toast.success(
									res?.message || "Verification email sent successfully",
								);
							} catch {
								toast.error("Failed to send verification email");
							} finally {
								setIsSendingVerify(false);
							}
						}}
						disabled={isSendingVerify}
					>
						{isSendingVerify ? "Sending..." : "Verify email"}
					</InfoButton>
				) : null}
			</ProfileHeader>

			<FormContent>
				<FormRow>
					<FormGroup>
						<Label>First Name</Label>
						<Input
							type="text"
							value={local?.firstName ?? ""}
							onChange={(e: any) =>
								handleInputChange("firstName", e.target.value)
							}
							placeholder="Enter first name"
						/>
						{errors.firstName ? (
							<div style={{ color: "#ef4444", fontSize: 12, marginTop: 6 }}>
								{errors.firstName}
							</div>
						) : null}
					</FormGroup>

					<FormGroup>
						<Label>Last Name</Label>
						<Input
							type="text"
							value={local?.lastName ?? ""}
							onChange={(e: any) =>
								handleInputChange("lastName", e.target.value)
							}
							placeholder="Enter last name"
						/>
						{errors.lastName ? (
							<div style={{ color: "#ef4444", fontSize: 12, marginTop: 6 }}>
								{errors.lastName}
							</div>
						) : null}
					</FormGroup>
				</FormRow>

				<FormRow>
					<FormGroup>
						<Label>Username</Label>
						<Input
							type="text"
							value={local?.username ?? ""}
							onChange={(e: any) =>
								handleInputChange("username", e.target.value)
							}
							placeholder="Enter username"
							disabled
						/>
					</FormGroup>

					<FormGroup>
						<Label>Timezone</Label>
						<SelectAccount
							value={local?.timezone ?? ""}
							onChange={(e: any) =>
								handleInputChange("timezone", e.target.value)
							}
						>
							<option value="Viet Nam">Viet Nam</option>
							<option value="United States">United States</option>
							<option value="United Kingdom">United Kingdom</option>
							<option value="Japan">Japan</option>
							<option value="South Korea">South Korea</option>
							<option value="Singapore">Singapore</option>
							<option value="Thailand">Thailand</option>
							<option value="Malaysia">Malaysia</option>
						</SelectAccount>
					</FormGroup>
				</FormRow>

				{/* <EmailSection>
          <EmailSectionTitle>My email Address</EmailSectionTitle>
          <EmailItem>
            <EmailIcon>
              <Mail size={24} />
            </EmailIcon>
            <EmailDetails>
              <EmailAddress>{local?.email}</EmailAddress>
            </EmailDetails>
          </EmailItem>
          <AddEmailButton onClick={handleEditEmailClick}>Add email address</AddEmailButton>
        </EmailSection> */}
			</FormContent>
		</FormContainer>
	);
};

export default AccountForm;
