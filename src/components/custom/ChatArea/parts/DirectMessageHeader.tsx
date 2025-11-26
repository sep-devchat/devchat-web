import React from "react";
import { UserResponse } from "@/services/userAPI";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

export interface DirectMessageHeaderProps {
	opponent: UserResponse | null | undefined;
	loading: boolean;
	error: boolean;
	isFriend: boolean;
	isPending: boolean;
	isInvite: boolean;
	onAddFriend: () => Promise<void> | void;
	onRemoveFriend: () => Promise<void> | void;
	onAcceptInvite: () => Promise<void> | void;
	onDenyInvite: () => Promise<void> | void;
	onBlock: () => void;
	onOpenReport: () => void;
}

export const DirectMessageHeader: React.FC<DirectMessageHeaderProps> = ({
	opponent,
	loading,
	error,
	isFriend,
	isPending,
	isInvite,
	onAddFriend,
	onRemoveFriend,
	onAcceptInvite,
	onDenyInvite,
	onBlock,
	onOpenReport,
}) => {
	const [confirmOpen, setConfirmOpen] = React.useState(false);
	const [removing, setRemoving] = React.useState(false);

	// Local optimistic status to switch buttons immediately after actions
	type LocalStatus = "friend" | "pending" | "invite" | "none";
	const computedStatus: LocalStatus = isFriend
		? "friend"
		: isPending
			? "pending"
			: isInvite
				? "invite"
				: "none";
	const [status, setStatus] = React.useState<LocalStatus>(computedStatus);
	const [busy, setBusy] = React.useState(false);

	// Keep local status in sync when props change (e.g., after server refresh)
	React.useEffect(() => {
		setStatus(computedStatus);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isFriend, isPending, isInvite]);

	const handleAddFriend = async () => {
		if (busy) return;
		const prev = status;
		setStatus("pending");
		setBusy(true);
		try {
			await Promise.resolve(onAddFriend?.());
		} catch (e: any) {
			setStatus(prev);
			toast.error(e?.message || "Failed to send friend request");
		} finally {
			setBusy(false);
		}
	};

	const handleAcceptInvite = async () => {
		if (busy) return;
		const prev = status;
		setStatus("friend");
		setBusy(true);
		try {
			await Promise.resolve(onAcceptInvite?.());
		} catch (e: any) {
			setStatus(prev);
			toast.error(e?.message || "Failed to accept invite");
		} finally {
			setBusy(false);
		}
	};

	const handleDenyInvite = async () => {
		if (busy) return;
		const prev = status;
		setStatus("none");
		setBusy(true);
		try {
			await Promise.resolve(onDenyInvite?.());
		} catch (e: any) {
			setStatus(prev);
			toast.error(e?.message || "Failed to deny invite");
		} finally {
			setBusy(false);
		}
	};

	return (
		<div className="w-full bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/50 sticky top-0 z-10">
			<div className="flex items-center justify-between gap-4 px-4 py-3">
				<div className="flex items-center gap-3 min-w-0">
					{opponent?.avatarUrl ? (
						<img
							src={opponent.avatarUrl}
							alt={opponent.username}
							className="h-10 w-10 rounded-full object-cover"
						/>
					) : (
						<div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
							{(
								opponent?.firstName?.[0] ||
								opponent?.username?.[0] ||
								"?"
							).toUpperCase()}
						</div>
					)}
					<div className="flex flex-col min-w-0">
						<div className="flex items-center gap-2 min-w-0">
							<span className="font-semibold truncate">
								{loading
									? "Loading..."
									: [opponent?.firstName, opponent?.lastName]
											.filter(Boolean)
											.join(" ") ||
										opponent?.username ||
										"Unknown"}
							</span>
							{opponent?.username && (
								<span className="text-xs text-muted-foreground truncate">
									@{opponent.username}
								</span>
							)}
						</div>
						<span className="text-xs text-muted-foreground truncate">
							{error
								? "Couldn't load user details"
								: "You're starting a private conversation. Only you two can see these messages."}
						</span>
					</div>
				</div>
				<div className="flex items-center gap-2">
					{status === "friend" ? (
						<Button
							variant="secondary"
							size="sm"
							onClick={() => setConfirmOpen(true)}
						>
							Remove friend
						</Button>
					) : status === "pending" ? (
						<Button variant="secondary" size="sm" disabled>
							Pending
						</Button>
					) : status === "invite" ? (
						<>
							<Button
								size="sm"
								className="bg-green-400 text-white hover:bg-green-500"
								onClick={handleAcceptInvite}
								disabled={busy}
							>
								Accept
							</Button>
							<Button
								size="sm"
								className="bg-red-500 text-white hover:bg-red-600"
								onClick={handleDenyInvite}
								disabled={busy}
							>
								Deny
							</Button>
						</>
					) : (
						<Button
							variant="default"
							size="sm"
							onClick={handleAddFriend}
							disabled={busy}
						>
							Add friend
						</Button>
					)}
					<Button variant="secondary" size="sm" onClick={onBlock}>
						Block
					</Button>
					<Button variant="outline" size="sm" onClick={onOpenReport}>
						Report
					</Button>
				</div>
			</div>
			<Separator />

			{/* Confirm remove friend dialog */}
			<Dialog
				open={confirmOpen}
				onOpenChange={(o) => !removing && setConfirmOpen(o)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Remove friend?</DialogTitle>
						<DialogDescription>
							This will remove{" "}
							<strong>
								{[opponent?.firstName, opponent?.lastName]
									.filter(Boolean)
									.join(" ") ||
									opponent?.username ||
									"user"}
							</strong>{" "}
							from your friends list. You can add them again later.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setConfirmOpen(false)}
							disabled={removing}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={async () => {
								try {
									setRemoving(true);
									await onRemoveFriend();
									setConfirmOpen(false);
								} catch (e: any) {
									toast.error(e?.message || "Failed to remove friend");
								} finally {
									setRemoving(false);
								}
							}}
							disabled={removing}
						>
							{removing ? "Removing..." : "Remove"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};
