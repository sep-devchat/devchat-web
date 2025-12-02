import { theme } from "@/themes";
import styled from "styled-components";

export const SectionWrapper = styled.div`
	overflow: auto;
	background: var(--card-bg, #fff);
	border-radius: 0.75rem;
	padding: 1.25rem;

	@media (min-width: 1440px) {
		border-radius: 0.6rem;
		padding: 1rem;
	}

	@media (max-width: 1220px) {
		border-radius: 0.525rem;
		padding: 0.875rem;
	}
`;

export const TitleArea = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.375rem;
	margin-bottom: 1.25rem;

	@media (min-width: 1440px) {
		gap: 0.3rem;
		margin-bottom: 1rem;
	}

	@media (max-width: 1220px) {
		gap: 0.2625rem;
		margin-bottom: 0.875rem;
	}
`;

export const TitleSection = styled.h2`
	font-weight: 700;
	font-size: 1.4375rem;
	color: ${theme.color.black};

	@media (min-width: 1440px) {
		font-size: 1.15rem;
	}

	@media (max-width: 1220px) {
		font-size: 1.00625rem;
	}
`;

export const DescripSection = styled.p`
	font-size: 1rem;
	color: ${theme.color.grey90};

	@media (min-width: 1440px) {
		font-size: 0.8rem;
	}

	@media (max-width: 1220px) {
		font-size: 0.7rem;
	}
`;

export const ContentArea = styled.div`
	display: flex;
	flex-direction: column;
	gap: 2rem;

	@media (min-width: 1440px) {
		gap: 1.6rem;
	}

	@media (max-width: 1220px) {
		gap: 1.4rem;
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
	width: 32px;
	height: 32px;
	font-size: 12px;
	margin: 0 auto;
	line-height: 1;
	vertical-align: middle;

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 50%;
		display: block;
	}

	span {
		line-height: 1;
		height: 100%;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
`;
