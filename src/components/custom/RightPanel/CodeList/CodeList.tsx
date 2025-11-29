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
	CodeListScroller,
} from "./CodeList.styled";
import { Code, X } from "lucide-react";
import { codeData } from "./codeData";
import CodeItem from "./CodeItem";

interface RunCodeModalProps {
	code: string;
	onClose: () => void;
}
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
import Empty from "../../Empty";
import ineffaLoading from "@/assets/emoji/ineffa_loading.png";

interface CodeListProps {
	onClose?: () => void;
	groupId?: string;
	channelId?: string;
	directUserId?: string;
}

const PAGE_SIZE = 20;
const REFRESH_INTERVAL_MS = 5000;

const areBlocksEqual = (a: CodeBlock, b: CodeBlock) => {
	return (
		a.id === b.id &&
		a.updatedAt === b.updatedAt &&
		a.content === b.content &&
		a.language === b.language &&
		a.userId === b.userId
	);
};

const mergeCodeBlocks = (
	previous: CodeBlock[],
	incoming: CodeBlock[],
): CodeBlock[] => {
	if (!previous.length) return incoming;
	let changed = previous.length !== incoming.length;
	const previousById = new Map(previous.map((block) => [block.id, block]));
	const merged = incoming.map((block) => {
		const existing = previousById.get(block.id);
		if (existing && areBlocksEqual(existing, block)) {
			return existing;
		}
		changed = true;
		return block;
	});
	return changed ? merged : previous;
};

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
	const backgroundRefreshRef = useRef(false);
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

	type FetchOptions = {
		replace?: boolean;
		silent?: boolean;
	};

	const fetchCodeBlocks = useCallback(
		async (pageToLoad: number, options: FetchOptions = {}) => {
			const { replace = false, silent = false } = options;
			if (!canFetch) return;
			if (silent) {
				backgroundRefreshRef.current = true;
			} else {
				setIsLoading(true);
			}
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
				setCodeBlocks((prev) => {
					if (replace || pageToLoad === 1) {
						return mergeCodeBlocks(prev, payload);
					}
					return [...prev, ...payload];
				});

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
				if (silent) {
					backgroundRefreshRef.current = false;
				} else {
					setIsLoading(false);
					setInitialLoaded(true);
				}
			}
		},
		[canFetch, isDirectMode, directUserId, groupId, channelId],
	);

	useEffect(() => {
		setCodeBlocks([]);
		setHasMore(false);
		setError(null);
		setInitialLoaded(false);
		setCurrentPage(1);
		if (canFetch) {
			fetchCodeBlocks(1, { replace: true });
		}
	}, [canFetch, fetchCodeBlocks]);

	useEffect(() => {
		isLoadingRef.current = isLoading;
	}, [isLoading]);

	useEffect(() => {
		if (!canFetch) return;
		const intervalId = window.setInterval(() => {
			if (isLoadingRef.current || backgroundRefreshRef.current) return;
			fetchCodeBlocks(1, { replace: true, silent: true });
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
		fetchCodeBlocks(1, { replace: true });
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
					<CPHeaderIcon>
						<Code size={20} />
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
						<CodeListScroller>
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
								<Empty
									image={
										<img
											src={ineffaLoading}
											alt="No code blocks"
											className="h-50 w-50 object-cover"
										/>
									}
									icon={null}
									heading="No code blocks found"
									description="There are no code blocks shared in this conversation yet."
								/>
							)}

							{error && (
								<>
									<ErrorText role="alert">{error}</ErrorText>
									<FooterButton onClick={handleRetry} disabled={isLoading}>
										Try again
									</FooterButton>
								</>
							)}
						</CodeListScroller>

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
