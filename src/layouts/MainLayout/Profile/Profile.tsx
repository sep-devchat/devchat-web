import { useSelector, useDispatch } from "react-redux";
import {
	ProfileContainer,
	ProfileInfo,
	Avatar,
	Name,
	SettingsButton,
	ActionButton,
} from "./Profile.styled";
import { ListTodo, Settings } from "lucide-react";
import { RootState } from "@/store";
import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { fetchProfile } from "@/services/auth/authAPI";
import { setProfile } from "@/store/user.slice";

const ProfileSection = () => {
	const profile = useSelector((state: RootState) => state.user.profile);
	const dispatch = useDispatch();

	// Always fetch fresh profile data when component mounts or remounts
	useEffect(() => {
		const loadProfile = async () => {
			try {
				console.log("ProfileSection: Fetching fresh profile data...");
				const res = await fetchProfile();
				const data = res?.data ?? res;
				dispatch(setProfile(data));
				console.log("ProfileSection: Profile fetched successfully:", data);
			} catch (err) {
				console.error("ProfileSection: Failed to load profile:", err);
			}
		};
		loadProfile();
	}, [dispatch]);

	// Listen for profile updates from Settings page
	useEffect(() => {
		const handleProfileUpdate = async () => {
			try {
				console.log("ProfileSection: Received app:profileUpdated event");
				const res = await fetchProfile();
				const data = res?.data ?? res;
				dispatch(setProfile(data));
				console.log("ProfileSection: Profile updated from event:", data);
			} catch (err) {
				console.error(
					"ProfileSection: Failed to refresh profile from event:",
					err,
				);
			}
		};

		window.addEventListener("app:profileUpdated", handleProfileUpdate);
		return () => {
			window.removeEventListener("app:profileUpdated", handleProfileUpdate);
		};
	}, [dispatch]);

	return (
		<ProfileContainer>
			<ProfileInfo>
				<Avatar>
					{profile?.avatarUrl ? (
						<img
							src={profile.avatarUrl}
							alt={profile.firstName || "User"}
							style={{
								borderRadius: "50%",
								width: "100%",
								height: "100%",
								objectFit: "cover",
							}}
						/>
					) : (
						"UK"
					)}
				</Avatar>
				<Name>
					{`${profile?.firstName || ""} ${profile?.lastName || ""}`.trim() ||
						"Unknown User"}
				</Name>
			</ProfileInfo>
			<ActionButton>
				<SettingsButton
					onClick={() =>
						window.dispatchEvent(new CustomEvent("app:openTodoWindow"))
					}
				>
					<ListTodo className="h-4 w-4" />
				</SettingsButton>

				<Link to="/settings" aria-label="Open settings">
					<SettingsButton>
						<Settings className="h-4 w-4" />
					</SettingsButton>
				</Link>
			</ActionButton>
		</ProfileContainer>
	);
};

export default ProfileSection;
