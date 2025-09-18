import React from 'react';
import { Music } from 'lucide-react';
import {
    SettingItem,
    SettingInfo,
    SettingIcon,
    SettingText,
    SettingTitle,
    SettingDescription,
    SelectContainer,
    Select,
    InfoButton,
} from './SettingsItems.styled';


interface Option {
    value: string;
    label: string;
}


interface SettingItemDropdownProps {
    icon: React.ReactNode;
    title: string;
    description?: string;
    value: string;
    options: Option[];
    onChange: (value: string) => void;
    showInfoButton?: boolean;
    onInfoClick?: () => void;
}


export const SettingItemDropdown: React.FC<SettingItemDropdownProps> = ({
    icon,
    title,
    description,
    value,
    options,
    onChange,
    showInfoButton = false,
    onInfoClick,
}) => {
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(e.target.value);
    };


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
            <SelectContainer>
                <Select
                    value={value}
                    onChange={handleSelectChange}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </Select>
                {showInfoButton && (
                    <InfoButton onClick={onInfoClick}>
                        <Music size={16} />
                    </InfoButton>
                )}
            </SelectContainer>
        </SettingItem>
    );
};

