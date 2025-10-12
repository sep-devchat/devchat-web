/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState, useEffect, useRef } from "react";
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

	// sessionStorage keys scoped by group id so different groups don't conflict
	const inviteStorageKey = `devchat_invite_copied_${group.group_id}`;
	const addedStorageKey = `devchat_added_members_${group.group_id}`;

	// copy state (true if invite was copied in this session) — UI will still show "Copied" only temporarily
	const [copiedInvite, setCopiedInvite] = useState<boolean>(() => {
		try {
			return sessionStorage.getItem(inviteStorageKey) === "1";
		} catch {
			return false;
		}
	});

	// timeout ref to clear delayed revert
	const copyTimeoutRef = useRef<number | null>(null);

	// initialize addedIds from sessionStorage
	useEffect(() => {
		try {
			const raw = sessionStorage.getItem(addedStorageKey);
			if (raw) {
				const parsed = JSON.parse(raw) as string[];
				if (Array.isArray(parsed)) setAddedIds(parsed);
			}
		} catch (err: any) {
			console.log(err);
		}
		// cleanup any pending timeout when group changes
		return () => {
			if (copyTimeoutRef.current) {
				clearTimeout(copyTimeoutRef.current);
				copyTimeoutRef.current = null;
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [group.group_id]); // re-run when group changes

	// helper to persist addedIds to sessionStorage
	const persistAddedIds = (ids: string[]) => {
		try {
			sessionStorage.setItem(addedStorageKey, JSON.stringify(ids));
		} catch {
			/* ignore */
		}
	};

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
				// optional: fake delay
				// await new Promise((r) => setTimeout(r, 300));
			}

			// mark as added in UI and persist to sessionStorage
			setAddedIds((prev) => {
				const next = [...prev, userId];
				persistAddedIds(next);
				return next;
			});
		} catch (err) {
			console.error(err);
		} finally {
			// unset loading
			setAddingMap((m) => {
				const copy = { ...m };
				delete copy[userId];
				return copy;
			});
		}
	};

	// copy invite link to clipboard — show "Copied" for a short time then revert to "Copy"
	const inviteLink = `https://devchat-hihihehe/${group.group_id}`;
	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(inviteLink);

			// persist that copy happened in this session (keeps record in sessionStorage)
			try {
				sessionStorage.setItem(inviteStorageKey, "1");
			} catch {
				/* ignore */
			}

			// show "Copied" visually for a few seconds, then revert
			setCopiedInvite(true);
			// clear prior timer if any
			if (copyTimeoutRef.current) {
				clearTimeout(copyTimeoutRef.current);
			}
			copyTimeoutRef.current = window.setTimeout(() => {
				setCopiedInvite(false);
				copyTimeoutRef.current = null;
			}, 3000); // 3000 ms = 3s
		} catch (err) {
			console.error(err);
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
		} catch (err) {
			console.error(err);
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

										// inline style for 'Added' (green) or normal
										const addBtnStyle: React.CSSProperties = added
											? {
													backgroundColor: "#10B981", // green-500
													color: "white",
													border: "none",
												}
											: {};

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
													{/* AddButton is kept but we override style when added */}
													<AddButton
														$added={added}
														onClick={() => handleAddSingle(u.user_id)}
														disabled={added || adding}
														style={addBtnStyle}
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
									{/* Copy button: change appearance when copied (temporary) */}
									<CopyButton
										type="button"
										onClick={handleCopy}
										style={
											copiedInvite
												? {
														backgroundColor: "#10B981",
														color: "white",
														border: "none",
													}
												: {}
										}
									>
										{copiedInvite ? "Copied" : "Copy"}
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
						</Footer>
					</Form>
				</DialogContentWrapper>
			</DialogPortal>
		</Dialog>
	);
}
