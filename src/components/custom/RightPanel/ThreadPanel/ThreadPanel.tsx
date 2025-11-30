import React from "react";
import ChatInput from "@/components/custom/ChatInput/ChatInput";
import {
	MessageInput,
	MessagesArea,
	PageWrapper,
	responsiveStyles,
} from "./ThreadPanel.styled";
import ThreadPanelHeader from "./parts/ThreadPanelHeader";
import ThreadSummary from "./parts/ThreadSummary";
import ThreadMessages from "./parts/ThreadMessages";
import ThreadEmptyState from "./parts/ThreadEmptyState";
import { useThreadPanelController } from "./useThreadPanelController";
import type { ThreadPanelProps } from "./types";

const ThreadPanel: React.FC<ThreadPanelProps> = (props) => {
	const {
		messagesProps,
		chatInputProps,
		isLoading,
		hasThreadSelected,
		threadName,
	} = useThreadPanelController(props);

	if (isLoading) {
		return (
			<PageWrapper>
				<div dangerouslySetInnerHTML={{ __html: responsiveStyles }}></div>
				<ThreadPanelHeader onClose={props.onClose} />
				<ThreadEmptyState message="Loading thread..." />
			</PageWrapper>
		);
	}

	if (!hasThreadSelected) {
		return (
			<PageWrapper>
				<ThreadPanelHeader onClose={props.onClose} />
				<ThreadEmptyState message="No thread selected." />
			</PageWrapper>
		);
	}

	return (
		<PageWrapper>
			<div dangerouslySetInnerHTML={{ __html: responsiveStyles }}></div>
			<ThreadPanelHeader onClose={props.onClose} />
			<MessagesArea>
				<ThreadSummary threadName={threadName} />
				<ThreadMessages {...messagesProps} />
			</MessagesArea>
			<MessageInput className="relative">
				<ChatInput {...chatInputProps} />
			</MessageInput>
		</PageWrapper>
	);
};

export default ThreadPanel;
