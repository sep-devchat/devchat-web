// AddGroupModal.tsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";

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

type AddGroupFormValues = {
	name: string;
	description?: string;
	privacy: "public" | "private";
	members?: string; // comma separated emails
	avatar?: File | null;
};

type Props = {
	onCreate?: (payload: {
		name: string;
		description?: string;
		privacy: "public" | "private";
		members: string[];
		avatarFile?: File | null;
	}) => Promise<void> | void;
	triggerLabel?: React.ReactNode;
	// NEW: optional custom trigger node (e.g. your styled CreateGroupButton)
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
			members: "",
			avatar: null,
		},
	});

	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
	const [avatarFile, setAvatarFile] = useState<File | null>(null);

	// handle file input change
	const handleAvatarChange = (file?: File | null) => {
		if (!file) {
			setAvatarFile(null);
			setAvatarPreview(null);
			setValue("avatar", null);
			return;
		}

		// basic validation: type and size (< 5MB)
		if (!file.type.startsWith("image/")) {
			alert("Chỉ chấp nhận file ảnh.");
			return;
		}
		if (file.size > 5 * 1024 * 1024) {
			alert("Kích thước file tối đa 5MB.");
			return;
		}

		setAvatarFile(file);
		setValue("avatar", file);

		const reader = new FileReader();
		reader.onload = () => {
			setAvatarPreview(reader.result as string);
		};
		reader.readAsDataURL(file);
	};

	const onSubmit = async (data: AddGroupFormValues) => {
		const members = data.members
			? data.members
					.split(",")
					.map((m) => m.trim())
					.filter(Boolean)
			: [];

		const payload = {
			name: data.name,
			description: data.description,
			privacy: data.privacy,
			members,
			avatarFile: avatarFile ?? undefined,
		};

		try {
			if (onCreate) {
				await onCreate(payload);
			} else {
				console.log("Create group payload:", payload);
			}

			reset();
			setAvatarFile(null);
			setAvatarPreview(null);
			alert("Tạo nhóm thành công (demo).");
		} catch (err) {
			console.error(err);
			alert("Đã xảy ra lỗi khi tạo nhóm.");
		}
	};

	return (
		<Dialog>
			{/* nếu có trigger tuỳ chỉnh thì dùng nó, ngược lại dùng button mặc định */}
			{/* {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button variant="outline">{triggerLabel}</Button>
        </DialogTrigger>
      )} */}
			<DialogTrigger asChild>
				{trigger ? trigger : <Button variant="outline">{triggerLabel}</Button>}
			</DialogTrigger>

			<DialogPortal>
				<StyledDialogOverlay />
				<DialogContentWrapper>
					<DialogHeader>
						<DialogTitle>Thêm nhóm mới</DialogTitle>
						<DialogDescription>
							Tạo nhóm mới và mời thành viên bằng email. Bạn có thể thêm avatar
							cho nhóm.
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
								<Label>Avatar nhóm</Label>
								<FileInputWrapper>
									<Input
										type="file"
										accept="image/*"
										onChange={(e) => {
											const file = e.target.files?.[0];
											handleAvatarChange(file ?? null);
										}}
									/>
									<Note>Định dạng ảnh: jpg, png. Kích thước tối đa 5MB.</Note>
								</FileInputWrapper>

								{avatarPreview && (
									<SmallButton
										type="button"
										onClick={() => handleAvatarChange(null)}
									>
										Xóa ảnh
									</SmallButton>
								)}
							</AvatarControls>
						</AvatarRow>

						{/* Group name */}
						<Field>
							<Label htmlFor="name">Tên nhóm</Label>
							<StyledInput
								id="name"
								placeholder="VD: Frontend Team"
								{...register("name", {
									required: "Tên nhóm là bắt buộc",
									maxLength: { value: 100, message: "Tối đa 100 ký tự" },
								})}
							/>
							{errors.name && <ErrorText>{errors.name.message}</ErrorText>}
						</Field>

						{/* Description */}
						<Field>
							<Label htmlFor="description">Mô tả</Label>
							<StyledTextarea
								id="description"
								placeholder="Mô tả ngắn về nhóm..."
								{...register("description")}
							/>
						</Field>

						{/* Privacy & Members */}
						{/* <TwoColumn>
            <Column>
              <Label htmlFor="privacy">Loại</Label>
              <Select id="privacy" {...register("privacy")}>
                <option value="public">Công khai</option>
                <option value="private">Riêng tư</option>
              </Select>
            </Column>

            <Column>
              <Label htmlFor="members">Thêm thành viên (email)</Label>
              <StyledInput
                id="members"
                placeholder="Nhập email, cách nhau bằng dấu phẩy"
                {...register("members", {
                  validate: (v) => {
                    if (!v) return true;
                    const arr = v.split(",").map((s) => s.trim()).filter(Boolean);
                    const bad = arr.find((e) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
                    return bad ? "Một hoặc vài email không hợp lệ" : true;
                  },
                })}
              />
              {errors.members && <ErrorText>{errors.members.message}</ErrorText>}
            </Column>
          </TwoColumn> */}

						<Footer>
							<DialogClose asChild>
								<CancelButton type="button" variant="ghost">
									Hủy
								</CancelButton>
							</DialogClose>

							<SubmitButton type="submit" disabled={isSubmitting}>
								{isSubmitting ? "Đang tạo..." : "Tạo nhóm"}
							</SubmitButton>
						</Footer>
					</Form>
				</DialogContentWrapper>
			</DialogPortal>
		</Dialog>
	);
}
