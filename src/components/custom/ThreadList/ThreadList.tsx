import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, Search, Layers, Trash2, Edit } from "lucide-react";
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
	DeleteButton,
	EditButton,
	EmptyState,
	EmptyIcon,
	EmptyText,
} from "./ThreadList.styled";
import {
	listThreads,
	deleteThread as deleteThreadAPI,
	updateThread as updateThreadAPI,
	ThreadResponse,
	ThreadPutRequest,
} from "@/services/threadAPI";
import { detailUser, UserResponse } from "@/services/userAPI";
import ConfirmModal from "@/components/custom/ConfirmModal/ConfirmModal";
import ThreadEditModal from "@/components/custom/ThreadEditModal/ThreadEditModal";
import { RootState } from "@/store";
import {
	setThreadsLoading,
	setThreads,
	deleteThread as deleteThreadAction,
	updateThread as updateThreadAction,
} from "@/store/thread.slice";

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
	onThreadSelect,
}) => {
	const dispatch = useDispatch();
	const channelKey = `${groupId}-${channelId}`;

	const channelData = useSelector(
		(state: RootState) => state.thread.threadsByChannel[channelKey],
	);

	const threads = channelData?.threads || [];
	const threadCreators = channelData?.creators || {};
	const isLoading = channelData?.isLoading || false;
	const lastFetched = channelData?.lastFetched || 0;

	const [searchTerm, setSearchTerm] = useState<string>("");
	const [selectedThreadId, setSelectedThreadId] = useState<string>("");
	const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
	const [threadToDelete, setThreadToDelete] = useState<string>("");
	const [isDeleting, setIsDeleting] = useState<boolean>(false);
	const [showEditModal, setShowEditModal] = useState<boolean>(false);
	const [threadToEdit, setThreadToEdit] = useState<{
		id: string;
		name: string;
	} | null>(null);

	const fetchThreads = useCallback(
		async (options?: { silent?: boolean }) => {
			if (!groupId || !channelId) return;
			const silent = options?.silent ?? false;

			if (!silent) {
				dispatch(setThreadsLoading({ channelKey, isLoading: true }));
			}

			try {
				const response = await listThreads(groupId, channelId);
				const threadData = response?.data?.data || response?.data || [];

				const creatorsMap: { [key: string]: UserResponse } = {};
				const fetchPromises = threadData.map(async (thread: ThreadResponse) => {
					if (thread.createdBy && typeof thread.createdBy === "string") {
						try {
							const userResponse = await detailUser(thread.createdBy);
							const userData = userResponse?.data || userResponse;
							if (userData) {
								creatorsMap[thread.createdBy] = userData;
							}
						} catch (error) {
							console.error(`Failed to fetch user ${thread.createdBy}:`, error);
						}
					}
				});

				await Promise.all(fetchPromises);

				dispatch(
					setThreads({
						channelKey,
						threads: threadData,
						creators: creatorsMap,
					}),
				);
			} catch (error) {
				console.error("Failed to fetch threads:", error);
				dispatch(
					setThreads({
						channelKey,
						threads: [],
						creators: {},
					}),
				);
			}
		},
		[groupId, channelId, channelKey, dispatch],
	);

	useEffect(() => {
		if (groupId && channelId && lastFetched === 0) {
			fetchThreads();
		}
	}, [groupId, channelId, lastFetched, fetchThreads]);

	useEffect(() => {
		const handleThreadCreated = (event: CustomEvent) => {
			const { groupId: eventGroupId, channelId: eventChannelId } =
				event.detail || {};
			if (eventGroupId === groupId && eventChannelId === channelId) {
				fetchThreads();
			}
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
	}, [groupId, channelId, fetchThreads]);

	useEffect(() => {
		if (!groupId || !channelId) return;
		const intervalId = window.setInterval(() => {
			fetchThreads({ silent: true });
		}, 5000);
		return () => window.clearInterval(intervalId);
	}, [groupId, channelId, fetchThreads]);

	const handleDeleteClick = (e: React.MouseEvent, threadId: string) => {
		e.stopPropagation();
		setThreadToDelete(threadId);
		setShowDeleteModal(true);
	};

	const handleConfirmDelete = async () => {
		if (!threadToDelete) return;

		setIsDeleting(true);
		try {
			await deleteThreadAPI(groupId, channelId, threadToDelete);

			dispatch(deleteThreadAction({ channelKey, threadId: threadToDelete }));

			if (selectedThreadId === threadToDelete) {
				setSelectedThreadId("");
			}

			setShowDeleteModal(false);
			setThreadToDelete("");
		} catch (error) {
			console.error("Failed to delete thread:", error);
			alert("Failed to delete thread. Please try again.");
		} finally {
			setIsDeleting(false);
		}
	};

	const handleCancelDelete = () => {
		setShowDeleteModal(false);
		setThreadToDelete("");
	};

	const handleEditClick = (e: React.MouseEvent, thread: ThreadResponse) => {
		e.stopPropagation();
		setThreadToEdit({
			id: thread.id,
			name: thread.name,
		});
		setShowEditModal(true);
	};

	const handleEditThread = async (data: { name: string }) => {
		if (!threadToEdit) return;

		try {
			const updateData: ThreadPutRequest = {
				name: data.name,
			};

			await updateThreadAPI(groupId, channelId, threadToEdit.id, updateData);

			dispatch(
				updateThreadAction({
					channelKey,
					threadId: threadToEdit.id,
					updates: updateData,
				}),
			);

			setShowEditModal(false);
			setThreadToEdit(null);
		} catch (error) {
			console.error("Failed to update thread:", error);
			throw error;
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

	const getThreadCreatorName = (thread: ThreadResponse): string => {
		if (!thread.createdBy) return "Unknown User";

		if (typeof thread.createdBy === "string") {
			const creator = threadCreators[thread.createdBy];
			if (creator) {
				if (creator.firstName && creator.lastName) {
					return `${creator.firstName} ${creator.lastName}`;
				}
				return creator.username || "Unknown User";
			}
			return "Unknown User";
		}

		const creator: any = thread.createdBy;
		if (creator.firstName && creator.lastName) {
			return `${creator.firstName} ${creator.lastName}`;
		}
		return creator.username || "Unknown User";
	};

	const getThreadCreatorAvatar = (thread: ThreadResponse): string | null => {
		if (!thread.createdBy) return null;

		if (typeof thread.createdBy === "string") {
			const creator = threadCreators[thread.createdBy];
			return creator?.avatarUrl || null;
		}

		const creator: any = thread.createdBy;
		return creator?.avatarUrl || null;
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
							{joinedThreads.map((thread) => {
								const creatorAvatar = getThreadCreatorAvatar(thread);
								const creatorName = getThreadCreatorName(thread);

								return (
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
															{creatorAvatar ? (
																<img
																	src={creatorAvatar}
																	alt={creatorName}
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
														<AuthorName>{creatorName}</AuthorName>
													</AuthorInfo>
													<span>•</span>
													<TimeStamp>
														{formatTimeAgo(thread.createdAt)}
													</TimeStamp>
												</ThreadMeta>
											</ThreadInfo>
											<div
												style={{
													display: "flex",
													gap: "8px",
												}}
											>
												<EditButton
													onClick={(e) => handleEditClick(e, thread)}
													title="Edit thread"
												>
													<Edit size={16} />
												</EditButton>
												<DeleteButton
													onClick={(e) => handleDeleteClick(e, thread.id)}
													title="Delete thread"
												>
													<Trash2 size={16} />
												</DeleteButton>
											</div>
										</ThreadItemHeader>
										{/* description removed in new DTO; UI section omitted */}
									</ThreadItem>
								);
							})}
						</ThreadsList>
					)}
				</ThreadsSection>
			</ThreadDropdown>

			<ThreadEditModal
				isOpen={showEditModal}
				threadId={threadToEdit?.id || ""}
				groupId={groupId}
				channelId={channelId}
				initialName={threadToEdit?.name || ""}
				initialDescription=""
				onClose={() => {
					setShowEditModal(false);
					setThreadToEdit(null);
				}}
				onSubmit={handleEditThread}
			/>

			<ConfirmModal
				isOpen={showDeleteModal}
				title="Delete Thread"
				message="Are you sure you want to delete this thread? This action cannot be undone."
				confirmText="Delete"
				cancelText="Cancel"
				onConfirm={handleConfirmDelete}
				onCancel={handleCancelDelete}
				isLoading={isDeleting}
			/>
		</>
	);
};

export default ThreadList;
