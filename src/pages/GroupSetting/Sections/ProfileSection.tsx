/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback, useRef } from "react";
import {
	AvatarControls,
	AvatarImg,
	AvatarPreviewBox,
	AvatarRow,
	DescripSection,
	ErrorText,
	Field,
	FileInputWrapper,
	Form,
	NoAvatar,
	Note,
	SectionWrapper,
	SmallButton,
	StyledInput,
	StyledTextarea,
	TitleArea,
	TitleSection,
} from "../GroupSetting.styled";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateGroup } from "@/services/groupAPI";
import { get } from "@/services/apiCaller";
import { useForm } from "react-hook-form";
import { useParams } from "@tanstack/react-router";
import AlertContainer, {
	showGlobalAlert,
} from "@/components/custom/AlertCustom/Alert";
import FloatingCard, {
	Action,
} from "@/components/custom/FloatingCardSetting/FloatingCard";
import { Save } from "lucide-react";

// Upload APIs (adjust path if needed)
import {
	getUploadSignature,
	directUploadWithSignature,
	saveDirectUpload,
} from "@/services/upload/upload.api";
import type { UploadResult } from "@/services/upload/upload.type";

type AddGroupFormValues = {
	name: string;
	description?: string;
	privacy: "public" | "private";
	avatar?: File | null;
};

type ProfileSectionProps = {
	canEdit?: boolean;
};

