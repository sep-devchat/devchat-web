import styled from "styled-components";

export const ProfileContainer = styled.div`
	background: white;
	padding: 8px;
	border-radius: 6px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 56px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	z-index: 10;

	@media (max-width: 1220px) {
		padding: 6px 10px;
		border-radius: 8px;
	}
`;

export const ProfileInfo = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;
	flex: 1;
	min-width: 0;

	@media (min-width: 1220px) {
		gap: 5px;
	}
`;

export const Avatar = styled.div`
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	flex-shrink: 0;
	background: hsl(var(--primary));
	color: white;
	font-weight: 600;
	width: 40px;
	height: 40px;
	font-size: 14px;

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 50%;
	}

	@media (max-width: 1220px) {
		width: 30px;
		height: 30px;
		font-size: 13px;
	}
`;

export const Name = styled.div`
	color: hsl(var(--foreground));
	font-weight: 600;
	font-size: 14px;
	line-height: 1.2;

	@media (max-width: 1220px) {
		font-size: 11px;
	}
`;

export const ActionButton = styled.div`
	display: flex;
	gap: 8px;
	align-items: center;
	flex-shrink: 0;

	@media (max-width: 1220px) {
		gap: 6px;
	}
`;

export const SettingsButton = styled.button`
	border: none;
	border-radius: 6px;
	background: transparent;
	color: hsl(var(--foreground));
	width: 36px;
	height: 36px;
	display: grid;
	place-items: center;
	cursor: pointer;
	transition:
		background-color 160ms ease,
		box-shadow 160ms ease;
	flex-shrink: 0;

	&:hover {
		background: hsl(var(--secondary));
	}

	&:active {
		transform: scale(0.95);
	}

	svg {
		width: 18px;
		height: 18px;
	}

	@media (max-width: 1220px) {
		width: 32px;
		height: 32px;
		border-radius: 6px;
		svg {
			width: 18px;
			height: 18px;
		}
	}
`;
