import React, { useState } from 'react';
import {
    SettingItem,
    SettingItemNoBorder,
    SettingInfo,
    SettingIcon,
    SettingText,
    SettingTitle,
    SettingDescription,
    Switch,
    ThemeContainer,
    ThemeOption,
    ChatPreviewContainer,
    ChatMessage,
    UserAvatar,
    MessageContent,
    MessageText,
    MessageTime,
    MessageBubble,
    ClickableChatPreview,
    SelectionTick
} from './SettingsItems.styled';
import { Palette } from 'lucide-react';


const ThemeSetting: React.FC = () => {
    const [selectedTheme, setSelectedTheme] = useState('light');


    const themes = [
        { id: 'light', color: '#ffffff' },
        { id: 'blue', color: '#133E87' },
        { id: 'dark', color: '#1E2A3B' }
    ];


    return (
        <SettingItem>
            <SettingInfo>
                <SettingIcon><Palette size={20} /></SettingIcon>
                <SettingText>
                    <SettingTitle>Theme</SettingTitle>
                    <SettingDescription>This will apply to all your apps</SettingDescription>
                </SettingText>
                <ThemeContainer>
                    {themes.map((theme) => (
                        <ThemeOption
                            key={theme.id}
                            $id={theme.id}
                            $color={theme.color}
                            $selected={selectedTheme === theme.id}
                            onClick={() => setSelectedTheme(theme.id)}
                        />
                    ))}
                </ThemeContainer>
            </SettingInfo>
        </SettingItem>
    );
};


// Dark Sidebar Toggle (no border)
const DarkSidebarSetting: React.FC = () => {
    const [isDarkSidebar, setIsDarkSidebar] = useState(false);


    return (
        <SettingItemNoBorder style={{ padding: 0 }}>
            <SettingInfo>
                <SettingText>
                    <SettingTitle>Dark Sidebar</SettingTitle>
                </SettingText>
            </SettingInfo>
            <Switch
                $checked={isDarkSidebar}
                onClick={() => setIsDarkSidebar(!isDarkSidebar)}
            />
        </SettingItemNoBorder>
    );
};


// Chat Message Display Setting (no border, clickable chat boxes)
const ChatMessageDisplaySetting: React.FC = () => {
    const [messageDisplay, setMessageDisplay] = useState('bubbles');


    return (
        <SettingItemNoBorder style={{ padding: 0 }}>
            <SettingInfo>
                <SettingText>
                    <SettingTitle>Chat Message Display</SettingTitle>
                    <ChatPreviewContainer>
                        <ClickableChatPreview
                            $selected={messageDisplay === 'bubbles'}
                            onClick={() => setMessageDisplay('bubbles')}
                        >
                            <SelectionTick $visible={messageDisplay === 'bubbles'} />
                            <ChatMessage>
                                <UserAvatar>M</UserAvatar>
                                <MessageContent>
                                    <span>Manager</span>
                                    <div>
                                        <MessageBubble>Hello !</MessageBubble>
                                        <MessageTime style={{ fontWeight: 400, fontSize: '12px', color: '#9ca3af' }}>19:56 PM</MessageTime>
                                    </div>
                                </MessageContent>
                            </ChatMessage>
                            <ChatMessage>
                                <UserAvatar>M</UserAvatar>
                                <MessageContent>
                                    <span>Manager</span>
                                    <div>
                                        <MessageBubble>Show messages in bubbles for easier reading and separation.</MessageBubble>
                                        <MessageTime style={{ fontWeight: 400, fontSize: '12px', color: '#9ca3af' }}>19:56 PM</MessageTime>
                                    </div>
                                </MessageContent>
                            </ChatMessage>
                        </ClickableChatPreview>


                        <ClickableChatPreview
                            $selected={messageDisplay === 'text'}
                            onClick={() => setMessageDisplay('text')}
                        >
                            <SelectionTick $visible={messageDisplay === 'text'} />
                            <ChatMessage>
                                <UserAvatar>M</UserAvatar>
                                <MessageContent>
                                    <div>
                                        <span>Manager</span>
                                        <MessageTime style={{ fontWeight: 400, fontSize: '12px', color: '#9ca3af' }}>19:56 PM</MessageTime>
                                    </div>
                                    <MessageText>Hello!</MessageText>
                                </MessageContent>
                            </ChatMessage>
                            <ChatMessage>
                                <UserAvatar>M</UserAvatar>
                                <MessageContent>
                                    <div>
                                        <span>Manager</span>
                                        <MessageTime style={{ fontWeight: 400, fontSize: '12px', color: '#9ca3af' }}>19:56 PM</MessageTime>
                                    </div>
                                    <MessageText>Show messages in a condensed text format to save screen space.</MessageText>
                                </MessageContent>
                            </ChatMessage>
                        </ClickableChatPreview>
                    </ChatPreviewContainer>
                </SettingText>
            </SettingInfo>
        </SettingItemNoBorder>
    );
};


const SettingAppearance: React.FC = () => {
    return (
        <>
            <ThemeSetting />
            <DarkSidebarSetting />
            <ChatMessageDisplaySetting />
        </>
    );
};


export default SettingAppearance;