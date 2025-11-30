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
