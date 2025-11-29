import React from "react";
import {
	SettingItem,
	SettingInfo,
	SettingIcon,
	SettingText,
	SettingTitle,
	SettingDescription,
} from "./SettingsItems.styled";
import styled from "styled-components";

const VerticalSettingItem = styled(SettingItem)`
	flex-direction: column;
	align-items: flex-start;
	gap: 16px;

	@media (max-width: 1220px) {
		gap: 11.2px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		gap: 12.8px;
	}

	@media (min-width: 1920px) {
		gap: 17.6px;
	}
`;

const ButtonContainer = styled.div`
	display: flex;
	gap: 12px;
	align-items: center;
	flex-wrap: wrap;
	margin-left: 36px;

	@media (max-width: 1220px) {
		gap: 8.4px;
		margin-left: 25.2px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		gap: 9.6px;
		margin-left: 28.8px;
	}

	@media (min-width: 1920px) {
		gap: 13.2px;
		margin-left: 39.6px;
	}
`;

const Button = styled.button<{
	$variant?: "primary" | "secondary" | "danger" | "outline-danger";
}>`
	padding: 8px 16px;
	border-radius: 6px;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s ease;
	border: 1px solid;
	white-space: nowrap;

	@media (max-width: 1220px) {
		padding: 5.6px 11.2px;
		border-radius: 4.2px;
		font-size: 12.5px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		padding: 6.4px 12.8px;
		border-radius: 4.8px;
		font-size: 13.5px;
	}

	@media (min-width: 1920px) {
		padding: 8.8px 17.6px;
		border-radius: 6.6px;
		font-size: 16px;
	}

	${({ $variant }) => {
		switch ($variant) {
			case "primary":
				return `
          background: #133E87;
          color: white;
          border-color: #133E87;
          &:hover {
            background: rgba(32, 102, 223, 0.25);
            border-color: rgba(32, 102, 223, 0.25);
            color: #133E87;
          }
          &:focus {
            outline: none;
        }
        `;
			case "secondary":
				return `
          background: #f3f4f6;
          color: #374151;
          border-color: #d1d5db;
          &:hover {
            background: #e5e7eb;
          }
              &:focus {
            outline: none;
        }
        `;
			case "danger":
				return `
          background: #D83232;
          color: white;
          border-color: #D83232;
          &:hover {
            background: #b91c1c;
            border-color: #b91c1c;
          }
              &:focus {
            outline: none;
        }
        `;
			case "outline-danger":
				return `
          background: transparent;
          color: #D83232;
          border-color: #D83232;
          &:hover {
            background: #fef2f2;
             border-color: #D83232;
          }
              &:focus {
            outline: none;
        }
        `;
			default:
				return `
          background: #f3f4f6;
          color: #374151;
          border-color: #d1d5db;
          &:hover {
            background: #e5e7eb;
          }
              &:focus {
            outline: none;
        }
        `;
		}
	}}
`;

interface ButtonConfig {
	text: string;
	variant?: "primary" | "secondary" | "danger" | "outline-danger";
	onClick: () => void;
	disabled?: boolean;
	title?: string;
}

interface SettingItemButtonProps {
	icon: React.ReactNode;
	title: string;
	description: string;
	buttons: ButtonConfig[];
}

const SettingItemButton: React.FC<SettingItemButtonProps> = ({
	icon,
	title,
	description,
	buttons,
}) => {
	return (
		<VerticalSettingItem>
			<SettingInfo>
				<SettingIcon>{icon}</SettingIcon>
				<SettingText>
					<SettingTitle>{title}</SettingTitle>
					<SettingDescription>{description}</SettingDescription>
				</SettingText>
			</SettingInfo>
			<ButtonContainer>
				{buttons.map((button, index) => (
					<Button
						key={index}
						$variant={button.variant}
						onClick={button.onClick}
					>
						{button.text}
					</Button>
				))}
			</ButtonContainer>
		</VerticalSettingItem>
	);
};

export default SettingItemButton;
