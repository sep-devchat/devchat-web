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
}) => {
	useEffect(() => {
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = "unset";
		};
	}, []);

	const isHalf = window.innerWidth <= 1220;

	const diffData = useMemo(() => {
		const origLines = original.split("\n");
		const modLines = modified.split("\n");

		const changedOriginalLines = new Set<number>();
		const changedModifiedLines = new Set<number>();

		const origContentLines = origLines
			.map((line, idx) => ({ line: line.trim(), idx }))
			.filter((item) => item.line !== "");

		const modContentLines = modLines
			.map((line, idx) => ({ line: line.trim(), idx }))
			.filter((item) => item.line !== "");

		const origContentSet = new Set(origContentLines.map((item) => item.line));
		const modContentSet = new Set(modContentLines.map((item) => item.line));

		let removedCount = 0;
		origContentLines.forEach((item) => {
			if (!modContentSet.has(item.line)) {
				changedOriginalLines.add(item.idx);
				removedCount++;
			}
		});

		let addedCount = 0;
		modContentLines.forEach((item) => {
			if (!origContentSet.has(item.line)) {
				changedModifiedLines.add(item.idx);
				addedCount++;
			}
		});

		const totalChanges = removedCount + addedCount;

		return {
			origLines,
			modLines,
			changedOriginalLines,
			changedModifiedLines,
			totalChanges,
		};
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
					<ResizablePanelGroup
						key={isHalf ? "vertical" : "horizontal"}
						direction={isHalf ? "vertical" : "horizontal"}
					>
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
										{diffData.origLines.map((line, i) => {
											const isChanged = diffData.changedOriginalLines.has(i);
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
										{diffData.modLines.map((line, i) => {
											const isChanged = diffData.changedModifiedLines.has(i);
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
							<span>{diffData.totalChanges}</span> change
							{diffData.totalChanges !== 1 ? "s" : ""}
						</S.DiffInfo>
					</S.FooterContent>
				</S.Footer>
			</S.ModalContent>
		</S.ModalOverlay>
	);
};