export default function ProfileSection({
	canEdit = true,
}: ProfileSectionProps) {
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
	const [avatarFile, setAvatarFile] = useState<File | null>(null);
	const params = useParams({ strict: false }) as { groupId?: string };
	const groupId = params.groupId;

	// Lưu giá trị gốc của form (để reset về đúng giá trị server trả về)
	const initialFormRef = useRef<AddGroupFormValues | null>(null);
	const initialAvatarRef = useRef<string | null>(null);

	const {
		register,
		handleSubmit,
		setValue,
		reset,
		formState: { errors, isSubmitting, isDirty },
	} = useForm<AddGroupFormValues>({
		defaultValues: {
			name: "",
			description: "",
			privacy: "public",
			avatar: null,
		},
	});

	const handleAvatarChange = useCallback(
		(file?: File | null) => {
			if (!canEdit) return;
			if (!file) {
				setAvatarFile(null);
				setAvatarPreview(null);
				setValue("avatar", null, { shouldDirty: true });
				return;
			}

			if (!file.type.startsWith("image/")) {
				alert("Only image files are accepted.");
				return;
			}
			if (file.size > 5 * 1024 * 1024) {
				alert("Maximum file size is 5MB.");
				return;
			}

			setAvatarFile(file);
			setValue("avatar", file, { shouldDirty: true });

			const reader = new FileReader();
			reader.onload = () => setAvatarPreview(reader.result as string);
			reader.readAsDataURL(file);
		},
		[setValue, canEdit],
	);

	// upload progress / error states
	const [avatarUploadProgress, setAvatarUploadProgress] = useState<
		number | null
	>(null);
	const [avatarUploadError, setAvatarUploadError] = useState<string | null>(
		null,
	);

	useEffect(() => {
		// fetch group details when mounted
		const fetchGroup = async () => {
			if (!groupId) return;
			try {
				const res = await get(`/api/group/${groupId}`);
				const payload = (res && (res.data ?? res)) as any;

				// Lưu giá trị ban đầu vào initialFormRef
				const initial: AddGroupFormValues = {
					name: payload.name ?? "",
					description: payload.description ?? "",
					privacy: "public",
					avatar: null,
				};
				initialFormRef.current = initial;

				// set form fields to initial (không mark dirty)
				reset(initial, { keepDefaultValues: true });

				// handle avatar: API might return a full data URL, absolute URL, or raw base64 string
				if (payload.avatar) {
					let src = payload.avatar as string;
					if (!src.startsWith("data:") && !/^https?:\/\//i.test(src)) {
						// assume it's base64 without data: prefix
						src = `data:image/*;base64,${src}`;
					}
					setAvatarPreview(src);
					initialAvatarRef.current = src; // save initial preview for reset
				} else {
					setAvatarPreview(null);
					initialAvatarRef.current = null;
				}

				// clear avatarFile and ensure form not dirty initially
				setAvatarFile(null);
			} catch (err: any) {
				console.error("Failed to fetch group:", err);
				showGlobalAlert({
					type: "warning",
					message: "Failed to load group data",
				});
			}
		};

		fetchGroup();
	}, [groupId, reset]);

	const onSubmit = async (data: AddGroupFormValues) => {
		if (!canEdit) return;
		if (!groupId) {
			alert("Missing group id");
			return;
		}

		try {
			setAvatarUploadError(null);
			setAvatarUploadProgress(null);

			let avatarUrl: string | null = null;

			if (avatarFile) {
				const suggestedPublicId = `${groupId}_avatar_${Date.now()}`;

				// 1) fetch upload signature from backend
				const sig = await getUploadSignature({
					folder: "groups/avatars",
					publicId: suggestedPublicId,
				});

				// 2) upload with progress
				const { upload: uploadRes, delivery } =
					(await directUploadWithSignature({
						file: avatarFile,
						signature: sig,
						onProgress: ({ progress }) => {
							setAvatarUploadProgress(Math.round(progress));
						},
						generateDelivery: false,
					})) as { upload: UploadResult; delivery?: { url: string } };

				if (!uploadRes) {
					throw new Error("Upload failed: no upload result returned");
				}

				avatarUrl = uploadRes.secure_url ?? delivery?.url ?? null;

				// Optional: persist metadata to your server
				await saveDirectUpload(uploadRes);

				// ensure progress shows 100
				setAvatarUploadProgress(100);
			} else {
				if (avatarPreview && initialAvatarRef.current === avatarPreview) {
					avatarUrl = initialAvatarRef.current;
				} else if (avatarPreview && avatarPreview.startsWith("data:")) {
					avatarUrl = avatarPreview;
				} else {
					avatarUrl = avatarPreview ?? null;
				}
			}

			// Build payload and call updateGroup
			const payload = {
				name: data.name,
				description: data.description ?? null,
				avatar: avatarUrl,
			};

			const updated = await updateGroup(groupId, payload);

			// success feedback
			showGlobalAlert({ type: "success", message: "Group saved successfully" });

			// Sau khi lưu thành công: cập nhật initialFormRef và initialAvatarRef về giá trị vừa lưu
			const newInitial: AddGroupFormValues = {
				name: data.name,
				description: data.description ?? "",
				privacy: "public",
				avatar: null,
			};
			initialFormRef.current = newInitial;

			// reset form to the new values and clear dirty state
			reset(newInitial, { keepDefaultValues: true });

			setAvatarFile(null);

			// if backend returned an avatar URL/base64, update preview and initial ref
			const createdObj = updated && ((updated.data ?? updated) as any);
			if (createdObj && createdObj.avatar) {
				let src = createdObj.avatar as string;
				if (!src.startsWith("data:") && !/^https?:\/\//i.test(src)) {
					src = `data:image/*;base64,${src}`;
				}
				setAvatarPreview(src);
				initialAvatarRef.current = src;
			} else {
				// if backend didn't return new avatar, but we used avatarUrl from upload (which is an absolute URL),
				// prefer setting preview to that absolute URL so UI shows uploaded image
				if (avatarUrl && /^https?:\/\//i.test(avatarUrl)) {
					setAvatarPreview(avatarUrl);
					initialAvatarRef.current = avatarUrl;
				} else if (avatarUrl === null) {
					// user removed avatar -> reflect removal in initial
					setAvatarPreview(null);
					initialAvatarRef.current = null;
				}
			}

			// clear upload states
			setAvatarUploadProgress(null);
			setAvatarUploadError(null);
		} catch (err: any) {
			console.error("Update group failed:", err);
			const message =
				err?.response?.data?.message ||
				err?.message ||
				JSON.stringify(err, Object.getOwnPropertyNames(err));

			// If upload-specific error, set avatarUploadError for display
			if (
				String(message).toLowerCase().includes("upload") ||
				String(message).toLowerCase().includes("cloud")
			) {
				setAvatarUploadError(String(message));
			}

			showGlobalAlert({
				type: "error",
				message: `Save failed: ${String(message)}`,
			});

			// keep progress visible as failed (optional)
			setAvatarUploadProgress(null);
		}
	};

	const handleReset = useCallback(() => {
		if (!canEdit) return;
		// Nếu có initialFormRef thì reset về giá trị đó; không có thì không làm gì
		if (initialFormRef.current) {
			reset(initialFormRef.current, { keepDefaultValues: true });
		} else {
			// Fallback: reset to default values provided to useForm
			reset(undefined, { keepDefaultValues: true });
		}

		// restore avatar preview to original (server) value
		setAvatarFile(null);
		setAvatarPreview(initialAvatarRef.current ?? null);

		// clear upload UI states
		setAvatarUploadProgress(null);
		setAvatarUploadError(null);
	}, [reset, canEdit]);

	const actions: Action[] = canEdit
		? [
				{
					key: "reset",
					label: "Reset",
					variant: "link",
					onClick: handleReset,
					ariaLabel: "Reset changes",
				},
				{
					key: "save",
					label: isSubmitting ? "Saving..." : "Save Changes",
					variant: "primary",
					onClick: handleSubmit(onSubmit),
					disabled: !isDirty || isSubmitting,
				},
			]
		: [];

	return (
		<SectionWrapper>
			<AlertContainer />

			<TitleArea>
				<TitleSection>Server Profile</TitleSection>
				<DescripSection>
					{canEdit
						? "Update your group details and branding."
						: "Viewing only. Contact the group owner to make changes."}
				</DescripSection>
			</TitleArea>

			{/* Form submission still works via onSubmit + handleSubmit, but Save button calls handleSubmit as well */}
			<Form onSubmit={handleSubmit(onSubmit)}>
				{/* Avatar upload */}
				<AvatarRow>
					<AvatarPreviewBox>
						{avatarPreview ? (
							<AvatarImg src={avatarPreview} alt="avatar preview" />
						) : (
							<NoAvatar>
								<div style={{ fontWeight: 600 }}>No Avatar</div>
								<div
									style={{
										fontSize: "12px",
										color: "var(--muted-foreground, #6b7280)",
									}}
								>
									Preview
								</div>
							</NoAvatar>
						)}
					</AvatarPreviewBox>

					<AvatarControls>
						<Label>Group Avatar</Label>
						<FileInputWrapper>
							<Input
								type="file"
								accept="image/*"
								disabled={!canEdit}
								onChange={(e) => {
									const file = e.target.files?.[0];
									handleAvatarChange(file ?? null);
								}}
							/>
							<Note>Maximum size 5MB.</Note>
						</FileInputWrapper>

						{avatarPreview && canEdit && (
							<SmallButton
								type="button"
								onClick={() => handleAvatarChange(null)}
							>
								Remove image
							</SmallButton>
						)}

						{/* Upload progress bar */}
						{avatarUploadProgress !== null && (
							<div style={{ width: "100%", marginTop: 8 }}>
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

						{avatarUploadError && (
							<ErrorText style={{ marginTop: 8 }}>
								{avatarUploadError}
							</ErrorText>
						)}
					</AvatarControls>
				</AvatarRow>

				{/* Name */}
				<Field>
					<Label htmlFor="name">Group name</Label>
					<StyledInput
						id="name"
						placeholder="e.g.: Frontend Team"
						disabled={!canEdit}
						{...register("name", {
							required: "Group name is required",
							maxLength: { value: 100, message: "Maximum 100 characters" },
						})}
					/>
					{errors.name && <ErrorText>{errors.name.message}</ErrorText>}
				</Field>

				{/* Description */}
				<Field>
					<Label htmlFor="description">Description</Label>
					<StyledTextarea
						id="description"
						placeholder="Short description of the group..."
						disabled={!canEdit}
						{...register("description")}
					/>
				</Field>

				{/* Floating card (mặc định luôn hiển thị). Buttons gọi handler ở parent */}
				<FloatingCard
					message={
						canEdit ? (
							<div>
								<strong>Careful</strong> — you have unsaved changes!
							</div>
						) : (
							<div>Viewing only. Editing is limited to the group owner.</div>
						)
					}
					actions={actions}
					icon={<Save size={18} />}
				/>
			</Form>
		</SectionWrapper>
	);
}
