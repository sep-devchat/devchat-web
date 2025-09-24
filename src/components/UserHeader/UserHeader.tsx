// HeaderBar.tsx
import React from "react";
import { Bell } from "lucide-react";
import { Header, Title, NotificationButton } from "./UserHeader.styled";

export interface HeaderBarProps {
  title: React.ReactNode; // string hoặc ReactNode
  left?: React.ReactNode; // nội dung nút bên trái (ví dụ icon hoặc button)
  right?: React.ReactNode; // nội dung nút bên phải (ví dụ icon hoặc button)
  onLeftClick?: () => void;
  onRightClick?: () => void;
  className?: string;
}

/**
 * Simple header component that reuses your styled-components.
 * - title: required, can be text or any React node
 * - left/right: optional custom nodes; if omitted, left is an empty NotificationButton and right is a Bell button
 */
const HeaderBar: React.FC<HeaderBarProps> = ({ title, left, right, onLeftClick, onRightClick, className }) => {
  return (
    <Header className={className}>
      {/* Left area */}
      {left ? (
        <div onClick={onLeftClick} style={{ display: "flex", alignItems: "center" }}>
          {left}
        </div>
      ) : (
        <NotificationButton onClick={onLeftClick} aria-label="left-action" />
      )}

      {/* Title (flexible) */}
      <Title>{title}</Title>

      {/* Right area */}
      {right ? (
        <div onClick={onRightClick} style={{ display: "flex", alignItems: "center" }}>
          {right}
        </div>
      ) : (
        <NotificationButton onClick={onRightClick} aria-label="notifications">
          <Bell size={16} />
        </NotificationButton>
      )}
    </Header>
  );
};

export default HeaderBar;
