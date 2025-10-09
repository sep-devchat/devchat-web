import styled from "styled-components";

export const ProfileContainer = styled.div`
	position: fixed;
	bottom: 20px;
	left: 18px;
	width: 15.5%;
	height: 52px;
	background: white;
	padding: 6px;
	border-radius: 5px;
	display: flex;
	align-items: center;
	justify-content: space-between;

	@media (min-width: 1024px) {
		bottom: 32px;
		left: 22px;
		height: 56px;
		padding: 8px;
		border-radius: 6px;
	}

	@media (min-width: 1280px) {
		bottom: 32px;
		left: 24px;
		height: 58px;
		padding: 9px;
		border-radius: 7px;
	}

	@media (min-width: 1440px) {
		bottom: 40px;
		left: 26px;
		height: 60px;
		padding: 10px;
		border-radius: 8px;
	}

	@media (min-width: 1920px) {
		bottom: 40px;
		left: 28px;
		height: 64px;
		padding: 12px;
		border-radius: 10px;
	}
`;

export const ProfileInfo = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;

	@media (min-width: 1024px) {
		gap: 6px;
	}

	@media (min-width: 1280px) {
		gap: 8px;
	}

	@media (min-width: 1440px) {
		gap: 10px;
	}

	@media (min-width: 1920px) {
		gap: 12px;
	}
`;

export const Avatar = styled.div`
	border-radius: 50%;
	align-items: center;

	.img {
		border-radius: 50%;
	}

	@media (min-width: 1024px) {
		width: 40px;
		height: 30px;
	}

	@media (min-width: 1280px) {
		width: 40px;
		height: 30px;
	}

	@media (min-width: 1440px) {
		width: 40px;
		height: 30px;
	}

	@media (min-width: 1920px) {
		width: 50px;
		height: 40px;
	}
`;

export const Name = styled.div`
	color: hsl(var(--foreground));
	font-weight: 600;
	font-size: 14px;
	line-height: 1.2;
	align-items: center;

	@media (min-width: 1024px) {
		font-size: 10px;
	}

	@media (min-width: 1280px) {
		font-size: 12px;
	}

	@media (min-width: 1440px) {
		font-size: 14px;
	}

	@media (min-width: 1920px) {
		font-size: 16px;
	}
`;

export const SettingsButton = styled.button`
	border: none;
	border-radius: 6px;
	color: hsl(var(--foreground));
	width: 32px;
	height: 32px;
	display: grid;
	place-items: center;
	cursor: pointer;
	transition:
		background-color 160ms ease,
		box-shadow 160ms ease;

	&:hover {
		background: hsl(var(--secondary));
	}

	svg {
		width: 18px;
		height: 18px;
	}

	@media (min-width: 1024px) {
		width: 20px;
		height: 20px;
		border-radius: 8px;

		svg {
			width: 20px;
			height: 20px;
		}
	}

	@media (min-width: 1280px) {
		width: 20px;
		height: 20px;
		border-radius: 8px;

		svg {
			width: 20px;
			height: 20px;
		}
	}

	@media (min-width: 1440px) {
		width: 38px;
		height: 38px;
		border-radius: 9px;

		svg {
			width: 21px;
			height: 21px;
		}
	}

	@media (min-width: 1920px) {
		width: 42px;
		height: 42px;
		border-radius: 10px;

		svg {
			width: 23px;
			height: 23px;
		}
	}
`;
