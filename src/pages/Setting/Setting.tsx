import React, { useState } from "react";
import { SettingsMenu } from "@/components/custom/SettingsMenu/SettingsMenu";
import NotificationSettings from "./Section/NotificationSettings";
import GeneralSettings from "./Section/GeneralSettings";
import AppearanceSettings from "./Section/AppearanceSettings";
import PrivacySettings from "./Section/PrivacySettings";
import AccountSettings from "./Section/AccountSetting/AccountSettings";

type SettingsSection =
	| "general"
	| "appearance"
	| "notification"
	| "account"
	| "privacy";

export const SettingPage: React.FC = () => {
	const [activeSection, setActiveSection] =
		useState<SettingsSection>("general");

	// notification state
	const [muteAll, setMuteAll] = useState(false);
	const [enableDesktop, setEnableDesktop] = useState(false);
	const [enableUnread, setEnableUnread] = useState(true);
	const [selectedReaction, setSelectedReaction] = useState("All");
	const [soundSetting, setSoundSetting] = useState("Default");

	// general
	const [languageSetting, setLanguageSetting] = useState(
		"English (United States)",
	);
	const [keepAppBarVisible, setKeepAppBarVisible] = useState(false);

	// appearance
	const [selectedTimeFormat, setSelectedTimeFormat] = useState("Auto");

	// privacy
	const [keepAllowReadReceipts, setKeepAllowReadReceipts] = useState(true);
	const [allowAnalyzeContent, setAllowAnalyzeContent] = useState(false);
	const [userSetting, setUserSetting] = useState("Anyone");
	const [allowKeyboardShortcuts, setAllowKeyboardShortcuts] = useState(true);

	const handleSoundInfoClick = () => {
		console.log("Sound info clicked");
	};

	const renderContent = () => {
		switch (activeSection) {
			case "notification":
				return (
					<NotificationSettings
						muteAll={muteAll}
						setMuteAll={() => setMuteAll(!muteAll)}
						enableDesktop={enableDesktop}
						setEnableDesktop={() => setEnableDesktop(!enableDesktop)}
						enableUnread={enableUnread}
						setEnableUnread={() => setEnableUnread(!enableUnread)}
						selectedReaction={selectedReaction}
						setSelectedReaction={setSelectedReaction}
						soundSetting={soundSetting}
						setSoundSetting={setSoundSetting}
						onSoundInfoClick={handleSoundInfoClick}
					/>
				);
			case "general":
				return (
					<GeneralSettings
						languageSetting={languageSetting}
						setLanguageSetting={setLanguageSetting}
						keepAppBarVisible={keepAppBarVisible}
						setKeepAppBarVisible={() =>
							setKeepAppBarVisible(!keepAppBarVisible)
						}
					/>
				);
			case "appearance":
				return (
					<AppearanceSettings
						selectedTimeFormat={selectedTimeFormat}
						setSelectedTimeFormat={setSelectedTimeFormat}
					/>
				);
			case "account":
				return <AccountSettings />;
			case "privacy":
				return (
					<PrivacySettings
						keepAllowReadReceipts={keepAllowReadReceipts}
						setKeepAllowReadReceipts={() =>
							setKeepAllowReadReceipts(!keepAllowReadReceipts)
						}
						allowAnalyzeContent={allowAnalyzeContent}
						setAllowAnalyzeContent={() =>
							setAllowAnalyzeContent(!allowAnalyzeContent)
						}
						userSetting={userSetting}
						setUserSetting={setUserSetting}
						allowKeyboardShortcuts={allowKeyboardShortcuts}
						setAllowKeyboardShortcuts={() =>
							setAllowKeyboardShortcuts(!allowKeyboardShortcuts)
						}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<SettingsMenu
			activeSection={activeSection}
			onSectionChange={setActiveSection}
		>
			{renderContent()}
		</SettingsMenu>
	);
};

export default SettingPage;
