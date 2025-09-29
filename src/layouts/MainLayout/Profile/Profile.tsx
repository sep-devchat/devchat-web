import { useSelector } from "react-redux";
import {
	ProfileContainer,
	ProfileInfo,
	Avatar,
	Name,
	SettingsButton,
} from "./Profile.styled";
import { Settings } from "lucide-react";
import { RootState } from "@/store";

const Profile = () => {
	const profile = useSelector((state: RootState) => state.user.profile);
	return (
		<ProfileContainer>
			<ProfileInfo>
				<Avatar>
					{profile?.avatarUrl ? (
						<img
							src={profile.avatarUrl}
							alt={profile.firstName}
							className="rounded-full"
						/>
					) : (
						"UK"
					)}
				</Avatar>
				<Name>
					{`${profile?.firstName} ${profile?.lastName}` || "Unknown User"}
				</Name>
			</ProfileInfo>
			<SettingsButton aria-label="Open settings">
				<Settings className="h-4 w-4" />
			</SettingsButton>
		</ProfileContainer>
	);
};

export default Profile;
