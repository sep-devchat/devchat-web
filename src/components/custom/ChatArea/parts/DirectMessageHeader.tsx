import React from "react";
import { UserResponse } from "@/services/userAPI";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface DirectMessageHeaderProps {
	opponent: UserResponse | null | undefined;
	loading: boolean;
	error: boolean;
	isFriend: boolean;
	onAddFriend: () => Promise<void> | void;
	onRemoveFriend: () => Promise<void> | void;
	onBlock: () => void;
	onOpenReport: () => void;
}

export const DirectMessageHeader: React.FC<DirectMessageHeaderProps> = ({
	opponent,
	loading,
	error,
	isFriend,
	onAddFriend,
	onRemoveFriend,
	onBlock,
	onOpenReport,
}) => {
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
					{isFriend ? (
						<Button
							variant="secondary"
							size="sm"
							onClick={async () => {
								try {
									await onRemoveFriend();
								} catch (e: any) {
									toast.error(e?.message || "Failed to remove friend");
								}
							}}
						>
							Remove friend
						</Button>
					) : (
						<Button
							variant="default"
							size="sm"
							onClick={async () => {
								try {
									await onAddFriend();
								} catch (e: any) {
									toast.error(e?.message || "Failed to send friend request");
								}
							}}
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
		</div>
	);
};
