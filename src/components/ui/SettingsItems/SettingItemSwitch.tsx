import React from 'react';
import {
    SettingItem,
    SettingInfo,
    SettingIcon,
    SettingText,
    SettingTitle,
    SettingDescription,
    Switch,
} from './SettingsItems.styled';


interface SettingItemSwitchProps {
    icon: React.ReactNode;
    title: string;
    description?: string;
    checked: boolean;
    onChange: () => void;
}


export const SettingItemSwitch: React.FC<SettingItemSwitchProps> = ({
    icon,
    title,
    description,
    checked,
    onChange,
}) => {
    return (
        <SettingItem>
            <SettingInfo>
                <SettingIcon>
                    {icon}
                </SettingIcon>
                <SettingText>
                    <SettingTitle>{title}</SettingTitle>
                    {description && (
                        <SettingDescription>
                            {description}
                        </SettingDescription>
                    )}
                </SettingText>
            </SettingInfo>
            <Switch
                $checked={checked}
                onClick={onChange}
            />
        </SettingItem>
    );
};

