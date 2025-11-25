import { theme } from "@/themes";
import styled from "styled-components";

export const PageWrapper = styled.div`
	height: 100%;
	width: 450px;
	position: relative;
	display: flex;
	flex-direction: column;
	margin-right: 18px;
	background: ${theme.color.grey30};
	border-radius: 0px 10px 10px 0px;
`;

export const InfoContent = styled.div`
	flex: 1;
	padding: 16px;
	overflow: visible;
`;

export const Header = styled.div`
	border-bottom: 1px solid #e5e7eb;
	padding: 12px 16px;
	display: flex;
	flex-direction: column;
	gap: 12px;
`;

export const HeaderTop = styled.div`
	display: flex;
	justify-content: flex-end;
`;

export const HeaderChannelInfo = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 6px;
`;

export const HeaderContent = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

export const ChannelInfo = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
`;

export const ChannelIcon = styled.div`
	width: 48px;
	height: 48px;
	background-color: #dbeafe;
	border-radius: 8px;
	display: flex;
	align-items: center;
	justify-content: center;

	svg {
		color: #2563eb;
		width: 28px;
		height: 28px;
	}
`;

export const ChannelName = styled.h1`
	font-size: 20px;
	font-weight: 600;
	margin: 0;
	text-align: center;
`;

export const SearchButton = styled.button`
	padding: 8px;
	background-color: transparent;
	border: none;
	border-radius: 9999px;
	cursor: pointer;
	transition: background-color 0.2s;

	&:hover {
		background-color: #f3f4f6;
	}
`;

export const ContentArea = styled.div`
	flex: 1;
	overflow-y: auto;
`;

export const SearchContainer = styled.div`
	padding: 16px;
`;

export const SearchInputWrapper = styled.div`
	margin-bottom: 16px;
`;

export const SearchInput = styled.input`
	width: 100%;
	padding: 8px 16px;
	border: 1px solid #d1d5db;
	border-radius: 8px;
	font-size: 14px;
	outline: none;

	&:focus {
		ring: 2px;
		ring-color: #3b82f6;
	}
`;

export const SearchResultText = styled.div`
	margin-top: 8px;
	margin-bottom: 16px;
	font-size: 14px;
	color: #6b7280;
`;

export const EmptyState = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 60px 20px;
	color: #65676b;

	svg {
		opacity: 0.3;
		margin-bottom: 12px;
	}

	p {
		font-size: 14px;
	}
`;

export const MessageList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
`;

export const MessageItem = styled.div`
	display: flex;
	gap: 12px;
	padding: 12px;
	border-radius: 8px;
	cursor: pointer;

	&:hover {
		background-color: #f9fafb;
	}
`;

export const Avatar = styled.img`
	width: 40px;
	height: 40px;
	border-radius: 9999px;
	flex-shrink: 0;
`;

export const MessageContent = styled.div`
	flex: 1;
	min-width: 0;
`;

export const MessageHeader = styled.div`
	display: flex;
	align-items: baseline;
	gap: 8px;
	margin-bottom: 4px;
`;

export const SenderName = styled.span`
	font-weight: 500;
	font-size: 14px;
`;

export const Timestamp = styled.span`
	font-size: 12px;
	color: #6b7280;
`;

export const MessageText = styled.p`
	font-size: 14px;
	color: #374151;
	margin: 0;
`;

export const SelectSection = styled.div`
	border-bottom: 1px solid #e5e7eb;
`;

export const SelectButton = styled.button`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12px 16px;
	background-color: transparent;
	border: none;
	cursor: pointer;
	text-align: left;
	transition: background-color 0.2s;
	font-weight: 500;

	&:hover {
		background-color: #f9fafb;
	}

	&:focus {
		outline: none;
		box-shadow: none;
	}
`;

export const ExpandedContent = styled.div`
	border-top: 1px solid #e5e7eb;
	padding: 12px 24px;
`;

