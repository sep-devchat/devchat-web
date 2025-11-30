/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { MessageResponse } from "@/services/messageAPI";
import { formatMessageTime } from "./ChatArea.helpers";

type Props = {
	threadId: string;
	threadMeta: any;
	latestMessage: MessageResponse;
	onOpenThread?: (threadId: string) => void;
};

const ThreadPreview: React.FC<Props> = ({
	threadId,
	threadMeta,
	latestMessage,
	onOpenThread,
}) => {
	const creatorName = threadMeta?.createdBy ?? "Unknown";
	const threadTitle = threadMeta?.name || `Thread ${threadId.slice(0, 8)}`;

	const [windowWidth, setWindowWidth] = React.useState(
		typeof window !== "undefined" ? window.innerWidth : 1440,
	);

	React.useEffect(() => {
		const handleResize = () => setWindowWidth(window.innerWidth);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const getResponsiveSize = (base: number) => {
		if (windowWidth <= 1220) return base * 0.7;
		if (windowWidth >= 1920) return base * 1.1;
		if (windowWidth >= 1440) return base * 0.8;
		return base;
	};

	const getResponsiveFontSize = () => {
		if (windowWidth <= 1220) return "11px";
		if (windowWidth >= 1920) return "14px";
		if (windowWidth >= 1440) return "12px";
		return "14px";
	};

	const getHeaderFontSize = () => {
		if (windowWidth <= 1220) return "12px";
		if (windowWidth >= 1920) return "16px";
		if (windowWidth >= 1440) return "13px";
		return "14px";
	};

	const getTinyFontSize = () => {
		if (windowWidth <= 1220) return "10px";
		if (windowWidth >= 1920) return "12px";
		if (windowWidth >= 1440) return "11px";
		return "11px";
	};

	const shortPreview = (text?: string) => {
		if (!text) return "[Attachment]";
		if (/!\[.*?\]\(https?:\/\/[^\s)]+\)/.test(text.trim())) return "[Image]";
		const singleLine = text.replace(/\s+/g, " ").trim();
		return singleLine.length > 120
			? singleLine.slice(0, 117) + "…"
			: singleLine;
	};

	const handleOpen = () => onOpenThread?.(threadId);

	return (
		<div style={{ marginBottom: `${getResponsiveSize(12)}px` }}>
			<div
				className="flex items-center"
				style={{
					color: "rgba(17,24,39,0.6)",
					marginBottom: `${getResponsiveSize(8)}px`,
					gap: `${getResponsiveSize(8)}px`,
					fontSize: getResponsiveFontSize(),
				}}
			>
				<span
					className="font-medium"
					style={{
						color: "rgba(17,24,39,0.85)",
						fontSize: getHeaderFontSize(),
					}}
				>
					{creatorName}
				</span>
				<span>started a thread:</span>
				<button
					onClick={handleOpen}
					className="font-semibold text-sky-600 hover:underline"
					aria-label={`Open thread ${threadTitle}`}
					style={{
						background: "transparent",
						border: "none",
						padding: 0,
						fontSize: getHeaderFontSize(),
					}}
				>
					{threadTitle}
				</button>
				<span
					className="ml-auto text-muted-foreground"
					style={{ fontSize: getResponsiveFontSize() }}
				>
					{formatMessageTime(latestMessage.createdAt)}
				</span>
			</div>

			<div
				role="button"
				onClick={handleOpen}
				className="rounded-lg border border-slate-200 bg-[#F1F4F9] cursor-pointer hover:shadow-sm transition-shadow"
				style={{
					boxShadow: "inset 0 0 0 1px rgba(59,130,246,0.03)",
					padding: `${getResponsiveSize(12)}px`,
					borderRadius: `${getResponsiveSize(8)}px`,
				}}
			>
				<div
					className="flex items-start justify-between"
					style={{ gap: `${getResponsiveSize(12)}px` }}
				>
					<div
						className="flex items-start"
						style={{ gap: `${getResponsiveSize(12)}px` }}
					>
						<div className="min-w-0">
							<div
								className="flex items-center"
								style={{ gap: `${getResponsiveSize(8)}px` }}
							>
								<div
									className="font-semibold text-slate-800 truncate"
									style={{ fontSize: getHeaderFontSize() }}
								>
									{threadTitle}
								</div>
							</div>
							<div
								className="text-slate-600 flex items-start min-w-0"
								style={{
									marginTop: `${getResponsiveSize(4)}px`,
									gap: `${getResponsiveSize(8)}px`,
									fontSize: getHeaderFontSize(),
								}}
							>
								<div
									className="flex-shrink-0 rounded-full bg-slate-100 flex items-center justify-center text-slate-700"
									style={{
										width: `${getResponsiveSize(20)}px`,
										height: `${getResponsiveSize(20)}px`,
										fontSize: getTinyFontSize(),
									}}
								>
									{latestMessage.sender?.firstName?.[0] ??
										latestMessage.sender?.username?.[0] ??
										"U"}
								</div>
								<div className="min-w-0">
									<div
										className="text-slate-700"
										style={{ fontSize: getResponsiveFontSize() }}
									>
										<span
											className="font-medium"
											style={{ marginRight: `${getResponsiveSize(4)}px` }}
										>
											{`${latestMessage.sender?.firstName || latestMessage.sender?.username || "Unknown"}:`}
										</span>
										<span className="text-slate-600">
											{shortPreview(latestMessage.content)}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ThreadPreview;
