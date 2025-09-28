import { SocketContext } from "@/contexts/socket.context";
import cookieUtils from "@/services/cookieUtils";
import { SocketEvents } from "@/utils/constants";
import { PropsWithChildren, useEffect } from "react";
import { Socket } from "socket.io-client";

export interface SocketProviderProps extends PropsWithChildren {
	socket: Socket;
}

export default function SocketProvider({
	children,
	socket,
}: SocketProviderProps) {
	useEffect(() => {
		const handleConnect = () => {
			socket.emit(SocketEvents.AUTHENTICATE, {
				token: cookieUtils.getToken(),
			});
		};

		const handleException = (err: any) => {
			console.error("Socket exception:", err);
		};

		const handleAuthenticateFailed = () => {
			console.error("Socket authentication failed");
		};

		const handleReady = () => {
			console.log("Socket is ready");
		};

		socket.on(SocketEvents.CONNECT, handleConnect);
		socket.on(SocketEvents.EXCEPTION, handleException);
		socket.on(SocketEvents.AUTHENTICATE_FAILED, handleAuthenticateFailed);
		socket.on(SocketEvents.SOCKET_READY, handleReady);

		socket.connect();

		return () => {
			socket.off(SocketEvents.CONNECT, handleConnect);
			socket.off(SocketEvents.EXCEPTION, handleException);
			socket.off(SocketEvents.AUTHENTICATE_FAILED, handleAuthenticateFailed);
			socket.off(SocketEvents.SOCKET_READY, handleReady);
			if (!socket.disconnected) socket.disconnect();
		};
	}, [socket]);

	return (
		<SocketContext.Provider
			value={{
				socket,
			}}
		>
			{children}
		</SocketContext.Provider>
	);
}
