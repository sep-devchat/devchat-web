import { useCallback, useEffect, useMemo, useState } from "react";
import { SquareCode, X } from "lucide-react";
import CodeItem from "./CodeItem";
import {
	CloseButton,
	CPContent,
	CPHeader,
	CPHeaderIcon,
	CPHeaderLeft,
	CPModalContent,
	CPModalOverlay,
	CPTitle,
	EmptyMessage,
	ErrorText,
	Footer,
	FooterButton,
	PageWrapper,
	StatusText,
} from "./CodeList.styled";
import {
	CodeBlock,
	listChannelCodeBlocks,
	listDirectCodeBlocks,
} from "@/services/codeCollabAPI";

interface CodeListProps {
	onClose?: () => void;
	groupId?: string;
	channelId?: string;
	directUserId?: string;
}

interface RunCodeModalProps {
	code: string;
	title?: string;
	language?: string;
	onClose: () => void;
}

const PAGE_SIZE = 20;

const getDisplayName = (user?: CodeBlock["user"]) => {
	if (!user) return "Unknown author";
	const fullName = [user.firstName, user.lastName]
		.filter((part) => !!part && part.trim().length > 0)
		.join(" ")
		.trim();
	return fullName || user.username || "Unknown author";
};

const buildItemTitle = (block: CodeBlock) =>
	block.language ? `${block.language} snippet` : "Code snippet";

const buildItemSubtitle = (block: CodeBlock) => {
	const owner = getDisplayName(block.user);
	const timestamp = block.createdAt
		? new Date(block.createdAt).toLocaleString()
		: "";
	return [owner, timestamp].filter(Boolean).join(" • ");
};

const RunCodeModal = ({
	code,
	title,
	language,
	onClose,
}: RunCodeModalProps) => {
	const stop = (e: React.MouseEvent) => e.stopPropagation();
	return (
		<CPModalOverlay onClick={onClose}>
			<CPModalContent onClick={stop}>
				<h3>{title || "Snippet preview"}</h3>
				{language && <p>Language: {language}</p>}
				<pre>{code}</pre>
				<button onClick={onClose} style={{ marginTop: 16 }}>
					Close
				</button>
			</CPModalContent>
		</CPModalOverlay>
	);
};

const CodeList = ({
	onClose,
	groupId,
	channelId,
	directUserId,
}: CodeListProps) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [runningCode, setRunningCode] = useState("");
	const [modalMeta, setModalMeta] = useState<{
		title?: string;
		language?: string;
	} | null>(null);
	const [codeBlocks, setCodeBlocks] = useState<CodeBlock[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [hasMore, setHasMore] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [initialLoaded, setInitialLoaded] = useState(false);

	const isChannelMode = Boolean(groupId && channelId);
	const isDirectMode = Boolean(directUserId) && !isChannelMode;
	const canFetch = isChannelMode || isDirectMode;

	const headerTitle = useMemo(() => {
		if (isChannelMode) return "Channel code blocks";
		if (isDirectMode) return "Direct code blocks";
		return "Code blocks";
	}, [isChannelMode, isDirectMode]);

	const fetchCodeBlocks = useCallback(
		async (pageToLoad: number, replace = false) => {
			if (!canFetch) return;
			setIsLoading(true);
			setError(null);
			try {
				const response =
					isDirectMode && directUserId
						? await listDirectCodeBlocks({
								page: pageToLoad,
								limit: PAGE_SIZE,
								targetUserId: directUserId,
							})
						: await listChannelCodeBlocks({
								page: pageToLoad,
								limit: PAGE_SIZE,
								groupId: groupId!,
								channelId: channelId!,
							});

				const payload = Array.isArray(response?.data) ? response.data : [];
				setCodeBlocks((prev) => (replace ? payload : [...prev, ...payload]));

				const pagination = response?.pagination;
				const totalPage = pagination?.totalPage ?? 0;
				const totalRecord = pagination?.totalRecord ?? 0;
				const take = pagination?.take ?? PAGE_SIZE;
				const derivedTotalPage =
					totalPage || (totalRecord ? Math.ceil(totalRecord / take) : 0);
				const reachedEnd = derivedTotalPage
					? pageToLoad >= derivedTotalPage
					: payload.length < PAGE_SIZE;
				setHasMore(!reachedEnd);
				setCurrentPage(pageToLoad);
			} catch (err) {
				console.error("Failed to fetch code blocks", err);
				setError("Unable to load code blocks. Please try again.");
			} finally {
				setIsLoading(false);
				setInitialLoaded(true);
			}
		},
		[canFetch, isChannelMode, isDirectMode, directUserId, groupId, channelId],
	);

	useEffect(() => {
		setCodeBlocks([]);
		setHasMore(false);
		setError(null);
		setInitialLoaded(false);
		setCurrentPage(1);
		if (canFetch) {
			fetchCodeBlocks(1, true);
		}
	}, [canFetch, fetchCodeBlocks]);

	const handleRunCode = (block: CodeBlock) => {
		setRunningCode(block.content || "");
		setModalMeta({
			title: buildItemTitle(block),
			language: block.language,
		});
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setRunningCode("");
		setModalMeta(null);
	};

	const handleLoadMore = () => {
		if (!hasMore || isLoading) return;
		fetchCodeBlocks(currentPage + 1);
	};

	const handleRetry = () => {
		if (isLoading) return;
		setInitialLoaded(false);
		fetchCodeBlocks(1, true);
	};

	const shouldShowFooter =
		canFetch && (hasMore || isLoading || codeBlocks.length > 0);

	return (
		<PageWrapper>
			<CPHeader>
				<CPHeaderLeft>
					<CPHeaderIcon>
						<SquareCode />
					</CPHeaderIcon>
					<CPTitle>{headerTitle}</CPTitle>
				</CPHeaderLeft>

				{onClose && (
					<CloseButton onClick={onClose}>
						<X size={20} />
					</CloseButton>
				)}
			</CPHeader>

			<CPContent>
				{canFetch ? (
					<>
						{codeBlocks.map((block) => (
							<CodeItem
								key={block.id}
								title={buildItemTitle(block)}
								subtitle={buildItemSubtitle(block)}
								language={block.language}
								code={block.content}
								onRun={() => handleRunCode(block)}
							/>
						))}

						{initialLoaded && !isLoading && !codeBlocks.length && !error && (
							<EmptyMessage>
								No code blocks yet. Share your first snippet from the chat
								composer.
							</EmptyMessage>
						)}

						{error && (
							<>
								<ErrorText role="alert">{error}</ErrorText>
								<FooterButton onClick={handleRetry} disabled={isLoading}>
									Try again
								</FooterButton>
							</>
						)}

						{shouldShowFooter && (
							<Footer>
								{hasMore && !error && (
									<FooterButton onClick={handleLoadMore} disabled={isLoading}>
										{isLoading ? "Loading..." : "Load more"}
									</FooterButton>
								)}
								{isLoading && <StatusText>Loading...</StatusText>}
								{!hasMore && codeBlocks.length > 0 && !isLoading && (
									<StatusText>You have reached the beginning</StatusText>
								)}
							</Footer>
						)}
					</>
				) : (
					<EmptyMessage>
						Select a channel or direct conversation to view shared code blocks.
					</EmptyMessage>
				)}
			</CPContent>

			{isModalOpen && (
				<RunCodeModal
					code={runningCode}
					title={modalMeta?.title}
					language={modalMeta?.language}
					onClose={handleCloseModal}
				/>
			)}
		</PageWrapper>
	);
};

export default CodeList;
