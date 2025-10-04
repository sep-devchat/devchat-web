import styled from "styled-components";

export const HeaderContainer = styled.header`
	background-color: transparent;
	padding: 16px 24px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 100px;
	top: 0;
	z-index: 10;
	padding-right: 0;
`;

export const HeaderLeft = styled.div`
	display: flex;
	flex-direction: column;
	gap: 5px;
`;

export const PageTitle = styled.h1`
	font-size: 28px;
	font-weight: 600;
	color: #27364b;
	margin: 0;
`;

export const TabNavigation = styled.div`
	display: flex;
	gap: 20px;
`;

export const TabButton = styled.button<{ $active: boolean }>`
	background: none;
	border: none;
	padding: 8px 0;
	font-size: 18px;
	font-weight: 300;
	color: #133e87;
	cursor: pointer;
	position: relative;
	transition: color 0.2s ease;

	&:focus {
		outline: none;
	}

	${(props) =>
		props.$active &&
		`
        font-weight: 500;
        &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 3px;
            background-color: #133E87;
            border-radius: 2px 2px 0 0;
        }
    `}
`;

export const HeaderRight = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 16px;
	padding-top: 0;
	padding-right: 0;
`;

export const NotificationButton = styled.button`
	position: relative;
	background: transparent;
	border: none;
	cursor: pointer;
	padding: 8px;
	border-radius: 8px;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: background-color 0.2s;

	&:hover {
		background-color: #f3f4f6;
	}

	&:focus {
		outline: none;
	}
`;

export const NotificationDot = styled.span`
	position: absolute;
	top: 6px;
	right: 6px;
	width: 8px;
	height: 8px;
	background-color: #ef4444;
	border-radius: 50%;
	border: 2px solid white;
`;

export const UserProfileContainer = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 8px 20px;
	background-color: #f8f9fb;
	border-radius: 12px;
	cursor: pointer;
	transition: background-color 0.2s;

	&:hover {
		background-color: #e5e7eb;
	}
`;

export const UserAvatar = styled.img`
	width: 36px;
	height: 36px;
	border-radius: 50%;
	object-fit: cover;
`;

export const UserInfo = styled.div`
	display: flex;
	flex-direction: column;
`;

export const UserName = styled.span`
	font-size: 16px;
	font-weight: 600;
	color: #27364b;
`;

export const UserMail = styled.span`
	font-size: 10px;
	font-weight: 300;
	color: #666666;
`;

export const UserRole = styled.span`
	font-size: 14px;
	font-weight: 500;
	color: #27364b;
`;
