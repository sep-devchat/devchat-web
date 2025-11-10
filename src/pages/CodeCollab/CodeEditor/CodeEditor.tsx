import React from "react";
import { Play, Code2 } from "lucide-react";
import * as S from "./CodeEditor.styled";

interface CodeEditorProps {
	code: string;
	onChange?: (value: string) => void;
	readOnly?: boolean;
	title: string;
	showSave?: boolean;
	onSave?: () => void;
	hasChanges?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
	code,
	onChange,
	readOnly = false,
	title,
	showSave = false,
	onSave,
	hasChanges = false,
}) => {
	return (
		<S.Container>
			<S.Header>
				<S.HeaderLeft>
					<S.CodeIcon>
						<Code2 style={{ width: "100%", height: "100%" }} />
					</S.CodeIcon>
					<S.Title>{title}</S.Title>
					{showSave && hasChanges && (
						<S.UnsavedBadge>Unsaved changes</S.UnsavedBadge>
					)}
				</S.HeaderLeft>
				<S.HeaderRight>
					{showSave && (
						<S.SaveButton
							onClick={onSave}
							disabled={!hasChanges}
							$disabled={!hasChanges}
						>
							Save
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
