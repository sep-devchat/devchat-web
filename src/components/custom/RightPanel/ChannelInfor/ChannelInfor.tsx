/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Search, Hash, X } from "lucide-react";
import {
	Avatar,
	ChannelIcon,
	ChannelName,
	ContentArea,
	EmptyState,
	ExpandedContent,
	FileIcon,
	FileInfo,
	FileItem,
	FileList,
	FileName,
	FileSize,
	Header,
	HeaderChannelInfo,
	HeaderTop,
	Image,
	ImageDate,
	ImageGrid,
	ImageSection,
	ImageWrapper,
	LinkList,
	MessageContent,
	MessageHeader,
	MessageItem,
	MessageList,
	MessageText,
	PageWrapper,
	SearchContainer,
	SearchInputWrapper,
	SearchResultText,
	SectionTitle,
	SenderName,
	Tab,
	TabContainer,
	TabContent,
	TabLabel,
	Timestamp,
} from "./ChannelInfor.styled";
import IconButton from "../../ActionButton/IconButton";
import SearchInput from "../../SearchInput/SearchInput";
import { detailChannel } from "@/services/channelAPI";
import { listAttachments, AttachmentResponse } from "@/services/attachmentAPI";

interface Props {
	groupId: string;
	channelId: string;
	channelName?: string;
}

const mockMessages = [
	{
		id: 1,
		senderId: 1,
		senderName: "Trần Nguyễn Như Nguyên",
		senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
		message: "Chờ search bên add friend hả",
		timestamp: "2 giờ",
	},
	{
		id: 2,
		senderId: 2,
		senderName: "Hà Trang",
		senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
		message: "Cái add mail nè, t tính bỏ đi",
		timestamp: "5 ngày",
	},
	{
		id: 3,
		senderId: 1,
		senderName: "Trần Nguyễn Như Nguyên",
		senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
		message: "Cái đó là t add lại cho",
		timestamp: "2 tuần",
	},
	{
		id: 4,
		senderId: 1,
		senderName: "Trần Nguyễn Như Nguyên",
		senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
		message: "...ais nay la moi add do dung hong",
		timestamp: "3 tuần",
	},
	{
		id: 5,
		senderId: 3,
		senderName: "Bùi Phan Long",
		senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
		message: "Từ review tụi add cmt luôn đi",
		timestamp: "7 tuần",
	},
	{
		id: 6,
		senderId: 4,
		senderName: "Lê Thành Long",
		senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
		message: "Có gì cứ add cmt vào",
		timestamp: "7 tuần",
	},
];

