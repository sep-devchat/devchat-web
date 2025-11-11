import React, { useMemo, useEffect } from "react";
import { X, Play, GitCompare } from "lucide-react";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import * as S from "./DiffViewer.styled";

interface DiffViewerProps {
	original: string;
	modified: string;
	onClose: () => void;
	userName: string;
	onLoadVersion?: () => void;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({
	original,
	modified,
	onClose,
	userName,
	onLoadVersion,
}) => {
	useEffect(() => {
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = "unset";
		};
	}, []);

	const getDiff = useMemo(() => {
		const origLines = original.split("\n");
		const modLines = modified.split("\n");
		const maxLen = Math.max(origLines.length, modLines.length);

		const diff: Array<{
			lineNum: number;
			original: string;
			modified: string;
			type: "added" | "removed" | "changed";
		}> = [];

		for (let i = 0; i < maxLen; i++) {
			const origLine = origLines[i] || "";
			const modLine = modLines[i] || "";

			if (origLine !== modLine) {
				diff.push({
					lineNum: i + 1,
					original: origLine,
					modified: modLine,
					type: !origLine ? "added" : !modLine ? "removed" : "changed",
				});
			}
		}
		return diff;
	}, [original, modified]);

	return (
		<S.ModalOverlay>
			<S.ModalBackdrop onClick={onClose} />

			<S.ModalContent>
				<S.Header>
					<S.HeaderLeft>
						<S.CompareIcon>
							<GitCompare style={{ width: "100%", height: "100%" }} />
						</S.CompareIcon>
						<S.HeaderInfo>
							<S.HeaderTitle>Code Comparison</S.HeaderTitle>
							<S.HeaderSubtitle>{userName}</S.HeaderSubtitle>
						</S.HeaderInfo>
					</S.HeaderLeft>
					<S.CloseButton onClick={onClose}>
						<X style={{ width: "1.25rem", height: "1.25rem" }} />
					</S.CloseButton>
				</S.Header>

				<div className="flex-1 overflow-hidden">
					<ResizablePanelGroup direction="horizontal">
						<ResizablePanel defaultSize={50} minSize={30}>
							<div className="h-full flex flex-col bg-slate-950">
								<div className="flex items-center justify-between px-4 py-3 border-b border-red-500/30 bg-red-950/20 flex-shrink-0">
									<span className="text-sm font-semibold text-red-400">
										Original Code
									</span>
									<S.RunButton>
										<Play style={{ width: "0.875rem", height: "0.875rem" }} />
										Run
									</S.RunButton>
								</div>
								<div className="flex-1 overflow-y-auto">
									<S.CodePre>
										{original.split("\n").map((line, i) => {
											const diffLine = getDiff.find((d) => d.lineNum === i + 1);
											const isChanged =
												diffLine &&
												(diffLine.type === "changed" ||
													diffLine.type === "removed");
											return (
												<div
													key={i}
													className={`${isChanged ? "bg-red-500/10 border-l-2 border-red-500 pl-2 -ml-2" : ""}`}
												>
													<span className="inline-block w-10 text-right mr-4 text-slate-500 select-none">
														{i + 1}
													</span>
													{line || " "}
												</div>
											);
										})}
									</S.CodePre>
								</div>
							</div>
						</ResizablePanel>

						<ResizableHandle />

						<ResizablePanel defaultSize={50} minSize={30}>
							<div className="h-full flex flex-col bg-slate-950">
								<div className="flex items-center justify-between px-4 py-3 border-b border-green-500/30 bg-green-950/20 flex-shrink-0">
									<span className="text-sm font-semibold text-green-400">
										Modified Code
									</span>
									<S.RunButton>
										<Play style={{ width: "0.875rem", height: "0.875rem" }} />
										Run
									</S.RunButton>
								</div>
								<div className="flex-1 overflow-y-auto">
									<S.CodePre>
										{modified.split("\n").map((line, i) => {
											const diffLine = getDiff.find((d) => d.lineNum === i + 1);
											const isChanged =
												diffLine &&
												(diffLine.type === "changed" ||
													diffLine.type === "added");
											return (
												<div
													key={i}
													className={`${isChanged ? "bg-green-500/10 border-l-2 border-green-500 pl-2 -ml-2" : ""}`}
												>
													<span className="inline-block w-10 text-right mr-4 text-slate-500 select-none">
														{i + 1}
													</span>
													{line || " "}
												</div>
											);
										})}
									</S.CodePre>
								</div>
							</div>
						</ResizablePanel>
					</ResizablePanelGroup>
				</div>

				<S.Footer>
					<S.FooterContent>
						<S.DiffInfo>
							<span>{getDiff.length}</span> line(s) changed
						</S.DiffInfo>
						{onLoadVersion && (
							<S.LoadButton onClick={onLoadVersion}>
								Load & Continue Editing
							</S.LoadButton>
						)}
					</S.FooterContent>
				</S.Footer>
			</S.ModalContent>
		</S.ModalOverlay>
	);
};
