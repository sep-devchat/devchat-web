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
import { Trash } from "lucide-react";
import { detailGroup, deleteGroup } from "@/services/groupAPI";
import { useParams } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";

type AlertType = "success" | "warning" | "error";
const fireAlert = (type: AlertType, message: string, duration = 4000) => {
	if (typeof window === "undefined") return;
	window.dispatchEvent(
		new CustomEvent("app:alert", { detail: { type, message, duration } }),
	);
};

export default function DeleteSection() {
	const params = useParams({ strict: false }) as { groupId?: string };
	const groupId = params.groupId;
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [groupName, setGroupName] = useState<string>("");
	const [confirmText, setConfirmText] = useState("");
	const [fetching, setFetching] = useState(false);

	useEffect(() => {
		// Khi component mount (do parent render khi click tab) => auto open dialog
		setOpen(true);

		// fetch group name for showing in dialog
		const fetch = async () => {
			if (!groupId) return;
			try {
				setFetching(true);
				const res = await detailGroup(groupId);
				const payload = (res && (res.data ?? res)) as any;
				setGroupName(payload?.name ?? "");
			} catch (err) {
				console.error("Failed to fetch group detail:", err);
				fireAlert("warning", "Failed to load server info");
			} finally {
				setFetching(false);
			}
		};

		fetch();
	}, [groupId]);

	const handleClose = () => {
		setOpen(false);
	};

	const handleDelete = async () => {
		if (!groupId) return;
		if (confirmText !== groupName) return;
		try {
			setLoading(true);
			await deleteGroup(groupId);
			fireAlert("success", "Delete successful");
			setOpen(false);
			// optionally: navigate away or signal parent to close settings
			// e.g. window.dispatchEvent(new CustomEvent('app:group-deleted', { detail: { id: groupId } }))
		} catch (err: any) {
			console.error("Delete failed:", err);
			const message =
				err?.response?.data?.message ?? err?.message ?? "Delete failed";
			fireAlert("error", `Delete failed: ${String(message)}`);
		} finally {
			setLoading(false);
			navigate({ to: "/chat" });
		}
	};

	// If no group id, show dialog but with message
	return (
		<Dialog open={open} onOpenChange={(val) => setOpen(val)}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>
						Delete {groupName ? `'${groupName}'` : "server"}
					</DialogTitle>
					<DialogDescription>
						{/* warning box like image */}
						<div
							style={{
								background: "#fff6e5",
								border: "1px solid #f1e0b8",
								padding: 12,
								borderRadius: 6,
								marginTop: 8,
								color: "#7a5e00",
							}}
						>
							Are you sure you want to delete{" "}
							<strong>{groupName || "this server"}</strong>? <br />
							This action cannot be undone.
						</div>
					</DialogDescription>
				</DialogHeader>

				<div style={{ marginTop: 14 }}>
					<Label>Enter server name</Label>
					<Input
						value={confirmText}
						onChange={(e) => setConfirmText(e.target.value)}
						placeholder={groupName || "Server name"}
						style={{ marginTop: 8 }}
					/>
				</div>

				<DialogFooter
					style={{
						display: "flex",
						justifyContent: "flex-end",
						gap: 8,
						marginTop: 18,
					}}
				>
					<DialogClose asChild>
						<Button variant="ghost" onClick={handleClose}>
							Cancel
						</Button>
					</DialogClose>

					<Button
						variant="destructive"
						onClick={handleDelete}
						disabled={
							loading || confirmText !== groupName || fetching || !groupName
						}
					>
						{loading ? (
							"Deleting..."
						) : (
							<span
								style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
							>
								<Trash size={16} /> Delete Server
							</span>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
