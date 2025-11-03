/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash, AlertTriangle, Loader2 } from "lucide-react";
import { detailGroup } from "@/services/groupAPI";
import { useParams } from "@tanstack/react-router";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { deleteMemberGroup } from "@/services/userGroupAPI";

type AlertType = "success" | "warning" | "error";
const fireAlert = (type: AlertType, message: string, duration = 4000) => {
	if (typeof window === "undefined") return;
	window.dispatchEvent(
		new CustomEvent("app:alert", { detail: { type, message, duration } }),
	);
};

interface GroupSettingProps {
	setSettingSelect: (value: boolean) => void;
}

export const OutGroupSection: React.FC<GroupSettingProps> = ({
	setSettingSelect,
}) => {
	const params = useParams({ strict: false }) as { groupId?: string };
	const groupId = params.groupId;
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [groupName, setGroupName] = useState<string>("");
	const [confirmText, setConfirmText] = useState("");
	const [fetching, setFetching] = useState(false);
	const currentUserProfile = useSelector(
		(state: RootState) => state.user.profile,
	);
	const currentUserId = currentUserProfile?.id || "";

	useEffect(() => {
		// Open dialog when this component mounts
		setOpen(true);

		const fetch = async () => {
			if (!groupId) return;
			try {
				setFetching(true);
				const res = await detailGroup(groupId);
				const payload = (res && (res.data ?? res)) as any;
				setGroupName(payload?.name ?? "");
			} catch (err) {
				console.error("Failed to fetch group detail:", err);
				fireAlert("warning", "Unable to load group information from server");
			} finally {
				setFetching(false);
			}
		};

		fetch();
	}, [groupId]);

	const handleClose = () => {
		setOpen(false);
		setSettingSelect(false);
	};

	const handleLeave = async () => {
		if (!groupId) return;
		// require exact match (trimmed) to avoid accidental leaving
		if (confirmText.trim() !== groupName) return;
		try {
			setLoading(true);
			await deleteMemberGroup(groupId, { userId: currentUserId } as any);
			fireAlert("success", "You have left the group");
			setOpen(false);
			setSettingSelect(false);
		} catch (err: any) {
			console.error("Leave group failed:", err);
			const message =
				err?.response?.data?.message ?? err?.message ?? "Operation failed";
			fireAlert("error", `Failed to leave group: ${String(message)}`);
		} finally {
			setLoading(false);
			setSettingSelect(false);
		}
	};

	const canConfirm = () => {
		if (!groupName) return false;
		return confirmText.trim() === groupName && !fetching && !loading;
	};

	return (
		<Dialog open={open} onOpenChange={(val) => setOpen(val)}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>
						Leave group {groupName ? `"${groupName}"` : ""}
					</DialogTitle>
					<DialogDescription>
						<div
							className="flex items-start gap-3 mt-2"
							style={{ color: "#7a5e00" }}
						>
							<div
								className="p-2 rounded-md"
								style={{ background: "#fff6e5", border: "1px solid #f1e0b8" }}
							>
								<AlertTriangle />
							</div>
							<div>
								<p className="font-medium">
									Are you sure you want to leave this group?
								</p>
								<p className="text-sm mt-1">
									If you leave, you will no longer be a member and may lose
									access to group resources.
								</p>
							</div>
						</div>
					</DialogDescription>
				</DialogHeader>

				<div className="mt-4">
					<Label>Type the group name to confirm</Label>
					<Input
						value={confirmText}
						onChange={(e) => setConfirmText(e.target.value)}
						placeholder={groupName || "Group name"}
						autoFocus
						style={{ marginTop: 8 }}
						aria-label="confirm-group-name"
					/>
					{groupName && (
						<p className="text-xs mt-2">
							Please type the exact <strong>group name</strong> to confirm:{" "}
							<em>{groupName}</em>
						</p>
					)}
					{fetching && (
						<p className="text-sm mt-2">Loading group information...</p>
					)}
				</div>

				<DialogFooter className="flex justify-end gap-2 mt-5">
					<DialogClose asChild>
						<Button variant="ghost" onClick={handleClose} disabled={loading}>
							Cancel
						</Button>
					</DialogClose>

					<Button
						variant="destructive"
						onClick={handleLeave}
						disabled={!canConfirm()}
						aria-disabled={!canConfirm()}
					>
						{loading ? (
							<span className="inline-flex items-center gap-2">
								<Loader2 className="animate-spin" size={16} /> Leaving...
							</span>
						) : (
							<span className="inline-flex items-center gap-2">
								<Trash size={16} /> Leave Group
							</span>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
