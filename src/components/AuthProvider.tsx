import { AuthContext } from "@/contexts/auth.context";
import { fetchProfile } from "@/services/authAPI";
import { PropsWithChildren, useEffect, useState } from "react";

export default function AuthProvider({ children }: PropsWithChildren) {
	const [profile, setProfile] = useState<any>();
	const [isLoading, setIsLoading] = useState(false);
	const refetchProfile = async () => {
		setIsLoading(true);
		const data = await fetchProfile();
		setIsLoading(false);
		setProfile(data);
	};

	useEffect(() => {
		refetchProfile();
	}, []);

	return (
		<AuthContext.Provider
			value={{
				profile,
				refetchProfile,
				isLoading,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
