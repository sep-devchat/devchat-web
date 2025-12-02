import React, { useState } from "react";
import {
	SettingItem,
	SettingInfo,
	SettingIcon,
	SettingText,
	SettingTitle,
	SettingDescription,
} from "./SettingsItems.styled";
import styled from "styled-components";
import { ChevronDown, ChevronUp } from "lucide-react";

const CollapsibleSettingItem = styled(SettingItem)`
	flex-direction: column;
	align-items: flex-start;
	cursor: pointer;
	transition: all 0.2s ease;

	&:hover {
		background: #f9fafb;
	}
`;

const Header = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
`;

const HeaderInfo = styled(SettingInfo)`
	flex: 1;
`;

const ChevronIcon = styled.div<{ $isOpen: boolean }>`
	transition: transform 0.2s ease;
	display: flex;
	align-items: center;
	color: #6b7280;
	transform: ${({ $isOpen }) => ($isOpen ? "rotate(180deg)" : "rotate(0deg)")};
`;

const ContentWrapper = styled.div<{ $isOpen: boolean; $contentWidth?: string }>`
	width: 100%;
	max-width: ${({ $contentWidth }) => $contentWidth || "100%"};
	overflow: hidden;
	max-height: ${({ $isOpen }) => ($isOpen ? "2000px" : "0")};
	opacity: ${({ $isOpen }) => ($isOpen ? "1" : "0")};
	transition:
		max-height 0.3s ease,
		opacity 0.3s ease;
	margin-top: ${({ $isOpen }) => ($isOpen ? "16px" : "0")};

	@media (max-width: 1220px) {
		margin-top: ${({ $isOpen }) => ($isOpen ? "11.2px" : "0")};
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		margin-top: ${({ $isOpen }) => ($isOpen ? "12.8px" : "0")};
	}

	@media (min-width: 1920px) {
		margin-top: ${({ $isOpen }) => ($isOpen ? "17.6px" : "0")};
	}
`;

interface SettingItemCollapsibleProps {
	icon?: React.ReactNode;
	title: string;
	description: string;
	children: React.ReactNode;
	defaultOpen?: boolean;
	contentWidth?: string;
}

const SettingItemCollapsible: React.FC<SettingItemCollapsibleProps> = ({
	icon,
	title,
	description,
	children,
	defaultOpen = false,
	contentWidth,
}) => {
	const [isOpen, setIsOpen] = useState(defaultOpen);

	return (
		<CollapsibleSettingItem>
			<Header onClick={() => setIsOpen(!isOpen)}>
				<HeaderInfo>
					{icon && <SettingIcon>{icon}</SettingIcon>}
					<SettingText>
						<SettingTitle>{title}</SettingTitle>
						<SettingDescription>{description}</SettingDescription>
					</SettingText>
				</HeaderInfo>
				<ChevronIcon $isOpen={isOpen}>
					{isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
				</ChevronIcon>
			</Header>
			<ContentWrapper $isOpen={isOpen} $contentWidth={contentWidth}>
				{children}
			</ContentWrapper>
		</CollapsibleSettingItem>
	);
};

export default SettingItemCollapsible;
