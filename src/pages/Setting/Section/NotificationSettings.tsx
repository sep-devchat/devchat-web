import React from "react";
import { BellIcon, Monitor, MessageSquare, Volume2 } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../Setting.styled"; // adjust path if different
import { SettingItemSwitch } from "@/components/custom/SettingsItems/SettingItemSwitch";
import { SettingItemRadio } from "@/components/custom/SettingsItems/SettingItemRadio";
import { SettingItemDropdown } from "@/components/custom/SettingsItems/SettingItemDropdown";
import { soundOptions, reactionOptions } from "../options";

interface Props {
	muteAll: boolean;
	setMuteAll: () => void;
	enableDesktop: boolean;
	setEnableDesktop: () => void;
	enableUnread: boolean;
	setEnableUnread: () => void;
	selectedReaction: string;
	setSelectedReaction: (v: string) => void;
	soundSetting: string;
	setSoundSetting: (v: string) => void;
	onSoundInfoClick?: () => void;
}

const NotificationSettings: React.FC<Props> = ({
	muteAll,
	setMuteAll,
	enableDesktop,
	setEnableDesktop,
	enableUnread,
	setEnableUnread,
	selectedReaction,
	setSelectedReaction,
	soundSetting,
	setSoundSetting,
	onSoundInfoClick,
}) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Notification and activity</CardTitle>
				<CardDescription>
					Manage notifications and recent activities
				</CardDescription>
			</CardHeader>
			<CardContent>
				<SettingItemSwitch
					icon={<BellIcon size={20} />}
					title="Mute all notifications (except for calls and messages)"
					checked={muteAll}
					onChange={setMuteAll}
				/>

				<SettingItemSwitch
					icon={<Monitor size={20} />}
					title="Enable Desktop Notifications"
					description="If you're looking for on-demand or per-server notifications, right-click the Discord server icon and select Notification Settings."
					checked={enableDesktop}
					onChange={setEnableDesktop}
				/>

				<SettingItemSwitch
					icon={<MessageSquare size={20} />}
					title="Enable Unread Message Badge"
					description="Shows a red badge on the app icon when you have unread messages."
					checked={enableUnread}
					onChange={setEnableUnread}
				/>

				<SettingItemRadio
					icon={<BellIcon size={20} />}
					title="Reaction Notifications"
					description="Get push notifications when your messages are reacted to."
					selectedValue={selectedReaction}
					options={reactionOptions}
					onChange={setSelectedReaction}
					name="reaction"
				/>

				<SettingItemDropdown
					icon={<Volume2 size={20} />}
					title="Sound"
					description="Play sounds with notifications"
					value={soundSetting}
					options={soundOptions}
					onChange={setSoundSetting}
					showInfoButton={true}
					onInfoClick={onSoundInfoClick}
				/>
			</CardContent>
		</Card>
	);
};

export default NotificationSettings;
