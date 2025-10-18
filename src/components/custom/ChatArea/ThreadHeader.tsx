import React from "react";
import { formatMessageTime } from "./ChatArea.helpers";

type Thread = {
	id: string;
	name?: string;
	description?: string;
	createdAt?: string;
};

const ThreadHeader: React.FC<{ thread: Thread | null }> = ({ thread }) => {
	if (!thread) return null;
	return (
		<div className="mb-3 rounded-lg border bg-muted/50 p-3">
			<div className="flex items-center justify-between">
				<div>
					<div className="text-sm font-semibold">
						Thread: {thread.name || thread.id}
					</div>
					{thread.description && (
						<div className="text-xs text-muted-foreground mt-1">
							{thread.description}
						</div>
					)}
				</div>
				<div className="text-xs text-muted-foreground">
					{thread.createdAt ? formatMessageTime(thread.createdAt) : ""}
				</div>
			</div>
		</div>
	);
};

export default ThreadHeader;
