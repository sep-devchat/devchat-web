import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { X, Search, Layers, Trash2 } from "lucide-react";
import {
	DropdownOverlay,
	ThreadDropdown,
	DropdownHeader,
	HeaderIcon,
	Title,
	CloseButton,
	SearchContainer,
	SearchWrapper,
	SearchInput,
	SearchIcon,
	CreateButton,
	ThreadsSection,
	SectionTitle,
	ThreadsList,
	ThreadItem,
	ThreadItemHeader,
	ThreadInfo,
	ThreadName,
	ThreadMeta,
	AuthorInfo,
	AuthorIcon,
	AuthorIconInner,
	AuthorName,
	TimeStamp,
	ThreadDescription,
	DeleteButton,
	EmptyState,
	EmptyIcon,
	EmptyText,
} from "./ThreadList.styled";
import {
	listThreads,
	deleteThread,
	ThreadResponse,
} from "@/services/threadAPI";
import { RootState } from "@/store";

interface ThreadListProps {
	groupId: string;
	channelId: string;
	onClose?: () => void;
	onCreateThread?: () => void;
	onThreadSelect?: (threadId: string) => void;
}

const ThreadList: React.FC<ThreadListProps> = ({
	groupId,
	channelId,
	onClose,
	onCreateThread,
	onThreadSelect,
}) => {
	const [threads, setThreads] = useState<ThreadResponse[]>([]);
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [selectedThreadId, setSelectedThreadId] = useState<string>("");

	const profile = useSelector((state: RootState) => state.user.profile);

	useEffect(() => {
		if (groupId && channelId) {
			fetchThreads();
		}
	}, [groupId, channelId]);

	useEffect(() => {
		const handleThreadCreated = () => {
			fetchThreads();
		};

		window.addEventListener(
			"app:threadCreated",
			handleThreadCreated as EventListener,
		);
		return () =>
			window.removeEventListener(
				"app:threadCreated",
				handleThreadCreated as EventListener,
			);
	}, [groupId, channelId]);

	const fetchThreads = async () => {
		if (!groupId || !channelId) return;

		setIsLoading(true);
		try {
			const response = await listThreads(groupId, channelId);
			const threadData = response?.data?.data || response?.data || [];
			setThreads(threadData);
		} catch (error) {
			console.error("Failed to fetch threads:", error);
			setThreads([]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleDeleteThread = async (e: React.MouseEvent, threadId: string) => {
		e.stopPropagation();

		if (!window.confirm("Are you sure you want to delete this thread?")) {
			return;
		}

		try {
			await deleteThread(groupId, channelId, threadId);
			setThreads((prev) => prev.filter((t) => t.id !== threadId));

			if (selectedThreadId === threadId) {
				setSelectedThreadId("");
			}
		} catch (error) {
			console.error("Failed to delete thread:", error);
			alert("Failed to delete thread. Please try again.");
		}
	};

	const handleThreadClick = (threadId: string) => {
		setSelectedThreadId(threadId);
		if (onThreadSelect) {
			onThreadSelect(threadId);
		}
	};

	const formatTimeAgo = (dateString: string): string => {
		const date = new Date(dateString);
		const now = new Date();
		const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

		if (seconds < 60) return "just now";
		const minutes = Math.floor(seconds / 60);
		if (minutes < 60) return `${minutes}m ago`;
		const hours = Math.floor(minutes / 60);
		if (hours < 24) return `${hours}h ago`;
		const days = Math.floor(hours / 24);
		if (days < 30) return `${days}d ago`;
		const months = Math.floor(days / 30);
		return `${months}mo ago`;
	};

	const getDisplayName = () => {
		if (!profile) return "Unknown User";
		if (profile.firstName && profile.lastName) {
			return `${profile.firstName} ${profile.lastName}`;
		}
		return profile.username || "Unknown User";
	};

	const filteredThreads = threads.filter((thread) =>
		thread.name.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const joinedThreads = filteredThreads;

	return (
		<>
			<DropdownOverlay onClick={onClose} />
			<ThreadDropdown onClick={(e) => e.stopPropagation()}>
				<DropdownHeader>
					<HeaderIcon>
						<Layers size={20} />
					</HeaderIcon>
					<Title>Threads</Title>
					<CloseButton onClick={onClose}>
						<X size={20} />
					</CloseButton>
				</DropdownHeader>

				<SearchContainer>
					<SearchWrapper>
						<SearchIcon>
							<Search size={16} />
						</SearchIcon>
						<SearchInput
							type="text"
							placeholder="Search for Thread Name"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
						<CreateButton onClick={onCreateThread}>Create</CreateButton>
					</SearchWrapper>
				</SearchContainer>

				<ThreadsSection>
					<SectionTitle>
						{joinedThreads.length} JOINED THREAD
						{joinedThreads.length !== 1 ? "S" : ""}
					</SectionTitle>

					{isLoading ? (
						<EmptyState>
							<EmptyText>Loading threads...</EmptyText>
						</EmptyState>
					) : joinedThreads.length === 0 ? (
						<EmptyState>
							<EmptyIcon>💬</EmptyIcon>
							<EmptyText>
								{searchTerm
									? "No threads found"
									: "No threads yet. Create one to get started!"}
							</EmptyText>
						</EmptyState>
					) : (
						<ThreadsList>
							{joinedThreads.map((thread) => (
								<ThreadItem
									key={thread.id}
									isActive={selectedThreadId === thread.id}
									onClick={() => handleThreadClick(thread.id)}
								>
									<ThreadItemHeader>
										<ThreadInfo>
											<ThreadName>{thread.name}</ThreadName>
											<ThreadMeta>
												<AuthorInfo>
													<AuthorIcon>
														{profile?.avatarUrl ? (
															<img
																src={profile.avatarUrl}
																alt={getDisplayName()}
																style={{
																	width: "100%",
																	height: "100%",
																	borderRadius: "50%",
																	objectFit: "cover",
																}}
															/>
														) : (
															<AuthorIconInner />
														)}
													</AuthorIcon>
													<AuthorName>{getDisplayName()}</AuthorName>
												</AuthorInfo>
												<span>•</span>
												<TimeStamp>{formatTimeAgo(thread.createdAt)}</TimeStamp>
											</ThreadMeta>
										</ThreadInfo>
										<DeleteButton
											onClick={(e) => handleDeleteThread(e, thread.id)}
											title="Delete thread"
										>
											<Trash2 size={16} />
										</DeleteButton>
									</ThreadItemHeader>
									{thread.description && (
										<ThreadDescription>{thread.description}</ThreadDescription>
									)}
								</ThreadItem>
							))}
						</ThreadsList>
					)}
				</ThreadsSection>
			</ThreadDropdown>
		</>
	);
};

export default ThreadList;
