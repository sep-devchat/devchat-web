import styled from "styled-components";

export const Header = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	//   padding: 5px 18px;
	flex-shrink: 0;
	height: 52px;
`;

export const Title = styled.h1`
	font-size: 16px;
	font-weight: bold;
	color: #1a1a1a;
`;

export const NotificationButton = styled.button`
	padding: 8px;
	background: transparent;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	color: #1a1a1a;
	transition: all 0.2s ease;
	&:hover {
		background: #f3f4f6;
	}
`;
