import React from "react";
import {
	UserCheck2,
	GroupIcon,
	File,
	ChartAreaIcon,
	KeyboardIcon,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../Setting.styled";
import SettingItemButton from "@/components/custom/SettingsItems/SettingItemButton";
import { SettingItemDropdown } from "@/components/custom/SettingsItems/SettingItemDropdown";
import { SettingItemSwitch } from "@/components/custom/SettingsItems/SettingItemSwitch";
import { userOptions } from "../options";

interface Props {
	keepAllowReadReceipts: boolean;
	setKeepAllowReadReceipts: () => void;
	allowAnalyzeContent: boolean;
	setAllowAnalyzeContent: () => void;
	userSetting: string;
	setUserSetting: (v: string) => void;
	allowKeyboardShortcuts: boolean;
	setAllowKeyboardShortcuts: () => void;
}

const PrivacySettings: React.FC<Props> = ({
	keepAllowReadReceipts,
	setKeepAllowReadReceipts,
	allowAnalyzeContent,
	setAllowAnalyzeContent,
	userSetting,
	setUserSetting,
	allowKeyboardShortcuts,
	setAllowKeyboardShortcuts,
}) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Privacy</CardTitle>
				<CardDescription>Adjust privacy and data sharing.</CardDescription>
			</CardHeader>
			<CardContent>
				<SettingItemButton
					icon={<UserCheck2 />}
					title="Manage how people can find you"
					description="Manage how people can find your profile on app by choosing which email addresses and phone numbers show up in search."
					buttons={[
						{
							text: "Manage contact information",
							variant: "secondary",
							onClick: () => console.log("Manage contact information clicked"),
						},
					]}
				/>
				<SettingItemDropdown
					icon={<GroupIcon size={20} />}
					title="Manage who can add you to groups"
					description="Choose whether anyone on Teams or only your contacts can add you to group chats."
					value={userSetting}
					options={userOptions}
					onChange={setUserSetting}
					showInfoButton={false}
				/>
				<SettingItemSwitch
					icon={<File size={20} />}
					title="Read receipts"
					description="Let people know when you’ve seen their messages and know when they’ve seen yours."
					checked={keepAllowReadReceipts}
					onChange={setKeepAllowReadReceipts}
				/>
				<SettingItemSwitch
					icon={<ChartAreaIcon size={20} />}
					title="Experiences that analyze your content"
					description="Allow Teams to analyze your content to help you create, communicate, and collaborate more effectively."
					checked={allowAnalyzeContent}
					onChange={setAllowAnalyzeContent}
				/>
				<SettingItemButton
					icon={<File />}
					title="Your profile"
					description="Manage what contact information people can see when they view your profile card."
					buttons={[
						{
							text: "Manage Profile",
							variant: "secondary",
							onClick: () => console.log("Manage profile clicked"),
						},
					]}
				/>
				<SettingItemSwitch
					icon={<KeyboardIcon size={20} />}
					title="Keyboard shortcut to unmute"
					description="Press and hold Ctrl + Spacebar to temporarily unmute your mic during a meeting."
					checked={allowKeyboardShortcuts}
					onChange={setAllowKeyboardShortcuts}
				/>
			</CardContent>
		</Card>
	);
};

export default PrivacySettings;
