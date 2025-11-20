import { useSelector } from "react-redux";
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

const ProfileSection = () => {
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
