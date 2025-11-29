import React from "react";
import { Hash } from "lucide-react";
import { CPTitle, ThreadIcon } from "../ThreadPanel.styled";

interface ThreadSummaryProps {
	threadName: string;
}

const ThreadSummary: React.FC<ThreadSummaryProps> = ({ threadName }) => (
	<div className="mb-5 flex flex-row items-center gap-1.5 p-3 text-center">
		<ThreadIcon>
			<Hash size={24} />
		</ThreadIcon>
		<CPTitle className="!text-2xl !font-bold">{threadName}</CPTitle>
	</div>
);

export default ThreadSummary;
