import styled from "styled-components";

export const ProfileContainer = styled.div`
	position: fixed;
	bottom: 20px;
	left: 20px;
	width: 300px;
	height: 52px;
	background: white;
	padding: 6px;
	border-radius: 10px;
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

export const ProfileInfo = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;
`;

export const Avatar = styled.div`
	width: 40px;
	height: 40px;
	border-radius: 9999px;
	background: hsl(var(--primary));
	color: hsl(var(--primary-foreground));
	display: grid;
	place-items: center;
	font-weight: 700;
	letter-spacing: 0.3px;
`;

export const Name = styled.div`
	color: hsl(var(--foreground));
	font-weight: 600;
`;

export const SettingsButton = styled.button`
	border: none;
	border-radius: 8px;
	color: hsl(var(--foreground));
	width: 36px;
	height: 36px;
	display: grid;
	place-items: center;
	cursor: pointer;
	transition:
		background-color 160ms ease,
		box-shadow 160ms ease;

	&:hover {
		background: hsl(var(--secondary));
	}
`;
