import { createContext } from "react";
import { Socket } from "socket.io-client";

export interface SocketContextProps {
	socket: Socket;
}

export const SocketContext = createContext<SocketContextProps | null>(null);
