/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from "react";
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
import { Label } from "@/components/ui/label";
import {
	CancelButton,
	DialogContentWrapper,
	Footer,
	Form,
	StyledDialogOverlay,
	FriendList,
	FriendItem,
	AvatarCircle,
	NameContainer,
	NameText,
	EmailText,
	AddButton,
	SearchBox,
	InviteBox,
	InviteInput,
	CopyButton,
	Left,
} from "./AddGroupMemModal.styled";
import { DialogPortal } from "@radix-ui/react-dialog";
import { sampleData } from "@/sampleData";

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
	}) => Promise<void> | void;
	triggerLabel?: React.ReactNode;
	trigger?: React.ReactNode;
	// optional: group id to consider when calculating non-members (default uses sampleData.expanded_group)
	groupId?: string;
	onAddMembers?: (userIds: string[]) => Promise<void> | void; // optional callback when user adds friends
};

export default function AddGroupMemModal({
	onCreate,
	triggerLabel = "Add Group",
	trigger,
	groupId,
	onAddMembers,
}: Props) {
	const { handleSubmit, reset } = useForm<AddGroupFormValues>({
		defaultValues: {
			name: "",
			description: "",
			privacy: "public",
			members: "",
			avatar: null,
		},
	});

	const [search, setSearch] = useState("");
	// ids that have been successfully added during this session (used to show "Added")
	const [addedIds, setAddedIds] = useState<string[]>([]);
	// per-user loading flag while adding
	const [addingMap, setAddingMap] = useState<Record<string, boolean>>({});

	const sd = sampleData();

	// get group to consider (fallback to expanded_group)
	const group = useMemo(() => {
		if (groupId) {
			return sd.groups.find((g) => g.group_id === groupId)
				? sd.expanded_group
				: sd.expanded_group;
		}
		return sd.expanded_group;
	}, [groupId, sd]);

	// all users (friends) from sample
	const allUsers = sd.users ?? [];

	// member user ids of the group
	const memberIds = (group.members || []).map((m: any) => m.user_id);

	// non-members: users who are not in memberIds and not the current user
	const nonMembers = useMemo(() => {
		return allUsers.filter(
			(u) => !memberIds.includes(u.user_id) && u.user_id !== sd.user.user_id,
		);
	}, [allUsers, memberIds, sd.user.user_id]);

	// filtered by search
	const filtered = nonMembers.filter((u) => {
		const q = search.trim().toLowerCase();
		if (!q) return true;
		return (
			u.username.toLowerCase().includes(q) ||
			u.first_name.toLowerCase().includes(q) ||
			u.last_name.toLowerCase().includes(q) ||
			u.email.toLowerCase().includes(q)
		);
	});

	// handle add single user immediately
	const handleAddSingle = async (userId: string) => {
		if (addedIds.includes(userId)) return; // already added
		if (addingMap[userId]) return; // already in progress

		// set loading for this user
		setAddingMap((m) => ({ ...m, [userId]: true }));

		try {
			if (onAddMembers) {
				await onAddMembers([userId]);
			} else {
				// demo fallback: just log
				console.log("Demo add member:", userId, "to group", group.group_id);
				// simulate network latency in demo (optional)
				// await new Promise((r) => setTimeout(r, 400));
			}

			// mark as added in UI
			setAddedIds((prev) => [...prev, userId]);
		} catch (err) {
			console.error(err);
			alert("Failed to add member. Please try again.");
		} finally {
			// unset loading
			setAddingMap((m) => {
				const copy = { ...m };
				delete copy[userId];
				return copy;
			});
		}
	};

	// copy invite link to clipboard
	const inviteLink = `https://devchat-hihihehe/${group.group_id}`;
	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(inviteLink);
			alert("Copied invite link!");
		} catch {
			alert("Copy failed. Please copy manually.");
		}
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
		};

		try {
			if (onCreate) {
				await onCreate(payload);
			} else {
				console.log("Create group payload:", payload);
			}

			reset();
			alert("Tạo nhóm thành công (demo).");
		} catch (err) {
			console.error(err);
			alert("Đã xảy ra lỗi khi tạo nhóm.");
		}
	};

	const remainingCount = Math.max(0, nonMembers.length - addedIds.length);

	return (
		<Dialog>
			<DialogTrigger asChild>
				{trigger ? trigger : <Button variant="outline">{triggerLabel}</Button>}
			</DialogTrigger>

			<DialogPortal>
				<StyledDialogOverlay />
				<DialogContentWrapper>
					<DialogHeader>
						<DialogTitle>Select friends</DialogTitle>
						<DialogDescription>
							You can add {remainingCount} more friends!
						</DialogDescription>
					</DialogHeader>

					<Form onSubmit={handleSubmit(onSubmit)}>
						<div>
							<SearchBox
								placeholder="Type the username of friend"
								value={search}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									setSearch(e.target.value)
								}
							/>

							<FriendList>
								{filtered.length === 0 ? (
									<div
										style={{
											color: "var(--muted-foreground, #6b7280)",
											padding: "8px 0",
										}}
									>
										No friends found.
									</div>
								) : (
									filtered.map((u) => {
										const added = addedIds.includes(u.user_id);
										const adding = Boolean(addingMap[u.user_id]);
										return (
											<FriendItem key={u.user_id}>
												<Left>
													<AvatarCircle
														src={
															u.avatar_url ??
															`https://ui-avatars.com/api/?name=${encodeURIComponent(u.first_name)}`
														}
														alt={u.username}
													/>
													<NameContainer>
														<NameText>{`${u.first_name} ${u.last_name}`}</NameText>
														<EmailText>{u.email}</EmailText>
													</NameContainer>
												</Left>

												<div>
													<AddButton
														$added={added}
														onClick={() => handleAddSingle(u.user_id)}
														disabled={added || adding}
													>
														{adding ? "Adding..." : added ? "Added" : "Add"}
													</AddButton>
												</div>
											</FriendItem>
										);
									})
								)}
							</FriendList>

							{/* invite link */}
							<div>
								<Label>Or share an invite link to your friend!</Label>
								<InviteBox>
									<InviteInput readOnly value={inviteLink} />
									<CopyButton type="button" onClick={handleCopy}>
										Copy
									</CopyButton>
								</InviteBox>
							</div>
						</div>

						<Footer>
							<DialogClose asChild>
								<CancelButton type="button" variant="ghost">
									Hủy
								</CancelButton>
							</DialogClose>

							{/* <SubmitButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang tạo..." : "Tạo nhóm"}
              </SubmitButton> */}
						</Footer>
					</Form>
				</DialogContentWrapper>
			</DialogPortal>
		</Dialog>
	);
}
