import { theme } from "@/themes";
import styled from "styled-components";

export const PageWrapper = styled.div`
	height: 100%;
	width: 100%;
	max-width: none;
	position: relative;
	display: flex;
	flex-direction: column;
	margin-right: 0;
	background: ${theme.color.grey30};
	border-radius: 0 0.625rem 0.625rem 0;

	@media (max-width: 1220px) {
		border-radius: 0 0.5rem 0.5rem 0;
	}

	@media (min-width: 1440px) {
		border-radius: 0 0.75rem 0.75rem 0;
	}
`;

export const CPHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 3.25rem;
	padding: 0.875rem 0.75rem;
	background: ${theme.color.grey30};
	border-top-right-radius: 0.625rem;

	@media (max-width: 1220px) {
		height: 3rem;
		padding: 0.75rem 0.625rem;
		border-top-right-radius: 0.5rem;
	}

	@media (min-width: 1440px) {
		height: 3.2rem;
		padding: 1rem 0.5rem;
		border-top-right-radius: 0.75rem;
	}
`;

export const CPHeaderIcon = styled.div`
	width: 2.75rem;
	height: 2.75rem;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: 700;
	color: #4338ca;

	@media (max-width: 1220px) {
		width: 2.5rem;
		height: 2.5rem;
	}

	@media (min-width: 1440px) {
		width: 1.5rem;
		height: 1.5rem;
	}
`;

export const CPHeaderLeft = styled.div`
	display: flex;
	align-items: center;
	gap: 0.75rem;

	@media (max-width: 1220px) {
		gap: 0.625rem;
	}

	@media (min-width: 1440px) {
		gap: 1rem;
	}
`;

export const CPHeaderRight = styled.div`
	display: flex;
	align-items: center;
	gap: 0.75rem;

	@media (max-width: 1220px) {
		gap: 0.625rem;
	}

	@media (min-width: 1440px) {
		gap: 0.5rem;
	}
`;

export const CPChatArea = styled.div`
	height: 100%;
	background: ${theme.color.grey10};
	border-bottom-right-radius: 0.625rem;

	@media (max-width: 1220px) {
		border-bottom-right-radius: 0.625rem;
	}

	@media (min-width: 1440px) {
		border-bottom-right-radius: 0.625rem;
	}
`;

export const CPHash = styled.div`
	width: 2.75rem;
	height: 2.75rem;
	border-radius: 62.4375rem;
	background: #eef2ff;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: 700;
	color: #4338ca;

	@media (max-width: 1220px) {
		width: 2.5rem;
		height: 2.5rem;
	}

	@media (min-width: 1440px) {
		width: 1rem;
		height: 1rem;
	}
`;

export const CPTitle = styled.h2`
	margin: 0;
	font-size: 1.125rem;

	@media (max-width: 1220px) {
		font-size: 1rem;
	}

	@media (min-width: 1440px) {
		font-size: 1.25rem;
	}
`;

export const MemberContent = styled.div`
	flex: 1;
	padding: 1rem;
	overflow: visible;

	@media (max-width: 1220px) {
		padding: 0.875rem;
	}

	@media (min-width: 1440px) {
		padding: 0.75rem;
	}
`;

export const MemberSection = styled.div`
	margin-bottom: 1.5rem;

	@media (max-width: 1220px) {
		margin-bottom: 1.25rem;
	}

	@media (min-width: 1440px) {
		margin-bottom: 1.5rem;
	}
`;

export const SectionHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 0.75rem;

	@media (max-width: 1220px) {
		margin-bottom: 0.625rem;
	}

	@media (min-width: 1440px) {
		margin-bottom: 0.5rem;
	}
`;

export const SectionTitle = styled.h3`
	margin: 0;
	font-size: 1rem;
	font-weight: 600;
	color: ${theme.color.grey90 || "#374151"};
	letter-spacing: 0.03125rem;

	@media (max-width: 1220px) {
		font-size: 0.875rem;
		letter-spacing: 0.025rem;
	}

	@media (min-width: 1440px) {
		font-size: 1rem;
		letter-spacing: 0.03125rem;
	}
`;

export const MemberCount = styled.span`
	background: ${theme.color.grey90 || "#9CA3AF"};
	color: white;
	border-radius: 0.75rem;
	padding: 0.125rem 0.5rem;
	font-size: 0.75rem;
	font-weight: 500;
	min-width: 1.25rem;
	text-align: center;

	@media (max-width: 1220px) {
		border-radius: 0.625rem;
		padding: 0.0625rem 0.375rem;
		font-size: 0.6875rem;
		min-width: 1.125rem;
	}

	@media (min-width: 1440px) {
		border-radius: 1rem;
		padding: 0.1875rem 0.625rem;
		font-size: 0.8rem;
		min-width: 1.1rem;
	}
`;

