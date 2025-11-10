import React from "react";
import { LanguagesIcon, Menu } from "lucide-react";
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
	languageSetting: string;
	setLanguageSetting: (v: string) => void;
	languageOptions: { value: string; label: string }[];
	keepAppBarVisible: boolean;
	setKeepAppBarVisible: (v: boolean) => void;
};

export const GeneralSettings: React.FC<Props> = ({
	languageSetting,
	setLanguageSetting,
	languageOptions,
	keepAppBarVisible,
	setKeepAppBarVisible,
}) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>General</CardTitle>
				<CardDescription>
					Settings for language, translation, display, and suggested replies.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<SettingItemDropdown
					icon={<LanguagesIcon size={20} />}
					title="Language"
					description="Restart Teams to apply these settings"
					value={languageSetting}
					options={languageOptions}
					onChange={setLanguageSetting}
					showInfoButton={false}
				/>
				<SettingItemSwitch
					icon={<Menu size={20} />}
					title="Keep the app bar visible when resizing"
					description="When reducing the size of your Teams window, the app bar will remain visible for most window sizes."
					checked={keepAppBarVisible}
					onChange={() => setKeepAppBarVisible(!keepAppBarVisible)}
				/>
			</CardContent>
		</Card>
	);
};

export default GeneralSettings;
