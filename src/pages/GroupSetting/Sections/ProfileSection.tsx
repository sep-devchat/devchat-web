/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
	AvatarControls,
	AvatarImg,
	AvatarPreviewBox,
	AvatarRow,
	DescripSection,
	ErrorText,
	Field,
	FileInputWrapper,
	Footer,
	Form,
	LabelItem,
	NoAvatar,
	Note,
	SectionWrapper,
	SmallButton,
	StyledInput,
	StyledTextarea,
	SubmitButton,
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

type AddGroupFormValues = {
	name: string;
	description?: string;
	privacy: "public" | "private";
	avatar?: File | null;
};

export default function ProfileSection() {
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
	const [avatarFile, setAvatarFile] = useState<File | null>(null);
	const params = useParams({ strict: false }) as { groupId?: string };
	const groupId = params.groupId;

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
			// clear the form value and mark dirty so Save button enables when user removes avatar
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
		// mark form as dirty since avatar changed
		setValue("avatar", file, { shouldDirty: true });

		const reader = new FileReader();
		reader.onload = () => setAvatarPreview(reader.result as string);
		reader.readAsDataURL(file);
	};

	useEffect(() => {
		// fetch group details when mounted
		const fetchGroup = async () => {
			if (!groupId) return;
			try {
				const res = await get(`/api/group/${groupId}`);
				const payload = (res && (res.data ?? res)) as any;

				// set form fields without marking them dirty
				reset(
					{
						name: payload.name ?? "",
						description: payload.description ?? "",
						privacy: "public",
						avatar: null,
					},
					{ keepDefaultValues: true },
				);

				// handle avatar: API might return a full data URL, absolute URL, or raw base64 string
				if (payload.avatar) {
					let src = payload.avatar as string;
					if (!src.startsWith("data:") && !/^https?:\/\//i.test(src)) {
						// assume it's base64 without data: prefix
						src = `data:image/*;base64,${src}`;
					}
					setAvatarPreview(src);
				} else {
					setAvatarPreview(null);
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
		if (!groupId) {
			alert("Missing group id");
			return;
		}

		try {
			const avatarBase64 = avatarFile
				? await fileToDataUrl(avatarFile)
				: (avatarPreview ?? null);

			console.log("Sending updateGroup payload:", {
				name: data.name,
				description: data.description ?? null,
				avatarPreview: avatarBase64 ? avatarBase64.slice(0, 100) + "..." : null,
			});

			// call updateGroup with groupId and payload
			const updated = await updateGroup(groupId, {
				name: data.name,
				description: data.description ?? null,
				avatar: avatarBase64,
			});

			console.log("updateGroup response raw:", updated);

			// If no exception thrown by API client we consider success
			showGlobalAlert({ type: "success", message: "Group saved successfully" });

			// reset form to the new values and clear dirty state
			reset(
				{
					name: data.name,
					description: data.description ?? "",
					privacy: "public",
					avatar: null,
				},
				{ keepDefaultValues: true },
			);

			setAvatarFile(null);
			// if backend returned an avatar URL/base64, update preview
			const createdObj = updated && ((updated.data ?? updated) as any);
			if (createdObj && createdObj.avatar) {
				let src = createdObj.avatar as string;
				if (!src.startsWith("data:") && !/^https?:\/\//i.test(src)) {
					src = `data:image/*;base64,${src}`;
				}
				setAvatarPreview(src);
			}
		} catch (err: any) {
			console.error("Update group failed:", err);
			const message =
				err?.response?.data?.message ||
				err?.message ||
				JSON.stringify(err, Object.getOwnPropertyNames(err));
			showGlobalAlert({
				type: "error",
				message: `Save failed: ${String(message)}`,
			});
		}
	};

	return (
		<SectionWrapper>
			{/* Mount alert container here so other files can still trigger via showGlobalAlert */}
			<AlertContainer />

			<TitleArea>
				<TitleSection>Server Profile</TitleSection>
				<DescripSection>helo</DescripSection>
			</TitleArea>

			<LabelItem>Name</LabelItem>

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
					<SubmitButton type="submit" disabled={isSubmitting || !isDirty}>
						{isSubmitting ? "Saving..." : "Save"}
					</SubmitButton>
				</Footer>
			</Form>
		</SectionWrapper>
	);
}
