import { createContext } from "react";

export interface AuthContextProps {
	profile?: any;
	refetchProfile: () => Promise<void>;
	isLoading: boolean;
}

export const AuthContext = createContext<AuthContextProps | null>(null);
