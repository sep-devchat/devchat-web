import { AuthContext } from "@/contexts/auth.context";
import { useContext } from "react";

function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
	return ctx;
}

export default useAuth;
