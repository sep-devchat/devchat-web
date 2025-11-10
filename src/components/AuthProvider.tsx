import { AuthContext } from "@/contexts/auth.context";
import { PropsWithChildren, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentProfile } from "@/store/user.slice";
import { AppDispatch, RootState } from "@/store";

export default function AuthProvider({ children }: PropsWithChildren) {
	const dispatch = useDispatch<AppDispatch>();
	const profile = useSelector((s: RootState) => s.user.profile);
	const isLoading = useSelector((s: RootState) => s.user.loading);

	const refetchProfile = async () => {
		await dispatch(fetchCurrentProfile());
	};

	useEffect(() => {
		dispatch(fetchCurrentProfile());
	}, [dispatch]);

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