export const MembersList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.5rem;

	@media (max-width: 1220px) {
		gap: 0.375rem;
	}

	@media (min-width: 1440px) {
		gap: 0.625rem;
	}
`;

export const SearchButton = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 2.25rem;
	height: 2.25rem;
	border: none;
	background: transparent;
	cursor: pointer;
	border-radius: 50%;
	transition: background-color 0.2s;

	&:hover {
		color: #fff;
	}

	&:focus {
		outline: none;
	}

	@media (max-width: 1220px) {
		width: 2rem;
		height: 2rem;
	}

	@media (min-width: 1440px) {
		width: 2.5rem;
		height: 2.5rem;
	}
`;

export const CloseButton = styled.button`
	background: none;
	border: none;
	cursor: pointer;
	padding: 0.75rem;
	display: flex;
	align-items: center;
	justify-content: center;
	color: ${theme.color.grey50};
	transition: color 0.2s;

	&:hover {
		color: #fff;
	}

	&:focus {
		outline: none;
	}

	@media (max-width: 1220px) {
		padding: 0.375rem;
	}

	@media (min-width: 1440px) {
		padding: 0.625rem;
	}
`;

export const SearchResultTotal = styled.div`
	margin-bottom: 1rem;

	@media (max-width: 1220px) {
		margin-bottom: 0.875rem;
	}

	@media (min-width: 1440px) {
		margin-bottom: 1.25rem;
	}
`;

export const SearchHeader = styled.div`
	font-size: 0.75rem;
	color: #65676b;
	padding-left: 0.25rem;

	@media (max-width: 1220px) {
		font-size: 0.6875rem;
		padding-left: 0.1875rem;
	}

	@media (min-width: 1440px) {
		font-size: 0.8125rem;
		padding-left: 0.3125rem;
	}
`;

export const NoneResult = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 3.75rem 1.25rem;
	color: #65676b;

	@media (max-width: 1220px) {
		padding: 3rem 1rem;
	}

	@media (min-width: 1440px) {
		padding: 4.5rem 1.5rem;
	}
`;

export const MesResultItem = styled.div`
	display: flex;
	align-items: flex-start;
	gap: 0.75rem;
	padding: 0.75rem;
	border-radius: 0.5rem;
	cursor: pointer;
	transition: background-color 0.2s;

	&:hover {
		background-color: ${theme.color.grey20};
	}

	@media (max-width: 1220px) {
		gap: 0.625rem;
		padding: 0.625rem;
		border-radius: 0.375rem;
	}

	@media (min-width: 1440px) {
		gap: 1rem;
		padding: 0.875rem;
		border-radius: 0.625rem;
	}
`;

export const SenderAvatar = styled.img`
	width: 2.5rem;
	height: 2.5rem;
	border-radius: 50%;
	flex-shrink: 0;

	@media (max-width: 1220px) {
		width: 2.25rem;
		height: 2.25rem;
	}

	@media (min-width: 1440px) {
		width: 3rem;
		height: 3rem;
	}
`;

export const MesContentItem = styled.div`
	flex: 1;
	min-width: 0;
`;

export const MesContentHeader = styled.div`
	display: flex;
	align-items: baseline;
	gap: 0.5rem;
	margin-bottom: 0.25rem;

	@media (max-width: 1220px) {
		gap: 0.375rem;
		margin-bottom: 0.1875rem;
	}

	@media (min-width: 1440px) {
		gap: 0.625rem;
		margin-bottom: 0.3125rem;
	}
`;

export const SenderName = styled.h3`
	font-size: 0.875rem;
	font-weight: 600;
	color: #1c1e21;
	margin: 0;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;

	@media (max-width: 1220px) {
		font-size: 0.8125rem;
	}

	@media (min-width: 1440px) {
		font-size: 0.9375rem;
	}
`;

export const Timestamp = styled.span`
	font-size: 0.75rem;
	color: #65676b;
	flex-shrink: 0;

	@media (max-width: 1220px) {
		font-size: 0.6875rem;
	}

	@media (min-width: 1440px) {
		font-size: 0.8125rem;
	}
`;

export const Message = styled.p`
	font-size: 0.875rem;
	color: #65676b;
	margin: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	line-height: 1.4;

	@media (max-width: 1220px) {
		font-size: 0.8125rem;
		line-height: 1.3;
	}

	@media (min-width: 1440px) {
		font-size: 0.9375rem;
		line-height: 1.5;
	}
`;
