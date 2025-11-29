import React from "react";
import { MessagesArea } from "../ThreadPanel.styled";

interface ThreadEmptyStateProps {
	message: string;
}

const ThreadEmptyState: React.FC<ThreadEmptyStateProps> = ({ message }) => (
	<MessagesArea>
		<div className="p-10 text-center text-gray-500">{message}</div>
	</MessagesArea>
);

export default ThreadEmptyState;
