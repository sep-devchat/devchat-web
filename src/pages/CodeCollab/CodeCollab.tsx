import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function CodeCollab() {
	return (
		<div className="w-full">
			{/* Top header (mock) */}
			<div className="mb-3 flex items-center justify-between">
				<h2 className="text-lg font-semibold tracking-tight">
					Code Collaboration
				</h2>
				<div className="text-sm text-muted-foreground">Mock layout</div>
			</div>

			{/* Main grid via resizable panels */}
			<ResizablePanelGroup
				direction="horizontal"
				className="h-[75vh] rounded border border-border bg-card text-card-foreground"
			>
				{/* Left: Chat */}
				<ResizablePanel
					defaultSize={22}
					minSize={16}
					maxSize={40}
					className="min-w-[200px]"
				>
					<div className="h-full grid grid-rows-[auto_1fr]">
						<div className="border-b border-border px-3 py-2 font-medium">
							Chat
						</div>
						<div className="p-3 space-y-3 overflow-auto">
							<div className="rounded-md border border-dashed p-3 text-sm">
								Messages
							</div>
							<div className="rounded-md border border-dashed p-3 text-sm">
								Composer / Tools
							</div>
						</div>
					</div>
				</ResizablePanel>

				<ResizableHandle />

				{/* Center: Editor area with vertical split */}
				<ResizablePanel defaultSize={56} minSize={30}>
					<div className="h-full">
						<ResizablePanelGroup direction="vertical" className="h-full">
							<ResizablePanel defaultSize={70} minSize={40}>
								<div className="h-full grid grid-rows-[auto_1fr]">
									<div className="border-b border-border px-3 py-2 font-medium">
										Editor
									</div>
									<div className="p-3 h-full">
										<div className="h-full rounded-md border border-dashed p-3 text-sm">
											Monaco editor placeholder
										</div>
									</div>
								</div>
							</ResizablePanel>
							<ResizableHandle />
							<ResizablePanel defaultSize={30} minSize={20}>
								<div className="h-full grid grid-rows-[auto_1fr]">
									<div className="border-t border-b border-border px-3 py-2 font-medium">
										Console / Output
									</div>
									<div className="p-3 h-full">
										<div className="h-full rounded-md border border-dashed p-3 text-sm">
											Run results / logs
										</div>
									</div>
								</div>
							</ResizablePanel>
						</ResizablePanelGroup>
					</div>
				</ResizablePanel>

				<ResizableHandle />

				{/* Right: Code Change History */}
				<ResizablePanel
					defaultSize={22}
					minSize={16}
					maxSize={40}
					className="min-w-[220px]"
				>
					<div className="h-full grid grid-rows-[auto_1fr]">
						<div className="border-b border-border px-3 py-2 font-medium">
							Change History
						</div>
						<div className="p-3 space-y-3 overflow-auto">
							<div className="rounded-md border border-dashed p-3 text-sm">
								Commits / Timeline
							</div>
							<div className="rounded-md border border-dashed p-3 text-sm">
								Diff Preview
							</div>
						</div>
					</div>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}
