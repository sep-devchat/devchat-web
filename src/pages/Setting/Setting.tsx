import React, { useState } from "react";
import { SettingsMenu } from "@/components/custom/SettingsMenu/SettingsMenu";
import NotificationSettings from "./components/NotificationSettings";
import GeneralSettings from "./components/GeneralSettings";
import AppearanceSettings from "./components/AppearanceSettings";
import PrivacySettings from "./components/PrivacySettings";
import AccountSettings from "./components/AccountSettings";

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

	// const handleSoundInfoClick = () => {
	// 	console.log("Sound info clicked");
	// };

	const soundOptions = [
		{ value: "Default", label: "Default" },
		{ value: "None", label: "None" },
		{ value: "Custom", label: "Custom" },
	];

	const timeFormatOptions = [
		{ value: "Auto", label: "Auto" },
		{ value: "12-hour", label: "12-hour" },
		{ value: "24-hour", label: "24-hour" },
	];

	const languageOptions = [
		{ value: "English (United States)", label: "English (United States)" },
		{ value: "Spanish", label: "Spanish" },
	];

	const userOptions = [
		{ value: "Anyone", label: "Anyone" },
		{ value: "Contacts only", label: "Contacts only" },
	];

	const reactionOptions = [
		{ value: "All", label: "All" },
		{ value: "Direct Messages", label: "Direct Messages" },
		{ value: "None", label: "None" },
	];

	const renderNotificationSettings = () => (
		<NotificationSettings
			muteAll={muteAll}
			setMuteAll={setMuteAll}
			enableDesktop={enableDesktop}
			setEnableDesktop={setEnableDesktop}
			enableUnread={enableUnread}
			setEnableUnread={setEnableUnread}
			selectedReaction={selectedReaction}
			setSelectedReaction={setSelectedReaction}
			soundSetting={soundSetting}
			setSoundSetting={setSoundSetting}
			reactionOptions={reactionOptions}
			soundOptions={soundOptions}
		/>
	);

	const renderGeneralSettings = () => (
		<GeneralSettings
			languageSetting={languageSetting}
			setLanguageSetting={setLanguageSetting}
			languageOptions={languageOptions}
			keepAppBarVisible={keepAppBarVisible}
			setKeepAppBarVisible={setKeepAppBarVisible}
		/>
	);

	const renderAppearanceSettings = () => (
		<AppearanceSettings
			selectedTimeFormat={selectedTimeFormat}
			setSelectedTimeFormat={setSelectedTimeFormat}
			timeFormatOptions={timeFormatOptions}
		/>
	);

	const renderPrivacySettings = () => (
		<PrivacySettings
			userSetting={userSetting}
			setUserSetting={setUserSetting}
			userOptions={userOptions}
			keepAllowReadReceipts={keepAllowReadReceipts}
			setKeepAllowReadReceipts={setKeepAllowReadReceipts}
			allowAnalyzeContent={allowAnalyzeContent}
			setAllowAnalyzeContent={setAllowAnalyzeContent}
			allowKeyboardShortcuts={allowKeyboardShortcuts}
			setAllowKeyboardShortcuts={setAllowKeyboardShortcuts}
		/>
	);

	const renderAccountSettings = () => <AccountSettings />;

	const renderContent = () => {
		switch (activeSection) {
			case "notification":
				return renderNotificationSettings();
			case "general":
				return renderGeneralSettings();
			case "appearance":
				return renderAppearanceSettings();
			case "account":
				return renderAccountSettings();
			case "privacy":
				return renderPrivacySettings();
			default:
				return renderGeneralSettings();
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
