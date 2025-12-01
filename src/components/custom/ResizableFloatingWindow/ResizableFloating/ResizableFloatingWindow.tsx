/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Rnd, type RndDragCallback, type RndResizeCallback } from "react-rnd";
import { ListTodo } from "lucide-react";
import {
	ContentArea,
	Controls,
	GroupTab,
	IconButton,
	LeftGroup,
	TabButton,
	TabsRow,
	Titlebar,
	TitleText,
	WindowRoot,
} from "./ResizableFloating.styled";

type Tab = { id: string; title: string; content: React.ReactNode };

type Props = {
	title?: string;
	initialWidth?: number;
	initialHeight?: number;
	minWidth?: number;
	onClose?: () => void;
	tabs?: Tab[];
	initialTabId?: string;
	onMinimize?: () => void;
};

export default function ResizableFloatingWindow({
	title = "Todo",
	initialWidth = 700,
	initialHeight = 420,
	minWidth = 320,
	onClose = () => {},
	tabs = [],
	initialTabId,
	onMinimize = () => {},
}: Props) {
	const titleBarHeight = 48;
	const rndRef = useRef<any>(null);
	const groupTabRef = useRef<HTMLDivElement | null>(null);

	const getInitialPos = () => {
		if (typeof window === "undefined") return { x: 10, y: 10 };
		return {
			x: Math.max((window.innerWidth - initialWidth) / 2, 10),
			y: Math.max((window.innerHeight - initialHeight) / 2, 10),
		};
	};

	const [size, setSize] = useState({
		width: initialWidth,
		height: initialHeight,
	});
	const [pos, setPos] = useState<{ x: number; y: number }>(getInitialPos);
	const [maximized, setMaximized] = useState(false);
	const [activeTab, setActiveTab] = useState<string | undefined>(
		initialTabId ?? (tabs[0] && tabs[0].id),
	);
	const lastRectRef = useRef({
		x: pos.x,
		y: pos.y,
		width: initialWidth,
		height: initialHeight,
	});

	useLayoutEffect(() => {
		if (typeof window === "undefined") return;
		const cx = Math.max((window.innerWidth - initialWidth) / 2, 10);
		const cy = Math.max((window.innerHeight - initialHeight) / 2, 10);
		setPos({ x: cx, y: cy });
		lastRectRef.current = {
			x: cx,
			y: cy,
			width: initialWidth,
			height: initialHeight,
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (initialTabId) setActiveTab(initialTabId);
	}, [initialTabId]);

	function handleMinimize() {
		onMinimize();
	}

	function handleMaximizeRestore() {
		if (!maximized) {
			lastRectRef.current = {
				x: pos.x,
				y: pos.y,
				width: size.width,
				height: size.height,
			};
			setPos({ x: 0, y: 0 });
			setSize({ width: window.innerWidth, height: window.innerHeight });
			setMaximized(true);
		} else {
			const r = lastRectRef.current;
			setPos({ x: r.x, y: r.y });
			setSize({ width: r.width, height: r.height });
			setMaximized(false);
		}
	}

	function handleClose() {
		onClose();
	}

	const activeTabObj = tabs.find((t) => t.id === activeTab) || tabs[0] || null;
	const personalTab = tabs.find((t) => t.id === "personal");
	const otherTabs = tabs.filter((t) => t.id !== "personal");

	// typed handlers so TS knows the shapes (no unused-parameter errors)
	const handleDragStop: RndDragCallback = (_e, d) => {
		setPos({ x: d.x, y: d.y });
	};

	const handleResizeStop: RndResizeCallback = (
		_e,
		_direction,
		ref,
		_delta,
		position,
	) => {
		// ref is the element being resized (HTMLElement)
		const w = Math.max((ref as HTMLElement).offsetWidth, minWidth);
		const h = Math.max((ref as HTMLElement).offsetHeight, titleBarHeight + 40);
		setSize({ width: w, height: h });
		setPos({ x: position.x, y: position.y });
	};

	const handleGroupTabWheel = (event: React.WheelEvent<HTMLDivElement>) => {
		if (!groupTabRef.current) return;
		if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
			return;
		}
		event.preventDefault();
		groupTabRef.current.scrollBy({ left: event.deltaY, behavior: "smooth" });
	};

	return (
		<Rnd
			ref={rndRef}
			size={{ width: size.width, height: size.height }}
			position={{ x: pos.x, y: pos.y }}
			onDragStop={handleDragStop}
			onResizeStop={handleResizeStop}
			bounds="window"
			minWidth={minWidth}
			minHeight={titleBarHeight + 40}
			enableResizing={!maximized}
			dragHandleClassName="window-titlebar"
			style={{ zIndex: 9999 }}
		>
			<WindowRoot role="dialog" aria-label={title}>
				<Titlebar
					className="window-titlebar"
					onDoubleClick={handleMaximizeRestore}
				>
					<LeftGroup>
						<ListTodo className="h-5 w-5" />
						<TitleText>{title}</TitleText>
					</LeftGroup>

					<Controls>
						<IconButton
							onClick={handleMinimize}
							title="Minimize"
							className="px-2 py-1 rounded bg-transparent hover:bg-slate-100"
						>
							—
						</IconButton>
						<IconButton
							onClick={handleMaximizeRestore}
							title={maximized ? "Restore" : "Maximize"}
							className="px-2 py-1 rounded bg-transparent hover:bg-slate-100"
						>
							{maximized ? "❐" : "▢"}
						</IconButton>
						<IconButton
							onClick={handleClose}
							title="Close"
							className="px-2 py-1 rounded bg-red-50 hover:bg-red-100 text-red-600"
						>
							✕
						</IconButton>
					</Controls>
				</Titlebar>

				<TabsRow
					aria-label="Todo Tabs"
					role="tablist"
					style={{ display: "flex", gap: 8, alignItems: "center" }}
				>
					{personalTab && (
						<div style={{ flex: "0 0 auto" }}>
							<TabButton
								key={personalTab.id}
								onClick={() => setActiveTab(personalTab.id)}
								selected={activeTab === personalTab.id}
								role="tab"
								aria-selected={activeTab === personalTab.id}
							>
								{personalTab.title}
							</TabButton>
						</div>
					)}

					<GroupTab
						aria-hidden={otherTabs.length === 0 ? true : undefined}
						onWheel={handleGroupTabWheel}
						ref={groupTabRef}
					>
						<div style={{ display: "flex", gap: 8 }}>
							{otherTabs.map((t) => (
								<TabButton
									key={t.id}
									onClick={() => setActiveTab(t.id)}
									selected={activeTab === t.id}
									role="tab"
									aria-selected={activeTab === t.id}
									style={{ flex: "0 0 auto" }}
								>
									{t.title}
								</TabButton>
							))}
						</div>
					</GroupTab>
				</TabsRow>

				<ContentArea>
					{activeTabObj ? (
						activeTabObj.content
					) : (
						<div style={{ color: "#475569" }}>No tab selected</div>
					)}
				</ContentArea>
			</WindowRoot>
		</Rnd>
	);
}
