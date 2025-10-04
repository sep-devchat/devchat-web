/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
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

	// helper: file -> dataURL (base64)
	const fileToDataUrl = (file: File): Promise<string> =>
		new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});

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
			const avatarBase64 = avatarFile ? await fileToDataUrl(avatarFile) : null;

			console.log("Sending createGroup payload:", {
				name: data.name,
				description: data.description ?? null,
				avatarPreview: avatarBase64 ? avatarBase64.slice(0, 100) + "..." : null,
			});

			const created = await createGroup({
				name: data.name,
				description: data.description ?? null,
				avatar: avatarBase64,
			});

			console.log("createGroup response raw:", created);

			// flexible unwrap: if API returns { data: {...} } or returns the object directly
			const createdObj = created && (created.data ?? created);

			if (!createdObj || !createdObj.id) {
				throw new Error("Invalid response shape from createGroup; missing id.");
			}

			if (onCreate) {
				await onCreate(createdObj);
			}

			reset();
			setAvatarFile(null);
			setAvatarPreview(null);
			setOpen(false);
		} catch (err: any) {
			console.error("Create group failed:", err);
			// show more info to help debug
			const message =
				err?.response?.data?.message ||
				err?.message ||
				JSON.stringify(err, Object.getOwnPropertyNames(err));
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
						<DialogTitle>Add New Group</DialogTitle>
						<DialogDescription>
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
