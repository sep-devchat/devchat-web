import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { RefreshCcw, X } from "lucide-react";
import { Change } from "./types";
import { CodeEditor } from "./CodeEditor/CodeEditor";
import { ChangeHistory } from "./ChangeHistory/ChangeHistory";
import { DiffViewer } from "./DiffViewer/DiffViewer";
import * as S from "./CodeCollab.styled";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import {
	getCodeBlockById,
	getDirectCodeBlockById,
	getCodeCollaborationHistory,
	saveCodeCollaboration,
	deleteCodeCollaboration,
	updateCodeCollaboration,
} from "@/services/codeCollabAPI";
import { toast } from "sonner";
const normalizeLanguage = (lang?: string): string => {
	if (!lang) return "java";
	const normalized = lang.toLowerCase();
	if (["js", "javascript", "node"].includes(normalized)) return "javascript";
	if (["py", "python"].includes(normalized)) return "python";
	if (["java"].includes(normalized)) return "java";
	return normalized;
};

interface CodeCollabProps {
	codeBlockId: string;
	channelId?: string;
	groupId?: string;
	directUserId?: string;
}

export default function CodeCollab({
	codeBlockId,
	channelId,
	groupId,
	directUserId,
}: CodeCollabProps) {
	const currentUserProfile = useSelector(
		(state: RootState) => state.user.profile,
	);
	const currentUserId = currentUserProfile?.id || "";

	const [originalCode, setOriginalCode] = useState("");
	const [editableCode, setEditableCode] = useState("");
	const [lastSavedCode, setLastSavedCode] = useState("");
	const [selectedDiff, setSelectedDiff] = useState<Change | null>(null);
	const [changes, setChanges] = useState<Change[]>([]);
	const [showLoadConfirm, setShowLoadConfirm] = useState(false);
	const [pendingLoadCode, setPendingLoadCode] = useState<string | null>(null);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isSaving, setIsSaving] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [editingRevisionId, setEditingRevisionId] = useState<string | null>(
		null,
	);
	const [pendingEditId, setPendingEditId] = useState<string | null>(null);
	const [showResetConfirm, setShowResetConfirm] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false);

	const [codeLanguage, setCodeLanguage] = useState<string>("java");

	const handleResetConfirm = () => {
		if (hasChanges) {
			setShowResetConfirm(true);
		} else {
			performReset();
		}
	};

	const performReset = () => {
		const resetTarget = lastSavedCode ?? originalCode;
		setEditableCode(resetTarget);
		setSelectedDiff(null);
		setShowResetConfirm(false);
		toast.info("Code reverted to last saved version");
	};

	const hasChanges = editableCode !== lastSavedCode;

	const currentUserName = currentUserProfile
		? `${currentUserProfile.firstName} ${currentUserProfile.lastName}`
		: "Unknown User";

	const isChannelContext = Boolean(channelId && groupId);
	const isDirectContext = Boolean(directUserId);

	const fetchCollaboration = useCallback(
		async (options?: { silent?: boolean; updateEditor?: boolean }) => {
			const silent = options?.silent ?? false;
			const shouldUpdateEditor = options?.updateEditor ?? true;
			if (!codeBlockId || (!isChannelContext && !isDirectContext)) {
				setError("Missing required params");
				return;
			}

			try {
				if (silent) {
					setIsRefreshing(true);
				} else {
					setIsLoading(true);
				}
				setError(null);

				const codeBlockResponse =
					isDirectContext && directUserId
						? await getDirectCodeBlockById(directUserId, codeBlockId)
						: await getCodeBlockById(codeBlockId, channelId!, groupId!);

				if (!codeBlockResponse?.data) {
					throw new Error("Failed to load code block");
				}

				const originalContent = codeBlockResponse.data.content ?? "";
				const language = codeBlockResponse.data.language || "java";
				const normalizedLanguage = normalizeLanguage(language);
				setCodeLanguage(normalizedLanguage);
				setOriginalCode(originalContent);

				const historyResponse = await getCodeCollaborationHistory(codeBlockId);

				let historyChanges: Change[] = [];
				if (historyResponse?.data && Array.isArray(historyResponse.data)) {
					historyChanges = historyResponse.data
						.map((item) => ({
							id: item.id,
							userName: `${item.createdBy.firstName} ${item.createdBy.lastName}`,
							avatarUrl: item.createdBy.avatarUrl,
							userId: item.createdBy.id,
							timestamp: new Date(item.createdAt),
							code: item.content,
						}))
						.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
				}
				setChanges(historyChanges);

				const latestOwnRevision = historyChanges.find(
					(change) => change.userId === currentUserId,
				);
				if (shouldUpdateEditor) {
					if (latestOwnRevision) {
						setEditableCode(latestOwnRevision.code);
						setLastSavedCode(latestOwnRevision.code);
						setEditingRevisionId(latestOwnRevision.id);
						setSelectedDiff(null);
						if (!silent) {
							toast.info("Resuming your last collaboration revision");
						}
					} else {
						setEditableCode(originalContent);
						setLastSavedCode(originalContent);
						setEditingRevisionId(null);
						setSelectedDiff(null);
					}
				}
			} catch (err: any) {
				console.error("💥 Fetch error:", err);
				setError(err?.message || "Failed to load data");
			} finally {
				if (silent) {
					setIsRefreshing(false);
				} else {
					setIsLoading(false);
				}
			}
		},
		[
			channelId,
			codeBlockId,
			currentUserId,
			directUserId,
			groupId,
			isChannelContext,
			isDirectContext,
		],
	);

	useEffect(() => {
		if (codeBlockId && (isChannelContext || isDirectContext)) {
			fetchCollaboration();
		}
	}, [codeBlockId, fetchCollaboration, isChannelContext, isDirectContext]);

	useEffect(() => {
		if (!codeBlockId || (!isChannelContext && !isDirectContext)) {
			return;
		}
		const intervalId = window.setInterval(() => {
			fetchCollaboration({ silent: true, updateEditor: false });
		}, 5000);
		return () => {
			window.clearInterval(intervalId);
		};
	}, [codeBlockId, fetchCollaboration, isChannelContext, isDirectContext]);

	const handleRefresh = () => {
		if (isLoading || isRefreshing) return;
		fetchCollaboration({ silent: true });
	};

	const handleEditRevision = (changeId: string) => {
		const change = changes.find((c) => c.id === changeId);
		if (!change) return;

		if (change.userId !== currentUserId) {
			toast.error("You can only edit your own revisions");
			return;
		}

		if (hasChanges) {
			setPendingEditId(changeId);
			setShowLoadConfirm(true);
			return;
		}

		loadRevisionForEdit(changeId);
	};

	const loadRevisionForEdit = (changeId: string) => {
		const change = changes.find((c) => c.id === changeId);
		if (!change) return;

		setEditableCode(change.code);
		setLastSavedCode(change.code);
		setEditingRevisionId(changeId);
		setSelectedDiff(null);

		toast.info("Editing revision - changes will update this version");
	};

	const handleSave = async () => {
		if (!hasChanges || isSaving) return;

		try {
			setIsSaving(true);

			if (editingRevisionId) {
				const response = await updateCodeCollaboration(
					editingRevisionId,
					editableCode,
				);

				console.log("✏️ Update response:", response);

				setChanges((prev) =>
					prev.map((change) =>
						change.id === editingRevisionId
							? {
									...change,
									code: editableCode,
									timestamp: new Date(),
								}
							: change,
					),
				);

				setLastSavedCode(editableCode);

				toast.success("Revision updated successfully");
			} else {
				const response = await saveCodeCollaboration(codeBlockId, editableCode);

				const newChange: Change = {
					id: response?.data?.id || `change-${Date.now()}`,
					userName: currentUserName,
					userId: currentUserId,
					avatarUrl: currentUserProfile?.avatarUrl,
					timestamp: new Date(),
					code: editableCode,
				};

				setChanges((prev) => [newChange, ...prev]);
				setLastSavedCode(editableCode);
				setEditingRevisionId(newChange.id);

				toast.success("Changes saved successfully");
			}

			setSelectedDiff(null);

			try {
				const historyResponse = await getCodeCollaborationHistory(codeBlockId);
				if (historyResponse?.data && Array.isArray(historyResponse.data)) {
					const historyChanges: Change[] = historyResponse.data
						.map((item) => ({
							id: item.id,
							userName: `${item.createdBy.firstName} ${item.createdBy.lastName}`,
							userId: item.createdBy.id,
							avatarUrl: item.createdBy.avatarUrl,
							timestamp: new Date(item.createdAt),
							code: item.content,
						}))
						.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
					setChanges(historyChanges);
				}
			} catch (refreshErr) {
				console.warn("Failed to refresh history:", refreshErr);
			}
		} catch (err: any) {
			console.error("💥 Save failed:", err);
			toast.error(err?.message || "Failed to save changes");
		} finally {
			setIsSaving(false);
		}
	};

	const handleDeleteRevision = async () => {
		if (!pendingDeleteId) return;

		try {
			setIsDeleting(true);

			await deleteCodeCollaboration(pendingDeleteId);

			setChanges((prev) => prev.filter((c) => c.id !== pendingDeleteId));

			if (editingRevisionId === pendingDeleteId) {
				setEditingRevisionId(null);
				setLastSavedCode(originalCode);
			}

			if (selectedDiff && selectedDiff.id === pendingDeleteId) {
				setSelectedDiff(null);
			}

			toast.success("Revision deleted successfully");
		} catch (err: any) {
			console.error("💥 Delete failed:", err);
			toast.error(err?.message || "Failed to delete revision");
		} finally {
			setIsDeleting(false);
			setShowDeleteConfirm(false);
			setPendingDeleteId(null);
		}
	};

	const handleLoadVersion = (code: string) => {
		if (hasChanges) {
			setPendingLoadCode(code);
			setShowLoadConfirm(true);
		} else {
			setEditableCode(code);
			setLastSavedCode(code);
			setSelectedDiff(null);
		}
	};

	const saveAndLoadVersion = async () => {
		await handleSave();

		if (pendingEditId) {
			loadRevisionForEdit(pendingEditId);
			setPendingEditId(null);
		} else if (pendingLoadCode) {
			setEditableCode(pendingLoadCode);
			setLastSavedCode(pendingLoadCode);
			setPendingLoadCode(null);
		}

		setShowLoadConfirm(false);
		setSelectedDiff(null);
	};

	const discardAndLoadVersion = () => {
		if (pendingEditId) {
			loadRevisionForEdit(pendingEditId);
			setPendingEditId(null);
		} else if (pendingLoadCode) {
			setEditableCode(pendingLoadCode);
			setLastSavedCode(pendingLoadCode);
			setPendingLoadCode(null);
		}

		setShowLoadConfirm(false);
		setSelectedDiff(null);
	};

	const cancelLoadVersion = () => {
		setPendingLoadCode(null);
		setPendingEditId(null);
		setShowLoadConfirm(false);
	};

	const userRevisionCount = changes.filter(
		(change) => change.userId === currentUserId,
	).length;

	if (isLoading) {
		return (
			<S.Container>
				<div className="flex items-center justify-center h-full">
					<div className="flex flex-col items-center gap-3">
						<Spinner className="h-8 w-8" />
						<p className="text-sm text-muted-foreground">
							Loading code block...
						</p>
						<p className="text-xs text-muted-foreground">ID: {codeBlockId}</p>
					</div>
				</div>
			</S.Container>
		);
	}

	if (error) {
		return (
			<S.Container>
				<div className="flex items-center justify-center h-full">
					<div className="text-center">
						<p className="text-destructive text-sm font-medium">{error}</p>
						<p className="text-muted-foreground text-xs mt-2">
							Code Block ID: {codeBlockId}
						</p>
						{isChannelContext && (
							<>
								<p className="text-muted-foreground text-xs">
									Channel: {channelId}
								</p>
								<p className="text-muted-foreground text-xs">
									Group: {groupId}
								</p>
							</>
						)}
						{isDirectContext && (
							<p className="text-muted-foreground text-xs">
								Direct user: {directUserId}
							</p>
						)}
					</div>
				</div>
			</S.Container>
		);
	}

	return (
		<S.Container>
			<S.Toolbar>
				<S.ToolbarHint>
					Refresh whenever you need the latest collaborators' revisions.
				</S.ToolbarHint>
				<Button
					variant="outline"
					size="sm"
					onClick={handleRefresh}
					disabled={isLoading || isRefreshing}
				>
					{isRefreshing ? (
						<span className="flex items-center gap-2">
							<Spinner className="h-4 w-4" />
							Refreshing...
						</span>
					) : (
						<span className="flex items-center gap-2">
							<RefreshCcw className="h-4 w-4" />
							Refresh
						</span>
					)}
				</Button>
			</S.Toolbar>
			<S.PanelArea>
				<ResizablePanelGroup
					direction="horizontal"
					className="h-full"
					style={{
						border: "1px solid rgba(209, 224, 253, 0.6)",
						background: "#ffffff",
						borderRadius: "12px",
						overflow: "hidden",
						boxShadow: "0 4px 12px rgba(123, 159, 232, 0.12)",
					}}
				>
					<ResizableHandle />

					<ResizablePanel defaultSize={50} minSize={35}>
						<ResizablePanelGroup direction="vertical">
							<ResizablePanel defaultSize={50} minSize={30}>
								<S.CodeEditorWrapper>
									<CodeEditor
										code={originalCode}
										readOnly={true}
										title="Original Code (Read-only)"
										language={codeLanguage}
									/>
								</S.CodeEditorWrapper>
							</ResizablePanel>

							<ResizableHandle />

							<ResizablePanel defaultSize={50} minSize={30}>
								<S.CodeEditorWrapperBottom>
									<CodeEditor
										code={editableCode}
										onChange={setEditableCode}
										title={
											editingRevisionId ? "Editing Revision" : "Your Edits"
										}
										showSave={true}
										onSave={handleSave}
										hasChanges={hasChanges}
										isSaving={isSaving}
										onReset={handleResetConfirm}
										userRevisionCount={userRevisionCount}
										language={codeLanguage}
									/>
								</S.CodeEditorWrapperBottom>
							</ResizablePanel>
						</ResizablePanelGroup>
					</ResizablePanel>

					<ResizableHandle />

					<ResizablePanel defaultSize={22} minSize={16} maxSize={35}>
						<ChangeHistory
							changes={changes}
							onChangeClick={setSelectedDiff}
							onDeleteChange={(changeId) => {
								const change = changes.find((c) => c.id === changeId);
								if (change && change.userId === currentUserId) {
									setPendingDeleteId(changeId);
									setShowDeleteConfirm(true);
								} else {
									toast.error("You can only delete your own revisions");
								}
							}}
							onEditChange={handleEditRevision}
							currentUserId={currentUserId}
						/>
					</ResizablePanel>
				</ResizablePanelGroup>
			</S.PanelArea>

			{selectedDiff && selectedDiff.code && (
				<DiffViewer
					original={originalCode}
					modified={selectedDiff.code}
					userName={selectedDiff.userName}
					onClose={() => setSelectedDiff(null)}
					onLoadVersion={() => handleLoadVersion(selectedDiff.code)}
					language={codeLanguage}
				/>
			)}

			{showDeleteConfirm && (
				<S.ModalOverlay>
					<S.ModalBackdrop onClick={() => setShowDeleteConfirm(false)} />
					<S.ModalContent>
						<S.ModalTitle>Confirm Delete</S.ModalTitle>
						<S.ModalDescription>
							Are you sure you want to delete this revision? This action cannot
							be undone.
						</S.ModalDescription>
						<S.ModalActions>
							<S.CancelButton
								onClick={() => {
									setShowDeleteConfirm(false);
									setPendingDeleteId(null);
								}}
								disabled={isDeleting}
							>
								Cancel
							</S.CancelButton>
							<S.DiscardButton
								onClick={() => {
									if (pendingDeleteId) {
										handleDeleteRevision();
									}
								}}
								disabled={isDeleting}
							>
								{isDeleting ? "Deleting..." : "Delete"}
							</S.DiscardButton>
						</S.ModalActions>
					</S.ModalContent>
				</S.ModalOverlay>
			)}

			{showLoadConfirm && (
				<S.ModalOverlay>
					<S.ModalBackdrop onClick={cancelLoadVersion} />
					<S.ModalContent>
						<S.CloseButton
							onClick={cancelLoadVersion}
							style={{ position: "absolute", top: "1rem", right: "1rem" }}
						>
							<X style={{ width: "1.25rem", height: "1.25rem" }} />
						</S.CloseButton>
						<S.ModalTitle>Unsaved Changes</S.ModalTitle>
						<S.ModalDescription>
							You have unsaved changes. What would you like to do?
						</S.ModalDescription>
						<S.ModalActions>
							<S.CancelButton onClick={saveAndLoadVersion}>
								Save & Load
							</S.CancelButton>
							<S.DiscardButton onClick={discardAndLoadVersion}>
								Discard & Load
							</S.DiscardButton>
						</S.ModalActions>
					</S.ModalContent>
				</S.ModalOverlay>
			)}

			{showResetConfirm && (
				<S.ModalOverlay>
					<S.ModalBackdrop onClick={() => setShowResetConfirm(false)} />
					<S.ModalContent>
						<S.ModalTitle>Reset to Original Code</S.ModalTitle>
						<S.ModalDescription>
							Are you sure you want to discard all changes and reset to the
							original code? This action cannot be undone.
						</S.ModalDescription>
						<S.ModalActions>
							<S.CancelButton onClick={() => setShowResetConfirm(false)}>
								Cancel
							</S.CancelButton>
							<S.DiscardButton onClick={performReset}>Reset</S.DiscardButton>
						</S.ModalActions>
					</S.ModalContent>
				</S.ModalOverlay>
			)}
		</S.Container>
	);
}
