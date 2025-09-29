import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	ChatAreaContainer,
	MessagesViewport,
	MessageRow,
	Bubble,
	Composer,
} from "./ChatArea.styled";

export type ChatMessage = {
	id: string;
	author: "me" | "other";
	text: string;
};

type ChatAreaProps = {
	initialMessages?: ChatMessage[];
	onSend?: (text: string) => void;
};

const ChatArea: React.FC<ChatAreaProps> = ({
	initialMessages = [],
	onSend,
}) => {
	const [messages, setMessages] = React.useState<ChatMessage[]>([
		...initialMessages,
	]);
	const [text, setText] = React.useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const value = text.trim();
		if (!value) return;

		const msg: ChatMessage = {
			id: crypto.randomUUID(),
			author: "me",
			text: value,
		};
		setMessages((prev) => [msg, ...prev]); // add to bottom thanks to column-reverse
		setText("");
		onSend?.(value);
	};

	return (
		<ChatAreaContainer>
			<MessagesViewport>
				{messages.map((m) => (
					<MessageRow key={m.id} $mine={m.author === "me"}>
						<Bubble $mine={m.author === "me"}>{m.text}</Bubble>
					</MessageRow>
				))}
			</MessagesViewport>

			<Composer onSubmit={handleSubmit}>
				<Input
					value={text}
					onChange={(e) => setText(e.target.value)}
					placeholder="Write a message"
					className="shadow-none"
				/>
				<Button type="submit" disabled={!text.trim()}>
					Send
				</Button>
			</Composer>
		</ChatAreaContainer>
	);
};

export default ChatArea;
