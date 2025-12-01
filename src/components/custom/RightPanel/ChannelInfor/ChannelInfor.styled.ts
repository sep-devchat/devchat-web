import { theme } from "@/themes";
import styled from "styled-components";

export const PageWrapper = styled.div`
	height: 100%;
	width: 100%;
	position: relative;
	display: flex;
	flex-direction: column;
	margin: 0;
	background: ${theme.color.grey30};
	border-radius: 0px 10px 10px 0px;

	@media (max-width: 1220px) {
		width: 100%;
		border-radius: 0px 10px 10px 0px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		border-radius: 8px;
	}

	@media (min-width: 1920px) {
		border-radius: 11px;
	}
`;

export const InfoContent = styled.div`
	flex: 1;
	padding: 16px;
	overflow: visible;
	@media (max-width: 1220px) {
		padding: 11.2px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		padding: 12.8px;
	}

	@media (min-width: 1920px) {
		padding: 17.6px;
	}
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
	@media (max-width: 1220px) {
		gap: 4.2px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		gap: 4.8px;
	}

	@media (min-width: 1920px) {
		gap: 6.6px;
	}
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
	@media (max-width: 1220px) {
		gap: 8.4px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		gap: 9.6px;
	}

	@media (min-width: 1920px) {
		gap: 13.2px;
	}
`;

export const ChannelIcon = styled.div<{ $isDirect?: boolean }>`
	width: 48px;
	height: 48px;
	background-color: #dbeafe;
	border-radius: ${(props) => (props.$isDirect ? "9999px" : "8px")};
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;

	svg {
		color: #2563eb;
		width: 28px;
		height: 28px;
	}

	@media (max-width: 1220px) {
		width: 33.6px;
		height: 33.6px;
		border-radius: 5.6px;

		svg {
			width: 19.6px;
			height: 19.6px;
		}
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		width: 38.4px;
		height: 38.4px;
		border-radius: 6.4px;

		svg {
			width: 22.4px;
			height: 22.4px;
		}
	}

	@media (min-width: 1920px) {
		width: 52.8px;
		height: 52.8px;
		border-radius: 8.8px;

		svg {
			width: 30.8px;
			height: 30.8px;
		}
	}
	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: inherit;
	}

	span {
		font-size: 18px;
		font-weight: 600;
		color: #1f2937;
	}
`;

export const ChannelSubtitle = styled.p`
	font-size: 13px;
	color: #6b7280;
	margin: 0;
	text-align: center;
`;

export const ChannelName = styled.h1`
	font-size: 20px;
	font-weight: 600;
	margin: 0;
	text-align: center;
	@media (max-width: 1220px) {
		font-size: 14px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 15px;
	}

	@media (min-width: 1920px) {
		font-size: 18px;
	}
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

	@media (max-width: 1220px) {
		padding: 5.6px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		padding: 6.4px;
	}

	@media (min-width: 1920px) {
		padding: 8.8px;
	}
`;

export const ContentArea = styled.div`
	flex: 1;
	overflow-y: auto;
	padding-right: 4px;

	@media (max-width: 768px) {
		padding-right: 0;
	}
`;

export const SearchContainer = styled.div`
	padding: 16px;

	@media (max-width: 1220px) {
		padding: 11.2px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		padding: 12.8px;
	}

	@media (min-width: 1920px) {
		padding: 17.6px;
	}
`;

export const SearchInputWrapper = styled.div`
	margin-bottom: 16px;

	@media (max-width: 1220px) {
		margin-bottom: 11.2px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		margin-bottom: 12.8px;
	}

	@media (min-width: 1920px) {
		margin-bottom: 17.6px;
	}
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

	@media (max-width: 1220px) {
		padding: 5.6px 11.2px;
		border-radius: 5.6px;
		font-size: 12px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		padding: 6.4px 12.8px;
		border-radius: 6.4px;
		font-size: 13px;
	}

	@media (min-width: 1920px) {
		padding: 8.8px 17.6px;
		border-radius: 8.8px;
		font-size: 16px;
	}
`;

export const SearchResultText = styled.div`
	margin-top: 8px;
	margin-bottom: 16px;
	font-size: 14px;
	color: #6b7280;
	@media (max-width: 1220px) {
		margin-top: 5.6px;
		margin-bottom: 11.2px;
		font-size: 12px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		margin-top: 6.4px;
		margin-bottom: 12.8px;
		font-size: 13px;
	}

	@media (min-width: 1920px) {
		margin-top: 8.8px;
		margin-bottom: 17.6px;
		font-size: 16px;
	}
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

	@media (max-width: 1220px) {
		padding: 42px 14px;

		svg {
			margin-bottom: 8.4px;
		}

		p {
			font-size: 12px;
		}
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		padding: 48px 16px;

		svg {
			margin-bottom: 9.6px;
		}

		p {
			font-size: 13px;
		}
	}

	@media (min-width: 1920px) {
		padding: 66px 22px;

		svg {
			margin-bottom: 13.2px;
		}

		p {
			font-size: 16px;
		}
	}
`;

