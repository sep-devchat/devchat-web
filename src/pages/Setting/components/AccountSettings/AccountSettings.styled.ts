import styled from "styled-components";

export const LanguagesContainer = styled.div`
	background: white;
	// border: 1px solid #e5e7eb;
	border: 1px solid #aaaaaa;

	border-radius: 12px;
	padding: 24px;
	transition: all 0.2s ease;

	&:hover {
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	}

	@media (max-width: 1220px) {
		padding: 16.8px;
		border-radius: 8.4px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		padding: 19.2px;
		border-radius: 9.6px;
	}

	@media (min-width: 1920px) {
		padding: 26.4px;
		border-radius: 13.2px;
	}
`;

export const LanguagesSectionHeader = styled.div`
	display: flex;
	align-items: flex-start;
	gap: 16px;
	margin-bottom: 20px;
	padding-bottom: 16px;
	border-bottom: 1px solid #e5e7eb;

	@media (max-width: 1220px) {
		gap: 11.2px;
		margin-bottom: 14px;
		padding-bottom: 11.2px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		gap: 12.8px;
		margin-bottom: 16px;
		padding-bottom: 12.8px;
	}

	@media (min-width: 1920px) {
		gap: 17.6px;
		margin-bottom: 22px;
		padding-bottom: 17.6px;
	}
`;

export const LanguagesSectionIcon = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 40px;
	height: 40px;
	border-radius: 8px;
	background: #f3f4f6;
	color: #133e87;
	flex-shrink: 0;

	@media (max-width: 1220px) {
		width: 28px;
		height: 28px;
		border-radius: 5.6px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		width: 32px;
		height: 32px;
		border-radius: 6.4px;
	}

	@media (min-width: 1920px) {
		width: 44px;
		height: 44px;
		border-radius: 8.8px;
	}
`;

export const LanguagesSectionInfo = styled.div`
	flex: 1;
`;

export const LanguagesSectionTitle = styled.h3`
	font-size: 16px;
	font-weight: 600;
	color: #1f2937;
	margin: 0 0 4px 0;

	@media (max-width: 1220px) {
		font-size: 14px;
		margin: 0 0 2.8px 0;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 15px;
		margin: 0 0 3.2px 0;
	}

	@media (min-width: 1920px) {
		font-size: 17.6px;
		margin: 0 0 4.4px 0;
	}
`;

export const LanguagesSectionDescription = styled.p`
	font-size: 14px;
	color: #6b7280;
	margin: 0;

	@media (max-width: 1220px) {
		font-size: 12.5px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 13.5px;
	}

	@media (min-width: 1920px) {
		font-size: 16px;
	}
`;

export const LanguagesSection = styled.div`
	margin-top: 24px;

	@media (max-width: 1220px) {
		margin-top: 16.8px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		margin-top: 19.2px;
	}

	@media (min-width: 1920px) {
		margin-top: 26.4px;
	}
`;

export const LanguagesHeader = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
	margin-bottom: 16px;

	@media (max-width: 1220px) {
		gap: 8.4px;
		margin-bottom: 11.2px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		gap: 9.6px;
		margin-bottom: 12.8px;
	}

	@media (min-width: 1920px) {
		gap: 13.2px;
		margin-bottom: 17.6px;
	}
`;

export const LanguagesTitle = styled.h3`
	font-size: 16px;
	font-weight: 600;
	color: #1f2937;

	@media (max-width: 1220px) {
		font-size: 14px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 15px;
	}

	@media (min-width: 1920px) {
		font-size: 17.6px;
	}
`;

export const AddButton = styled.button`
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 8px 16px;
	background: #133e87;
	color: white;
	border: none;
	border-radius: 6px;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s ease;

	&:hover {
		background: rgba(32, 102, 223, 0.25);
		color: #133e87;
	}

	&:focus {
		outline: none;
	}

	@media (max-width: 1220px) {
		gap: 5.6px;
		padding: 5.6px 11.2px;
		border-radius: 4.2px;
		font-size: 12.5px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		gap: 6.4px;
		padding: 6.4px 12.8px;
		border-radius: 4.8px;
		font-size: 13.5px;
	}

	@media (min-width: 1920px) {
		gap: 8.8px;
		padding: 8.8px 17.6px;
		border-radius: 6.6px;
		font-size: 16px;
	}
`;

export const EmptyState = styled.div`
	text-align: center;
	padding: 32px;
	color: #6b7280;
	background: #f9fafb;
	border-radius: 8px;
	border: 1px dashed #d1d5db;

	@media (max-width: 1220px) {
		padding: 22.4px;
		border-radius: 5.6px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		padding: 25.6px;
		border-radius: 6.4px;
	}

	@media (min-width: 1920px) {
		padding: 35.2px;
		border-radius: 8.8px;
	}
`;
