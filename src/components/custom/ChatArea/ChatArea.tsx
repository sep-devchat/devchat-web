import React from "react";
import { ChatAreaContainer } from "./ChatArea.styled";
import ChatInput from "../ChatInput/ChatInput";
import { DirectMessageHeader } from "./parts/DirectMessageHeader";
import ChatMessagesViewport from "./parts/ChatMessagesViewport";
import ChatDialogs from "./parts/ChatDialogs";
import { useChatAreaController } from "./useChatAreaController";

const ChatArea: React.FC = () => {
	const {
		shouldShowDirectHeader,
		directHeaderProps,
		messagesViewportProps,
		chatDialogsProps,
		chatInputProps,
	} = useChatAreaController();

	return (
		<ChatAreaContainer>
			{shouldShowDirectHeader && directHeaderProps && (
				<DirectMessageHeader {...directHeaderProps} />
			)}
			<ChatMessagesViewport {...messagesViewportProps} />
			<ChatDialogs {...chatDialogsProps} />
			<ChatInput {...chatInputProps} />
		</ChatAreaContainer>
	);
};

export default ChatArea;