export const MessageList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;

	@media (max-width: 1220px) {
		gap: 8.4px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		gap: 9.6px;
	}

	@media (min-width: 1920px) {
		gap: 13.2px;
	}
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

	@media (max-width: 1220px) {
		gap: 8.4px;
		padding: 8.4px;
		border-radius: 5.6px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		gap: 9.6px;
		padding: 9.6px;
		border-radius: 6.4px;
	}

	@media (min-width: 1920px) {
		gap: 13.2px;
		padding: 13.2px;
		border-radius: 8.8px;
	}
`;

export const Avatar = styled.img`
	width: 40px;
	height: 40px;
	border-radius: 9999px;
	flex-shrink: 0;

	@media (max-width: 1220px) {
		width: 28px;
		height: 28px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		width: 32px;
		height: 32px;
	}

	@media (min-width: 1920px) {
		width: 44px;
		height: 44px;
	}
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

	@media (max-width: 1220px) {
		gap: 5.6px;
		margin-bottom: 2.8px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		gap: 6.4px;
		margin-bottom: 3.2px;
	}

	@media (min-width: 1920px) {
		gap: 8.8px;
		margin-bottom: 4.4px;
	}
`;

export const SenderName = styled.span`
	font-weight: 500;
	font-size: 14px;
	@media (max-width: 1220px) {
		font-size: 12px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 13px;
	}

	@media (min-width: 1920px) {
		font-size: 16px;
	}
`;

export const Timestamp = styled.span`
	font-size: 12px;
	color: #6b7280;
	@media (max-width: 1220px) {
		font-size: 11px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 12px;
	}

	@media (min-width: 1920px) {
		font-size: 14px;
	}
`;

export const MessageText = styled.p`
	font-size: 14px;
	color: #374151;
	margin: 0;

	@media (max-width: 1220px) {
		font-size: 12px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 13px;
	}

	@media (min-width: 1920px) {
		font-size: 16px;
	}
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

	@media (max-width: 1220px) {
		padding: 8.4px 11.2px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		padding: 9.6px 12.8px;
	}

	@media (min-width: 1920px) {
		padding: 13.2px 17.6px;
	}
