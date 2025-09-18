import React, { useState } from 'react';
import {
    BellIcon,
    Monitor,
    MessageSquare,
    Volume2,
    LanguagesIcon,
    Menu,
    Clock,
    User2Icon,
    KeyIcon,
    Lock,
    UserCheck2,
    GroupIcon,
    File,
    ChartAreaIcon,
    KeyboardIcon,
    BellOff,
} from 'lucide-react';
import { SettingsMenu } from '@/components/ui/SettingsMenu/SettingsMenu';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from './Setting.styled';
import { SettingItemSwitch } from '@/components/ui/SettingsItems/SettingItemSwitch';
import { SettingItemRadio } from '@/components/ui/SettingsItems/SettingItemRadio';
import { SettingItemDropdown } from '@/components/ui/SettingsItems/SettingItemDropdown';
import SettingItemButton from '@/components/ui/SettingsItems/SettingItemButton';
import SettingAppearance from '@/components/ui/SettingsItems/SettingAppearance';
import AccountForm from '@/components/ui/SettingsItems/AccountForm';


type SettingsSection = 'general' | 'appearance' | 'notification' | 'account' | 'privacy';


export const SettingPage: React.FC = () => {
    const [activeSection, setActiveSection] = useState<SettingsSection>('general');
    const [muteAll, setMuteAll] = useState(false);
    const [enableDesktop, setEnableDesktop] = useState(false);
    const [keepAppBarVisible, setKeepAppBarVisible] = useState(false);
    const [enableUnread, setEnableUnread] = useState(true);
    const [keepAllowReadReceipts, setKeepAllowReadReceipts] = useState(true);
    const [allowAnalyzeContent, setAllowAnalyzeContent] = useState(false);
    const [allowKeyboardShortcuts, setAllowKeyboardShortcuts] = useState(true);
    const [selectedReaction, setSelectedReaction] = useState('All');
    const [selectedTimeFormat, setSelectedTimeFormat] = useState('Auto');
    const [soundSetting, setSoundSetting] = useState('Default');
    const [languageSetting, setLanguageSetting] = useState('English (United States)');
    const [userSetting, setUserSetting] = useState('Anyone');


    const soundOptions = [
        { value: 'Default', label: 'Default' },
        { value: 'None', label: 'None' },
        { value: 'Custom', label: 'Custom' },
    ];


    const timeFormatOptions = [
        { value: 'Auto', label: 'Auto' },
        { value: '12-hour', label: '12-hour' },
        { value: '24-hour', label: '24-hour' },
    ];


    const languageOptions = [
        { value: 'English (United States)', label: 'English (United States)' },
        { value: 'Spanish', label: 'Spanish' },
    ];


    const userOptions = [
        { value: 'Anyone', label: 'Anyone' },
        { value: 'Contacts only', label: 'Contacts only' },
    ];


    const reactionOptions = [
        { value: 'All', label: 'All' },
        { value: 'Direct Messages', label: 'Direct Messages' },
        { value: 'None', label: 'None' },
    ];


    const renderNotificationSettings = () => (
        <Card>
            <CardHeader>
                <CardTitle>Notification and activity</CardTitle>
                <CardDescription>Manage notifications and recent activities</CardDescription>
            </CardHeader>
            <CardContent>
                <SettingItemSwitch
                    icon={<BellOff size={20} />}
                    title="Mute all notifications (except for calls and messages)"
                    checked={muteAll}
                    onChange={() => setMuteAll(!muteAll)}
                />


                <SettingItemSwitch
                    icon={<Monitor size={20} />}
                    title="Enable Desktop Notifications"
                    description="If you're looking for on-demand or per-server notifications, right-click the Discord server icon and select Notification Settings."
                    checked={enableDesktop}
                    onChange={() => setEnableDesktop(!enableDesktop)}
                />


                <SettingItemSwitch
                    icon={<MessageSquare size={20} />}
                    title="Enable Unread Message Badge"
                    description="Shows a red badge on the app icon when you have unread messages."
                    checked={enableUnread}
                    onChange={() => setEnableUnread(!enableUnread)}
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
                    onInfoClick={() => console.log('Info clicked')}
                />
            </CardContent>
        </Card>
    );


    const renderGeneralSettings = () => (
        <Card>
            <CardHeader>
                <CardTitle>General</CardTitle>
                <CardDescription>Settings for language, translation, display, and suggested replies.</CardDescription>
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


    const renderAppearanceSettings = () => (
        <Card>
            <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize interface, theme, and layout.</CardDescription>
            </CardHeader>
            <CardContent>
                <SettingAppearance />
                <SettingItemRadio
                    icon={<Clock size={20} />}
                    title="Time format"
                    description="Choose the time display format"
                    selectedValue={selectedTimeFormat}
                    options={timeFormatOptions}
                    onChange={setSelectedTimeFormat}
                    name="timeFormat"
                />
            </CardContent>
        </Card>
    );


    const renderPrivacySettings = () => (
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
                            onClick: () => console.log("Manage contact information clicked")
                        }
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
                            onClick: () => console.log("Manage profile clicked")
                        }
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


    const renderAccountSettings = () => (
        <Card>
            <CardHeader>
                <CardTitle>Welcome, Amanda</CardTitle>
                <CardDescription>Wed, 27 August 2025</CardDescription>
            </CardHeader>
            <CardContent>
                <AccountForm />
                <SettingItemButton
                    icon={<KeyIcon />}
                    title="Password and Authentication"
                    description="You must verify your account before you can enable two-factor authentication."
                    buttons={[
                        {
                            text: "Change password",
                            variant: "primary",
                            onClick: () => console.log("Change password clicked")
                        }
                    ]}
                />
                <SettingItemButton
                    icon={<Lock />}
                    title="Account Removal"
                    description="Disabling your account means you can recover it at any time after taking this action."
                    buttons={[
                        {
                            text: "Disable Account",
                            variant: "danger",
                            onClick: () => console.log("Disable account clicked")
                        },
                        {
                            text: "Delete Account",
                            variant: "outline-danger",
                            onClick: () => console.log("Delete account clicked")
                        }
                    ]}
                />


            </CardContent>
        </Card>
    );


    const renderContent = () => {
        switch (activeSection) {
            case 'notification':
                return renderNotificationSettings();
            case 'general':
                return renderGeneralSettings();
            case 'appearance':
                return renderAppearanceSettings();
            case 'account':
                return renderAccountSettings();
            case 'privacy':
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
