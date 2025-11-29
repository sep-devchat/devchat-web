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

	//scale 175%
	@media (min-width: 1024px) {
		padding: 6px 8px;
		height: 46px;
		border-radius: 5px;
	}

	//scale 150%
	@media (min-width: 1280px) {
		padding: 7px 8px;
		height: 50px;
		border-radius: 6px;
	}

	//scale 125%
	@media (min-width: 1440px) {
		padding: 7px 9px;
		height: 52px;
		border-radius: 6px;
	}

	//scale 100%
	@media (min-width: 1920px) {
		padding: 8px;
		height: 56px;
		border-radius: 6px;
	}

	//isHalf
	@media (max-width: 1220px) {
		padding: 6px 10px;
		border-radius: 8px;
		height: 48px;
	}
`;

export const ProfileInfo = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;
	flex: 1;
	min-width: 0;

	//scale 175%
	@media (min-width: 1024px) {
		gap: 6px;
	}

	//scale 150%
	@media (min-width: 1280px) {
		gap: 7px;
	}

	//scale 125%
	@media (min-width: 1440px) {
		gap: 8px;
	}

	//scale 100%
	@media (min-width: 1920px) {
		gap: 10px;
	}

	//isHalf
	@media (max-width: 1220px) {
		gap: 8px;
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

	//scale 175%
	@media (min-width: 1024px) {
		width: 32px;
		height: 32px;
		font-size: 11px;
	}

	//scale 150%
	@media (min-width: 1280px) {
		width: 34px;
		height: 34px;
		font-size: 12px;
	}

	//scale 125%
	@media (min-width: 1440px) {
		width: 36px;
		height: 36px;
		font-size: 13px;
	}

	//scale 100%
	@media (min-width: 1920px) {
		width: 40px;
		height: 40px;
		font-size: 14px;
	}

	//isHalf
	@media (max-width: 1220px) {
		width: 30px;
		height: 30px;
		font-size: 12px;
	}
`;

export const Name = styled.div`
	color: hsl(var(--foreground));
	font-weight: 600;
	font-size: 12px;
	line-height: 1.2;

	//scale 175%
	@media (min-width: 1024px) {
		font-size: 10px;
	}

	//scale 150%
	@media (min-width: 1280px) {
		font-size: 8px;
	}

	//scale 125%
	@media (min-width: 1440px) {
		font-size: 12px;
	}

	//scale 100%
	@media (min-width: 1920px) {
		font-size: 14px;
	}

	//isHalf
	@media (max-width: 1220px) {
		font-size: 10px;
	}
`;

export const ActionButton = styled.div`
	display: flex;
	gap: 8px;
	align-items: center;
	flex-shrink: 0;

	//scale 175%
	@media (min-width: 1024px) {
		gap: 5px;
	}

	//scale 150%
	@media (min-width: 1280px) {
		gap: 6px;
	}

	//scale 125%
	@media (min-width: 1440px) {
		gap: 7px;
	}

	//scale 100%
	@media (min-width: 1920px) {
		gap: 8px;
	}

	//isHalf
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

	//scale 175%
	@media (min-width: 1024px) {
		width: 30px;
		height: 30px;
		border-radius: 5px;
		svg {
			width: 15px;
			height: 15px;
		}
	}

	//scale 150%
	@media (min-width: 1280px) {
		width: 32px;
		height: 32px;
		border-radius: 5px;
		svg {
			width: 16px;
			height: 16px;
		}
	}

	//scale 125%
	@media (min-width: 1440px) {
		width: 34px;
		height: 34px;
		border-radius: 6px;
		svg {
			width: 17px;
			height: 17px;
		}
	}

	//scale 100%
	@media (min-width: 1920px) {
		width: 36px;
		height: 36px;
		border-radius: 6px;
		svg {
			width: 18px;
			height: 18px;
		}
	}

	//isHalf
	@media (max-width: 1220px) {
		width: 32px;
		height: 32px;
		border-radius: 6px;
		svg {
			width: 16px;
			height: 16px;
		}
	}
`;