export const TabLabel = styled.span`
	font-size: 14px;
	color: ${theme.color.grey90};
	font-weight: 600;
`;

export const TabContainer = styled.div`
	display: flex;
	border-bottom: 1px solid #e5e7eb;
`;

export const Tab = styled.button<{ $active: boolean }>`
	flex: 1;
	padding: 12px 16px;
	font-size: 14px;
	font-weight: 500;
	background-color: transparent;
	border: none;
	cursor: pointer;
	transition: color 0.2s;
	color: ${(props) => (props.$active ? "#2563eb" : "#6b7280")};
	border-bottom: ${(props) => (props.$active ? "2px solid #2563eb" : "none")};
	border-radius: 0 !important;

	&:hover {
		color: ${(props) => (props.$active ? "#2563eb" : "#111827")};
	}

	&:focus {
		outline: none;
		box-shadow: none;
	}
`;

export const TabContent = styled.div`
	padding: 16px;
`;

export const ImageSection = styled.div`
	margin-bottom: 16px;

	&:last-child {
		margin-bottom: 0;
	}
`;

export const SectionTitle = styled.h3`
	font-size: 14px;
	font-weight: 500;
	color: #374151;
	margin: 0 0 8px 0;
`;

export const ImageGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 8px;
`;

export const ImageWrapper = styled.div`
	position: relative;
	aspect-ratio: 1;

	&:hover img {
		opacity: 0.8;
	}
`;

export const Image = styled.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
	border-radius: 8px;
	cursor: pointer;
	transition: opacity 0.2s;
`;

export const ImageDate = styled.div`
	position: absolute;
	bottom: 4px;
	right: 4px;
	background-color: rgba(0, 0, 0, 0.6);
	color: white;
	font-size: 12px;
	padding: 2px 6px;
	border-radius: 4px;
`;

export const FileList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

export const FileItem = styled.div`
	display: flex;
	align-items: start;
	gap: 12px;
	padding: 8px;
	border-radius: 8px;
	cursor: pointer;
	transition: background-color 0.2s;

	&:hover {
		background-color: #f9fafb;
	}
`;

export const FileIcon = styled.div`
	width: 32px;
	height: 32px;
	flex-shrink: 0;
	margin-top: 4px;
	color: #374151;
`;

export const FileInfo = styled.div`
	flex: 1;
	min-width: 0;
`;

export const FileName = styled.p`
	font-size: 14px;
	font-weight: 500;
	color: #111827;
	margin: 0;
	word-wrap: break-word;
`;

export const FileSize = styled.p`
	font-size: 12px;
	color: #6b7280;
	margin: 4px 0 0 0;
	// scrollbar-width: none;
	overflow-x: hidden;
`;

export const LinkList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

export const LinkItem = styled.div`
	padding: 12px;
	border-radius: 8px;
	cursor: pointer;
	transition: background-color 0.2s;

	&:hover {
		background-color: #f9fafb;
	}
`;

export const LinkTitle = styled.p`
	font-size: 14px;
	font-weight: 500;
	color: #2563eb;
	margin: 0 0 4px 0;

	&:hover {
		text-decoration: underline;
	}
`;

export const LinkUrl = styled.p`
	font-size: 12px;
	color: #6b7280;
	margin: 0;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;

export const SupportOption = styled.button<{ $danger?: boolean }>`
	width: 100%;
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 12px 16px;
	background-color: transparent;
	border: none;
	cursor: pointer;
	text-align: left;
	transition: background-color 0.2s;
	color: ${(props) => (props.$danger ? "#dc2626" : "#111827")};

	&:hover {
		background-color: ${(props) => (props.$danger ? "#fef2f2" : "#f9fafb")};
	}

	span {
		font-size: 14px;
		font-weight: ${(props) => (props.$danger ? "500" : "400")};
	}

	svg {
		color: ${(props) => (props.$danger ? "#dc2626" : "#6b7280")};
	}
`;