`;

export const ExpandedContent = styled.div`
	border-top: 1px solid #e5e7eb;
	padding: 12px 24px;

	@media (max-width: 1220px) {
		padding: 8.4px 16.8px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		padding: 9.6px 19.2px;
	}

	@media (min-width: 1920px) {
		padding: 13.2px 26.4px;
	@media (max-width: 768px) {
		padding: 12px 16px;
	}
`;

export const TabLabel = styled.span`
	font-size: 14px;
	color: ${theme.color.grey90};
	font-weight: 600;
`;

export const TabContainer = styled.div`
	display: flex;
	border-bottom: 1px solid #e5e7eb;
	flex-wrap: nowrap;
	overflow-x: auto;
`;

export const Tab = styled.button<{ $active: boolean }>`
	flex: 1 1 0;
	min-width: 0;
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
	text-align: center;
	white-space: nowrap;

	&:hover {
		color: ${(props) => (props.$active ? "#2563eb" : "#111827")};
	}

	&:focus {
		outline: none;
		box-shadow: none;
	}

	@media (max-width: 1220px) {
		padding: 8.4px 11.2px;
		font-size: 12px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		padding: 9.6px 12.8px;
		font-size: 13px;
	}

	@media (min-width: 1920px) {
		padding: 13.2px 17.6px;
		font-size: 16px;
	}
`;

export const TabContent = styled.div`
	padding: 16px;

	@media (max-width: 1220px) {
		padding: 11.2px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		padding: 12.8px;
	}

	@media (min-width: 1920px) {
		padding: 17.6px;
	}
`;

export const ImageSection = styled.div`
	margin-bottom: 16px;

	&:last-child {
		margin-bottom: 0;
	}

	@media (max-width: 1220px) {
		margin-bottom: 11.2px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		margin-bottom: 12.8px;
	}

	@media (min-width: 1920px) {
		margin-bottom: 17.6px;
	}
`;

export const SectionTitle = styled.h3`
	font-size: 14px;
	font-weight: 500;
	color: #374151;
	margin: 0 0 8px 0;

	@media (max-width: 1220px) {
		font-size: 12px;
		margin: 0 0 5.6px 0;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 13px;
		margin: 0 0 6.4px 0;
	}

	@media (min-width: 1920px) {
		font-size: 16px;
		margin: 0 0 8.8px 0;
	}
`;

export const ImageGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
	gap: 8px;

	@media (max-width: 1220px) {
		gap: 5.6px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		gap: 6.4px;
	}

	@media (min-width: 1920px) {
		gap: 8.8px;
	}
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

	@media (max-width: 1220px) {
		border-radius: 5.6px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		border-radius: 6.4px;
	}

	@media (min-width: 1920px) {
		border-radius: 8.8px;
	}
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

	@media (max-width: 1220px) {
		bottom: 2.8px;
		right: 2.8px;
		font-size: 11px;
		padding: 1.4px 4.2px;
		border-radius: 2.8px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		bottom: 3.2px;
		right: 3.2px;
		font-size: 12px;
		padding: 1.6px 4.8px;
		border-radius: 3.2px;
	}

	@media (min-width: 1920px) {
		bottom: 4.4px;
		right: 4.4px;
		font-size: 14px;
		padding: 2.2px 6.6px;
		border-radius: 4.4px;
	}
`;

export const FileList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;

	@media (max-width: 1220px) {
		gap: 5.6px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		gap: 6.4px;
	}

	@media (min-width: 1920px) {
		gap: 8.8px;
	}
`;

export const FileItem = styled.div`
	display: flex;
	align-items: flex-start;
	gap: 12px;
	padding: 8px;
	border-radius: 8px;
	cursor: pointer;
	transition: background-color 0.2s;

	&:hover {
		background-color: #f9fafb;
	}

	@media (max-width: 1220px) {
		gap: 8.4px;
		padding: 5.6px;
		border-radius: 5.6px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		gap: 9.6px;
		padding: 6.4px;
		border-radius: 6.4px;
	}

	@media (min-width: 1920px) {
		gap: 13.2px;
		padding: 8.8px;
		border-radius: 8.8px;
	@media (max-width: 640px) {
		flex-direction: column;
		align-items: stretch;
	}
`;

export const FileIcon = styled.div`
	width: 32px;
	height: 32px;
	flex-shrink: 0;
	margin-top: 4px;
	color: #374151;

	@media (max-width: 1220px) {
		width: 22.4px;
		height: 22.4px;
		margin-top: 2.8px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		width: 25.6px;
		height: 25.6px;
		margin-top: 3.2px;
	}

	@media (min-width: 1920px) {
		width: 35.2px;
		height: 35.2px;
		margin-top: 4.4px;
	}
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

	@media (max-width: 1220px) {
		font-size: 12px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 13px;
	}

	@media (min-width: 1920px) {
		font-size: 16px;
	}
`;

export const FileSize = styled.p`
	font-size: 12px;
	color: #6b7280;
	margin: 4px 0 0 0;
	// scrollbar-width: none;
	overflow-x: hidden;

	@media (max-width: 1220px) {
		font-size: 11px;
		margin: 2.8px 0 0 0;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 12px;
		margin: 3.2px 0 0 0;
	}

	@media (min-width: 1920px) {
		font-size: 14px;
		margin: 4.4px 0 0 0;
	}
`;

export const LinkList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;

	@media (max-width: 1220px) {
		gap: 5.6px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		gap: 6.4px;
	}

	@media (min-width: 1920px) {
		gap: 8.8px;
	}
`;

export const LinkItem = styled.div`
	padding: 12px;
	border-radius: 8px;
	cursor: pointer;
	transition: background-color 0.2s;

	&:hover {
		background-color: #f9fafb;
	}

	@media (max-width: 1220px) {
		padding: 8.4px;
		border-radius: 5.6px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		padding: 9.6px;
		border-radius: 6.4px;
	}

	@media (min-width: 1920px) {
		padding: 13.2px;
		border-radius: 8.8px;
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

	@media (max-width: 1220px) {
		font-size: 12px;
		margin: 0 0 2.8px 0;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 13px;
		margin: 0 0 3.2px 0;
	}

	@media (min-width: 1920px) {
		font-size: 16px;
		margin: 0 0 4.4px 0;
	}
`;

export const LinkUrl = styled.p`
	font-size: 12px;
	color: #6b7280;
	margin: 0;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;

	@media (max-width: 1220px) {
		font-size: 11px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 12px;
	}

	@media (min-width: 1920px) {
		font-size: 14px;
	}
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

	@media (max-width: 1220px) {
		gap: 8.4px;
		padding: 8.4px 11.2px;

		span {
			font-size: 12px;
		}
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		gap: 9.6px;
		padding: 9.6px 12.8px;

		span {
			font-size: 13px;
		}
	}

	@media (min-width: 1920px) {
		gap: 13.2px;
		padding: 13.2px 17.6px;

		span {
			font-size: 16px;
		}
	}
`;
