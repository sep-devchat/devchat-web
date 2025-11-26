import React from "react";
import { ChatAreaContainer } from "./ChatArea.styled";
import ThreadHeader from "./ThreadHeader";
import ChatInput from "../ChatInput/ChatInput";
import { DirectMessageHeader } from "./parts/DirectMessageHeader";
import ChatMessagesViewport from "./parts/ChatMessagesViewport";
import ChatDialogs from "./parts/ChatDialogs";
import { useChatAreaController } from "./useChatAreaController";

const ChatArea: React.FC = () => {
	const {
		shouldShowDirectHeader,
		directHeaderProps,
		shouldShowThreadHeader,
		thread,
		messagesViewportProps,
		chatDialogsProps,
		chatInputProps,
	} = useChatAreaController();

	return (
		<ChatAreaContainer>
			{shouldShowDirectHeader && directHeaderProps && (
				<DirectMessageHeader {...directHeaderProps} />
			)}
			{shouldShowThreadHeader && <ThreadHeader thread={thread} />}

			<ChatMessagesViewport {...messagesViewportProps} />
			<ChatDialogs {...chatDialogsProps} />
			<ChatInput {...chatInputProps} />
		</ChatAreaContainer>
	);
};

export default ChatArea;
