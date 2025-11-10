import React from "react";
import {
	UserCheck2,
	GroupIcon,
	File,
	ChartAreaIcon,
	User2Icon,
	KeyboardIcon,
} from "lucide-react";
import SettingItemButton from "@/components/custom/SettingsItems/SettingItemButton";
import { SettingItemDropdown } from "@/components/custom/SettingsItems/SettingItemDropdown";
import { SettingItemSwitch } from "@/components/custom/SettingsItems/SettingItemSwitch";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../Setting.styled";

type Props = {
	userSetting: string;
	setUserSetting: (v: string) => void;
	userOptions: { value: string; label: string }[];
	keepAllowReadReceipts: boolean;
	setKeepAllowReadReceipts: (v: boolean) => void;
	allowAnalyzeContent: boolean;
	setAllowAnalyzeContent: (v: boolean) => void;
	allowKeyboardShortcuts: boolean;
	setAllowKeyboardShortcuts: (v: boolean) => void;
};

export const PrivacySettings: React.FC<Props> = ({
	userSetting,
	setUserSetting,
	userOptions,
	keepAllowReadReceipts,
	setKeepAllowReadReceipts,
	allowAnalyzeContent,
	setAllowAnalyzeContent,
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
					onChange={() => setKeepAllowReadReceipts(!keepAllowReadReceipts)}
				/>
				<SettingItemSwitch
					icon={<ChartAreaIcon size={20} />}
					title="Experiences that analyze your content"
					description="Allow Teams to analyze your content to help you create, communicate, and collaborate more effectively."
					checked={allowAnalyzeContent}
					onChange={() => setAllowAnalyzeContent(!allowAnalyzeContent)}
				/>
				<SettingItemButton
					icon={<User2Icon />}
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
					onChange={() => setAllowKeyboardShortcuts(!allowKeyboardShortcuts)}
				/>
			</CardContent>
		</Card>
	);
};

export default PrivacySettings;
