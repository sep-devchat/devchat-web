import { AuthContext } from "@/contexts/auth.context";
import { fetchProfile } from "@/services/authAPI";
import { PropsWithChildren, useEffect, useState } from "react";

export default function AuthProvider({ children }: PropsWithChildren) {
	const [profile, setProfile] = useState<any>();
	const [isLoading, setIsLoading] = useState(true);
	const refetchProfile = async () => {
		setIsLoading(true);
		try {
			const data = await fetchProfile();
			setProfile(data.data);
		} catch (err) {
			console.log(err);
			setProfile(undefined);
		}
		setIsLoading(false);
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
