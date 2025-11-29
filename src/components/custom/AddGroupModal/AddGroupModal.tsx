/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { createGroup } from "@/services/groupAPI";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	AvatarControls,
	AvatarImg,
	AvatarPreviewBox,
	AvatarRow,
	CancelButton,
	DialogContentWrapper,
	ErrorText,
	Field,
	FileInputWrapper,
	Footer,
	Form,
	NoAvatar,
	Note,
	SmallButton,
	StyledDialogOverlay,
	StyledInput,
	StyledTextarea,
	SubmitButton,
} from "./AddGroupModal.styled";
import { DialogPortal } from "@radix-ui/react-dialog";
import type { GroupResponse } from "@/services/groupAPI";
import {
	directUploadWithSignature,
	getUploadSignature,
} from "@/services/upload/upload.api";
import { UploadResult } from "@/services/upload/upload.type";

type AddGroupFormValues = {
	name: string;
	description?: string;
	privacy: "public" | "private";
	avatar?: File | null;
};

type Props = {
	onCreate?: (
		created: { id: string; name: string } | GroupResponse,
	) => Promise<void> | void;
	triggerLabel?: React.ReactNode;
	trigger?: React.ReactNode;
};

export default function AddGroupModal({
	onCreate,
	triggerLabel = "Add Group",
	trigger,
}: Props) {
	const {
		register,
		handleSubmit,
		setValue,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<AddGroupFormValues>({
		defaultValues: {
			name: "",
			description: "",
			privacy: "public",
			avatar: null,
		},
	});

	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
	const [avatarFile, setAvatarFile] = useState<File | null>(null);
	const [open, setOpen] = useState(false);
	const [avatarUploadProgress, setAvatarUploadProgress] = useState<
		number | null
	>(null);
	const [avatarUploadError, setAvatarUploadError] = useState<string | null>(
		null,
	);

	const [windowWidth, setWindowWidth] = useState(
		typeof window !== "undefined" ? window.innerWidth : 1440,
	);

	useEffect(() => {
		const handleResize = () => setWindowWidth(window.innerWidth);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const handleAvatarChange = (file?: File | null) => {
		if (!file) {
			setAvatarFile(null);
			setAvatarPreview(null);
			setValue("avatar", null);
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
		setValue("avatar", file);

		const reader = new FileReader();
		reader.onload = () => setAvatarPreview(reader.result as string);
		reader.readAsDataURL(file);
	};

	const onSubmit = async (data: AddGroupFormValues) => {
		try {
			setAvatarUploadError(null);
			// nếu có avatarFile -> upload trước
			let avatarUrl: string | null = null;

			if (avatarFile) {
				// khởi tạo progress
				setAvatarUploadProgress(0);

				// Prepare a suggested publicId (tuỳ bạn)
				const suggestedPublicId = `${data.name?.replace(/\s+/g, "_") || "group"}_${Date.now()}`;

				// 1) Lấy signature từ backend
				const sig = await getUploadSignature({
					folder: "groups/avatars",
					publicId: suggestedPublicId,
				});

				// 2) Upload trực tiếp, cập nhật progress
				const { upload: uploadRes, delivery } =
					(await directUploadWithSignature({
						file: avatarFile,
						signature: sig,
						onProgress: ({ progress }) => {
							// progress expected 0..100
							setAvatarUploadProgress(Math.round(progress));
						},
						// generateDelivery: true, // nếu bạn muốn luôn nhận delivery.url
						generateDelivery: false, // ta chỉ cần secure_url từ uploadRes
					})) as { upload: UploadResult; delivery?: { url: string } };

				// đảm bảo uploadRes tồn tại
				if (!uploadRes)
					throw new Error("Upload failed: no upload result returned");

				// chọn URL: ưu tiên secure_url (đã có sẵn từ upload),
				// nếu bạn cần signed delivery URL (transform) thì dùng `delivery?.url`.
				avatarUrl = uploadRes.secure_url ?? delivery?.url ?? null;

				// tùy chọn: lưu metadata vào backend
				// await saveDirectUpload(uploadRes);

				// hoàn tất progress
				setAvatarUploadProgress(100);
			}

			// Build payload cho createGroup
			const payload = {
				name: data.name,
				description: data.description ?? null,
				avatar: avatarUrl, // nếu null => createGroup sẽ nhận null
			};

			// 3) Gọi API tạo group (sử dụng avatarUrl đã có)
			const created = await createGroup(payload);

			const createdObj = created && (created.data ?? created);

			if (!createdObj || !createdObj.id) {
				throw new Error("Invalid response shape from createGroup; missing id.");
			}

			if (onCreate) {
				await onCreate(createdObj);
			}

			window.dispatchEvent(
				new CustomEvent("app:groupCreated", {
					detail: createdObj,
				}),
			);

			// Reset form / UI
			reset();
			setAvatarFile(null);
			setAvatarPreview(null);
			setOpen(false);
			setAvatarUploadProgress(null);
		} catch (err: any) {
			console.error("Create group failed:", err);
			const message =
				err?.response?.data?.message ||
				err?.message ||
				JSON.stringify(err, Object.getOwnPropertyNames(err));
			setAvatarUploadError(message);
			alert("An error occurred while creating the group: " + message);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{trigger ? trigger : <Button variant="outline">{triggerLabel}</Button>}
			</DialogTrigger>
			<DialogPortal>
				<StyledDialogOverlay />
				<DialogContentWrapper>
					<DialogHeader>
						<DialogTitle
							style={{
								fontSize:
									windowWidth <= 1220
										? "14.5px"
										: windowWidth >= 1920
											? "18px"
											: "15.5px",
							}}
						>
							Add New Group
						</DialogTitle>
						<DialogDescription
							style={{
								fontSize:
									windowWidth <= 1220
										? "12px"
										: windowWidth >= 1920
											? "16px"
											: "13px",
								marginBottom: "10px",
							}}
						>
							Create a new group and invite members by email. You can add an
							avatar for the group.
						</DialogDescription>
					</DialogHeader>
					<Form onSubmit={handleSubmit(onSubmit)}>
						{/* Avatar upload */}
						<AvatarRow>
							<AvatarPreviewBox>
								{avatarPreview ? (
									<AvatarImg src={avatarPreview} alt="avatar preview" />
								) : (
									<NoAvatar>
										<div
											style={{
												fontWeight: 600,
												fontSize:
													windowWidth <= 1220
														? "11px"
														: windowWidth >= 1920
															? "14px"
															: "12px",
											}}
										>
											No Avatar
										</div>
										<div
											style={{
												fontSize:
													windowWidth <= 1220
														? "11px"
														: windowWidth >= 1920
															? "14px"
															: "12px",
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
										onChange={(e) => {
											const file = e.target.files?.[0];
											handleAvatarChange(file ?? null);
										}}
									/>
									<Note>Image formats: jpg, png. Maximum size 5MB.</Note>
								</FileInputWrapper>
								{avatarPreview && (
									<SmallButton
										type="button"
										onClick={() => handleAvatarChange(null)}
									>
										Remove image
									</SmallButton>
								)}
								{avatarUploadProgress !== null && (
									<div className="w-full mt-2">
										<div
											style={{
												fontSize:
													windowWidth <= 1220
														? "11px"
														: windowWidth >= 1920
															? "14px"
															: "12px",
												marginBottom: "4px",
											}}
										>
											Uploading avatar: {avatarUploadProgress}%
										</div>
										<div className="w-full bg-gray-200 rounded h-2 overflow-hidden">
											<div
												className="h-full transition-all bg-blue-500"
												style={{ width: `${avatarUploadProgress}%` }}
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
								{...register("description")}
							/>
						</Field>
						<Footer>
							<DialogClose asChild>
								<CancelButton type="button" variant="ghost">
									Cancel
								</CancelButton>
							</DialogClose>
							<SubmitButton type="submit" disabled={isSubmitting}>
								{isSubmitting ? "Creating..." : "Create group"}
							</SubmitButton>
						</Footer>
					</Form>
				</DialogContentWrapper>
			</DialogPortal>
		</Dialog>
	);
}
