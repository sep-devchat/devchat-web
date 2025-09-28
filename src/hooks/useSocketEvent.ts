import { useEffect } from "react";
import useSocket from "./useSocket";

const useSocketEvent = (
	eventName: string,
	handler: (...args: any[]) => void,
) => {
	const { socket } = useSocket();

	useEffect(() => {
		socket.on(eventName, handler);
		return () => {
			socket.off(eventName, handler);
		};
	}, [eventName, handler, socket]);
};

export default useSocketEvent;
