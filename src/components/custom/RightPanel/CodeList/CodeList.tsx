import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import CodeRunResultDialog from "@/components/custom/CodeRunResultDialog";
import CodeItem from "./CodeItem";
import {
	CloseButton,
	CPContent,
	CPHeader,
	CPHeaderLeft,
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
import useCodeRunner from "@/hooks/useCodeRunner";
import { useNavigate } from "@tanstack/react-router";
import {
	buildCodeBlockSubtitleFromBlock,
	buildCodeBlockTitle,
} from "@/utils/codeCollabHelpers";

interface CodeListProps {
	onClose?: () => void;
	groupId?: string;
	channelId?: string;
	directUserId?: string;
}

const PAGE_SIZE = 20;
const REFRESH_INTERVAL_MS = 5000;

const CodeList = ({
	onClose,
	groupId,
	channelId,
	directUserId,
}: CodeListProps) => {
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
	const [isResultOpen, setIsResultOpen] = useState(false);
	const [runningBlockId, setRunningBlockId] = useState<string | null>(null);
	const isLoadingRef = useRef(false);
	const navigate = useNavigate();
	const {
		runOutput,
		runError,
		lastRunAt,
		runSnippet,
		reset: resetRunner,
	} = useCodeRunner();

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

	useEffect(() => {
		isLoadingRef.current = isLoading;
	}, [isLoading]);

	useEffect(() => {
		if (!canFetch) return;
		const intervalId = window.setInterval(() => {
			if (isLoadingRef.current) return;
			fetchCodeBlocks(1, true);
		}, REFRESH_INTERVAL_MS);
		return () => window.clearInterval(intervalId);
	}, [canFetch, fetchCodeBlocks]);

	const handleRunCode = async (block: CodeBlock) => {
		if (runningBlockId) return;
		const code = block.content || "";
		setModalMeta({
			title: buildCodeBlockTitle(block.language),
			language: block.language,
		});
		resetRunner();
		setIsResultOpen(false);
		setRunningBlockId(block.id);

		try {
			await runSnippet({ code, language: block.language });
		} finally {
			setRunningBlockId(null);
			setIsResultOpen(true);
		}
	};

	const handleResultDialogChange = (open: boolean) => {
		setIsResultOpen(open);
		if (!open) {
			resetRunner();
		}
	};

	const handleLoadMore = () => {
		if (!hasMore || isLoading) return;
		fetchCodeBlocks(currentPage + 1);
	};

	const handleCollaborate = (block: CodeBlock) => {
		if (!isChannelMode && !isDirectMode) return;

		const title = buildCodeBlockTitle(block.language);
		const subtitle = buildCodeBlockSubtitleFromBlock(block);

		if (isChannelMode && groupId && channelId) {
			navigate({
				to: "/chat/collab/$codeBlockId",
				params: { codeBlockId: block.id },
				search: {
					mode: "channel",
					groupId,
					channelId,
					title,
					subtitle,
				},
			});
			return;
		}

		if (isDirectMode && directUserId) {
			navigate({
				to: "/chat/collab/$codeBlockId",
				params: { codeBlockId: block.id },
				search: {
					mode: "direct",
					directUserId,
					title,
					subtitle,
				},
			});
		}
	};

	const handleRetry = () => {
		if (isLoading) return;
		setInitialLoaded(false);
		fetchCodeBlocks(1, true);
	};

	const shouldShowFooter =
		canFetch && (hasMore || isLoading || codeBlocks.length > 0);

	const canCollaborate = Boolean(
		(isChannelMode && groupId && channelId) || (isDirectMode && directUserId),
	);

	return (
		<PageWrapper>
			<CPHeader>
				<CPHeaderLeft>
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
								title={buildCodeBlockTitle(block.language)}
								subtitle={buildCodeBlockSubtitleFromBlock(block)}
								language={block.language}
								code={block.content}
								onRun={() => handleRunCode(block)}
								isRunning={runningBlockId === block.id}
								disabled={Boolean(runningBlockId)}
								onCollaborate={
									canCollaborate ? () => handleCollaborate(block) : undefined
								}
								collaborateDisabled={Boolean(runningBlockId)}
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

			<CodeRunResultDialog
				open={isResultOpen}
				onOpenChange={handleResultDialogChange}
				language={modalMeta?.language}
				lastRunAt={lastRunAt}
				output={runOutput}
				error={runError}
				title={modalMeta?.title}
			/>
		</PageWrapper>
	);
};

export default CodeList;
