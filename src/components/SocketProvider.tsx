import { SocketContext } from "@/contexts/socket.context";
import cookieUtils from "@/services/cookieUtils";
import { SocketEvents } from "@/utils/constants";
import {
	PropsWithChildren,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { Socket } from "socket.io-client";

export interface SocketProviderProps extends PropsWithChildren {
	socket: Socket;
}

export default function SocketProvider({
	children,
	socket,
}: SocketProviderProps) {
	const [connected, setConnected] = useState<boolean>(socket.connected);
	const [authenticating, setAuthenticating] = useState<boolean>(false);
	const [authenticated, setAuthenticated] = useState<boolean>(false);
	const [ready, setReady] = useState<boolean>(false);
	const readyResolversRef = useRef<Array<() => void>>([]);
	const readyStateRef = useRef<boolean>(false);

	useEffect(() => {
		readyStateRef.current = ready;
	}, [ready]);

	const flushReadyResolvers = useCallback(() => {
		if (readyResolversRef.current.length === 0) return;
		readyResolversRef.current.forEach((resolve) => resolve());
		readyResolversRef.current = [];
	}, []);

	const resetReadyState = useCallback(() => {
		setReady(false);
		readyStateRef.current = false;
	}, []);

	const authenticate = useCallback(() => {
		const token = cookieUtils.getToken();
		if (!token) {
			console.warn("[SocketProvider] Missing token, skip authenticate");
			setAuthenticating(false);
			setAuthenticated(false);
			resetReadyState();
			return;
		}
		if (!socket.connected) {
			socket.connect();
		}
		setAuthenticating(true);
		setAuthenticated(false);
		resetReadyState();
		socket.emit(SocketEvents.AUTHENTICATE, { token });
	}, [resetReadyState, socket]);

	const waitUntilReady = useCallback(() => {
		if (readyStateRef.current) {
			return Promise.resolve();
		}
		return new Promise<void>((resolve) => {
			readyResolversRef.current.push(resolve);
		});
	}, []);

	useEffect(() => {
		const handleConnect = () => {
			setConnected(true);
			authenticate();
		};

		const handleDisconnect = () => {
			setConnected(false);
			setAuthenticating(false);
			setAuthenticated(false);
			resetReadyState();
		};

		const handleException = (err: any) => {
			console.error("Socket exception:", err);
		};

		const handleAuthenticateFailed = () => {
			console.error("Socket authentication failed");
			setAuthenticating(false);
			setAuthenticated(false);
			resetReadyState();
		};

		const handleReady = () => {
			console.log("Socket is ready");
			setAuthenticating(false);
			setAuthenticated(true);
			setReady(true);
			readyStateRef.current = true;
			flushReadyResolvers();
		};

		const handleRequestAuthentication = () => {
			console.log("Socket requested authentication");
			authenticate();
		};

		socket.on(SocketEvents.CONNECT, handleConnect);
		socket.on(SocketEvents.EXCEPTION, handleException);
		socket.on("disconnect", handleDisconnect);
		socket.on(SocketEvents.AUTHENTICATE_FAILED, handleAuthenticateFailed);
		socket.on(SocketEvents.REQUEST_AUTHENTICATION, handleRequestAuthentication);
		socket.on(SocketEvents.SOCKET_READY, handleReady);

		if (!socket.connected) {
			socket.connect();
		} else {
			handleConnect();
		}

		return () => {
			socket.off(SocketEvents.CONNECT, handleConnect);
			socket.off(SocketEvents.EXCEPTION, handleException);
			socket.off("disconnect", handleDisconnect);
			socket.off(SocketEvents.AUTHENTICATE_FAILED, handleAuthenticateFailed);
			socket.off(
				SocketEvents.REQUEST_AUTHENTICATION,
				handleRequestAuthentication,
			);
			socket.off(SocketEvents.SOCKET_READY, handleReady);
			if (!socket.disconnected) {
				socket.disconnect();
			}
		};
	}, [authenticate, flushReadyResolvers, resetReadyState, socket]);

	const status = useMemo(
		() => ({
			connected,
			authenticating,
			authenticated,
			ready,
		}),
		[authenticated, authenticating, connected, ready],
	);
	return (
		<SocketContext.Provider
			value={{
				socket,
				status,
				authenticate,
				waitUntilReady,
			}}
		>
			{children}
		</SocketContext.Provider>
	);
}
