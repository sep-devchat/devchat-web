import { SocketContext } from "@/contexts/socket.context";
import { useContext } from "react";

const useSocket = () => {
	const ctx = useContext(SocketContext);
	if (!ctx) throw new Error("useSocket must be used within a SocketProvider");
	return ctx;
};

export default useSocket;
