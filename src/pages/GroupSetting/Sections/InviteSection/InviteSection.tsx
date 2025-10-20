/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { listFriends } from "@/services/friendAPI";
import { inviteToGroup } from "@/services/userGroupAPI";
import { theme } from "@/themes";

type AddGroupFormValues = {
	name: string;
	description?: string;
	privacy: "public" | "private";
	members?: string; // comma separated emails
	avatar?: File | null;
};

type Friend = {
	user_id: string;
	username: string;
	first_name: string;
	last_name: string;
	email: string;
	avatar_url?: string;
};

export default function InviteSection() {
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
	const [addedIds, setAddedIds] = useState<string[]>([]);
	const [addingMap, setAddingMap] = useState<Record<string, boolean>>({});
	const [friends, setFriends] = useState<Friend[]>([]);
	const [loadingFriends, setLoadingFriends] = useState(false);
	const copyTimeoutRef = useRef<number | null>(null);

	const params = useParams({ strict: false }) as { groupId?: string };
	const groupId = params.groupId ?? "unknown-group";
	const [groupName, setGroupName] = useState<string>(groupId);

	// session keys scoped by group id (use groupId fallback)
	const inviteStorageKey = `devchat_invite_copied_${groupId}`;
	const addedStorageKey = `devchat_added_members_${groupId}`;

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

	useEffect(() => {
		fetchDetailGroup(groupId);
	}, [groupId]);

	useEffect(() => {
		let mounted = true;
		setLoadingFriends(true);
		listFriends(1, 100)
			.then((res: any) => {
				if (!mounted) return;

				const body = res?.data ?? res;
				const arr =
					Array.isArray(body?.data) && body.data.length
						? body.data
						: Array.isArray(body)
							? body
							: Array.isArray(res?.data)
								? res.data
								: [];

				const mapped: Friend[] = arr.map((it: any) => ({
					user_id: it.id ?? it.user_id ?? "",
					username: it.username ?? it.userName ?? "",
					first_name: it.firstName ?? it.first_name ?? "",
					last_name: it.lastName ?? it.last_name ?? "",
					email: it.email ?? "",
					avatar_url: it.avatarUrl ?? it.avatar_url ?? it.avatar ?? undefined,
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

	// initialize addedIds from sessionStorage for this group
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
		return () => {
			if (copyTimeoutRef.current) {
				clearTimeout(copyTimeoutRef.current);
				copyTimeoutRef.current = null;
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [groupId]);

	const persistAddedIds = (ids: string[]) => {
		try {
			sessionStorage.setItem(addedStorageKey, JSON.stringify(ids));
		} catch {
			/* ignore */
		}
	};

	// filtered friends by search (safe lowercasing)
	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return friends;
		return friends.filter((u) => {
			return (
				(u.username ?? "").toLowerCase().includes(q) ||
				(u.first_name ?? "").toLowerCase().includes(q) ||
				(u.last_name ?? "").toLowerCase().includes(q) ||
				(u.email ?? "").toLowerCase().includes(q)
			);
		});
	}, [friends, search]);

	// invite single friend (calls API)
	const handleAddSingle = async (userId: string) => {
		if (!groupId) {
			alert("No group id provided.");
			return;
		}
		if (addedIds.includes(userId)) return;
		if (addingMap[userId]) return;

		setAddingMap((m) => ({ ...m, [userId]: true }));

		try {
			// assume API accepts { user_id: string } — adjust if backend expects different payload
			await inviteToGroup(groupId, { userIdOrEmail: userId } as any);

			setAddedIds((prev) => {
				const next = [...prev, userId];
				persistAddedIds(next);
				return next;
			});
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

	// ---- New: invite by email input + preview + send
	const [emailInput, setEmailInput] = useState<string>("");
	const [emailError, setEmailError] = useState<string | null>(null);
	const [lookupLoading, setLookupLoading] = useState(false);
	const [lookupResult, setLookupResult] = useState<Friend | null>(null);
	const [sendingEmail, setSendingEmail] = useState(false);

	const validateEmail = (e?: string) => {
		if (!e) return false;
		// simple RFC-like regex (not perfect but ok for client-side quick check)
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(e.trim().toLowerCase());
	};

	useEffect(() => {
		// whenever emailInput changes, validate and attempt to lookup in loaded friends
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

		// quick local lookup in friends list
		const found =
			friends.find((f) => (f.email ?? "").toLowerCase() === val) ?? null;

		// simulate small delay for lookup UX (optional)
		const t = window.setTimeout(() => {
			setLookupResult(found);
			setLookupLoading(false);
		}, 150);

		return () => clearTimeout(t);
	}, [emailInput, friends]);

	const handleSendEmailInvite = async () => {
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
			// NOTE: adjust payload to backend expectation. Here we POST { email }
			await inviteToGroup(groupId, { userIdOrEmail: email } as any);

			// optional: clear input and show success state
			setEmailInput("");
			setLookupResult(null);
			// you can also show a toast here indicating success
		} catch (err) {
			console.error("Failed to invite by email:", err);
		} finally {
			setSendingEmail(false);
		}
	};

	// ---- end new

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
					Invite friends to <strong>{groupName}</strong>
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
							style={
								copiedInvite
									? {
											backgroundColor: `${theme.color.successBackground}`,
											color: `${theme.color.success}`,
											border: "1px solid `${theme.color.successBackground}`",
										}
									: {}
							}
						>
							{copiedInvite ? "Copied" : "Copy"}
						</CopyButton>
					</InviteBox>
				</div>

				<Divider />

				{/* New: invite by email area */}
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
								sendingEmail || !!emailError || emailInput.trim() === ""
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
												lookupResult.avatar_url ??
												`https://ui-avatars.com/api/?name=${encodeURIComponent(lookupResult.first_name)}`
											}
											alt={lookupResult.username}
										/>
										<NameContainer>
											<NameText>{`${lookupResult.first_name} ${lookupResult.last_name}`}</NameText>
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
								No friends found.
							</div>
						) : (
							filtered.map((u) => {
								const added = addedIds.includes(u.user_id);
								const adding = Boolean(addingMap[u.user_id]);

								const addBtnStyle: React.CSSProperties = added
									? {
											backgroundColor: "#10B981",
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
				</div>
			</Form>
		</SectionWrapper>
	);
}
