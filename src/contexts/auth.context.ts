import { Profile } from "@/services/auth/auth.type";
import { createContext } from "react";

export interface AuthContextProps {
	profile: Profile | null;
	refetchProfile: () => Promise<void>;
	isLoading: boolean;
	setProfile: (profile: Profile | null) => void;
}

export const AuthContext = createContext<AuthContextProps | null>(null);
