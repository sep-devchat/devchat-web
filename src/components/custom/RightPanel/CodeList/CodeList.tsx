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
import { MockPage } from "@/components/custom/MockPage";
import CodeCollab from "@/pages/CodeCollab";
import { Button } from "@/components/ui/button";

interface CodeListProps {
	onClose?: () => void;
	groupId?: string;
	channelId?: string;
	directUserId?: string;
}

const PAGE_SIZE = 20;
const REFRESH_INTERVAL_MS = 5000;

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

type CollaborateContext =
	| {
			mode: "channel";
			codeBlockId: string;
			title: string;
			subtitle?: string;
			language?: string;
			groupId: string;
			channelId: string;
	  }
	| {
			mode: "direct";
			codeBlockId: string;
			title: string;
			subtitle?: string;
			language?: string;
			directUserId: string;
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
	const [collabContext, setCollabContext] = useState<CollaborateContext | null>(
		null,
	);
	const isLoadingRef = useRef(false);
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

	useEffect(() => {
		setCollabContext(null);
	}, [groupId, channelId, directUserId, isChannelMode]);

	const handleRunCode = async (block: CodeBlock) => {
		if (runningBlockId) return;
		const code = block.content || "";
		setModalMeta({
			title: buildItemTitle(block),
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
		if (isChannelMode && groupId && channelId) {
			setCollabContext({
				mode: "channel",
				codeBlockId: block.id,
				title: buildItemTitle(block),
				subtitle: buildItemSubtitle(block),
				language: block.language,
				groupId,
				channelId,
			});
			return;
		}

		if (isDirectMode && directUserId) {
			setCollabContext({
				mode: "direct",
				codeBlockId: block.id,
				title: buildItemTitle(block),
				subtitle: buildItemSubtitle(block),
				language: block.language,
				directUserId,
			});
		}
	};

	const handleCloseCollaborate = () => {
		setCollabContext(null);
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
								title={buildItemTitle(block)}
								subtitle={buildItemSubtitle(block)}
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

			<MockPage
				visible={Boolean(collabContext)}
				title={collabContext?.title || "Code Collaboration"}
				description={collabContext?.subtitle}
				actions={
					<Button variant="outline" size="sm" onClick={handleCloseCollaborate}>
						Close
					</Button>
				}
				contentPadding={false}
				padded={false}
			>
				{collabContext ? (
					collabContext.mode === "channel" ? (
						<CodeCollab
							key={`${collabContext.codeBlockId}-channel`}
							codeBlockId={collabContext.codeBlockId}
							channelId={collabContext.channelId}
							groupId={collabContext.groupId}
						/>
					) : (
						<CodeCollab
							key={`${collabContext.codeBlockId}-direct`}
							codeBlockId={collabContext.codeBlockId}
							directUserId={collabContext.directUserId}
						/>
					)
				) : (
					<div className="flex items-center justify-center h-full">
						<div className="text-center">
							<p className="text-sm text-muted-foreground">
								Select a code block to collaborate on.
							</p>
						</div>
					</div>
				)}
			</MockPage>
		</PageWrapper>
	);
};

export default CodeList;
