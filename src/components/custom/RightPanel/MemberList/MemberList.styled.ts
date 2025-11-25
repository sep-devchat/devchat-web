import { theme } from "@/themes";
import styled from "styled-components";

export const PageWrapper = styled.div`
	height: 100%;
	width: 350px;
	position: relative;
	display: flex;
	flex-direction: column;
	margin-right: 18px;
	background: ${theme.color.grey30};
	border-radius: 0px 10px 10px 0px;

	@media (max-width: 1220px) {
		width: 100%;
		margin-right: 0;
	}
`;

export const CPHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 52px;
	padding: 14px 12px;
	background: ${theme.color.grey30};
	border-top-right-radius: 10px;
`;

export const CPHeaderIcon = styled.div`
	width: 44px;
	height: 44px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: 700;
	color: #4338ca;
`;

export const CPHeaderLeft = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
`;

export const CPHeaderRight = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
`;

export const CPChatArea = styled.div`
	height: 100%;
	background: ${theme.color.grey10};
	border-bottom-right-radius: 10px;
`;

export const CPHash = styled.div`
	width: 44px;
	height: 44px;
	border-radius: 999px;
	background: #eef2ff;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: 700;
	color: #4338ca;
`;

export const CPTitle = styled.h2`
	margin: 0;
	font-size: 18px;
`;

export const MemberContent = styled.div`
	flex: 1;
	padding: 16px;
	overflow: visible;
`;

export const MemberSection = styled.div`
	margin-bottom: 24px;
`;

export const SectionHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 12px;
`;

export const SectionTitle = styled.h3`
	margin: 0;
	font-size: 16px;
	font-weight: 600;
	color: ${theme.color.grey90 || "#374151"};
	letter-spacing: 0.5px;
`;

export const MemberCount = styled.span`
	background: ${theme.color.grey90 || "#9CA3AF"};
	color: white;
	border-radius: 12px;
	padding: 2px 8px;
	font-size: 12px;
	font-weight: 500;
	min-width: 20px;
	text-align: center;
`;

export const MembersList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

export const SearchButton = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 36px;
	height: 36px;
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
`;

export const CloseButton = styled.button`
	background: none;
	border: none;
	cursor: pointer;
	padding: 8px;
	display: flex;
	align-items: center;
	justify-content: center;
	// color: #888;
	color: ${theme.color.grey50};
	transition: color 0.2s;

	&:hover {
		color: #fff;
	}

	&:focus {
		outline: none;
	}
`;

export const SearchResultTotal = styled.div`
	margin-bottom: 16px;
`;

export const SearchHeader = styled.div`
	font-size: 12px;
	color: #65676b;
	padding-left: 4px;
`;

export const NoneResult = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 60px 20px;
	color: #65676b;
`;

export const MesResultItem = styled.div`
	display: flex;
	align-items: flex-start;
	gap: 12px;
	padding: 12px;
	border-radius: 8px;
	cursor: pointer;
	transition: background-color 0.2s;

	&:hover {
		background-color: ${theme.color.grey20};
	}
`;

export const SenderAvatar = styled.img`
	width: 40px;
	height: 40px;
	border-radius: 50%;
	flex-shrink: 0;
`;

export const MesContentItem = styled.div`
	flex: 1;
	min-width: 0;
`;

export const MesContentHeader = styled.div`
	display: flex;
	align-items: baseline;
	gap: 8px;
	margin-bottom: 4px;
`;

export const SenderName = styled.h3`
	font-size: 14px;
	font-weight: 600;
	color: #1c1e21;
	margin: 0;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;

export const Timestamp = styled.span`
	font-size: 12px;
	color: #65676b;
	flex-shrink: 0;
`;

export const Message = styled.p`
	font-size: 14px;
	color: #65676b;
	margin: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	line-height: 1.4;
`;
