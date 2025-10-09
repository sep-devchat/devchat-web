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
import { Link } from "@tanstack/react-router";

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
							style={{ borderRadius: "50%" }}
						/>
					) : (
						"UK"
					)}
				</Avatar>
				<Name>
					{`${profile?.firstName} ${profile?.lastName}` || "Unknown User"}
				</Name>
			</ProfileInfo>
			<Link to="/settings" aria-label="Open settings">
				<SettingsButton>
					<Settings className="h-4 w-4" />
				</SettingsButton>
			</Link>
		</ProfileContainer>
	);
};

export default Profile;
