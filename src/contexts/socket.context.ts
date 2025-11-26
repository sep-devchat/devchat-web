import { createContext } from "react";
import { Socket } from "socket.io-client";

export interface SocketStatus {
	connected: boolean;
	authenticating: boolean;
	authenticated: boolean;
	ready: boolean;
}

export interface SocketContextProps {
	socket: Socket;
	status: SocketStatus;
	authenticate: () => void;
	waitUntilReady: () => Promise<void>;
}

export const SocketContext = createContext<SocketContextProps | null>(null);
