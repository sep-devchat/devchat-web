import React from "react";
import { Play, Code2, RotateCcw } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import * as S from "./CodeEditor.styled";

interface CodeEditorProps {
	code: string;
	onChange?: (value: string) => void;
	readOnly?: boolean;
	title: string;
	showSave?: boolean;
	onSave?: () => void;
	hasChanges?: boolean;
	isSaving?: boolean;
	onReset?: () => void;
	userRevisionCount?: number;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
	code,
	onChange,
	readOnly = false,
	title,
	showSave = false,
	onSave,
	hasChanges = false,
	isSaving = false,
	onReset,
	userRevisionCount,
}) => {
	return (
		<S.Container>
			<S.Header>
				<S.HeaderLeft>
					<S.CodeIcon>
						<Code2 style={{ width: "100%", height: "100%" }} />
					</S.CodeIcon>
					<S.Title>{title}</S.Title>

					{userRevisionCount !== undefined && userRevisionCount > 0 && (
						<S.RevisionCountBadge>
							You have saved {userRevisionCount} revision
							{userRevisionCount !== 1 ? "s" : ""} before.
						</S.RevisionCountBadge>
					)}

					{showSave && hasChanges && !isSaving && (
						<S.UnsavedBadge>Unsaved changes</S.UnsavedBadge>
					)}
					{isSaving && (
						<S.SavingBadge>
							<Spinner className="h-3 w-3 mr-1" />
							Saving...
						</S.SavingBadge>
					)}
				</S.HeaderLeft>

				<S.HeaderRight>
					{showSave && onReset && (
						<S.ResetButton
							onClick={onReset}
							disabled={!hasChanges || isSaving}
							title="Reset to original code"
						>
							<RotateCcw style={{ width: "1rem", height: "1rem" }} />
							Reset
						</S.ResetButton>
					)}

					{showSave && (
						<S.SaveButton
							onClick={onSave}
							disabled={!hasChanges || isSaving}
							$disabled={!hasChanges || isSaving}
						>
							{isSaving ? (
								<>
									<Spinner className="h-4 w-4 mr-2" />
									Saving...
								</>
							) : (
								"Save"
							)}
						</S.SaveButton>
					)}

					<S.RunButton>
						<S.PlayIcon>
							<Play style={{ width: "100%", height: "100%" }} />
						</S.PlayIcon>
						Run Code
					</S.RunButton>
				</S.HeaderRight>
			</S.Header>

			<S.CodeTextarea
				value={code}
				onChange={(e) => onChange?.(e.target.value)}
				readOnly={readOnly}
				$readOnly={readOnly}
				spellCheck={false}
			/>
		</S.Container>
	);
};