const ChannelInfor = ({
	groupId,
	channelId,
	channelName = "general",
}: Props) => {
	const [isSearchMode, setIsSearchMode] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [activeTab, setActiveTab] = useState<"images" | "files" | "links">(
		"images",
	);
	const [channelInfo, setChannelInfo] = useState<any>({});
	const [loading, setLoading] = useState(true);
	const [attachments, setAttachments] = useState<AttachmentResponse[]>([]);
	const [attachmentLimit, setAttachmentLimit] = useState(10);
	const [totalAttachments, setTotalAttachments] = useState(0);
	const [loadingAttachments, setLoadingAttachments] = useState(false);

	// Lightbox / modal state
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedImage, setSelectedImage] = useState<AttachmentResponse | null>(
		null,
	);

	// Image formats
	const imageFormats = [
		"jpg",
		"jpeg",
		"png",
		"gif",
		"webp",
		"svg",
		"bmp",
		"ico",
		"avif",
	];

	const isImageFile = (format: string) => {
		return imageFormats.includes(format.toLowerCase());
	};

	const fetchChannelInfor = async (groupId: string, channelId: string) => {
		try {
			setLoading(true);
			const response = await detailChannel(groupId, channelId);
			setChannelInfo(response.data);
		} catch (error) {
			console.error("Error fetching channel info:", error);
		} finally {
			setLoading(false);
		}
	};

	const fetchAttachments = async (limit: number) => {
		try {
			setLoadingAttachments(true);
			const response = await listAttachments(groupId, channelId, 1, limit);
			const data = response?.data;
			setAttachments(Array.isArray(data) ? data : data ? [data] : []);
			setTotalAttachments(response?.pagination?.totalRecord || 0);
		} catch (error) {
			console.error("Error fetching attachments:", error);
		} finally {
			setLoadingAttachments(false);
		}
	};

	useEffect(() => {
		console.log("Fetching channel info...", loading);
		fetchChannelInfor(groupId, channelId);
		fetchAttachments(10); // Initial load with 10 items
	}, [groupId, channelId]);

	// Fetch attachments when limit changes
	useEffect(() => {
		if (attachmentLimit > 10) {
			fetchAttachments(attachmentLimit);
		}
	}, [attachmentLimit]);

	// close modal on ESC
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				setIsModalOpen(false);
				setSelectedImage(null);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);

	const filteredMessages = mockMessages.filter(
		(msg) =>
			msg.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
			msg.senderName.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const handleMediaOptionClick = (option: "images" | "files" | "links") => {
		setActiveTab(option);
	};

	// Filter attachments by type
	const imageAttachments = attachments.filter((att) => isImageFile(att.format));
	const fileAttachments = attachments.filter(
		(att) => !isImageFile(att.format) && !/^https?:\/\//i.test(att.filePath),
	);
	const linkAttachments = attachments.filter((att) =>
		/^https?:\/\//i.test(att.filePath),
	);

	const groupImagesByMonth = () => {
		const grouped: { [key: string]: AttachmentResponse[] } = {};
		imageAttachments.forEach((img) => {
			const date = new Date(img.createdAt);
			const monthKey = `Tháng ${date.getMonth() + 1}, ${date.getFullYear()}`;
			if (!grouped[monthKey]) {
				grouped[monthKey] = [];
			}
			grouped[monthKey].push(img);
		});
		return grouped;
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return `${date.getDate()}/${date.getMonth() + 1}`;
	};

	const formatFileSize = (bytes: number) => {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
	};

	// Scroll handler for infinite loading
	const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
		const target = e.currentTarget;
		const scrolledToBottom =
			target.scrollHeight - target.scrollTop <= target.clientHeight + 100;

		if (
			scrolledToBottom &&
			!loadingAttachments &&
			attachmentLimit < totalAttachments
		) {
			setAttachmentLimit((prev) => prev + 10);
		}
	};

	const handleSearchToggle = () => {
		setIsSearchMode(!isSearchMode);
		if (isSearchMode) {
			setSearchQuery("");
		}
	};

	// Open image in lightbox/modal
	const openImageModal = (img: AttachmentResponse) => {
		setSelectedImage(img);
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setSelectedImage(null);
	};

	// Download file (works for images & files)
	const downloadFile = (file: AttachmentResponse) => {
		try {
			const a = document.createElement("a");
			a.href = file.filePath;
			// prefer original filename if present
			const filename = file.originalFileName
				? `${file.originalFileName}.${file.format}`
				: `file-${file.id}.${file.format}`;
			a.download = filename;
			a.target = "_blank";
			document.body.appendChild(a);
			a.click();
			a.remove();
		} catch (err) {
			console.error("Download failed", err);
			// fallback: open in new tab
			window.open(file.filePath, "_blank");
		}
	};

	const openLink = (url: string) => {
		window.open(url, "_blank", "noopener,noreferrer");
	};

	return (
		<PageWrapper>
			<Header>
				<HeaderTop>
					{!isSearchMode ? (
						<IconButton
							icon={Search}
							size={32}
							onClick={handleSearchToggle}
							ariaLabel="Search"
						/>
					) : (
						<IconButton
							icon={X}
							size={32}
							onClick={handleSearchToggle}
							ariaLabel="Close search"
						/>
					)}
				</HeaderTop>
				<HeaderChannelInfo>
					<ChannelIcon>
						<Hash size={26} />
					</ChannelIcon>
					<ChannelName>{channelInfo.name || channelName}</ChannelName>
				</HeaderChannelInfo>
			</Header>
			<ContentArea>
				{isSearchMode ? (
					<SearchContainer>
						<SearchInputWrapper>
							<SearchInput
								value={searchQuery}
								onChange={(v: any) => setSearchQuery(v)}
								onClear={() => setSearchQuery("")}
								placeholder="Search messages..."
							/>
							<SearchResultText>
								{searchQuery
									? `${filteredMessages.length} results`
									: "Type to search messages..."}
							</SearchResultText>
						</SearchInputWrapper>
						{searchQuery === "" ? (
							<EmptyState>
								<Search size={48} />
								<p>Type to search messages</p>
							</EmptyState>
						) : filteredMessages.length === 0 ? (
							<EmptyState>
								<Search size={48} />
								<p>Không tìm thấy kết quả</p>
							</EmptyState>
						) : (
							<MessageList>
								{filteredMessages.map((msg) => (
									<MessageItem key={msg.id}>
										<Avatar src={msg.senderAvatar} alt={msg.senderName} />
										<MessageContent>
											<MessageHeader>
												<SenderName>{msg.senderName}</SenderName>
												<Timestamp>{msg.timestamp}</Timestamp>
											</MessageHeader>
											<MessageText>{msg.message}</MessageText>
										</MessageContent>
									</MessageItem>
								))}
							</MessageList>
						)}
					</SearchContainer>
				) : (
					<div
						onScroll={handleScroll}
						style={{ overflowY: "auto", height: "100%" }}
					>
						<ExpandedContent>
							<TabLabel>Media files, files, and links</TabLabel>
							<TabContainer>
								<Tab
									$active={activeTab === "images"}
									onClick={() => handleMediaOptionClick("images")}
								>
									Images ({imageAttachments.length})
								</Tab>
								<Tab
									$active={activeTab === "files"}
									onClick={() => handleMediaOptionClick("files")}
								>
									Files ({fileAttachments.length})
								</Tab>
								<Tab
									$active={activeTab === "links"}
									onClick={() => handleMediaOptionClick("links")}
								>
									Links ({linkAttachments.length})
								</Tab>
							</TabContainer>
							<TabContent>
								{activeTab === "images" && (
									<div>
										{imageAttachments.length === 0 ? (
											<EmptyState>
												<Search size={48} />
												<p>No media files</p>
											</EmptyState>
										) : (
											<>
												{Object.entries(groupImagesByMonth()).map(
													([month, images]) => (
														<ImageSection key={month}>
															<SectionTitle>{month}</SectionTitle>
															<ImageGrid>
																{images.map((img) => (
																	<ImageWrapper
																		key={img.id}
																		onClick={() => openImageModal(img)}
																		style={{ cursor: "zoom-in" }}
																	>
																		<Image
																			src={img.filePath}
																			alt={img.originalFileName}
																		/>
																		<ImageDate>
																			{formatDate(img.createdAt)}
																		</ImageDate>
																	</ImageWrapper>
																))}
															</ImageGrid>
														</ImageSection>
													),
												)}
												{loadingAttachments && (
													<p style={{ textAlign: "center", padding: "10px" }}>
														Đang tải...
													</p>
												)}
											</>
										)}
									</div>
								)}
								{activeTab === "files" && (
									<FileList>
										{fileAttachments.length === 0 ? (
											<EmptyState>
												<Search size={48} />
												<p>No files</p>
											</EmptyState>
										) : (
											<>
												{fileAttachments.map((file) => (
													<FileItem
														key={file.id}
														onClick={() => downloadFile(file)}
														style={{ cursor: "pointer" }}
													>
														<FileIcon>
															<svg viewBox="0 0 24 24" fill="currentColor">
																<path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
															</svg>
														</FileIcon>
														<FileInfo>
															<FileName>
																{file.originalFileName}.{file.format}
															</FileName>
															<FileSize>
																{formatFileSize(file.fileSize)}
															</FileSize>
														</FileInfo>
													</FileItem>
												))}
												{loadingAttachments && (
													<p style={{ textAlign: "center", padding: "10px" }}>
														Đang tải...
													</p>
												)}
											</>
										)}
									</FileList>
								)}
								{activeTab === "links" && (
									<LinkList>
										{linkAttachments.length === 0 ? (
											<EmptyState>
												<Search size={48} />
												<p>No links</p>
											</EmptyState>
										) : (
											<>
												{linkAttachments.map((ln) => (
													<FileItem
														key={ln.id}
														style={{ cursor: "pointer" }}
														onClick={() => openLink(ln.filePath)}
													>
														<FileIcon>
															<svg viewBox="0 0 24 24" fill="currentColor">
																<path d="M3.9,12A5.1,5.1 0 0,0 9,17.1H11V15H9A3,3 0 0,1 6,12A3,3 0 0,1 9,9H11V7H9A5.1,5.1 0 0,0 3.9,12M20.1,12A5.1,5.1 0 0,1 15,6.9H13V9H15A3,3 0 0,1 18,12A3,3 0 0,1 15,15H13V17H15A5.1,5.1 0 0,1 20.1,12Z" />
															</svg>
														</FileIcon>
														<FileInfo>
															<FileName>
																{ln.originalFileName || ln.filePath}
															</FileName>
															<FileSize>{ln.filePath}</FileSize>
														</FileInfo>
													</FileItem>
												))}
											</>
										)}
									</LinkList>
								)}
							</TabContent>
						</ExpandedContent>
					</div>
				)}
			</ContentArea>

			{/* Lightbox / Modal */}
			{isModalOpen && selectedImage && (
				<div
					role="dialog"
					aria-modal="true"
					style={{
						position: "fixed",
						inset: 0,
						background: "rgba(0,0,0,0.8)",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						zIndex: 9999,
						padding: 16,
					}}
					onClick={closeModal}
				>
					<div
						style={{ position: "relative", maxWidth: "95%", maxHeight: "95%" }}
						onClick={(e) => e.stopPropagation()}
					>
						<img
							src={selectedImage.filePath}
							alt={selectedImage.originalFileName}
							style={{
								maxWidth: "100%",
								maxHeight: "80vh",
								borderRadius: 8,
								display: "block",
							}}
						/>
						<div
							style={{
								display: "flex",
								gap: 8,
								marginTop: 8,
								justifyContent: "space-between",
								alignItems: "center",
							}}
						>
							<div style={{ color: "#fff" }}>
								{selectedImage.originalFileName}
							</div>
							<div style={{ display: "flex", gap: 8 }}>
								<button
									onClick={() => downloadFile(selectedImage)}
									style={{ padding: "8px 12px", borderRadius: 6 }}
								>
									Download
								</button>
								<button
									onClick={closeModal}
									style={{ padding: "8px 12px", borderRadius: 6 }}
								>
									Close
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</PageWrapper>
	);
};

export default ChannelInfor;
