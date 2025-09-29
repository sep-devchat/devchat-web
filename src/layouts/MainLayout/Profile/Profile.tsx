import {
	ProfileContainer,
	ProfileInfo,
	Avatar,
	Name,
	SettingsButton,
} from "./Profile.styled";
import { Settings } from "lucide-react";

const Profile = () => {
	return (
		<ProfileContainer>
			<ProfileInfo>
				<Avatar>JD</Avatar>
				<Name>John Doe</Name>
			</ProfileInfo>
			<SettingsButton aria-label="Open settings">
				<Settings className="h-4 w-4" />
			</SettingsButton>
		</ProfileContainer>
	);
};

export default Profile;
