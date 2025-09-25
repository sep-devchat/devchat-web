import { theme } from "@/themes";
import styled from "styled-components";
import { TooltipProps } from "./MemberList";

export const PageWrapper = styled.div`
  height: 100%;
  width: 500px;
  position: relative;
  display: flex;
  flex-direction: column;
  margin-right: 18px;
  background: ${theme.color.grey30};
  border-radius: 10px;
`;

export const CPHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 52px;
  padding: 14px 12px;
  background: ${theme.color.grey30};
  border-top-right-radius: 10px;
`;

export const CPHeaderIcon = styled.div`
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #4338ca;
`;

export const CPHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const CPChatArea = styled.div`
  height: 100%;
background: ${theme.color.grey10};
  border-bottom-right-radius: 10px;

`;

export const CPHash = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 999px;
  background: #eef2ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #4338ca;
`;

export const CPTitle = styled.h2`
  margin: 0;
  font-size: 18px;
`;

export const MemberContent = styled.div`
  flex: 1;
  padding: 16px;
  overflow: visible;
`

export const MemberSection = styled.div`
  margin-bottom: 24px;
`

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`

export const SectionTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: ${theme.color.grey90 || '#374151'};
  letter-spacing: 0.5px;
`

export const MemberCount = styled.span`
  background: ${theme.color.grey90 || '#9CA3AF'};
  color: white;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 500;
  min-width: 20px;
  text-align: center;
`

export const MembersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const MemberItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: ${theme.color.grey30 || '#F3F4F6'};
  }
`

export const MemberAvatarContainer = styled.div`
  position: relative;
`

export const MemberAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`

export const OnlineIndicator = styled.div`
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background: #10B981;
  border: 2px solid white;
  border-radius: 50%;
`

export const OfflineIndicator = styled.div`
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background: #6B7280;
  border: 2px solid white;
  border-radius: 50%;
`

export const MemberName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${theme.color.grey90 || '#111827'};
`
export const Tooltip = styled.div<TooltipProps>`
  position: absolute;
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  background: #000;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  margin-right: 8px;
  opacity: ${props => (props.show ? 1 : 0)};
  visibility: ${props => (props.show ? 'visible' : 'hidden')};
  transition: opacity 0.2s ease, visibility 0.2s ease;
  z-index: 9999;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 100%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border: 5px solid transparent;
    border-left-color: #000;
  }
`

export const TooltipContainer = styled.div`
  position: relative;
`
export const TooltipCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  background: #1e1f22;
  color: #fff;
  padding: 16px;
  border-radius: 8px;
  width: 260px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.5);
`

export const TooltipHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

export const TooltipAvatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
`

export const TooltipName = styled.div`
  font-size: 16px;
  font-weight: bold;
`

export const TooltipUsername = styled.div`
  font-size: 14px;
  color: #aaa;
`

export const TooltipInput = styled.input`
  width: 100%;
  padding: 8px 10px;
  border: none;
  border-radius: 6px;
  background: #2b2d31;
  color: #fff;
  font-size: 14px;

  &:focus {
    outline: 2px solid #133E87; 
  }
`

