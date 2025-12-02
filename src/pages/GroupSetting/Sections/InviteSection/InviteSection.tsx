/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
	Form,
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
	SectionWrapper,
	TitleArea,
	TitleSection,
	DescripSection,
	Divider,
} from "./InviteSection.styled";
import { useParams } from "@tanstack/react-router";

import { detailGroup } from "@/services/groupAPI";
import { listFriends, type FriendUser } from "@/services/friendAPI";
import {
	GroupInvitation,
	inviteToGroup,
	listSentInvitationGr,
	membersGroup,
} from "@/services/userGroupAPI";
import { theme } from "@/themes";

type AddGroupFormValues = {
	name: string;
	description?: string;
	privacy: "public" | "private";
	members?: string;
	avatar?: File | null;
};

type InviteSectionProps = {
	canInvite?: boolean;
};

export default function InviteSection({
	canInvite = true,
}: InviteSectionProps) {
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
	const [addingMap, setAddingMap] = useState<Record<string, boolean>>({});
	const [friends, setFriends] = useState<FriendUser[]>([]);
	const [loadingFriends, setLoadingFriends] = useState(false);
	const [groupMembers, setGroupMembers] = useState<string[]>([]);
	const [pendingInvitations, setPendingInvitations] = useState<
		Map<string, string>
	>(new Map());
	const copyTimeoutRef = useRef<number | null>(null);
	const pollingIntervalRef = useRef<number | null>(null);

	const params = useParams({ strict: false }) as { groupId?: string };
	const groupId = params.groupId ?? "unknown-group";
	const [groupName, setGroupName] = useState<string>(groupId);

	const inviteStorageKey = `devchat_invite_copied_${groupId}`;

	const [copiedInvite, setCopiedInvite] = useState<boolean>(() => {
		try {
			return sessionStorage.getItem(inviteStorageKey) === "1";
		} catch {
			return false;
		}
	});

	const fetchDetailGroup = async (groupId: string) => {
		if (!groupId) return;
		try {
			const response = await detailGroup(groupId);
			setGroupName(response?.data?.name ?? "");
		} catch (error) {
			console.error("Failed to fetch group detail:", error);
			setGroupName("");
		}
	};

	const fetchGroupMembers = async () => {
		if (!groupId) return;
		try {
			const response = await membersGroup(groupId);
			const members = response?.data?.data ?? response?.data ?? [];
			const memberIds = members.map((m: any) => m.id || m.userId);
			setGroupMembers(memberIds);
		} catch (error) {
			console.error("Failed to fetch group members:", error);
			setGroupMembers([]);
		}
	};

	const fetchPendingInvitations = async () => {
		if (!groupId) return;
		try {
			const response = await listSentInvitationGr();
			const invitations: GroupInvitation[] =
				response?.data?.data ?? response?.data ?? [];

			const pendingMap = new Map<string, string>();
			invitations
				.filter((inv: GroupInvitation) => inv.groupId === groupId)
				.forEach((inv: GroupInvitation) => {
					pendingMap.set(inv.toUserId, inv.id);
				});

			setPendingInvitations(pendingMap);
		} catch (error) {
			console.error("Failed to fetch pending invitations:", error);
			setPendingInvitations(new Map());
		}
	};

	const refreshInvitationStatus = async () => {
		await fetchGroupMembers();
		await fetchPendingInvitations();
	};

	useEffect(() => {
		fetchDetailGroup(groupId);
		fetchGroupMembers();
		fetchPendingInvitations();
	}, [groupId]);

	useEffect(() => {
		if (pollingIntervalRef.current) {
			clearInterval(pollingIntervalRef.current);
		}

		if (pendingInvitations.size > 0) {
			pollingIntervalRef.current = window.setInterval(() => {
				refreshInvitationStatus();
			}, 5000);
		}

		return () => {
			if (pollingIntervalRef.current) {
				clearInterval(pollingIntervalRef.current);
				pollingIntervalRef.current = null;
			}
		};
	}, [pendingInvitations.size, groupId]);

	useEffect(() => {
		let mounted = true;
		setLoadingFriends(true);
		listFriends(1, 100)
			.then((res) => {
				if (!mounted) return;

				const arr = res?.data ?? [];
				const mapped: FriendUser[] = arr.map((it) => ({
					...it,
					avatar: it.avatar ?? it.avatarUrl ?? null,
					name:
						it.name ||
						`${it.firstName ?? ""} ${it.lastName ?? ""}`.trim() ||
						it.username ||
						it.email,
				}));

				setFriends(mapped);
			})
			.catch((err: any) => {
				console.error("Failed to load friends:", err);
				setFriends([]);
			})
			.finally(() => {
				if (mounted) setLoadingFriends(false);
			});

		return () => {
			mounted = false;
		};
	}, []);

	useEffect(() => {
		return () => {
			if (copyTimeoutRef.current) {
				clearTimeout(copyTimeoutRef.current);
				copyTimeoutRef.current = null;
			}
			if (pollingIntervalRef.current) {
				clearInterval(pollingIntervalRef.current);
				pollingIntervalRef.current = null;
			}
		};
	}, []);

	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase();

		let result = friends.filter((f) => !groupMembers.includes(f.id));

		if (q) {
			result = result.filter((u) => {
				return (
					(u.username ?? "").toLowerCase().includes(q) ||
					(u.firstName ?? "").toLowerCase().includes(q) ||
					(u.lastName ?? "").toLowerCase().includes(q) ||
					(u.email ?? "").toLowerCase().includes(q)
				);
			});
		}

		return result;
	}, [friends, search, groupMembers]);

	const handleAddSingle = async (userId: string) => {
		if (!canInvite) return;
		if (!groupId) {
			alert("No group id provided.");
			return;
		}
		if (addingMap[userId]) return;

		if (pendingInvitations.has(userId)) {
			alert("This user has already been invited to the group.");
			return;
		}

		setAddingMap((m) => ({ ...m, [userId]: true }));

		try {
			await inviteToGroup({
				toUserId: userId,
				groupId,
				message: "Hi, would you like to join our group?",
			});

			setTimeout(() => {
				refreshInvitationStatus();
			}, 1000);
		} catch (err) {
			console.error("Failed to invite friend:", err);
		} finally {
			setAddingMap((m) => {
				const copy = { ...m };
				delete copy[userId];
				return copy;
			});
		}
	};

	const inviteLink = `https://devchat-hihihehe/${groupId}`;
	const handleCopy = async () => {
		if (!canInvite) return;
		try {
			await navigator.clipboard.writeText(inviteLink);
			try {
				sessionStorage.setItem(inviteStorageKey, "1");
			} catch {
				/* ignore */
			}
			setCopiedInvite(true);
			if (copyTimeoutRef.current) {
				clearTimeout(copyTimeoutRef.current);
			}
			copyTimeoutRef.current = window.setTimeout(() => {
				setCopiedInvite(false);
				copyTimeoutRef.current = null;
			}, 3000);
		} catch (err) {
			console.error(err);
		}
	};

	const [emailInput, setEmailInput] = useState<string>("");
	const [emailError, setEmailError] = useState<string | null>(null);
	const [lookupLoading, setLookupLoading] = useState(false);
	const [lookupResult, setLookupResult] = useState<FriendUser | null>(null);
	const [sendingEmail, setSendingEmail] = useState(false);

	const validateEmail = (e?: string) => {
		if (!e) return false;
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(e.trim().toLowerCase());
	};

	useEffect(() => {
		const val = emailInput.trim().toLowerCase();
		if (val === "") {
			setEmailError(null);
			setLookupResult(null);
			return;
		}

		if (!validateEmail(val)) {
			setEmailError("Invalid email format");
			setLookupResult(null);
			return;
		}

		setEmailError(null);
		setLookupLoading(true);

		const found =
			friends.find((f) => (f.email ?? "").toLowerCase() === val) ?? null;

		const t = window.setTimeout(() => {
			setLookupResult(found);
			setLookupLoading(false);
		}, 150);

		return () => clearTimeout(t);
	}, [emailInput, friends]);

	const handleSendEmailInvite = async () => {
		if (!canInvite) return;
		const email = emailInput.trim().toLowerCase();
		if (!validateEmail(email)) {
			setEmailError("Invalid email format");
			return;
		}

		if (!groupId) {
			alert("No group id provided.");
			return;
		}

		setSendingEmail(true);

		try {
			await inviteToGroup({
				toUserId: email,
				groupId,
				message: "Hi, would you like to join our group?",
			});

			setEmailInput("");
			setLookupResult(null);

			setTimeout(() => {
				refreshInvitationStatus();
			}, 1000);
		} catch (err) {
			console.error("Failed to invite by email:", err);
		} finally {
			setSendingEmail(false);
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
			console.log("Create group payload:", payload);
			reset();
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<SectionWrapper>
			<TitleArea>
				<TitleSection>Invite</TitleSection>
				<DescripSection>
					{canInvite ? (
						<>
							Invite friends to <strong>{groupName}</strong>
						</>
					) : (
						"You can view the current invite list, but only the group owner can send invitations."
					)}
				</DescripSection>
			</TitleArea>

			<Form onSubmit={handleSubmit(onSubmit)}>
				<div style={{ marginTop: 8 }}>
					<div style={{ fontSize: 13, marginBottom: 8 }}>
						Share an invite link to your friend!
					</div>
					<InviteBox>
						<InviteInput readOnly value={inviteLink} />
						<CopyButton
							type="button"
							onClick={handleCopy}
							disabled={!canInvite}
							style={
								copiedInvite
									? {
											backgroundColor: theme.color.successBackground,
											color: theme.color.success,
											border: `1px solid ${theme.color.successBackground}`,
										}
									: undefined
							}
						>
							{copiedInvite ? "Copied" : "Copy"}
						</CopyButton>
					</InviteBox>
				</div>

				<Divider />

				<div style={{ marginBottom: 12 }}>
					<div style={{ fontSize: 13, marginBottom: 8 }}>Invite by email</div>

					<div style={{ display: "flex", gap: 8, alignItems: "center" }}>
						<InviteInput
							placeholder="Enter email address"
							value={emailInput}
							onChange={(e) => setEmailInput(e.target.value)}
						/>
						<AddButton
							type="button"
							onClick={handleSendEmailInvite}
							disabled={
								sendingEmail ||
								!!emailError ||
								emailInput.trim() === "" ||
								!canInvite
							}
							style={{ minWidth: 80 }}
						>
							{sendingEmail ? "Sending..." : "Send"}
						</AddButton>
					</div>

					<div style={{ marginTop: 8 }}>
						{emailError ? (
							<div style={{ color: "#ef4444", fontSize: 13 }}>{emailError}</div>
						) : lookupLoading ? (
							<div
								style={{
									color: "var(--muted-foreground, #6b7280)",
									fontSize: 13,
								}}
							>
								Looking up account…
							</div>
						) : lookupResult ? (
							<div style={{ marginTop: 8 }}>
								<FriendItem>
									<Left>
										<AvatarCircle
											src={
												lookupResult.avatar ??
												lookupResult.avatarUrl ??
												`https://ui-avatars.com/api/?name=${encodeURIComponent(lookupResult.firstName ?? lookupResult.username ?? "F")}`
											}
											alt={lookupResult.username}
										/>
										<NameContainer>
											<NameText>
												{`${lookupResult.firstName ?? ""} ${lookupResult.lastName ?? ""}`.trim()}
											</NameText>
											<EmailText>{lookupResult.email}</EmailText>
										</NameContainer>
									</Left>
								</FriendItem>
							</div>
						) : emailInput.trim() !== "" ? (
							<div
								style={{
									color: "var(--muted-foreground, #6b7280)",
									fontSize: 13,
								}}
							>
								No account found for this email. An invitation will be sent to
								the email address.
							</div>
						) : null}
					</div>
				</div>

				<Divider />

				<div>
					<SearchBox
						placeholder="Type the username of friend"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>

					<FriendList>
						{loadingFriends ? (
							<div
								style={{
									color: "var(--muted-foreground, #6b7280)",
									padding: "8px 0",
								}}
							>
								Loading friends…
							</div>
						) : filtered.length === 0 ? (
							<div
								style={{
									color: "var(--muted-foreground, #6b7280)",
									padding: "8px 0",
								}}
							>
								{search.trim() !== ""
									? "No friends found matching your search."
									: "All your friends are already members of this group."}
							</div>
						) : (
							filtered.map((u) => {
								const hasPendingInvite = pendingInvitations.has(u.id);
								const adding = Boolean(addingMap[u.id]);

								return (
									<FriendItem key={u.id}>
										<Left>
											<AvatarCircle
												src={
													u.avatar ??
													u.avatarUrl ??
													`https://ui-avatars.com/api/?name=${encodeURIComponent(u.firstName ?? u.username ?? "F")}`
												}
												alt={u.username}
											/>
											<NameContainer>
												<NameText>
													{`${u.firstName ?? ""} ${u.lastName ?? ""}`.trim()}
												</NameText>
												<EmailText>{u.email}</EmailText>
											</NameContainer>
										</Left>

										<div>
											<AddButton
												$added={hasPendingInvite}
												onClick={() => handleAddSingle(u.id)}
												disabled={hasPendingInvite || adding || !canInvite}
												style={
													hasPendingInvite
														? {
																backgroundColor: "#F59E0B",
																color: "white",
																border: "none",
																cursor: "not-allowed",
															}
														: {}
												}
											>
												{adding
													? "Adding..."
													: hasPendingInvite
														? "Pending"
														: "Add"}
											</AddButton>
										</div>
									</FriendItem>
								);
							})
						)}
					</FriendList>
				</div>
			</Form>
		</SectionWrapper>
	);
}
