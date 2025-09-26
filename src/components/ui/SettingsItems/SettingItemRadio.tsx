import React from "react";
import {
	SettingItem,
	SettingIcon,
	SettingText,
	SettingTitle,
	SettingDescription,
	RadioGroup,
	RadioItem,
	RadioInput,
	RadioLabel,
} from "./SettingsItems.styled";
import styled from "styled-components";

const SettingMainInfo = styled.div`
	display: flex;
	align-items: center;
	justify-content: flex-start;
	gap: 12px;
	margin-bottom: 12px;
`;

const SettingContent = styled.div`
	flex: 1;
`;

interface RadioOption {
	value: string;
	label: string;
}

interface SettingItemRadioProps {
	icon: React.ReactNode;
	title: string;
	description?: string;
	selectedValue: string;
	options: RadioOption[];
	onChange: (value: string) => void;
	name: string;
}

export const SettingItemRadio: React.FC<SettingItemRadioProps> = ({
	icon,
	title,
	description,
	selectedValue,
	options,
	onChange,
	name,
}) => {
	const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange(e.target.value);
	};

	return (
		<SettingItem>
			<SettingContent>
				<SettingMainInfo>
					<SettingIcon>{icon}</SettingIcon>
					<SettingText>
						<SettingTitle>{title}</SettingTitle>
						{description && (
							<SettingDescription>{description}</SettingDescription>
						)}
					</SettingText>
				</SettingMainInfo>

				<RadioGroup>
					{options.map((option) => (
						<RadioItem key={option.value}>
							<RadioInput
								type="radio"
								name={name}
								value={option.value}
								checked={selectedValue === option.value}
								onChange={handleRadioChange}
							/>
							<RadioLabel>{option.label}</RadioLabel>
						</RadioItem>
					))}
				</RadioGroup>
			</SettingContent>
		</SettingItem>
	);
};
