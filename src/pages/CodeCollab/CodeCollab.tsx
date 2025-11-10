import { useState } from "react";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { X } from "lucide-react";
import { Change } from "./types";
import { SimplifiedChatArea } from "./SimplifiedChatArea/SimplifiedChatArea";
import { CodeEditor } from "./CodeEditor/CodeEditor";
import { ChangeHistory } from "./ChangeHistory/ChangeHistory";
import { DiffViewer } from "./DiffViewer/DiffViewer";
import * as S from "./CodeCollab.styled";

const ORIGINAL_CODE = `import java.util.Scanner;

public class SimpleSum {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        System.out.print("Enter the first number: ");
        double a = sc.nextDouble();
        
        System.out.print("Enter the second number: ");
        double b = sc.nextDouble();
        
        double sum = a + b;
        System.out.println("The sum of " + a + " and " + b + " = " + sum);
        
        sc.close();
    }
}`;

const MOCK_CHANGES: Change[] = [
	{
		id: "1",
		userName: "Như Nguyễn Trần Nguyễn",
		timestamp: new Date(Date.now() - 5 * 60 * 1000),
		code: `import java.util.Scanner;

public class SimpleSum {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        System.out.print("Enter first number: ");
        double num1 = sc.nextDouble();
        
        System.out.print("Enter second number: ");
        double num2 = sc.nextDouble();
        
        double result = num1 + num2;
        System.out.println("Sum: " + result);
        
        sc.close();
    }
}`,
	},
	{
		id: "2",
		userName: "John Doe",
		timestamp: new Date(Date.now() - 15 * 60 * 1000),
		code: `import java.util.Scanner;

public class SimpleSum {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        System.out.print("Enter the first number: ");
        double a = scanner.nextDouble();
        
        System.out.print("Enter the second number: ");
        double b = scanner.nextDouble();
        
        double sum = a + b;
        System.out.println("Result: " + a + " + " + b + " = " + sum);
        
        scanner.close();
    }
}`,
	},
];

export default function CodeCollab() {
	const [editableCode, setEditableCode] = useState(ORIGINAL_CODE);
	const [lastSavedCode, setLastSavedCode] = useState(ORIGINAL_CODE);
	const [selectedDiff, setSelectedDiff] = useState<Change | null>(null);
	const [changes, setChanges] = useState<Change[]>(MOCK_CHANGES);
	const [showLoadConfirm, setShowLoadConfirm] = useState(false);
	const [pendingLoadCode, setPendingLoadCode] = useState<string | null>(null);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

	const hasChanges = editableCode !== lastSavedCode;

	const currentUserName = "Bob Smith"; // Current logged-in user

	const handleSave = () => {
		if (!hasChanges) return;

		const newChange: Change = {
			id: `change-${Date.now()}`,
			userName: currentUserName,
			timestamp: new Date(),
			code: editableCode,
		};

		setChanges((prev) => [newChange, ...prev]);
		setLastSavedCode(editableCode);
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

	const saveAndLoadVersion = () => {
		if (pendingLoadCode) {
			// Save current changes first
			const newChange: Change = {
				id: `change-${Date.now()}`,
				userName: "Bob Smith",
				timestamp: new Date(),
				code: editableCode,
			};
			setChanges((prev) => [newChange, ...prev]);

			// Then load the pending version
			setEditableCode(pendingLoadCode);
			setLastSavedCode(pendingLoadCode);
			setPendingLoadCode(null);
			setShowLoadConfirm(false);
			setSelectedDiff(null);
		}
	};

	const discardAndLoadVersion = () => {
		if (pendingLoadCode) {
			setEditableCode(pendingLoadCode);
			setLastSavedCode(pendingLoadCode);
			setPendingLoadCode(null);
			setShowLoadConfirm(false);
			setSelectedDiff(null);
		}
	};

	const cancelLoadVersion = () => {
		setPendingLoadCode(null);
		setShowLoadConfirm(false);
	};

	return (
		<S.Container>
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
				<ResizablePanel defaultSize={28} minSize={16} maxSize={35}>
					<S.ChatPanel>
						<S.ChatHeader>
							<S.ChannelName>#channelname</S.ChannelName>
						</S.ChatHeader>

						<S.ChatContent>
							<SimplifiedChatArea />
						</S.ChatContent>
					</S.ChatPanel>
				</ResizablePanel>

				<ResizableHandle />

				<ResizablePanel defaultSize={50} minSize={35}>
					<ResizablePanelGroup direction="vertical">
						<ResizablePanel defaultSize={50} minSize={30}>
							<S.CodeEditorWrapper>
								<CodeEditor
									code={ORIGINAL_CODE}
									readOnly={true}
									title="Original Code (Read-only)"
								/>
							</S.CodeEditorWrapper>
						</ResizablePanel>

						<ResizableHandle />

						<ResizablePanel defaultSize={50} minSize={30}>
							<S.CodeEditorWrapperBottom>
								<CodeEditor
									code={editableCode}
									onChange={setEditableCode}
									title="Your Edits"
									showSave={true}
									onSave={handleSave}
									hasChanges={hasChanges}
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
							setPendingDeleteId(changeId);
							setShowDeleteConfirm(true);
						}}
						currentUserName={currentUserName}
					/>
				</ResizablePanel>
			</ResizablePanelGroup>

			{selectedDiff && selectedDiff.code && (
				<DiffViewer
					original={ORIGINAL_CODE}
					modified={selectedDiff.code}
					userName={selectedDiff.userName}
					onClose={() => setSelectedDiff(null)}
					onLoadVersion={() => handleLoadVersion(selectedDiff.code)}
				/>
			)}
			{showDeleteConfirm && (
				<S.ModalOverlay>
					<S.ModalBackdrop onClick={() => setShowDeleteConfirm(false)} />
					<S.ModalContent>
						<S.ModalTitle>Confirm Delete</S.ModalTitle>
						<S.ModalDescription>
							Are you sure you want to delete this revision?
						</S.ModalDescription>
						<S.ModalActions>
							<S.CancelButton
								onClick={() => {
									setShowDeleteConfirm(false);
									setPendingDeleteId(null);
								}}
							>
								Cancel
							</S.CancelButton>
							<S.DiscardButton
								onClick={() => {
									if (pendingDeleteId) {
										setChanges((prev) =>
											prev.filter((change) => change.id !== pendingDeleteId),
										);
										setPendingDeleteId(null);
									}
									setShowDeleteConfirm(false);
								}}
							>
								Delete
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
		</S.Container>
	);
}
