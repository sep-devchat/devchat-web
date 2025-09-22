import styled from 'styled-components';

export const SettingsContainer = styled.div<{ backgroundImage: string }>`
  height: 100vh;
  width: 100%;
  background-image: url(${props => props.backgroundImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const SettingRows = styled.div`
  display: flex;
  width: 100%;
  flex: 1;
  padding: 0 24px 16px 24px;
  min-height: 0;
`;

export const NavigatorIcon = styled.div`
  width: 60px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

export const LogoSection = styled.div`
  margin-top: 20px;
  margin-bottom: 30px;
  z-index: 2;
`;

export const LogoBox = styled.div`
  width: 40px;
  height: 40px;
  background: #6b7280;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  font-weight: bold;
  color: #fff;
  text-align: center;
  line-height: 1;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

export const IndentedSection = styled.div`
  width: 100%;
  background: rgba(255, 255, 255, 0.45);
  border-radius: 80px 0 0 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
  padding-bottom: 60px;
  position: relative;
  flex: 1;
  max-height: 365px;
`;

export const IconContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
  justify-content: flex-start;
  padding-top: 20px;
`;

export const CircleIcon = styled.div<{ selected?: boolean }>`
  width: 32px;
  height: 32px;
  background: ${props => props.selected ? 'rgba(32, 102, 223, 0.2)' : '#fff'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
 
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  svg {
    width: 16px;
    height: 16px;
    color: ${props => props.selected ? '#133E87' : '#AAAAAA'};
  }
`;

export const Sidebar = styled.div`
  width: 480px;
  background: rgba(255, 255, 255, 0.30);
  border-right: 1px solid #e5e7eb;
  height: 100%;
  border-radius: 8px 0px 0px 8px;
`;

export const SidebarContent = styled.div`
  padding: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 24px;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 12px 12px 12px 40px;
  background: #f9fafb;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

export const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  width: 16px;
  height: 16px;
`;

export const MenuNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

export const MenuItem = styled.button<{ $isActive: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  text-align: left;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;

  &:focus {
    outline: none;
  }

  ${({ $isActive }) => $isActive ? `
    background: rgba(32, 102, 223, 0.09);
    color: #133E87;
  ` : `
    background: transparent;
    color: #1A1A1A;
    border: none;
   
    &:hover {
      background: #f9fafb;
      border: none;
    }
    
    &:focus {
      outline: none;
    }
  `}
`;

export const MenuIcon = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const MainContent = styled.div`
  width: 100%;
  flex: 1;
  border-radius: 0 8px 8px 0;
  background: white;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const ContentWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0;
  scrollbar-width: none; 
  -ms-overflow-style: none; 
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 18px;
  flex-shrink: 0;
`;

export const Title = styled.h1`
  font-size: 16px;
  font-weight: bold;
  color: #1A1A1A;
`;

export const NotificationButton = styled.button`
  padding: 8px;
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: #1A1A1A;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
  }
`;